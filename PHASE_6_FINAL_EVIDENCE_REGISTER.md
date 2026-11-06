# LGD 2.0 - Phase 6 Final Evidence Register
## Comprehensive Multi-Dimensional Security Verification, RBAC Artifacts, Exploit Vectors & Technical Evidence

| **Evidence Register Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Final Evidence Register (Authoritative Reconciliation)** |
| **Document Purpose** | Master Catalog of Multi-Tier Audit Proofs: RBAC (EVD-RBAC-01..22), Exploits (EV-001..20), Observation (EV-021), and Technical Blockers |
| **Evaluation Timestamp** | November 5, 2026 (`2026-11-05T13:30:00+05:30`) |
| **Auditor Role** | Independent Senior Application Security Auditor, Security Documentation Controller & Evidence Reconciliation Specialist |
| **Total Evidence Records** | **22 Phase 6 RBAC Records, 21 Canonical Exploit Evidence Records, 1 Observation Evidence Record, 4 Gate B Technical Records** |
| **Superseded Prior Artifact** | [`PHASE_6_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_EVIDENCE_REGISTER.md) (Preserved in audit archive) |
| **Regression Pass Rate** | **397 / 397 Tests Passed (100.0% Pass Rate Across 50 Suites)** |
| **Mandatory Program Status** | **PHASE 7 NOT STARTED — QUEUED — SEPARATE EXECUTIVE AUTHORIZATION REQUIRED.** |

---

## 1. Executive Summary & Correction History

This **Final Evidence Register** establishes the definitive, unified repository of empirical security verification evidence for Phase 6.

### 1.1 Correction History & Discrepancy Resolution
1. **Reconciliation of Regression Test Attestation (`EVD-RBAC-20`):** In the preliminary evidence register ([`PHASE_6_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_EVIDENCE_REGISTER.md)), `EVD-RBAC-20` recorded an intermediate build figure of 329 tests (with `user-management` at 233 tests). The authoritative XML census independently confirms that `user-management` contains 31 test suites and 301 discrete tests. `EVD-RBAC-20` is formally updated to reflect the full platform census: **395 application service tests + 2 discovery registry tests = 397 discrete executed tests (100.0% pass rate)**.
2. **Canonical Exploit Vector Cross-Referencing:** The register synchronizes all 21 canonical exploit evidence records (`EV-001` through `EV-020`) and the standalone observation `EV-021` with [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md).
3. **Preservation of Gate B Technical Evidence:** The register captures technical verification records for perimeter transport, downstream container reachability, database infrastructure, and executive risk approvals.

---

## 2. Section I — Phase 6 RBAC Evidence Catalog (EVD-RBAC-01 through EVD-RBAC-22)

