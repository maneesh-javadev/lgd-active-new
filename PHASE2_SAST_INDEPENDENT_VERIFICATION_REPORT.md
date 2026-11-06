# Phase 2: SAST & Deep Code Review — Independent Verification Report

| **Document Version** | 2.0.0 |
| **Audit Milestone** | Pre-Phase-5 Independent Verification |
| **Lifecycle Phase** | Phase 2: SAST & Code Review |
| **System** | Local Government Directory (LGD 2.0) |
| **Classification** | OFFICIAL / GOVERNMENT APPLICATION SECURITY AUDIT |
| **Verification Status** | **SOURCE: 20 VERIFIED_FIXED, 1 PARTIALLY_VERIFIED (SAST-021) | DYNAMIC RETEST: 19 VERIFIED_FIXED, 2 PARTIALLY_VERIFIED (SAST-016, SAST-021)** |
| **Roadmap Alignment** | Approved 14-Phase Program (Phase 0 through Phase 13) |

---

## 1. Executive Summary & Audit Mandate

This report provides the authoritative, independent security verification of all **21 Static Application Security Testing (SAST)** findings (`SAST-001` through `SAST-021`) identified in the Local Government Directory (LGD 2.0) Java backend codebase.

As mandated by the Principal Application Security Auditor charter, code fixes alone do not guarantee complete operational closure. To maintain rigorous audit governance, this review independently evaluates:
1. **Source Code Remediation Status:** Direct line-by-line inspection of production Java files, filters, repositories, entity listeners, and configurations.
2. **Automated Unit & Integration Test Verification:** Direct execution of the 289 Maven security regression tests across all 5 backend microservices.
3. **Live Dynamic Retest Disposition:** Validation against the live multi-container Docker deployment (`api-gateway`, `service-discovery`, `auth-service`, `user-management`, `revenue`, and `redis`), confirming that edge ingress and backend services enforce security policies in runtime execution.

### Key Verification Metrics
- **Total Backend Java Files Audited:** 397 (353 main + 44 test) hand-written source files; 409 total `.java` files including generated MapStruct mappers.
- **Total SAST Findings:** 21 Findings (`SAST-001` to `SAST-021`).
- **Source Code Remediation Status:** **20 VERIFIED_FIXED, 1 PARTIALLY_VERIFIED (SAST-021)**.
- **Automated Regression Suite:** **289 / 289 Tests Passed (0 Failures, 0 Errors, 0 Skipped)** (Unit and integration test results kept distinct from live runtime test results).
- **Dynamic Retest Disposition:** **19 VERIFIED_FIXED, 2 PARTIALLY_VERIFIED** (`SAST-016` [CSP verified, HSTS pending genuine TLS ingress], `SAST-021` [gateway 403 verified, direct downstream Revenue runtime verification pending]).

---

## 2. Multi-Dimensional Traceability & Verification Matrix

The table below maintains strict separation between **Code Remediation Status** and **Dynamic Retest Disposition**, establishing unambiguous traceability across Phase 0 (`VULN`), Phase 1 (`STRIDE`), Phase 2 (`SAST`), Phase 3 (`EXP`), and Dynamic Evidence (`EV`).

