# LGD 2.0 — Master Security Evidence Register
## Unified Empirical Evidence Index, Test Proof Catalog & Cryptographic Traceability Register

| **Evidence Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Document Role** | Traceability Layer & Index (Non-competing pointer to authoritative evidence records) |
| **Authoritative Evidence Sources** | [`PHASE_7_VERIFICATION_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/PHASE_7_VERIFICATION_EVIDENCE_REGISTER.md), [`PHASE_6_FINAL_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_EVIDENCE_REGISTER.md), [`DAST_Evidence_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Evidence_Register.md), [`PHASE0_4_EVIDENCE_INDEX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_EVIDENCE_INDEX.md), [`PHASE_4_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_4_EVIDENCE_REGISTER.md), [`PHASE_5_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_5_EVIDENCE_REGISTER.md), [`PHASE_6_FINAL_SUREFIRE_CENSUS.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_SUREFIRE_CENSUS.md) |
| **Evaluation Timestamp** | November 6, 2026 (`2026-11-06T12:45:00+05:30`) |
| **Indexed Evidence Records** | 21 Canonical Exploit Proofs (`EV-001`..`020`), 1 Observation Proof (`EV-021`), 22 RBAC Proofs (`EVD-RBAC-01`..`22`), 4 Gate B Technical Proofs (`EVD-GATEB-01`..`04`), 17 Phase 7 Proofs (`EVD-P7-01`..`17`), 10 Phase 8 Proofs (`EVD_P8_01`..`10`), 3 Phase 8.1 Proofs (`EVD-P8-1-01`..`03`), 6 Phase 9.1.2 Proofs (`EVD_P9_1_2_01`..`06`), 5 Phase 9.1.3 Proofs (`EVD_P9_1_3_01`..`05`), 6 Phase 9.1.4 Proofs (`EVD_P9_1_4_01`..`06`), 6 Phase 9.1.5 Proofs (`EVD_P9_1_5_01`..`06`), 1 Full Platform Surefire Census (418/418 Tests PASS) |
| **Mandatory Program Directive** | **PHASE 9.1.5 COMPLETED — BLUEPRINT DEFECT REMEDIATION & EVIDENCE RECONCILIATION COMPLETED; 6 EMPIRICAL EVIDENCE RECORDS PRODUCED.** |

---

## 1. Architectural Scope & Evidence Standards

> [!IMPORTANT]
> **Anti-Fabrication & Evidence Traceability Mandate:** Every evidence entry indexed in this register points to concrete, empirical artifacts: executing automated test suites, captured HTTP request/response payloads, configuration baselines, or schema validation outputs. In strict compliance with audit governance, **zero evidence records are simulated or inferred**.

---

## 2. Canonical Exploit Evidence Index (EV-001 through EV-020 + EV-021)

Authoritative Source: [`PHASE_6_FINAL_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_EVIDENCE_REGISTER.md) (Section II) & [`DAST_Evidence_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Evidence_Register.md)

| Evidence ID | Correlated Finding & Exploit Ref | Target Component & Path | Empirical Verification Type | Baseline Observation | Remediated Verification Result | Authoritative Evidence Artifact Path | Technical Status |
|:---:|:---|:---|:---|:---|:---|:---|:---:|
| **`EV-001`** | `SAST-001` / `EXP-001` | `user-management` / `/private/v1/resources` | Automated Unit & Integration Tests | Valid JWT forged via static secret; HTTP 200 OK | Forged token rejected; HTTP 401 Unauthorized | `auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.security.JwtHardeningRegressionTest.xml` | **VERIFIED_FIXED** |
| **`EV-002`** | `SAST-012` / `EXP-012` | `api-gateway` / Ingress Filter | Automated Reactive Filter Unit Tests | Revoked token replayed past gateway; HTTP 200 OK | Blacklisted JTI rejected; HTTP 401 (fails closed 503 on Redis timeout) | `api-gateway/target/surefire-reports/TEST-in.gov.lgd.gateway.filter.AuthenticationFilterTest.xml` | **VERIFIED_FIXED** |
| **`EV-003`** | `SAST-013` / `EXP-013` | `api-gateway` / `RouteValidator` | Automated Route Matcher Unit Tests | Traversal `/..;/` bypassed auth filter; HTTP 200 OK | Normalized URI evaluation rejects traversal; HTTP 401 | `api-gateway/target/surefire-reports/TEST-in.gov.lgd.gateway.filter.RouteValidatorTest.xml` | **VERIFIED_FIXED** |
| **`EV-004`** | `SAST-014` / `EXP-014` | `api-gateway` / `ApiLoggingFilter` | Automated Header Sanitization Unit Tests | Injected `X-Forwarded-For` logged; Client IP spoofed | Remote socket address selected (127.0.0.1); headers stripped | `api-gateway/target/surefire-reports/TEST-in.gov.lgd.gateway.filter.IdentityHeaderSanitizationFilterTest.xml` | **VERIFIED_FIXED** |
| **`EV-005`** | `SAST-009`, `010` / `EXP-009`, `010` | `revenue` / `/private/v1/draft/*` | Automated Multi-Tenant Unit Tests | Cross-state user accessed foreign drafts; HTTP 200 | Tenant boundary enforced; returns HTTP 403 Forbidden | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` | **VERIFIED_FIXED** |
| **`EV-006`** | `SAST-016` / `EXP-016` | `api-gateway` / Ingress Response | Automated Filter Test & Live Header Probe | Missing CSP, X-Frame-Options, and HSTS headers | CSP and framing headers verified; HSTS pending TLS proxy | `api-gateway/target/surefire-reports/TEST-in.gov.lgd.gateway.filter.SecurityHeadersFilterTest.xml` | **PARTIALLY_VERIFIED** |
| **`EV-007A`**| `SAST-020` / `EXP-020` | `discovery` / `http://localhost:8761/eureka/apps` | Automated Spring Security Test (Unauth) | Unauthenticated registry access; HTTP 200 OK | Unauthenticated probe rejected; HTTP 401 Unauthorized | `discovery/target/surefire-reports/TEST-in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest.xml` | **VERIFIED_FIXED** |
| **`EV-007B`**| `SAST-020` / `EXP-020` | `discovery` / `http://localhost:8761/eureka/apps` | Automated Spring Security Test (Auth) | Basic Auth not required on registry | Authenticated probe with service credentials; HTTP 200 OK | `discovery/target/surefire-reports/TEST-in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest.xml` | **VERIFIED_FIXED** |
| **`EV-008`** | `SAST-021` / `EXP-021` | `revenue` / `http://localhost:18062/test/api1` | Configuration Census & Gateway Probe | Debug endpoints routed in production; HTTP 200 OK | Gateway blocks perimeter route (403); `@Profile({"dev","test"})` applied | `revenue/src/main/java/in/nic/lgd/revenue/controller/TestController.java` | **PARTIALLY_VERIFIED** |
| **`EV-009`** | `SAST-002` / `EXP-002` | PostgreSQL Host Port 5432 & Config | Compose Config & Startup Validation Test | Host port `5432:5432` exposed; plaintext DB passwords | Port unmapped; mandatory environment variables required | `docker-compose.yml`, `auth-service/src/test/java/in/nic/lgd/auth/security/ProductionSecurityValidatorTest.java` | **VERIFIED_FIXED** |
| **`EV-010`** | `SAST-003` / `EXP-003` | `revenue` / `revenue.p12` Keystore | Startup Configuration Validation Test | Plaintext keystore password committed; extracted | Keystore password externalized; startup fails closed | `revenue/src/main/resources/application.properties`, `revenue/src/main/resources/application-prod.properties` | **VERIFIED_FIXED** |
| **`EV-011`** | `SAST-004` / `EXP-004` | `revenue` / `/public/v1/ehastakshar/response` | Automated Signature Validation Tests | XML signature wrapping permitted; altered XML accepted | `secureValidation=true` enforced; external DTDs disabled | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.EsignCallbackSecurityTest.xml` | **VERIFIED_FIXED** |
| **`EV-012`** | `SAST-005` / `EXP-005` | `revenue` / `X509KeySelector.java` | Automated Certificate Path Validation Tests | Untrusted / self-signed certificate accepted | Certificate path validated against CDAC trust anchors | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.EsignCallbackSecurityTest.xml` | **VERIFIED_FIXED** |
| **`EV-013`** | `SAST-006` / `EXP-006` | `revenue` / `EsignService.java` | Automated Callback Integrity Tests | Verification bypassed via config flag | `esign.bypass.verification` fallback eliminated | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.EsignCallbackSecurityTest.xml` | **VERIFIED_FIXED** |
| **`EV-014`** | `SAST-007` / `EXP-007` | `revenue` / `/private/v1/ehastakshar/initiate` | Automated Entropy & Uniqueness Unit Tests | Predictable transaction IDs via `java.util.Random` | `SecureRandom` enforced; Redis transaction cache active | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.EsignValidationSecurityTest.xml` | **VERIFIED_FIXED** |
| **`EV-015`** | `SAST-008` / `EXP-008` | `user-management` / `PUT /private/v1/users/{id}` | Automated Service Layer Unit Tests | User elevated own role via update payload mass assignment| Role/privilege fields omitted from update DTO | `user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest.xml`| **VERIFIED_FIXED** |
| **`EV-016`** | `SAST-015` / `EXP-015` | `api-gateway` / `ApiLoggingFilter.java` | Automated Filter Unit Tests | Unbounded memory buffering on response payload | Response buffering decorator capped at 16 KB | `api-gateway/target/surefire-reports/TEST-in.gov.lgd.gateway.filter.ApiLoggingFilterTest.xml` | **VERIFIED_FIXED** |
| **`EV-017`** | `SAST-017` / `EXP-017` | `auth-service` / `/public/v1/auth/login` | Automated MVC Controller Tests | Null/empty payload crashed service with 500 error | `@Valid` enforces bean validation; returns HTTP 400 | `auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.controller.AuthSecondaryControllerTest.xml` | **VERIFIED_FIXED** |
| **`EV-018`** | `SAST-018` / `EXP-018` | `revenue` / `/private/v1/attachments/upload` | Automated Multipart Upload Security Tests | Non-PDF binaries accepted as government orders | Apache Tika magic-byte PDF inspection and 10MB limit | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.EsignValidationSecurityTest.xml` | **VERIFIED_FIXED** |
| **`EV-019A`**| `SAST-019` / `EXP-019` | `*/swagger-ui/index.html` | Configuration Census & Live HTTP Probes | Swagger UI accessible in production | Disabled under `prod` profile; returns HTTP 404 | Microservice `SwaggerConfig.java` and `application-prod.properties` | **VERIFIED_FIXED** |
| **`EV-019B`**| `SAST-019` / `EXP-019` | `*/v3/api-docs` | Configuration Census & Live HTTP Probes | OpenAPI specification exposed in production | Disabled under `prod` profile; returns HTTP 404 | Microservice `SwaggerConfig.java` and `application-prod.properties` | **VERIFIED_FIXED** |
| **`EV-020`** | `SAST-011` / `EXP-011` | Ingress Controller Endpoints across Services | Automated Security Integration Test Suites | Missing `@PreAuthorize` allowed unauthenticated calls | Universal method security enforced; returns HTTP 403 | `user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest.xml`| **VERIFIED_FIXED** |
| **`EV-021`** | `OBS-SQLI-01` / Standalone | All 24 JPA Repositories across 3 Services | Static AST Review & 90 Dynamic Attack Vectors | Unverified JPA dynamic query generation | Confirmed 100% parameterization; 0 SQLi vulnerabilities | [`PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md#L111) | **CONFIRMED_SECURE**|

---

## 3. Phase 6 RBAC & Multi-Tenancy Evidence Index (EVD-RBAC-01 through EVD-RBAC-22)

Authoritative Source: [`PHASE_6_FINAL_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_EVIDENCE_REGISTER.md) (Section I) & [`PHASE_6_FINAL_SUREFIRE_CENSUS.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_SUREFIRE_CENSUS.md)

| Evidence ID | Focus Area / Description | Verification Type | Target Component | Empirical Test Suite / Code Location | Verified Result | Correlated Finding |
|:---:|:---|:---|:---:|:---|:---:|:---:|
| **`EVD-RBAC-01`** | District Draft Cross-Tenant BOLA Isolation Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_CrossTenant` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-02`** | District Draft Same-Tenant Authorized Access Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_SameTenant` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-03`** | District Draft Cross-Tenant Deletion Defense Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.deleteDraftEntity_CrossTenant` | **PASS (100%)** | `RBAC-008` |
| **`EVD-RBAC-04`** | District Boundary Cross-District Draft Isolation Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_CrossDistrict` | **PASS (100%)** | `RBAC-011` |
| **`EVD-RBAC-05`** | Unauthenticated Request HTTP 401 Unauthorized Proof | Automated Integration Test | `user-management` | `SecurityIntegrationTest.testAccessWithoutJwt` | **PASS (100%)** | Perimeter Baseline |
| **`EVD-RBAC-06`** | Malformed JWT Token HTTP 401 Rejection Proof | Automated Integration Test | `user-management` | `SecurityIntegrationTest.testAccessWithInvalidJwt` | **PASS (100%)** | Perimeter Baseline |
| **`EVD-RBAC-07`** | Injected JWT "roles" Claim & Downstream Authority Mapping | Unit Tests & Code Census | `auth-service`, `um`, `revenue` | `JwtUtil.java`, `AuthServiceImpl.java`, `JwtAuthenticationFilter.java` | **VERIFIED** | `RBAC-001` |
| **`EVD-RBAC-08`** | Privilege & Master Controllers Method-Level Security Proof | Automated Integration Test | `user-management` | `RbacSecurityIntegrationTest.java:23-105` | **VERIFIED** | `RBAC-004` |
| **`EVD-RBAC-09`** | Subdistrict & Village Permissive Gates Remediation Proof | Controller Code & Unit Tests | `revenue` | `SubDistrictPrimaryController.java`, `VillagePrimaryController.java` | **VERIFIED** | `RBAC-005` |
| **`EVD-RBAC-10`** | Subdistrict Draft Cross-Tenant BOLA Remediation Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getSubDistrictDraftDetails_CrossTenant` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-11`** | Multi-Tenant Deletion Defense across All Draft Entity Types | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.deleteDraftEntity_SubDistrict_CrossTenant` | **PASS (100%)** | `RBAC-008` |
| **`EVD-RBAC-12`** | Multi-Tenant Scoped User Directory Database Query Proof | Automated Unit Test | `user-management` | `UserServiceImplTest.getAllUsers_StateAdmin_ReturnsStateUsersOnly` | **PASS (100%)** | `RBAC-010` |
| **`EVD-RBAC-13`** | Method Security RBAC Integration Suite Proof (10 Tests) | Automated Integration Test | `user-management` | `RbacSecurityIntegrationTest.java` (10/10 PASS) | **PASS (100%)** | `RBAC-016` |
| **`EVD-RBAC-14`** | Comprehensive Multi-Tenant Boundary Suite (9 Tests) | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.java` (9/9 PASS) | **PASS (100%)** | `RBAC-016` |
| **`EVD-RBAC-15`** | User-Role Mapping Hierarchy Dominance & Self-Elevation | Automated Unit Test | `user-management` | `UserRoleMappingServiceImplTest` (13/13 PASS) | **PASS (100%)** | `RBAC-003` |
| **`EVD-RBAC-16`** | User Hierarchy Dominance & Self-Deletion Guardrail Defense | Automated Unit Test | `user-management` | `UserServiceImplTest` (15/15 PASS) | **PASS (100%)** | `RBAC-006`, `013` |
| **`EVD-RBAC-17`** | Horizontal IDOR & Cross-Tenant User Retrieval Defense | Automated Unit Test | `user-management` | `UserServiceImplTest` (15/15 PASS) | **PASS (100%)** | `RBAC-009` |
| **`EVD-RBAC-18`** | Fail-Closed Policy on Missing/Null Tenant Claims | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_NullStateCode` | **PASS (100%)** | `RBAC-012` |
| **`EVD-RBAC-19`** | Frontend React RoleGuard Route & Action Button Authorization | Vite Build & Code Review | `lgd-um` | `main.jsx:32-55`, `UserManagement.jsx:400-440` | **BUILT (0 errors)** | `RBAC-015` |
| **`EVD-RBAC-20`** | Full Platform Automated Regression Suite XML Census | Automated Maven Surefire | All 5 Microservices | 50 XML Reports (`api-gateway`, `auth`, `discovery`, `revenue`, `um`) | **397 / 397 PASS** | Full Regression |
| **`EVD-RBAC-21`** | Gateway Identity-Header Sanitization Defense-in-Depth Proof | Automated Unit Test | `api-gateway` | `IdentityHeaderSanitizationFilterTest.java` (3/3 PASS) | **PASS (100%)** | `GAP-05` |
| **`EVD-RBAC-22`** | 15-Minute JWT Expiration Production Configuration Parity | Config Census & Unit Tests | All Profiles | 8 Config Files & `JwtUtilTest` (13/13 PASS) | **VERIFIED** | `RBAC-002` |

---

## 4. Gate B Technical Blocker Evidence Index (EVD-GATEB-01 through EVD-GATEB-04)

Authoritative Source: [`PHASE_6_FINAL_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_EVIDENCE_REGISTER.md) (Section III) & [`PHASE_6_GATE_A_B_C_FINAL_DISPOSITION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_GATE_A_B_C_FINAL_DISPOSITION.md)

| Evidence Record ID | Blocker Ref | Focus Area | Observed Environmental State | Required Physical Resolution Criteria | Current Evaluated Determination |
|:---:|:---:|:---|:---|:---|:---:|
| **`EVD-GATEB-01`** | `BLK-CANON-01` | Perimeter Ingress HTTPS/TLS & HSTS Transport Security | Docker Compose exposes cleartext HTTP port 8092. No active TLS reverse proxy or TLS listener configured. | Deploy TLS reverse proxy (Nginx/Envoy/Gateway TLS) with valid certificate; capture TLS handshake and HSTS response headers. | **`DESIGN_VALIDATED / IMPLEMENTATION_PENDING`** |
| **`EVD-GATEB-02`** | `BLK-CANON-02` | Downstream Revenue Container & TestController Reachability Census | Gateway perimeter returns 403; `@Profile({"dev","test"})` applied. Internal container probe on port 18062 and `/actuator/mappings` census blocked due to Revenue container exit. | Achieve steady-state container runtime for `revenue`; probe port 18062 directly; execute authenticated 40-route census rubric per DISC-P914-02. | **`DESIGN_VALIDATED / RUNTIME_VERIFICATION_PENDING`** |
| **`EVD-GATEB-03`** | `BLK-CANON-03` | Host PostgreSQL 14 Availability & Revenue Steady-State | Native Windows service `postgresql-x64-14` is `Stopped`. TCP port 5432 closed. Container `revenue` failed HikariCP datasource connection and exited. | Apply offline hardened config & certificates per DISC-P914-03/05; start Windows service `postgresql-x64-14`; verify TCP 5432 listening; start `revenue` container. | **`OPEN (MANDATORY)`** |
| **`EVD-GATEB-04`** | `BLK-CANON-04` | Executive DAA / CISO Residual Risk Formal Authorization | Submission package `GATE_C_DAA_CISO_APPROVAL_REQUEST.md` prepared; signature blocks remain blank. Zero simulated sign-offs recognized. | Convene Architecture Review Board; secure signed risk acceptance memorandums from DAA and CISO for `RR-01` through `RR-11`. | **`PENDING_FORMAL_ACCEPTANCE`** |

---

## 5. Phase 7 Cryptography & Secrets Hardening Evidence Index (EVD-P7-01 through EVD-P7-17)

Authoritative Source: [`PHASE_7_VERIFICATION_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/PHASE_7_VERIFICATION_EVIDENCE_REGISTER.md)

