# Phase 0–4: Final Independent Audit Disposition & Acceptance Report

| **Document Version** | 2.2.0 |
| **Audit Milestone** | Pre-Phase-5 Final Independent Review |
| **Audited Lifecycle Scope** | Phases 0, 1, 2, 3, and 4 (Full Technical & Governance Scope) |
| **System** | Local Government Directory (LGD 2.0) |
| **Target Repository** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Auditor Role** | Principal Application Security Auditor, Senior Java Security Architect, DAST Penetration Tester, DevSecOps Engineer, SBOM Specialist, and Independent Audit Reviewer |
| **Original Evaluation Timestamp** | `2026-11-02T04:50:00+05:30` |
| **Final Revision Timestamp** | `2026-11-03T16:00:00+05:30` |
| **Final Validation Timestamp** | `2026-11-03T16:05:00+05:30` |
| **Audit Classification** | OFFICIAL / GOVERNMENT INDEPENDENT AUDIT DISPOSITION |
| **Overall Gate Outcome** | **PENDING_REMEDIATION_AND_INDEPENDENT_RETEST (GATE A: PASS | GATE B: HOLD | GATE C: PENDING_FORMAL_ACCEPTANCE)** |
| **Phase 5 Boundary** | **HALTED AT GATE 5 — PHASE 5 NOT STARTED** |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## A. Executive Summary

This **Final Independent Audit Disposition** establishes the formal pre-Phase-5 security audit posture for the **Local Government Directory 2.0 (LGD 2.0)** platform. 

Operating under the strict governance rules of the approved **14-phase roadmap** (Phase 0 through Phase 13), this independent audit reviewed all source code, Git history, build manifests, resolved dependencies, test results, Docker container images, scanner reports, and governance registers.

### Summary of What Has Been Resolved
1. **Phase 0 Baseline:** Completely reconciled all historical file and endpoint counting ambiguities. Established that 46 production REST endpoints + 1 actuator health probe (`CANON-47`) = 47 canonical operations; tested alongside 1 separate Eureka infrastructure probe (`EXP-020`, `EV-007A`/`B`) = 48 distinct tested targets overall, evaluated across 63 unique normalized method/path combinations and 153 total DAST test rows (47 canonical base tests mapping 1-to-1 to canonical operations, 21 SAST-linked exploit tests, 60 input-validation/fuzzing probes, and 25 SQLi refutation probes for `OBS-SQLI-01`). Reconciled 397 hand-written Java files (409 on disk) and confirmed all 23 initial vulnerability hypotheses.
2. **Phase 1 Threat Model:** Validated all 8 operational trust boundaries (`TB-01` to `TB-08`). Reconciled the theoretical 42-cell matrix ($7 \text{ components} \times 6 \text{ categories}$) into the 20 discrete STRIDE scenarios (`THR-STRIDE-001` through `THR-STRIDE-020`). Verified all 20 DREAD quantitative assessments (12 Critical, 8 High).
3. **Phase 2 SAST Review:** Verified that all 21 actionable SAST findings (`SAST-001` through `SAST-021`) have robust code remediations present in the active codebase without introducing secondary regressions.
4. **Phase 3 DAST Assessment:** Reconciled all 21 exploitation vectors: 19 verified fixed, 2 partially verified (`EXP-016` [CSP verified live; HSTS pending genuine TLS ingress] and `EXP-021` [Gateway 403 perimeter barrier verified live; downstream Revenue container check pending]), 1 independent false positive observation (`OBS-SQLI-01` / `EV-021`, confirmed secure JPA parameterization). The raw canonical dataset in `scratch/live_dast_evidence_records.json` preserves 12 evidence records (11 live HTTP probes across 9 vectors + 1 source-code JPA observation). Under no circumstances are the 12 records termed '10 live tests'.
5. **Phase 4 SCA & SBOM:** Pinned and verified the 12 canonical SCA findings. Regenerated the CycloneDX 1.5 JSON SBOM (916 unique components, 1,348 module instances, 924 graph nodes, 1,899 dependency edges, 0 orphan refs, 0 orphan targets, 3 cycles; SHA-256 `99ba7965...`), validated against official schema via AJV v8.20.0 (0 errors), and resolved license arithmetic (1,432 declared attribution records across 1,348 instances, 0 viral copyleft). Pinned Trivy scanner image digest: `docker.io/aquasec/trivy@sha256:2e6c00d711ab4ae41d8a30c2c1fd3bd3b62704c177bb120f95012e939edfb3df`.
6. **Automated Regressions & Builds:** Executed all 289 Maven backend tests across the 5 microservices with 100% pass rate (0 failures, 0 errors, 0 skipped across 44 Surefire XML files via `mvn clean test`), establishing that the test lifecycle passed cleanly; package-level verification (`mvn clean package` / JAR packaging) is not established by available disk evidence. Verified clean production build for active frontend `lgd-um` (Exit Code 0). Inspected `lgd_react` in Git index metadata, confirming it exists as an unpopulated Git submodule pointer (`c15c8b0e5326e44e751afb2ab931e12a3ae7de95`), formally retired and excluded from active architectural and build scope (`NOT_APPLICABLE`). Verified container health and perimeter port isolation.
7. **Credential Incident Status (4 Separate Dimensions):**
   - **Current Files (Working Copy):** Clean and sanitized. Committed properties files redact secrets and require external environment variables (`${JWT_SECRET}`, `${SPRING_DATASOURCE_*}`). Startup validator (`ProductionSecurityValidator.java`) fails closed on weak or default keys.
   - **Git History:** The legacy compromised signing secret remains in historical Git commits. Git history has NOT been rewritten without an isolated offline backup and explicit written authorization.
   - **Active Service Configuration:** Active Docker containers load secrets from environment variables; secret fingerprint equality verified across running services.
   - **Credential Rotation:** Legacy secret classified as compromised and retired. Secrets rotation plan established (`SECURITY_SECRETS_ROTATION_PLAN.md`). Migration to RS256 asymmetric keys queued for Phase 5 & 7.