| Evidence ID | Title / Focus Area | Verification Type | Target Component | Test Suite / Source Location | Result | Correlated Finding |
|:---:|:---|:---:|:---:|:---|:---:|:---:|
| **`EVD-RBAC-01`** | District Draft Cross-Tenant BOLA Isolation Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_CrossTenant` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-02`** | District Draft Same-Tenant Authorized Access Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_SameTenant` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-03`** | District Draft Cross-Tenant Deletion Defense Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.deleteDraftEntity_CrossTenant` | **PASS (100%)** | `RBAC-008` |
| **`EVD-RBAC-04`** | District Boundary Cross-District Draft Isolation Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_CrossDistrict` | **PASS (100%)** | `RBAC-011` |
| **`EVD-RBAC-05`** | Unauthenticated Request HTTP 401 Unauthorized Proof | Automated Integration Test | `user-management` | `SecurityIntegrationTest.testAccessWithoutJwt` | **PASS (100%)** | Perimeter Baseline |
| **`EVD-RBAC-06`** | Malformed JWT Token HTTP 401 Rejection Proof | Automated Integration Test | `user-management` | `SecurityIntegrationTest.testAccessWithInvalidJwt` | **PASS (100%)** | Perimeter Baseline |
| **`EVD-RBAC-07`** | Injected JWT "roles" Claim and Downstream Authority Mapping Proof | Unit Tests & Code Census | `auth-service`, `user-management`, `revenue` | `JwtUtil.java`, `AuthServiceImpl.java`, `JwtAuthenticationFilter.java` | **VERIFIED** | `RBAC-001` |
| **`EVD-RBAC-08`** | Privilege & Master Controllers Method-Level Security Proof | Automated Integration Test | `user-management` | `RbacSecurityIntegrationTest.java:23-105` | **VERIFIED** | `RBAC-004` |
| **`EVD-RBAC-09`** | Subdistrict & Village Permissive Gates Remediation Proof | Controller Code & Unit Tests | `revenue` | `SubDistrictPrimaryController.java:49, 144`, `VillagePrimaryController.java:18` | **VERIFIED** | `RBAC-005` |
| **`EVD-RBAC-10`** | Subdistrict Draft Cross-Tenant BOLA Remediation Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getSubDistrictDraftDetails_CrossTenant` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-11`** | Multi-Tenant Deletion Defense across All Draft Entity Types | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.deleteDraftEntity_SubDistrict_CrossTenant` | **PASS (100%)** | `RBAC-008` |
| **`EVD-RBAC-12`** | Multi-Tenant Scoped User Directory Database Query Proof | Automated Unit Test | `user-management` | `UserServiceImplTest.getAllUsers_StateAdmin_ReturnsStateUsersOnly` | **PASS (100%)** | `RBAC-010` |
| **`EVD-RBAC-13`** | Method Security RBAC Integration Suite Proof (10 Tests) | Automated Integration Test | `user-management` | `RbacSecurityIntegrationTest.java` (10/10 PASS) | **PASS (100%)** | `RBAC-016` |
| **`EVD-RBAC-14`** | Comprehensive Multi-Tenant Boundary Suite (9 Tests) | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.java` (9/9 PASS) | **PASS (100%)** | `RBAC-016` |
| **`EVD-RBAC-15`** | User-Role Mapping Hierarchy Dominance & Self-Elevation Defense | Automated Unit Test | `user-management` | `UserRoleMappingServiceImplTest` (13/13 PASS) | **PASS (100%)** | `RBAC-003` |
| **`EVD-RBAC-16`** | User Hierarchy Dominance & Self-Deletion Guardrail Defense | Automated Unit Test | `user-management` | `UserServiceImplTest` (15/15 PASS) | **PASS (100%)** | `RBAC-006`, `RBAC-013` |
| **`EVD-RBAC-17`** | Horizontal IDOR & Cross-Tenant User Retrieval Defense | Automated Unit Test | `user-management` | `UserServiceImplTest` (15/15 PASS) | **PASS (100%)** | `RBAC-009` |
| **`EVD-RBAC-18`** | Fail-Closed Policy on Missing/Null Tenant Claims | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_NullStateCode` | **PASS (100%)** | `RBAC-012` |
| **`EVD-RBAC-19`** | Frontend React RoleGuard Route & Action Button Authorization | Vite Build & Code Review | `lgd-um` | `main.jsx:32-55`, `UserManagement.jsx:400-440` | **BUILT (0 errors)** | `RBAC-015` |
| **`EVD-RBAC-20`** | Full Platform Automated Regression Suite XML Census | Automated Maven Surefire | All 5 Microservices | 50 XML Reports (`api-gateway`, `auth`, `discovery`, `revenue`, `um`) | **397 / 397 PASS (100%)** | Full Regression Baseline |
| **`EVD-RBAC-21`** | Gateway Identity-Header Sanitization Defense-in-Depth Proof | Automated Unit Test | `api-gateway` | `IdentityHeaderSanitizationFilterTest.java` (3/3 PASS) | **PASS (100%)** | `GAP-05` |
| **`EVD-RBAC-22`** | 15-Minute JWT Expiration Production Configuration Parity Proof | Config Census & Unit Tests | All Profiles | 8 Config Files & `JwtUtilTest` (13/13 PASS) | **VERIFIED** | `RBAC-002` |

---

## 3. Section II — Canonical Phase 3 Exploit Evidence Register (EV-001 through EV-020 + EV-021)

| Evidence ID | Target Endpoint / Asset | Primary Exploit Vector | Related SAST ID | Baseline Status Code | Remediated Status Code | Technical Verification Proof |
|:---:|:---|:---:|:---:|:---:|:---:|:---|
| **`EV-001`** | `GET /user-management/private/v1/resources` | `EXP-001` (JWT Key Forgery) | `SAST-001` | HTTP 200 OK | HTTP 401 Unauthorized | Mandatory `${JWT_SECRET}` enforced; `ProductionSecurityValidatorTest` (5 passed); perimeter retest returns 401 on forged signatures. |
| **`EV-002`** | Gateway Ingress (`http://localhost:8092`) | `EXP-012` (Token Revocation Replay) | `SAST-012` | HTTP 200 OK | HTTP 401 Unauthorized | Reactive Redis blacklist filter (`AuthenticationFilter.java`) validates JTI; fails closed with HTTP 503 on Redis timeout. |
| **`EV-003`** | `GET /auth/public/..;/private/v1/resources` | `EXP-013` (Gateway Wildcard Traversal) | `SAST-013` | HTTP 200 OK | HTTP 401 Unauthorized | `RouteValidator.java` normalizes URI paths and rejects `..` path traversal sequences before route evaluation. |
| **`EV-004`** | `GET /user-management/private/v1/resources` | `EXP-014` (Client IP Header Spoofing) | `SAST-014` | Client IP Spoofed | Client Remote IP Selected | `ApiLoggingFilter.java` uses remote TCP socket address with safe fallback to `127.0.0.1`; incoming untrusted headers stripped. |
| **`EV-005`** | `GET /revenue/private/v1/draft/{entityType}` | `EXP-009`, `EXP-010` (Draft BOLA) | `SAST-009`, `SAST-010` | HTTP 200 OK | HTTP 403 Forbidden | `DistrictDraftDetailsServiceImpl.java` and `DraftEntityServiceImpl.java` validate tenant state/district equality; `DraftTenantSecurityTest` (9 passed). |
| **`EV-006`** | API Gateway Ingress (All Routes) | `EXP-016` (Security Headers CSP/HSTS) | `SAST-016` | Missing Headers | CSP Present / HSTS Partial | `SecurityHeadersFilter.java` injects CSP, X-Frame-Options, X-Content-Type-Options; HSTS pending genuine TLS ingress (`BLK-CANON-01`). |
| **`EV-007A`** | `GET http://localhost:8761/eureka/apps` | `EXP-020` (Eureka Unauthenticated Access) | `SAST-020` | HTTP 200 OK | HTTP 401 Unauthorized | HTTP Basic Authentication enforced on Eureka registry; `EurekaSecurityTest` (2 passed: 401 unauthenticated probe). |
| **`EV-007B`** | `GET http://localhost:8761/eureka/apps` | `EXP-020` (Eureka Authenticated Access) | `SAST-020` | N/A | HTTP 200 OK | HTTP Basic Authentication with valid service credentials succeeds; `EurekaSecurityTest` (2 passed: 200 authenticated probe). |
| **`EV-008`** | `GET http://localhost:18062/test/api1` | `EXP-021` (Revenue Debug Controller) | `SAST-021` | HTTP 200 OK | HTTP 403 Forbidden | Gateway blocks direct route; `@Profile({"dev", "test"})` applied to `TestController.java`; downstream direct probe pending (`BLK-CANON-02`). |
| **`EV-009`** | PostgreSQL TCP Port 5432 / Properties | `EXP-002` (Plaintext DB Credentials) | `SAST-002` | DB Ingress Granted | DB Access Refused | Host port binding `5432:5432` removed in `docker-compose.yml`; credentials externalized to mandatory env vars. |
| **`EV-010`** | `revenue/src/main/resources/revenue.p12` | `EXP-003` (Keystore Password Extraction) | `SAST-003` | Keystore Opened | Startup Fails Closed | Plaintext keystore password removed; `${ESIGN_KEYSTORE_PASSWORD}` enforced with startup validator. |
| **`EV-011`** | `POST /public/v1/ehastakshar/response` | `EXP-004` (XML Signature Wrapping) | `SAST-004` | Forged XML Processed | XML Rejected | `XmlSignatureUtil.java` sets `secureValidation=true` and disables external DTD processing. |
| **`EV-012`** | `POST /public/v1/ehastakshar/response` | `EXP-005` (Untrusted Cert Acceptance) | `SAST-005` | Forged Cert Accepted | Untrusted Cert Rejected | `X509KeySelector.java` verifies certificate path against CDAC root trust anchors. |
| **`EV-013`** | `revenue` / `EsignService.java` | `EXP-006` (Conditional Bypass of eSign) | `SAST-006` | Bypass Granted | Verification Enforced | Removed `esign.bypass.verification` fallback; signature verification unconditionally executed. |
| **`EV-014`** | `POST /private/v1/ehastakshar/initiate` | `EXP-007` (Insecure PRNG for eSign) | `SAST-007` | Predictable Txn IDs | Cryptographic PRNG | Replaced `java.util.Random` with `java.security.SecureRandom`; replay cache in Redis. |
| **`EV-015`** | `PUT /user-management/private/v1/users/{id}` | `EXP-008` (Mass Assignment Escalation) | `SAST-008` | Roles Elevated | Roles Unaltered | `UserMapper.java` explicitly maps update fields; administrative role fields omitted from update DTO. |
| **`EV-016`** | `GET /user-management/private/v1/users` | `EXP-015` (Unbounded Body Buffering) | `SAST-015` | OOM Crash Vector | Capped at 16 KB | `ApiLoggingFilter.java` implements streaming decorator with 16 KB buffer limit. |
| **`EV-017`** | `POST /auth/public/v1/auth/login` | `EXP-017` (Missing @Valid on Login) | `SAST-017` | Null Payload Crash | HTTP 400 Bad Request | Added `@Valid` to `AuthSecondaryController.java`; input payload validated. |
| **`EV-018`** | `POST /revenue/private/v1/attachments/upload` | `EXP-018` (Unvalidated File Upload) | `SAST-018` | Binary Executable Stored | HTTP 400 Bad Request | Apache Tika magic-byte PDF verification, 10MB file limit, extension whitelist. |
| **`EV-019A`**| `GET /swagger-ui/index.html` | `EXP-019` (Interactive Swagger Exposure) | `SAST-019` | HTTP 200 OK | HTTP 404 Not Found | Interactive Swagger UI disabled under `prod` profile. |
| **`EV-019B`**| `GET /v3/api-docs` | `EXP-019` (OpenAPI Spec Leakage) | `SAST-019` | HTTP 200 OK | HTTP 404 Not Found | OpenAPI JSON documentation endpoint disabled under `prod` profile. |
| **`EV-020`** | Ingress Controller Endpoints | `EXP-011` (Missing Method Security) | `SAST-011` | Unrestricted Access | HTTP 403 Forbidden | Applied `@PreAuthorize` across all controllers; verified by integration test suites (58/58, 10/10). |
| **`EV-021`** | All 24 JPA Repositories | `OBS-SQLI-01` (SQLi Parameterization Refutation)| `OBS-SQLI-01` | N/A | **`CONFIRMED_SECURE`** | AST review confirmed 100% parameterization; 90 dynamic SQLi injection attack vectors produced zero vulnerabilities. |

