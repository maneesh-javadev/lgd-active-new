# LGD 2.0 — Software Composition Analysis (SCA) Findings Register
## Comprehensive Dependency & Software Supply Chain Vulnerability Register

| **Project Information** | |
|---|---|
| **Target Platform** | Local Government Directory 2.0 (LGD 2.0) |
| **Repository Root** | `e:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Assessment Scope** | Phase 4: Software Composition Analysis (SCA) & Dependency Remediation |
| **Audit Date** | October 30, 2026 |
| **Framework & Tools** | CycloneDX 1.5/1.6, Maven Dependency Plugin 3.6.1, npm audit v2, OWASP Dependency-Check 9.2.0 |
| **Document Status** | **OFFICIALLY APPROVED FINDINGS REGISTER** |

---

## 1. Governance & Severity Classification Standard

Vulnerabilities cataloged in this register are classified using the Common Vulnerability Scoring System (CVSS v3.1 / v4.0) severity bands:
- **Critical:** 9.0 – 10.0
- **High:** 7.0 – 8.9
- **Medium:** 4.0 – 6.9
- **Low:** 0.1 – 3.9

Findings record:
`SCA-ID | Component | Package | Installed Version | Direct/Transitive | CVE | CVSS | Severity | Affected Path | Fixed Version | Exploitability | Recommendation | Evidence`

---

## 2. SCA Master Findings Matrix

| SCA-ID | Component | Package | Installed Version | Direct / Transitive | CVE / Advisory | CVSS | Severity | Affected Path | Fixed Version | Exploitability | Remediation Status |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---|:---:|:---|:---:|
| **SCA-001** | PostgreSQL JDBC Driver | `org.postgresql:postgresql` | `42.6.0` (revenue) | Transitive | CVE-2024-1597 | **10.0** | **Critical** | `revenue -> spring-boot-starter-data-jpa -> postgresql:42.6.0` | `42.6.2` / `42.7.2`+ | High (Allows SQL injection via line comment in simple query mode) | **VERIFIED_FIXED** |
| **SCA-002** | Apache Tomcat Embed Core | `org.apache.tomcat.embed:tomcat-embed-core` | `10.1.18` (revenue)<br>`10.1.31` (gateway)<br>`10.1.33` (auth, um) | Transitive | CVE-2024-50379<br>CVE-2024-56337 | **9.8** | **Critical** | `spring-boot-starter-web -> spring-boot-starter-tomcat -> tomcat-embed-core` | `10.1.34`+ | Theoretical (RCE via Default Servlet write on case-insensitive filesystems) | **VERIFIED_FIXED** |
| **SCA-003** | Spring Web (UriComponentsBuilder) | `org.springframework:spring-web` | `6.1.3` (revenue) | Transitive | CVE-2024-22243<br>CVE-2024-22259<br>CVE-2024-22262 | **8.1** | **High** | `revenue -> spring-boot-starter-web -> spring-web:6.1.3` | `6.1.6`+ / `6.1.15` | Medium (SSRF / Open Redirect when parsing untrusted URLs) | **VERIFIED_FIXED** |
| **SCA-004** | Spring Web & WebMVC Static Resources | `org.springframework:spring-web` / `webmvc` | `6.1.3` (revenue)<br>`6.1.14` (gateway)<br>`6.1.15` (auth, um) | Transitive | CVE-2024-38807<br>CVE-2024-38816<br>CVE-2024-38819 | **7.5** | **High** | `spring-boot-starter-web -> spring-web / spring-webmvc` | `6.1.16`+ / `6.2.1`+ | Low (Requires WebMvc.fn functional routing, not used in LGD) | **PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE** |
| **SCA-005** | Spring Security Core & Web | `org.springframework.security:spring-security-*` | `6.2.1` (revenue)<br>`6.2.8` (auth, um)<br>`6.3.5` (gateway) | Transitive | CVE-2024-22234<br>CVE-2024-22257<br>CVE-2024-38821<br>CVE-2025-22228<br>*(CVE-2024-38828 dispositioned)* | **7.5** | **High** | `spring-boot-starter-security -> spring-security-core / web` | `6.3.8`+ | Low (Upgraded to 6.3.8; CVE-2024-38828 dispositioned as Spring Framework 5.3.x DoS false positive) | **VERIFIED_FIXED** |
| **SCA-006** | Netty HTTP & Transport (Lettuce Redis) | `io.netty:netty-codec-http` / `netty-common` | `4.1.105.Final` | Transitive | CVE-2024-29025<br>CVE-2024-47535 | **7.5** | **High** | `revenue -> spring-boot-starter-data-redis -> lettuce-core -> netty-*:4.1.105.Final` | `4.1.115.Final`+ | Low (Revenue uses Netty for Redis TCP sockets, not HTTP server) | **VERIFIED_FIXED** |
| **SCA-007** | Logback Classic & Core Serialization | `ch.qos.logback:logback-*` | `1.4.14` | Transitive | CVE-2024-12798<br>CVE-2024-12801 | **7.5** | **High** | `spring-boot-starter-logging -> logback-classic:1.4.14` | `1.4.15` / `1.5.13`+ | Low (Requires SocketReceiver / ServerSocketReceiver logging configuration) | **PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE** |
| **SCA-008** | Legacy Unmaintained jBCrypt Library | `org.mindrot:jbcrypt` | `0.4` | Direct | CWE-1104 | **5.3** | **Medium** | `auth-service/pom.xml`, `user-management/pom.xml -> org.mindrot:jbcrypt:0.4` | Migrate to `BCryptPasswordEncoder` | Low (Library unmaintained since 2015; salt generation verified secure) | **DEFERRED (QUEUED FOR PHASE 5 & 7)** |
| **SCA-009** | SheetJS (`xlsx`) Prototype Pollution & ReDoS | `xlsx` | `0.18.5` | Direct | CVE-2023-30533<br>CVE-2024-22363 | **7.8** | **High** | `lgd_react/package.json -> xlsx@^0.18.5` | `0.19.3` / `0.20.2`+ (CDN) | Low / None (Code audit confirmed `xlsx` is used strictly for outbound file exports) | **PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE (QUEUED FOR EXCELJS MIGRATION)** |
| **SCA-010** | Zod Memory Exhaustion on Constrained Collections | `zod` | `3.25.76` | Direct | GHSA-mrhx-c7xc-m3w5 | **7.5** | **High** | `lgd_react/package.json -> zod@^3.25.76` | `4.6.6`+ | Low (LGD validates shallow modal form fields, not recursive unbounded collections) | **PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE (QUEUED FOR ZOD 4 SPRINT)** |
| **SCA-011** | Spring Boot Parent Version Divergence | `org.springframework.boot:spring-boot-starter-parent` | `revenue: 3.2.2`<br>`auth: 3.2.12`<br>`um: 3.2.12`<br>`gateway: 3.3.5`<br>`discovery: 3.4.4` | Direct | CWE-1104 | **6.5** | **Medium** | Microservice root `pom.xml` configuration disparity | Aligned baseline | Medium (Causes transitive dependency divergence and unpatched packages in older modules) | **VERIFIED_FIXED (revenue aligned to 3.2.12)** |
| **SCA-012** | Container Base Image Default Root Execution | `eclipse-temurin` | `21-jdk` | Direct Dockerfile | CWE-250 | **6.5** | **Medium** | `*/Dockerfile -> FROM eclipse-temurin:21-jdk` | Non-root `USER 10001:10001` | Low (Compensating control: container ports unbound from public host) | **DEFERRED (QUEUED FOR PHASE 9 / RR-06)** |

---

## 3. Detailed Finding Records (SCA-001 through SCA-012)

### SCA-001: PostgreSQL JDBC Driver SQL Injection Vulnerability (CVE-2024-1597)
- **Component:** `org.postgresql:postgresql`
- **Package:** Maven JAR
- **Installed Version:** `42.6.0` (in `revenue`)
- **Direct/Transitive:** Transitive (inherited from `spring-boot-starter-data-jpa` under Spring Boot 3.2.2)
- **CVE:** CVE-2024-1597
- **CVSS Score:** **10.0** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H) | **Severity: Critical**
- **Affected Path:** `revenue/pom.xml` -> `org.springframework.boot:spring-boot-starter-data-jpa` -> `org.postgresql:postgresql:42.6.0`
- **Fixed Version:** `42.6.1`, `42.6.2`, `42.7.2`+
- **Exploitability Analysis:** High. In pgjdbc versions prior to 42.6.1 and 42.7.2, an attacker can perform SQL injection when using `preferQueryMode=simple` if user input contains line breaks or unquoted parameter values when comments are added.
- **Recommendation:** Upgrade `revenue`'s Spring Boot parent to `3.2.12`, which manages `postgresql` at `42.6.2`.
- **Evidence:** `revenue/target/bom.json` originally resolved `42.6.0`. Post-remediation POM update resolves `org.postgresql:postgresql:jar:42.6.2:compile`.
- **Status:** **`VERIFIED_FIXED`**

---

### SCA-002: Apache Tomcat Embed Core Remote Code Execution (CVE-2024-50379, CVE-2024-56337)
- **Component:** `org.apache.tomcat.embed:tomcat-embed-core`
- **Package:** Maven JAR
- **Installed Version:** `10.1.18` (revenue), `10.1.31` (api-gateway), `10.1.33` (auth-service, user-management)
- **Direct/Transitive:** Transitive (inherited from `spring-boot-starter-tomcat`)
- **CVE:** CVE-2024-50379, CVE-2024-56337
- **CVSS Score:** **9.8** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H) | **Severity: Critical**
- **Affected Path:** `pom.xml` -> `spring-boot-starter-web` -> `spring-boot-starter-tomcat` -> `tomcat-embed-core`
- **Fixed Version:** `10.1.34`, `10.1.35`+
- **Exploitability Analysis:** Theoretical / Conditional. A Time-of-Check to Time-of-Use (TOCTOU) race condition in Tomcat's DefaultServlet allows remote code execution on case-insensitive filesystems (including Windows) when write permissions (`readonly=false`) are enabled. While Spring Boot defaults DefaultServlet to read-only, CVSS 9.8 exposure poses severe regulatory audit risk.
- **Recommendation:** Add explicit `<tomcat.version>10.1.34</tomcat.version>` property to `api-gateway`, `auth-service`, `revenue`, and `user-management` POM files.
- **Evidence:** Maven dependency resolution confirms all 4 services resolve `org.apache.tomcat.embed:tomcat-embed-core:jar:10.1.34:compile`. All 289 regression tests pass.
- **Status:** **`VERIFIED_FIXED`**

---

### SCA-003: Spring Web URI Parsing SSRF & Open Redirect Vulnerabilities
- **Component:** `org.springframework:spring-web`
- **Package:** Maven JAR
- **Installed Version:** `6.1.3` (in `revenue`)
- **Direct/Transitive:** Transitive (via Spring Boot 3.2.2 starter parent)
- **CVE:** CVE-2024-22243, CVE-2024-22259, CVE-2024-22262
- **CVSS Score:** **8.1** (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:N/A:N) | **Severity: High**
- **Affected Path:** `revenue/pom.xml` -> `spring-boot-starter-web` -> `spring-web:6.1.3`
- **Fixed Version:** `6.1.6`+ / `6.1.15`
- **Exploitability Analysis:** Medium. Applications parsing hostnames using `UriComponentsBuilder` could be manipulated by attackers crafting ambiguous host strings (e.g. `[http://attacker.com#user@legitimate.com]`), bypassing URL validation logic and enabling Server-Side Request Forgery or open redirects.
- **Recommendation:** Upgrade `revenue` parent to `3.2.12`, which manages `spring-web` at `6.1.15`.
- **Evidence:** `mvn dependency:list` in `revenue` confirms `spring-web:6.1.15` is resolved.
- **Status:** **`VERIFIED_FIXED`**

---

### SCA-004: Spring Web & WebMVC Static Resource Handling & Path Traversal Flaws
- **Component:** `org.springframework:spring-web` / `spring-webmvc`
- **Package:** Maven JAR
- **Installed Version:** `6.1.3` (revenue), `6.1.14` (gateway), `6.1.15` (auth-service, user-management)
- **Direct/Transitive:** Transitive
- **CVE:** CVE-2024-38807 (CVSS 7.5 High), CVE-2024-38816 (CVSS 7.5 High), CVE-2024-38819 (CVSS 7.5 High)
- **CVSS Score:** **7.5** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N) | **Severity: High**
- **Affected Path:** `spring-boot-starter-web` -> `spring-web` / `spring-webmvc`
- **Fixed Version:** `6.1.16`+ / `6.2.1`+
- **Exploitability Analysis:** Low. Path traversal vulnerabilities CVE-2024-38816 and CVE-2024-38819 exclusively affect applications using Spring WebMvc.fn functional web routing or `RouterFunctions.resources` to serve static resources directly from the filesystem. LGD microservices use standard controller annotations (`@RestController`) and do not serve public static files directly from Java services.
- **Recommendation:** `revenue` upgraded from `6.1.3` to `6.1.15` (mitigating CVE-2024-38807 ReDoS and CVE-2024-38816). Document residual risk for CVE-2024-38819 pending Spring Boot 3.3/3.4 framework upgrade.
- **Evidence:** Gateway route normalization (`RouteValidator.java`) rejects path traversal (`..`) at network ingress.
- **Status:** **`PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE`**

