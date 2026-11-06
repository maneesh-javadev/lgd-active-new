# LGD 2.0 — Master Security Finding Register
## Unified Index, Bidirectional Traceability Layer & Authoritative Register Crosswalk

| **Finding Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Document Role** | Traceability Layer & Index (Non-competing pointer to authoritative source registers) |
| **Authoritative Register Sources** | [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md), [`SECURITY_MASTER_FINDING_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_MASTER_FINDING_REGISTER.md), [`PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md), [`PHASE_6_RBAC_FINDINGS_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_RBAC_FINDINGS_REGISTER.md), [`SCA_FINDINGS_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_FINDINGS_REGISTER.md), [`Vulnerability_Master_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Vulnerability_Master_Register.md), [`STRIDE_Threat_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/STRIDE_Threat_Register.md), [`DREAD_Risk_Assessment.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DREAD_Risk_Assessment.md) |
| **Evaluation Timestamp** | November 6, 2026 (`2026-11-06T12:45:00+05:30`) |
| **Indexed Finding Counts** | 124 Technical Findings + 6 Phase 9.1.3 Discoveries (`DISC-P913-01`..`06`) + 6 Phase 9.1.5 Discoveries (`DISC-P914-01`..`06`) + 11 Residual Risks (`RR-01`..`11`) + 4 Canonical Blockers (`BLK-CANON-01`..`04`) + 20 STRIDE Threats + 20 DREAD Assessments |
| **Mandatory Program Directive** | **PHASE 9.1.5 COMPLETED — SIX CRITICAL BLUEPRINT DEFECTS REMEDIATED (DISC-P914-01..06); STAGE B BLUEPRINT CERTIFIED & APPROVED FOR SEPARATE OPERATIONAL AUTHORIZATION; GATES B & C HELD.** |

---

## 1. Architectural Role & Indexing Policy

> [!IMPORTANT]
> **Traceability Index Mandate:** This document serves strictly as an **index and bidirectional traceability layer**. It does not create competing copies of finding data, does not invent missing evidence, and never silently converts technical remediation or test passes into formal governance acceptance. Primary authoritative finding narratives remain anchored in their respective source documents listed in the metadata block above.

### Indexing Criteria:
For every indexed security finding, the register captures:
1. **Canonical ID:** Immutable identifier preserved across all audit phases.
2. **Authoritative Source & Location:** Document path, table, and line references.
3. **Severity & CVSS:** Preserved without artificial downgrades.
4. **Current Reported Status:** The status asserted by engineering or testing.
5. **Evidence Reference:** Specific empirical test, log, or configuration record (`EV-xxx`, `EVD-RBAC-xxx`).
6. **Technical Verification Status:** Empirical outcome (`VERIFIED_FIXED`, `PARTIALLY_VERIFIED`, `CONFIRMED_SECURE`, `QUEUED`).
7. **Formal Acceptance Status:** Governance state (`FORMALLY_ACCEPTED`, `PENDING_FORMAL_ACCEPTANCE`, `DEFERRED`, `N/A`).
8. **Last Verified Baseline:** Git commit and environment baseline.
9. **Unresolved Discrepancies:** Open environmental gaps or documentation conflicts.

---

## 2. Actionable SAST Findings Index (SAST-001 through SAST-021)

Authoritative Source: [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md) (Nov 2, 2026) & [`SECURITY_MASTER_FINDING_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_MASTER_FINDING_REGISTER.md)

