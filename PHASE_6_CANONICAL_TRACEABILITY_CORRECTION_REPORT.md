# LGD 2.0 - Phase 6 Canonical Traceability Correction Report
## Authoritative Restoration of Phase 0–4 Finding Mappings, Exploit Vectors & Evidence Register

| **Audit Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Canonical Finding Traceability & Evidence Correction** |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Audit Review Date** | November 5, 2026 (`2026-11-05T13:30:00+05:30`) |
| **Auditor Role** | Independent Senior Application Security Auditor, Security Documentation Controller & Audit Evidence Reconciliation Specialist |
| **Authoritative Baseline Register** | [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md) (Approved November 2, 2026) |
| **Cataloged Scope** | 21 Canonical SAST/EXP Vectors (`SAST-001`–`021` / `EXP-001`–`021`), 1 Standalone Security Observation (`OBS-SQLI-01`), 16 RBAC Findings (`RBAC-001`–`016`) |
| **Defect Remediation Status** | **100% Canonical Mapping Restored; Erroneous Final Matrix Disentangled** |
| **Mandatory Program Status** | **PHASE 7 NOT STARTED — QUEUED — SEPARATE EXECUTIVE AUTHORIZATION REQUIRED.** |

---

## 1. Executive Summary & Defect Disclosure

Following the independent security review conducted on **05 November 2026**, an audit documentation defect was identified in the Phase 6 documentation suite—specifically in [`PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md). 

### 1.1 Root Cause of the Mapping Defect
In Section 4 of the prior matrix, exploit vectors `EXP-001` through `EXP-021` were populated using an ad-hoc, synthetic nomenclature rather than adhering strictly to the authoritative, approved [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md) and [`API_Vulnerability_Exploitation_Log.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/API_Vulnerability_Exploitation_Log.md). This resulted in severe semantic inversions, such as:
1. `SAST-009` and `SAST-010` (the critical Revenue Draft Viewing and Deletion BOLA vulnerabilities mapped to `EXP-009` and `EXP-010` with evidence `EV-005`) being mislabeled as "Unprotected Internal Actuator Endpoints" and "Hardcoded Fallback Secrets in Gateway".
2. `SAST-011` (the complete absence of method-level `@PreAuthorize` security mapped to `EXP-011` / `EV-020`) being mislabeled as "CORS Misconfiguration Allowing Arbitrary Origins".
3. `SAST-013` (Gateway Authentication Filter Bypass via Traversal in Public Route Wildcard mapped to `EXP-013` / `EV-003`) being erroneously labeled as "Blind SQL Injection in Dynamic Filters".
4. `OBS-SQLI-01` (a standalone observation refuting SQL injection across all 24 JPA repositories, verified under `TC-OBS-SQLI-001` and `EV-021`) being falsely conflated with `SAST-013`.

### 1.2 Correction Mandate
Under the strict governance mandate:
- Finding identities must never be derived from the erroneous matrix.
- All 21 EXP entries must be restored to 100% canonical alignment with the approved Phase 0–4 Master Finding Traceability Register.
- `OBS-SQLI-01` must be restored as an independent confirmed-secure observation with evidence `EV-021` and test case `TC-OBS-SQLI-001`.
- Historical severity values must remain unadulterated (`RBAC-009` preserved as Medium/CVSS 5.3; `RBAC-012` preserved as High/CVSS 7.5).
- Unassigned mappings must remain explicitly marked `*[Unassigned]*` without artificial linkages.

---

## 2. Definitive Canonical Master Traceability Crosswalk

The authoritative crosswalk below restores the exact, approved mapping across all 11 lifecycle dimensions for all 21 SAST findings and the standalone observation.