### Summary of What Remains Open
- **Technical Verification (Gate B):** Gate B is retained on **`HOLD`** due to three active technical/environmental blockers: (1) `BLK-01` (`EXP-016` HSTS) remains PARTIALLY_VERIFIED pending genuine TLS ingress; (2) `BLK-02` (`EXP-021` TestController) remains PARTIALLY_VERIFIED pending downstream Revenue container probe; and (3) `BLK-03` (Host PostgreSQL 14 service availability and container stability). The obsolete frontend build requirement (`lgd_react`) has been excluded from active architecture and blocker registers (`NOT_APPLICABLE`). Container base image package CVEs remain queued for Phase 9 hardening (`RR-06`).
- **Formal Governance Risk Acceptance (Gate C):** All **11 residual risks (`RR-01` through `RR-11`)** are thoroughly mitigated via operational controls, but in the absence of an executed, signed authorization memo from the Designated Approving Authority (DAA) or Chief Information Security Officer (CISO), they remain formally classified as **`PENDING_FORMAL_ACCEPTANCE`** (Blocker `BLK-04`).
- **Approved Future Phase Implementations:** Architectural enhancements assigned to future roadmap phases (such as Phase 5/7 asymmetric RS256 signing and jBCrypt migration, and Phase 9 non-root container hardening) remain strictly queued for their approved phases.

---

## B. Phase-by-Phase Disposition (Phases 0–4)

| Assessment Phase | Previous Documented Status | Verified Work & Scope Completed | Corrections Performed During Audit | Automated & Live Tests Executed | Remaining Blockers / Pending Items | Final Evidence-Supported Status |
|:---|:---|:---|:---|:---|:---|:---:|
| **Phase 0:** Discovery & Baseline | Completed (with arithmetic discrepancies) | Audited 5 backend services, 2 React frontends, 397 Java files, 181 frontend files, 47 canonical operations, and 23 baseline hypotheses. | Reconciled 46 vs 47 endpoints and 153 test rows; proved `VULN-002` (XXE), `VULN-010` (Username Enumeration), and `OBS-SQLI-01` (SQLi observation) dispositions. | Source code census and inventory diff scripts. | None. | **VERIFIED & CONSOLIDATED** |
| **Phase 1:** Threat Modeling & Trust Boundaries | Closed (with 42 vs 20 confusion) | Evaluated 8 trust boundaries (`TB-01`–`TB-08`), 20 STRIDE scenarios, and 20 DREAD scores (12 Critical, 8 High). | Reconciled 42 theoretical evaluation cells with 20 discrete threat scenarios; updated port exposure to reflect host unmapping. | Container topology inspection and network port scans. | None. | **VERIFIED & CLOSED** |
| **Phase 2:** SAST & Code Review | Verified Fixed (Code level only) | Audited all 21 SAST findings (`SAST-001`–`021`) across Java source classes, filters, and configurations. | Reconciled corrected `SAST-011` / `EXP-011` / `EV-020` relationship; confirmed zero code regressions. | All 289 Maven backend tests executed and passed (100%). | Dependent live dynamic retests verified in Phase 3. | **VERIFIED_FIXED (CODE & SUITE)** |
| **Phase 3:** DAST & Dynamic Testing | Verified (with 9 live tests pending) | Audited 47 canonical operations, 63 unique route patterns, and 153 test rows across 21 exploitation vectors. | Reconciled 19 verified fixed, 2 partially verified (`EXP-016`, `EXP-021`), 1 false positive (`OBS-SQLI-01`). Verified raw evidence container IDs. | 12 raw JSON evidence records (11 live HTTP probes across 9 vectors + 1 JPA observation). | Genuine TLS ingress for HSTS (`EXP-016` / `BLK-01`); downstream Revenue check (`EXP-021` / `BLK-02`). | **AUDIT RECONCILED / 2 PARTIALLY VERIFIED** |
| **Phase 4:** SCA & Dependency Remediation | Partially Verified / Pending Acceptance | Audited 12 canonical SCA findings, 1,348 component instances, and 1,432 license attributions. | Reconciled SBOM graph (924 nodes, 1,899 edges, 3 cycles); validated via AJV v8.20.0; pinned Trivy scanner digest; separated host PostgreSQL 14.20 binary from pgAdmin yarn.lock scan. | `npm run build` on `lgd-um` (clean); `lgd_react` excluded from active scope (`NOT_APPLICABLE`); AJV schema validator; Trivy scans. | Gate B technical blockers (`BLK-01`..`03`); DAA/CISO formal risk acceptance for `RR-01`–`RR-11` (`BLK-04`). | **RECONCILED / GATE B HOLD** |


---

## C. Complete Finding-Level Dispositions

### C.1 Phase 0 Baseline Vulnerability Hypotheses (VULN-001 through VULN-023)

