# LGD 2.0 — Phase 5: Authentication & Session Security Findings Register

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | Phase 5: Authentication & Session Security Audit |
| **Document Purpose** | Comprehensive Register of Authentication, Session, and Credential Findings |
| **Date of Evaluation** | November 3, 2026 |
| **Lead Auditor** | Lead Application Security Architect & Cryptographic Evaluator |
| **Total Findings Cataloged** | **11 Discrete Findings** (`AUTH-001` through `AUTH-011`) |
| **Severity Breakdown** | **High: 4 | Medium: 6 | Low: 1** |

---

## 1. Master Findings Summary Table

| Finding ID | Finding Title | Severity | CVSS 3.1 | CWE | Affected Component(s) | Primary Source Location | Mapped Baseline / Threat |
|:---:|:---|:---:|:---:|:---:|:---|:---|:---:|
| **`AUTH-001`** | Shared Symmetric HMAC Key (HS256) Distribution Across Microservices | **HIGH** | 7.4 | CWE-321 | `auth-service`, `api-gateway`, `user-management`, `revenue` | `JwtUtil.java` (all services) | `VULN-001`, `THR-STRIDE-001`, `RR-01` |
| **`AUTH-002`** | Absence of Redis Token Revocation Check in Downstream Microservices | **HIGH** | 7.5 | CWE-384 | `user-management`, `revenue` | `JwtAuthenticationFilter.java` | `VULN-007`, `SAST-012`, `THR-STRIDE-007` |
| **`AUTH-003`** | Excessive 24-Hour Access Token Lifetime & Absence of Refresh Token Rotation | **HIGH** | 7.1 | CWE-613 | `auth-service`, `api-gateway` | `application.properties` | `VULN-020`, `RR-01`, `RR-03` |
| **`AUTH-004`** | Absence of Ingress Rate Limiting on Authentication Endpoints | **HIGH** | 7.3 | CWE-307 | `api-gateway` | `application.properties` | `VULN-015`, `THR-STRIDE-016` |
| **`AUTH-005`** | Client-Side Bearer Token Storage in Browser `localStorage` | **MEDIUM** | 5.4 | CWE-922 | `lgd-um` (Frontend) | `Login.jsx`, `apiConfig.js` | `RR-03`, `THR-STRIDE-014` |
| **`AUTH-006`** | Legacy `jbcrypt:0.4` Implementation & Absence of Modern Adaptive Hashing | **MEDIUM** | 5.3 | CWE-1104 | `auth-service`, `user-management` | `pom.xml`, `AuthServiceImpl.java` | `SCA-008`, `RR-10` |
| **`AUTH-007`** | Absence of Account Lockout Policy & Failed Login Attempt Tracking | **MEDIUM** | 5.3 | CWE-307 | `auth-service`, Database Schema | `User.java`, `AuthServiceImpl.java` | `VULN-011`, `THR-STRIDE-016` |
| **`AUTH-008`** | Timing Side-Channel in Authentication Verification (User Enumeration) | **MEDIUM** | 5.3 | CWE-208 | `auth-service` | `AuthServiceImpl.java:56-61` | `VULN-010` |
| **`AUTH-009`** | Weak Password Complexity Policy Enforcement in User Creation Validator | **MEDIUM** | 5.2 | CWE-521 | `user-management` | `CreateUserValidator.java:70-76` | `VULN-011` |
| **`AUTH-010`** | Complete Absence of Multi-Factor Authentication (MFA / 2FA) | **MEDIUM** | 5.0 | CWE-308 | Entire Platform | `auth-service`, `lgd-um` | Roadmap Phase 5 Scope |
| **`AUTH-011`** | Absence of Concurrent Session Control | **LOW** | 3.1 | CWE-613 | `auth-service` | `AuthServiceImpl.java` | Roadmap Phase 5 Scope |

---

## 2. Detailed Technical Finding Profiles

---

### Finding AUTH-001: Shared Symmetric HMAC Key (HS256) Distribution Across Microservices