---

### SCA-005: Spring Security Authentication & Request Matching Flaws
- **Component:** `org.springframework.security:spring-security-core` / `spring-security-web`
- **Package:** Maven JAR
- **Installed Version:** Originally `6.2.1` (revenue), `6.2.8` (auth, um), `6.3.5` (gateway). Upgraded to **`6.3.8`** across all backend services (`discovery` on `6.4.4` via Boot 3.4.4).
- **Direct/Transitive:** Transitive
- **CVE:** CVE-2024-22234 (CVSS 7.5 High), CVE-2024-22257 (CVSS 7.5 High), CVE-2024-38821 (CVSS 5.3 Med), CVE-2025-22228 (CVSS 7.5 High) | *(CVE-2024-38828 dispositioned)*
- **CVSS Score:** **7.5** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N) | **Severity: High**
- **Affected Path:** `spring-boot-starter-security` -> `spring-security-core` / `web`
- **Fixed Version:** `6.3.8`+
- **Exploitability Analysis:** Low. CVE-2024-22257 requires configuration of `RegexRequestMatcher` with `.anyRequest().authenticated()`. LGD microservices utilize `MvcRequestMatcher` / `AntPathMatcher` path patterns combined with method-level authorization (`@PreAuthorize`).
- **CVE-2024-38828 Verification & Disposition:**
  - Independent review flagged CVE-2024-38828 as listed in SCA-005 with a remediation version mismatch ("6.2.8 vs 6.2.9+").
  - Deep-dive investigation reveals CVE-2024-38828 is an upstream Spring Framework (`spring-webmvc` 5.3.0–5.3.41) DoS vulnerability when processing byte arrays with `@RequestBody byte[]`. It affects only Spring Framework 5.3.x, NOT Spring Security.
  - Spring Security 6.2.x OSS train concluded at 6.2.8; no version 6.2.9 was ever published to Maven Central.
  - Furthermore, LGD 2.0 uses Spring Framework 6.1.15 / 6.1.14 / 6.2.4, which are immune to CVE-2024-38828.
  - Therefore, CVE-2024-38828 is dispositioned as a catalog mapping false positive.
  - To eliminate all genuine Spring Security CVEs (CVE-2024-22234, CVE-2024-22257, CVE-2024-38821, CVE-2025-22228), explicit dependency property `<spring-security.version>6.3.8</spring-security.version>` was added across `auth-service`, `revenue`, `user-management`, and `api-gateway`.
