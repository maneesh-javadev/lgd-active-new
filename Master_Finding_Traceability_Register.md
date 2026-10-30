# LGD 2.0 - Master Finding Traceability Register

## Document Information
- **Project:** Local Government Directory 2.0 (LGD 2.0)
- **Assessment Scope:** Consolidated Security Remediation (Phases 1, 2, and 3)
- **Auditor Role:** Senior Application Security Engineer, Java Security Architect, DevSecOps Engineer & QA Security Lead
- **Date:** October 30, 2026
- **Status:** Approved Master Traceability Register

---

## 1. Executive Summary & Traceability Methodology

This Master Finding Traceability Register establishes 100% bidirectional traceability across all phases of the LGD 2.0 security assessment:
- **Phase 0 Baseline:** Initial vulnerability hypotheses (`VULN-001` through `VULN-023`)
- **Phase 1 Threat Model:** Architectural STRIDE threats (`THR-STRIDE-001` through `THR-STRIDE-020`)
- **Phase 2 SAST Review:** Static code analysis findings (`SAST-001` through `SAST-021`)
- **Phase 3 DAST Assessment:** Dynamic exploitation evidence (`EXP-001` through `EXP-021` / `EV-001` through `EV-021`)
- **Consolidated Remediation:** Defensive engineering fixes, automated test evidence, and final disposition.

---

## 2. Master Finding Traceability Matrix

| SAST ID | Phase 0 ID | STRIDE Threat | DAST ID | Finding Title | Severity | CVSS | CWE | Module | DAST Status | Remediation Status | Retest Status |
|:---|:---|:---|:---|:---|:---:|:---:|:---:|:---|:---:|:---:|:---:|
| **SAST-001** | VULN-001 | THR-STRIDE-001 | EXP-001 / EV-001 | Hardcoded Static JWT HMAC Secret Key Across Microservices | **Critical** | **9.8** | CWE-798 | api-gateway, auth-service, user-management, revenue | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-002** | VULN-017 | THR-STRIDE-012 (Amplifier) | EXP-002 / EV-002 | Hardcoded Plaintext Database Password in Configuration Files | **Critical** | **9.8** | CWE-798 / CWE-259 | api-gateway, auth-service, user-management, revenue | **PARTIALLY CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-003** | VULN-017 / VULN-003 | THR-STRIDE-003 | EXP-003 / EV-003 | Hardcoded e-Hastakshar PKCS#12 Keystore Password | **Critical** | **9.8** | CWE-798 | revenue | **PARTIALLY CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-004** | VULN-003 | THR-STRIDE-003 | EXP-004 / EV-004 | Explicit Disabling of XML Digital Signature Secure Validation (secureValidation: FALSE) | **Critical** | **9.6** | CWE-347 | revenue | **PARTIALLY CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-005** | VULN-003 | THR-STRIDE-003 | EXP-005 / EV-005 | Untrusted Certificate Public Key Acceptance in XMLDSig KeySelector | **Critical** | **9.6** | CWE-295 / CWE-347 | revenue | **PARTIALLY CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-006** | VULN-003 | THR-STRIDE-003 | EXP-006 / EV-006 | Conditional Bypass of eSign Verification via Configuration Flag | **High** | **8.8** | CWE-347 / CWE-306 | revenue | **PARTIALLY CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-007** | VULN-003 | THR-STRIDE-003 | EXP-007 / EV-007 | Insecure Pseudo-Random Number Generator for eSign Transaction IDs | **High** | **7.5** | CWE-338 | revenue | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-008** | VULN-004 | THR-STRIDE-006 | EXP-008 / EV-008 | Mass Assignment / Unsafe Object Binding in User Update Endpoint | **Critical** | **9.4** | CWE-915 | user-management | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-009** | VULN-006 | THR-STRIDE-005 | EXP-009 / EV-009 | Broken Object Level Authorization (BOLA / IDOR) on Draft Viewing & File Downloads | **Critical** | **9.1** | CWE-639 | revenue | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-010** | VULN-006 | THR-STRIDE-005 | EXP-010 / EV-010 | Unauthorized Draft Entity Deletion via Missing Tenant/Ownership Checks | **Critical** | **9.1** | CWE-639 / CWE-862 | revenue | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-011** | VULN-005 | THR-STRIDE-018 | EXP-011 / EV-011 | Complete Absence of Method-Level Security Annotations Across All Controllers | **Critical** | **8.8** | CWE-862 / CWE-285 | user-management, revenue, auth-service | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-012** | VULN-007 | THR-STRIDE-007 | EXP-012 / EV-012 | Failure to Verify Redis Token Blacklist in API Gateway and Downstream Services | **High** | **8.6** | CWE-613 | api-gateway | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-013** | VULN-009 | THR-STRIDE-004 | EXP-013 / EV-013 | Overly Broad Public Endpoint Exclusions via Wildcard Pattern in RouteValidator | **High** | **8.2** | CWE-284 | api-gateway | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-014** | VULN-008 / VULN-014 | THR-STRIDE-009 | EXP-014 / EV-014 | Client IP Spoofing via Unvalidated X-Forwarded-For Header in Audit Logger | **Medium** | **7.1** | CWE-290 | api-gateway | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-015** | VULN-019 | THR-STRIDE-015 | EXP-015 / EV-015 | Unbounded Response Body Memory Buffering in Gateway Logging Filter | **Medium** | **7.5** | CWE-400 / CWE-770 | api-gateway | **PARTIALLY CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-016** | VULN-016 | THR-STRIDE-014 | EXP-016 / EV-016 | Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter | **Low** | **6.8** | CWE-693 | api-gateway | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-017** | VULN-010 | Input Validation / CWE-20 | EXP-017 / EV-017 | Missing Bean Validation Annotation (@Valid) on Login Request Controller | **Medium** | **6.5** | CWE-20 | auth-service | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-018** | VULN-018 | THR-STRIDE-015 | EXP-018 / EV-018 | Unvalidated File Upload in eSign Initiation Endpoint | **High** | **7.8** | CWE-434 | revenue | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-019** | VULN-013 | THR-STRIDE-013 | EXP-019 / EV-019 | Production Exposure of Swagger / OpenAPI Interactive Documentation | **Low** | **5.3** | CWE-200 | user-management, auth-service, revenue | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-020** | VULN-021 | THR-STRIDE-002 | EXP-020 / EV-020 | Unauthenticated Service Discovery Operations on Netflix Eureka | **Critical** | **9.8** | CWE-306 | discovery | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **SAST-021** | VULN-013 | Debug Code Exposure / CWE-489 | EXP-021 / EV-021 | Exposed Test Controller in Revenue Service Production Code | **Medium** | **6.5** | CWE-489 | revenue | **CONFIRMED** | **VERIFIED_FIXED** | **RETEST_PASSED** |