| SAST ID | Severity / CWE | Vulnerability Title | Affected Java Classes & Methods | Baseline VULN | STRIDE Threat | Exploit Vector | Evidence ID | Code Remediation Status | Dynamic Retest Disposition |
|:---|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **SAST-001** | Critical<br/>CWE-798 | Hardcoded Static JWT HMAC Secret Key | `in.gov.lgd.gateway.util.JwtUtil`<br/>`in.nic.lgd.auth.security.ProductionSecurityValidator`<br/>`application-prod.properties` | VULN-001 | THR-STRIDE-001 | EXP-001 | EV-001 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-002** | Critical<br/>CWE-798 | Hardcoded Plaintext Database Password in Configs | `application-prod.properties`<br/>`ProductionSecurityValidator.java`<br/>`docker-compose.yml` | VULN-017 | THR-STRIDE-012 | EXP-002 | EV-009 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-003** | Critical<br/>CWE-798 | Hardcoded e-Hastakshar PKCS#12 Keystore Password | `in.nic.lgd.revenue.config.EsignConfig`<br/>`esign.properties` | VULN-003 | THR-STRIDE-003 | EXP-003 | EV-010 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-004** | Critical<br/>CWE-347 | Disabling of XML Digital Signature Secure Validation | `in.nic.lgd.revenue.util.XmlSignatureUtil.validateXmlSignature()` | VULN-003 | THR-STRIDE-003 | EXP-004 | EV-011 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-005** | Critical<br/>CWE-295 | Untrusted Certificate Acceptance in XMLDSig KeySelector | `in.nic.lgd.revenue.util.X509KeySelector.select()` | VULN-003 | THR-STRIDE-003 | EXP-005 | EV-012 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-006** | High<br/>CWE-306 | Conditional Bypass of eSign Verification via Flag | `in.nic.lgd.revenue.service.impl.EsignServiceImpl` | VULN-003 | THR-STRIDE-003 | EXP-006 | EV-013 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-007** | Medium<br/>CWE-338 | Insecure PRNG for eSign Transaction IDs | `in.nic.lgd.revenue.service.impl.EsignServiceImpl.initiate()` | VULN-003 | THR-STRIDE-003 | EXP-007 | EV-014 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-008** | Critical<br/>CWE-915 | Mass Assignment in User Update Endpoint | `in.nic.lgd.usermanagement.mapper.UserMapper`<br/>`UserServiceImpl.updateUser()` | *[Unassigned]* | THR-STRIDE-006 | EXP-008 | EV-015 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-009** | High<br/>CWE-639 | BOLA / IDOR on Draft Viewing & File Downloads | `in.nic.lgd.revenue.service.impl.DistrictDraftDetailsServiceImpl`<br/>`GovernmentOrderServiceImpl.java` | VULN-006 | THR-STRIDE-005 | EXP-009 | EV-005 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-010** | High<br/>CWE-639 | Unauthorized Draft Entity Deletion via Missing Tenant Checks | `in.nic.lgd.revenue.service.impl.DraftEntityServiceImpl.deleteDraftEntity()` | VULN-006 | THR-STRIDE-005 | EXP-010 | EV-005 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-011** | Critical<br/>CWE-862 | Absence of Method-Level Security Annotations | `UserController.java`<br/>`RoleController.java`<br/>`DraftPrimaryController.java` | VULN-005 | THR-STRIDE-018 | EXP-011 | EV-020 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-012** | High<br/>CWE-613 | Failure to Verify Redis Token Blacklist in Gateway | `in.gov.lgd.gateway.filter.AuthenticationFilter.filter()` | VULN-007 | THR-STRIDE-007 | EXP-012 | EV-002 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-013** | High<br/>CWE-284 | Overly Broad Route Wildcard Exclusions in RouteValidator | `in.gov.lgd.gateway.filter.RouteValidator.isSecured` | *[Unassigned]* | THR-STRIDE-004 | EXP-013 | EV-003 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-014** | Medium<br/>CWE-290 | Client IP Spoofing via Unvalidated X-Forwarded-For | `in.gov.lgd.gateway.filter.ApiLoggingFilter.getClientIp()` | *[Unassigned]* | *[Unassigned]* | EXP-014 | EV-004 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-015** | High<br/>CWE-400 | Unbounded Response Body Memory Buffering in Gateway | `in.gov.lgd.gateway.filter.ApiLoggingFilter.decorateResponse()` | VULN-019 | THR-STRIDE-015 | EXP-015 | EV-016 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-016** | Low<br/>CWE-693 | Missing CSP and HSTS Headers in Gateway Filter | `in.gov.lgd.gateway.filter.SecurityHeadersFilter.filter()` | *[Unassigned]* | `THR-STRIDE-014 (Mitigation)` | EXP-016 | EV-006 | **VERIFIED_FIXED** | **PARTIALLY_VERIFIED (CSP Verified / HSTS Pending TLS)** |
| **SAST-017** | Medium<br/>CWE-20 | Missing Bean Validation Annotation on Login Controller | `in.nic.lgd.auth.controller.AuthSecondaryController.login()` | *[Unassigned]* | *[Unassigned]* | EXP-017 | EV-017 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-018** | High<br/>CWE-434 | Unvalidated File Upload in eSign Initiation Endpoint | `in.nic.lgd.revenue.controller.EsignPrimaryController.initiateEsign()` | VULN-018 | THR-STRIDE-015 | EXP-018 | EV-018 | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-019** | Medium<br/>CWE-200 | Production Exposure of Swagger / OpenAPI Interactive Docs | `in.nic.lgd.usermanagement.config.SwaggerConfig`<br/>`in.nic.lgd.revenue.config.SwaggerConfig` | VULN-013 | THR-STRIDE-013 | EXP-019 | EV-019A / EV-019B | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-020** | Critical<br/>CWE-306 | Unauthenticated Service Discovery Operations on Eureka | `in.nic.servicediscovery.config.WebSecurityConfig` | VULN-021 | THR-STRIDE-002 | EXP-020 | EV-007A / EV-007B | **VERIFIED_FIXED** | **VERIFIED_FIXED** |
| **SAST-021** | Low<br/>CWE-489 | Exposed Test Controller in Revenue Production Code | `in.nic.lgd.revenue.controller.TestController` | *[Unassigned]* | *[Unassigned]* | EXP-021 | EV-008 | **PARTIALLY_VERIFIED** | **PARTIALLY_VERIFIED (Gateway 403 / Downstream Pending)** |

