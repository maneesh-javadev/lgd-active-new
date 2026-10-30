const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const moduleConfigs = [
    { name: "api-gateway", type: "application", purl: "pkg:maven/in.gov.lgd/api-gateway@1.0.0", bomPath: "api-gateway/target/bom.json" },
    { name: "auth-service", type: "application", purl: "pkg:maven/in.nic.lgd/auth-service@0.0.1-SNAPSHOT", bomPath: "auth-service/target/bom.json" },
    { name: "discovery", type: "application", purl: "pkg:maven/in.nic.servicediscovery.egra/service-discovery@0.0.1-SNAPSHOT", bomPath: "discovery/target/bom.json" },
    { name: "revenue", type: "application", purl: "pkg:maven/in.nic.lgd/revenue@0.0.1-SNAPSHOT", bomPath: "revenue/target/bom.json" },
    { name: "user-management", type: "application", purl: "pkg:maven/in.nic.lgd/user-management@0.0.1-SNAPSHOT", bomPath: "user-management/target/bom.json" },
    { name: "lgd_react", type: "application", purl: "pkg:npm/lgd_react@0.0.0", bomPath: "lgd_react/bom.json" },
    { name: "lgd-um", type: "application", purl: "pkg:npm/lgd-um@0.0.0", bomPath: "lgd-um/bom.json" }
];

console.log("=== STEP 1: LOADING & VALIDATING MODULE BOMS ===");

let totalInstances = 0;
const uniqueComponentsMap = new Map(); // key -> component
const moduleComponentsMap = new Map();
const allDependenciesMap = new Map(); // ref -> Set of dependsOn
const rootPlatformRef = "urn:uuid:lgd20-enterprise-platform-2.0.0";

const platformDependsOn = [];

// Track licenses
let totalLicenseAttributions = 0;
const licenseCounts = new Map();
const multiLicenseComponents = [];
const noLicenseComponents = [];

for (const mod of moduleConfigs) {
    if (!fs.existsSync(mod.bomPath)) {
        throw new Error(`Missing BOM for module: ${mod.name} at ${mod.bomPath}`);
    }
    const data = JSON.parse(fs.readFileSync(mod.bomPath, "utf8"));
    const comps = data.components || [];
    const deps = data.dependencies || [];
    moduleComponentsMap.set(mod.name, comps);
    totalInstances += comps.length;
    console.log(`[${mod.name}] ${comps.length} components, ${deps.length} dependency records`);

    // Add module root ref to platform dependencies
    platformDependsOn.push(mod.purl);

    // Merge components
    for (const comp of comps) {
        const compKey = `${comp.group || ""}:${comp.name}:${comp.version}`;
        const bomRef = comp["bom-ref"] || comp.purl || compKey;

        // Count licenses for this instance
        const lics = comp.licenses || [];
        if (lics.length === 0) {
            licenseCounts.set("No License Declared", (licenseCounts.get("No License Declared") || 0) + 1);
            totalLicenseAttributions += 1;
            if (!noLicenseComponents.some(c => c.key === compKey)) {
                noLicenseComponents.push({ key: compKey, module: mod.name, purl: comp.purl });
            }
        } else {
            if (lics.length > 1) {
                multiLicenseComponents.push({ key: compKey, module: mod.name, licenses: lics.length });
            }
            for (const lic of lics) {
                totalLicenseAttributions += 1;
                const licId = (lic.license && (lic.license.id || lic.license.name)) || lic.expression || "Unknown";
                licenseCounts.set(licId, (licenseCounts.get(licId) || 0) + 1);
            }
        }

        if (!uniqueComponentsMap.has(compKey)) {
            // Clone component
            const newComp = JSON.parse(JSON.stringify(comp));
            newComp["bom-ref"] = bomRef;
            if (!newComp.properties) newComp.properties = [];
            newComp.properties.push({ name: "lgd:discoveredInModule", value: mod.name });
            uniqueComponentsMap.set(compKey, newComp);
        } else {
            const existing = uniqueComponentsMap.get(compKey);
            if (!existing.properties) existing.properties = [];
            if (!existing.properties.some(p => p.name === "lgd:discoveredInModule" && p.value === mod.name)) {
                existing.properties.push({ name: "lgd:discoveredInModule", value: mod.name });
            }
        }
    }

    // Merge dependencies
    for (const dep of deps) {
        const ref = dep.ref;
        if (!allDependenciesMap.has(ref)) {
            allDependenciesMap.set(ref, new Set());
        }
        const set = allDependenciesMap.get(ref);
        if (dep.dependsOn) {
            for (const target of dep.dependsOn) {
                set.add(target);
            }
        }
    }
}

console.log("\n=== STEP 2: SUMMARY COUNTS ===");
console.log(`Total Component Instances across 7 modules: ${totalInstances}`);
console.log(`Deduplicated Unique Components: ${uniqueComponentsMap.size}`);
console.log(`Total Dependency Graph Nodes: ${allDependenciesMap.size}`);
console.log(`Total License Attributions across Instances: ${totalLicenseAttributions}`);

// Prepare final dependency array
// Include platform root and module applications
const finalDependencies = [
    {
        ref: rootPlatformRef,
        dependsOn: platformDependsOn
    }
];

for (const [ref, dependsSet] of allDependenciesMap.entries()) {
    finalDependencies.push({
        ref: ref,
        dependsOn: Array.from(dependsSet)
    });
}

// Assemble final CycloneDX 1.5 JSON
const finalSbom = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: "urn:uuid:lgd20-enterprise-sbom-phase4-20261030",
    version: 1,
    metadata: {
        timestamp: "2026-10-30T11:45:00.000Z",
        tools: [
            {
                vendor: "CycloneDX",
                name: "cyclonedx-maven-plugin",
                version: "2.8.1"
            },
            {
                vendor: "CycloneDX",
                name: "cyclonedx-npm",
                version: "1.19.4"
            }
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
    components: Array.from(uniqueComponentsMap.values()),
    dependencies: finalDependencies
};

const sbomFilePath = path.resolve("SOFTWARE_BILL_OF_MATERIALS.json");
const jsonString = JSON.stringify(finalSbom, null, 2);
fs.writeFileSync(sbomFilePath, jsonString, "utf8");

// Calculate SHA-256
const hash = crypto.createHash("sha256").update(fs.readFileSync(sbomFilePath)).digest("hex");
console.log(`\n=== STEP 3: SBOM WRITTEN SUCCESSFULLY ===`);
console.log(`File: ${sbomFilePath}`);
console.log(`Total Components: ${finalSbom.components.length}`);
console.log(`Total Dependencies: ${finalSbom.dependencies.length}`);
console.log(`New SHA-256 Digest: ${hash}`);

// Save license analysis output
const licenseReportData = {
    totalInstances,
    uniqueComponents: uniqueComponentsMap.size,
    totalLicenseAttributions,
    licenseDistribution: Array.from(licenseCounts.entries()).map(([spdx, count]) => ({ spdx, count })),
    multiLicenseCount: multiLicenseComponents.length,
    noLicenseComponents
};
fs.writeFileSync("scratch/license_analysis_data.json", JSON.stringify(licenseReportData, null, 2));
console.log("Saved license analysis data to scratch/license_analysis_data.json");