---

## 3. Historical Phase 0 Refutations (Confirmed Secure Code Patterns)

| Phase 0 ID | Category | Original Hypothesis | Dynamic / Static Verification | Final Status |
|:---|:---|:---|:---|:---:|
| **VULN-010** | SQL Injection | Potential SQLi in JPA custom repositories | 25 SQL injection payloads tested dynamically; safe parameterization with setParameter() verified. | **FALSE POSITIVE / CONFIRMED SECURE** |
| **VULN-002** | XML Parser Security | Missing XXE restrictions in DocumentBuilder | SAST & DAST confirmed DocumentBuilderFactory explicitly configures disallow-doctype-decl=true. | **FALSE POSITIVE / CONFIRMED SECURE** |

---

## 4. Detailed Finding Traceability & Remediation Records

### SAST-001: Hardcoded Static JWT HMAC Secret Key Across Microservices

- **Original Finding ID:** `SAST-001`
- **Original Phase References:** Phase 0: `VULN-001` | Phase 1: `THR-STRIDE-001` | Phase 3: `EXP-001 / EV-001`
- **Title:** Hardcoded Static JWT HMAC Secret Key Across Microservices
- **Severity:** **Critical** (CVSS v4.0: 9.8)
- **Confidence:** High
- **Affected Module:** `api-gateway, auth-service, user-management, revenue`
- **Source File & Method:** `application.properties (jwt.secret)`
- **CWE Identifier:** `CWE-798`
- **Original Evidence Reference:** `EXP-001 / EV-001`
- **Root Cause:** Static 64-byte HMAC secret key hardcoded in properties across all microservices without environment override support.
- **Required Remediation:** Externalize jwt.secret to environment variables with fallback default; prepare asymmetric RS256 migration.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-002: Hardcoded Plaintext Database Password in Configuration Files

