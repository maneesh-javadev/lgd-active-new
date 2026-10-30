const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputDir = path.resolve(__dirname, "trivy_results");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const mavenModules = [
    { name: "api-gateway", relPom: "api-gateway/pom.xml" },
    { name: "auth-service", relPom: "auth-service/pom.xml" },
    { name: "discovery", relPom: "discovery/pom.xml" },
    { name: "revenue", relPom: "revenue/pom.xml" },
    { name: "user-management", relPom: "user-management/pom.xml" }
];

const results = [];
console.log("=== STARTING TRIVY MAVEN POM SCANS ===");

for (const mod of mavenModules) {
    console.log(`\n--- Scanning Maven Module: ${mod.name} ---`);
    const jsonOut = path.join(outputDir, `${mod.name}_pom_trivy.json`);
    const txtOut = path.join(outputDir, `${mod.name}_pom_trivy.txt`);
    const startTime = new Date().toISOString();
    let exitCode = 0;

    try {
        const cmdJson = `docker run --rm -v trivy-cache:/root/.cache -v "C:/Users/nicsi/.m2:/root/.m2" -v "E:/System/Projects/dockerProject/Source code/lgd-active-new:/workspace" aquasec/trivy:latest fs --scanners vuln --format json -o /dev/stdout /workspace/${mod.relPom}`;
        const output = execSync(cmdJson, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
        fs.writeFileSync(jsonOut, output);

        const cmdTxt = `docker run --rm -v trivy-cache:/root/.cache -v "C:/Users/nicsi/.m2:/root/.m2" -v "E:/System/Projects/dockerProject/Source code/lgd-active-new:/workspace" aquasec/trivy:latest fs --scanners vuln --severity HIGH,CRITICAL /workspace/${mod.relPom}`;
        const txtOutput = execSync(cmdTxt, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
        fs.writeFileSync(txtOut, txtOutput);
    } catch (err) {
        console.error(`Scan error on ${mod.name}:`, err.message);
        exitCode = err.status || 1;
    }
    const endTime = new Date().toISOString();

    let counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0 };
    if (fs.existsSync(jsonOut)) {
        try {
            const data = JSON.parse(fs.readFileSync(jsonOut, "utf8"));
            if (data.Results) {
                for (const res of data.Results) {
                    if (res.Vulnerabilities) {
                        for (const v of res.Vulnerabilities) {
                            counts[v.Severity] = (counts[v.Severity] || 0) + 1;
                        }
                    }
                }
            }
        } catch (e) {
            console.error("JSON parse error:", e.message);
        }
    }

    results.push({
        target: mod.relPom,
        module: mod.name,
        type: "Maven Dependency Manifest",
        tool: "Aqua Security Trivy v0.76.1",
        scanStart: startTime,
        scanEnd: endTime,
        exitCode,
        summary: counts,
        jsonReport: jsonOut,
        txtReport: txtOut
    });
    console.log(`Scan completed for ${mod.name}: Critical=${counts.CRITICAL}, High=${counts.HIGH}, Medium=${counts.MEDIUM}, Low=${counts.LOW}`);
}

fs.writeFileSync(path.join(outputDir, "maven_pom_scan_summary.json"), JSON.stringify(results, null, 2));
console.log("\nAll Maven POM scans completed. Summary saved to scratch/trivy_results/maven_pom_scan_summary.json");
