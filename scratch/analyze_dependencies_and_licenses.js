const fs = require("fs");
const path = require("path");

const modules = [
    { name: "api-gateway", type: "maven", bomPath: "api-gateway/target/bom.json", treePath: "api-gateway/target/dependency-tree.txt" },
    { name: "auth-service", type: "maven", bomPath: "auth-service/target/bom.json", treePath: "auth-service/target/dependency-tree.txt" },
    { name: "discovery", type: "maven", bomPath: "discovery/target/bom.json", treePath: "discovery/target/dependency-tree.txt" },
    { name: "revenue", type: "maven", bomPath: "revenue/target/bom.json", treePath: "revenue/target/dependency-tree.txt" },
    { name: "user-management", type: "maven", bomPath: "user-management/target/bom.json", treePath: "user-management/target/dependency-tree.txt" },
    { name: "lgd_react", type: "npm", bomPath: "lgd_react/bom.json" },
    { name: "lgd-um", type: "npm", bomPath: "lgd-um/bom.json" }
];

const allComponents = new Map();
const moduleComponentMap = new Map();
const licenseCounts = new Map();
let totalEntries = 0;

for (const mod of modules) {
    if (!fs.existsSync(mod.bomPath)) {
        console.error(`BOM not found: ${mod.bomPath}`);
        continue;
    }
    const bom = JSON.parse(fs.readFileSync(mod.bomPath, "utf8"));
    const comps = bom.components || [];
    moduleComponentMap.set(mod.name, comps);
    totalEntries += comps.length;

    for (const c of comps) {
        const key = `${c.group || ""}:${c.name}:${c.version}`;
        if (!allComponents.has(key)) {
            allComponents.set(key, {
                group: c.group || "",
                name: c.name,
                version: c.version,
                purl: c.purl,
                type: c.type,
                licenses: c.licenses || [],
                modules: [mod.name]
            });
        } else {
            allComponents.get(key).modules.push(mod.name);
        }

        // License tracking
        if (c.licenses && c.licenses.length > 0) {
            for (const lic of c.licenses) {
                const licId = (lic.license && (lic.license.id || lic.license.name)) || (lic.expression) || "Unknown";
                licenseCounts.set(licId, (licenseCounts.get(licId) || 0) + 1);
            }
        } else {
            licenseCounts.set("No License Declared", (licenseCounts.get("No License Declared") || 0) + 1);
        }
    }
}

console.log("=== SBOM INVENTORY SUMMARY ===");
console.log(`Total component instances across 7 modules: ${totalEntries}`);
console.log(`Deduplicated unique components (group:name:version): ${allComponents.size}`);
for (const [mod, comps] of moduleComponentMap.entries()) {
    console.log(`  - ${mod}: ${comps.length} components`);
}

console.log("\n=== LICENSE DISTRIBUTION ===");
const sortedLicenses = [...licenseCounts.entries()].sort((a, b) => b[1] - a[1]);
for (const [lic, count] of sortedLicenses) {
    console.log(`  - ${lic}: ${count}`);
}

// Check for copyleft / restricted licenses
const copyleftAlerts = [];
for (const [key, comp] of allComponents.entries()) {
    for (const lic of comp.licenses) {
        const licId = ((lic.license && (lic.license.id || lic.license.name)) || lic.expression || "").toUpperCase();
        if (licId.includes("GPL") || licId.includes("AGPL") || licId.includes("LGPL") || licId.includes("MPL") || licId.includes("EPL") || licId.includes("CDDL")) {
            copyleftAlerts.push({ key, licId, modules: comp.modules });
        }
    }
}
console.log(`\n=== COPYLEFT / WEAK-COPYLEFT / DUAL-LICENSED PACKAGES (${copyleftAlerts.length}) ===`);
copyleftAlerts.slice(0, 20).forEach(a => console.log(`  [${a.licId}] ${a.key} in ${a.modules.join(", ")}`));

// Save inventory data to scratch
fs.writeFileSync("scratch/deduped_components.json", JSON.stringify([...allComponents.values()], null, 2));
console.log("\nSaved deduplicated components to scratch/deduped_components.json");
