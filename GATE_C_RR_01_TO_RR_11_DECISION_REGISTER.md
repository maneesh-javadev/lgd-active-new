# LGD 2.0 — Gate C Decision Register: Formal Risk Decision Packages (RR-01 through RR-11)

| **Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | Gate C Formal Decision Package Register |
| **Evaluation Date** | November 3, 2026 (`2026-11-03T17:44:00+05:30`) |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Authoritative Basis** | NIST SP 800-30 Rev. 1, ISO/IEC 27005 |
| **Lead Governance Evaluator** | Security Governance and Risk Management Specialist |
| **Gate C Status** | **`GATE C: PENDING_FORMAL_ACCEPTANCE`** |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Governance Framework & Decision Package Structure

In accordance with strict risk management mandates, this register contains the **11 individual formal decision packages** for residual risks `RR-01` through `RR-11`.

Each individual decision package contains five standardized sections:
- **Part A:** Risk Identification & Asset Boundary
- **Part B:** Risk Analysis (Inherent vs. Residual)
- **Part C:** Risk Treatment & Compensating Controls
- **Part D:** Formal Draft Acceptance Statement
- **Part E:** Official Approval Fields (Maintained as `PENDING` / Blank)

---

## 2. Individual Decision Packages (RR-01 through RR-11)

---

### Decision Package RR-01: Shared Symmetric HMAC Key Distribution

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-01`
- **Risk Description:** Static HMAC-SHA256 signing secret shared symmetrically across multiple microservices.
- **Affected Assets / Services:** `api-gateway`, `auth-service`, `user-management`, `revenue`.
- **Business Function:** User authentication, identity propagation, and role-based access control.
- **Related Findings & Evidence:** Baseline `VULN-001`, SAST `SAST-001`, Exploit `EXP-001` / `EV-001`, `ProductionSecurityValidatorTest` (5/5 PASS).

#### Part B: Risk Analysis
- **Inherent Likelihood:** High | **Inherent Impact:** Critical | **Inherent Rating:** **Critical (9.4)**
- **Existing Security Controls:** Static properties cleaned; mandatory `${JWT_SECRET}` enforced with $\ge 256$ bits entropy via [ProductionSecurityValidator.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/config/ProductionSecurityValidator.java).
- **Residual Likelihood:** Low | **Residual Impact:** High | **Residual Rating:** **Low (3.2)**
- **Remaining Weakness:** Symmetric HS256 algorithm requires all verifying microservices to possess the exact secret. Compromise of a single downstream container allows cluster-wide token forgery.

#### Part C: Risk Treatment
- **Mitigation Completed:** Externalized secret configuration; startup failure on weak keys.
- **Outstanding Remediation:** Architectural migration to asymmetric RSA (RS256) or Ed25519.
- **Compensating Controls:** Container file permissions; container network isolation; quarterly secret rotation per `Secrets_Rotation_Plan.md`.
- **Monitoring Plan:** SIEM log alerts on unexpected authentication failures or token decryption exceptions.
- **Contingency Plan:** Emergency key revocation and immediate secret re-injection via orchestration vault.
- **Review Frequency:** 90 Days or Phase 5 Gate Review.
- **Recommended Treatment:** **Mitigate** (Phase 5 & 7).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** Application Security Lead
- **DAA/CISO Name:** ________________________________________ | **Designation:** DAA / CISO
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** January 28, 2027

---

### Decision Package RR-02: Single-Point-of-Failure / Availability Risk on Redis Outage

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-02`
- **Risk Description:** Complete denial of service across authenticated routes if Redis cache fails or disconnects.
- **Affected Assets / Services:** `api-gateway`, `redis:alpine` container.
- **Business Function:** Distributed token revocation, logout enforcement, and ingress rate limiting.
- **Related Findings & Evidence:** Baseline `VULN-007`, SAST `SAST-012`, Exploit `EXP-012` / `EV-002`, `AuthenticationFilterTest` (7/7 PASS).