- **Recommendation:** Upgrade to Spring Security 6.3.8 and re-verify compatibility and test suite pass rates.
- **Evidence:** Maven dependency resolution confirms `spring-security-core:6.3.8` and `spring-security-web:6.3.8` resolved. 289 automated regression tests pass cleanly (40 auth, 211 user-management, 22 revenue, 14 gateway, 2 discovery).
- **Status:** **`VERIFIED_FIXED`**

---

### SCA-006: Netty Unbounded Memory Allocation & Temp File Security (CVE-2024-29025, CVE-2024-47535)
- **Component:** `io.netty:netty-codec-http` / `io.netty:netty-common`
- **Package:** Maven JAR
- **Installed Version:** `4.1.105.Final` (in `revenue`)
- **Direct/Transitive:** Transitive (via `spring-boot-starter-data-redis` -> `lettuce-core`)
- **CVE:** CVE-2024-29025, CVE-2024-47535
- **CVSS Score:** **7.5** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H) | **Severity: High**
- **Affected Path:** `revenue/pom.xml` -> `spring-boot-starter-data-redis` -> `lettuce-core` -> `netty-*:4.1.105.Final`
- **Fixed Version:** `4.1.108.Final` / `4.1.115.Final`+
- **Exploitability Analysis:** Low. `HttpPostRequestDecoder` memory allocation flaw affects Netty HTTP servers parsing multipart form data. In `revenue`, Netty is used solely by the Lettuce Redis client for binary protocol Redis commands, not for HTTP serving (Tomcat handles HTTP).
- **Recommendation:** Upgrade `revenue` to Spring Boot 3.2.12, which updates Netty to `4.1.115.Final`.
- **Evidence:** `revenue/target/bom.json` confirms Netty components upgraded to `4.1.115.Final`.
- **Status:** **`VERIFIED_FIXED`**