| Evidence ID | Focus Area / Description | Verification Type | Target Component | Empirical Test Suite / Source Artifact | Verified Outcome | Correlated Finding |
|:---:|:---|:---|:---:|:---|:---:|:---:|
| **`EVD-P7-01`** | Auth-Service RS256 JWT Token Issuance & Claims Structure | Automated Unit Test | `auth-service` | `JwtHardeningRegressionTest.test2_tokenStructure_hasExpectedClaims` | **PASS (100%)** | `CRYPTO-001`, `SAST-001` |
| **`EVD-P7-02`** | Auth-Service Public JWKS RFC 7517 Compliance & Zero Leakage | Automated Unit Test | `auth-service` | `JwksControllerTest.testJwksEndpointReturnsPublicKeysOnly` | **PASS (100%)** | `CRYPTO-001`, `SAST-001` |
| **`EVD-P7-03`** | API Gateway RS256 Signature Verification via Public Key Resolver | Automated Security Test | `api-gateway` | `JwtUtilSecurityTest.testValidRs256Token_PassesValidation` | **PASS (100%)** | `CRYPTO-001`, `SAST-001` |
| **`EVD-P7-04`** | API Gateway Algorithm Confusion & `alg=none` Strict Rejection | Automated Security Test | `api-gateway` | `JwtUtilSecurityTest.testNoneAlgorithmToken_Rejected`, `testAlgorithmConfusion_Rejected` | **PASS (100%)** | `CRYPTO-001` |
| **`EVD-P7-05`** | API Gateway Legacy HS256 Retirement Condition Rejection | Automated Security Test | `api-gateway` | `JwtUtilSecurityTest.testLegacyHs256Token_RejectedWhenDisabled` | **PASS (100%)** | `CRYPTO-001`, `RR-01` |
| **`EVD-P7-06`** | User-Management RS256 Verification & Claims Integrity | Automated Unit Test | `user-management` | `JwtUtilTest.testGenerateAndValidateRs256Token` | **PASS (100%)** | `CRYPTO-001`, `SAST-001` |
| **`EVD-P7-07`** | User-Management Legacy HS256 Transition & Retirement Enforcement | Automated Unit Test | `user-management` | `JwtUtilTest.testLegacyHs256RetirementCondition` | **PASS (100%)** | `CRYPTO-001`, `RR-01` |
| **`EVD-P7-08`** | Revenue Service RS256 Signature Verification | Automated Security Test | `revenue` | `JwtUtilSecurityTest.testValidRs256Token_PassesValidation` | **PASS (100%)** | `CRYPTO-001`, `SAST-001` |
| **`EVD-P7-09`** | Revenue Service Algorithm Confusion & `alg=none` Strict Rejection | Automated Security Test | `revenue` | `JwtUtilSecurityTest.testNoneAlgorithmToken_Rejected` | **PASS (100%)** | `CRYPTO-001` |
| **`EVD-P7-10`** | Auth-Service Removal of Deprecated `jbcrypt:0.4` Dependency | Dependency Census | `auth-service` | `auth-service/pom.xml` (grep `org.mindrot` returns 0) | **CONFIRMED REMOVED** | `SCA-008`, `CRYPTO-002` |
| **`EVD-P7-11`** | Spring Security BCrypt(12) & Progressive Password Re-Hashing | Automated Unit Test | `auth-service` | `AuthServiceImplTest.testLogin_WithLegacyHash_UpgradesPasswordEncoding` | **PASS (100%)** | `CRYPTO-002`, `RR-10` |
| **`EVD-P7-12`** | Revenue eSign Keystore Presence & Temporal Validity Verification | Automated Negative Test | `revenue` | `XmlSignatureSecurityTest.testProductionProfile_RejectsMissingKeystore` | **PASS (100%)** | `CRYPTO-003`, `SAST-003` |
| **`EVD-P7-13`** | Revenue eSign Unsigned XML Fallback Prohibition in Production | Automated Negative Test | `revenue` | `XmlSignatureSecurityTest.testProductionProfile_RejectsUnsignedFallbackEvenIfFlagIsTrue` | **PASS (100%)** | `CRYPTO-003`, `SAST-006` |
| **`EVD-P7-14`** | Revenue eSign XML Signature Wrapping (XSW) & XXE Defense | Automated Negative Test | `revenue` | `XmlSignatureSecurityTest.testXswAttackRejection_MultipleSignatures` | **PASS (100%)** | `CRYPTO-003`, `SAST-004` |
| **`EVD-P7-15`** | Docker Compose Redis Mandatory Password Authentication Enforced | Configuration Audit | Infrastructure | `docker-compose.yml:85-88` (`--requirepass ${SPRING_DATA_REDIS_PASSWORD}`) | **VERIFIED HARDENED** | `SEC-001`, `THR-STRIDE-007` |
| **`EVD-P7-16`** | Secrets Externalization & Elimination of Hardcoded Passwords | Configuration Audit | All Services | `application-prod.properties`, `.env.example`, `.env` | **VERIFIED EXTERNALIZED** | `SEC-002`, `SAST-002` |
| **`EVD-P7-17`** | Phase 7 Comprehensive Surefire XML Regression Census | Automated Maven Surefire | All 4 Remediated Services | 52 Surefire XML reports (416 tests, 0 failures, 0 errors) | **416 / 416 PASS (100%)** | Full Phase 7 Scope |

