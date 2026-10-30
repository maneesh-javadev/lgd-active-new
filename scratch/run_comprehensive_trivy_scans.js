const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputDir = path.resolve(__dirname, "trivy_results");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const images = [
    { name: "lgd-active-new-api-gateway:latest", tag: "api-gateway" },
    { name: "lgd-active-new-auth-service:latest", tag: "auth-service" },
    { name: "lgd-active-new-revenue:latest", tag: "revenue" },
    { name: "lgd-active-new-service-discovery:latest", tag: "service-discovery" },
    { name: "lgd-active-new-user-management:latest", tag: "user-management" },
    { name: "postgres:15-alpine", tag: "postgres-15-alpine" },
    { name: "redis:alpine", tag: "redis-alpine" }
];

const results = [];

console.log("=== STARTING COMPREHENSIVE TRIVY SCANS ===");

for (const img of images) {
    console.log(`\n--- Scanning Image: ${img.name} ---`);
    const inspectRaw = execSync(`docker inspect --format="{{.Id}}|{{.Created}}" ${img.name}`, { encoding: "utf8" }).trim();
    const [digest, created] = inspectRaw.split("|");
    const jsonOut = path.join(outputDir, `${img.tag}_trivy.json`);
    const txtOut = path.join(outputDir, `${img.tag}_trivy.txt`);
    
    const startTime = new Date().toISOString();
    let exitCode = 0;
    try {
        const cmd = `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache aquasec/trivy:latest image --format json --output /dev/stdout ${img.name}`;
        const output = execSync(cmd, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
        fs.writeFileSync(jsonOut, output);
        
        // Also capture table output
        const cmdTxt = `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache aquasec/trivy:latest image --severity HIGH,CRITICAL ${img.name}`;
        const txtOutput = execSync(cmdTxt, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
        fs.writeFileSync(txtOut, txtOutput);
    } catch (err) {
        console.error(`Scan error on ${img.name}:`, err.message);
        exitCode = err.status || 1;
    }
    const endTime = new Date().toISOString();

    // Parse summary counts from json
    let counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0 };
    let osVulnerabilities = 0;
    let appVulnerabilities = 0;
    if (fs.existsSync(jsonOut)) {
        try {
            const data = JSON.parse(fs.readFileSync(jsonOut, "utf8"));
            if (data.Results) {
                for (const res of data.Results) {
                    const isOS = res.Class === "os-pkgs";
                    if (res.Vulnerabilities) {
                        for (const v of res.Vulnerabilities) {
                            counts[v.Severity] = (counts[v.Severity] || 0) + 1;
                            if (isOS) osVulnerabilities++;
                            else appVulnerabilities++;
                        }
                    }
                }
            }
        } catch (e) {
            console.error("JSON parse error:", e.message);
        }
    }

    results.push({
        target: img.name,
        type: "Container Image",
        digest,
        created,
        tool: "Aqua Security Trivy v0.76.1",
        scanStart: startTime,
        scanEnd: endTime,
        exitCode,
        summary: counts,
        osVulnerabilities,
        appVulnerabilities,
        jsonReport: jsonOut,
        txtReport: txtOut
    });
    console.log(`Scan completed for ${img.name}: Critical=${counts.CRITICAL}, High=${counts.HIGH}, Medium=${counts.MEDIUM}, Low=${counts.LOW} (OS=${osVulnerabilities}, App=${appVulnerabilities})`);
}

fs.writeFileSync(path.join(outputDir, "container_scan_summary.json"), JSON.stringify(results, null, 2));
console.log("\nAll container scans completed. Summary saved to scratch/trivy_results/container_scan_summary.json");
