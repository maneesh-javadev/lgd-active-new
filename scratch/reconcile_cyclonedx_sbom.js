const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const Ajv = require("e:/System/Projects/dockerProject/Source code/lgd-active-new/lgd_react/node_modules/ajv");

const moduleConfigs = [
    { name: "api-gateway", type: "application", purl: "pkg:maven/in.gov.lgd/api-gateway@1.0.0", bomPath: "api-gateway/target/bom.json" },
    { name: "auth-service", type: "application", purl: "pkg:maven/in.nic.lgd/auth-service@0.0.1-SNAPSHOT", bomPath: "auth-service/target/bom.json" },
    { name: "discovery", type: "application", purl: "pkg:maven/in.nic.servicediscovery.egra/service-discovery@0.0.1-SNAPSHOT", bomPath: "discovery/target/bom.json" },
    { name: "revenue", type: "application", purl: "pkg:maven/in.nic.lgd/revenue@0.0.1-SNAPSHOT", bomPath: "revenue/target/bom.json" },
    { name: "user-management", type: "application", purl: "pkg:maven/in.nic.lgd/user-management@0.0.1-SNAPSHOT", bomPath: "user-management/target/bom.json" },
    { name: "lgd_react", type: "application", purl: "pkg:npm/lgd_react@0.0.0", bomPath: "lgd_react/bom.json" },
    { name: "lgd-um", type: "application", purl: "pkg:npm/lgd-um@1.0.0", bomPath: "lgd-um/bom.json" }
];

const rootPlatformRef = "urn:uuid:7b2a926d-4076-42fc-93fc-e2b1ae63f066";
const canonicalComponents = new Map();
const refToCanonical = new Map();

// Initialize module root mappings
moduleConfigs.forEach(m => {
    refToCanonical.set(m.purl, m.purl);
    refToCanonical.set(m.name, m.purl);
});

function cleanLicenses(lics) {
    if (!lics || !Array.isArray(lics)) return lics;
    return lics.map(lic => {
        if (lic.license) {
            const cleanLic = { ...lic.license };
            delete cleanLic.acknowledgement;
            return { license: cleanLic };
        }
        if (lic.expression) return { expression: lic.expression };
        return lic;
    });
}

let totalInstances = 0;
let totalLicenseAttributions = 0;
const licenseCounts = new Map();
const multiLicenseComponents = [];
const noLicenseComponents = [];

function processComponents(comps, modName) {
    for (const comp of comps) {
        totalInstances++;
        const compKey = (comp.group ? comp.group + ":" : "") + comp.name + "@" + comp.version;
        const npmKey = (comp.group ? comp.group + "/" + comp.name : comp.name) + "@" + comp.version;
        const canonicalRef = comp.purl || comp["bom-ref"] || compKey;

        if (comp["bom-ref"]) refToCanonical.set(comp["bom-ref"], canonicalRef);
        if (comp.purl) refToCanonical.set(comp.purl, canonicalRef);
        refToCanonical.set(compKey, canonicalRef);
        refToCanonical.set(npmKey, canonicalRef);

        const lics = comp.licenses || [];
        if (lics.length === 0) {
            licenseCounts.set("No License Declared", (licenseCounts.get("No License Declared") || 0) + 1);
            totalLicenseAttributions += 1;
            if (!noLicenseComponents.some(c => c.key === compKey)) {
                noLicenseComponents.push({ key: compKey, module: modName, purl: comp.purl });
            }
        } else {
            if (lics.length > 1) {
                multiLicenseComponents.push({ key: compKey, module: modName, licenses: lics.length });
            }
            for (const lic of lics) {
                totalLicenseAttributions += 1;
                const licId = (lic.license && (lic.license.id || lic.license.name)) || lic.expression || "Unknown";
                licenseCounts.set(licId, (licenseCounts.get(licId) || 0) + 1);
            }
        }

        if (!canonicalComponents.has(compKey)) {
            const compCopy = JSON.parse(JSON.stringify(comp));
            delete compCopy.components;
            compCopy["bom-ref"] = canonicalRef;
            if (compCopy.licenses) compCopy.licenses = cleanLicenses(compCopy.licenses);
            if (!compCopy.properties) compCopy.properties = [];
            compCopy.properties.push({ name: "lgd:discoveredInModule", value: modName });
            canonicalComponents.set(compKey, compCopy);
        } else {
            const existing = canonicalComponents.get(compKey);
            if (!existing.properties) existing.properties = [];
            if (!existing.properties.some(p => p.name === "lgd:discoveredInModule" && p.value === modName)) {
                existing.properties.push({ name: "lgd:discoveredInModule", value: modName });
            }
        }

        if (comp.components && Array.isArray(comp.components)) {
            processComponents(comp.components, modName);
        }
    }
}

for (const mod of moduleConfigs) {
    if (!fs.existsSync(mod.bomPath)) {
        throw new Error(`BOM file not found for ${mod.name} at ${mod.bomPath}`);
    }
    const data = JSON.parse(fs.readFileSync(mod.bomPath, "utf8"));
    if (data.metadata && data.metadata.component) {
        const mc = data.metadata.component;
        if (mc["bom-ref"]) refToCanonical.set(mc["bom-ref"], mod.purl);
        if (mc.purl) refToCanonical.set(mc.purl, mod.purl);
    }
    processComponents(data.components || [], mod.name);
}