---

### SCA-007: Logback Classic & Core Serialization Vulnerability (CVE-2024-12798, CVE-2024-12801)
- **Component:** `ch.qos.logback:logback-core`, `ch.qos.logback:logback-classic`
- **Package:** Maven JAR
- **Installed Version:** `1.4.14` (in `auth-service`, `revenue`, `user-management`)
- **Direct/Transitive:** Transitive (inherited from `spring-boot-starter-logging`)
- **CVE:** CVE-2024-12798, CVE-2024-12801
- **CVSS Score:** **7.5** (CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H) | **Severity: High**
- **Affected Path:** `spring-boot-starter-logging` -> `ch.qos.logback:logback-classic:1.4.14`
- **Fixed Version:** `1.4.15` / `1.5.13`+
- **Exploitability Analysis:** Low. Exploitation requires the application to configure a `SocketReceiver` or `ServerSocketReceiver` component listening on a network socket and parsing serialized Java objects from remote callers. LGD logging is strictly local console and file output (`logback-spring.xml`); no remote socket receivers are instantiated.
- **Recommendation:** Track upgrade to Logback 1.5.x in Spring Boot 3.3/3.4 alignment. Document residual risk.
- **Evidence:** `logback-spring.xml` review confirms zero socket receivers are configured.
- **Status:** **`PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE`**

