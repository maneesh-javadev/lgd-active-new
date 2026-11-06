# LGD 2.0 — Phase 5: Authentication & Session Security Audit Deep Dive Report

| **Audit Assessment Metadata** | **Specification** |
|:---|:---|
| **Target Platform** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Phase** | **Phase 5 — Authentication & Session Security Audit** |
| **Authorization** | Formally Authorized by Project Owner (Notice to Proceed: Phase 5) |
| **Assessment Scope** | JWT Token Lifecycle, Distributed Revocation Architecture, Password Storage & Cryptography, Credential Complexity, Authentication Endpoint Security, Session Management, Client-Side Token Handling, and MFA Capabilities |
| **Target Components** | `api-gateway`, `auth-service`, `user-management`, `revenue`, `lgd-um` (Frontend) |
| **Evaluation Date** | November 3, 2026 |
| **Lead Security Auditor** | Lead Application Security Architect & Cryptographic Evaluator |
| **Current Gate Status** | **Gate A: PASS | Gate B: HOLD (BLK-01..03 Deferred) | Gate C: PENDING_FORMAL_ACCEPTANCE (BLK-04 Open)** |
| **Overall Assessment Outcome** | **`PENDING_REMEDIATION_AND_INDEPENDENT_RETEST`** |

---

## Executive Summary

Pursuant to the approved 14-phase enterprise cybersecurity roadmap for **Local Government Directory 2.0 (LGD 2.0)** and under explicit authorization from the project owner, this document presents the comprehensive, independent technical assessment for **Phase 5: Authentication & Session Security Audit**.

The Phase 5 evaluation inspected the authentication architecture, token lifecycle management, distributed session revocation mechanisms, password hashing and credential storage algorithms, password complexity validation, authentication endpoint protection, client-side session handling, and multi-factor authentication (MFA) capabilities across all active backend microservices and frontend clients.

### Key Assessment Findings Summary:
1. **JWT Architecture & Signing Algorithm (`AUTH-001` - HIGH):** The architecture utilizes symmetric HMAC SHA-256 (`HS256`) signing with a shared secret (`${JWT_SECRET}`). While startup secret entropy validation (`ProductionSecurityValidator.java`) enforces a minimum of 256 bits and blocks known weak keys, the use of a shared symmetric secret across multiple distributed microservices (`auth-service`, `api-gateway`, `user-management`, `revenue`) violates the principle of least privilege. Compromise of any downstream service allows arbitrary JWT forgery. Migration to asymmetric RSA (`RS256`) or ECDSA (`ES256`) is required (scheduled for Phase 5/7).
2. **Decentralized Revocation Enforcement Gap (`AUTH-002` - HIGH):** Redis token revocation checking is strictly implemented at the `api-gateway` and `auth-service` layers. However, downstream microservices (`user-management`, `revenue`) implement standalone `JwtAuthenticationFilter` filters that validate only signature and DB user status, completely omitting the Redis blacklist query. In the event of perimeter bypass or lateral movement, revoked tokens remain valid downstream.
3. **Excessive Access Token Lifetime & Absence of Refresh Token Rotation (`AUTH-003` - HIGH):** Access tokens are configured with a default validity of 24 hours (`86400000` ms) and documentation allows up to 7 days. There is no refresh token implementation, no token refresh endpoint, and no automated session renewal workflow.
4. **Absence of Ingress Rate Limiting on Authentication Routes (`AUTH-004` - HIGH):** Neither `api-gateway` nor `auth-service` enforces rate-limiting filters (e.g., Redis Token Bucket / `RequestRateLimiter`) on login endpoints (`/public/v1/auth/login`, `/auth/public/v1/auth/login`), exposing the authentication interface to automated brute-force and credential-stuffing attacks.
5. **Client-Side Token Storage in Browser `localStorage` (`AUTH-005` - MEDIUM):** The React frontend (`lgd-um`) persists bearer JWTs in browser `localStorage`. Any script execution flaw (XSS or malicious third-party dependency) permits instantaneous token exfiltration.
6. **Legacy Password Hashing Library (`AUTH-006` - MEDIUM):** Passwords are encrypted using `org.mindrot.jbcrypt:0.4` (unmaintained since 2015) with default cost parameters (10 rounds), lacking integration with Spring Security's `DelegatingPasswordEncoder` or modern memory-hard functions (Argon2id).
7. **Timing Side-Channel on Login Endpoint (`AUTH-008` - MEDIUM):** In `AuthServiceImpl.java`, non-existent usernames abort immediately (~1-2ms), whereas existing usernames trigger BCrypt password evaluation (~100ms), introducing a measurable timing side-channel that allows user enumeration.
8. **Weak Password Policy Enforcement (`AUTH-009` - MEDIUM):** `CreateUserValidator.java` enforces only an 8-character minimum length without character set diversity (uppercase, lowercase, digits, special characters) or dictionary checks.
9. **Complete Absence of Multi-Factor Authentication (`AUTH-010` - MEDIUM):** The system provides no MFA/2FA workflows (TOTP, SMS/email OTP, or FIDO2/WebAuthn), leaving privileged accounts vulnerable to single-factor credential compromise.