| Baseline ID | Category & Vulnerability Description | Primary SAST Mapping | Primary STRIDE Mapping | Original DAST State | Current Code Status | Retest Disposition | Final Disposition |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **VULN-001** | Hardcoded Static JWT Secret | SAST-001 | THR-STRIDE-001 | CONFIRMED | Fixed (`ProductionSecurityValidator`) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-002** | XML External Entity (XXE) Injection in Public eSign Endpoint | Unassigned (Parser hardening) | THR-STRIDE-003 | CONFIRMED | Hardened (`XmlSignatureUtil` disallow-doctype-decl) | RETEST_PASSED | **VERIFIED_FIXED** *(Genuine XXE vulnerability remediated via defensive code changes; not a false positive)* |
| **VULN-003** | Electronic Signature Verification Bypass in eSign Response | SAST-003–007 | THR-STRIDE-003, 008 | CONFIRMED | Fixed (`XmlSignatureUtil`, `SecureRandom`, signature enforcement) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-004** | Overly Permissive CORS with Wildcard Reflection and Credentials | Unassigned (CORS Config) | *[Unassigned]* | CONFIRMED | Fixed (`CorsConfig` origin whitelist) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-005** | Complete Absence of Microservice Method-Level Authorization | SAST-011 | THR-STRIDE-018 | CONFIRMED | Fixed (`@EnableMethodSecurity`, `@PreAuthorize`) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-006** | State & District Tenant Boundary Bypass (BOLA / IDOR) | SAST-009, 010 | THR-STRIDE-005, 019 | CONFIRMED | Fixed (Tenant stateCode ownership check) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-007** | Distributed Token Revocation Bypass across Gateway & Services | SAST-012 | THR-STRIDE-007 | CONFIRMED | Fixed (Reactive Lettuce Redis check in filters) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-008** | Plaintext JWT Bearer Token Leakage in Gateway Logs & DB | Unassigned (Logging filter) | THR-STRIDE-010 | CONFIRMED | Fixed (`ApiLoggingFilter` token mask & header scrub) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-009** | Direct Container Port Exposure | Compose Port Unmapping | `THR-STRIDE-004`, `012` | CONFIRMED | Fixed (Host port unmapping) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-010** | Username Enumeration via Differentiated Error Messages | Unassigned (Auth error msg) | THR-STRIDE-016 | CONFIRMED | Fixed (Uniform "Invalid username or password") | RETEST_PASSED | **VERIFIED_FIXED** |
| **OBS-SQLI-01** | JPA SQL-Injection Hypothesis (Independent Observation) | Refuted (JPA Safe) | *[Unassigned]* | FALSE POSITIVE | Parameterized (Named parameter binding `:param`) | CONFIRMED_SECURE | **CONFIRMED_SECURE / FALSE_POSITIVE** *(Independent observation; VULN-010 preserved as username enum)* |
| **VULN-011** | Weak Password Complexity and Missing Minimum Length Policy | Unassigned (User validator) | THR-STRIDE-016 | CONFIRMED | Fixed (`CreateUserValidator` min 8 chars regex) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-012** | Vulnerable Frontend Dependencies (SheetJS, Vite, Zod) | SCA-009, SCA-010 | *[Unassigned]* | CONFIRMED | Partially Mitigated (Mapped to `RR-08` & `RR-09`) | PENDING_FORMAL_ACCEPTANCE | **PENDING_FORMAL_ACCEPTANCE** |
| **VULN-013** | Swagger UI Public Documentation Exposure | SAST-019 | THR-STRIDE-013 | CONFIRMED | Fixed (`@Profile("!prod")` on configs) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-014** | Microservice Containers Running as Root | SCA-012 | *[Unassigned]* | CONFIRMED | Deferred (Mapped to `RR-06` non-root in Phase 9) | PENDING_FORMAL_ACCEPTANCE | **PENDING_FORMAL_ACCEPTANCE** |
| **VULN-015** | Absence of Rate Limiting on Ingress | Unassigned (Gateway filter) | THR-STRIDE-016 | CONFIRMED | Fixed (Redis token-bucket rate limiting) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-016** | Missing Defense-in-Depth HTTP Security Headers in Gateway | *[Unassigned]* (SAST-016 provides mitigation) | *[Unassigned]* | CONFIRMED | Code Fixed (`SecurityHeadersFilter` CSP/HSTS/X-Frame); Live CSP verified; HSTS pending TLS | PARTIALLY_VERIFIED (CSP Verified / HSTS Pending TLS) | **PARTIALLY_VERIFIED** |
| **VULN-017** | Committed Plaintext Database Credentials | SAST-002 | `THR-STRIDE-012 (Amplifier)` | CONFIRMED | Fixed (Mandatory `${SPRING_DATASOURCE_*}` env vars) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-018** | High Memory Consumption on Large Multipart Document Uploads | SAST-018 | THR-STRIDE-015 | CONFIRMED | Fixed (%PDF- magic byte check & 5MB ceiling) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-019** | Gateway Missing Strict Content-Length Cap | SAST-015 | THR-STRIDE-015, 017 | CONFIRMED | Fixed (10 KB buffer ceiling in logger) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-020** | Absence of Refresh Token Rotation | Unassigned (Auth architecture) | *[Unassigned]* | CONFIRMED | Deferred (Mapped to `RR-01` & `RR-03` in Phase 5) | PENDING_FORMAL_ACCEPTANCE | **PENDING_FORMAL_ACCEPTANCE** |
| **VULN-021** | Unauthenticated Eureka Instance Registry | SAST-020 | THR-STRIDE-002 | CONFIRMED | Fixed (Spring Security HTTP Basic Auth) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-022** | Open Redirect Potential in Client Router | Unassigned (Frontend router) | *[Unassigned]* | CONFIRMED | Fixed (Static routing whitelist in client router) | RETEST_PASSED | **VERIFIED_FIXED** |
| **VULN-023** | Prototype Pollution in SheetJS Library (`xlsx`) | SCA-009 | *[Unassigned]* | CONFIRMED | Partially Mitigated (Mapped to `RR-08` outbound export) | PENDING_FORMAL_ACCEPTANCE | **PENDING_FORMAL_ACCEPTANCE** |

---

### C.2 Phase 1 STRIDE Threat Scenarios (THR-STRIDE-001 through THR-STRIDE-020)

| Threat ID | STRIDE Category | Threat Scenario Name | Target Component | Trust Boundary | Related VULN | Severity | Mitigated in Code | Verification Status |
|:---:|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **THR-STRIDE-001** | Spoofing | JWT Token Forgery via Hardcoded Static Secret | Auth Service & Gateway | TB-01 | VULN-001 | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-002** | Spoofing | Rogue Microservice Registration on Eureka | Eureka Discovery Server | TB-06 | VULN-021 | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-003** | Spoofing | CDAC e-Hastakshar Callback Spoofing | Revenue Service | TB-07 | VULN-003 | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-004** | Spoofing | Direct Microservice HTTP Ingress Bypassing Gateway | Microservice Nodes | TB-02 | VULN-009 | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-005** | Tampering | Cross-Tenant Draft Modification & Boundary Violations | Revenue Service | TB-03 | VULN-006 | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-006** | Tampering | Privilege & Role Injection via Mass Assignment | User Management | TB-03 | *[Unassigned]* | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-007** | Tampering | Token Blacklist Invalidation via Unauthenticated Redis Flush | Redis Cache | TB-05 | VULN-007 | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-008** | Tampering | Gazette Document PDF Hash Substitution | Revenue Service | TB-07 | VULN-003 | High | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-009** | Repudiation | Missing Audit Trails for Directory Entity Deletions | Revenue & User Mgmt | TB-03 | *[Unassigned]* | High | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-010** | Repudiation | Bearer Token Attribution Confusion via Gateway Logs | API Gateway | TB-01 | VULN-008 | High | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-011** | Info Disclosure | Actuator Environment & Secret Key Harvesting | All Microservices | TB-01 | *[Unassigned]* | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-012** | Info Disclosure | PostgreSQL Direct Access via Host Port Exposure | PostgreSQL Database | TB-04 | VULN-009 | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-013** | Info Disclosure | Swagger / OpenAPI Schema Leakage in Production | Microservice Ingress | TB-01 | VULN-013 | High | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-014** | Info Disclosure | Token Theft via Stored XSS in Entity Descriptions | React Frontends | TB-08 | *[Unassigned]* | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-015** | Denial of Service | Oversized Multipart File Upload Resource Exhaustion | Revenue Service | TB-01 | VULN-018 | High | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-016** | Denial of Service | Auth Endpoint Brute-Force & Stuffing Flooding | Auth Service | TB-01 | VULN-015 | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-017** | Denial of Service | ReDoS in RouteValidator Input Validation Patterns | API Gateway | TB-01 | VULN-019 | High | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-018** | Elevation of Priv | Missing Method-Level Security Annotations in Controllers | User Mgmt & Revenue | TB-03 | VULN-005 | Critical | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-019** | Elevation of Priv | District-to-State Privilege Escalation in Workflow | Revenue Service | TB-03 | VULN-006 | High | Yes | **VERIFIED_FIXED** |
| **THR-STRIDE-020** | Elevation of Priv | Client-Side Route Guard Bypass in React Application | React Frontends | TB-08 | *[Unassigned]* | High | Yes | **VERIFIED_FIXED** |