---

## 3. In-Depth Technical Code Review & Verification

### 3.1 Verification of the Corrected SAST-011 / EXP-011 / EV-020 Relationship
A specific defect noted in earlier audit logs was the misattribution of method-level security findings. This independent audit confirms:
- **Root Cause & Code Implementation:** `user-management` and `revenue` lacked `@EnableMethodSecurity(prePostEnabled = true)`. Controllers relied on perimeter presence of JWT tokens without method-level role checking.
- **Remediation:** `@EnableMethodSecurity` was added to `SecurityConfig.java`. Explicit `@PreAuthorize("hasRole('ADMIN')")` and `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'STATE_ADMIN')")` were injected across all administrative endpoints.
- **Automated Regression:** `UserManagementIntegrationTest` (PASS).
- **Dynamic Verification (EV-020):** Direct HTTP request to `http://localhost:8092/user-management/private/v1/users` with an unprivileged officer bearer token resulted in:
  ```http
  HTTP/1.1 403 Forbidden
  Content-Type: application/json
  {"error":"Access denied: insufficient privileges"}
  ```
  This proves end-to-end enforcement through the Gateway and into the target microservice method invocation.

### 3.2 Cryptographic Hardening & Secrets Management (SAST-001, SAST-002, SAST-003, SAST-007)
1. **JWT Secret Externalization (`SAST-001`):** `ProductionSecurityValidator.java` verified in `auth-service`. Inspects `jwt.secret` for minimum 32 bytes (256 bits) entropy and explicitly rejects test keys (`404E63...`). Live curl (`EXP-001`) with forged token signed with legacy key rejected with `HTTP 401 Unauthorized`.
2. **Database Passwords (`SAST-002`):** `application-prod.properties` enforces `${SPRING_DATASOURCE_PASSWORD}` without default values; `.gitignore` guards `.env`.
3. **Keystore Password (`SAST-003`):** PKCS#12 keystore password in `revenue` loaded from `${ESIGN_KEYSTORE_PASSWORD}`.
4. **CSPRNG (`SAST-007`):** `java.security.SecureRandom` verified in `EsignServiceImpl.java`, ensuring unpredictable transaction IDs.

### 3.3 XML Signature & Digital Signature Pipeline (SAST-004, SAST-005, SAST-006, SAST-018)
1. **Secure XML Parsing (`SAST-004`):** `XmlSignatureUtil.java` sets `org.jcp.xml.dsig.secureValidation = true` and explicitly disables DOCTYPE declarations via `http://apache.org/xml/features/disallow-doctype-decl`.
2. **Certificate Trust Anchors (`SAST-005`):** `X509KeySelector.java` enforces RSA-SHA256/RSA-SHA512 algorithms, asserts `digitalSignature` key usage, and checks certificate validity periods.
3. **Unconditional Verification (`SAST-006`):** Removed bypass flags; invalid signatures unconditionally throw `SecurityException`.
4. **File Upload Hardening (`SAST-018`):** `EsignPrimaryController.java` validates `%PDF-` magic bytes and rejects payloads over 5MB.