| SAST ID | EXP ID | EV ID | VULN ID | STRIDE ID | DREAD ID | Canonical Finding Title | Test Case | Target Endpoint / Component | Module(s) | Reconciled Status | Retest Outcome |
|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| `SAST-001` | `EXP-001` | `EV-001` | `VULN-001` | `THR-STRIDE-001` | `DREAD-01` | Forgery of Administrative JWT Token via Hardcoded Signing Key | `TC-SAST-001` | `GET /user-management/private/v1/resources` | `api-gateway, auth-service, user-management, revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-002` | `EXP-002` | `EV-009` | `VULN-017` | `THR-STRIDE-012 (Amplifier)` | `DREAD-12` | Direct Database Ingress via Plaintext Configuration Credentials | `TC-SAST-002` | `TCP / 5432 (PostgreSQL)` | `api-gateway, auth-service, user-management, revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-003` | `EXP-003` | `EV-010` | `VULN-003` | `THR-STRIDE-003` | `DREAD-03` | e-Hastakshar PKCS#12 Keystore Password Extraction | `TC-SAST-003` | `revenue.p12 (Keystore)` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-004` | `EXP-004` | `EV-011` | `VULN-003` | `THR-STRIDE-003` | `DREAD-03` | XML Signature Wrapping (XSW) via Disabled XMLDSig Secure Validation | `TC-SAST-004` | `POST /public/v1/ehastakshar/response` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-005` | `EXP-005` | `EV-012` | `VULN-003` | `THR-STRIDE-003` | `DREAD-03` | Untrusted Certificate Acceptance in XMLDSig KeySelector | `TC-SAST-005` | `POST /public/v1/ehastakshar/response` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-006` | `EXP-006` | `EV-013` | `VULN-003` | `THR-STRIDE-003` | `DREAD-03` | Conditional Bypass of eSign Verification via Configuration Flag | `TC-SAST-006` | `POST /public/v1/ehastakshar/response` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-007` | `EXP-007` | `EV-014` | `VULN-003` | `THR-STRIDE-003` | `DREAD-03` | Insecure PRNG for eSign Transaction IDs | `TC-SAST-007` | `POST /private/v1/ehastakshar/initiate` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-008` | `EXP-008` | `EV-015` | *[Unassigned]* | `THR-STRIDE-006` | `DREAD-06` | Mass Assignment / Privilege Escalation via User Update Endpoint | `TC-SAST-008` | `PUT /user-management/private/v1/users/{id}` | `user-management` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-009` | `EXP-009` | `EV-005` | `VULN-006` | `THR-STRIDE-005` | `DREAD-05` | Broken Object Level Authorization (BOLA/IDOR) on Draft Viewing & File Downloads | `TC-SAST-009` | `GET /revenue/private/v1/draft/district/view/{id}` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-010` | `EXP-010` | `EV-005` | `VULN-006` | `THR-STRIDE-005` | `DREAD-05` | Unauthorized Draft Entity Deletion via Missing Tenant Ownership Checks | `TC-SAST-010` | `DELETE /revenue/private/v1/draft-entities/{id}` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-011` | `EXP-011` | `EV-020` | `VULN-005` | `THR-STRIDE-018` | `DREAD-18` | Complete Absence of Method-Level Security Annotations Across Controllers | `TC-SAST-011` | `GET /user-management/private/v1/users` | `user-management, revenue, auth-service` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-012` | `EXP-012` | `EV-002` | `VULN-007` | `THR-STRIDE-007` | `DREAD-07` | Replay of Revoked JWT Tokens Bypassing Gateway Redis Blacklist | `TC-SAST-012` | `GET /user-management/private/v1/resources` | `api-gateway, auth-service` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-013` | `EXP-013` | `EV-003` | *[Unassigned]* | `THR-STRIDE-004` | `DREAD-04` | Gateway Authentication Filter Bypass via Traversal in Public Route Wildcard | `TC-SAST-013` | `GET /auth/public/v1/auth/../../user-management/private/v1/users` | `api-gateway` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-014` | `EXP-014` | `EV-004` | *[Unassigned]* | *[Unassigned]* | *[Unassigned]* | Audit Log Client IP Spoofing via Unvalidated X-Forwarded-For | `TC-SAST-014` | `GET /user-management/private/v1/resources` | `api-gateway` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-015` | `EXP-015` | `EV-016` | `VULN-019` | `THR-STRIDE-015` | `DREAD-15` | Unbounded Response Body Memory Buffering in Gateway Logging Filter | `TC-SAST-015` | `GET /user-management/private/v1/users` | `api-gateway` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-016` | `EXP-016` | `EV-006` | *[Unassigned]* | `THR-STRIDE-014 (Mitigation)` | `DREAD-14` | Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter | `TC-SAST-016` | `POST /audit/auth/public/v1/auth/login` | `api-gateway` | **PARTIALLY_VERIFIED** | **PARTIALLY_VERIFIED (CSP Verified / HSTS Pending TLS)** |
| `SAST-017` | `EXP-017` | `EV-017` | *[Unassigned]* | *[Unassigned]* | *[Unassigned]* | Missing Bean Validation Annotation (@Valid) on Login Request Controller | `TC-SAST-017` | `POST /auth/public/v1/auth/login` | `auth-service` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-018` | `EXP-018` | `EV-018` | `VULN-018` | `THR-STRIDE-015` | `DREAD-15` | Unvalidated File Upload in eSign Initiation Endpoint | `TC-SAST-018` | `POST /revenue/private/v1/attachments/upload` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-019` | `EXP-019` | `EV-019A / EV-019B` | `VULN-013` | `THR-STRIDE-013` | `DREAD-13` | Production Exposure of Swagger / OpenAPI Interactive Documentation | `TC-SAST-019` | `GET /swagger-ui/index.html` | `api-gateway, user-management, revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-020` | `EXP-020` | `EV-007A / EV-007B` | `VULN-021` | `THR-STRIDE-002` | `DREAD-02` | Unauthenticated Service Discovery Operations on Netflix Eureka | `TC-SAST-020` | `GET /eureka/apps` | `discovery` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| `SAST-021` | `EXP-021` | `EV-008` | *[Unassigned]* | *[Unassigned]* | *[Unassigned]* | Exposed Diagnostic / Debug Controller in Revenue Production Code | `TC-SAST-021` | `GET /revenue/test/api1` | `revenue` | **PARTIALLY_VERIFIED** | **PARTIALLY_VERIFIED** |
| *[Observation]* | — | `EV-021` | *[Observation]* | *[Unassigned]* | *[Unassigned]* | JPA Parameterized Query Dynamic Analysis & SQL Injection Refutation (`OBS-SQLI-01`) | `TC-OBS-SQLI-001` | All 24 JPA Repositories | `revenue, user-management` | **CONFIRMED_SECURE / FALSE_POSITIVE** | **RETEST_PASSED** |

