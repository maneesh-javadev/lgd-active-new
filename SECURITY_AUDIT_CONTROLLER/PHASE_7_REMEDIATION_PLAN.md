# LGD 2.0 — Phase 7: Cryptography & Secrets Hardening Remediation Plan
## Detailed Implementation Blueprint, Step-by-Step Migration & Rollback Procedures

| **Remediation Plan Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 7: Cryptography & Secrets Hardening (Remediation Plan)** |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Lead Security Engineer** | Senior Java 21 / Spring Boot Security Engineer |
| **Evaluation Timestamp** | November 5, 2026 (`2026-11-05T15:50:00+05:30`) |
| **Authorization Checkpoint** | **SUBMITTED FOR EXECUTIVE AUTHORIZATION — ZERO MUTATIONS PERFORMED** |

---

## 1. Itemized Scope of Affected Repositories & Files

The table below catalogs every repository, configuration, and source file designated for remediation under Phase 7:

| Target Repository | Target File Path | Primary Modification Scope | Associated Finding |
|:---|:---|:---|:---:|
| **`auth-service`** | `src/main/java/in/nic/lgd/auth/security/JwtUtil.java` | Replace HS256 with RS256 private key signing; add `kid`, `iss`, `aud` | `SAST-001`, `RR-01` |
| **`auth-service`** | `src/main/java/in/nic/lgd/auth/controller/JwksController.java` | **New file:** Expose public key JWKS endpoint (`/.well-known/jwks.json`) | `SAST-001`, `RR-01` |
| **`auth-service`** | `src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java` | Replace `org.mindrot.jbcrypt` with `BCryptPasswordEncoder(12)` | `SCA-008`, `RR-10` |
| **`auth-service`** | `pom.xml` | Remove unmaintained `jbcrypt:0.4` dependency; verify `spring-security-crypto` | `SCA-008` |
| **`api-gateway`** | `src/main/java/in/gov/lgd/gateway/util/JwtUtil.java` | Configure NimbusJwtDecoder with `auth-service` JWKS / public key | `SAST-001`, `RR-01` |
| **`api-gateway`** | `src/main/resources/application.properties` | Add JWKS URI `http://auth-service:18090/.well-known/jwks.json` | `SAST-001`, `RR-01` |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/user/security/JwtUtil.java` | Update parser to verify RS256 using public key; validate `iss` and `aud` | `SAST-001`, `RR-01` |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/user/security/JwtUtil.java` | Update parser to verify RS256 using public key; validate `iss` and `aud` | `SAST-001`, `RR-01` |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/XmlSignatureUtil.java` | Remove unsigned XML bypass under production; enforce strict keystore check | `SAST-003`, `RR-04` |
| **`root`** | `docker-compose.yml` | Introduce Docker Secrets / file-based credentials; enable Redis `requirepass` | `SAST-002`, `RR-02`, `RR-07` |

---

## 2. Step-by-Step Remediation Procedures

### Step 1: RSA-2048 Key Pair Generation & Keystore Setup
1. Generate an enterprise RSA-2048 key pair using OpenSSL or Java `keytool`:
   ```bash
   keytool -genkeypair -alias lgd-jwt-key -keyalg RSA -keysize 2048 -validity 365 \
     -keystore jwt-keystore.p12 -storetype PKCS12 -storepass <SECURE_KEYSTORE_PASS>
   ```
2. Store the PKCS#12 keystore securely within `auth-service/src/main/resources/certs/` (or inject via volume mount).

### Step 2: Implement RS256 Signing in `auth-service`
1. Update `auth-service/src/main/java/in/nic/lgd/auth/security/JwtUtil.java`:
   - Load RSA `PrivateKey` from keystore.
   - Sign JWTs using `SignatureAlgorithm.RS256`.
   - Set Header Key ID: `.setHeaderParam("kid", keyId)`.
   - Set Claims: `.setIssuer("https://lgdirectory.gov.in")` and `.setAudience("lgd-platform")`.
2. Add `JwksController.java` to expose public keys:
   - Provide standard RFC 7517 JWKS output containing `kty: RSA`, `use: sig`, `alg: RS256`, `kid`, `n`, `e`.

### Step 3: Implement Dual-Algorithm Verification for Zero-Downtime Transition
1. In `api-gateway`, `user-management`, and `revenue`, configure a dual-verification strategy during deployment:
   - Tokens with header `alg=RS256` are verified against the RSA public key / JWKS.
   - Tokens with header `alg=HS256` (issued prior to migration) are verified against the legacy secret for a 15-minute grace window.
   - After the 15-minute token lifetime expires, decommission the legacy HS256 verification path.

### Step 4: Password Hashing Modernization
1. In `auth-service/pom.xml`, eliminate `org.mindrot:jbcrypt:0.4`.
2. In `auth-service`, declare a Spring `@Bean PasswordEncoder`:
   ```java
   @Bean
   public PasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder(12);
   }
   ```
3. Update `AuthServiceImpl.java` to inject `PasswordEncoder` and call `passwordEncoder.matches(rawPassword, hash)`.
4. Implement automatic hash upgrading: if `passwordEncoder.upgradeEncoding(hash)` returns true, rehash the plaintext password with cost 12 and update the user record.

### Step 5: Secrets Ingestion Hardening
1. Configure Docker Secrets mounts under `/run/secrets/`.
2. Update Spring properties to leverage Spring Boot's built-in file-based secret resolution: `spring.datasource.password=${DB_PASSWORD_FILE:...}`.
3. Add `requirepass ${REDIS_PASSWORD}` to Redis container configuration.

---

## 3. Backward Compatibility & Deployment Dependencies

```
========================================================================================================
DEPLOYMENT SEQUENCE & SERVICE ORDER DEPENDENCY
========================================================================================================
Sequence Step  Service Action                  Deployment Prerequisite         Rollback Checkpoint
--------------------------------------------------------------------------------------------------------
Stage 1        Deploy Downstream Public Keys   Deploy to gateway, um, revenue  Revert to pure HS256
Stage 2        Deploy auth-service RS256       Stage 1 completed & verified    Revert auth-service to HS256
Stage 3        15-Minute Token Draining        Active user sessions expire     No action required
Stage 4        Decommission Legacy Secret      Stage 3 window completed        Restore legacy secret
========================================================================================================
```

---

## 4. Rollback and Disaster Recovery Procedures

If token verification errors, latency spikes, or service disruptions occur during deployment:
1. **Immediate Algorithmic Rollback:** Revert `auth-service` environment to `JWT_SIGNING_ALGORITHM=HS256`. Because downstream services support dual verification during Stage 1–3, all newly minted tokens will immediately validate.
2. **Key Keystore Recovery:** If the RSA private keystore becomes corrupt or inaccessible, fallback to the pre-remediation backup keystore preserved in `/scratch/pre_remediation_backup/`.
3. **Database Reversion:** No database schema alterations are introduced during Phase 7 cryptographic hardening; rollback requires only service redeployment.

---

## 5. Formal Executive Authorization Gate

$$\mathbf{MANDATORY\ GOVERNANCE\ DIRECTIVE:}$$
$$\mathbf{THIS\ REMEDIATION\ PLAN\ IS\ PREPARED\ AND\ SUBMITTED\ FOR\ FORMAL\ APPROVAL.}$$
$$\mathbf{NO\ SOURCE\ CODE,\ KEY,\ SECRET,\ OR\ INFRASTRUCTURE\ MUTATIONS\ WILL\ BE\ EXECUTED}$$
$$\mathbf{UNTIL\ EXPLICIT\ EXECUTIVE\ AUTHORIZATION\ IS\ RECEIVED\ FROM\ THE\ USER\ /\ DAA\ /\ CISO.}$$