---

## 5.1 Phase 8 Final Security Validation Evidence Index (EVD_P8_01 through EVD_P8_10)

Authoritative Source: [`SECURITY_AUDIT_CONTROLLER/evidence/phase_8/`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/evidence/phase_8/)

| Evidence ID | Focus Area / Description | Verification Type | Target Component | Empirical Source Artifact | Verified Outcome | Correlated Finding |
|:---:|:---|:---|:---:|:---|:---|:---:|
| **`EVD_P8_01`** | Auth Service Surefire Run (11 suites, 46 tests) | Maven Surefire Test | `auth-service` | `EVD_P8_01_AUTH_SERVICE_TEST_EXECUTION.txt` | **46 / 46 PASS (100%)** | Gate A Regression |
| **`EVD_P8_02`** | API Gateway Surefire Run (5 suites, 23 tests) | Maven Surefire Test | `api-gateway` | `EVD_P8_02_API_GATEWAY_TEST_EXECUTION.txt` | **23 / 23 PASS (100%)** | Gate A Regression |
| **`EVD_P8_03`** | User Management Surefire Run (31 suites, 304 tests) | Maven Surefire Test | `user-management` | `EVD_P8_03_USER_MANAGEMENT_TEST_EXECUTION.txt` | **304 / 304 PASS (100%)** | Gate A Regression |
| **`EVD_P8_04`** | Revenue Surefire Run (6 suites, 43 tests) | Maven Surefire Test | `revenue` | `EVD_P8_04_REVENUE_TEST_EXECUTION.txt` | **43 / 43 PASS (100%)** | Gate A Regression |
| **`EVD_P8_05`** | Eureka Discovery Surefire Run (1 suite, 2 tests) | Maven Surefire Test | `discovery` | `EVD_P8_05_DISCOVERY_TEST_EXECUTION.txt` | **2 / 2 PASS (100%)** | Gate A Regression |
| **`EVD_P8_06`** | Windows Native PostgreSQL Service Probe | PowerShell Service Query | Host OS | `EVD_P8_06_POSTGRESQL_SERVICE_PROBE.txt` | **Service Stopped / Port 5432 Closed** | `BLK-CANON-03` |
| **`EVD_P8_07`** | Docker Container Runtime Status Inspection | Docker CLI ps | Docker Daemon | `EVD_P8_07_DOCKER_CONTAINER_CENSUS.txt` | **revenue Exited (1); api-gateway 8092 HTTP** | `BLK-CANON-01`, `02` |
| **`EVD_P8_08`** | Microbenchmark BCrypt(12) Execution Performance | Microbenchmark Probe | `auth-service` | `EVD_P8_08_BCRYPT_COST12_BENCHMARK.txt` | **p50=210ms encode, p50=211ms match** | `CRYPTO-002`, `RR-10` |
| **`EVD_P8_09`** | Static Configuration Secret Inspection | Regex Properties Scan | All Services | `EVD_P8_09_SECRETS_CONFIG_INSPECTION.txt` | **0 hardcoded DB/Redis/JWT secrets** | `SEC-002`, `SAST-002` |
| **`EVD_P8_10`** | Phase 8 Entry Git Baseline Snapshot | Git CLI Non-Destructive | Root Repo | `EVD_P8_10_GIT_INTEGRITY_SNAPSHOT.txt` | **Branch master, HEAD e2df50f preserved** | Repository Integrity |