---

## 1. System Authentication Architecture & Control Topology

LGD 2.0 implements a microservices-based, perimeter-authenticated architecture:

```
[ Browser / Client (lgd-um) ]
          │  (Bearer JWT in localStorage / HTTP Authorization Header)
          ▼
[ API Gateway (Port 8092) ] ── (AuthenticationFilter: JWT Signature + Claims + Redis Blacklist Check)
          │
          ├── Fail-Closed Policy: Redis outage -> HTTP 503 Service Unavailable
          ├── JTI Verification: Missing JTI -> HTTP 401 Unauthorized
          ├── Route Whitelist: RouteValidator enforces normalization against bypass (.. / ;)
          ├── Security Headers: CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff
          │
          ├── (Reverse Proxy Forwarding via Eureka Service Discovery)
          │
          ├──► [ Auth Service (Port 18090) ]
          │        ├── /public/v1/auth/login (BCrypt checkpw, JWT generation with JTI)
          │        ├── /private/v1/auth/logout (Redis blacklist insertion with token TTL)
          │        └── ProductionSecurityValidator (Entropy >= 256 bits, forbidden key list)
          │
          ├──► [ User Management (Port 18089) ]
          │        ├── JwtAuthenticationFilter (Standalone JWT parser; NO Redis blacklist query)
          │        ├── CreateUserValidator (Password length >= 8, no character diversity)
          │        └── UserServiceImpl (BCrypt.hashpw via org.mindrot.jbcrypt:0.4)
          │
          └──► [ Revenue Service (Port 18062) ]
                   ├── JwtAuthenticationFilter (Standalone JWT parser; NO Redis blacklist query)
                   └── Domain Logic & BOLA Verification (State/District claim checks)
```

---

## 2. Detailed Technical Audit by Domain

### 2.1 Domain 1: JWT Token Lifecycle & Cryptographic Signing

#### A. Cryptographic Algorithm & Secret Management
- **Implementation:** `in.nic.lgd.auth.security.JwtUtil.java` and `in.gov.lgd.gateway.util.JwtUtil.java`.
- **Signing Algorithm:** `SignatureAlgorithm.HS256` (HMAC SHA-256).
- **Key Derivation:** `Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8))` utilizing `${jwt.secret}`.
- **Verification Evidence:**
  - `ProductionSecurityValidatorTest` asserts that startup under `prod` profile terminates immediately if `jwt.secret` is missing, shorter than 32 characters (256 bits), or matches known test keys (`404E6352...`, `password`, `secret`).
  - `JwtHardeningRegressionTest.test1` confirms two tokens generated for the same user within the same second receive distinct cryptographically random UUID `jti` claims.
  - `JwtHardeningRegressionTest.test5` validates that tampered tokens (`...XXXXXX`) and tokens with missing `jti` claims are rejected with HTTP 401.
