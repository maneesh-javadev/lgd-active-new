const fs = require("fs");

const comps = JSON.parse(fs.readFileSync("scratch/deduped_components.json", "utf8"));

// Filter for libraries often associated with CVEs
const targets = [
    "spring", "tomcat", "netty", "logback", "log4j", "jackson", "yaml", "snakeyaml",
    "commons-", "tika", "pdfbox", "xml", "json", "jwt", "bcprov", "bouncycastle",
    "hibernate", "postgresql", "h2", "eureka", "feign", "resilience4j"
];

const matches = comps.filter(c => {
    const full = (c.group + ":" + c.name).toLowerCase();
    return targets.some(t => full.includes(t));
});

console.log(`Found ${matches.length} matching critical runtime components:`);
matches.forEach(m => {
    console.log(`${m.group}:${m.name}:${m.version} -> [${m.modules.join(", ")}]`);
});