#### Part B: Risk Analysis
- **Inherent Likelihood:** Medium | **Inherent Impact:** High | **Inherent Rating:** **High (8.2)**
- **Existing Security Controls:** Fail-closed policy in `AuthenticationFilter.java` returning `HTTP 503` on Redis disconnection.
- **Residual Likelihood:** Low | **Residual Impact:** Medium | **Residual Rating:** **Low (2.8)**
- **Remaining Weakness:** A single-node Redis failure halts all authenticated user traffic across the LGD 2.0 platform.

#### Part C: Risk Treatment
- **Mitigation Completed:** Security bypass prevented via fail-closed architecture.
- **Outstanding Remediation:** Multi-node Redis Sentinel or Redis Enterprise HA clustering.
- **Compensating Controls:** Redis loopback binding `127.0.0.1:6379`; AOF persistence enabled; Docker healthcheck.
- **Monitoring Plan:** Automated healthcheck probe alerting on Redis latency > 50ms.
- **Contingency Plan:** Automated container restart policies in Docker Compose.
- **Review Frequency:** 90 Days or Phase 9 Gate Review.
- **Recommended Treatment:** **Mitigate** (Phase 9).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** Lead Infrastructure Engineer
- **DAA/CISO Name:** ________________________________________ | **Designation:** CISO / Infrastructure Steering Committee
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** January 28, 2027

---

### Decision Package RR-03: Client-Side Token Storage Vulnerability to Browser Exploitation

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-03`
- **Risk Description:** JWT bearer tokens stored in browser `localStorage` / `sessionStorage` vulnerable to DOM inspection or script compromise.
- **Affected Assets / Services:** Web Client Applications (`lgd-um`, `lgd_react`).
- **Business Function:** Client session persistence and officer API authorization.
- **Related Findings & Evidence:** `SecurityHeadersFilterTest` (1/1 PASS), Gateway live response headers.

#### Part B: Risk Analysis
- **Inherent Likelihood:** Medium | **Inherent Impact:** High | **Inherent Rating:** **High (8.0)**
- **Existing Security Controls:** Gateway CSP (`default-src 'self'`), `X-Frame-Options: DENY`, 15-minute token expiration.
- **Residual Likelihood:** Low | **Residual Impact:** High | **Residual Rating:** **Low (3.0)**
- **Remaining Weakness:** Tokens stored in browser storage remain accessible to JavaScript in the event of an XSS or supply-chain flaw.

#### Part C: Risk Treatment
- **Mitigation Completed:** Strict perimeter response headers; short token lifetimes.
- **Outstanding Remediation:** Migration of session storage to `HttpOnly; SameSite=Strict; Secure` cookies.
- **Compensating Controls:** Strict CSP restrictions; client-side input sanitization.
- **Monitoring Plan:** Client-side error telemetry and WAF inspection for script injection patterns.
- **Contingency Plan:** Global token revocation via Redis blacklist.
- **Review Frequency:** Phase 5 Gate Review.
- **Recommended Treatment:** **Mitigate** (Phase 5).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** Frontend Architecture Lead
- **DAA/CISO Name:** ________________________________________ | **Designation:** AppSec Board / CISO
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** Phase 5 Gate Review

---

### Decision Package RR-04: Third-Party Certificate Authority Lifecycle & Upstream eSign Dependencies

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-04`
- **Risk Description:** Operational failure of gazette digital signing if external CDAC / CCA trust anchor certificates expire or rollover unexpectedly.
- **Affected Assets / Services:** `revenue` microservice (e-Hastakshar XMLDSig verification engine).
- **Business Function:** Digital gazette order publication and legal officer document signing.
- **Related Findings & Evidence:** Baseline `VULN-003`, SAST `SAST-003`–`007`, Exploit `EXP-003`–`007`, `EsignCallbackSecurityTest` (13/13 PASS).