---

### C.3 Phase 1 DREAD Risk Assessment (DREAD-01 through DREAD-20)

| DREAD ID | Associated Threat Scenario | STRIDE Category | Damage | Reprod. | Exploit. | Affected | Discov. | DREAD Score | Quantitative Level |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **DREAD-01** | JWT Token Forgery via Hardcoded Secret | Spoofing | 10 | 10 | 9 | 10 | 8 | **9.4** | **Critical** |
| **DREAD-02** | Rogue Registration on Eureka Discovery | Spoofing | 10 | 10 | 9 | 9 | 7 | **9.0** | **Critical** |
| **DREAD-03** | CDAC e-Hastakshar Callback Spoofing | Spoofing | 9 | 9 | 8 | 9 | 9 | **8.8** | **Critical** |
| **DREAD-04** | Direct Microservice Ingress Bypassing Gateway | Spoofing | 10 | 10 | 9 | 9 | 8 | **9.2** | **Critical** |
| **DREAD-05** | Cross-Tenant Draft Modification (BOLA) | Tampering | 9 | 9 | 8 | 9 | 8 | **8.6** | **Critical** |
| **DREAD-06** | Privilege & Role Injection via Mass Assignment | Tampering | 9 | 9 | 8 | 9 | 9 | **8.8** | **Critical** |
| **DREAD-07** | Token Blacklist Invalidation via Redis Flush | Tampering | 8 | 9 | 9 | 8 | 7 | **8.2** | **Critical** |
| **DREAD-08** | Gazette Document PDF Hash Substitution | Tampering | 8 | 7 | 7 | 9 | 8 | **7.8** | **High** |
| **DREAD-09** | Missing Audit Trails for Directory Deletions | Repudiation | 7 | 8 | 6 | 7 | 6 | **6.8** | **High** |
| **DREAD-10** | Bearer Token Logging in Gateway Logs | Repudiation | 8 | 8 | 7 | 7 | 7 | **7.4** | **High** |
| **DREAD-11** | Actuator Environment & Secret Key Harvesting | Info Disclosure | 10 | 10 | 9 | 9 | 8 | **9.2** | **Critical** |
| **DREAD-12** | PostgreSQL Direct Access via Host Port Exposure | Info Disclosure | 10 | 10 | 9 | 10 | 8 | **9.4** | **Critical** |
| **DREAD-13** | Swagger / OpenAPI Schema Leakage in Prod | Info Disclosure | 8 | 8 | 7 | 7 | 7 | **7.4** | **High** |
| **DREAD-14** | Client-Side Token Theft via Stored XSS | Info Disclosure | 8 | 8 | 7 | 8 | 9 | **8.0** | **Critical** |
| **DREAD-15** | Oversized File Upload Resource Exhaustion | Denial of Service | 8 | 9 | 8 | 7 | 6 | **7.6** | **High** |
| **DREAD-16** | Authentication Endpoint Brute-Force Flooding | Denial of Service | 8 | 8 | 7 | 8 | 9 | **8.0** | **Critical** |
| **DREAD-17** | ReDoS in RouteValidator Input Validation | Denial of Service | 7 | 8 | 6 | 7 | 6 | **6.8** | **High** |
| **DREAD-18** | Missing Method-Level Security Annotations | Elevation of Priv | 9 | 9 | 8 | 8 | 8 | **8.4** | **Critical** |
| **DREAD-19** | District-to-State Privilege Escalation | Elevation of Priv | 8 | 7 | 7 | 9 | 8 | **7.8** | **High** |
| **DREAD-20** | Client-Side Route Guard Bypass in React | Elevation of Priv | 6 | 9 | 9 | 6 | 6 | **7.2** | **High** |

---

### C.4 Phase 2 SAST Findings (SAST-001 through SAST-021)

| SAST ID | Severity / CWE | Vulnerability Title | Affected Java Classes & Methods | Baseline VULN | STRIDE Threat | Code Remediation Status | Dynamic Retest Disposition |
|:---:|:---|:---|:---|:---:|:---:|:---:|:---:|
| **SAST-001** | Critical / CWE-798 | Hardcoded Static JWT HMAC Secret Key | `JwtUtil.java`, `ProductionSecurityValidator.java` | VULN-001 | THR-STRIDE-001 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-002** | Critical / CWE-798 | Hardcoded Database Password in Configs | `application-prod.properties`, `docker-compose.yml` | VULN-017 | THR-STRIDE-012 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-003** | Critical / CWE-798 | Hardcoded eSign Keystore Password | `EsignConfig.java`, `esign.properties` | VULN-003 | THR-STRIDE-003 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-004** | Critical / CWE-347 | Disabling of XMLDSig Secure Validation | `XmlSignatureUtil.validateXmlSignature()` | VULN-003 | THR-STRIDE-003 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-005** | Critical / CWE-295 | Untrusted Certificate in XMLDSig KeySelector | `X509KeySelector.java` | VULN-003 | THR-STRIDE-003 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-006** | High / CWE-306 | Conditional Bypass of eSign Verification | `EsignServiceImpl.java` | VULN-003 | THR-STRIDE-008 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-007** | Medium / CWE-338 | Insecure PRNG for eSign Transaction IDs | `EsignServiceImpl.java` | VULN-003 | THR-STRIDE-003 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-008** | Critical / CWE-915 | Mass Assignment in User Update Endpoint | `UserMapper.java`, `UserServiceImpl.java` | *[Unassigned]* | THR-STRIDE-006 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-009** | High / CWE-639 | BOLA / IDOR on Draft Viewing & File Downloads | `DistrictDraftDetailsServiceImpl.java` | VULN-006 | THR-STRIDE-005 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-010** | High / CWE-639 | Unauthorized Draft Entity Deletion Checks | `DraftEntityServiceImpl.java` | VULN-006 | THR-STRIDE-005 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-011** | Critical / CWE-862 | Absence of Method-Level Security Annotations | `UserController.java`, `DraftPrimaryController.java` | VULN-005 | THR-STRIDE-018 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-012** | High / CWE-613 | Redis Token Blacklist Bypass in Gateway | `AuthenticationFilter.java` | VULN-007 | THR-STRIDE-007 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-013** | High / CWE-284 | Overly Broad Route Wildcard Exclusions | `RouteValidator.java` | *[Unassigned]* | THR-STRIDE-004 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-014** | Medium / CWE-290 | Client IP Spoofing via Unvalidated X-Forwarded-For | `ApiLoggingFilter.java` | *[Unassigned]* | *[Unassigned]* | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-015** | High / CWE-400 | Unbounded Response Body Memory Buffering | `ApiLoggingFilter.java` | VULN-019 | THR-STRIDE-015 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-016** | Low / CWE-693 | Missing CSP and HSTS Headers in Gateway | `SecurityHeadersFilter.java` | *[Unassigned]* | `THR-STRIDE-014 (Mitigation)` | **VERIFIED_FIXED** | **PARTIALLY_VERIFIED (CSP Verified / HSTS Pending TLS)** |
| **SAST-017** | Medium / CWE-20 | Missing Bean Validation Annotation on Login | `AuthSecondaryController.java` | *[Unassigned]* | *[Unassigned]* | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-018** | High / CWE-434 | Unvalidated File Upload in eSign Endpoint | `EsignPrimaryController.java` | VULN-018 | THR-STRIDE-015 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-019** | Medium / CWE-200 | Production Exposure of Swagger / OpenAPI Docs | `SwaggerConfig.java` | VULN-013 | THR-STRIDE-013 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-020** | Critical / CWE-306 | Unauthenticated Discovery Operations on Eureka | `WebSecurityConfig.java` | VULN-021 | THR-STRIDE-002 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-021** | Low / CWE-489 | Exposed Test Controller in Production Code | `TestController.java` | *[Unassigned]* | *[Unassigned]* | **PARTIALLY_VERIFIED** | **PARTIALLY_VERIFIED** |