### 3.4 Gateway Perimeter Filters (SAST-012, SAST-013, SAST-014, SAST-015, SAST-016)
1. **Redis Blacklist Validation (`SAST-012`):** `AuthenticationFilter.java` verifies token JTI against Redis key `blacklist:jti:<jti>`. Fails closed (`HTTP 503`) if Redis is unavailable. Live curl (`EXP-012`) confirms revoked token returns `HTTP 401 Unauthorized`.
2. **Strict Route Matching (`SAST-013`):** `RouteValidator.java` replaced greedy wildcards with prefix-anchored lists. Paths containing `..` or `;` fail closed to authenticated routing. Live curl (`EXP-013`) confirms unauthenticated access returns `HTTP 401`.
3. **IP Spoofing & Redaction (`SAST-014`, SAST-015):** `ApiLoggingFilter.java` validates client IP via regex, masks `Authorization: Bearer [REDACTED]`, and caps response buffering to 10 KB.
4. **Defense-in-Depth Headers (`SAST-016`):** `SecurityHeadersFilter.java` configures strict CSP, HSTS (`Strict-Transport-Security: max-age=31536000; includeSubDomains`), `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`. Live gateway responses confirm CSP, nosniff, and DENY headers; however, HSTS header injection applies conditionally only over HTTPS/TLS ingress. Because cluster testing was performed over plaintext HTTP, live HSTS verification remains incomplete pending genuine TLS ingress retest (`PARTIALLY_VERIFIED`).

### 3.5 Infrastructure & Exposure Gating (SAST-019, SAST-020, SAST-021)
1. **Swagger Disabled in Prod (`SAST-019`):** Annotated with `@Profile("!prod")`. Live curl through Gateway returns `HTTP 404 Not Found`.
2. **Eureka Basic Auth (`SAST-020`):** `WebSecurityConfig.java` in `discovery` enforces Spring Security HTTP Basic Auth. Live curl without credentials returns `HTTP 401 Unauthorized`.
3. **Test Controller Gated (`SAST-021`):** `TestController.java` is annotated with `@Profile({"dev", "test"})`, and perimeter edge requests return `HTTP 403 Forbidden` / `500 No static resource`. However, a `@Profile` annotation and gateway 403 response do not independently establish that direct production-container bean/handler absence was verified inside the isolated downstream Revenue container. Direct downstream container runtime census remains pending (`PARTIALLY_VERIFIED`).

---

## 4. Backend Automated Regression Test Execution (289 Tests)

All Maven security and functional regression test suites were independently executed across the 5 backend services:

```
[INFO] api-gateway ........................................ SUCCESS [ 14 tests, 0 failures, 0 errors, 0 skipped ]
[INFO] discovery .......................................... SUCCESS [  2 tests, 0 failures, 0 errors, 0 skipped ]
[INFO] revenue ............................................ SUCCESS [ 22 tests, 0 failures, 0 errors, 0 skipped ]
[INFO] auth-service ....................................... SUCCESS [ 40 tests, 0 failures, 0 errors, 0 skipped ]
[INFO] user-management .................................... SUCCESS [ 211 tests, 0 failures, 0 errors, 0 skipped ]
[INFO] ------------------------------------------------------------------------
[INFO] TOTAL: 289 tests executed, 289 passed, 0 failures, 0 errors, 0 skipped.
[INFO] ------------------------------------------------------------------------
```

---

## 5. Phase 2 Independent Audit Conclusion

- **Code Review:** 20 findings confirmed `VERIFIED_FIXED` in active source files; `SAST-021` is classified as `PARTIALLY_VERIFIED` pending direct production-profile container census.
- **Automated Regression:** Verified with 100% pass rate across all 289 backend unit and integration tests (289 passed, 0 failures, 0 errors, 0 skipped). Unit-test execution results are maintained strictly separate from live cluster runtime test results.
- **Dynamic Retests:** 19 findings confirmed `VERIFIED_FIXED` in live container runtime testing. 2 findings remain `PARTIALLY_VERIFIED`: `SAST-016` (CSP verified, HSTS pending genuine TLS ingress) and `SAST-021` (gateway 403 verified, direct downstream Revenue runtime verification pending).
- **Phase 2 Final Disposition:** **REMEDIATED WITH RESIDUAL DYNAMIC VERIFICATION DEPENDENCIES (20/21 Source Verified, 19/21 Dynamic Retests Verified, 2 Partially Verified)**.

---
*Report compiled independently by the Principal Application Security Auditor & Senior Java Security Architect.*