---

## 5.2 Phase 8.1 Independent Audit Reconciliation Evidence Index (EVD-P8-1-01 through EVD-P8-1-03)

Authoritative Source: [`SECURITY_AUDIT_CONTROLLER/evidence/phase_8_1/`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/evidence/phase_8_1/)

| Evidence ID | Focus Area / Description | Verification Type | Target Component | Empirical Source Artifact | Verified Outcome | Correlated Finding |
|:---:|:---|:---|:---:|:---|:---|:---:|
| **`EVD-P8-1-01`** | Git Working Tree & Submodule Preservation Audit Snapshot | Non-Destructive Git CLI Probe | Repository Root & 5 Nested Repos | `EVD_P8_1_01_GIT_INTEGRITY_SNAPSHOT.txt` | **53 Modified / 155 Untracked Preserved** | Repository Integrity |
| **`EVD-P8-1-02`** | Independent Forensic Surefire XML Reports Census | Automated XML Parsing | All 5 Microservices (54 Suites) | `EVD_P8_1_02_SUREFIRE_XML_CENSUS.txt` | **418 / 418 PASS (0 Failures, 0 Errors, 0 Skipped)** | Test Verification |
| **`EVD-P8-1-03`** | Environmental Blocker Forensic Probing (DB, Containers, Ports) | PowerShell Net & Service Probes | Host OS & Docker Network | `EVD_P8_1_03_BLOCKER_FORENSIC_PROBE.txt` | **PostgreSQL Stopped / Revenue Exited / Port 8092 HTTP** | `BLK-CANON-01..03` |