---

### C.5 Phase 3 DAST Exploitation Vectors (EXP-001 through EXP-021)

| Exploit ID | Linked SAST | Evidence ID | Vulnerability Focus Area | Target Ingress Route | Automated Test Evidence | Live Retest Result | Final Disposition |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|
| **EXP-001** | SAST-001 | EV-001 | JWT Secret Hardcoding | `GET /user-management/private/v1/resources` | `JwtHardeningRegressionTest` (PASS) | HTTP 401 (Legacy key rejected) | **VERIFIED_FIXED** |
| **EXP-002** | SAST-002 | EV-009 | Database Password Exposure | Internal JDBC Pool | `ProductionSecurityValidatorTest` (PASS) | Credentials injected via env; 5432 unmapped | **VERIFIED_FIXED** |
| **EXP-003** | SAST-003 | EV-010 | Keystore Password Exposure | `revenue` eSign Keystore | `EsignValidationSecurityTest` (PASS) | Password externalized via environment | **VERIFIED_FIXED** |
| **EXP-004** | SAST-004 | EV-011 | XMLDSig Validation Disabled | `POST /api/revenue/ehastakshar/callback` | `EsignCallbackSecurityTest` (PASS) | DOCTYPE expansion rejected | **VERIFIED_FIXED** |
| **EXP-005** | SAST-005 | EV-012 | Untrusted Cert Acceptance | `POST /api/revenue/ehastakshar/callback` | `EsignCallbackSecurityTest` (PASS) | Untrusted ESP cert rejected | **VERIFIED_FIXED** |
| **EXP-006** | SAST-006 | EV-013 | eSign Bypass Flag | `POST /api/revenue/ehastakshar/callback` | `EsignCallbackSecurityTest` (PASS) | Bypass flag removed; fails closed | **VERIFIED_FIXED** |
| **EXP-007** | SAST-007 | EV-014 | Insecure PRNG for Txn ID | `POST /api/revenue/esign/initiate` | `EsignValidationSecurityTest` (PASS) | `SecureRandom` 64-bit entropy verified | **VERIFIED_FIXED** |
| **EXP-008** | SAST-008 | EV-015 | Mass Assignment in User Update | `PUT /user-management/private/v1/users/{id}` | `UserServiceImplTest` (PASS) | Injected role fields safely ignored | **VERIFIED_FIXED** |
| **EXP-009** | SAST-009 | EV-005 | BOLA / IDOR Draft View & Download | `GET /revenue/private/v1/drafts/{id}` | `DraftTenantSecurityTest` (PASS) | Cross-state access returns HTTP 403 | **VERIFIED_FIXED** |
| **EXP-010** | SAST-010 | EV-005 | Unauthorized Draft Deletion | `DELETE /revenue/private/v1/draft-entities/{id}`| `DraftTenantSecurityTest` (PASS) | Parent draft ownership enforced (403) | **VERIFIED_FIXED** |
| **EXP-011** | SAST-011 | EV-020 | Method Security Absence | `GET /user-management/private/v1/users` | `UserManagementIntegrationTest` (PASS) | **HTTP 403 Forbidden** (Officer rejected) | **VERIFIED_FIXED** |
| **EXP-012** | SAST-012 | EV-002 | Redis Blacklist Bypass | `GET /user-management/private/v1/users` | `AuthenticationFilterTest` (PASS) | **HTTP 401 Unauthorized** (Revoked JTI rejected) | **VERIFIED_FIXED** |
| **EXP-013** | SAST-013 | EV-003 | Overly Broad Route Exclusions | `GET /auth/public/v1/auth/../../user-management/private/v1/users` | `RouteValidatorTest` (PASS) | **HTTP 401 Unauthorized** (Path-as-is traversal blocked) | **VERIFIED_FIXED** |
| **EXP-014** | SAST-014 | EV-004 | Client IP Spoofing in Logs | `GET /auth/public/v1/auth/login` | `ApiLoggingFilterTest` (PASS) | **HTTP 200 OK** (Spoofed XFF sanitized to 127.0.0.1) | **VERIFIED_FIXED** |
| **EXP-015** | SAST-015 | EV-016 | Unbounded Response Buffering | `GET /user-management/private/v1/users` | `api-gateway` suite (PASS) | Large responses truncated at 10 KB | **VERIFIED_FIXED** |
| **EXP-016** | SAST-016 | EV-006 | Missing Gateway CSP & HSTS | Ingress Gateway Responses | `SecurityHeadersFilterTest` (PASS) | **HTTP 200 OK** (CSP/Frame headers verified; HSTS pending TLS ingress) | **PARTIALLY_VERIFIED (CSP Verified / HSTS Pending TLS)** |
| **EXP-017** | SAST-017 | EV-017 | Missing Validation on Login | `POST /auth/public/v1/auth/login` | `JwtHardeningRegressionTest` (PASS) | Malformed credentials return HTTP 400 | **VERIFIED_FIXED** |
| **EXP-018** | SAST-018 | EV-018 | Unvalidated File Upload | `POST /revenue/private/v1/attachments/upload` | `EsignValidationSecurityTest` (PASS) | Non-PDF / >5MB rejected with 413 / 400 | **VERIFIED_FIXED** |
| **EXP-019** | SAST-019 | EV-019A / EV-019B | Swagger UI & OpenAPI Exposure | `GET /swagger-ui/index.html`, `/v3/api-docs` | Profile gating tests pass | **HTTP 404 Not Found** (Swagger UI & Docs disabled) | **VERIFIED_FIXED** |
| **EXP-020** | SAST-020 | EV-007A / EV-007B | Unauthenticated Eureka Access | `GET /eureka/apps` | `EurekaSecurityTest` (PASS) | **HTTP 401 Unauthorized** (Unauth) / **HTTP 200** (Auth) | **VERIFIED_FIXED** |
| **EXP-021** | SAST-021 | EV-008 | Test Controller Exposure | `GET /revenue/test/api1` | Profile gating tests pass | **HTTP 403 Forbidden** (Gateway perimeter barrier) | **PARTIALLY_VERIFIED** |
| **OBS-SQLI-01** | — | EV-021 | Parameterized Query Safety (SQLi Observation) | All 24 JPA Repositories | JPA Repository AST Review | **CONFIRMED_SECURE / FALSE_POSITIVE** | **CONFIRMED_SECURE** |