#### Part B: Risk Analysis
- **Inherent Likelihood:** Medium | **Inherent Impact:** Critical | **Inherent Rating:** **Critical (8.8)**
- **Existing Security Controls:** `secureValidation = true`, CDAC trust anchor chaining, validity period check, `digitalSignature` keyUsage enforcement, Redis replay lock.
- **Residual Likelihood:** Low | **Residual Impact:** High | **Residual Rating:** **Low (2.5)**
- **Remaining Weakness:** Unannounced upstream CDAC certificate changes or CRL network partitions will halt signing workflows.

#### Part C: Risk Treatment
- **Mitigation Completed:** Cryptographic validation and replay prevention fully enforced.
- **Outstanding Remediation:** Automated certificate expiration alerting and staging pre-verification.
- **Compensating Controls:** Manual administrative override protocol under formal legal declaration.
- **Monitoring Plan:** Weekly automated verification of CDAC root certificate validity.
- **Contingency Plan:** Fallback to offline gazette publication pending certificate renewal.
- **Review Frequency:** Phase 8 Gate Review.
- **Recommended Treatment:** **Accept & Monitor** (Phase 8).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** Lead Integration Architect
- **DAA/CISO Name:** ________________________________________ | **Designation:** Ministry DAA / Project Director
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** Phase 8 Gate Review

---

### Decision Package RR-05: Unencrypted Internal Database & Cache Network Transit

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-05`
- **Risk Description:** Plaintext TCP transit of PostgreSQL JDBC queries and Redis cache payloads between containers and host.
- **Affected Assets / Services:** PostgreSQL 14 (Port `5432`), Redis (Port `6379`), microservice bridge.
- **Business Function:** Persistent relational data storage and distributed caching.
- **Related Findings & Evidence:** Baseline `VULN-009`, `VULN-017`, SAST `SAST-002`, Exploit `EXP-002`, `docker-compose.yml`.

#### Part B: Risk Analysis
- **Inherent Likelihood:** Medium | **Inherent Impact:** Medium | **Inherent Rating:** **Medium (6.5)**
- **Existing Security Controls:** Internal container ports unmapped; services isolated on `lgd-network`; Redis loopback-bound.
- **Residual Likelihood:** Low | **Residual Impact:** Medium | **Residual Rating:** **Low (2.2)**
- **Remaining Weakness:** Host-level network sniffing can observe raw SQL queries and token revocation blacklists in transit.

#### Part C: Risk Treatment
- **Mitigation Completed:** Network perimeter unmapped; bridge isolation active.
- **Outstanding Remediation:** Configuration of PostgreSQL JDBC `sslmode=require` and Redis TLS encryption.
- **Compensating Controls:** Windows host firewall; MFA-protected administrative host access.
- **Monitoring Plan:** Network intrusion detection monitoring internal bridge interfaces.
- **Contingency Plan:** Immediate firewall isolation of host ports 5432 and 6379.
- **Review Frequency:** Phase 9 Gate Review.
- **Recommended Treatment:** **Mitigate** (Phase 9).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** DevSecOps Lead & DBA
- **DAA/CISO Name:** ________________________________________ | **Designation:** Security Operations Board / CISO
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** Phase 9 Gate Review

---

### Decision Package RR-06: Container Execution Context & Non-Root Privilege Hardening

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-06`
- **Risk Description:** Containers executing Java application processes as default root user (`UID 0`), increasing container breakout risk.
- **Affected Assets / Services:** All 5 microservice Docker containers (`eclipse-temurin:21-jdk`).
- **Business Function:** Containerized application hosting and process execution.
- **Related Findings & Evidence:** Baseline `VULN-014`, SCA `SCA-012`, Trivy container scans (`scratch/trivy_results/`).