---

## 5.3 Phase 9.1.2 Safety Review Evidence Index (EVD_P9_1_2_01 through EVD_P9_1_2_06)

Authoritative Source: [`SECURITY_AUDIT_CONTROLLER/evidence/phase_9_1_2/`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/evidence/phase_9_1_2/)

| Evidence ID | Focus Area / Description | Verification Type | Target Component | Empirical Test Suite / Source Artifact | Verified Outcome | Correlated Finding |
|:---:|:---|:---|:---:|:---|:---:|:---:|
| **`EVD_P9_1_2_01`** | Host Network Adapters IPv4 Inspection | PowerShell NetIPAddress | Host Windows OS | `EVD_P9_1_2_01_HOST_NETWORK_INTERFACES.txt` | **127.0.0.1, 172.20.32.1, 10.25.85.121 (10.89.0.1 Absent)** | `BLK-CANON-03`, `RR-05` |
| **`EVD_P9_1_2_02`** | Docker Bridge Network lgd-network Inspection | Docker CLI Inspect | Docker Engine | `EVD_P9_1_2_02_DOCKER_NETWORK_INSPECT.txt` | **Subnet 10.89.0.0/24 / Gateway 10.89.0.1 (WSL2 bridge)** | `BLK-CANON-03`, `RR-05` |
| **`EVD_P9_1_2_03`** | PostgreSQL 14 Service & Active Config Audit | File Read & Service Status | PostgreSQL 14 | `EVD_P9_1_2_03_POSTGRESQL_SERVICE_AND_CONFIG_AUDIT.txt`| **Service Stopped / Lines 85-95 Active Trust Directives** | `BLK-CANON-03`, `RR-05` |
| **`EVD_P9_1_2_04`** | Surefire XML Reports Physical Census (54 Suites) | Node.js XML Parser | All 5 Microservices | `EVD_P9_1_2_04_SUREFIRE_BASELINE_CENSUS.txt` | **418 Tests Executed / 418 Passed / 0 Fail / 0 Skip** | Gate A Attestation |
| **`EVD_P9_1_2_05`** | Lettuce & Spring Data Redis API Disassembly | Bytecode javap Disassembly | Java Classpath | `EVD_P9_1_2_05_LETTUCE_API_VERIFICATION.txt` | **disablePeerVerification() 0-arg confirmed (Compiles)** | `RR-02`, `RR-05` |
| **`EVD_P9_1_2_06`** | Git Working Tree Preservation Verification | Git CLI Non-Destructive | Repository Root | `EVD_P9_1_2_06_GIT_PRESERVATION_INTEGRITY.txt` | **Zero Working Tree File Mutations / 100% Intact** | Operational Safety |