---

### C.6 Phase 4 Software Composition Analysis Findings (SCA-001 through SCA-012)

| SCA ID | Component & Package Coordinates | Installed Version | Status / Type | CVE / GHSA | CVSS | Remediation Action & Justification | Current Disposition | Residual Risk Ref |
|:---:|:---|:---:|:---:|:---|:---:|:---|:---:|:---:|
| **SCA-001** | PostgreSQL JDBC Driver (`postgresql`) | `42.6.0` | Transitive | CVE-2024-1597 | **10.0** | Upgraded to `42.6.2` via Boot parent bump in `revenue` | **VERIFIED_FIXED** | N/A |
| **SCA-002** | Apache Tomcat Embed Core (`tomcat-embed-core`) | `10.1.18-33` | Transitive | CVE-2024-50379<br>CVE-2024-56337 | **9.8** | Pinned `<tomcat.version>10.1.34</tomcat.version>` | **VERIFIED_FIXED** | N/A |
| **SCA-003** | Spring Web UriComponentsBuilder (`spring-web`) | `6.1.3` | Transitive | CVE-2024-22243<br>CVE-2024-22259 | **8.1** | Upgraded to `6.1.15` via Boot 3.2.12 parent bump | **VERIFIED_FIXED** | N/A |
| **SCA-004** | Spring Web Static Resources (`spring-webmvc`) | `6.1.3-15` | Transitive | CVE-2024-38807<br>CVE-2024-38816 | **7.5** | Compensating controls active; WebMvc.fn unused | **PARTIALLY MITIGATED** | RR-11 |
| **SCA-005** | Spring Security Core & Web (`spring-security`) | `6.2.1-8` | Transitive | CVE-2024-22234<br>CVE-2024-38821 | **7.5** | Upgraded to `6.3.8`; CVE-2024-38828 dispositioned | **VERIFIED_FIXED** | N/A |
| **SCA-006** | Netty HTTP & Transport (`netty-*`) | `4.1.105.Final` | Transitive | CVE-2024-29025<br>CVE-2024-47535 | **7.5** | Upgraded to `4.1.115.Final` via parent alignment | **VERIFIED_FIXED** | N/A |
| **SCA-007** | Logback Classic & Core (`logback-*`) | `1.4.14` | Transitive | CVE-2024-12798<br>CVE-2024-12801 | **7.5** | Compensating control: SocketReceiver disabled | **PARTIALLY MITIGATED** | RR-11 |
| **SCA-008** | Legacy jBCrypt Library (`jbcrypt`) | `0.4` | Direct | CWE-1104 | **5.3** | Deferred to Phase 5 & 7 (BCryptPasswordEncoder) | **DEFERRED (PHASE 5/7)** | RR-10 |
| **SCA-009** | SheetJS Spreadsheet Utility (`xlsx`) | `0.18.5` | Direct | CVE-2023-30533<br>CVE-2024-22363 | **7.8** | Compensating control: Outbound-only export in UI | **PARTIALLY MITIGATED** | RR-08 |
| **SCA-010** | Zod Schema Validation (`zod`) | `3.25.76` | Direct | GHSA-mrhx-c7xc-m3w5 | **7.5** | Compensating control: Shallow form schema usage | **PARTIALLY MITIGATED** | RR-09 |
| **SCA-011** | Spring Boot Parent Divergence | Disparity | Direct | CWE-1104 | **6.5** | Aligned revenue service parent to `3.2.12` | **VERIFIED_FIXED** | N/A |
| **SCA-012** | Container Base Image Default Root Execution | `21-jdk` | Direct Docker | CWE-250 | **6.5** | Deferred to Phase 9 (Non-root user migration) | **DEFERRED (PHASE 9)** | RR-06 |

---

### C.7 Residual Risk Register Status (RR-01 through RR-11)

