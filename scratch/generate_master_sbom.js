const fs = require("fs");
const path = require("path");

const modules = [
    { name: "api-gateway", type: "application", purl: "pkg:maven/in.gov.lgd/api-gateway@1.0.0", bomPath: "api-gateway/target/bom.json" },
    { name: "auth-service", type: "application", purl: "pkg:maven/in.nic.lgd/auth-service@0.0.1-SNAPSHOT", bomPath: "auth-service/target/bom.json" },
    { name: "discovery", type: "application", purl: "pkg:maven/in.nic.servicediscovery.egra/service-discovery@0.0.1-SNAPSHOT", bomPath: "discovery/target/bom.json" },
    { name: "revenue", type: "application", purl: "pkg:maven/in.nic.lgd/revenue@0.0.1-SNAPSHOT", bomPath: "revenue/target/bom.json" },
    { name: "user-management", type: "application", purl: "pkg:maven/in.nic.lgd/user-management@0.0.1-SNAPSHOT", bomPath: "user-management/target/bom.json" },
    { name: "lgd_react", type: "application", purl: "pkg:npm/lgd_react@0.0.0", bomPath: "lgd_react/bom.json" },
    { name: "lgd-um", type: "application", purl: "pkg:npm/lgd-um@1.0.0", bomPath: "lgd-um/bom.json" }
];

const dedupedComponents = new Map();
const moduleStats = {};

for (const mod of modules) {
    if (!fs.existsSync(mod.bomPath)) {
        console.error(`BOM not found: ${mod.bomPath}`);
        continue;
    }
    const data = JSON.parse(fs.readFileSync(mod.bomPath, "utf8"));
    const comps = data.components || [];
    moduleStats[mod.name] = comps.length;

    for (const c of comps) {
        const key = `${c.group || ""}:${c.name}:${c.version}`;
        if (!dedupedComponents.has(key)) {
            const compCopy = { ...c };
            compCopy.properties = compCopy.properties || [];
            compCopy.properties.push({
                name: "lgd:discoveredInModule",
                value: mod.name
            });
            dedupedComponents.set(key, compCopy);
        } else {
            const existing = dedupedComponents.get(key);
            existing.properties = existing.properties || [];
            existing.properties.push({
                name: "lgd:discoveredInModule",
                value: mod.name
            });
        }
    }
}

const masterSBOM = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: "urn:uuid:lgd20-enterprise-sbom-phase4-20261030",
    version: 1,
    metadata: {
        timestamp: new Date().toISOString(),
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
            type: "platform",
            name: "Local Government Directory 2.0 (LGD 2.0)",
            version: "2.0.0",
            description: "Enterprise Software Bill of Materials for LGD 2.0 Platform (Backend Microservices & Frontend React Single-Page Applications)",
            components: modules.map(m => ({
                type: m.type,
                name: m.name,
                purl: m.purl
            }))
        }
    },
    components: Array.from(dedupedComponents.values())
};

fs.writeFileSync("SOFTWARE_BILL_OF_MATERIALS.json", JSON.stringify(masterSBOM, null, 2));

console.log("Master SBOM generated successfully: SOFTWARE_BILL_OF_MATERIALS.json");
console.log(`Total unique components: ${dedupedComponents.size}`);
console.log("Module component breakdown:", moduleStats);