---

### SCA-008: Legacy Unmaintained jBCrypt Library (jBCrypt 0.4)
- **Component:** `org.mindrot:jbcrypt`
- **Package:** Maven JAR
- **Installed Version:** `0.4` (in `auth-service`, `user-management`)
- **Direct/Transitive:** Direct dependency in `pom.xml`
- **CVE:** None formally assigned (CWE-1104: Use of Unmaintained Third-Party Components)
- **CVSS Score:** **5.3** (CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:N) | **Severity: Medium**
- **Affected Path:** `auth-service/pom.xml`, `user-management/pom.xml` -> `org.mindrot:jbcrypt:0.4`
- **Fixed Version:** Transition to `org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder`
- **Exploitability Analysis:** Low. The library performs standard BCrypt hashing with SecureRandom salt generation. However, it has received zero security maintenance since 2015.
- **Recommendation:** Retain in Phase 4 to preserve authentication compatibility; schedule full refactor to Spring Security `BCryptPasswordEncoder` in Phase 5 (Authentication & Session Audit) and Phase 7 (Cryptographic Hardening).
- **Evidence:** Passwords continue to hash and verify correctly across all 40 auth tests and 211 user-management tests.
- **Status:** **`DEFERRED (QUEUED FOR PHASE 5 & 7)`**