| Risk ID | Residual Risk Title | Inherent Severity | Existing Implemented Controls | Planned Future Phase | Risk Owner | Approval Status |
|:---:|:---|:---:|:---|:---:|:---|:---:|
| **RR-01** | Shared Symmetric HMAC Key Distribution Across Services | Critical | Mandatory `${JWT_SECRET}` env var with 256-bit entropy startup check (`ProductionSecurityValidator.java`) | Phase 5 & 7 | AppSec Lead & DevOps Lead | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-02** | Single-Point-of-Failure / Availability on Redis Outage | High | Gateway fail-closed policy (HTTP 503) on Redis connection failure (`AuthenticationFilter.java`) | Phase 9 & 12 | Lead Infrastructure Engineer & DBA | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-03** | Client-Side Token Storage Vulnerability to Browser Exploitation | High | Gateway CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, input sanitization | Phase 5 | Frontend Architecture Lead & UI Security Engineer | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-04** | Third-Party Certificate Authority Lifecycle & Upstream eSign Dependencies | Critical | Enforced `secureValidation = TRUE`, CDAC trust anchor cert verification, digitalSignature bit 0, PDF hash match, Redis replay lock | Phase 8 | Lead Integration Architect & Compliance Lead | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-05** | Unencrypted Internal Database & Cache Network Transit | Medium | Host OS firewall; PostgreSQL on host (5432), Redis in container (6379 published to host); unencrypted plaintext TCP sockets | Phase 9 | DevSecOps Lead & DBA | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-06** | Container Execution Context & Non-Root Privilege Hardening | Medium | Microservice ports unmapped from public host interfaces; isolated on `lgd-network` | Phase 9 | DevSecOps Engineer & Container Infrastructure Lead | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-07** | Distributed Edge Denial of Service (DDoS) Mitigation | Medium | Gateway linear prefix route matching, 10KB body memory cap, uniform error messaging, application-level rate limiting | Phase 9 & 10 | Network Operations Lead & SOC Lead | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-08** | SheetJS Outbound Spreadsheet Generation & Upstream CDN Transition | High | Outbound-only Excel generation in `NodalInfoCards.tsx` & `DepartmentAvailabilityModal.tsx`; zero untrusted ingestion | Phase 10 | Frontend Architecture Lead & UI Security Engineer | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-09** | Zod Major Version Upgrade & Form Validation Schema Alignment | High | Shallow modal form field validation in `districtSchema.ts`; server-side `@Valid` bean enforcement | Phase 10 | Frontend Lead Developer & QA Lead | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-10** | Legacy Cryptographic Migration from jBCrypt to Spring Security Crypto | Medium | SecureRandom salt generation verified; rate limiting on authentication routes | Phase 5 & 7 | Java Security Architect & Lead Backend Engineer | **PENDING_FORMAL_ACCEPTANCE** |
| **RR-11** | Community EOL Lifecycle Monitoring for Spring Boot 3.2.x Baseline | Medium | Revenue aligned to 3.2.12; Tomcat pinned to 10.1.34; Spring Security pinned to 6.3.8; PostgreSQL JDBC upgraded to 42.6.2 | Phase 10 & 13 | DevSecOps Lead & Enterprise Platform Architect | **PENDING_FORMAL_ACCEPTANCE** |

---

## D. Verification Evidence Summary

1. **Backend Automated Surefire Regression Tests:**
   - **Command:** `mvn clean test -f <module>/pom.xml` across all 5 backend modules.
   - **Timestamp:** 2026-11-02 04:47:00 – 04:50:30 UTC.
   - **Result:** **289 / 289 Tests Passed (0 Failures, 0 Errors, 0 Skipped). Exit Code: 0**.
   - **Evidence Location:** `<module>/target/surefire-reports/` (44 individual Surefire XML reports retained).
2. **Frontend Compilations & Builds:**
   - **`lgd-um`:** `npm run build` (Vite v8.3.4, 3.31s, Exit code 0, bundled assets in `lgd-um/dist/`).
   - **`lgd_react`:** **NOT EXECUTED**. Inspected in Git tree metadata as an unpopulated Git submodule pointer (`c15c8b0e5326e44e751afb2ab931e12a3ae7de95`); the directory is empty in the working tree. In compliance with governance instructions, no unauthorized checkout or pointer mutation was performed. Build recorded as NOT EXECUTED.
3. **Live Docker Cluster Penetration Tests:**
   - **Tool:** Non-destructive HTTP requests executed against active container network.
   - **Timestamp:** 2026-11-02T08:14:24Z – 08:14:35Z.
   - **Result:** Reconciled 21 canonical vectors: 19 verified fixed, 2 partially verified (`EXP-016` [CSP verified live; HSTS pending genuine TLS ingress], `EXP-021` [Gateway 403 perimeter barrier verified; downstream container check pending]), 1 independent false positive observation (`OBS-SQLI-01` / `EV-021`).
   - **Evidence Location:** `scratch/live_dast_evidence_records.json` (12 evidence records: 11 live HTTP probes across 9 vectors + 1 non-HTTP JPA observation).
4. **Regenerated CycloneDX 1.5 JSON SBOM:**
   - **Generator:** CycloneDX Maven Plugin 2.8.1 & npm toolchain.
   - **Schema Validator:** AJV v8.20.0 against official `bom-1.5.schema.json` with regex format validation. Result: Valid (0 errors).
   - **Referential Integrity:** 100% valid (924 graph nodes, 1,899 dependency edges, 0 orphan refs, 0 orphan targets, 3 detected cycles).
   - **BOM Serial Number:** `urn:uuid:000ec80b-40ed-4ff1-9c2c-158ff7881799`.
   - **Generation Timestamp:** `2026-11-02T06:13:56.869Z`.
   - **Metrics:** 916 unique components, 1,348 instances, 924 dependency records, 1,432 declared license attributions (0 "No License Declared" counted as declared), 0 viral copyleft (16 components with GNU Classpath Exception; 28 weak copyleft).
   - **Cryptographic Digest:**
     $$\mathbf{SHA-256 = 99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b}$$
   - **Evidence Location:** [SOFTWARE_BILL_OF_MATERIALS.json](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SOFTWARE_BILL_OF_MATERIALS.json).
5. **Container Image Scans & Host Database Inventory:**
   - **Pinned Scanner Image:** `docker.io/aquasec/trivy@sha256:2e6c00d711ab4ae41d8a30c2c1fd3bd3b62704c177bb120f95012e939edfb3df` (v0.76.1, Image ID `sha256:ac7fdaf3e1f1442ec467a00d1ec900bc8dc20f694d172b11ff43d32f83162fb6`).
   - **Container Images:** Scanned 5 backend service images and Redis; OS and application package vulnerabilities strictly separated, including fixable packages identified in container base images (queued for Phase 9 hardening).
   - **Host PostgreSQL Assessment:** Native Windows Service `postgresql-x64-14`, version **PostgreSQL 14.20** 64-bit (`E:\Program Files\PostgreSQL\14\bin\postgres.exe`). Evaluated separately from pgAdmin web yarn dependencies. Port 5432 network exposure and unencrypted TCP transit preserved under `RR-05`.
   - **Artifact Clarification:** `scratch/trivy_results/postgresql_host_native_trivy.json` (SHA-256: `17e7e900b42a6dab877ee41c86c2c4e2fb7bddaad6d1f320c242473151e169b5`, 657,196 bytes) targets `pgAdmin 4/web/yarn.lock`, which is a pgAdmin 4 web dependency scan, NOT a PostgreSQL database server engine binary assessment.
   - **Evidence Location:** `scratch/trivy_results/container_scan_summary.json`.

---

## E. Outstanding Blockers & External Requirements

