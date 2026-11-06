const fs = require('fs');
const path = require('path');

const scanFiles = [
    { name: 'api-gateway', file: 'scratch/trivy_results/api-gateway_trivy.json' },
    { name: 'auth-service', file: 'scratch/trivy_results/auth-service_trivy.json' },
    { name: 'revenue', file: 'scratch/trivy_results/revenue_trivy.json' },
    { name: 'service-discovery', file: 'scratch/trivy_results/service-discovery_trivy.json' },
    { name: 'user-management', file: 'scratch/trivy_results/user-management_trivy.json' },
    { name: 'redis', file: 'scratch/trivy_results/redis-alpine_trivy.json' }
];

const results = {};

for (const s of scanFiles) {
    if (!fs.existsSync(s.file)) continue;
    const data = JSON.parse(fs.readFileSync(s.file, 'utf8'));
    const osVulns = [];
    const appVulns = [];
    
    if (data.Results) {
        for (const r of data.Results) {
            const isOS = (r.Type === 'ubuntu' || r.Type === 'debian' || r.Type === 'alpine');
            if (r.Vulnerabilities) {
                for (const v of r.Vulnerabilities) {
                    const item = {
                        target: r.Target,
                        type: r.Type,
                        cve: v.VulnerabilityID,
                        pkg: v.PkgName,
                        installedVersion: v.InstalledVersion,
                        fixedVersion: v.FixedVersion || 'None / Unfixed upstream',
                        severity: v.Severity,
                        title: v.Title || '',
                        status: v.Status
                    };
                    if (isOS) {
                        osVulns.push(item);
                    } else {
                        appVulns.push(item);
                    }
                }
            }
        }
    }
    
    // Group by severity
    const countBySev = (list) => {
        const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
        list.forEach(v => { counts[v.severity] = (counts[v.severity] || 0) + 1; });
        return counts;
    };
    
    results[s.name] = {
        totalOS: osVulns.length,
        osCounts: countBySev(osVulns),
        totalApp: appVulns.length,
        appCounts: countBySev(appVulns),
        critHighAppVulns: appVulns.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH')
    };
}

console.log(JSON.stringify(results, null, 2));