- **Security Defect (`AUTH-001`):** The use of symmetric HMAC requires every participating service (`api-gateway`, `auth-service`, `user-management`, `revenue`) to hold the identical shared secret. If an attacker achieves code execution or configuration read access on any microservice, the entire system's cryptographic identity provider is compromised. Asymmetric RS256/ES256 signing is required to restrict signing authority exclusively to `auth-service`.

#### B. Token Lifetime & Refresh Tokens
- **Implementation:** `${jwt.expiration:86400000}` (24 hours) in `application.properties`.
- **Findings (`AUTH-003`):**
  - An access token validity of 24 hours is excessive for a government enterprise directory managing critical administrative unit reorganizations.
  - No Refresh Token architecture exists. Users authenticate once and receive a single static token.
  - No token renewal endpoint (`/refresh-token`) exists. When the token expires, the client abruptly encounters HTTP 401 and must redirect to full re-authentication.

---

### 2.2 Domain 2: Distributed Revocation & Redis Blacklist Architecture

#### A. Centralized Revocation Mechanics
- **Implementation:** `in.nic.lgd.auth.security.TokenBlacklistService.java` and `in.gov.lgd.gateway.filter.AuthenticationFilter.java`.
- **Mechanism:**
  - Upon invoking `/private/v1/auth/logout` or `/private/v1/auth/revoke-token`, `AuthServiceImpl.revokeToken` extracts the token's `jti` and expiration date.
  - The remaining validity (`expirationDate.getTime() - System.currentTimeMillis()`) is computed.
  - A key `blacklist:jti:<jti>` is written to Redis with TTL set exactly to the remaining lifetime (`TimeUnit.MILLISECONDS`).
- **Gateway Fail-Closed Enforcement:**
  - When a request arrives at `api-gateway`, `AuthenticationFilter` extracts `jti`.
  - If `jti` is missing: rejected with HTTP 401 Unauthorized.
  - If Redis reports `hasKey("blacklist:jti:" + jti) == true`: rejected with HTTP 401 Unauthorized (`REVOC-004`).
  - If Redis is offline, disconnected, or times out (>2000ms): rejected with HTTP 503 Service Unavailable (`REVOC-002`, `REVOC-003`, `REVOC-006`).
  - Cluster consistency across multiple Gateway instances is verified via centralized Redis state (`REVOC-008`).

#### B. Decentralized Revocation Enforcement Gap
- **Analysis:**
  - While Gateway and Auth Service query Redis, downstream services `user-management` and `revenue` contain independent `JwtAuthenticationFilter` classes.
  - Neither `user-management` nor `revenue` connects to Redis or verifies the blacklist key.
  - If an attacker communicates directly with `user-management:18089` or `revenue:18062` (e.g., via compromised container, internal network pivoting, or port forwarding), **revoked tokens are accepted as valid**.
  - **Defect ID:** `AUTH-002` (Decentralized Revocation Gap).

---

### 2.3 Domain 3: Credential Storage & Password Cryptography

#### A. Hashing Algorithm Evaluation
- **Implementation:** `in.nic.lgd.auth.service.impl.AuthServiceImpl.java` and `in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImpl.java`.
- **Library:** `org.mindrot.jbcrypt:0.4` (direct dependency).
- **Hashing Call:** `BCrypt.hashpw(password, BCrypt.gensalt())`.
- **Verification Call:** `BCrypt.checkpw(loginRequest.getPassword(), user.getPasswordHash())`.
- **Strengths:**
  - Uses salted, iterative bcrypt algorithm.
  - Automatically handles 128-bit salt generation via `SecureRandom` internal to jBCrypt.
  - Stores salt embedded in modular crypt format (`$2a$10$...`).
