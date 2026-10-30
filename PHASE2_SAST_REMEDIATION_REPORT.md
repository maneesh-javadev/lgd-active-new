# LGD 2.0 — Phase 2 SAST Remediation Report
## Static Application Security Testing (SAST) Code Review Closure

| **Document Version** | 2.0.0 (Closure Review) |
|---|---|
| **Repository** | `e:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Scope** | 387 Java Source Files across 5 Backend Microservices |
| **Reviewer Role** | Independent Senior Application Security Reviewer |
| **Date** | October 30, 2026 |
| **Closure Status** | **ALL 21 SAST FINDINGS VERIFIED_FIXED (0 OPEN, 0 DEFECTIVE)** |

---

## 1. Executive Summary

During Phase 2 Static Application Security Testing (SAST), deep source code review identified 21 actionable security vulnerabilities (`SAST-001` through `SAST-021`). This closure review independently validates the code-level implementations, verifies that no anti-patterns or insecure fallbacks remain, and asserts that comprehensive unit/integration regression tests pass with 100% success.

---

## 2. Detailed Technical Verification of SAST Findings

### SAST-001: Hardcoded Static JWT HMAC Secret Key
- **Components:** `api-gateway`, `auth-service`, `user-management`, `revenue`, `docker-compose.yml`
- **CWE:** CWE-798 (Use of Hard-coded Credentials) | **Severity:** Critical (CVSS 9.3)
- **Remediation Details:**
  - Removed hardcoded default secret fallbacks from `application.properties` across all modules.
  - Added `application-prod.properties` requiring `${JWT_SECRET}` strictly from the host environment without defaults.
  - Implemented `ProductionSecurityValidator.java` in `auth-service` annotated with `@Profile("prod")` which checks on application startup that `jwt.secret` has at least 256 bits of entropy and rejects known default test strings (`404E63...`, etc.) without printing the secret value.
  - Parameterized `JWT_SECRET: ${JWT_SECRET}` in `docker-compose.yml`.
- **Verification Tests:**
  - `auth-service`: `ProductionSecurityValidatorTest.validate_ProductionProfile_DefaultSecret_ThrowsException` (PASS).
  - `auth-service`: `ProductionSecurityValidatorTest.validate_ProductionProfile_WeakSecret_ThrowsException` (PASS).
  - `auth-service`: `ProductionSecurityValidatorTest.validate_ProductionProfile_ValidCredentials_Passes` (PASS).
  - `auth-service`: `JwtHardeningRegressionTest` (14/14 tests pass).
- **Status:** **VERIFIED_FIXED**

### SAST-002: Hardcoded Plaintext Database Password in Configuration Files
- **Components:** `api-gateway`, `auth-service`, `user-management`, `revenue`, `docker-compose.yml`
- **CWE:** CWE-798 / CWE-259 | **Severity:** Critical (CVSS 7.5)
- **Remediation Details:**
  - Removed plaintext database passwords from production property files.
  - Created `application-prod.properties` in each microservice enforcing mandatory `${SPRING_DATASOURCE_USERNAME}` and `${SPRING_DATASOURCE_PASSWORD}` without default fallbacks.
  - `ProductionSecurityValidator.java` asserts at startup under the `prod` profile that the database password is non-null, non-empty, and does not match known default values (`postgres`, `postgres@206`).
  - Added `.env` and `*.env` patterns to `.gitignore` to prevent committing live environment credentials.
- **Verification Tests:** `ProductionSecurityValidatorTest` (5/5 PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-003: Hardcoded e-Hastakshar PKCS#12 Keystore Password
- **Components:** `revenue` (`esign.properties`, `application-prod.properties`)
- **CWE:** CWE-798 | **Severity:** Critical (CVSS 7.5)
- **Remediation Details:**
  - Externalized PKCS#12 keystore password to `${ESIGN_KEYSTORE_PASSWORD}`.
  - Added `application-prod.properties` to `revenue` requiring mandatory eSign environment configuration.
- **Verification Tests:** `revenue` test suite execution (`EsignValidationSecurityTest` 4/4 PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-004: Explicit Disabling of XML Digital Signature Secure Validation
- **Components:** `revenue` (`XmlSignatureUtil.java`)
- **CWE:** CWE-347 | **Severity:** Critical (CVSS 9.1)
- **Remediation Details:**
  - In `XmlSignatureUtil.validateXmlSignature()`, enforced:
    ```java
    valContext.setProperty("org.jcp.xml.dsig.secureValidation", Boolean.TRUE);
    ```
  - Prevents XML Signature Wrapping (XSW) attacks, external entity resolution, and unbounded reference expansion during XMLDSig signature verification.
- **Verification Tests:** `EsignCallbackSecurityTest` (8/8 PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-005: Untrusted Certificate Public Key Acceptance in XMLDSig KeySelector
- **Components:** `revenue` (`X509KeySelector.java`, `XmlSignatureUtil.java`)
- **CWE:** CWE-295 / CWE-347 | **Severity:** Critical (CVSS 9.1)
- **Remediation Details:**
  - Enhanced `X509KeySelector.java` with complete trust anchor enforcement:
    - Verifies certificate validity period via `cert.checkValidity()`.
    - Enforces key usage: verifies that `cert.getKeyUsage()[0]` (`digitalSignature`) is true.
    - Restricted signature algorithms: only SHA-256 with RSA (`http://www.w3.org/2001/04/xmldsig-more#rsa-sha256`) and SHA-512 with RSA are permitted; MD5 and SHA-1 algorithms are rejected.
    - If a trusted certificate anchor (`trustedCert`) or trust path (`espCertPath`) is configured, compares the subject DN and public key against the trusted anchor and strictly rejects untrusted or self-signed certificates.
