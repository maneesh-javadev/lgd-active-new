# LGD 2.0 — Phase 7: Cryptography and Secrets Management Assessment
## Architectural Security Analysis, Cryptographic Vulnerability Reconciliation & Threat Modeling

| **Assessment Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 7: Cryptography & Secrets Management Hardening (Assessment)** |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Lead Auditor Role** | Chief Application Security Architect & Cryptography Specialist |
| **Evaluation Timestamp** | November 5, 2026 (`2026-11-05T15:45:00+05:30`) |
| **Mandatory Authorization Gate** | **STOPPING DIRECTIVE: AWAIT EXPLICIT EXECUTIVE REMEDIATION AUTHORIZATION** |

---

## 1. Executive Mission & Security Context

LGD 2.0 serves as the authoritative national directory of local government bodies in India, maintaining spatial hierarchies, administrative boundary changes, village reorganizations, and digitally signed government orders. Cryptographic integrity and robust secrets management form the foundational trust pillars of the entire system.

This assessment provides a rigorous cryptographic architecture review across all microservices, identifying structural vulnerabilities, quantifying exploitability, reconciling existing audit findings, and formulating defensible hardening strategies.

---

## 2. Deep Cryptographic Domain Evaluations

### 2.1 JWT Architecture & Asymmetric PKI Deficit (`SAST-001` / `RR-01`)
- **Current State:**
  - Token signing in `auth-service` uses `SignatureAlgorithm.HS256` with a symmetric secret key (`${JWT_SECRET}`).
  - Verification in `api-gateway`, `user-management`, and `revenue` utilizes the identical symmetric key.
- **Architectural Threat:**
  - In a distributed microservice topology, sharing symmetric signing keys violates the principle of least privilege.
  - Any compromised downstream microservice can mint valid administrative JWTs for any user, creating a complete lateral privilege escalation vector.
  - JJWT parsing lacks explicit `issuer` (`iss`) and `audience` (`aud`) assertions.
- **Target Cryptographic State:**
  - **Algorithm Transition:** Migrate from symmetric `HS256` to asymmetric `RS256` (RSA-2048 with SHA-256) or `ES256` (ECDSA on P-256).
  - **Key Separation:** The private key resides exclusively within `auth-service`'s secure key store. Downstream services (`gateway`, `um`, `revenue`) receive only the public key or consume it via a standard JSON Web Key Set (`JWKS`) endpoint (`GET /.well-known/jwks.json`).
  - **Header & Claim Enforcement:** Add mandatory `kid` (Key ID), `iss: "https://lgdirectory.gov.in"`, and service-specific `aud: ["lgd-platform"]`.

### 2.2 Password Hashing & Legacy Library Vulnerability (`SCA-008` / `RR-10`)
- **Current State:**
  - `auth-service` relies on `org.mindrot:jbcrypt:0.4` via `BCrypt.checkpw(password, user.getPasswordHash())`.
  - While BCrypt itself remains an accepted adaptive hashing function, the `jBCrypt:0.4` artifact has not received security updates since 2015.
- **Architectural Threat:**
  - Inability to dynamically adapt work factor costs without modifying source code.
  - Lacks modern memory-hard cryptographic protections against ASIC/GPU cracking (such as `Argon2id`).
- **Target Cryptographic State:**
  - Adopt Spring Security's `DelegatingPasswordEncoder` with `BCryptPasswordEncoder(12)` as the active encoder.
  - Ensure backward-compatible verification of existing `$2a$` hashes while automatically rehashing credentials to modern parameters upon successful authentication.

### 2.3 XML Digital Signatures (e-Hastakshar / eSign) (`SAST-004`..`007` / `RR-04`)
- **Current State:**
  - `XmlSignatureUtil.java` signs outbound XML documents using `RSA-SHA256` (`http://www.w3.org/2001/04/xmldsig-more#rsa-sha256`) and verifies responses via `DOMValidateContext` and `X509KeySelector`.
  - Hardened controls implemented during SAST remediation:
    - XXE disabled (`disallow-doctype-decl=true`, external entities blocked).
    - `org.jcp.xml.dsig.secureValidation` explicitly set to `Boolean.TRUE` to counter XML Signature Wrapping (XSW).
    - `X509KeySelector` enforces certificate validity checking, key usage validation (`digitalSignature`), RSA modulus $\ge 2048$ bits, and trust anchor chaining to the CDAC root certificate.