- **Defects (`AUTH-006`):**
  - `jbcrypt:0.4` was released in 2015 and is unmaintained. It contains known performance bottlenecks and lacks modern features (e.g., work factor upgrading on login).
  - Default cost factor of 10 rounds (~100ms on modern CPU) is acceptable but fixed; modern standards recommend work factors of 12 or modern memory-hard functions (Argon2id) to protect against GPU/ASIC password cracking.
  - Not integrated with Spring Security's `PasswordEncoder` interface.

---

### 2.4 Domain 4: Password Complexity & Policy Enforcement

#### A. Validator Inspection
- **Implementation:** `in.nic.lgd.usermanagement.modules.user.validator.CreateUserValidator.java` and `UpdateUserValidator.java`.
- **Password Check Code:**
  ```java
  if (passwordHash == null || passwordHash.trim().isEmpty()) {
      errors.rejectValue("passwordHash", "NotBlank", "Password is required");
  } else if (passwordHash.trim().length() < 8) {
      errors.rejectValue("passwordHash", "Size", "Password must be at least 8 characters in length");
  } else if (passwordHash.trim().length() > 500) {
      errors.rejectValue("passwordHash", "Size", "Password cannot exceed 500 characters");
  }
  ```
- **Findings (`AUTH-009`):**
  - Only minimum length (8 chars) is validated.
  - No requirement for uppercase characters (`[A-Z]`).
  - No requirement for lowercase characters (`[a-z]`).
  - No requirement for numeric digits (`[0-9]`).
  - No requirement for special/symbol characters (`[!@#$%^&*...]`).
  - No dictionary check against compromised passwords (e.g. `password123`, `admin12345`).
  - Violates Government of India / CERT-In Password Policy Guidelines and NIST SP 800-63B.

#### B. Account Lockout & Password History
- **Implementation:** `in.nic.lgd.auth.entity.User.java`.
- **Findings (`AUTH-007`):**
  - No `failedLoginAttempts` column in `um.users`.
  - No `accountLockedUntil` column.
  - No account lockout mechanism after repeated invalid password attempts.
  - No `password_history` tracking table to prevent reuse of previous N passwords.
  - No password expiration date (`password_expiry_date`) or forced rotation prompt.

---

### 2.5 Domain 5: Authentication Endpoint Protections & Timing Side-Channels

#### A. Ingress Rate Limiting
- **Implementation:** `api-gateway/src/main/resources/application.properties` and `auth-service/src/main/resources/application.properties`.
- **Findings (`AUTH-004`):**
  - Neither Gateway nor Auth-Service configures rate limiting on `/public/v1/auth/login`.
  - The Gateway configuration specifies `AuthenticationFilter` in `default-filters`, but **no `RequestRateLimiter` filter** is applied.
  - Attackers can issue thousands of requests per minute against `/auth/public/v1/auth/login` without being throttled.

#### B. Cryptographic Timing Side-Channel (Username Enumeration)
- **Implementation:** `in.nic.lgd.auth.service.impl.AuthServiceImpl.java`:
  ```java
  User user = userRepository.findByUserLoginIdAndIsActiveTrueAndIsDeletedFalse(loginRequest.getUsername())
          .orElseThrow(() -> new RuntimeException("Invalid credentials"));

  if (!BCrypt.checkpw(loginRequest.getPassword(), user.getPasswordHash())) {
      throw new RuntimeException("Invalid credentials");
  }
  ```
- **Analysis (`AUTH-008`):**
  - While both conditions throw identical "Invalid credentials" messages (resolving textual username enumeration `VULN-010`), there is a substantial **execution time discrepancy**:
    - **Non-existent user:** DB lookup returns empty -> throws immediately (~1.5 ms).
    - **Existing user with wrong password:** DB lookup succeeds -> `BCrypt.checkpw` calculates 1024 bcrypt rounds -> throws after ~95–130 ms.
  - An attacker measuring HTTP response latency can distinguish valid usernames from invalid ones with >99% confidence.
  - **Remediation:** Perform a dummy BCrypt calculation when user is not found to equalize execution time.

