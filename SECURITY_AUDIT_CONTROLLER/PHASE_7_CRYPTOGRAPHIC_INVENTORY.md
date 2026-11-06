# LGD 2.0 — Phase 7: Cryptographic Inventory
## Exhaustive Algorithmic, Key Management & Secret Reference Census

| **Cryptographic Inventory Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 7: Cryptography & Secrets Management Hardening (Inventory)** |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Lead Auditor Role** | Cryptography and Secrets Management Specialist |
| **Evaluation Timestamp** | November 5, 2026 (`2026-11-05T15:40:00+05:30`) |
| **Scope of Inventory** | 6 Active Microservices, Frontend Client, Docker Compose, JVM Keystores |
| **Confidentiality Mandate** | **Zero secret values displayed; all references securely masked/redacted** |

---

## 1. Cryptographic Primitive & Algorithm Census

The table below catalogs every cryptographic algorithm and primitive currently implemented across the LGD 2.0 microservice ecosystem:

| Cryptographic Domain | Target Component / File | Current Implemented Primitive | Security Evaluation | Approved Hardened Target Primitive | Vulnerability / Risk Link |
|:---|:---|:---|:---:|:---|:---:|
| **JWT Token Signing** | `auth-service` / `JwtUtil.java` | HMAC-SHA256 (`HS256`) symmetric shared secret | **WEAK (Symmetric SPOF)** | Asymmetric `RS256` (RSA-2048) or `Ed25519` PKI | `SAST-001`, `RR-01` |
| **JWT Token Verification** | `api-gateway`, `user-management`, `revenue` | HMAC-SHA256 (`HS256`) shared secret | **WEAK (Key Distribution)** | Asymmetric Public Key / JWKS verification | `SAST-001`, `RR-01` |
| **JWT Identifier (`jti`)** | `auth-service` / `JwtUtil.java` | `UUID.randomUUID().toString()` | **ACCEPTABLE (Secure)** | `UUID.randomUUID()` with Redis deduplication | `SAST-012`, `RBAC-002` |
| **Password Hashing** | `auth-service` / `AuthServiceImpl.java` | Legacy jBCrypt (`org.mindrot:jbcrypt:0.4`) | **OUTDATED (Unmaintained)** | Spring Security `BCryptPasswordEncoder` (cost 12) or `Argon2id` | `SCA-008`, `RR-10` |
| **eSign XML Signing** | `revenue` / `XmlSignatureUtil.java` | RSA-SHA256 (`xmldsig-more#rsa-sha256`) | **STRONG (Approved)** | RSA-SHA256 / SHA-384 with PKCS#12 Keystore | `SAST-004`, `SAST-005` |
| **eSign XML Digest** | `revenue` / `XmlSignatureUtil.java` | SHA-256 (`DigestMethod.SHA256`) | **STRONG (Approved)** | SHA-256 Digest | `SAST-004` |
| **eSign PRNG** | `revenue` / `EsignPrimaryController.java` | `java.security.SecureRandom` | **STRONG (Approved)** | `SecureRandom` (NativePRNG / SHA1PRNG) | `SAST-007` |
| **Keystore Format** | `revenue` / `resources/revenue.p12` | PKCS#12 (`KeyStore.getInstance("PKCS12")`) | **STRONG (Industry Standard)**| PKCS#12 with AES-256 keystore protection | `SAST-003`, `RR-04` |
| **X.509 Trust Anchor** | `revenue` / `X509KeySelector.java` | X.509 Path Validation against CDAC CA | **STRONG (Approved)** | Enforce CDAC Root & Intermediate Chain Validation | `SAST-005`, `RR-04` |
| **Ingress Transport** | `api-gateway` / `docker-compose.yml` | Cleartext HTTP/1.1 (`8092`) | **INSECURE (Cleartext Transit)**| TLS 1.3 / TLS 1.2 with Forward Secrecy | `SAST-016`, `BLK-CANON-01` |
| **Internal Transport** | Service-to-service (`lgd-network`) | Cleartext HTTP/1.1 over Docker bridge | **MEDIUM RISK (Unencrypted)** | Mutual TLS (mTLS) or WireGuard overlay | `RR-05` |
| **Database Transport** | Microservice JDBC Datasource URLs | Plaintext TCP (`host.docker.internal:5432`)| **HIGH RISK (Unencrypted DB)** | PostgreSQL TLS (`sslmode=verify-full`) | `RR-05` |
| **Cache Transport** | Microservice Redis Connections | Plaintext TCP (`6379`) | **MEDIUM RISK (Unauthenticated)**| Redis TLS + `AUTH` credential enforcement | `RR-02` |