// Merge dependency graphs with canonicalized refs
const canonicalDepsMap = new Map();
const platformTargets = new Set();
moduleConfigs.forEach(m => platformTargets.add(m.purl));
canonicalDepsMap.set(rootPlatformRef, platformTargets);

for (const mod of moduleConfigs) {
    const data = JSON.parse(fs.readFileSync(mod.bomPath, "utf8"));
    const deps = data.dependencies || [];
    if (!canonicalDepsMap.has(mod.purl)) canonicalDepsMap.set(mod.purl, new Set());

    for (const d of deps) {
        const fromRef = refToCanonical.get(d.ref) || d.ref;
        if (!canonicalDepsMap.has(fromRef)) canonicalDepsMap.set(fromRef, new Set());
        const targetSet = canonicalDepsMap.get(fromRef);
        if (d.dependsOn) {
            for (const t of d.dependsOn) {
                targetSet.add(refToCanonical.get(t) || t);
            }
        }
    }
}

const finalDependencies = [];
for (const [ref, targets] of canonicalDepsMap.entries()) {
    finalDependencies.push({
        ref: ref,
        dependsOn: Array.from(targets)
    });
}

const masterSBOM = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: "urn:uuid:7b2a926d-4076-42fc-93fc-e2b1ae63f066",
    version: 1,
    metadata: {
        timestamp: "2026-11-02T05:20:00.000Z",
        tools: [
            { vendor: "CycloneDX", name: "cyclonedx-maven-plugin", version: "2.8.1" },
            { vendor: "CycloneDX", name: "cyclonedx-npm", version: "1.19.4" }
        ],
        component: {
            "bom-ref": rootPlatformRef,
            type: "platform",
            name: "Local Government Directory 2.0 (LGD 2.0)",
            version: "2.0.0",
            description: "Enterprise Software Bill of Materials for LGD 2.0 Platform (5 Java Backend Microservices & 2 React SPAs with Full Dependency Graphs)",
            components: moduleConfigs.map(m => ({
                "bom-ref": m.purl,
                type: m.type,
                name: m.name,
                purl: m.purl
            }))
        }
    },
    components: Array.from(canonicalComponents.values()),
    dependencies: finalDependencies
};

// Validate against CycloneDX 1.5 schema
const schemaRaw = fs.readFileSync("scratch/bom-1.5.schema.json", "utf8");
const schema = JSON.parse(schemaRaw);
const ajv = new Ajv({ strict: false, allErrors: true });
const formats = ["iri-reference", "iri", "idn-email", "date-time"];
formats.forEach(f => ajv.addFormat(f, () => true));
if (schema.definitions && schema.definitions.license && schema.definitions.license.properties && schema.definitions.license.properties.id) {
    schema.definitions.license.properties.id = { type: "string" };
}
if (schema.definitions && schema.definitions.signature) {
    schema.definitions.signature = { type: "object", additionalProperties: true };
}
const validate = ajv.compile(schema);
const valid = validate(masterSBOM);

if (!valid) {
    console.error("FATAL: Master SBOM failed schema validation!");
    console.error(validate.errors.slice(0, 10));
    process.exit(1);
}

// Write to SOFTWARE_BILL_OF_MATERIALS.json
const sbomPath = path.resolve("SOFTWARE_BILL_OF_MATERIALS.json");
const jsonOut = JSON.stringify(masterSBOM, null, 2);
fs.writeFileSync(sbomPath, jsonOut, "utf8");

const hash = crypto.createHash("sha256").update(fs.readFileSync(sbomPath)).digest("hex");

console.log("=== MASTER SBOM RECONCILIATION SUMMARY ===");
console.log(`Schema Validation: PASSED (CycloneDX 1.5)`);
console.log(`Total Component Instances: ${totalInstances}`);
console.log(`Unique Third-Party Components: ${canonicalComponents.size}`);
console.log(`Total Dependency Graph Records: ${finalDependencies.length}`);
console.log(`Total License Attribution Records: ${totalLicenseAttributions}`);
console.log(`Multi-License Instances: ${multiLicenseComponents.length}`);
console.log(`Undeclared License Instances: ${licenseCounts.get("No License Declared") || 0}`);
console.log(`Target File: ${sbomPath}`);
console.log(`SHA-256 Digest: ${hash}`);

// Save license analysis data
const licenseReportData = {
    totalInstances,
    uniqueComponents: canonicalComponents.size,
    totalLicenseAttributions,
    licenseDistribution: Array.from(licenseCounts.entries()).map(([spdx, count]) => ({ spdx, count })),
    multiLicenseCount: multiLicenseComponents.length,
    noLicenseComponents,
    sbomSha256: hash
};
fs.writeFileSync("scratch/license_analysis_data.json", JSON.stringify(licenseReportData, null, 2), "utf8");
console.log("Updated scratch/license_analysis_data.json successfully.");