---

### SCA-009: SheetJS (`xlsx`) Prototype Pollution & ReDoS Vulnerabilities
- **Component:** `xlsx`
- **Package:** npm package
- **Installed Version:** `0.18.5` (in `lgd_react`)
- **Direct/Transitive:** Direct dependency in `package.json`
- **CVE:** CVE-2023-30533, CVE-2024-22363 (GHSA-4r6h-8v6p-xvw6, GHSA-5pgg-2g8v-p4x9)
- **CVSS Score:** **7.8** (CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H) | **Severity: High**
- **Affected Path:** `lgd_react/package.json` -> `xlsx@^0.18.5`
- **Fixed Version:** `0.19.3` / `0.20.2`+ (available exclusively via SheetJS CDN: `https://cdn.sheetjs.com`)
- **Exploitability Analysis:** Low / None in active architecture. Static code analysis of `lgd_react/src` confirms `xlsx` is only imported in two files:
  1. `NodalInfoCards.tsx` (line 7)
  2. `DepartmentAvailabilityModal.tsx` (line 4)
  Both files utilize `XLSX.utils.json_to_sheet()` and `XLSX.write()` strictly for **outbound file export** of JSON data into `.xlsx` downloads. Neither file invokes `XLSX.read()` or ingests untrusted user-supplied spreadsheets. Therefore, Prototype Pollution and ReDoS parsing attack vectors cannot be triggered.
- **Recommendation:** Document exploitability defense. Schedule transition to `exceljs` in frontend maintenance cycle.
- **Evidence:** Grep search results in `lgd_react/src` confirming outbound-only usage.
- **Status:** **`PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE (QUEUED FOR EXCELJS MIGRATION)`**

---

### SCA-010: Zod Memory Exhaustion on Oversized Constrained Collections (GHSA-mrhx-c7xc-m3w5)
- **Component:** `zod`
- **Package:** npm package
- **Installed Version:** `3.25.76` (in `lgd_react`)
- **Direct/Transitive:** Direct dependency in `package.json`
- **CVE:** GHSA-mrhx-c7xc-m3w5
- **CVSS Score:** **7.5** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H) | **Severity: High**
- **Affected Path:** `lgd_react/package.json` -> `zod@^3.25.76`
- **Fixed Version:** `4.6.6`+
- **Exploitability Analysis:** Low. Zod is used in `lgd_react` exclusively for React Hook Form input validation via `districtSchema.ts` (validating district creation fields such as state code, district name, headquarter). It does not validate unbounded collections, streaming arrays, or arbitrary JSON payloads. Upgrading to Zod 4.x introduces breaking changes with `@hookform/resolvers@^5.9.1`.
- **Recommendation:** Retain Zod 3.25.76 in Phase 4 to preserve form stability. Plan migration to Zod 4.x in dedicated frontend sprint.
- **Evidence:** `districtSchema.ts` and `AddDistrict.tsx` review; production build `npm run build` succeeds cleanly.
- **Status:** **`PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE (QUEUED FOR ZOD 4 SPRINT)`**

---

### SCA-011: Microservice Framework Version Divergence & EOL Support
- **Component:** Spring Boot Starter Parent
- **Package:** Maven Multi-Service Architecture
- **Installed Version:** `revenue: 3.2.2`, `auth-service: 3.2.12`, `user-management: 3.2.12`, `api-gateway: 3.3.5`, `discovery: 3.4.4`
- **Direct/Transitive:** Direct POM configuration
- **CVE:** N/A (CWE-1104: Architecture Discrepancy & Outdated Framework Baseline)
- **CVSS Score:** **6.5** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N) | **Severity: Medium**
- **Affected Path:** Root `pom.xml` configurations across 5 backend services
- **Fixed Version:** Harmonized baseline
- **Exploitability Analysis:** Medium. Multi-service version drift leads to inconsistent security patching, different Netty/Tomcat/Jackson/Postgres versions, and vulnerability blindspots. Specifically, `revenue` on 3.2.2 lagged 10 patch releases behind `auth-service` and `user-management`.
- **Recommendation:** Harmonize `revenue` from `3.2.2` to `3.2.12`, unifying the core business services (`auth-service`, `user-management`, `revenue`) on a consistent baseline.
- **Evidence:** `revenue/pom.xml` updated to 3.2.12; all 22 tests verified passing.
- **Status:** **`VERIFIED_FIXED`**