#### Part B: Risk Analysis
- **Inherent Likelihood:** Medium | **Inherent Impact:** Medium | **Inherent Rating:** **Medium (6.5)**
- **Existing Security Controls:** Ports unmapped from host; Docker bridge network segmentation; no privileged flags.
- **Residual Likelihood:** Low | **Residual Impact:** Medium | **Residual Rating:** **Low (2.4)**
- **Remaining Weakness:** Processes run as UID 0; a chained RCE and kernel flaw could allow container breakout to host root.

#### Part C: Risk Treatment
- **Mitigation Completed:** External host attack surface minimized via port unmapping.
- **Outstanding Remediation:** Dockerfile refactoring with dedicated non-root user (`USER spring:spring`, UID 10001).
- **Compensating Controls:** Docker `--security-opt no-new-privileges:true`; dropped Linux capabilities.
- **Monitoring Plan:** Container runtime audit logging (Auditd / Falco).
- **Contingency Plan:** Automated container termination on anomalous system call detection.
- **Review Frequency:** Phase 9 Gate Review.
- **Recommended Treatment:** **Mitigate** (Phase 9).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** DevSecOps Engineer & Container Lead
- **DAA/CISO Name:** ________________________________________ | **Designation:** DevSecOps Steering Group / CISO
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** Phase 9 Gate Review

---

### Decision Package RR-07: Distributed Edge Denial of Service (DDoS) Mitigation

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-07`
- **Risk Description:** Perimeter flooding attacks exceeding API Gateway bandwidth or socket descriptor limits.
- **Affected Assets / Services:** `api-gateway` ingress listener (Port `8092`).
- **Business Function:** Perimeter routing, reverse proxy, and ingress rate limiting.
- **Related Findings & Evidence:** Baseline `VULN-015`, SAST `SAST-015`, Exploit `EXP-015`, `ApiLoggingFilterTest` (4/4 PASS).

#### Part B: Risk Analysis
- **Inherent Likelihood:** High | **Inherent Impact:** Medium | **Inherent Rating:** **Medium (6.8)**
- **Existing Security Controls:** Netty buffer ceiling (64 KB); Redis token-bucket rate limiter on public auth routes.
- **Residual Likelihood:** Low | **Residual Impact:** Medium | **Residual Rating:** **Low (2.5)**
- **Remaining Weakness:** Application-level rate limiting cannot absorb multi-gigabit volumetric SYN floods.

#### Part C: Risk Treatment
- **Mitigation Completed:** Application-level request buffering ceiling and route-level rate limiting active.
- **Outstanding Remediation:** Upstream enterprise WAF / DDoS mitigation integration.
- **Compensating Controls:** Upstream network firewall; edge router SYN flood protection.
- **Monitoring Plan:** Network bandwidth utilization monitoring with automated NOC alerts.
- **Contingency Plan:** Upstream BGP blackholing / Cloudflare / NIC National Cloud scrubbing center diversion.
- **Review Frequency:** Phase 9 & 10 Gate Review.
- **Recommended Treatment:** **Transfer** (Phase 9 & 10).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** Network Operations Lead & SOC Lead
- **DAA/CISO Name:** ________________________________________ | **Designation:** NIC Network Security Authority / CISO
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** Phase 9/10 Gate Review

---

### Decision Package RR-08: Outbound Spreadsheet Generation & SheetJS (xlsx) Upstream CDN Transition

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-08`
- **Risk Description:** Pinned npm dependency `xlsx@0.18.5` flagged for Prototype Pollution (CVE-2023-30533) and ReDoS (CVE-2024-22363).
- **Affected Assets / Services:** Client Excel export components (`NodalInfoCards.tsx`, `DepartmentAvailabilityModal.tsx`).
- **Business Function:** Administrative export of department and nodal contact directories.
- **Related Findings & Evidence:** Baseline `VULN-012`, `VULN-023`, SCA `SCA-009`, [SCA_FINDINGS_REGISTER.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_FINDINGS_REGISTER.md).