---

## 3. High-Priority Finding Verification & Inversion Analysis

The table below details the forensic verification of each finding flagged in the independent review:

### 3.1 SAST-009 & SAST-010 (Revenue Draft Tenant Boundary BOLA)
- **Canonical Mapping:** `SAST-009` maps to `EXP-009` / `EV-005` (Draft Viewing BOLA); `SAST-010` maps to `EXP-010` / `EV-005` (Draft Deletion BOLA).
- **Vulnerability Lineage:** Originates from Phase 0 baseline `VULN-006` and Phase 1 threat `THR-STRIDE-005` (`DREAD-05`).
- **Target Component:** `revenue` microservice (`DistrictDraftDetailsServiceImpl.java`, `DraftEntityServiceImpl.java`).
- **Defect in Flawed Matrix:** Incorrectly replaced by generic Actuator and Secret entries.
- **Authoritative Resolution:** Re-anchored to `EV-005` and validated via automated unit test suite `DraftTenantSecurityTest.java` (9/9 passing).

### 3.2 SAST-011 (Complete Absence of Method-Level Security)
- **Canonical Mapping:** `SAST-011` maps to `EXP-011` / `EV-020` (`TC-SAST-011`).
- **Vulnerability Lineage:** Originates from Phase 0 baseline `VULN-005` and Phase 1 threat `THR-STRIDE-018` (`DREAD-18`).
- **Target Component:** All microservice controller endpoints (`user-management`, `revenue`, `auth-service`).
- **Defect in Flawed Matrix:** Mistakenly labeled as CORS misconfiguration.
- **Authoritative Resolution:** Remediated by applying `@PreAuthorize` across all controllers, verified by `Rbac004EndpointSecurityIntegrationTest` (58/58 passing) and `RbacSecurityIntegrationTest` (10/10 passing).