---

### SCA-012: Container Execution Context Running as Default Root UID 0
- **Component:** Container Base Image (`eclipse-temurin:21-jdk`)
- **Package:** Dockerfile Configuration
- **Installed Version:** `eclipse-temurin:21-jdk` (in all 5 Dockerfiles)
- **Direct/Transitive:** Direct Dockerfile Base Image
- **CVE:** N/A (CWE-250: Execution with Unnecessary Privileges)
- **CVSS Score:** **6.5** (CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:C/C:H/I:N/A:N) | **Severity: Medium**
- **Affected Path:** `api-gateway/Dockerfile`, `auth-service/Dockerfile`, `discovery/Dockerfile`, `revenue/Dockerfile`, `user-management/Dockerfile`
- **Fixed Version:** Non-root execution (`USER 10001:10001`)
- **Exploitability Analysis:** Low. Containers execute Java process as root (UID 0) within the container namespace. While host ports are isolated on `lgd-network`, container breakout vulnerabilities could escalate if host isolation is breached.
- **Recommendation:** Formally tracked as residual risk `RR-06`; scheduled for implementation in Phase 9 (Infrastructure, Container & Network Hardening).
- **Evidence:** Documented in `SECURITY_RESIDUAL_RISK_REGISTER.md` (RR-06).
- **Status:** **`DEFERRED (QUEUED FOR PHASE 9 / RR-06)`**

---

## 4. Reconciled Findings Summary & Severity Metrics

| Severity Level | CVSS Band | Total Detected | Fully Fixed in Phase 4 | Partially Mitigated (Pending Acceptance) | Formally Accepted Risks (Signed) | Deferred Remediation Items |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Critical** | 9.0 – 10.0 | **2** | **2** (`SCA-001`, `SCA-002`) | 0 | 0 | 0 |
| **High** | 7.0 – 8.9 | **7** | **3** (`SCA-003`, `SCA-005`, `SCA-006`) | **4** (`SCA-004`, `SCA-007`, `SCA-009`, `SCA-010`) | 0 | 0 |
| **Medium** | 4.0 – 6.9 | **3** | **1** (`SCA-011`) | 0 | 0 | **2** (`SCA-008`, `SCA-012`) |
| **Low** | 0.1 – 3.9 | **0** | 0 | 0 | 0 | 0 |
| **TOTAL** | — | **12** | **6** | **4** | **0** | **2** |

### Independent Review Reconciled Audit Statement:
1. **Critical Findings (2/2):** 100% of Critical findings (`SCA-001`, `SCA-002`) are **VERIFIED_FIXED** with automated regression tests passing.
2. **High Findings (7):** 3 findings (`SCA-003`, `SCA-005`, `SCA-006`) are **VERIFIED_FIXED**. 4 findings (`SCA-004`, `SCA-007`, `SCA-009`, `SCA-010`) are **PARTIALLY MITIGATED** through architectural compensating controls, but carry residual risk that is **PENDING FORMAL ACCEPTANCE** by the Designated Approving Authority (DAA).
3. **Formally Accepted Risks:** Currently **0** formal sign-offs exist. Residual risk items remain in status `PENDING_FORMAL_ACCEPTANCE` until formal DAA/CISO signature is executed.
4. **Deferred Remediation (2):** 2 Medium findings (`SCA-008` and `SCA-012`) are deferred to dedicated phases (Phase 5/7 for cryptographic refactoring, Phase 9 for container non-root hardening).
5. **Phase 4 Exit Evaluation:** Because unresolved High findings remain partially mitigated pending formal sign-off, Phase 4 is not claimed fully closed. Its formal gate status is **`PARTIALLY VERIFIED / PENDING FORMAL RISK ACCEPTANCE`**.