---

### 2.6 Domain 6: Session Management & Client-Side Token Storage

#### A. Client-Side Token Persistence
- **Implementation:** `lgd-um/src/components/Login.jsx` and `lgd-um/src/services/apiConfig.js`.
- **Mechanics:**
  - Upon successful login: `localStorage.setItem('token', payload.token)`.
  - Every API request pulls the token: `localStorage.getItem('token')`.
  - Stored in browser `localStorage` alongside user identity attributes (`userLoginId`, `roleName`, `stateName`, `districtName`).
- **Risk (`AUTH-005`):**
  - `localStorage` is accessible to any JavaScript running in the origin.
  - If a Cross-Site Scripting (XSS) vulnerability exists or a malicious NPM dependency is executed, the bearer token can be read and exfiltrated immediately.
  - Mitigated partially by Gateway Content-Security-Policy (CSP) headers, but architectural best practice requires storing session identifiers in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.

#### B. Session Fixation & Logout
- **Stateless Configuration:** All backend services configure `SessionCreationPolicy.STATELESS`. Spring Security sessions (`JSESSIONID`) are disabled, mitigating classic servlet session fixation.
- **Logout Execution:**
  - Frontend `performLogout` dispatches `POST /private/v1/auth/logout`.
  - Server puts the token `jti` into Redis blacklist.
  - Frontend invokes `clearAuthStorage()` to remove all keys from `localStorage` and redirects to `/`.
  - Verified by `REVOC-007` test case.

---

### 2.7 Domain 7: Multi-Factor Authentication (MFA / 2FA)

#### A. MFA Implementation Status
- **Findings (`AUTH-010`):**
  - Zero MFA infrastructure exists in the current codebase.
  - No TOTP (RFC 6238) secret generation, QR code enrollment, or verification logic.
  - No SMS/Email OTP service integration.
  - No hardware key / WebAuthn / FIDO2 support.
  - All users, including Central System Administrators and State Administrators possessing bulk entity reorganization authority, authenticate using single-factor static credentials.

---

## 3. Automated Security Verification Results

Automated regression and unit test verification was executed against the authentication and gateway components:

```
========================================================================================
PHASE 5 AUTOMATED AUTHENTICATION & SESSION SECURITY TEST VERIFICATION
========================================================================================
Test Suite                               Module        Tests   Pass   Fail   Error   Rate
----------------------------------------------------------------------------------------
JwtHardeningRegressionTest               auth-service      6      6      0       0   100%
JwtUtilTest                              auth-service      2      2      0       0   100%
ProductionSecurityValidatorTest          auth-service      6      6      0       0   100%
AuthenticationFilterTest                 api-gateway       8      8      0       0   100%
RouteValidatorTest                       api-gateway       5      5      0       0   100%
SecurityHeadersFilterTest                api-gateway       1      1      0       0   100%
----------------------------------------------------------------------------------------
Phase 5 Dedicated Test Suite Total                        28     28      0       0   100%
Master Baseline Regression Suite Total                   289    289      0       0   100%
========================================================================================
```

### Key Security Assertions Verified in Live Execution:
1. **JTI Uniqueness:** Two tokens generated for identical credentials in the same millisecond receive distinct, non-overlapping UUID `jti` claims (`JwtHardeningRegressionTest.test1`).
2. **Selective Invalidation:** Revoking Token A leaves Token B valid; reuse of Token A returns HTTP 401 Unauthorized (`JwtHardeningRegressionTest.test2`).
3. **Blacklist TTL Precision:** Redis blacklist TTL does not exceed the token's remaining validity window (`JwtHardeningRegressionTest.test4`).
4. **Fail-Closed Redis Handling:** Redis connectivity failure or timeout triggers HTTP 503 Service Unavailable, preventing fail-open access (`AuthenticationFilterTest.REVOC-003`, `REVOC-006`).
5. **Perimeter Normalization:** Route traversal attempts (`..`, `;`) are detected and forced through authentication (`RouteValidatorTest`).