### 3.3 SAST-012 (Distributed Token Revocation & Redis Blacklist)
- **Canonical Mapping:** `SAST-012` maps to `EXP-012` / `EV-002` (`TC-SAST-012`).
- **Vulnerability Lineage:** Originates from Phase 0 baseline `VULN-007` and Phase 1 threat `THR-STRIDE-007` (`DREAD-07`).
- **Target Component:** `api-gateway` (`AuthenticationFilter.java`) and `auth-service`.
- **Defect in Flawed Matrix:** Mistakenly labeled as session logout reuse without identifying the Redis filter mechanism.
- **Authoritative Resolution:** Reactive Redis blacklist check (`blacklist:jti:<jti>`) failing closed with HTTP 503 upon Redis unavailability. Verified in live perimeter probe `EV-002`.

### 3.4 SAST-013 (Gateway Wildcard Public Endpoint Exclusion Traversal)
- **Canonical Mapping:** `SAST-013` maps to `EXP-013` / `EV-003` (`TC-SAST-013`).
- **Vulnerability Lineage:** Left unassigned from Phase 0 baseline (discovered during Phase 2 AST inspection); maps to `THR-STRIDE-004` (`DREAD-04`).
- **Target Component:** `api-gateway` (`RouteValidator.java`).
- **Defect in Flawed Matrix:** Catastrophically mislabeled as "Blind SQL Injection in Dynamic Filters".
- **Authoritative Resolution:** Remediated in `RouteValidator.java` with path traversal normalization (`..` blocking) and exact prefix matching; verified in `EV-003` returning HTTP 401 Unauthorized.

### 3.5 SAST-014 (Audit Log Client IP Spoofing via X-Forwarded-For)
- **Canonical Mapping:** `SAST-014` maps to `EXP-014` / `EV-004` (`TC-SAST-014`).
- **Vulnerability Lineage:** Discovered in Phase 2 static review; `*[Unassigned]*` in baseline.
- **Target Component:** `api-gateway` (`ApiLoggingFilter.java`).
- **Defect in Flawed Matrix:** Incorrectly replaced by reflected XSS.
- **Authoritative Resolution:** Enforced client remote address resolution with header sanitization; verified in `EV-004`.

### 3.6 SAST-015 (Unbounded Response Body Memory Buffering)
- **Canonical Mapping:** `SAST-015` maps to `EXP-015` / `EV-016` (`TC-SAST-015`).
- **Vulnerability Lineage:** Originates from Phase 0 baseline `VULN-019` and Phase 1 threat `THR-STRIDE-015` (`DREAD-15`).
- **Target Component:** `api-gateway` (`ApiLoggingFilter.java`).
- **Defect in Flawed Matrix:** Incorrectly replaced by rate limiting.
- **Authoritative Resolution:** Replaced unbounded byte collection with streaming wrapper capped at 16 KB; verified in `EV-016`.

### 3.7 SAST-016 (Perimeter Security Headers: CSP and HSTS)
- **Canonical Mapping:** `SAST-016` maps to `EXP-016` / `EV-006` (`TC-SAST-016`).
- **Vulnerability Lineage:** Maps to Phase 1 threat `THR-STRIDE-014 (Mitigation)` (`DREAD-14`).
- **Target Component:** `api-gateway` (`SecurityHeadersFilter.java`).
- **Remediation Status:** **`PARTIALLY_VERIFIED`** (CSP, X-Frame-Options, X-Content-Type-Options verified; HSTS pending genuine TLS ingress). Correlates with technical blocker `BLK-CANON-01`.

### 3.8 SAST-019 (Swagger / OpenAPI Interactive UI Production Exposure)
- **Canonical Mapping:** `SAST-019` maps to `EXP-019` / `EV-019A` (Swagger UI) & `EV-019B` (OpenAPI JSON).
- **Vulnerability Lineage:** Originates from Phase 0 baseline `VULN-013` and Phase 1 threat `THR-STRIDE-013` (`DREAD-13`).
- **Target Component:** `api-gateway`, `user-management`, `revenue`.
- **Defect in Flawed Matrix:** Incorrectly labeled as session invalidation.
- **Authoritative Resolution:** Swagger endpoints disabled under `prod` profile; gateway route rewrites disabled; perimeter probe returns HTTP 404 Not Found.