- **Severity:** **HIGH**
- **CVSS 3.1 Score:** **7.4** (`CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N`)
- **Weakness:** CWE-321: Use of Hard-coded Cryptographic Key / CWE-326: Inadequate Encryption Strength
- **Affected Components:** `auth-service`, `api-gateway`, `user-management`, `revenue`
- **Source Citations:**
  - `auth-service/src/main/java/in/nic/lgd/auth/security/JwtUtil.java:79`
  - `api-gateway/src/main/java/in/gov/lgd/gateway/util/JwtUtil.java:28`
  - `user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtUtil.java:79`
  - `revenue/src/main/java/in/nic/lgd/revenue/user/security/JwtUtil.java:79`
- **Technical Description:**
  The entire microservice architecture shares a single symmetric HMAC secret (`${jwt.secret}`). Every microservice possesses the capability to both sign and verify JWT tokens. In a zero-trust or multi-tenant cloud environment, downstream microservices (such as `revenue` or `user-management`) should only possess the public key necessary to verify signatures, while the private signing key should be isolated strictly to `auth-service`.
- **Exploitation Scenario:**
  If an adversary compromises a read-only or low-privileged microservice (e.g. via an SSRF vulnerability or container escape), they can extract `${JWT_SECRET}` from the container's environment variables and forge arbitrary tokens containing `roleLevelCode="C"` (Central Administrator) and all privileges, achieving total administrative takeover.
- **Compensating Controls Currently Active:**
  - `ProductionSecurityValidator.java` verifies that `jwt.secret` is populated via environment variable with >= 256 bits of entropy and blocks known sample keys.
  - Container compose configuration isolates environment variables.
- **Required Remediation:**
  Migrate token signing from HMAC-SHA256 (`HS256`) to RSA-SHA256 (`RS256`) or ECDSA (`ES256`). `auth-service` will generate tokens using its private key; all downstream services and the API Gateway will verify tokens using the public key published via a JWKS endpoint (`/.well-known/jwks.json`).

---

### Finding AUTH-002: Absence of Redis Token Revocation Check in Downstream Microservices

- **Severity:** **HIGH**
- **CVSS 3.1 Score:** **7.5** (`CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`)
- **Weakness:** CWE-384: Session Fixation / CWE-613: Insufficient Session Expiration
- **Affected Components:** `user-management`, `revenue`
- **Source Citations:**
  - `user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java:50`
  - `revenue/src/main/java/in/nic/lgd/revenue/user/security/JwtAuthenticationFilter.java:47`
- **Technical Description:**
  While the `api-gateway` and `auth-service` query Redis for token revocation on every request, the downstream services `user-management` and `revenue` rely on local `JwtAuthenticationFilter` instances that only perform static signature and expiration checks. If an adversary gains access to the internal network (e.g., direct port binding, internal bridge pivoting, or lateral movement from another compromised container), revoked tokens remain completely valid downstream.
- **Exploitation Scenario:**
  A malicious officer whose account was revoked or who logged out on the gateway can continue issuing requests directly against internal endpoints (`http://user-management:18089` or `http://revenue:18062`) if internal network controls or proxy configurations are misconfigured.
- **Required Remediation:**
  Inject `StringRedisTemplate` into `user-management` and `revenue` `JwtAuthenticationFilter` implementations. Alternatively, adopt Gateway mutual TLS (mTLS) with cryptographically signed internal proxy headers that attest to gateway verification.

---

### Finding AUTH-003: Excessive 24-Hour Access Token Lifetime & Absence of Refresh Token Rotation

- **Severity:** **HIGH**
- **CVSS 3.1 Score:** **7.1** (`CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N`)
- **Weakness:** CWE-613: Insufficient Session Expiration
- **Affected Components:** `auth-service`, `api-gateway`
- **Source Citations:**
  - `auth-service/src/main/resources/application.properties:39` (`jwt.expiration=86400000`)
  - `api-gateway/src/main/resources/application.properties:153`
- **Technical Description:**
  The default validity for bearer access tokens is set to 24 hours (86,400,000 ms), with configuration comments noting up to 7 days. Because bearer tokens are stateless and stored in browser `localStorage`, an intercepted token provides an extensive window of unauthorized access. Furthermore, no refresh token mechanism exists to issue short-lived access tokens (15 minutes) with rotating refresh tokens.
- **Required Remediation:**
  1. Reduce access token validity to 15 minutes (`900000` ms).
  2. Implement an OAuth 2.0 / RFC 6749 refresh token flow.
  3. Store refresh tokens in Redis with single-use rotation semantics (Family ID + Invalidation on reuse).