- **Original Finding ID:** `SAST-002`
- **Original Phase References:** Phase 0: `VULN-017` | Phase 1: `THR-STRIDE-012 (Amplifier)` | Phase 3: `EXP-002 / EV-002`
- **Title:** Hardcoded Plaintext Database Password in Configuration Files
- **Severity:** **Critical** (CVSS v4.0: 9.8)
- **Confidence:** High
- **Affected Module:** `api-gateway, auth-service, user-management, revenue`
- **Source File & Method:** `application.properties (spring.datasource.password)`
- **CWE Identifier:** `CWE-798 / CWE-259`
- **Original Evidence Reference:** `EXP-002 / EV-002`
- **Mapping Rationale & Disentanglement:** SAST-002 addresses hardcoded plaintext PostgreSQL credentials committed to repository configuration files (`CWE-798/259`). In contrast, `THR-STRIDE-012` addresses the architectural exposure of PostgreSQL host port 5432 to external networks (`CWE-284`). While hardcoded credentials magnify the risk of unauthorized database access if port 5432 is exposed, the configuration vulnerability is distinct from the network port binding. Both have been remediated independently.
- **Required Remediation:** Externalize database credentials to mandatory environment variables without hardcoded fallbacks; fail startup if missing; unbind host port 5432.
- **DAST Confirmation Status:** **PARTIALLY CONFIRMED**
- **Remediation Status:** **VERIFIED_FIXED**
- **Retest Status:** **RETEST_PASSED**
- **Test Evidence:** Verified via unit/integration test suite, startup validator, and container port isolation.
- **Residual Risk:** Low / Managed through automated verification.

---

### SAST-003: Hardcoded e-Hastakshar PKCS#12 Keystore Password

- **Original Finding ID:** `SAST-003`
- **Original Phase References:** Phase 0: `VULN-017 / VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-003 / EV-003`
- **Title:** Hardcoded e-Hastakshar PKCS#12 Keystore Password
- **Severity:** **Critical** (CVSS v4.0: 9.8)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `esign.properties (esign.keystore.password)`
- **CWE Identifier:** `CWE-798`
- **Original Evidence Reference:** `EXP-003 / EV-003`
- **Mapping Rationale & Disentanglement:** SAST-003 addresses the hardcoded PKCS#12 keystore password in `esign.properties` (`CWE-798`). Keystore compromise enables attackers to extract private signing keys to forge CDAC e-Hastakshar requests and ASP callbacks (`THR-STRIDE-003`). This is distinct from `THR-STRIDE-008`, which represents tampering with pre-signing PDF document hashes (`CWE-354`).
- **Required Remediation:** Externalize `esign.keystore.password` to mandatory environment variable without fallback default; require secure keystore injection at runtime.
- **DAST Confirmation Status:** **PARTIALLY CONFIRMED**
- **Remediation Status:** **VERIFIED_FIXED**
- **Retest Status:** **RETEST_PASSED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.

---

### SAST-004: Explicit Disabling of XML Digital Signature Secure Validation (secureValidation: FALSE)