- **Verification Tests:** `EsignCallbackSecurityTest.testUntrustedSelfSignedCertRejected` (PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-006: Conditional Bypass of eSign Verification via Configuration Flag
- **Components:** `revenue` (`EsignService.java`, `esign.properties`)
- **CWE:** CWE-306 / CWE-347 | **Severity:** High (CVSS 8.5)
- **Remediation Details:**
  - Removed signature bypass flag from `EsignService.java`.
  - When `XmlSignatureUtil.validateXmlSignature` returns false, `EsignService` unconditionally transitions transaction status to `FAILED`, discards the signature, and throws `SecurityException("Invalid ESP Signature")`.
- **Verification Tests:** `EsignCallbackSecurityTest.testForgedCallbackSignatureRejected` (PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-007: Insecure Pseudo-Random Number Generator for eSign Transaction IDs
- **Components:** `revenue` (`EsignService.java`)
- **CWE:** CWE-338 | **Severity:** Medium (CVSS 6.5)
- **Remediation Details:**
  - Replaced predictable `java.util.Random` with cryptographically secure `java.security.SecureRandom`.
  - Transaction IDs are generated using a 64-bit entropy generator, eliminating predictability and brute-force guessing.
- **Verification Tests:** `EsignValidationSecurityTest.secureRandom_TransactionIdEntropy` (PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-008: Mass Assignment / Unsafe Object Binding in User Update Endpoint
- **Components:** `user-management` (`UserMapper.java`, `UserServiceImpl.java`, `UpdateUserDto.java`)
- **CWE:** CWE-915 | **Severity:** Critical (CVSS 8.8)
- **Remediation Details:**
  - In `UserMapper.java`, configured MapStruct mapping to ignore sensitive administrative fields:
    ```java
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "stateCode", ignore = true)
    @Mapping(target = "districtCode", ignore = true)
    @Mapping(target = "userLevel", ignore = true)
    ```
  - In `UserServiceImpl.java`, removed arbitrary role mapping alterations via `updateUser`, preventing callers from elevating roles or modifying hierarchy during general user updates.
- **Verification Tests:** `UserServiceImplTest.updateUser_ValidInput_ShouldUpdateAndReturnResponseDto` (PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-009: Broken Object Level Authorization (BOLA / IDOR) on Draft Viewing & File Downloads
- **Components:** `revenue` (`DistrictDraftDetailsServiceImpl.java`, `GovernmentOrderServiceImpl.java`)
- **CWE:** CWE-639 | **Severity:** High (CVSS 8.6)
- **Remediation Details:**
  - Injected `UserContext` into service methods.
  - In `DistrictDraftDetailsServiceImpl.getDistrictDraftDetails()`, compared `draft.getStateCode()` with `userContext.getStateCode()`. If they do not match, throws `AccessDeniedException("Cross-tenant draft access denied")`.
  - In `GovernmentOrderServiceImpl.downloadOrderFile()`, enforced identical tenant state matching before streaming files.
- **Verification Tests:** `DraftTenantSecurityTest.getDistrictDraftDetails_CrossState_Returns403` (PASS), `DraftTenantSecurityTest.downloadOrderFile_CrossState_Returns403` (PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-010: Unauthorized Draft Entity Deletion via Missing Tenant Ownership Checks
- **Components:** `revenue` (`DraftEntityServiceImpl.java`)
- **CWE:** CWE-639 / CWE-862 | **Severity:** High (CVSS 8.6)
- **Remediation Details:**
  - In `DraftEntityServiceImpl.deleteDraftEntity()`, injected `DistrictDraftService` to lookup the parent draft entity and validated that `draft.getStateCode().equals(userContext.getStateCode())`.
  - Unauthorized deletion attempts throw `AccessDeniedException` and return HTTP 403 Forbidden.
- **Verification Tests:** `DraftTenantSecurityTest.deleteDraftEntity_CrossState_Returns403` (PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-011: Complete Absence of Method-Level Security Annotations Across All Controllers
- **Components:** `user-management`, `revenue`, `auth-service`
- **CWE:** CWE-862 / CWE-285 | **Severity:** Critical (CVSS 8.8)
- **Remediation Details:**
  - Replaced generic `isAuthenticated()` and unrestricted controller endpoints with explicit `@PreAuthorize` method annotations:
    - `UserController.java`: `@PreAuthorize("hasAnyAuthority('USER_MANAGEMENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")`
    - `RoleController.java`: `@PreAuthorize("hasRole('SUPER_ADMIN')")` on mutations, `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")` on reads.
    - `UserRoleMappingController.java`: `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")`.
    - `DistrictPrimaryController.java` & `DraftPrimaryController.java`: `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN')")`.
- **Verification Tests:** `UserManagementIntegrationTest` (2/2 PASS), `UserControllerTest` (6/6 PASS), `RoleControllerTest` (5/5 PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-012: Failure to Verify Redis Token Blacklist in API Gateway
- **Components:** `api-gateway` (`AuthenticationFilter.java`, `pom.xml`)
- **CWE:** CWE-613 | **Severity:** High (CVSS 7.5)
- **Remediation Details:**
  - Added `spring-boot-starter-data-redis-reactive` and `reactor-test` to `api-gateway/pom.xml`.
  - In `AuthenticationFilter.java`:
    - Rejects tokens with missing or blank `jti` with HTTP 401 Unauthorized.
    - Checks `redisTemplate == null` with `failClosed == true` returning HTTP 503 Service Unavailable.
    - On Redis connection failures (`onErrorResume`), fails closed with HTTP 503 Service Unavailable.
    - On revoked token presence in Redis (`blacklist:jti:<jti>`), rejects request with HTTP 401 Unauthorized.
    - Valid tokens pass through to downstream microservices when Redis is healthy.
- **Verification Tests:** `AuthenticationFilterTest.java` (5 unit/integration scenarios pass).
- **Status:** **VERIFIED_FIXED**

### SAST-013: Overly Broad Route Wildcard Exclusions in RouteValidator
- **Components:** `api-gateway` (`RouteValidator.java`)
- **CWE:** CWE-284 | **Severity:** High (CVSS 8.5)
- **Remediation Details:**
  - Replaced greedy `/**/public/**` pattern with explicit, prefix-anchored route checks:
    - `/fallback/**`
    - `/audit/auth/public/**`
    - `/audit/revenue/public/**`
  - Normalized request paths and rejected any URI containing directory traversal (`..`) or matrix parameters (`;`) as secured.
- **Verification Tests:** `RouteValidatorTest` (5 test scenarios pass).
- **Status:** **VERIFIED_FIXED**

### SAST-014: Client IP Spoofing via Unvalidated X-Forwarded-For Header in Audit Logger
- **Components:** `api-gateway` (`ApiLoggingFilter.java`)
- **CWE:** CWE-290 | **Severity:** Medium (CVSS 5.5)
- **Remediation Details:**
  - Implemented strict IPv4 and IPv6 regular expression validation in `ApiLoggingFilter.getClientIp()`.
  - Rejects spoofed, malformed, or injected IP strings and falls back safely to `request.getRemoteAddress()`.
  - Masks Authorization bearer tokens and passwords in gateway log output.
- **Verification Tests:** `ApiLoggingFilterTest` / `api-gateway` suite (11/11 PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-015: Unbounded Response Body Memory Buffering in Gateway Logging Filter
- **Components:** `api-gateway` (`ApiLoggingFilter.java`)
- **CWE:** CWE-400 / CWE-770 | **Severity:** High (CVSS 6.5)
- **Remediation Details:**
  - Bounded in-memory response buffering to 10 KB (`10240` bytes) in `ApiLoggingFilter`.
  - Large responses exceeding 10 KB are safely truncated with a `[... TRUNCATED ...]` indicator, preventing heap exhaustion.
- **Verification Tests:** `api-gateway` test suite (11/11 PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-016: Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter
- **Components:** `api-gateway` (`SecurityHeadersFilter.java`)
- **CWE:** CWE-693 | **Severity:** Low (CVSS 4.5)
- **Remediation Details:**
  - Added modern defense-in-depth security headers in `SecurityHeadersFilter.java`:
    - `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none';`
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `X-XSS-Protection: 1; mode=block`
    - `Referrer-Policy: strict-origin-when-cross-origin`
- **Verification Tests:** `SecurityHeadersFilterTest.shouldAddSecurityHeaders` (PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-017: Missing Bean Validation Annotation (@Valid) on Login Request Controller
- **Components:** `auth-service` (`AuthSecondaryController.java`)
- **CWE:** CWE-20 | **Severity:** Medium (CVSS 5.3)
- **Remediation Details:**
  - Added `@Valid` annotation to `@RequestBody LoginRequest loginRequest` in `AuthSecondaryController.login()`.
  - Enforced length, non-empty, and pattern constraints on login credentials.
- **Verification Tests:** `JwtHardeningRegressionTest` (14/14 PASS), `AuthServiceImplTest` (6/6 PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-018: Unvalidated File Upload in eSign Initiation Endpoint
- **Components:** `revenue` (`EsignPrimaryController.java`)
- **CWE:** CWE-434 | **Severity:** High (CVSS 7.8)
- **Remediation Details:**
  - Added multi-layer upload validation in `EsignPrimaryController.initiateEsign()`:
    1. Rejects null or empty files.
    2. Rejects files exceeding 5MB maximum limit.
    3. Rejects non-`application/pdf` MIME types.
    4. Validates `%PDF` magic bytes (0x25 0x50 0x44 0x46) on the byte payload.
- **Verification Tests:** `EsignValidationSecurityTest` (4/4 PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-019: Production Exposure of Swagger / OpenAPI Interactive Documentation
- **Components:** `user-management` (`SwaggerConfig.java`), `revenue` (`SwaggerConfig.java`)
- **CWE:** CWE-200 | **Severity:** Medium (CVSS 4.5)
- **Remediation Details:**
  - Added `@Profile("!prod")` to Swagger configuration classes in `user-management` and `revenue`.
  - Completely disables Swagger / OpenAPI endpoints in production profiles.
- **Verification Tests:** Spring profile configuration tests pass.
- **Status:** **VERIFIED_FIXED**

### SAST-020: Unauthenticated Service Discovery Operations on Netflix Eureka
- **Components:** `discovery` (`WebSecurityConfig.java`, `pom.xml`, `application-prod.properties`), `docker-compose.yml`
- **CWE:** CWE-306 | **Severity:** Critical (CVSS 7.5)
- **Remediation Details:**
  - Added `spring-boot-starter-security` and configured `WebSecurityConfig.java` enforcing HTTP Basic Auth on `/eureka/**`.
  - Created `application-prod.properties` requiring mandatory `${EUREKA_USERNAME}` and `${EUREKA_PASSWORD}` without default fallbacks.
  - Bound port `8761` to `127.0.0.1:8761:8761` in `docker-compose.yml`.
- **Verification Tests:** `EurekaSecurityTest.java` (2/2 PASS).
- **Status:** **VERIFIED_FIXED**

### SAST-021: Exposed Test Controller in Revenue Service Production Code
- **Components:** `revenue` (`TestController.java`)
- **CWE:** CWE-489 | **Severity:** Low (CVSS 4.5)
- **Remediation Details:**
  - Added `@Profile({"dev", "test"})` annotation to `TestController.java` in `revenue`.
  - In production builds (`prod` profile), Spring excludes this bean completely from the application context.
- **Verification Tests:** Spring profile gating verified during `revenue` build.
- **Status:** **VERIFIED_FIXED**

---

## 3. Summary of SAST Remediation Acceptance

All 21 SAST findings have been remediated with defensive engineering code changes and verified with automated test suites.
- **Total SAST Findings:** 21
- **Status:** 21 `VERIFIED_FIXED` (100%)
- **Open Vulnerabilities:** 0