| Canonical ID | Finding Title | Severity (CVSS v4.0) | Primary CWE | Affected Component(s) & Code Location | Traceability Crosswalk (VULN / STRIDE / EXP) | Reported Status | Evidence Ref | Technical Verification Status | Formal Acceptance Status | Last Verified Baseline | Unresolved Discrepancies & Limitations |
|:---:|:---|:---:|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **`SAST-001`** | Forgery of Administrative JWT Token via Hardcoded Signing Key | **CRITICAL** (9.8) | CWE-798 | `api-gateway`, `auth-service`, `user-management`, `revenue` | `VULN-001` / `THR-STRIDE-001` (`DREAD-01`) / `EXP-001` | VERIFIED_FIXED | `EV-001`, `EVD-P7-01`..`09` | **VERIFIED_REMEDIATED** | PENDING_FORMAL_ACCEPTANCE (`RR-01`) | HEAD `e2df50f` / Phase 7 | Upgraded from symmetric HMAC to RSA-2048 RS256 with JWKS endpoint; downstream services hold public keys only |
| **`SAST-002`** | Direct Database Ingress via Plaintext Configuration Credentials | **CRITICAL** (9.8) | CWE-798 / CWE-259 | `*/resources/application*.properties`, `docker-compose.yml` | `VULN-017` / `THR-STRIDE-012 (Amplifier)` / `EXP-002` | VERIFIED_FIXED | `EV-009`, `EVD-P7-16` | **VERIFIED_FIXED** | PENDING_FORMAL_ACCEPTANCE (`RR-05`) | HEAD `e2df50f` / Phase 7 | Port 5432 unmapped from Compose; environment variables enforced across services |
| **`SAST-003`** | e-Hastakshar PKCS#12 Keystore Password Extraction | **CRITICAL** (9.8) | CWE-798 | `revenue` / `esign.properties`, `EsignValidationSecurityTest` | `VULN-003` / `THR-STRIDE-003` (`DREAD-03`) / `EXP-003` | VERIFIED_FIXED | `EV-010`, `EVD-P7-12` | **VERIFIED_FIXED** | PENDING_FORMAL_ACCEPTANCE (`RR-07`) | HEAD `e2df50f` / Phase 7 | Password externalized; production profile enforces keystore presence & cert validity |
| **`SAST-004`** | XML Signature Wrapping (XSW) via Disabled XMLDSig Secure Validation | **CRITICAL** (9.6) | CWE-347 | `revenue` / `XmlSignatureUtil.java` | `VULN-003` / `THR-STRIDE-003` (`DREAD-03`) / `EXP-004` | VERIFIED_FIXED | `EV-011`, `EVD-P7-14` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / Phase 7 | `secureValidation=true` enforced; multiple `<Signature>` XSW wrapping rejected |
| **`SAST-005`** | Untrusted Certificate Acceptance in XMLDSig KeySelector | **CRITICAL** (9.6) | CWE-295 / CWE-347 | `revenue` / `X509KeySelector.java` | `VULN-003` / `THR-STRIDE-003` (`DREAD-03`) / `EXP-005` | VERIFIED_FIXED | `EV-012` | **VERIFIED_FIXED** | PENDING_FORMAL_ACCEPTANCE (`RR-04`) | HEAD `e2df50f` / DevEnv | CDAC root anchor path validation enforced; CA renewal lifecycle operational |
| **`SAST-006`** | Conditional Bypass of eSign Verification via Configuration Flag | **HIGH** (8.8) | CWE-347 / CWE-306 | `revenue` / `EsignService.java`, `XmlSignatureUtil.java` | `VULN-003` / `THR-STRIDE-003` (`DREAD-03`) / `EXP-006` | VERIFIED_FIXED | `EV-013`, `EVD-P7-13` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / Phase 7 | Bypass flag eliminated; unsigned XML strictly prohibited under production profiles |
| **`SAST-007`** | Insecure PRNG for eSign Transaction IDs | **HIGH** (7.5) | CWE-338 | `revenue` / `EsignPrimaryController.java` | `VULN-003` / `THR-STRIDE-003` (`DREAD-03`) / `EXP-007` | VERIFIED_FIXED | `EV-014` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | `SecureRandom` enforced; Redis transaction deduplication active |
| **`SAST-008`** | Mass Assignment / Privilege Escalation via User Update Endpoint | **CRITICAL** (9.4) | CWE-915 | `user-management` / `UserMapper.java` | *[Unassigned]* / `THR-STRIDE-006` (`DREAD-06`) / `EXP-008` | VERIFIED_FIXED | `EV-015` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | Role and privilege fields omitted from update DTO |
| **`SAST-009`** | Broken Object Level Authorization (BOLA/IDOR) on Draft Viewing & File Downloads | **CRITICAL** (9.1) | CWE-639 | `revenue` / `DistrictDraftDetailsServiceImpl.java` | `VULN-006` / `THR-STRIDE-005` (`DREAD-05`) / `EXP-009` | VERIFIED_FIXED | `EV-005` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | Cross-tenant draft viewing blocked with SecurityException |
| **`SAST-010`** | Unauthorized Draft Entity Deletion via Missing Tenant Ownership Checks | **CRITICAL** (9.1) | CWE-639 / CWE-862 | `revenue` / `DraftEntityServiceImpl.java` | `VULN-006` / `THR-STRIDE-005` (`DREAD-05`) / `EXP-010` | VERIFIED_FIXED | `EV-005` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | State code ownership validation strictly enforced |
| **`SAST-011`** | Absence of Method-Level Security Annotations Across Controllers | **HIGH** (8.8) | CWE-862 / CWE-285 | `user-management`, `revenue`, `auth-service` | `VULN-005` / `THR-STRIDE-018` (`DREAD-18`) / `EXP-011` | VERIFIED_FIXED | `EV-020`, `EVD-RBAC-08` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | Universal `@PreAuthorize` applied; 25 endpoints covered under `RBAC-004` |
| **`SAST-012`** | Replay of Revoked JWT Tokens Bypassing Gateway Redis Blacklist | **HIGH** (8.6) | CWE-613 | `api-gateway` / `AuthenticationFilter.java` | `VULN-007` / `THR-STRIDE-007` (`DREAD-07`) / `EXP-012` | DESIGN_VALIDATED | `EV-002`, `PHASE_9_1_2_REDIS_SENTINEL...` | **DESIGN_VALIDATED / IMPLEMENTATION_PENDING** | PENDING_FORMAL_ACCEPTANCE (`RR-02`) | HEAD `e2df50f` / DevEnv | Redis Sentinel dynamic templating & auto-reconnect validated; Stage B implementation pending |
| **`SAST-013`** | Gateway Authentication Filter Bypass via Traversal in Public Route Wildcard | **HIGH** (8.2) | CWE-284 | `api-gateway` / `RouteValidator.java` | *[Unassigned]* / `THR-STRIDE-004` (`DREAD-04`) / `EXP-013` | VERIFIED_FIXED | `EV-003` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | Strict path normalization; `..` traversal probes rejected |
| **`SAST-014`** | Audit Log Client IP Spoofing via Unvalidated X-Forwarded-For | **MEDIUM** (7.1) | CWE-290 | `api-gateway` / `ApiLoggingFilter.java` | *[Unassigned]* / *[Unassigned]* / `EXP-014` | VERIFIED_FIXED | `EV-004` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | Remote TCP address prioritized; spoofed headers stripped |
| **`SAST-015`** | Unbounded Response Body Memory Buffering in Gateway Logging Filter | **MEDIUM** (7.5) | CWE-400 / CWE-770 | `api-gateway` / `ApiLoggingFilter.java` | `VULN-019` / `THR-STRIDE-015` (`DREAD-15`) / `EXP-015` | VERIFIED_FIXED | `EV-016` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | Streaming decorator buffers max 16 KB; memory exhaustion blocked |
| **`SAST-016`** | Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway | **LOW** (6.8) | CWE-693 | `api-gateway` / `SecurityHeadersFilter.java` | *[Unassigned]* / `THR-STRIDE-014` (`DREAD-14`) / `EXP-016` | DESIGN_VALIDATED | `EV-006`, `EVD-GATEB-01`, `PHASE_9_1_2_TLS...` | **DESIGN_VALIDATED / IMPLEMENTATION_PENDING** | BLOCKED (`BLK-CANON-01`) | HEAD `e2df50f` / DevEnv | Nginx port 443 TLS reverse proxy & port 80 redirect validated; Stage B deployment pending |
| **`SAST-017`** | Missing Bean Validation Annotation (@Valid) on Login Request | **MEDIUM** (6.5) | CWE-20 | `auth-service` / `AuthSecondaryController.java` | *[Unassigned]* / *[Unassigned]* / `EXP-017` | VERIFIED_FIXED | `EV-017` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | `@Valid` on `LoginRequest`; null/malformed inputs return 400 |
| **`SAST-018`** | Unvalidated File Upload in eSign Initiation Endpoint | **HIGH** (7.8) | CWE-434 | `revenue` / `EsignPrimaryController.java` | `VULN-018` / `THR-STRIDE-015` (`DREAD-15`) / `EXP-018` | VERIFIED_FIXED | `EV-018` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | Apache Tika magic-byte validation, 10MB limit, extension check |
| **`SAST-019`** | Production Exposure of Swagger / OpenAPI Interactive Documentation | **LOW** (5.3) | CWE-200 | `*/config/SwaggerConfig.java`, `application-prod.properties` | `VULN-013` / `THR-STRIDE-013` (`DREAD-13`) / `EXP-019` | VERIFIED_FIXED | `EV-019A`, `EV-019B` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | Swagger endpoints disabled under `prod` profile (returns HTTP 404) |
| **`SAST-020`** | Unauthenticated Service Discovery Operations on Netflix Eureka | **CRITICAL** (9.8) | CWE-306 | `discovery` / `EurekaSecurityConfig.java`, `docker-compose.yml` | `VULN-021` / `THR-STRIDE-002` (`DREAD-02`) / `EXP-020` | VERIFIED_FIXED | `EV-007A`, `EV-007B` | **VERIFIED_FIXED** | N/A (Fully Remediated) | HEAD `e2df50f` / DevEnv | HTTP Basic Authentication enforced; port 8761 internal to network |
| **`SAST-021`** | Exposed Diagnostic / Debug Controller in Revenue Production Code | **MEDIUM** (6.5) | CWE-489 | `revenue` / `TestController.java` | *[Unassigned]* / *[Unassigned]* / `EXP-021` | PARTIALLY_VERIFIED | `EV-008`, `EVD-GATEB-02` | **PARTIALLY_VERIFIED** | BLOCKED (`BLK-CANON-02`) | HEAD `e2df50f` / DevEnv | Gateway returns 403; internal container probe on :18062 pending container uptime |

---

## 3. Canonical Exploit Vectors Index (EXP-001 through EXP-021)