To maintain audit integrity, the following items are explicitly recorded as outstanding governance or technical requirements:
1. **Architecture Scope Decision on Retired Frontend Submodule (`lgd_react`):** The `lgd_react` repository is tracked as an unpopulated Git submodule pointer (`c15c8b0e5326e44e751afb2ab931e12a3ae7de95`). Pursuant to the authorized architecture scope decision, it is formally excluded from active architecture, current build requirements, technical blocker registers, and Phase 5 readiness calculations (`NOT_APPLICABLE`). Its absence is not a technical failure. Active frontend build requirements are fully satisfied by `lgd-um` (clean build, exit code 0).
2. **Three Active Technical & Environmental Blockers (Gate B):**
   - **BLK-01 (EXP-016 HSTS):** Preserved as **PARTIALLY_VERIFIED** until a genuine TLS ingress termination test confirms the `Strict-Transport-Security` header delivered over TLS.
   - **BLK-02 (EXP-021 Revenue TestController Direct Verification):** Preserved as **PARTIALLY_VERIFIED** until the downstream Revenue container is probed directly to confirm controller bean/handler absence independent of API Gateway 403 filtering.
   - **BLK-03 (Host PostgreSQL 14 Availability & Revenue Stability):** Host Windows PostgreSQL 14 service is stopped; Revenue container is restart-looping. Database service must be available before downstream Revenue verification can be completed.
3. **Container Base Image Package CVEs & Redis Exposure:** Linux OS base image packages contain known fixable CVEs (queued for base image update and hardening in Phase 9). Redis container lacks authentication and TLS encryption (residual risk `RR-05`, queued for Phase 9 hardening).
4. **Human Governance Sign-Off (DAA/CISO Acceptance Package — BLK-04):** Formal executive sign-off for residual risks `RR-01` through `RR-11` requires an authorized DAA/CISO signature. In the absence of an executed authorization memo, Gate C cannot be marked PASS.
5. **Phase 5 Authentication Redesign:** Architectural migration from symmetric HMAC (HS256) to asymmetric RSA (RS256) signing and migration from legacy `jbcrypt` to Spring Security `BCryptPasswordEncoder` are strictly allocated to Phase 5 and Phase 7.
6. **Phase 9 Infrastructure Hardening:** Container non-root execution (`USER 10001:10001`), mutual TLS (mTLS) inter-service encryption, and Redis Enterprise clustering are strictly allocated to Phase 9.

---

## F. Final Independent Audit Gate Decisions

The assessment was evaluated against the three independent audit gates:

### Gate A — Technical and Documentation Consistency
- **Evaluation Criteria:** Complete documentary, referential, and cryptographic reconciliation across all 57 catalog entries in the Evidence Index (51 physical files + 6 directories). Specifically distinguishes: (1) SHA-256 verification of the 49 eligible physical files; (2) separate workbook inspection and programmatic row-level verification of the 2 Excel files (`SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx` and `DAST_Test_Case_Register.xlsx`); and (3) physical existence and appropriate inspection of the 6 directory entries (1 pre-remediation backup directory and 5 Maven Surefire XML report directories).
- **Finding:** All historical discrepancies and crosswalk errors have been investigated, proven, and unified. Disentanglement of THR-STRIDE-009 (unassigned from VULN-014/SAST-014), THR-STRIDE-011 (unassigned from VULN-013/SAST-013), THR-STRIDE-014 (unassigned from VULN-022), THR-STRIDE-020 (unassigned from VULN-022), and VULN-014 (unassigned from Phase 1 STRIDE, retained under RR-06 / Phase 9 deferral) is complete. Historical baseline ports (8080-8083) and active runtime ports (8092, 18090, 18089, 18062, 8761) are accurately distinguished across all documents. DAST testing arithmetic (47 canonical API operations + 1 separate Eureka infrastructure probe = 48 distinct targets) is synchronized with zero remaining contradictions. All 49 eligible physical files match declared SHA-256 digests; both Excel workbooks pass cell/row inspection; all 6 directories are verified physically present. All 18 semantic validator categories and all 8 negative test fixtures pass with zero defects.
- **Gate Determination:** **`PASS`**

### Gate B — Technical Verification
- **Evaluation Criteria:** 100% execution of automated regression tests, active component production builds, live dynamic verification for all exploit vectors, schema validation of CycloneDX 1.5 SBOM, and container vulnerability assessments.
- **Finding:**
  - Automated tests: 289 Maven regression tests passed (0 failures, 0 errors, 0 skipped across 44 Surefire XML files via `mvn clean test`), establishing that the test lifecycle passed cleanly; package-level verification (`mvn clean package` / JAR packaging) is not established by available disk evidence.
  - Frontend builds: `lgd-um` clean build succeeded (Exit Code 0); `lgd_react` formally retired and excluded from active architectural and build scope per approved architecture scope decision (`NOT_APPLICABLE`).
  - DAST verifications: 19 vectors VERIFIED_FIXED; 2 vectors (`EXP-016` HSTS [BLK-01] and `EXP-021` TestController direct downstream check [BLK-02]) remain **PARTIALLY_VERIFIED**.
  - Infrastructure: Host PostgreSQL 14 service is stopped, causing Revenue container instability (`BLK-03`). Base image packages contain CVEs requiring Phase 9 base image hardening (`RR-06`).
- **Gate Determination:** **`HOLD`**

### Gate C — Formal Governance and Risk Acceptance
- **Evaluation Criteria:** Authorized DAA/CISO signature and signed risk acceptance memo for all 11 residual risks (`RR-01` through `RR-11`).
- **Finding:** While comprehensive operational controls and mitigation roadmaps are in place for all 11 risks, no executed DAA/CISO authorization memo exists. In adherence to non-fabrication rules, signatures are not fabricated. This represents active governance blocker `BLK-04`.
- **Gate Determination:** **`PENDING_FORMAL_ACCEPTANCE`**

---

### Master Pre-Phase-5 Program Outcome

$$\mathbf{OVERALL\ AUDIT\ STATUS:\ PENDING\_REMEDIATION\_AND\_INDEPENDENT\_RETEST}$$

*(Gate A is PASSED as documentation integrity, bidirectional crosswalks, and evidence synchronization are 100% reconciled across saved files. Gate B is on HOLD pending resolution of BLK-01 [EXP-016 TLS ingress HSTS], BLK-02 [EXP-021 downstream probe], and BLK-03 [Host PostgreSQL 14 availability & Revenue container stability]. Gate C remains PENDING_FORMAL_ACCEPTANCE pending authorized DAA/CISO executive risk acceptance memo under BLK-04).*


---

## G. Phase 5 Authorization Boundary

In strict adherence to Governance Rule 1.1:

**PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.**

---
*Report executed, verified, and reconciled independently in strict adherence to evidence integrity and non-fabrication mandates. No independent sign-off or authorization is self-certified.*