---

## 5.4 Phase 9.1.3 Independent Blueprint Audit Evidence Index (EVD_P9_1_3_01 through EVD_P9_1_3_05)

Authoritative Source: [`SECURITY_AUDIT_CONTROLLER/evidence/phase_9_1_3/`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/evidence/phase_9_1_3/)

| Evidence ID | Focus Area / Description | Verification Type | Target Component | Empirical Test Suite / Source Artifact | Verified Outcome | Correlated Finding |
|:---:|:---|:---|:---:|:---|:---:|:---:|
| **`EVD_P9_1_3_01`** | Redis Sentinel Version, Auth & Image Pinning Audit | Static & Trivy Inspection | Redis / Sentinel | `EVD_P9_1_3_01_REDIS_SENTINEL_AUTH_AND_VERSION_AUDIT.txt` | **Redis 8.10.3 / Missing sentinel-pass (DISC-P913-01)** | `RR-02`, `RR-05`, `SAST-012` |
| **`EVD_P9_1_3_02`** | Lettuce Truststore, Pooling & Compatibility Audit | POM & Static Code Census | Microservices | `EVD_P9_1_3_02_LETTUCE_TRUSTSTORE_AND_POOLING_CENSUS.txt` | **Missing CA Trust (DISC-P913-02) / commons-pool2 absent** | `RR-02`, `RR-05`, `SAST-002` |
| **`EVD_P9_1_3_03`** | RES-05 Network Partition Design Correction | Distributed Systems Analysis | Network / Chaos | `EVD_P9_1_3_03_RES_05_PARTITION_DESIGN_DEFECT_CORRECTION.txt`| **Disconnect flaw fixed via iptables partition (DISC-P913-03)** | `RR-02`, `RR-05` |
| **`EVD_P9_1_3_04`** | Revenue Controller, Actuator & Security Census | Source & POM Census | Revenue Service | `EVD_P9_1_3_04_REVENUE_ACTUATOR_AND_CONTROLLER_CENSUS.txt` | **Actuator absent (DISC-P913-04) / 40 routes / Security 401** | `BLK-CANON-02`, `EXP-021` |
| **`EVD_P9_1_3_05`** | PostgreSQL Listener Boundaries & SCRAM Safety | Static & Policy Audit | PostgreSQL 14 | `EVD_P9_1_3_05_POSTGRESQL_LISTENER_AND_EPHEMERAL_IP_ANALYSIS.txt`| **Dynamic WSL IP hazard & B1-05 rolpassword fix (DISC-P913-06)**| `BLK-CANON-03`, `RR-05` |