---

### Finding AUTH-004: Absence of Ingress Rate Limiting on Authentication Endpoints

- **Severity:** **HIGH**
- **CVSS 3.1 Score:** **7.3** (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:H`)
- **Weakness:** CWE-307: Improper Restriction of Excessive Authentication Attempts
- **Affected Components:** `api-gateway`, `auth-service`
- **Source Citations:**
  - `api-gateway/src/main/resources/application.properties:116`
- **Technical Description:**
  The API Gateway route definitions for `/auth/**` do not include a `RequestRateLimiter` filter or any Redis-backed token bucket filter. Furthermore, `auth-service` does not enforce application-level request throttling on `/public/v1/auth/login`. Attackers can execute automated dictionary, credential stuffing, and brute-force password guessing attacks without triggering HTTP 429 (Too Many Requests).
- **Required Remediation:**
  Configure Spring Cloud Gateway `RequestRateLimiter` using Redis and a custom `KeyResolver` based on client IP and target username. Enforce a threshold of maximum 5 failed attempts per minute per IP address.

---

### Finding AUTH-005: Client-Side Bearer Token Storage in Browser `localStorage`

- **Severity:** **MEDIUM**
- **CVSS 3.1 Score:** **5.4** (`CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:N/A:N`)
- **Weakness:** CWE-922: Insecure Storage of Sensitive Information
- **Affected Components:** `lgd-um` (Frontend Application)
- **Source Citations:**
  - `lgd-um/src/components/Login.jsx:54` (`localStorage.setItem('token', payload.token)`)
  - `lgd-um/src/services/apiConfig.js:61` (`localStorage.getItem('token')`)
- **Technical Description:**
  The React frontend stores bearer JWT access tokens in the browser's `localStorage`. Items in `localStorage` have no expiration and can be accessed by any JavaScript code running in the origin. If any DOM XSS or malicious third-party script is executed, tokens can be stolen immediately.
- **Compensating Controls Currently Active:**
  - Gateway injects strict Content-Security-Policy (CSP) headers restricting script execution (`default-src 'self'`).
- **Required Remediation:**
  Transition session storage to `HttpOnly`, `Secure`, `SameSite=Strict` cookies, preventing client-side JavaScript access while ensuring browser-managed transmission.

---

### Finding AUTH-006: Legacy `jbcrypt:0.4` Implementation & Absence of Modern Adaptive Hashing

- **Severity:** **MEDIUM**
- **CVSS 3.1 Score:** **5.3** (`CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N`)
- **Weakness:** CWE-1104: Use of Unmaintained Third-Party Component
- **Affected Components:** `auth-service`, `user-management`
- **Source Citations:**
  - `auth-service/pom.xml:68` (`org.mindrot:jbcrypt:0.4`)
  - `user-management/pom.xml:135` (`org.mindrot:jbcrypt:0.4`)
  - `auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java:59`
- **Technical Description:**
  The project utilizes `org.mindrot:jbcrypt:0.4`, which was last released in February 2015. It lacks support for modern adaptive hashing frameworks such as Spring Security Crypto's `DelegatingPasswordEncoder`, which seamlessly upgrades hashes on successful login, and modern memory-hard password functions like Argon2id.
- **Required Remediation:**
  Migrate to `org.springframework.security:spring-security-crypto` and configure `BCryptPasswordEncoder(12)` or `Argon2PasswordEncoder`.

---

### Finding AUTH-007: Absence of Account Lockout Policy & Failed Login Attempt Tracking

- **Severity:** **MEDIUM**
- **CVSS 3.1 Score:** **5.3** (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N`)
- **Weakness:** CWE-307: Improper Restriction of Excessive Authentication Attempts
- **Affected Components:** `auth-service`, Database Schema (`um.users`)
- **Source Citations:**
  - `auth-service/src/main/java/in/nic/lgd/auth/entity/User.java`
  - `auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java:55-62`
- **Technical Description:**
  The `um.users` entity table and authentication service do not track consecutive failed login attempts. An account is never locked out regardless of how many incorrect passwords are submitted. Furthermore, there is no password expiration date or forced periodic password change mechanism.
- **Required Remediation:**
  Add `failed_login_attempts` (integer) and `account_locked_until` (timestamp) columns to `um.users`. Lock accounts for 15 minutes after 5 consecutive failed attempts.

---

### Finding AUTH-008: Timing Side-Channel in Authentication Verification (User Enumeration)

- **Severity:** **MEDIUM**
- **CVSS 3.1 Score:** **5.3** (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`)
- **Weakness:** CWE-208: Observable Timing Discrepancy
- **Affected Components:** `auth-service`
- **Source Citations:**
  - `auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java:56-61`
- **Technical Description:**
  When a user attempts to log in via `/public/v1/auth/login`:
  ```java
  User user = userRepository.findByUserLoginIdAndIsActiveTrueAndIsDeletedFalse(loginRequest.getUsername())
          .orElseThrow(() -> new RuntimeException("Invalid credentials"));

  if (!BCrypt.checkpw(loginRequest.getPassword(), user.getPasswordHash())) {
      throw new RuntimeException("Invalid credentials");
  }
  ```
  If the username does not exist, the repository query returns empty and the exception is thrown immediately (~1–2 ms). If the username exists, `BCrypt.checkpw` executes 1,024 rounds of bcrypt computation, taking ~95–130 ms. This ~100x timing discrepancy allows attackers to accurately enumerate valid usernames by measuring HTTP response latency.
- **Required Remediation:**
  If the user is not found, execute a dummy BCrypt check with identical work factor against a pre-computed constant hash before throwing the exception, ensuring constant-time response behavior.

---

### Finding AUTH-009: Weak Password Complexity Policy Enforcement in User Creation Validator

- **Severity:** **MEDIUM**
- **CVSS 3.1 Score:** **5.2** (`CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:H/I:N/A:N`)
- **Weakness:** CWE-521: Weak Password Requirements
- **Affected Components:** `user-management`
- **Source Citations:**
  - `user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/validator/CreateUserValidator.java:70-76`
- **Technical Description:**
  The `CreateUserValidator` checks only that `passwordHash.trim().length() >= 8`. There are no rules enforcing uppercase letters, lowercase letters, numbers, or special characters. Passwords such as `12345678` or `password` successfully pass validation.
- **Required Remediation:**
  Update the validation logic to enforce:
  1. Minimum length of 12 characters.
  2. At least one uppercase letter (`(?=.*[A-Z])`).
  3. At least one lowercase letter (`(?=.*[a-z])`).
  4. At least one digit (`(?=.*[0-9])`).
  5. At least one special character (`(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?])`).
  6. Check against common password blocklists.

---

### Finding AUTH-010: Complete Absence of Multi-Factor Authentication (MFA / 2FA)

- **Severity:** **MEDIUM**
- **CVSS 3.1 Score:** **5.0** (`CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:L/A:N`)
- **Weakness:** CWE-308: Use of Single-factor Authentication
- **Affected Components:** Entire LGD 2.0 Platform
- **Source Citations:**
  - Entire repository census (0 references to TOTP, OTP, or WebAuthn in production controllers)
- **Technical Description:**
  LGD 2.0 manages nationwide local government entities, administrative boundary reorganizations, gazette publishing, and district bifurcations. High-privilege administrative accounts authenticate using single-factor static passwords. No secondary verification (SMS OTP, Email OTP, TOTP authenticator, or FIDO2/WebAuthn token) is required or supported.
- **Required Remediation:**
  Implement RFC 6238 Time-based One-Time Password (TOTP) authentication for all Central, State, and District administrative user roles.

---

### Finding AUTH-011: Absence of Concurrent Session Control

- **Severity:** **LOW**
- **CVSS 3.1 Score:** **3.1** (`CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:N/I:L/A:N`)
- **Weakness:** CWE-613: Insufficient Session Expiration
- **Affected Components:** `auth-service`
- **Source Citations:**
  - `auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java:102-111`
- **Technical Description:**
  When a user logs in, a new JWT token with a unique UUID `jti` is issued. The system does not invalidate previously issued active tokens for that user. A single user account can have dozens of concurrently active tokens across different devices or locations without restriction.
- **Required Remediation:**
  Store the active session `jti` in Redis indexed by `user:session:<userId>`. When a new login occurs, automatically blacklist the previously active `jti`.

---
*Register independently compiled and verified by the Lead Application Security Architect.*