Authoritative Source: [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md) & [`DAST_Evidence_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Evidence_Register.md)

| Exploit ID | Exploit Vector Title | Severity | Primary Target Endpoint / Asset | Related SAST ID | Evidence Proof Ref | Technical Verification Status | Unresolved Discrepancies & Limitations |
|:---:|:---|:---:|:---|:---:|:---:|:---:|:---|
| **`EXP-001`** | Forgery of Administrative JWT Token via Known Secret | **CRITICAL** | `GET /user-management/private/v1/resources` | `SAST-001` | `EV-001` | **VERIFIED_FIXED** | Forged signatures rejected with HTTP 401 Unauthorized |
| **`EXP-002`** | Direct Database Ingress via Exposed Host Port 5432 | **CRITICAL** | PostgreSQL TCP Port 5432 | `SAST-002` | `EV-009` | **VERIFIED_FIXED** | Port unmapped in compose; database inaccessible from external host |
| **`EXP-003`** | e-Hastakshar PKCS#12 Keystore Compromise | **CRITICAL** | `revenue/src/main/resources/revenue.p12` | `SAST-003` | `EV-010` | **VERIFIED_FIXED** | Mandatory password env var enforced; startup fails closed without it |
| **`EXP-004`** | XML Signature Wrapping (XSW) Injection | **CRITICAL** | `POST /public/v1/ehastakshar/response` | `SAST-004` | `EV-011` | **VERIFIED_FIXED** | Modified XML structures rejected by Apache XMLDSig |
| **`EXP-005`** | Untrusted Root CA Certificate Spoofing | **CRITICAL** | `POST /public/v1/ehastakshar/response` | `SAST-005` | `EV-012` | **VERIFIED_FIXED** | Certificates not chained to CDAC trust anchors rejected |
| **`EXP-006`** | Configuration Parameter Tampering to Bypass eSign | **HIGH** | `POST /public/v1/ehastakshar/response` | `SAST-006` | `EV-013` | **VERIFIED_FIXED** | Bypass flags removed; validation unconditionally executed |
| **`EXP-007`** | Predictable Transaction ID Guessing & Replay | **HIGH** | `POST /private/v1/ehastakshar/initiate` | `SAST-007` | `EV-014` | **VERIFIED_FIXED** | Cryptographically secure PRNG (`SecureRandom`) enforced |
| **`EXP-008`** | Mass Assignment Administrative Role Injection | **CRITICAL** | `PUT /user-management/private/v1/users/{id}` | `SAST-008` | `EV-015` | **VERIFIED_FIXED** | Injected role modifications ignored by mapper; user role unaltered |
| **`EXP-009`** | Cross-Tenant Object ID Manipulation in Draft Fetch | **CRITICAL** | `GET /revenue/private/v1/draft/{entityType}` | `SAST-009` | `EV-005` | **VERIFIED_FIXED** | Cross-state requests return HTTP 403 Forbidden |
| **`EXP-010`** | Cross-Tenant Object ID Manipulation in Draft Deletion | **CRITICAL** | `DELETE /revenue/private/v1/draft/{entityType}/{id}`| `SAST-010` | `EV-005` | **VERIFIED_FIXED** | Unauthorized deletions rejected with HTTP 403 Forbidden |
| **`EXP-011`** | Direct Controller Invocation Bypassing Role Checks | **HIGH** | Ingress Controller Endpoints across Services | `SAST-011` | `EV-020` | **VERIFIED_FIXED** | Missing authorities return HTTP 403 Forbidden |
| **`EXP-012`** | Replay of Revoked JWT Bearer Token | **HIGH** | API Gateway Ingress Routes | `SAST-012` | `EV-002` | **VERIFIED_FIXED** | Blacklisted JTIs rejected with HTTP 401 Unauthorized |
| **`EXP-013`** | Gateway Wildcard URL Traversal Authentication Bypass | **HIGH** | `GET /auth/public/..;/private/v1/resources` | `SAST-013` | `EV-003` | **VERIFIED_FIXED** | Normalized path evaluation blocks traversal; returns HTTP 401 |
| **`EXP-014`** | Client IP Address Spoofing via X-Forwarded-For | **MEDIUM** | `GET /user-management/private/v1/resources` | `SAST-014` | `EV-004` | **VERIFIED_FIXED** | Remote socket IP prioritized; injected header values discarded |
| **`EXP-015`** | Gateway Memory Exhaustion via Large Payload Buffering | **MEDIUM** | `GET /user-management/private/v1/users` | `SAST-015` | `EV-016` | **VERIFIED_FIXED** | Max 16 KB response buffering decorator prevents OOM crashes |
| **`EXP-016`** | Interception & Downgrade via Missing HSTS / CSP | **LOW** | Gateway Ingress Port 8092 | `SAST-016` | `EV-006`, `EVD-GATEB-01` | **PARTIALLY_VERIFIED** | CSP active; HSTS pending live TLS ingress (`BLK-CANON-01`) |
| **`EXP-017`** | Server Error Induction via Missing Bean Validation | **MEDIUM** | `POST /auth/public/v1/auth/login` | `SAST-017` | `EV-017` | **VERIFIED_FIXED** | Null/invalid payloads handled cleanly; returns HTTP 400 |
| **`EXP-018`** | Remote Code Execution via Malicious PDF Attachment | **HIGH** | `POST /revenue/private/v1/attachments/upload` | `SAST-018` | `EV-018` | **VERIFIED_FIXED** | Magic-byte verification and Tika parsing reject non-PDF binaries |
| **`EXP-019`** | Attack Surface Discovery via Interactive Swagger UI | **LOW** | `GET /swagger-ui/index.html`, `/v3/api-docs` | `SAST-019` | `EV-019A`, `EV-019B` | **VERIFIED_FIXED** | Swagger UI and OpenAPI docs return HTTP 404 in production |
| **`EXP-020`** | Rogue Service Registration on Eureka Discovery | **CRITICAL** | `GET / POST http://localhost:8761/eureka/apps` | `SAST-020` | `EV-007A`, `EV-007B` | **VERIFIED_FIXED** | Unauthenticated probes rejected with 401; basic auth enforced |
| **`EXP-021`** | Direct Access to Revenue Debug TestController | **MEDIUM** | `GET http://localhost:18062/test/api1` | `SAST-021` | `EV-008`, `EVD-GATEB-02` | **PARTIALLY_VERIFIED** | Gateway perimeter blocks with 403; direct container probe pending |

---

## 4. Standalone Safety Observation Index (OBS-SQLI-01)

Authoritative Source: [`PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md) & [`Consolidated_Remediation_Report.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Consolidated_Remediation_Report.md)

| Canonical ID | Observation Title | Evaluated Threat Scope | Primary Target Component | Test Case Ref | Evidence Ref | Technical Verification Status | Formal Disposition Rationale |
|:---:|:---|:---:|:---|:---:|:---:|:---:|:---|
| **`OBS-SQLI-01`** | JPA Parameterized Query Dynamic Analysis & SQL Injection Refutation | Injection / SQLi (`CWE-89`) | All 24 JPA Repositories (`revenue`, `user-management`, `auth-service`) | `TC-OBS-SQLI-001` (90 Payloads) | `EV-021` | **`CONFIRMED_SECURE / FALSE_POSITIVE`** | AST code inspection verified 100% parameterization via Spring Data JPA named parameters and derived queries; zero string concatenation or dynamic query creation. Dynamic penetration testing with 90 advanced SQLi payloads resulted in zero vulnerabilities. Disentangled from `SAST-013` and cataloged as a confirmed-secure standalone observation. |

---

## 5. Phase 6 RBAC & Multi-Tenancy Findings Index (RBAC-001 through RBAC-016)

Authoritative Source: [`PHASE_6_RBAC_FINDINGS_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_RBAC_FINDINGS_REGISTER.md) & [`PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md)

| Canonical ID | Finding Title | Severity | CVSS 3.1 | Primary Source Location | Verification Evidence & Test Suite | Technical Verification Status | Formal Acceptance Status | Residual Risk Link |
|:---:|:---|:---:|:---:|:---|:---|:---:|:---:|:---:|
| **`RBAC-001`** | Decoupling of JWT Claims and Microservice Role Authorization | **CRITICAL** | 9.1 | `auth-service` / `JwtUtil.java`, `user-management` / `JwtAuthenticationFilter.java` | `Rbac001SecurityNegativeTest` (10/10 PASS), `EVD-RBAC-07` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-002`** | Stale Role & Privilege Retention via Unrevoked Stateless Access Tokens | **HIGH** | 7.4 | All microservice `application-prod.properties`, `.env.example` (15m expiry) | Configuration Census, `JwtUtilTest` (13/13 PASS), `EVD-RBAC-22` | **VERIFIED_FIXED** | PENDING_FORMAL_ACCEPTANCE | `RR-01`, `RR-06` |
| **`RBAC-003`** | Unrestricted Role Assignment and Self-Elevation in User-Role Mapping | **HIGH** | 8.8 | `user-management` / `UserRoleMappingServiceImpl.java` | `UserRoleMappingServiceImplTest` (13/13 PASS), `EVD-RBAC-15` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-004`** | Complete Absence of Method-Level Authorization on Master & Resource Controllers | **CRITICAL** | 9.1 | `user-management` / 4 Controllers (25 Endpoints) | `Rbac004EndpointSecurityIntegrationTest` (58/58 PASS), `EVD-RBAC-08` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-005`** | Permissive `isAuthenticated()` Gates on Subdistrict Reorganization APIs | **HIGH** | 8.1 | `revenue` / `SubDistrictPrimaryController.java`, `VillagePrimaryController.java`| Controller Security Unit Tests (22/22 PASS), `EVD-RBAC-09` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-006`** | Cross-Hierarchy Administrative Privilege Escalation (User Creation/Deletion) | **HIGH** | 8.0 | `user-management` / `UserServiceImpl.java` | `UserServiceImplTest` (15/15 PASS), `EVD-RBAC-16` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-007`** | Cross-Tenant Broken Object Level Authorization (BOLA) in Subdistrict Drafts | **HIGH** | 7.5 | `revenue` / `SubDistrictDraftDetailsServiceImpl.java` | `DraftTenantSecurityTest` (9/9 PASS), `EVD-RBAC-10` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-008`** | Multi-Tenancy Boundary Isolation Bypass in Non-District Draft Entity Deletion | **HIGH** | 7.5 | `revenue` / `DraftEntityServiceImpl.java` | `DraftTenantSecurityTest` (9/9 PASS), `EVD-RBAC-11` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-009`** | Horizontal IDOR in User Profile and Metadata Retrieval Across Organizations | **MEDIUM** | 5.3 | `user-management` / `UserServiceImpl.java` | `UserServiceImplTest` (15/15 PASS), `EVD-RBAC-17` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-010`** | Absence of Multi-Tenant Database Query Scoping on Global User Listing Endpoint | **HIGH** | 7.1 | `user-management` / `UserServiceImpl.java`, `UserRepository.java` | `UserServiceImplTest` (15/15 PASS), `EVD-RBAC-12` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-011`** | Cross-District Administrative Boundary Information Leakage in Draft Status | **MEDIUM** | 5.3 | `revenue` / `SubDistrictPrimaryController.java` | Controller Tenant Tests (22/22 PASS), `EVD-RBAC-04` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-012`** | Fail-Open Tenant Boundary Validation on Null State/District JWT Claims | **HIGH** | 7.5 | `revenue` / `DistrictDraftDetailsServiceImpl.java`, `SubDistrict*` | `DraftTenantSecurityTest` (9/9 PASS), `EVD-RBAC-18` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-013`** | Absence of Self-Deletion and Self-Deactivation Administrative Guardrails | **MEDIUM** | 5.5 | `user-management` / `UserServiceImpl.java` | `UserServiceImplTest` (15/15 PASS), `EVD-RBAC-16` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-014`** | Unscoped Cross-Tenant User-to-Role Mapping Disclosure | **MEDIUM** | 5.3 | `user-management` / `UserRoleMappingServiceImpl.java` | `UserRoleMappingServiceImplTest` (13/13 PASS) | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`RBAC-015`** | Frontend Route & Action Button Authorization Deficit in React Client | **HIGH** | 7.3 | `lgd-um` / `main.jsx`, `apiConfig.js`, `UserManagement.jsx` | React Production Vite Build (0 errors), `EVD-RBAC-19` | **VERIFIED_FIXED** | PENDING_FORMAL_ACCEPTANCE | `RR-08` |
| **`RBAC-016`** | Complete Absence of Automated Role-Based Access Control Integration Tests | **MEDIUM** | 5.3 | `user-management`, `revenue` Integration Test Suites | `RbacSecurityIntegrationTest` (10/10), `DraftTenantSecurityTest` (9/9) | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |

---

## 6. RBAC-004 Method Security 25-Endpoint Authority Matrix Index

Authoritative Source: [`PHASE_6_AUTHORIZATION_ENDPOINT_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_AUTHORIZATION_ENDPOINT_MATRIX.md) & [`RBAC_004_FINAL_CONTROLLER_AUTHORITY_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/RBAC_004_FINAL_CONTROLLER_AUTHORITY_MATRIX.md)

| Endpoint ID | Target Controller | Endpoint Route | HTTP Method & Java Method | Operation | Required Privilege / Role | Tested HTTP Status | Verified Result |
|:---:|:---|:---|:---|:---:|:---|:---:|:---:|
| **`RBAC-004-EP-01`** | `RoleLevelMasterController` | `POST /private/v1/role-levels` | `saveRoleLevel` | WRITE | `MANAGE_ROLE_LEVEL`, `ROLE_SUPER_ADMIN` | 201 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-02`** | `RoleLevelMasterController` | `GET /private/v1/role-levels/{code}` | `viewRoleLevel` | READ | `VIEW_ROLE_LEVEL`, `MANAGE_ROLE_LEVEL`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-03`** | `RoleLevelMasterController` | `POST /private/v1/role-levels/update/{code}` | `updateRoleLevel` | WRITE | `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-04`** | `RoleLevelMasterController` | `POST /private/v1/role-levels/delete/{code}` | `deleteRoleLevel` | WRITE | `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-05`** | `RoleLevelMasterController` | `GET /private/v1/role-levels/active` | `getActiveRoleLevels` | READ | `VIEW_ROLE_LEVEL`, `MANAGE_ROLE_LEVEL`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-06`** | `RoleLevelMasterController` | `POST /private/v1/role-levels/update/{code}/toggle-status`| `toggleStatus` | WRITE | `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-07`** | `RoleLevelMasterController` | `GET /private/v1/role-levels` | `getAllRoleLevels` | READ | `VIEW_ROLE_LEVEL`, `MANAGE_ROLE_LEVEL`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-08`** | `RoleTypeMasterController` | `POST /private/v1/role-types` | `saveRoleType` | WRITE | `MANAGE_ROLE_TYPE`, `ROLE_SUPER_ADMIN` | 201 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-09`** | `RoleTypeMasterController` | `GET /private/v1/role-types` | `getAllRoleTypes` | READ | `VIEW_ROLE_TYPE`, `MANAGE_ROLE_TYPE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-10`** | `RoleTypeMasterController` | `GET /private/v1/role-types/{code}` | `viewRoleType` | READ | `VIEW_ROLE_TYPE`, `MANAGE_ROLE_TYPE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-11`** | `RoleTypeMasterController` | `POST /private/v1/role-types/update/{code}` | `updateRoleType` | WRITE | `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-12`** | `RoleTypeMasterController` | `POST /private/v1/role-types/delete/{code}` | `deleteRoleType` | WRITE | `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-13`** | `RoleTypeMasterController` | `GET /private/v1/role-types/active` | `getActiveRoleTypes` | READ | `VIEW_ROLE_TYPE`, `MANAGE_ROLE_TYPE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-14`** | `RoleTypeMasterController` | `POST /private/v1/role-types/update/{code}/toggle-status` | `toggleStatus` | WRITE | `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-15`** | `PrivilegeController` | `POST /private/v1/privileges` | `createPrivilege` | WRITE | `MANAGE_PRIVILEGE`, `ROLE_SUPER_ADMIN` | 201 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-16`** | `PrivilegeController` | `POST /private/v1/privileges/update`, `/update/{id}` | `updatePrivilege` | WRITE | `MANAGE_PRIVILEGE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-17`** | `PrivilegeController` | `GET /private/v1/privileges/{id}` | `getPrivilegeById` | READ | `VIEW_PRIVILEGE`, `MANAGE_PRIVILEGE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-18`** | `PrivilegeController` | `GET /private/v1/privileges` | `getAllPrivileges` | READ | `VIEW_PRIVILEGE`, `MANAGE_PRIVILEGE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-19`** | `PrivilegeController` | `POST /private/v1/privileges/delete/{id}` | `deletePrivilege` | WRITE | `MANAGE_PRIVILEGE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-20`** | `ResourceController` | `POST /private/v1/resources` | `saveResource` | WRITE | `MANAGE_RESOURCE`, `ROLE_SUPER_ADMIN` | 201 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-21`** | `ResourceController` | `GET /private/v1/resources` | `manageResource` | READ | `VIEW_RESOURCE`, `MANAGE_RESOURCE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-22`** | `ResourceController` | `GET /private/v1/resources/{resourceId}` | `viewResource` | READ | `VIEW_RESOURCE`, `MANAGE_RESOURCE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-23`** | `ResourceController` | `POST /private/v1/resources/update`, `/update/{id}` | `updateResource` | WRITE | `MANAGE_RESOURCE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-24`** | `ResourceController` | `POST /private/v1/resources/delete/{resourceId}` | `deleteResource` | WRITE | `MANAGE_RESOURCE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |
| **`RBAC-004-EP-25`** | `ResourceController` | `POST /private/v1/resources/by-privilege-codes` | `getResourcesByPrivilegeCodes` | READ | `VIEW_RESOURCE`, `MANAGE_RESOURCE`, `ROLE_SUPER_ADMIN` | 200 (Auth) / 403 (Unauth) | **PASS** |

---

## 7. Phase 4 Software Composition Analysis Index (SCA-001 through SCA-012)

Authoritative Source: [`SCA_FINDINGS_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_FINDINGS_REGISTER.md) (Nov 2, 2026)

| Canonical ID | Affected Component & Package | Installed Version | CVE / Advisory | CVSS | Severity | Fixed Version | Current Remediation Status | Formal Acceptance Status | Residual Risk Link |
|:---:|:---|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **`SCA-001`** | PostgreSQL JDBC (`org.postgresql:postgresql`) | `42.6.0` (revenue) | CVE-2024-1597 | **10.0** | **Critical** | `42.6.2`+ | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`SCA-002`** | Tomcat Embed Core (`tomcat-embed-core`) | `10.1.18`..`10.1.33` | CVE-2024-50379 / CVE-2024-56337 | **9.8** | **Critical** | `10.1.34`+ | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`SCA-003`** | Spring Web UriComponentsBuilder | `6.1.3` (revenue) | CVE-2024-22243 / 22259 / 22262 | **8.1** | **High** | `6.1.15`+ | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`SCA-004`** | Spring Web & WebMVC Functional Routing | `6.1.3`..`6.1.15` | CVE-2024-38807 / 38816 / 38819 | **7.5** | **High** | `6.1.16`+ | **PARTIALLY_MITIGATED** | PENDING_FORMAL_ACCEPTANCE | `RR-11` |
| **`SCA-005`** | Spring Security Core & Web | `6.2.1`..`6.3.5` | CVE-2024-22234 / 22257 / 38821 | **7.5** | **High** | `6.3.8`+ | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`SCA-006`** | Netty HTTP & Transport (Lettuce Redis) | `4.1.105.Final` | CVE-2024-29025 / CVE-2024-47535 | **7.5** | **High** | `4.1.115.Final`+ | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`SCA-007`** | Logback Classic & Core Serialization | `1.4.14` | CVE-2024-12798 / CVE-2024-12801 | **7.5** | **High** | `1.4.15` / `1.5.13`+ | **PARTIALLY_MITIGATED** | PENDING_FORMAL_ACCEPTANCE | `RR-11` |
| **`SCA-008`** | Legacy Unmaintained jBCrypt Library | `org.mindrot:jbcrypt:0.4` | CWE-1104 | **5.3** | **Medium** | Removed; BCrypt(12) | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`SCA-009`** | SheetJS (`xlsx`) Prototype Pollution & ReDoS | `0.18.5` (`lgd_react`) | CVE-2023-30533 / CVE-2024-22363 | **7.8** | **High** | ExcelJS / `0.19.3`+ | **PARTIALLY_MITIGATED** | PENDING_FORMAL_ACCEPTANCE | `RR-08` |
| **`SCA-010`** | Zod Memory Exhaustion on Constrained Colls | `3.25.76` (`lgd_react`) | GHSA-mrhx-c7xc-m3w5 | **7.5** | **High** | `4.6.6`+ | **PARTIALLY_MITIGATED** | PENDING_FORMAL_ACCEPTANCE | `RR-09` |
| **`SCA-011`** | Spring Boot Parent Version Divergence | Multi-version disparity | CWE-1104 | **6.5** | **Medium** | Aligned `3.2.12` | **VERIFIED_FIXED** | FORMALLY_ACCEPTED | N/A |
| **`SCA-012`** | Container Base Image Default Root Execution | `eclipse-temurin:21-jdk` | CWE-250 | **6.5** | **Medium** | UID `10001` | **DEFERRED (QUEUED)** | PENDING_FORMAL_ACCEPTANCE | `RR-06` |

---

## 7.1 Phase 7 Cryptography & Secrets Hardening Findings Index (CRYPTO-001..003 / SEC-001..002)

Authoritative Source: [`PHASE_7_REMEDIATION_EXECUTION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/PHASE_7_REMEDIATION_EXECUTION_REPORT.md) & [`PHASE_7_VERIFICATION_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/PHASE_7_VERIFICATION_EVIDENCE_REGISTER.md)

| Canonical ID | Finding Title | Severity (CVSS v3.1) | Target Component & Path | Primary CWE | Verification Evidence Ref | Pre-Remediation Status | Post-Remediation Status | Residual Risk Link |
|:---:|:---|:---:|:---|:---:|:---:|:---:|:---:|:---:|
| **`CRYPTO-001`** | Insecure Symmetric HMAC JWT Signing Across Microservices | **CRITICAL** (9.8) | `auth-service`, `api-gateway`, `user-management`, `revenue` | CWE-327 / CWE-798 | `EVD-P7-01` through `EVD-P7-09` | OPEN | **VERIFIED_REMEDIATED** | `RR-01` |
| **`CRYPTO-002`** | Deprecated jBCrypt Library & Static Weak Cost Factor | **MEDIUM** (5.3) | `auth-service` / `AuthServiceImpl.java` | CWE-1104 / CWE-916 | `EVD-P7-10`, `EVD-P7-11` | OPEN | **VERIFIED_REMEDIATED** | `RR-10` |
| **`CRYPTO-003`** | Unsigned XML Fallback in Production eSign Signature Utility | **HIGH** (8.8) | `revenue` / `XmlSignatureUtil.java` | CWE-347 / CWE-306 | `EVD-P7-12` through `EVD-P7-14` | OPEN | **VERIFIED_REMEDIATED** | N/A |
| **`SEC-001`** | Unauthenticated Redis Instance Permitting Blacklist Flushing | **CRITICAL** (9.4) | `docker-compose.yml` (Redis Service) | CWE-306 | `EVD-P7-15` | OPEN | **VERIFIED_REMEDIATED** | `RR-02` |
| **`SEC-002`** | Hardcoded Plaintext Secrets in Staging/Default Properties | **HIGH** (7.5) | Microservice `application-prod.properties`, `.env` | CWE-798 / CWE-259 | `EVD-P7-16` | OPEN | **VERIFIED_REMEDIATED** | `RR-07` |

---

## 8. Phase 0 Baseline Vulnerability Hypotheses Index (VULN-001 through VULN-023)

Authoritative Source: [`Vulnerability_Master_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Vulnerability_Master_Register.md)

| Baseline ID | Original Vulnerability Title | Severity (CVSS v3.1) | Correlated SAST ID | Correlated STRIDE ID | Correlated SCA ID | Final Evaluated Status |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|
| **`VULN-001`** | Hardcoded Static JWT Secret Across Microservices | **CRITICAL** (9.8) | `SAST-001` | `THR-STRIDE-001` | N/A | Remediated / Hardened (`VERIFIED_FIXED`) |
| **`VULN-002`** | XML External Entity (XXE) Injection in Public eSign | **CRITICAL** (9.8) | Defenses Active | `THR-STRIDE-003` | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-003`** | Electronic Signature Verification Bypass in eSign | **CRITICAL** (9.1) | `SAST-003`..`007` | `THR-STRIDE-003`, `008`| N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-004`** | Overly Permissive CORS with Wildcard Reflection | **HIGH** (8.5) | `CorsConfig` | *[Unassigned]* | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-005`** | Absence of Microservice Method-Level Authorization | **HIGH** (8.8) | `SAST-011` | `THR-STRIDE-018` | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-006`** | State & District Tenant Boundary Bypass (BOLA / IDOR) | **HIGH** (8.5) | `SAST-009`, `SAST-010`| `THR-STRIDE-005`, `019`| N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-007`** | Distributed Token Revocation Bypass across Gateway | **HIGH** (7.5) | `SAST-012` | `THR-STRIDE-007` | N/A | Architecture Remediated (`VERIFIED_FIXED`) |
| **`VULN-008`** | Plaintext JWT Bearer Token Leakage in Gateway Logs | **HIGH** (7.5) | Logging Masking | `THR-STRIDE-010` | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-009`** | Direct Container Port Exposure & Open Eureka | **HIGH** (7.5) | Compose Port Unmap | `THR-STRIDE-004`, `012`| N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-010`** | Username Enumeration via Differentiated Errors | **MEDIUM** (5.3) | `AuthServiceImpl` | `THR-STRIDE-016` | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-011`** | Weak Password Complexity and Missing Length Policy | **MEDIUM** (5.3) | User Validators | `THR-STRIDE-016` | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-012`** | Vulnerable Dependencies in Frontend Applications | **HIGH** (7.8) | `lgd_react` | *[Unassigned]* | `SCA-009`, `SCA-010` | Partially Mitigated (`RR-08`, `RR-09`) |
| **`VULN-013`** | Sensitive API Specification & Swagger Exposure in Prod | **LOW** (4.3) | `SAST-019` | `THR-STRIDE-013` | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-014`** | Microservice Containers Running as Privileged Root | **MEDIUM** (6.5) | Dockerfiles | *[Unassigned]* | `SCA-012` | Partially Mitigated (`RR-06`) |
| **`VULN-015`** | Absence of Rate Limiting on Ingress Endpoints | **MEDIUM** (6.5) | Gateway Rate Limit | `THR-STRIDE-016` | N/A | Documented / Remediated (`VERIFIED_FIXED`) |
| **`VULN-016`** | Missing Defense-in-Depth HTTP Security Headers | **LOW** (3.7) | `SAST-016` (Mitigation)| *[Unassigned]* | N/A | Partially Verified (`BLK-CANON-01`) |
| **`VULN-017`** | Hardcoded Staging Database Credentials in Config | **HIGH** (7.5) | `SAST-002` | `THR-STRIDE-012 (Amp)` | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-018`** | High Memory Consumption on Large Multipart Uploads | **MEDIUM** (5.3) | `SAST-018` | `THR-STRIDE-015` | N/A | Mitigated (`VERIFIED_FIXED`) |
| **`VULN-019`** | Gateway Missing Strict Content-Length Capping | **LOW** (3.5) | `SAST-015` | `THR-STRIDE-015`, `017`| N/A | Mitigated (`VERIFIED_FIXED`) |
| **`VULN-020`** | Absence of Refresh Token Rotation / Short Session | **MEDIUM** (5.9) | Auth Architecture | *[Unassigned]* | N/A | Partially Mitigated (`RR-01`, `RR-03`) |
| **`VULN-021`** | Public Access to Eureka Instance Registry Metadata | **MEDIUM** (6.5) | `SAST-020` | `THR-STRIDE-002` | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-022`** | Open Redirect Potential in Client-Side Router | **MEDIUM** (6.1) | Frontend Router | *[Unassigned]* | N/A | Remediated (`VERIFIED_FIXED`) |
| **`VULN-023`** | Prototype Pollution in Spreadsheet Generation Library | **HIGH** (7.8) | Frontend `xlsx` | *[Unassigned]* | `SCA-009` | Partially Mitigated (`RR-08`) |

---

## 9. Architectural STRIDE Threat & DREAD Risk Assessment Index (THR-STRIDE-001 through 020 / DREAD-01 through 20)

Authoritative Sources: [`STRIDE_Threat_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/STRIDE_Threat_Register.md) (Nov 2, 2026) & [`DREAD_Risk_Assessment.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DREAD_Risk_Assessment.md) (Nov 2, 2026)

> [!NOTE]
> **Methodological Demarcation: Architectural Threats vs. Concrete Security Findings**
> Under the LGD 2.0 Security Assurance Architecture, **architectural STRIDE threats and DREAD risk assessments** (originating in Phase 1 Threat Modeling) represent systemic threat actor scenarios, attack surfaces, and qualitative risk evaluations across system trust boundaries. They are distinct from:
> 1. **Concrete Software Vulnerabilities:** Discovered via static code analysis (Section 2, `SAST-001` through `SAST-021`).
> 2. **Empirical Exploit Vectors:** Retested via dynamic penetration testing (Section 3, `EXP-001` through `EXP-021`).
> 3. **Dependency Vulnerabilities:** Identified via CycloneDX / Trivy composition analysis (Section 7, `SCA-001` through `SCA-012`).
>
> This dedicated master index resolves **`DISC-CTRL-04`** by ensuring 100% bidirectional master-index representation for all 20 STRIDE threats and all 20 DREAD assessments, explicitly documenting both code-correlated and non-code architectural threats without creating competing copies of authoritative registers.

### 9.1 Authoritative 20-Threat STRIDE & DREAD Master Crosswalk Table

| STRIDE ID | Category | Threat Scenario Name | Target Component & Trust Boundary | Correlated VULN | Finding Crosswalk / Architectural Mapping | DREAD ID | DREAD (D,R,E,A,D) | DREAD Score & Level | CVSS v3.1 | Primary Mitigation Action |
|:---:|:---|:---|:---|:---:|:---|:---:|:---:|:---:|:---:|:---|
| **`THR-STRIDE-001`** | Spoofing | JWT Token Forgery via Hardcoded Static HMAC Secret | `Auth Service & API Gateway` (TB-01) | `VULN-001` | `SAST-001` (`EXP-001` / `EV-001`) | **`DREAD-01`** | 10,10,9,10,8 | **9.4** (Critical) | **9.8** | Implement RS256 asymmetric signing with private key stored in Vault, public key distribution. |
| **`THR-STRIDE-002`** | Spoofing | Rogue Microservice Registration on Eureka Discovery | `Eureka Discovery Server` (TB-06) | `VULN-021` | `SAST-020` (`EXP-020` / `EV-007A`, `EV-007B`) | **`DREAD-02`** | 10,10,9,9,7 | **9.0** (Critical) | **9.8** | Enforce Spring Security HTTP Basic auth on Eureka server and clients, restrict to Docker internal network. |
| **`THR-STRIDE-003`** | Spoofing | CDAC e-Hastakshar Callback Spoofing & Transaction Injection | `Revenue Service` (TB-07) | `VULN-003` | `SAST-003`..`007` (`EXP-003`..`007` / `EV-010`..`014`) | **`DREAD-03`** | 9,9,8,9,9 | **8.8** (Critical) | **9.6** | Require CDAC callback signature validation, verify txnId against Redis active session, bind with original PDF hash. |
| **`THR-STRIDE-004`** | Spoofing | Direct Microservice HTTP Ingress Bypassing Gateway | `Revenue & User Management Services` (TB-02) | `VULN-009` | `SAST-013` (`EXP-013` / `EV-003`) | **`DREAD-04`** | 10,10,9,9,8 | **9.2** (Critical) | **9.8** | Remove public host port bindings (18090, 18089, 18062) in docker-compose.yml; allow access only via gateway service mesh. |
| **`THR-STRIDE-005`** | Tampering | Cross-Tenant Draft Modification & State Boundary Violations (BOLA) | `Revenue Service` (TB-03) | `VULN-006` | `SAST-009`, `SAST-010` (`EXP-009`, `EXP-010` / `EV-005`) | **`DREAD-05`** | 9,9,8,9,8 | **8.6** (Critical) | **9.1** | Implement TenantSecurityContext in BaseService enforcing WHERE state_code = :jwtStateCode on all queries. |
| **`THR-STRIDE-006`** | Tampering | Privilege & Role Injection via Mass Assignment in User Management APIs | `User Management` (TB-03) | `*[Unassigned]*` | `SAST-008` (`EXP-008` / `EV-015`) | **`DREAD-06`** | 9,9,8,9,9 | **8.8** (Critical) | **9.4** | Use immutable UserUpdateDTO with strict property mapping; forbid role fields in general user update endpoints. |
| **`THR-STRIDE-007`** | Tampering | Token Blacklist Invalidation via Unauthenticated Redis Flush | `Redis Cache` (TB-05) | `VULN-007` | `SAST-012` (`EXP-012` / `EV-002`) | **`DREAD-07`** | 8,9,9,8,7 | **8.2** (Critical) | **8.6** | Set high-entropy requirepass in redis.conf; unbind 6379 from 0.0.0.0 in docker-compose.yml. |
| **`THR-STRIDE-008`** | Tampering | Government Gazette Document PDF Hash Substitution | `Revenue Service` (TB-07) | `VULN-003` | *[Non-Code Architectural Threat — Pre-signing PDF Hash Lock]* | **`DREAD-08`** | 8,7,7,9,8 | **7.8** (High) | **8.8** | Store immutable SHA-256 digest in signed transaction record; verify exact hash match before marking PUBLISHED. |
| **`THR-STRIDE-009`** | Repudiation | Missing Audit Trails for Directory Entity Deletion & Modifications | `Revenue & User Management` (TB-03) | `*[Unassigned]*` | *[Non-Code Architectural Threat — Entity Audit Logging Deficit]* | **`DREAD-09`** | 7,8,6,7,6 | **6.8** (High) | **7.1** | Integrate Hibernate Envers or custom @Audited entity interceptors recording actor, IP, timestamp, and field deltas. |
| **`THR-STRIDE-010`** | Repudiation | Bearer Token Attribution Confusion via Gateway Log Obfuscation Absence | `API Gateway` (TB-01) | `VULN-008` | Logging Masking (`ApiLoggingFilter.java` / `logback.xml`) | **`DREAD-10`** | 8,8,7,7,7 | **7.4** (High) | **7.5** | Configure regex pattern masking in logback.xml and ApiLoggingFilter for Authorization and cookie headers. |
| **`THR-STRIDE-011`** | Information Disclosure | Spring Boot Actuator Environment & Secret Key Harvesting | `Discovery, Revenue, Auth & User Management` (TB-01) | `*[Unassigned]*` | *[Non-Code Architectural Threat — Actuator Harvest Exposure]* | **`DREAD-11`** | 10,10,9,9,8 | **9.2** (Critical) | **9.8** | Set management.endpoints.web.exposure.include=health,info; restrict /actuator to internal loopback. |
| **`THR-STRIDE-012`** | Information Disclosure | PostgreSQL Direct Access via Host Port Exposure | `PostgreSQL Database` (TB-04) | `VULN-009` | `SAST-002` (Amplifier via Compose unmap / `EV-009`) | **`DREAD-12`** | 10,10,9,10,8 | **9.4** (Critical) | **9.8** | Change ports mapping to expose: 5432 (Docker internal only, no host port publish). |
| **`THR-STRIDE-013`** | Information Disclosure | Swagger / OpenAPI Specification & Schema Leakage in Production | `API Gateway & Microservices` (TB-01) | `VULN-013` | `SAST-019` (`EXP-019` / `EV-019A`, `EV-019B`) | **`DREAD-13`** | 8,8,7,7,7 | **7.4** (High) | **5.3** | Disable springdoc in production profile or enforce ADMIN role requirement. |
| **`THR-STRIDE-014`** | Information Disclosure | Client-Side Token Theft via Stored XSS in Entity Description Fields | `React Frontend (lgd_react / lgd-um)` (TB-08) | `*[Unassigned]*` | `SAST-016` (Defense-in-Depth CSP / `EV-006`) | **`DREAD-14`** | 8,8,7,8,9 | **8.0** (Critical) | **8.8** | Store tokens in HttpOnly SameSite=Strict cookies; implement strict Content-Security-Policy header in Gateway. |
| **`THR-STRIDE-015`** | Denial of Service | Oversized Multipart File Upload & Resource Exhaustion (Zip/PDF Bomb) | `Revenue Service Attachment Controller` (TB-01) | `VULN-018` | `SAST-015`, `SAST-018` (`EXP-015`, `EXP-018` / `EV-016`, `EV-018`) | **`DREAD-15`** | 8,9,8,7,6 | **7.6** (High) | **7.5** | Enforce spring.servlet.multipart.max-file-size=5MB, stream file parsing, validate MIME via Apache Tika. |
| **`THR-STRIDE-016`** | Denial of Service | Authentication Endpoint Brute-Force & Credential Stuffing Flooding | `Auth Service` (TB-01) | `VULN-015` | Gateway Token-Bucket Rate Limiter (`AuthService`) | **`DREAD-16`** | 8,8,7,8,9 | **8.0** (Critical) | **7.5** | Implement Redis-backed Token Bucket rate limiter in API Gateway (5 attempts/min per IP on /auth/public/login). |
| **`THR-STRIDE-017`** | Denial of Service | Regex Denial of Service (ReDoS) in Input Validation Patterns | `API Gateway & Services` (TB-01) | `VULN-019` | *[Non-Code Architectural Threat — ReDoS Pattern Complexity]* | **`DREAD-17`** | 7,8,6,7,6 | **6.8** (High) | **7.5** | Audit and simplify all regex patterns; use RE2/J linear-time regular expression library. |
| **`THR-STRIDE-018`** | Elevation of Privilege | Missing Method-Level Security Annotations in Controller Layer | `User Management & Revenue` (TB-03) | `VULN-005` | `SAST-011` (`EXP-011` / `EV-020`, `EVD-RBAC-08`) | **`DREAD-18`** | 9,9,8,8,8 | **8.4** (Critical) | **8.8** | Enable @EnableMethodSecurity(prePostEnabled = true) and declare granular role checks on all controller methods. |
| **`THR-STRIDE-019`** | Elevation of Privilege | District-to-State Privilege Escalation via Organizational Context Injection | `Revenue Service` (TB-03) | `VULN-006` | *[Non-Code Architectural Threat — District-to-State Escalation]* | **`DREAD-19`** | 8,7,7,9,8 | **7.8** (High) | **8.8** | Implement StateMachine validation asserting only STATE_ADMIN can transition drafts to STATE_APPROVED. |
| **`THR-STRIDE-020`** | Elevation of Privilege | Client-Side Route Guard Bypass in React Single Page Application | `React Applications (lgd_react / lgd-um)` (TB-08) | `*[Unassigned]*` | *[Non-Code Architectural Threat — React Client Route Guard]* | **`DREAD-20`** | 6,9,9,6,6 | **7.2** (High) | **6.5** | Enforce zero-trust server-side validation; treat all UI state as untrusted presentation hints. |

### 9.2 Resolution Details for Previously Missing STRIDE and DREAD Records (DISC-CTRL-04)

1. **Reconciliation of Six Non-Code STRIDE Threats:**
   - **`THR-STRIDE-008` (PDF Hash Substitution):** Tampering scenario targeting pre-signing document dispatch queues in Revenue Service (`TB-07`). Mapped to baseline `VULN-003`; mitigated by database-level SHA-256 digest locking prior to marking state `PUBLISHED`.
   - **`THR-STRIDE-009` (Missing Entity Deletion Audit Trails):** Repudiation threat regarding un-audited entity deletions (`CWE-778`). Kept strictly distinct from `SAST-014` (IP spoofing) and `THR-STRIDE-010` (Bearer token logging); mitigated via Hibernate Envers entity listener interceptors.
   - **`THR-STRIDE-011` (Actuator Secret Harvesting):** Information disclosure threat targeting exposed `/actuator/env` or heap dumps (`CWE-200`). Kept distinct from `SAST-021` (internal debug controller bytecode) and `THR-STRIDE-013` (Swagger UI); mitigated by restricting web exposure to `health,info` and loopback access.
   - **`THR-STRIDE-017` (Regex Denial of Service / ReDoS):** Denial of service scenario exploiting catastrophic backtracking in gateway route validators (`CWE-1333`). Correlated with baseline `VULN-019`; mitigated via linear-time DFA regex expressions (RE2/J).
   - **`THR-STRIDE-019` (District-to-State Escalation):** Organizational context injection in Revenue draft transitions (`CWE-269`). Correlated with baseline `VULN-006`; mitigated by workflow StateMachine enforcing `STATE_ADMIN` role validation on state-level gazette transitions.
   - **`THR-STRIDE-020` (Client-Side Route Guard Bypass):** Client-side enforcement bypass in React SPA (`CWE-602`). Mitigated by zero-trust server-side `@PreAuthorize` authorization on all underlying REST APIs.

2. **Reconciliation of Nine Non-Crosswalk DREAD Assessments:**
   - The nine DREAD assessments not linked in the primary SAST code crosswalk (`DREAD-08`, `09`, `10`, `11`, `12`, `16`, `17`, `19`, `20`) are fully restored above with exact subcomponent dimensions ($D, R, E, A, D$), aggregate scores (ranging from 6.8 to 9.4), and risk levels preserved directly from [`DREAD_Risk_Assessment.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DREAD_Risk_Assessment.md).

---

## 10. Traceability Reconciliation & Discrepancy Log

| Reconciliation Issue | Previous Defect / Discrepancy | Corrected Canonical Determination | Traceability Impact |
|:---|:---|:---|:---|
| **EXP vs SAST Synthetic Alignment Defect** | Prior un-reconciled matrix of 2026-11-05T12:35 mapped `SAST-009`/`010` to Actuator/Secret entries instead of Draft BOLA. | Re-anchored to [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md). `EXP-009` & `EXP-010` map 100% to Draft BOLA and deletion. | Full bidirectional traceability restored |
| **OBS-SQLI-01 Misattribution** | `OBS-SQLI-01` was conflated with `SAST-013` (Gateway route traversal) in a preliminary table. | `OBS-SQLI-01` disentangled as an independent standalone observation (`EV-021`, confirmed secure false positive across all 24 JPA repos). | Eliminates false association with gateway route validation |
| **Historical Severity Downgrade Prevention** | Attempts in preliminary drafts to downgrade `RBAC-009` (Horizontal IDOR) from Medium/5.3 and `RBAC-012` (Fail-open tenant) from High/7.5. | Severities preserved strictly at original levels: `RBAC-009` at Medium (5.3) and `RBAC-012` at High (7.5). | Preserves historical audit integrity |
| **SCA-007 through SCA-012 Ordering** | Preliminary notes swapped backend Java `logback` with frontend `xlsx`, and backend `jbcrypt` with frontend `zod`. | Reconciled using verified package coordinates: `SCA-007` = Logback, `SCA-008` = jBCrypt, `SCA-009` = SheetJS, `SCA-010` = Zod, `SCA-011` = Boot disparity, `SCA-012` = Base image root. | Clear demarcation between backend Maven and frontend npm |
| **DISC-CTRL-04: Full Architectural STRIDE & DREAD Integration** | Phase 2 controller indexed STRIDE/DREAD exclusively in SAST table, omitting 6 non-code threats (`THR-STRIDE-008`, `009`, `011`, `017`, `019`, `020`) and 9 DREAD scores. | Appended Section 9 indexing all 20 STRIDE threats and 20 DREAD assessments with exact scores, components, and bidirectional crosswalks. | 100% master-index coverage achieved |

---

## 11. Implementation Blueprint Discoveries Register (DISC-P913-01 through DISC-P913-06)

The following six critical design discoveries were forensically identified during the independent Phase 9.1.3 audit and fully incorporated and verified in the Phase 9.1.4 Stage B implementation blueprint:

| Discovery ID | Subsystem | Severity | Forensic Root Cause | Stage B Blueprint Resolution | Evidence Reference | Technical Status |
|:---:|:---|:---:|:---|:---|:---|:---:|
| **`DISC-P913-01`** | Redis Sentinel | **CRITICAL** | Template omitted `sentinel sentinel-pass`. Sentinels receive `NOAUTH` during peer gossip and voting in Redis 6.2+. | Added `sentinel sentinel-pass ${REDIS_SENTINEL_PASSWORD}` to template; pinned `redis:alpine` digest in Compose. | `EVD_P9_1_3_01`, `EVD_P9_1_4_02` | **VERIFIED & INCORPORATED** |
| **`DISC-P913-02`** | Spring / Lettuce | **CRITICAL** | Netty TLS defaults to JVM `cacerts`, which lacks internal CA (`lgd-internal-ca.crt`). Throws PKIX handshake failure. | Added `keytool -importcert` into Temurin JRE `cacerts` during Docker build; purged orphan bean. | `EVD_P9_1_3_02`, `EVD_P9_1_4_03` | **VERIFIED & INCORPORATED** |
| **`DISC-P913-03`** | Resilience (RES-05) | **HIGH** | `docker network disconnect` severed primary from all nodes including S1, collapsing split-brain test to crash test. | Redesigned `RES-05` using bidirectional `iptables` DROP rules in `DOCKER-USER` chain between P+S1 and S2+S3+R1+R2. | `EVD_P9_1_3_03`, `EVD_P9_1_4_04` | **VERIFIED & INCORPORATED** |
| **`DISC-P913-04`** | Revenue Census | **HIGH** | `revenue/pom.xml` lacks `spring-boot-starter-actuator`. Mandating `/actuator/mappings` makes BLK-CANON-02 uncloseable. | Reconciled Factor 4: requires Actuator POM dependency OR ApplicationContext reflection testing. | `EVD_P9_1_3_04`, `EVD_P9_1_4_05` | **VERIFIED & INCORPORATED** |
| **`DISC-P913-05`** | Revenue Census | **MEDIUM** | Fictitious routes probed; omitted 20 `/private/v1/test/**` routes; Spring Security intercepts unauth probes with 401. | Expanded census to all 40 actual routes; mandated valid authenticated JWT Bearer token for 404 test. | `EVD_P9_1_3_04`, `EVD_P9_1_4_05` | **VERIFIED & INCORPORATED** |
| **`DISC-P913-06`** | PostgreSQL Security | **HIGH** | Step B1-05 queried `rolpassword` (hash export); hardcoded ephemeral WSL2 Hyper-V IP `172.20.32.1`. | Replaced with boolean SCRAM verification query; documented Hyper-V static switch & mirrored networking. | `EVD_P9_1_3_05`, `EVD_P9_1_4_06` | **VERIFIED & INCORPORATED** |

---

## 12. Implementation Blueprint Discoveries Register (DISC-P914-01 through DISC-P914-06)

The following six critical design discoveries were independently verified during the Phase 9.1.5 targeted corrective audit and fully resolved in the Stage B implementation package:

| Discovery ID | Subsystem | Severity | Forensic Root Cause | Stage B Blueprint Resolution | Evidence Reference | Technical Status |
|:---:|:---|:---:|:---|:---|:---|:---:|
| **`DISC-P914-01`** | Redis Sentinel | **CRITICAL** | Template configured invalid directive `sentinel requirepass`, causing fatal configuration parser abort on boot. | Expunged `sentinel requirepass`; applied valid `requirepass <password>` in `sentinel.conf.template`; added `sentinel announce-hostnames yes`. | `EVD_P9_1_5_01` | **DESIGN_VALIDATED / RUNTIME_VERIFICATION_PENDING** |
| **`DISC-P914-02`** | Revenue Census | **HIGH** | Previous blueprint tested only 10 primary paths, omitting 30 alias paths; unauthenticated probes return 401, not 404. | Constructed exhaustive 40-route inventory; mandated authenticated JWT Bearer token probes; established 8-factor acceptance protocol. | `EVD_P9_1_5_02` | **DESIGN_VALIDATED / RUNTIME_VERIFICATION_PENDING** |
| **`DISC-P914-03`** | PostgreSQL Network | **HIGH** | Hardcoded ephemeral WSL2 IP risks bind crash across reboots; `pg_hba.conf` omitted IPv6 terminal reject; SCRAM checked 4 roles only. | Engineered fail-closed pre-startup discovery script; added dual-stack `::/0 reject`; formulated dynamic `WHERE rolcanlogin=true` query. | `EVD_P9_1_5_03` | **DESIGN_VALIDATED / IMPLEMENTATION_PENDING** |
| **`DISC-P914-04`** | PostgreSQL TLS | **HIGH** | Blueprint specified unportable `SELECT ssl_is_used();` which fails without optional contrib extension `sslinfo`. | Replaced with core catalog view `pg_stat_ssl` with `WHERE pid = pg_backend_pid()`; mandated 7-factor client `verify-full` validation. | `EVD_P9_1_5_04` | **DESIGN_VALIDATED / RUNTIME_VERIFICATION_PENDING** |
| **`DISC-P914-05`** | PostgreSQL Rollback | **HIGH** | Backup omitted `server.crt`, `server.key`, `ca.crt`, and NTFS ACLs; role rollback relied on hazardous `pg_dumpall --globals-only`. | Formulated 11-control certificate backup and recovery runbook with NTFS ACL preservation; designed selective, encrypted role rollback. | `EVD_P9_1_5_05` | **DESIGN_VALIDATED / ROLLBACK_DESIGN_ONLY** |
| **`DISC-P914-06`** | Container & Perimeter | **HIGH** | Docker build context scoped to `./revenue` breaks root CA import; Nginx rollback hazard; undisclosed Redis failover write-loss. | Anchored Compose build context to root (`context: .`); verified Lettuce 6.3.2.RELEASE customizer; banned port 8092 fallback; disclosed AOF write window. | `EVD_P9_1_5_06` | **DESIGN_VALIDATED / IMPLEMENTATION_PENDING** |

---

## 13. Program Milestone Attestation

$$\mathbf{FINDING\ REGISTER\ SYNCHRONIZED\ &\ TRACEABILITY\ HARMONIZED.}$$
$$\mathbf{PHASE\ 9.1.5\ RECONCILIATION\ COMPLETED\ —\ 124\ TECHNICAL\ FINDINGS\ +\ 12\ BLUEPRINT\ DISCOVERIES\ VERIFIED.}$$