---

## 5.5 Phase 9.1.4 Corrective Audit Evidence Index (EVD_P9_1_4_01 through EVD_P9_1_4_06)

Authoritative Source: [`SECURITY_AUDIT_CONTROLLER/evidence/phase_9_1_4/`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/evidence/phase_9_1_4/)

| Evidence ID | Focus Area / Description | Verification Type | Target Component | Empirical Source Artifact | Verified Outcome | Correlated Finding |
|:---:|:---|:---|:---:|:---|:---|:---:|
| **`EVD_P9_1_4_01`** | Stage B Implementation Blueprint Corrections Verification | Architecture Review | Platform Lifecycle | `EVD_P9_1_4_01_STAGE_B_BLUEPRINT_CORRECTIONS_VERIFICATION.txt` | **All 6 Phase 9.1.3 corrections verified & incorporated in B1-B7** | `DISC-P913-01..06`, Gate B |
| **`EVD_P9_1_4_02`** | Redis Sentinel 4-Way Auth & Pinned Image Digest Verification | Static & Configuration Audit | Redis Sentinel | `EVD_P9_1_4_02_REDIS_SENTINEL_4WAY_AUTH_AND_DIGEST_VERIFICATION.txt`| **sentinel-pass confirmed; Redis 8.10.3 digest pinned** | `DISC-P913-01`, `RR-02`, `RR-05` |
| **`EVD_P9_1_4_03`** | Lettuce Truststore CA Injection & Pooling Census | Dockerfile & Code Audit | Microservices | `EVD_P9_1_4_03_LETTUCE_TRUSTSTORE_AND_CONTAINER_CA_VERIFICATION.txt`| **CA keytool import mandated; orphan bean purged; pool verified** | `DISC-P913-02`, `RR-02`, `RR-05` |
| **`EVD_P9_1_4_04`** | RES-05 iptables Selective Network Partition Specification | Container Bridge Audit | Network / Chaos | `EVD_P9_1_4_04_RES_05_IPTABLES_PARTITION_SPEC_VERIFICATION.txt` | **DOCKER-USER iptables DROP rules verify split-brain resistance** | `DISC-P913-03`, `RR-02`, `RR-05` |
| **`EVD_P9_1_4_05`** | Revenue 40-Route Mapping & Security 401 Interception Audit | Source AST & Security Chain | Revenue Service | `EVD_P9_1_4_05_REVENUE_40_ROUTE_AND_JWT_CENSUS_VERIFICATION.txt` | **40 routes mapped; authenticated JWT required for 404 proof** | `DISC-P913-04`, `05`, `BLK-CANON-02`|
| **`EVD_P9_1_4_06`** | PostgreSQL Boolean SCRAM Query & Hyper-V Dynamic IP Safety | System Catalog & Network | PostgreSQL 14 | `EVD_P9_1_4_06_POSTGRESQL_BOOLEAN_SCRAM_AND_HYPERV_VERIFICATION.txt` | **Boolean SCRAM query eliminates hash export; Hyper-V IP resolved**| `DISC-P913-06`, `BLK-CANON-03` |