#### Part B: Risk Analysis
- **Inherent Likelihood:** Medium | **Inherent Impact:** High | **Inherent Rating:** **High (7.8)**
- **Existing Security Controls:** Static analysis confirms `xlsx` is used strictly for outbound file generation (`XLSX.write()`), never input parsing.
- **Residual Likelihood:** Low | **Residual Impact:** Low | **Residual Rating:** **Low (1.5)**
- **Remaining Weakness:** Pinned version flags on automated scanners, creating external compliance inquiries.

#### Part C: Risk Treatment
- **Mitigation Completed:** Data sanitization verified; restricted to outbound export.
- **Outstanding Remediation:** Replacement of SheetJS with the modern `exceljs` library.
- **Compensating Controls:** Content-Security-Policy disallows untrusted script execution; zero server-side parsing.
- **Monitoring Plan:** Continuous SCA monitoring in CI/CD pipelines.
- **Contingency Plan:** Disable client-side spreadsheet export pending library refactoring.
- **Review Frequency:** Phase 10 Gate Review.
- **Recommended Treatment:** **Mitigate** (Phase 10).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** Frontend Architecture Lead
- **DAA/CISO Name:** ________________________________________ | **Designation:** AppSec Board / CISO
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** Phase 10 Gate Review

---

### Decision Package RR-09: Zod Major Version Upgrade & Form Validation Schema Alignment

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-09`
- **Risk Description:** Memory exhaustion vulnerability (GHSA-mrhx-c7xc-m3w5) in `zod@3.25.76` when parsing constrained recursive collections.
- **Affected Assets / Services:** Client-side form validation (`districtSchema.ts`).
- **Business Function:** District metadata entry and form pre-validation.
- **Related Findings & Evidence:** Baseline `VULN-012`, SCA `SCA-010`, [SCA_FINDINGS_REGISTER.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_FINDINGS_REGISTER.md).

#### Part B: Risk Analysis
- **Inherent Likelihood:** Medium | **Inherent Impact:** High | **Inherent Rating:** **High (7.5)**
- **Existing Security Controls:** Zod is used strictly for shallow modal form validation; Spring backend bean validation independently enforces constraints.
- **Residual Likelihood:** Low | **Residual Impact:** Low | **Residual Rating:** **Low (1.8)**
- **Remaining Weakness:** Upgrading to Zod 4.x breaks compatibility with `@hookform/resolvers@^5.9.1`, requiring schema refactoring.

#### Part C: Risk Treatment
- **Mitigation Completed:** Backend validation independently protects database integrity.
- **Outstanding Remediation:** Upgrade to Zod 4.x and alignment of form resolver schemas.
- **Compensating Controls:** HTML DOM `maxlength` attributes bound input sizes.
- **Monitoring Plan:** Automated client-side error telemetry.
- **Contingency Plan:** Fallback to standard HTML5 form validation.
- **Review Frequency:** Phase 10 Gate Review.
- **Recommended Treatment:** **Mitigate** (Phase 10).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** Frontend Lead Developer & QA Lead
- **DAA/CISO Name:** ________________________________________ | **Designation:** AppSec Architecture Board / CISO
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** Phase 10 Gate Review

---

### Decision Package RR-10: Legacy Cryptographic Migration from jBCrypt to Spring Security Crypto

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-10`
- **Risk Description:** Use of unmaintained third-party library `org.mindrot:jbcrypt:0.4` (CWE-1104, unmaintained since 2015).
- **Affected Assets / Services:** `auth-service`, `user-management`.
- **Business Function:** Administrative and user password hashing and verification.
- **Related Findings & Evidence:** SCA `SCA-008`, surefire password regression tests (251/251 PASS).

#### Part B: Risk Analysis
- **Inherent Likelihood:** Low | **Inherent Impact:** Medium | **Inherent Rating:** **Medium (5.3)**
- **Existing Security Controls:** BCrypt hashing performs `SecureRandom` salt generation; passwords pass 251 regression tests.
- **Residual Likelihood:** Low | **Residual Impact:** Low | **Residual Rating:** **Low (2.0)**
- **Remaining Weakness:** Upstream project has had zero security maintenance or updates since 2015.