### 3.9 SAST-020 (Unauthenticated Netflix Eureka Service Registry Operations)
- **Canonical Mapping:** `SAST-020` maps to `EXP-020` / `EV-007A` (401 unauthenticated) & `EV-007B` (200 authenticated).
- **Vulnerability Lineage:** Originates from Phase 0 baseline `VULN-021` and Phase 1 threat `THR-STRIDE-002` (`DREAD-02`).
- **Target Component:** `discovery` (`ServiceDiscoveryApplication.java`, `application.properties`).
- **Defect in Flawed Matrix:** Incorrectly labeled as path traversal in document retrieval.
- **Authoritative Resolution:** Spring Security HTTP Basic authentication enforced on port 8761; verified in Surefire suite `EurekaSecurityTest.java` (2/2 passing).

### 3.10 SAST-021 (Revenue TestController Debug Code Exposure)
- **Canonical Mapping:** `SAST-021` maps to `EXP-021` / `EV-008` (`TC-SAST-021`).
- **Vulnerability Lineage:** Discovered in Phase 2 static review; `*[Unassigned]*` in baseline.
- **Target Component:** `revenue` (`TestController.java`).
- **Remediation Status:** **`PARTIALLY_VERIFIED`** (`@Profile({"dev", "test"})` applied and perimeter gateway returns 403, but downstream direct container probe on port 18062 remains pending container steady-state). Correlates with technical blocker `BLK-CANON-02`.

---

## 4. Disentanglement and Re-anchoring of OBS-SQLI-01

`OBS-SQLI-01` represents a foundational audit safety observation, formally refuting the presence of SQL injection vulnerabilities across all 24 JPA data repositories within the LGD 2.0 microservice fleet:
- **Observation Identifier:** `OBS-SQLI-01`
- **Audit Classification:** **`CONFIRMED_SECURE / FALSE_POSITIVE`**
- **Associated Evidence Record:** `EV-021`
- **Associated Test Case Reference:** `TC-OBS-SQLI-001`
- **Evaluated Scope:** 24 JPA repositories across `revenue`, `user-management`, and `auth-service`
- **Correction Applied:** In the flawed matrix, `OBS-SQLI-01` was mistakenly collapsed into `SAST-013`. This correction firmly establishes `OBS-SQLI-01` as a standalone security observation, completely separate from `SAST-013` (Gateway Wildcard Public Endpoint Exclusion Traversal).
- **Technical Justification:** Static AST analysis confirmed that all Spring Data JPA query methods use parameterized Named Parameters or standard Spring Data method derivation (`findBy...`). Zero dynamic string concatenation or unsafe JDBC statement executions exist. Dynamic penetration probes confirmed that 90 SQL injection payloads across all endpoints yielded zero database leakage.

---

## 5. Audit Traceability Evidence Reference

The following authoritative documents served as the primary source of truth for this reconciliation:
1. [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md) (Nov 2, 2026) — Authoritative Master Register.
2. [`API_Vulnerability_Exploitation_Log.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/API_Vulnerability_Exploitation_Log.md) (Oct 30, 2026) — Dynamic Exploitation Register.
3. [`DAST_Evidence_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Evidence_Register.md) — Dynamic Retest Evidence Artifacts.
4. [`SAST_Findings_Log.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SAST_Findings_Log.md) — Static Analysis Findings Inventory.
5. [`PHASE_4_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_4_EVIDENCE_REGISTER.md) — Software Composition Analysis Evidence.

---

## 6. Mandatory Program Governance Directive

$$\mathbf{PHASE\ 7\ NOT\ STARTED\ —\ QUEUED\ —\ SEPARATE\ EXECUTIVE\ AUTHORIZATION\ REQUIRED.}$$

In strict accordance with audit mandates, no Phase 7 or subsequent milestone operations may commence until Gate B technical blockers are cleared and Gate C executive sign-off is granted.