- **Original Finding ID:** `SAST-004`
- **Original Phase References:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-004 / EV-004`
- **Title:** Explicit Disabling of XML Digital Signature Secure Validation (secureValidation: FALSE)
- **Severity:** **Critical** (CVSS v4.0: 9.6)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `XmlSignatureUtil.java:147`
- **CWE Identifier:** `CWE-347`
- **Original Evidence Reference:** `EXP-004 / EV-004`
- **Root Cause:** XMLSignatureFactory explicit configuration disables secure validation, allowing XML Signature Wrapping (XSW).
- **Required Remediation:** Set secureValidation property to Boolean.TRUE in XMLSignatureFactory.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **PARTIALLY CONFIRMED**

---

### SAST-005: Untrusted Certificate Public Key Acceptance in XMLDSig KeySelector

- **Original Finding ID:** `SAST-005`
- **Original Phase References:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-005 / EV-005`
- **Title:** Untrusted Certificate Public Key Acceptance in XMLDSig KeySelector
- **Severity:** **Critical** (CVSS v4.0: 9.6)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `X509KeySelector.java:60-76`
- **CWE Identifier:** `CWE-295 / CWE-347`
- **Original Evidence Reference:** `EXP-005 / EV-005`
- **Root Cause:** KeySelector blindly trusts and returns the public key embedded inside the incoming XML KeyInfo element without chain verification.
- **Required Remediation:** Validate embedded X509Certificate against system truststore / trust anchor certificate.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **PARTIALLY CONFIRMED**

---

### SAST-006: Conditional Bypass of eSign Verification via Configuration Flag

- **Original Finding ID:** `SAST-006`
- **Original Phase References:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-006 / EV-006`
- **Title:** Conditional Bypass of eSign Verification via Configuration Flag
- **Severity:** **High** (CVSS v4.0: 8.8)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `EsignService.java:157`
- **CWE Identifier:** `CWE-347 / CWE-306`
- **Original Evidence Reference:** `EXP-006 / EV-006`
- **Root Cause:** Failed ESP signatures bypassed when esign.enforce-signature is false; development code allowed invalid signature progression.
- **Required Remediation:** Enforce signature check by default; throw SecurityException when validation fails; profile-gate test bypass.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **PARTIALLY CONFIRMED**

---

### SAST-007: Insecure Pseudo-Random Number Generator for eSign Transaction IDs

- **Original Finding ID:** `SAST-007`
- **Original Phase References:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-007 / EV-007`
- **Title:** Insecure Pseudo-Random Number Generator for eSign Transaction IDs
- **Severity:** **High** (CVSS v4.0: 7.5)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `EsignService.java (Random random = new Random())`
- **CWE Identifier:** `CWE-338`
- **Original Evidence Reference:** `EXP-007 / EV-007`
- **Root Cause:** java.util.Random used to generate 6-digit eSign transaction IDs with only 900,000 possible states.
- **Required Remediation:** Replace java.util.Random with java.security.SecureRandom and use cryptographically strong tokens.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-008: Mass Assignment / Unsafe Object Binding in User Update Endpoint

- **Original Finding ID:** `SAST-008`
- **Original Phase References:** Phase 0: `VULN-004` | Phase 1: `THR-STRIDE-006` | Phase 3: `EXP-008 / EV-008`
- **Title:** Mass Assignment / Unsafe Object Binding in User Update Endpoint
- **Severity:** **High** (CVSS v4.0: 9.4)
- **Confidence:** High
- **Affected Module:** `user-management`
- **Source File & Method:** `UpdateUserDto.java & UserServiceImpl.java`
- **CWE Identifier:** `CWE-915`
- **Original Evidence Reference:** `EXP-008 / EV-008`
- **Root Cause:** UpdateUserDto accepted sensitive administrative attributes (passwordHash, specificRoleId, userType) during normal user profile updates.
- **Required Remediation:** Explicitly allowlist editable fields in UpdateUserDto and sanitize incoming payload in service layer.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-009: Broken Object Level Authorization (BOLA / IDOR) on Draft Viewing & File Downloads

- **Original Finding ID:** `SAST-009`
- **Original Phase References:** Phase 0: `VULN-006` | Phase 1: `THR-STRIDE-005` | Phase 3: `EXP-009 / EV-009`
- **Title:** Broken Object Level Authorization (BOLA / IDOR) on Draft Viewing & File Downloads
- **Severity:** **High** (CVSS v4.0: 9.1)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `DistrictServiceImpl.java (/draft/district/view/{draftCode})`
- **CWE Identifier:** `CWE-639`
- **Original Evidence Reference:** `EXP-009 / EV-009`
- **Root Cause:** Draft viewing and file retrieval queries lacked caller stateCode verification against the requested draft.
- **Required Remediation:** Validate userContext.getStateCode() matches districtDraft.getStateCode() before returning draft data or attachments.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-010: Unauthorized Draft Entity Deletion via Missing Tenant/Ownership Checks

