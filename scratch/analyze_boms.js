const fs = require("fs");

const modules = [
    { name: "api-gateway", bom: "api-gateway/target/bom.json" },
    { name: "auth-service", bom: "auth-service/target/bom.json" },
    { name: "discovery", bom: "discovery/target/bom.json" },
    { name: "revenue", bom: "revenue/target/bom.json" },
    { name: "user-management", bom: "user-management/target/bom.json" },
    { name: "lgd_react", bom: "lgd_react/bom.json" },
    { name: "lgd-um", bom: "lgd-um/bom.json" }
];

console.log("=== INDIVIDUAL MODULE BOM INSPECTION ===");
for (const m of modules) {
    if (!fs.existsSync(m.bom)) {
        console.log(`${m.name}: FILE NOT FOUND`);
        continue;
    }
    const data = JSON.parse(fs.readFileSync(m.bom, "utf8"));
    const compCount = (data.components || []).length;
    const depCount = (data.dependencies || []).length;
    console.log(`${m.name}: ${compCount} components, ${depCount} dependency graph nodes`);
}

// Inspect current root SOFTWARE_BILL_OF_MATERIALS.json
if (fs.existsSync("SOFTWARE_BILL_OF_MATERIALS.json")) {
    const rootData = JSON.parse(fs.readFileSync("SOFTWARE_BILL_OF_MATERIALS.json", "utf8"));
    console.log(`\nRoot SOFTWARE_BILL_OF_MATERIALS.json:`);
    console.log(`- specVersion: ${rootData.specVersion}`);
    console.log(`- top-level components: ${(rootData.components || []).length}`);
    console.log(`- top-level dependencies: ${(rootData.dependencies || []).length}`);
    console.log(`- metadata.component.components: ${rootData.metadata && rootData.metadata.component && rootData.metadata.component.components ? rootData.metadata.component.components.length : 0}`);
}
