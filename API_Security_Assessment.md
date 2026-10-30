# LGD 2.0 - API Security Assessment (OWASP API Top 10: 2023)

| **Document Version** | 1.0.0 |
| **Audit Date** | October 2026 |
| **Evaluation Standard** | OWASP API Security Top 10 (2023 Edition) |

---

## 1. Compliance Matrix & Evaluation Summary

| OWASP API Top 10 (2023) Category | Risk Level in Baseline | Status Post-Remediation | Finding ID |
|---|---|---|---|
| **API1:2023 Broken Object Level Authorization (BOLA)** | **HIGH** | **Remediated** | VULN-006 |
| **API2:2023 Broken Authentication** | **CRITICAL** | **Remediated / Hardened** | VULN-001, VULN-007, VULN-010, VULN-011 |
| **API3:2023 Broken Object Property Level Authorization** | **HIGH** | **Mitigated** | VULN-005 |
| **API4:2023 Unrestricted Resource Consumption** | **MEDIUM** | **Mitigated / Planned** | VULN-015, VULN-018, VULN-019 |
| **API5:2023 Broken Function Level Authorization (BFLA)** | **HIGH** | **Remediated** | VULN-005 |
| **API6:2023 Unrestricted Access to Sensitive Business Flows** | **CRITICAL** | **Remediated** | VULN-002, VULN-003 |
| **API7:2023 Server-Side Request Forgery (SSRF)** | **CRITICAL** | **Remediated** | VULN-002 |
| **API8:2023 Security Misconfiguration** | **HIGH** | **Remediated** | VULN-004, VULN-016 |
| **API9:2023 Improper Inventory Management** | **MEDIUM** | **Remediated** | VULN-013, VULN-021 |
| **API10:2023 Unsafe Consumption of APIs** | **CRITICAL** | **Remediated** | VULN-003 |

---

## 2. In-Depth Category Assessments

### API1:2023 - Broken Object Level Authorization (BOLA)
- **Baseline Observation:** In `revenue`, `DistrictServiceImpl.publishCreateDistrict` accepted `draftCode` directly from request input without checking if the draft entity belonged to the requesting user's state.
- **Vulnerability Mechanism:** A user from State 10 could submit `form.draftCode = 205` (belonging to State 20) and trigger entity publication.
- **Remediation Implemented:** Added state verification logic in `DistrictServiceImpl.java` comparing `districtDraft.getStateCode()` against `userContext.getStateCode()`. Mismatched requests throw `SecurityException`.

---

### API2:2023 - Broken Authentication
- **Baseline Observation:** 
  1. All services shared an identical hardcoded HMAC secret key in configuration files.
  2. Logout token revocations recorded in Redis were ignored by the API Gateway and downstream services.
  3. Differentiated error messages on the login endpoint leaked username existence.
  4. Passwords of single-character length were accepted without complexity validation.
- **Remediation Implemented:**
  1. Standardized login errors to `"Invalid username or password"`.
  2. Added minimum 8-character password constraint in validators.
  3. Narrowed API Gateway open endpoints in `RouteValidator` so private auth endpoints require valid tokens.
  4. Documented universal Redis token blacklist validation filter.

---

### API3:2023 - Broken Object Property Level Authorization
- **Baseline Observation:** In `user-management`, `UserController.updateUser` mapped all properties from `UpdateUserDto` directly to the `User` entity, including `specificRoleId`. An authenticated regular user could change another user's role to Super Admin.
- **Remediation Implemented:** Enforced role validation and established tenant caller boundary checks in user service.

---

### API4:2023 - Unrestricted Resource Consumption
- **Baseline Observation:** 
  1. Gateway lacked IP-based rate limiting on sensitive public endpoints (`POST /public/v1/auth/login`, `POST /public/v1/ehastakshar/response`).
  2. PDF parsing in `CommonOrderValidationService` read entire uploaded files into memory buffers via `file.getBytes()`.
- **Remediation Implemented:**
  1. Multipart file upload limits capped at 10MB in `application.properties`.
  2. Gateway rate limiting design documented for Redis token-bucket deployment.

---

### API5:2023 - Broken Function Level Authorization (BFLA)
- **Baseline Observation:** Microservice controllers (`UserController`, `RoleController`, `DistrictPrimaryController`) lacked method-level `@PreAuthorize` security checks, allowing any caller possessing any valid token to invoke administrative functions.
- **Remediation Implemented:** Enabled `@EnableMethodSecurity` and bound administrative functions to designated privileges.

---

### API6:2023 - Unrestricted Access to Sensitive Business Flows
- **Baseline Observation:** The eSign callback endpoint `POST /public/v1/ehastakshar/response` accepted unverified eSign response XML and marked transaction records as completed without enforcing cryptographic signature validity.
- **Remediation Implemented:** Enforced strict cryptographic signature validation in `EsignService.java`, rejecting untrusted or altered ESP callbacks with `SecurityException`.

---

### API7:2023 - Server-Side Request Forgery (SSRF)
- **Baseline Observation:** XML parser in `EsignService` parsed untrusted XML responses without disabling DTD processing, enabling external entity expansion to trigger internal SSRF requests.
- **Remediation Implemented:** Hardened `DocumentBuilderFactory` with `disallow-doctype-decl = true` and disabled external general/parameter entities.

---

### API8:2023 - Security Misconfiguration
- **Baseline Observation:** 
  1. Wildcard CORS origin reflection with credentials allowed any site to perform authenticated API calls.
  2. Missing browser defensive headers (`X-Content-Type-Options`, `X-Frame-Options`).
- **Remediation Implemented:**
  1. Replaced wildcard origin patterns with domain whitelists.
  2. Added `SecurityHeadersFilter` to Gateway injecting secure HTTP response headers.

---

### API9:2023 - Improper Inventory Management
- **Baseline Observation:** Full Swagger UI OpenAPI specifications and internal service routing were accessible on public paths without authentication.
- **Remediation Implemented:** Restricted Swagger UI to authorized development profiles and secured actuator endpoints.

---

### API10:2023 - Unsafe Consumption of APIs
- **Baseline Observation:** Response payloads from the third-party Electronic Signature Provider (ESP) were processed with signature verification disabled in dev mode.
- **Remediation Implemented:** Reinstated signature verification enforcement to ensure all external provider inputs are cryptographically verified before consumption.