- **Original Finding ID:** `SAST-010`
- **Original Phase References:** Phase 0: `VULN-006` | Phase 1: `THR-STRIDE-005` | Phase 3: `EXP-010 / EV-010`
- **Title:** Unauthorized Draft Entity Deletion via Missing Tenant/Ownership Checks
- **Severity:** **High** (CVSS v4.0: 9.1)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `DraftEntityServiceImpl.java (/draft/delete/{draftCode}/{entityType})`
- **CWE Identifier:** `CWE-639 / CWE-862`
- **Original Evidence Reference:** `EXP-010 / EV-010`
- **Root Cause:** Draft deletion executed database stored procedure or entity deletion without checking caller state ownership.
- **Required Remediation:** Enforce tenant ownership validation: verify draft belongs to caller state before executing deletion.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-011: Complete Absence of Method-Level Security Annotations Across All Controllers

- **Original Finding ID:** `SAST-011`
- **Original Phase References:** Phase 0: `VULN-005` | Phase 1: `THR-STRIDE-018` | Phase 3: `EXP-011 / EV-011`
- **Title:** Complete Absence of Method-Level Security Annotations Across All Controllers
- **Severity:** **High** (CVSS v4.0: 8.8)
- **Confidence:** High
- **Affected Module:** `user-management, revenue, auth-service`
- **Source File & Method:** `All REST Controllers (zero @PreAuthorize annotations)`
- **CWE Identifier:** `CWE-862 / CWE-285`
- **Original Evidence Reference:** `EXP-011 / EV-011`
- **Root Cause:** Controllers rely solely on perimeter authentication filter; no fine-grained role or privilege checks present at method level.
- **Required Remediation:** Enable @EnableMethodSecurity(prePostEnabled = true) and add @PreAuthorize checks on administrative and sensitive operations.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-012: Failure to Verify Redis Token Blacklist in API Gateway and Downstream Services

- **Original Finding ID:** `SAST-012`
- **Original Phase References:** Phase 0: `VULN-007` | Phase 1: `THR-STRIDE-007` | Phase 3: `EXP-012 / EV-012`
- **Title:** Failure to Verify Redis Token Blacklist in API Gateway and Downstream Services
- **Severity:** **High** (CVSS v4.0: 8.6)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `AuthenticationFilter.java`
- **CWE Identifier:** `CWE-613`
- **Original Evidence Reference:** `EXP-012 / EV-012`
- **Root Cause:** API Gateway only verified JWT cryptographic signature and expiration, ignoring the Redis revocation blacklist.
- **Required Remediation:** Integrate Redis token revocation check in AuthenticationFilter using ReactiveStringRedisTemplate.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-013: Overly Broad Public Endpoint Exclusions via Wildcard Pattern in RouteValidator

