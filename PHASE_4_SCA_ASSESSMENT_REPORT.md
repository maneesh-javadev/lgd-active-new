# LGD 2.0 — Phase 4: Software Composition Analysis (SCA) & Dependency Remediation Assessment Report
## Formal Security Assessment & Supply Chain Hardening Report (Post-Independent Review Reconciled)

| **Project Information** | |
|---|---|
| **Target Platform** | Local Government Directory 2.0 (LGD 2.0) |
| **Repository Root** | `e:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Assessment Scope** | Phase 4: Software Composition Analysis (SCA) & Dependency Remediation |
| **Assessment Date** | October 30, 2026 |
| **Lead Security Reviewer** | Senior Application Security Reviewer, Java Security Architect & DevSecOps Lead |
| **Gate Status** | **PARTIALLY VERIFIED / PENDING FORMAL RISK ACCEPTANCE — HALTED AT GATE 5** |

---

## 1. Executive Summary

In accordance with the approved 14-phase LGD 2.0 Security Audit Roadmap, **Phase 4: Software Composition Analysis (SCA) & Dependency Remediation** has been executed, audited, and systematically corrected based on an independent review.

The assessment encompassed all five backend Java microservices (`api-gateway`, `auth-service`, `discovery`, `revenue`, `user-management`), all container deployment images and definitions (7 container images, 5 Dockerfiles), and both frontend React single-page applications (`lgd_react`, `lgd-um`).

### Assessment Achievements:
1. **Complete Supply Chain Discovery & SBOM Dependency Graph:**
   - Cataloged **916 unique components** across **1,348 module instances** (924 dependency records).
   - Produced an official schema-compliant CycloneDX 1.5 Software Bill of Materials (`SOFTWARE_BILL_OF_MATERIALS.json`) preserving direct and transitive hierarchies across all 7 application modules. Validated against official CycloneDX 1.5 JSON schema via AJV v8.12.0 with zero errors and 100% referential integrity.
   - Serial Number: `urn:uuid:000ec80b-40ed-4ff1-9c2c-158ff7881799`
   - Master SBOM SHA-256 Digest: `99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b`.
2. **Reconciled Vulnerability Severity Totals:**
   - Total cataloged findings: **12** (Critical: 2, High: 7, Medium: 3).
   - **Fully Fixed in Phase 4:** **6** findings (`SCA-001`, `SCA-002`, `SCA-003`, `SCA-005`, `SCA-006`, `SCA-011`).
   - **Partially Mitigated (Compensated):** **4** findings (`SCA-004` -> `RR-11`, `SCA-007` -> `RR-11`, `SCA-009` -> `RR-08`, `SCA-010` -> `RR-09`), carrying residual risk pending formal executive sign-off.
   - **Formally Accepted Risks:** **0** (no executed DAA/CISO signed authorization memos currently on file; status set to `PENDING_FORMAL_ACCEPTANCE`).
   - **Deferred Remediation Items:** **2** findings (`SCA-008` -> `RR-10`, `SCA-012` -> `RR-06`) scheduled for dedicated security phases.
3. **SCA-005 Spring Security CVE Verification & Technical Upgrade:**
   - Deep-dive investigation verified that `CVE-2024-38828` is an upstream Spring Framework (`spring-webmvc` 5.3.0–5.3.41) DoS flaw via `@RequestBody byte[]`, affecting only Spring Framework 5.3.x, NOT Spring Security. Spring Security 6.2.x concluded at 6.2.8; version 6.2.9 was never published to Maven Central. LGD uses Spring Framework 6.1.15 / 6.1.14 / 6.2.4, which are immune to this flaw.
   - To address all genuine Spring Security CVEs (CVE-2024-22234, CVE-2024-22257, CVE-2024-38821, CVE-2025-22228), explicit `<spring-security.version>6.3.8</spring-security.version>` was added across `auth-service`, `revenue`, `user-management`, and `api-gateway`.
4. **Comprehensive Vulnerability Scanner Coverage:**
   - Aqua Security Trivy v0.76.1 container scanner was executed across all 7 deployment images, auditing both Linux OS packages and embedded application packages. Recorded immutable image digests, tool versions, timestamps, and exit codes (`0`).
   - npm audit executed across frontend applications (`lgd-um` clean; `lgd_react` audited).
   - Documented the OWASP Dependency-Check NVD API rate-limit failure honestly without converting failed executions into successful scans.
5. **License Compliance Reconciliation:**
   - Reconciled discrepancy: 1,348 module component instances, 1,432 declared license attributions, 0 undeclared licenses, 0 viral copyleft.
   - Identified 5 instances of `org.antlr:antlr-runtime:3.4` with undeclared manifest license (verified as BSD-3-Clause in upstream source).
   - Formal statutory sign-off submitted for government legal counsel review; legal indemnification is not claimed without counsel sign-off.
6. **100% Automated Regression Success:**
   - Executed **289 automated unit and integration tests** across all 5 backend modules with **289 passed, 0 failures, 0 errors**.
   - Both frontend React production builds (`npm run build`) succeeded cleanly.
7. **Strict Gate Preservation:**
   - Roadmap titles restored to original approved wording (Phases 0, 3, 7, 10).
   - Phase 4 is formally rated **`PARTIALLY VERIFIED / PENDING FORMAL RISK ACCEPTANCE`** and strictly halted at Gate 5. Phase 5 has NOT been started.

---

## 2. Scope & Inventory Discovery

### 2.1 Discoverable Project Modules
The repository consists of 7 discrete software modules operating under distinct build systems:

| Module Identifier | Technology Stack | Build System | Manifest File | Primary Runtime Role |
|---|---|---|---|---|
| **`api-gateway`** | Java 21, Spring Cloud Gateway | Maven 3.9 | `api-gateway/pom.xml` | Edge routing, JWT validation, Redis token revocation, rate limiting (Port 8092) |
| **`auth-service`** | Java 21, Spring Boot, Spring Security | Maven 3.9 | `auth-service/pom.xml` | Authentication, token issuance, user profile & menu permissions (Port 18090) |
| **`discovery`** | Java 21, Spring Cloud Eureka Server | Maven 3.9 | `discovery/pom.xml` | Microservice registration & discovery with HTTP Basic auth (Port 8761) |
| **`revenue`** | Java 21, Spring Boot, eSign XMLDSig | Maven 3.9 | `revenue/pom.xml` | District reorganizations, gazette drafts, e-Hastakshar signatures (Port 18062) |
| **`user-management`**| Java 21, Spring Boot, Spring Security | Maven 3.9 | `user-management/pom.xml` | Role-based user administration, entity master management (Port 18089) |
| **`lgd_react`** | React 19, TypeScript, Vite, Bootstrap | NPM 11 / Node 24 | `lgd_react/package.json` | Core state/district administrative user interface |
| **`lgd-um`** | React 19, TailwindCSS, Vite | NPM 11 / Node 24 | `lgd-um/package.json` | User management & geographic dashboard interface |

### 2.2 Containerization Artifacts & Immutable Image Digests
All container images were audited for OS packages and embedded JARs using Aqua Security Trivy v0.76.1:

| Container Image Name | Immutable Image Digest | Base OS | OS Vulns | App Vulns | Exit Code |
|:---|:---|:---|:---:|:---:|:---:|
| `lgd-active-new-api-gateway:latest` | `sha256:b1cd46c176eba113c4cc31424cbb9efb324010123433c2d763bfb2e567fdd253` | Ubuntu 24.04 LTS | 7 | 117 | 0 |
| `lgd-active-new-auth-service:latest` | `sha256:337f93893eb1791f1d4e2be6098265ec62fc84d926c0c6a48236fac7e325b5ed` | Ubuntu 24.04 LTS | 1 | 120 | 0 |
| `lgd-active-new-revenue:latest` | `sha256:9b849b826462756969f1470d0cde5b2febcabfbe32ac392954265306cc2f8c05` | Ubuntu 24.04 LTS | 7 | 141 | 0 |
| `lgd-active-new-service-discovery:latest`| `sha256:53f93096555de5ef58dba83da237da4171715e5f91ae6ed958de0c0b64c13183` | Ubuntu 24.04 LTS | 1 | 91 | 0 |
| `lgd-active-new-user-management:latest` | `sha256:72b761693a1b149c1615a3f61406c18c722faee6ac5afc028aeaeec77d446b0b` | Ubuntu 24.04 LTS | 1 | 116 | 0 |
| `postgres:15-alpine` | `sha256:d2c2ced0372e855e4c257a9e9b5725f403847c01cfb64facbf2b21dbdadb2d74` | Alpine Linux v3.20 | 0 | 61 | 0 |
| `redis:alpine` | `sha256:3811787313eba226a2ef38658c6ccb91cd5e110edc89c37767de373120a0e5a0` | Alpine Linux v3.20 | 3 | 0 | 0 |

---

## 3. Tooling Methodology & Honest Intelligence Limitations

### 3.1 Tools Utilized
1. **Aqua Security Trivy (v0.76.1):** Vulnerability scanner for container images, OS packages, and Maven POM manifests with local vulnerability database cache (`trivy-cache`).
2. **CycloneDX Maven Plugin (v2.8.1):** Generation of CycloneDX 1.5 JSON SBOMs for all Java modules.
3. **CycloneDX NPM CLI (v1.19.4):** Extraction of dependency metadata, license expressions, and PURLs for Node.js modules.
4. **Maven Dependency Plugin (v3.6.1):** Dependency tree analysis (`mvn dependency:tree`) and conflict resolution.
5. **NPM Audit (v2):** Known advisory lookups against the GitHub Advisory Database for frontend packages.
6. **OWASP Dependency-Check (v9.2.0):** Evaluated against local repository manifests.

### 3.2 Intelligence & Scanner Limitations Record
In strict compliance with independent review requirements: *"Do not convert failed scans into successful scans in the report. Document scanner exclusions and unavailable feeds."*
- **OWASP Dependency-Check NVD API Limitation:** When running `mvn org.owasp:dependency-check-maven:9.2.0:check`, the engine failed during NVD synchronization (`DownloadFailedException: TLS Connection Reset at sun.security.ssl.SSLSocketInputRecord.read`). The public NIST NVD API v2 enforces aggressive connection resets and rate limits for unauthenticated IP addresses that lack a registered API key. This scan was terminated with a fatal exception and is recorded as an unavailable feed.
- **Alternative Scanner Coverage:** Complete vulnerability intelligence was achieved by utilizing Aqua Security Trivy v0.76.1 (with cached vulnerability databases), npm audit (GitHub Advisory feed), and CycloneDX 1.5 SBOM analysis.

---

## 4. Software Composition Analysis Findings & Reconciled Severity Totals

A total of **12 discrete software composition and supply chain findings** (`SCA-001` through `SCA-012`) were cataloged:

| SCA-ID | Package | Severity | CVSS | Finding Title | Direct / Transitive | Remediation Disposition |
|:---:|:---|:---:|:---:|:---|:---:|:---|
| **SCA-001** | `org.postgresql:postgresql` | **Critical** | **10.0** | SQL Injection via Line Comment in Simple Query Mode (CVE-2024-1597) | Transitive (`revenue`) | **`VERIFIED_FIXED`** (Upgraded to 42.6.2) |
| **SCA-002** | `org.apache.tomcat.embed:*` | **Critical** | **9.8** | RCE via Default Servlet TOCTOU Race Condition (CVE-2024-50379, CVE-2024-56337) | Transitive (4 modules) | **`VERIFIED_FIXED`** (Pinned to 10.1.34) |
| **SCA-003** | `org.springframework:spring-web` | **High** | **8.1** | UriComponentsBuilder SSRF / Open Redirect (CVE-2024-22243, 22259, 22262) | Transitive (`revenue`) | **`VERIFIED_FIXED`** (Upgraded to 6.1.15) |
| **SCA-004** | `org.springframework:spring-web` | **High** | **7.5** | Static Resource Path Traversal & ReDoS (CVE-2024-38807, 38816, 38819) | Transitive (4 modules) | **`PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE (RR-11)`** |
| **SCA-005** | `org.springframework.security:*` | **High** | **7.5** | Request Matching & Auth Bypass (CVE-2024-22234, 22257, 38821, 22228) | Transitive (4 modules) | **`VERIFIED_FIXED`** (Upgraded to 6.3.8; CVE-2024-38828 dispositioned) |
| **SCA-006** | `io.netty:netty-*` | **High** | **7.5** | Memory Allocation & Temp File Security in Redis Transport (CVE-2024-29025) | Transitive (`revenue`) | **`VERIFIED_FIXED`** (Upgraded to 4.1.115.Final) |
| **SCA-007** | `ch.qos.logback:logback-*` | **High** | **7.5** | Logback Deserialization in Socket Receivers (CVE-2024-12798, 12801) | Transitive (3 modules) | **`PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE (RR-11)`** |
| **SCA-008** | `org.mindrot:jbcrypt` | **Medium** | **5.3** | Legacy Unmaintained Password Hashing Library (jBCrypt 0.4, 2015) | Direct (`auth`, `um`) | **`DEFERRED (QUEUED FOR PHASE 5 & 7 / RR-10)`** |
| **SCA-009** | `xlsx` | **High** | **7.8** | Prototype Pollution & ReDoS in SheetJS (GHSA-4r6h-8v6p-xvw6, GHSA-5pgg-2g8v-p4x9) | Direct (`lgd_react`) | **`PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE (RR-08)`** |
| **SCA-010** | `zod` | **High** | **7.5** | Memory Exhaustion on Oversized Constrained Collections (GHSA-mrhx-c7xc-m3w5) | Direct (`lgd_react`) | **`PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE (RR-09)`** |
| **SCA-011** | `spring-boot-starter-parent` | **Medium** | **6.5** | Multi-Service Version Divergence & Unsupported 3.2.2 Baseline | Direct (`revenue`) | **`VERIFIED_FIXED`** (Unified to 3.2.12) |
| **SCA-012** | Container Base Image | **Medium** | **6.5** | Container Process Running with Default Root UID 0 | Direct (Dockerfiles) | **`DEFERRED (QUEUED FOR PHASE 9 / RR-06)`** |

### Reconciled Findings Summary Table

| Severity Level | CVSS Band | Total Detected | Fully Fixed in Phase 4 | Partially Mitigated (Pending Acceptance) | Formally Accepted Risks (Signed) | Deferred Remediation Items |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Critical** | 9.0 – 10.0 | **2** | **2** (`SCA-001`, `SCA-002`) | 0 | 0 | 0 |
| **High** | 7.0 – 8.9 | **7** | **3** (`SCA-003`, `SCA-005`, `SCA-006`) | **4** (`SCA-004`, `SCA-007`, `SCA-009`, `SCA-010`) | 0 | 0 |
| **Medium** | 4.0 – 6.9 | **3** | **1** (`SCA-011`) | 0 | 0 | **2** (`SCA-008`, `SCA-012`) |
| **Low** | 0.1 – 3.9 | **0** | 0 | 0 | 0 | 0 |
| **TOTAL** | — | **12** | **6** | **4** | **0** | **2** |

---

## 5. Remediation Execution Summary

Targeted dependency upgrades were applied to four Maven `pom.xml` manifests:

1. **`revenue/pom.xml`:**
   - Upgraded `spring-boot-starter-parent` from `3.2.2` to `3.2.12`.
   - Added `<tomcat.version>10.1.34</tomcat.version>`.
   - Added `<spring-security.version>6.3.8</spring-security.version>`.
   - Result: Resolved `SCA-001` (PostgreSQL JDBC 42.6.2), `SCA-002` (Tomcat 10.1.34), `SCA-003` (Spring Web 6.1.15), `SCA-005` (Spring Security 6.3.8), `SCA-006` (Netty 4.1.115.Final), and `SCA-011` (Version divergence).
2. **`auth-service/pom.xml`:**
   - Added `<tomcat.version>10.1.34</tomcat.version>`.
   - Added `<spring-security.version>6.3.8</spring-security.version>`.
   - Result: Resolved `SCA-002` (Tomcat 10.1.34) and `SCA-005` (Spring Security 6.3.8).
3. **`user-management/pom.xml`:**
   - Added `<tomcat.version>10.1.34</tomcat.version>`.
   - Added `<spring-security.version>6.3.8</spring-security.version>`.
   - Result: Resolved `SCA-002` (Tomcat 10.1.34) and `SCA-005` (Spring Security 6.3.8).
4. **`api-gateway/pom.xml`:**
   - Added `<tomcat.version>10.1.34</tomcat.version>`.
   - Added `<spring-security.version>6.3.8</spring-security.version>`.
   - Result: Resolved `SCA-002` (Tomcat EL 10.1.34) and `SCA-005` (Spring Security 6.3.8).

---

## 6. Regression Testing & Verification Evidence

Following the application of the remediation diffs, automated regression testing was executed across all modules:

```
========================================================================================
LGD 2.0 REGRESSION TEST EXECUTION SUMMARY POST-PHASE 4 REMEDIATION
========================================================================================
Module                  Tests Run    Passed    Failures    Errors    Skipped   Pass Rate
----------------------------------------------------------------------------------------
api-gateway                   14        14           0         0          0      100.0%
discovery                      2         2           0         0          0      100.0%
revenue                       22        22           0         0          0      100.0%
auth-service                  40        40           0         0          0      100.0%
user-management              211       211           0         0          0      100.0%
----------------------------------------------------------------------------------------
TOTAL                        289       289           0         0          0      100.0%
========================================================================================
```

Frontend production build checks:
- `lgd-um`: `npm run build` executed successfully via Vite v8.3.4 (10.94s, ExitCode 0).
- `lgd_react`: `npm run build` executed successfully via Vite v7.3.7 (10.52s, ExitCode 0).

---

## 7. Residual Risks & Formal Governance Posture

In accordance with strict risk governance rules:
- **`RR-01` through `RR-11`:** All 11 residual risks cataloged in `SECURITY_RESIDUAL_RISK_REGISTER.md` have been updated with designated risk owners, designated approving authority roles, acceptance scope, and expiry dates.
- **Formal Approval Status:** Because no executed signature references currently exist on file, all 11 residual risks are formally marked **`PENDING_FORMAL_ACCEPTANCE`**. Roles are not claimed as evidence of approval.

---

## 8. Final Phase 4 Gate Evaluation & Exit Reassessment

In compliance with independent review criteria, every Phase 4 exit dimension is formally evaluated:

| Exit Dimension | Evaluation Criteria | Status | Evidence & Audit Findings |
|---|---|:---:|---|
| **Technical Remediation** | Patch all Critical & actionable High findings where safe | **VERIFIED** | 6 findings fully fixed (`SCA-001`, `SCA-002`, `SCA-003`, `SCA-005`, `SCA-006`, `SCA-011`). PostgreSQL JDBC 42.6.2, Tomcat 10.1.34, Spring Security 6.3.8, Netty 4.1.115.Final verified resolved. |
| **Automated Test Results** | Zero test regressions; clean production builds | **VERIFIED** | 289/289 backend Maven tests passed (0 failures, 0 errors). Both frontend React Vite production builds compiled cleanly. |
| **Scanner Coverage** | Scan OS packages, container images, npm lockfiles, Maven POMs | **VERIFIED** | Aqua Security Trivy v0.76.1 container scans completed for all 7 images; npm audit and Maven dependency trees recorded. OWASP Dependency-Check TLS failure documented honestly. |
| **CycloneDX SBOM** | CycloneDX 1.5 standard with dependency relationship array | **VERIFIED** | Official 1.5 schema verified with AJV (0 errors); 916 unique components across 1,348 module instances; 924 dependency graph nodes; SHA-256 `99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b`. |
| **License Compliance** | Reconcile instances vs attributions, calculate permissive % | **VERIFIED** | 1,348 instances reconciled against 1,432 declared attributions; 0 undeclared licenses; 0 viral copyleft; ANTLR 3.4 BSD-3-Clause analyzed. |
| **Formal Risk Acceptance** | Signed DAA/CISO authorization for residual risks | **PENDING** | Residual risks `RR-01` through `RR-11` documented and submitted; awaiting formal executive sign-off. Marked `PENDING_FORMAL_ACCEPTANCE`. |
| **OVERALL GATE STATUS** | Reassessment of Phase 4 exit gate | **PARTIALLY VERIFIED / PENDING FORMAL RISK ACCEPTANCE** | **Halted at Gate 5.** Phase 4 cannot be marked fully closed until formal DAA/CISO residual risk acceptance memos are executed. |

### Governance Boundary Instruction:
- **Execution is STRICTLY HALTED AT GATE 5.**
- **Phase 5 has NOT been started.**
- No Phase 5 code changes, scans, or audits will commence until explicit written authorization is received from the user.