---

## 4. Section III — Gate B Technical Blocker Verification Records

| Evidence Record ID | Blocker Identifier | Focus Area | Observed Environmental State | Required Resolution Criteria | Current Determination |
|:---:|:---:|:---|:---|:---|:---:|
| **`EVD-GATEB-01`** | `BLK-CANON-01` | Perimeter Ingress HTTPS/TLS & HSTS Transport Security | Docker Compose exposes cleartext HTTP port 8092. No active TLS reverse proxy or TLS listener configured. | Deploy TLS reverse proxy (Nginx/Envoy/Gateway TLS) with valid certificate; capture TLS handshake and HSTS headers. | **`OPEN / PARTIALLY_VERIFIED`** |
| **`EVD-GATEB-02`** | `BLK-CANON-02` | Downstream Revenue Container & TestController Reachability Census | Gateway perimeter returns 403; `@Profile({"dev", "test"})` applied to `TestController.java`. Internal container probe on port 18062 and `/actuator/mappings` census blocked due to Revenue container exit. | Achieve steady-state container runtime for `revenue`; probe port 18062 directly; capture `/actuator/mappings`. | **`OPEN / PARTIALLY_VERIFIED`** |
| **`EVD-GATEB-03`** | `BLK-CANON-03` | Host PostgreSQL 14 Availability & Revenue Steady-State Verification | Native Windows service `postgresql-x64-14` is `Stopped`. TCP port 5432 closed. Container `revenue` failed HikariCP datasource connection and exited. | Start Windows service `postgresql-x64-14`; verify TCP 5432 listening; start `revenue` container and verify steady-state uptime > 5m. | **`OPEN / BLOCKED_BY_ENV`** |
| **`EVD-GATEB-04`** | `BLK-CANON-04` | Executive DAA / CISO Residual Risk Formal Authorization | Submission package `GATE_C_DAA_CISO_APPROVAL_REQUEST.md` prepared; signature blocks remain blank. Zero simulated sign-offs recognized. | Convene Architecture Review Board; secure signed risk acceptance memorandums from DAA and CISO for `RR-01` through `RR-11`. | **`PENDING_FORMAL_ACCEPTANCE`** |

---

## 5. Mandatory Program Governance Directive

$$\mathbf{PHASE\ 7\ NOT\ STARTED\ —\ QUEUED\ —\ SEPARATE\ EXECUTIVE\ AUTHORIZATION\ REQUIRED.}$$