---

## 2. Secrets & Credential Inventory

The table below enumerates all sensitive configuration items, keys, and credentials across the codebase:

| Secret Identifier | Secret Purpose | Current Storage Mechanism | Associated Environment Variable | Distribution Scope | Exposure Risk | Hardened Target Strategy |
|:---|:---|:---|:---|:---|:---:|:---|
| `SEC-JWT-01` | JWT HMAC Signature Key | `.env.example` / Compose environment | `JWT_SECRET` | Distributed to 4 microservices (`auth`, `gateway`, `um`, `revenue`) | High (Cross-service breach) | Asymmetric Private Key held strictly in `auth-service`; Public Key via JWKS |
| `SEC-DB-01` | PostgreSQL Database Master User | Compose environment / properties | `SPRING_DATASOURCE_USERNAME` | Shared across all 4 Spring microservices | High (Excessive privilege) | Microservice-specific least-privilege DB roles (`lgd_um_app`, `lgd_rev_app`) |
| `SEC-DB-02` | PostgreSQL Database Password | Compose environment / properties | `SPRING_DATASOURCE_PASSWORD` | Shared across all 4 Spring microservices | High (Hardcoded exposure) | HashiCorp Vault dynamic database credentials / Docker Secrets |
| `SEC-ESIGN-01` | eSign PKCS#12 Keystore Password | Compose environment / properties | `ESIGN_KEYSTORE_PASSWORD` | Local to `revenue` microservice | Medium (Process env inspection) | Vault KV v2 secret injection / Docker Secret mount |
| `SEC-EUREKA-01` | Eureka HTTP Basic Auth User | Compose environment / properties | `EUREKA_USERNAME` | Distributed to all 4 microservices | Low (Internal network) | Spring Cloud Config / Vault-managed discovery credentials |
| `SEC-EUREKA-02` | Eureka HTTP Basic Auth Password | Compose environment / properties | `EUREKA_PASSWORD` | Distributed to all 4 microservices | Low (Internal network) | Spring Cloud Config / Vault-managed discovery credentials |
| `SEC-REDIS-01` | Redis Cache Authentication Password | Plain environment / blank | `SPRING_DATA_REDIS_PASSWORD` | Distributed to all microservices | Medium (Unauthenticated access) | Enforce Redis `requirepass` via Vault secret injection |

---

## 3. Cryptographic Storage & Handling Flaw Analysis

1. **Symmetric Key Sharing Across Independent Services (`RR-01`):**
   - The same symmetric HMAC-SHA256 secret (`${JWT_SECRET}`) is injected into `auth-service`, `api-gateway`, `user-management`, and `revenue`.
   - **Compromise Blast Radius:** A remote code execution or file read vulnerability in any single service (e.g. `revenue`) compromises the signing key for the entire Local Government Directory ecosystem, enabling arbitrary administrative token forgery.
2. **Missing JWT Claims Validation Enforcements:**
   - JJWT parsing in downstream services currently validates only signature and expiration (`setSigningKey`, `parseClaimsJws`).
   - `issuer` (`iss`) and `audience` (`aud`) claims are neither asserted during token creation nor validated during parsing.
   - Algorithm allowlisting is not strictly pinned in JJWT parser builder, leaving downstream services susceptible to algorithm confusion if headers are tampered.
3. **Legacy Password Hashing Dependency (`SCA-008`):**
   - `auth-service` utilizes `org.mindrot:jbcrypt:0.4` (published in 2015, unmaintained).
   - Lacks modern memory-hard cryptographic properties (such as Argon2id) and lacks automatic upgrade capabilities supported by Spring Security's `DelegatingPasswordEncoder`.
4. **Transport-Level Secrets in Plaintext:**
   - Container environment variables (`docker-compose.yml`) pass credentials in plain strings visible to `docker inspect` and `/proc/*/environ`.
   - JDBC connections to PostgreSQL and Redis connections over `host.docker.internal` travel without TLS encryption.