#### Part C: Risk Treatment
- **Mitigation Completed:** Strong salt entropy verified across test suites.
- **Outstanding Remediation:** Refactoring password hashing to native `BCryptPasswordEncoder`.
- **Compensating Controls:** Authentication rate limiting; password hash column masking in logs.
- **Monitoring Plan:** Continuous monitoring of authentication failure rates.
- **Contingency Plan:** Immediate credential reset in event of hashing algorithm flaw.
- **Review Frequency:** Phase 5 Gate Review.
- **Recommended Treatment:** **Mitigate** (Phase 5 & 7).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** Java Security Architect
- **DAA/CISO Name:** ________________________________________ | **Designation:** Chief Information Security Officer (CISO)
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** Phase 5 Gate Review

---

### Decision Package RR-11: Community EOL Lifecycle Monitoring for Spring Boot 3.2.x Baseline

#### Part A: Risk Identification & Asset Boundary
- **Risk ID:** `RR-11`
- **Risk Description:** Spring Boot 3.2.x reached end of open-source community support in November 2024.
- **Affected Assets / Services:** Core backend microservices (`auth-service`, `revenue`, `user-management`).
- **Business Function:** Microservice runtime foundation, dependency management, and web framework.
- **Related Findings & Evidence:** SCA `SCA-001`, CycloneDX SBOM (`SOFTWARE_BILL_OF_MATERIALS.json`).

#### Part B: Risk Analysis
- **Inherent Likelihood:** Medium | **Inherent Impact:** Medium | **Inherent Rating:** **Medium (6.5)**
- **Existing Security Controls:** Services harmonized to `3.2.12`; Tomcat pinned to `10.1.34`; Spring Security to `6.3.8`; JDBC to `42.6.2`.
- **Residual Likelihood:** Low | **Residual Impact:** Medium | **Residual Rating:** **Low (2.2)**
- **Remaining Weakness:** Future zero-day vulnerabilities in Spring Boot 3.2 core will not receive public open-source patches.

#### Part C: Risk Treatment
- **Mitigation Completed:** Known CVEs in subcomponents patched via Maven property overrides.
- **Outstanding Remediation:** Framework migration to Spring Boot 3.4.x LTS.
- **Compensating Controls:** Granular dependency version pinning; daily vulnerability scanning against NVD.
- **Monitoring Plan:** Automated SBOM vulnerability scanning via CycloneDX.
- **Contingency Plan:** Hotpatching vulnerable classes via ByteBuddy or custom Maven shade relocation.
- **Review Frequency:** 90 Days or Phase 10 Gate Review.
- **Recommended Treatment:** **Mitigate** (Phase 10 & 13).

#### Part D: Formal Draft Acceptance Statement
> *"I acknowledge that the residual risk described in this document remains present after consideration of the documented security controls and mitigation measures. I understand the potential impact and formally accept or reject this risk within my authorized organizational responsibilities and approval scope."*

#### Part E: Formal Approval Fields
- **Risk Owner Name:** ________________________________________ | **Designation:** DevSecOps Lead & Platform Architect
- **DAA/CISO Name:** ________________________________________ | **Designation:** Designated Approving Authority (DAA) / CISO
- **Approval Decision:** `[  ] PENDING`  `[  ] ACCEPTED`  `[  ] REJECTED`
- **Approval Date:** ________________________ | **Signature:** ________________________________________
- **Approval Evidence Reference:** `Pending Formal Sign-off`
- **Review Date:** January 28, 2027

---

## 3. Register Summary & Stopping Statement

All 11 formal decision packages have been generated with complete identification, analysis, treatment plans, and draft acceptance statements.

In accordance with anti-fabrication standards, all approval fields remain **`PENDING`** until executed by authorized government officials.

### Mandatory Stopping Statement:
$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$