- **Original Finding ID:** `SAST-013`
- **Original Phase References:** Phase 0: `VULN-009` | Phase 1: `THR-STRIDE-004` | Phase 3: `EXP-013 / EV-013`
- **Title:** Overly Broad Public Endpoint Exclusions via Wildcard Pattern in RouteValidator
- **Severity:** **High** (CVSS v4.0: 8.2)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `RouteValidator.java (/**/public/**)`
- **CWE Identifier:** `CWE-284`
- **Original Evidence Reference:** `EXP-013 / EV-013`
- **Root Cause:** AntPathMatcher pattern /**/public/** allowed path traversal or segment spoofing (/public/..;/) to bypass authentication filter.
- **Required Remediation:** Replace wildcard pattern with exact service-prefixed public path matchers and normalize URI paths.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-014: Client IP Spoofing via Unvalidated X-Forwarded-For Header in Audit Logger

- **Original Finding ID:** `SAST-014`
- **Original Phase References:** Phase 0: `VULN-008 / VULN-014` | Phase 1: `THR-STRIDE-009` | Phase 3: `EXP-014 / EV-014`
- **Title:** Client IP Spoofing via Unvalidated X-Forwarded-For Header in Audit Logger
- **Severity:** **Medium** (CVSS v4.0: 7.1)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `ApiLoggingFilter.java`
- **CWE Identifier:** `CWE-290`
- **Original Evidence Reference:** `EXP-014 / EV-014`
- **Mapping Rationale & Disentanglement:** SAST-014 addresses the blind trust of unvalidated `X-Forwarded-For` HTTP headers, permitting attackers to inject arbitrary spoofed IP addresses into audit logs (`CWE-290`), directly undermining non-repudiation in audit trails (`THR-STRIDE-009`). This is distinct from `THR-STRIDE-010`, which represents sensitive Bearer token exposure in plaintext Gateway application logs (`CWE-532`).
- **Required Remediation:** Validate IP syntax with strict IPv4/IPv6 regex, prioritize TCP socket remoteAddress, and strip untrusted headers.
- **DAST Confirmation Status:** **CONFIRMED**
- **Remediation Status:** **VERIFIED_FIXED**
- **Retest Status:** **RETEST_PASSED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.

---

### SAST-015: Unbounded Response Body Memory Buffering in Gateway Logging Filter

- **Original Finding ID:** `SAST-015`
- **Original Phase References:** Phase 0: `VULN-019` | Phase 1: `THR-STRIDE-015` | Phase 3: `EXP-015 / EV-015`
- **Title:** Unbounded Response Body Memory Buffering in Gateway Logging Filter
- **Severity:** **Medium** (CVSS v4.0: 7.5)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `ApiLoggingFilter.java:191-196`
- **CWE Identifier:** `CWE-400 / CWE-770`
- **Original Evidence Reference:** `EXP-015 / EV-015`
- **Root Cause:** DataBufferUtils buffers entire response payload into memory for logging without maximum length constraint.
- **Required Remediation:** Limit response body buffer size to max 10KB and truncate larger responses for logging.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **PARTIALLY CONFIRMED**

---

### SAST-016: Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter

- **Original Finding ID:** `SAST-016`
- **Original Phase References:** Phase 0: `VULN-016` | Phase 1: `THR-STRIDE-014` | Phase 3: `EXP-016 / EV-016`
- **Title:** Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter
- **Severity:** **Low** (CVSS v4.0: 6.8)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `SecurityHeadersFilter.java`
- **CWE Identifier:** `CWE-693`
- **Original Evidence Reference:** `EXP-016 / EV-016`
- **Root Cause:** Missing SecurityHeadersFilter in gateway active filter chain.
- **Required Remediation:** Implement SecurityHeadersFilter applying CSP, HSTS, X-Content-Type-Options, X-Frame-Options headers.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-017: Missing Bean Validation Annotation (@Valid) on Login Request Controller

- **Original Finding ID:** `SAST-017`
- **Original Phase References:** Phase 0: `VULN-010` | Phase 1: Input Validation / Integrity | Phase 3: `EXP-017 / EV-017`
- **Title:** Missing Bean Validation Annotation (@Valid) on Login Request Controller
- **Severity:** **Medium** (CVSS v4.0: 6.5)
- **Confidence:** High
- **Affected Module:** `auth-service`
- **Source File & Method:** `AuthSecondaryController.java (login method)`
- **CWE Identifier:** `CWE-20`
- **Original Evidence Reference:** `EXP-017 / EV-017`
- **Mapping Rationale & Disentanglement:** SAST-017 addresses the omission of `@Valid` bean validation on authentication payloads (`CWE-20: Improper Input Validation`), permitting empty or malformed strings to trigger runtime database exceptions. In contrast, `THR-STRIDE-016` addresses brute-force flooding and credential stuffing attacks (`CWE-307: Improper Restriction of Excessive Authentication Attempts`), which is mitigated by Redis token-bucket rate limiting rather than payload schema validation.
- **Required Remediation:** Add `@Valid` annotation to `LoginRequest` parameter in `AuthSecondaryController` and enforce `@NotBlank` validation.
- **DAST Confirmation Status:** **CONFIRMED**
- **Remediation Status:** **VERIFIED_FIXED**
- **Retest Status:** **RETEST_PASSED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.

---

### SAST-018: Unvalidated File Upload in eSign Initiation Endpoint

- **Original Finding ID:** `SAST-018`
- **Original Phase References:** Phase 0: `VULN-018` | Phase 1: `THR-STRIDE-015` | Phase 3: `EXP-018 / EV-018`
- **Title:** Unvalidated File Upload in eSign Initiation Endpoint
- **Severity:** **High** (CVSS v4.0: 7.8)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `EsignPrimaryController.java (/private/v1/ehastakshar/initiate)`
- **CWE Identifier:** `CWE-434`
- **Original Evidence Reference:** `EXP-018 / EV-018`
- **Root Cause:** Multipart file upload accepted arbitrary file extensions without verifying PDF magic bytes or enforcing size caps.
- **Required Remediation:** Validate PDF magic bytes (%PDF-), MIME type, and enforce max file size limit (5MB).
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-019: Production Exposure of Swagger / OpenAPI Interactive Documentation

- **Original Finding ID:** `SAST-019`
- **Original Phase References:** Phase 0: `VULN-013` | Phase 1: `THR-STRIDE-013` | Phase 3: `EXP-019 / EV-019`
- **Title:** Production Exposure of Swagger / OpenAPI Interactive Documentation
- **Severity:** **Low** (CVSS v4.0: 5.3)
- **Confidence:** High
- **Affected Module:** `user-management, auth-service, revenue`
- **Source File & Method:** `SwaggerConfig.java & application.properties`
- **CWE Identifier:** `CWE-200`
- **Original Evidence Reference:** `EXP-019 / EV-019`
- **Root Cause:** Swagger UI and OpenAPI JSON specs publicly exposed at /v3/api-docs without authentication or profile gating.
- **Required Remediation:** Profile-gate SwaggerConfig with @Profile("!prod") or require administrative authentication.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-020: Unauthenticated Service Discovery Operations on Netflix Eureka

- **Original Finding ID:** `SAST-020`
- **Original Phase References:** Phase 0: `VULN-021` | Phase 1: `THR-STRIDE-002` | Phase 3: `EXP-020 / EV-020`
- **Title:** Unauthenticated Service Discovery Operations on Netflix Eureka
- **Severity:** **Medium** (CVSS v4.0: 9.8)
- **Confidence:** High
- **Affected Module:** `discovery`
- **Source File & Method:** `ServiceDiscoveryApplication.java & pom.xml`
- **CWE Identifier:** `CWE-306`
- **Original Evidence Reference:** `EXP-020 / EV-020`
- **Root Cause:** Eureka server ran on port 8761 without Spring Security or HTTP Basic authentication enabled.
- **Required Remediation:** Add Spring Security HTTP Basic authentication on Eureka server and client credentials in microservices.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-021: Exposed Test Controller in Revenue Service Production Code

- **Original Finding ID:** `SAST-021`
- **Original Phase References:** Phase 0: `VULN-013` | Phase 1: Debug Code Exposure / CWE-489 | Phase 3: `EXP-021 / EV-021`
- **Title:** Exposed Test Controller in Revenue Service Production Code
- **Severity:** **Medium** (CVSS v4.0: 6.5)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `TestController.java (/test/api1)`
- **CWE Identifier:** `CWE-489`
- **Original Evidence Reference:** `EXP-021 / EV-021`
- **Mapping Rationale & Disentanglement:** SAST-021 addresses an exposed debug/test controller (`TestController.java`) packaged in production bytecode (`CWE-489: Active Debug Code`). This is distinct from `THR-STRIDE-011`, which represents Spring Boot Actuator endpoint exposure (`/actuator/env`, `/actuator/heapdump`, `CWE-200`). Both represent information disclosure risks, but `SAST-021` is internal diagnostic code, while `THR-STRIDE-011` is operational actuator metrics.
- **Required Remediation:** Annotate `TestController.java` with `@Profile({"dev", "test"})` so that test endpoints are never instantiated in production builds.
- **DAST Confirmation Status:** **CONFIRMED**
- **Remediation Status:** **VERIFIED_FIXED**
- **Retest Status:** **RETEST_PASSED**
- **Test Evidence:** Verified via unit/integration test suite, profile gating, and container inspection.
- **Residual Risk:** Low / Managed through automated verification.

---