- **Residual Risk:**
  - Lines 47–50 in `XmlSignatureUtil.java` contain a fallback returning unsigned XML if keystore path is null. While intended for local test environments, this must be strictly disabled under production profiles.
  - Keystore password (`${ESIGN_KEYSTORE_PASSWORD}`) is passed as a plain environment variable.

### 2.4 Secrets Management & Container Environment Security (`SAST-002` / `RR-07`)
- **Current State:**
  - Secrets (`JWT_SECRET`, `SPRING_DATASOURCE_PASSWORD`, `ESIGN_KEYSTORE_PASSWORD`, `EUREKA_PASSWORD`) are passed as environment variables in `docker-compose.yml`.
  - Stored in cleartext in process environment tables (`/proc/[pid]/environ`) and inspectable via `docker inspect`.
- **Target Secrets Architecture:**
  - Transition to container-native secret injection (Docker Secrets / Kubernetes Secrets) or an enterprise secrets manager (HashiCorp Vault KV v2).
  - Microservices retrieve short-lived credentials via secure token exchange or volume mounts (`/run/secrets/*`).

---

## 3. Reconciliation of Existing Audit Findings

| Canonical ID | Finding Description | Severity | Historical Status | Phase 7 Cryptographic Assessment Determination |
|:---:|:---|:---:|:---:|:---|
| **`SAST-001`** | Forgery of JWT via Hardcoded Signing Key | **CRITICAL** (9.8) | `VERIFIED_FIXED` | Hardcoded secret externalized; architectural mitigation to asymmetric RS256 required (`RR-01`). |
| **`SAST-002`** | Plaintext Database Credentials | **CRITICAL** (9.8) | `VERIFIED_FIXED` | Externalized to env vars; requires Docker Secrets / Vault injection to prevent host inspection. |
| **`SAST-003`** | eSign PKCS#12 Keystore Password Extraction | **CRITICAL** (9.8) | `VERIFIED_FIXED` | Externalized to `${ESIGN_KEYSTORE_PASSWORD}`; requires Vault secret mounting. |
| **`SAST-004`** | XML Signature Wrapping (XSW) | **CRITICAL** (9.6) | `VERIFIED_FIXED` | Fully mitigated; `secureValidation=true` verified active. |
| **`SAST-005`** | Untrusted Certificate Acceptance in XMLDSig | **CRITICAL** (9.6) | `VERIFIED_FIXED` | Mitigated; CDAC root anchor path validation verified active. |
| **`SAST-006`** | Conditional Bypass of eSign Verification | **HIGH** (8.8) | `VERIFIED_FIXED` | Mitigated; bypass flags eliminated from code. |
| **`SAST-007`** | Insecure PRNG for eSign Transaction IDs | **HIGH** (7.5) | `VERIFIED_FIXED` | Mitigated; `SecureRandom` enforced. |
| **`SCA-008`** | Legacy Unmaintained jBCrypt Library | **MEDIUM** (5.3) | `DEFERRED (QUEUED)`| Requires migration to Spring Security `DelegatingPasswordEncoder`. |

---

## 4. Mandatory Executive Authorization Checkpoint

$$\mathbf{STOP:\ PHASE\ 7\ IMPLEMENTATION\ PLAN\ COMPLETE.}$$
$$\mathbf{ZERO\ APPLICATION\ SOURCE\ CODE,\ KEY,\ OR\ CREDENTIAL\ MUTATIONS\ PERFORMED.}$$
$$\mathbf{AWAIT\ EXPLICIT\ EXECUTIVE\ AUTHORIZATION\ PRIOR\ TO\ COMMENCING\ PHASE\ 7\ REMEDIATION.}$$