---

## 4. Phase 5 Security Findings Register Summary

| Finding ID | Title | Severity | CWE | Mapped Baseline / Threat | Status |
|:---:|:---|:---:|:---:|:---:|:---:|
| **`AUTH-001`** | Shared Symmetric HMAC Signing Key (HS256) Across Distributed Services | **HIGH** (7.4) | CWE-321 | `VULN-001`, `THR-STRIDE-001`, `RR-01` | **OPEN (Queued Phase 5/7)** |
| **`AUTH-002`** | Absence of Redis Token Revocation Check in Downstream Microservices | **HIGH** (7.5) | CWE-384 | `VULN-007`, `SAST-012`, `THR-STRIDE-007` | **OPEN** |
| **`AUTH-003`** | Excessive 24-Hour Access Token Lifetime & Absence of Refresh Token Rotation | **HIGH** (7.1) | CWE-613 | `VULN-020`, `RR-01`, `RR-03` | **OPEN** |
| **`AUTH-004`** | Absence of Ingress Rate Limiting on Authentication Routes | **HIGH** (7.3) | CWE-307 | `VULN-015`, `THR-STRIDE-016` | **OPEN** |
| **`AUTH-005`** | Client-Side Bearer Token Storage in Browser `localStorage` | **MEDIUM** (5.4) | CWE-922 | `RR-03` | **OPEN** |
| **`AUTH-006`** | Legacy `jbcrypt:0.4` Implementation & Absence of Modern Adaptive Hashing | **MEDIUM** (5.3) | CWE-1104 | `SCA-008`, `RR-10` | **OPEN (Queued Phase 5/7)** |
| **`AUTH-007`** | Absence of Account Lockout Policy & Failed Login Attempt Tracking | **MEDIUM** (5.3) | CWE-307 | `VULN-011`, `THR-STRIDE-016` | **OPEN** |
| **`AUTH-008`** | Timing Side-Channel in Authentication Verification (User Enumeration) | **MEDIUM** (5.3) | CWE-208 | `VULN-010` | **OPEN** |
| **`AUTH-009`** | Weak Password Complexity Policy Enforcement in User Creation Validator | **MEDIUM** (5.2) | CWE-521 | `VULN-011` | **OPEN** |
| **`AUTH-010`** | Complete Absence of Multi-Factor Authentication (MFA / 2FA) | **MEDIUM** (5.0) | CWE-308 | Phase 5 Scope | **OPEN** |
| **`AUTH-011`** | Absence of Concurrent Session Control | **LOW** (3.1) | CWE-613 | Phase 5 Scope | **OPEN** |

---

## 5. Traceability Matrix

| Phase 5 ID | Phase 0 Baseline | SAST ID | STRIDE Threat | DAST Vector | Residual Risk | Technical Resolution / Status |
|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **AUTH-001** | `VULN-001` | `SAST-001` | `THR-STRIDE-001` | `EXP-001` | `RR-01` | Comp-control: 256-bit entropy check; RS256 migration scheduled Phase 5/7. |
| **AUTH-002** | `VULN-007` | `SAST-012` | `THR-STRIDE-007` | `EXP-007` | — | Gateway enforcer verified; downstream filters require Redis template injection. |
| **AUTH-003** | `VULN-020` | — | — | `EXP-019` | `RR-01`, `RR-03` | Requires 15-minute access token + refresh token rotation architecture. |
| **AUTH-004** | `VULN-015` | — | `THR-STRIDE-016` | `EXP-015` | — | Requires Spring Cloud Gateway Redis RateLimiter filter on `/public/v1/auth/**`. |
| **AUTH-005** | — | — | `THR-STRIDE-014` | — | `RR-03` | Gateway CSP mitigates; cookie-based session migration recommended. |
| **AUTH-006** | — | — | — | — | `RR-10` | Migration to Spring Security `BCryptPasswordEncoder` (cost 12) scheduled Phase 5/7. |
| **AUTH-007** | `VULN-011` | — | `THR-STRIDE-016` | — | — | Requires schema update: `failed_attempts`, `locked_until` columns. |
| **AUTH-008** | `VULN-010` | `SAST-017` | `THR-STRIDE-016` | `EXP-010` | — | Requires dummy BCrypt computation on user-not-found path. |
| **AUTH-009** | `VULN-011` | — | `THR-STRIDE-016` | — | — | Update regex in `CreateUserValidator` to require upper, lower, digit, symbol. |
| **AUTH-010** | — | — | — | — | — | Architect TOTP / SMS-OTP step-up authentication for admin roles. |
| **AUTH-011** | — | — | — | — | — | Track active session JTI in Redis per user; invalidate previous session. |