---

## 5.6 Phase 9.1.5 Corrective Audit Evidence Index (EVD_P9_1_5_01 through EVD_P9_1_5_06)

Authoritative Source: [`SECURITY_AUDIT_CONTROLLER/evidence/phase_9_1_5/`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/evidence/phase_9_1_5/)

| Evidence ID | Focus Area / Description | Verification Type | Target Component | Empirical Source Artifact | Verified Outcome | Correlated Finding |
|:---:|:---|:---|:---:|:---|:---|:---:|
| **`EVD_P9_1_5_01`** | Redis Sentinel Auth Grammar & Hostname Resolution Audit | Grammar & Syntax Audit | Redis Sentinel | `EVD_P9_1_5_01_REDIS_SENTINEL_AUTH_DIRECTIVE_AND_HOSTNAME_AUDIT.txt` | **requirepass valid; sentinel requirepass invalid; announce-hostnames enabled** | `DISC-P914-01`, `RR-02`, `RR-05` |
| **`EVD_P9_1_5_02`** | Revenue 40-Route AST Census & Security Filter Chain Audit | AST & Security Chain | Revenue Service | `EVD_P9_1_5_02_REVENUE_40_ROUTE_CENSUS_AND_SECURITY_FILTER_AUDIT.txt` | **40 discrete routes mapped; JWT authenticated probes required for 404** | `DISC-P914-02`, `BLK-CANON-02` |
| **`EVD_P9_1_5_03`** | PostgreSQL Fail-Closed WSL2 Discovery, IPv6 & Role Audit | Network & System Catalog | PostgreSQL 14 | `EVD_P9_1_5_03_POSTGRESQL_WSL2_LISTENER_IPV6_AND_ROLE_AUDIT.txt` | **Fail-closed pre-startup script; dual-stack ::/0 reject; dynamic SCRAM query** | `DISC-P914-03`, `BLK-CANON-03` |
| **`EVD_P9_1_5_04`** | PostgreSQL pg_stat_ssl Catalog View & verify-full Audit | System Catalog & TLS Spec| PostgreSQL 14 | `EVD_P9_1_5_04_POSTGRESQL_TLS_VERIFICATION_FUNCTION_AUDIT.txt` | **pg_stat_ssl built-in verified; ssl_is_used unportable; 7-factor client protocol** | `DISC-P914-04`, `RR-05` |
| **`EVD_P9_1_5_05`** | PostgreSQL 11-Step Cert Backup & Selective Role Rollback | Filesystem ACL & Catalog | PostgreSQL 14 | `EVD_P9_1_5_05_POSTGRESQL_CERTIFICATE_BACKUP_AND_ROLLBACK_AUDIT.txt` | **server.crt/key/ca & NTFS ACL runbook; encrypted selective role rollback** | `DISC-P914-05`, `BLK-CANON-03` |
| **`EVD_P9_1_5_06`** | Docker Build Context, Lettuce Customizer & Async Failover | Docker & Netty Inspection | Microservices / Redis | `EVD_P9_1_5_06_STAGE_B_CONTAINER_BUILD_CONTEXT_AND_LETTUCE_AUDIT.txt` | **Root build context fix; Lettuce 6.3.2.RELEASE customizer; AOF write-loss disclosure** | `DISC-P914-06`, `RR-02`, `RR-06` |

---

## 6. Supporting Artifacts, Cryptographic Proofs & SBOM Schema Validation

| Artifact Identifier | Description | Technical Format | SHA-256 Checksum | Schema & Verification Standard |
|:---|:---|:---:|:---|:---|
| **CycloneDX SBOM** | Canonical Software Bill of Materials | JSON (`SOFTWARE_BILL_OF_MATERIALS.json`) | `99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b` | CycloneDX 1.5 JSON Schema (AJV 8.20.0 Validated: 0 Errors) |
| **Deliverable Manifest (Phase 0–4)**| Phase 0–4 Cryptographic Checksum Manifest | Markdown (`PHASE0_4_FINAL_DELIVERABLE_SHA256_MANIFEST.md`) | Authoritative Hash Verification Table | SHA-256 hash synchronicity across 35 deliverables |
| **Deliverable Manifest (Phase 6)** | Phase 6 Final Cryptographic Checksum Manifest | Markdown (`PHASE_6_FINAL_SHA256_MANIFEST.md`) | Authoritative Hash Verification Table | SHA-256 hash synchronicity across all Phase 6 deliverables |

---

## 7. Program Milestone Attestation

$$\mathbf{EVIDENCE\ REGISTER\ SYNCHRONIZED\ &\ ANCHORED.}$$
$$\mathbf{PHASE\ 9.1.5\ RECONCILIATION\ COMPLETED\ —\ 23\ INFRASTRUCTURE\ EVIDENCE\ RECORDS\ VERIFIED\ (PHASES\ 9.1.2,\ 9.1.3,\ 9.1.4,\ 9.1.5).}$$