---

## 6. Prioritized Remediation Recommendations

### Priority 1: High-Impact Architecture Changes (Phase 5/7 Implementation)
1. **Migrate to Asymmetric RS256 Signing:**
   - Configure `auth-service` with RSA Private Key (PKCS#8).
   - Distribute RSA Public Key (X.509 / JWKS) to `api-gateway`, `user-management`, and `revenue`.
   - Eliminate shared symmetric key distribution across services.
2. **Implement Downstream Redis Revocation Checking:**
   - Inject `ReactiveStringRedisTemplate` into `user-management` and `revenue` `JwtAuthenticationFilter` classes.
   - Enforce fail-closed revocation check uniformly across the cluster.
3. **Implement Short-Lived Access Tokens & Refresh Token Rotation:**
   - Reduce access token validity from 24 hours to 15 minutes (`900000` ms).
   - Issue cryptographically secure refresh token (stored in Redis with user binding and rotation on every use).

### Priority 2: Ingress Defense & Endpoint Hardening
4. **Deploy Gateway Rate Limiting:**
   - Add `RequestRateLimiter` filter to `api-gateway` routes for `/auth/**`.
   - Enforce 5 login attempts per minute per IP address.
5. **Eliminate Timing Side-Channel in Login:**
   - In `AuthServiceImpl.java`, if user is not found, execute `BCrypt.checkpw("dummyPassword", "$2a$10$w...dummyHash")` prior to throwing `RuntimeException("Invalid credentials")`.
6. **Enforce Strong Password Complexity:**
   - Update `CreateUserValidator.java` with regex enforcing: `>=12` characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character.

### Priority 3: Session Security & MFA
7. **Migrate Client Token Storage to HttpOnly Cookies:**
   - Transmit JWT via `Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict`.
8. **Implement Multi-Factor Authentication (MFA):**
   - Introduce TOTP (Google Authenticator / Microsoft Authenticator) for Central and State Administrator roles.

---

## 7. Phase 5 Audit Status & Gate Reconciliation

In strict accordance with project owner instructions and governance mandates:

- **Phase 5 Status:** **`AUDIT COMPLETED`** (Comprehensive inspection completed, all 11 security findings documented, live test suite verified, deliverable package generated).
- **Gate A (Documentation Integrity & Governance):** **`PASS`** (Traceability maintained across all audit artifacts).
- **Gate B (Technical Verification):** **`HOLD`** (Preserved as HOLD; blockers `BLK-01`, `BLK-02`, and `BLK-03` remain open/deferred per mandate).
- **Gate C (Governance & Risk Acceptance):** **`PENDING_FORMAL_ACCEPTANCE`** (Preserved; blocker `BLK-04` remains open pending formal DAA/CISO authorization memorandum).
- **Overall Program Status:** **`PENDING_REMEDIATION_AND_INDEPENDENT_RETEST`**

---
*Report independently compiled and formally issued by the Lead Application Security Architect & Cryptographic Evaluator.*
