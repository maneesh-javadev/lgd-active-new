# LGD 2.0 — Phase 8.1 Residual Risk Reconciliation Register
## Independent Forensic Reassessment, Compensating Controls Audit & Governance Disposition (RR-01 through RR-11)

| **Risk Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Phase** | Phase 8.1 — Independent Audit Reconciliation & Security Controller Finalization |
| **Document ID** | `LGD2-P8.1-RR-REC` |
| **File Location** | `SECURITY_AUDIT_CONTROLLER/PHASE_8_1_RESIDUAL_RISK_RECONCILIATION.md` |
| **Author / Auditor Role** | Principal Application Security Auditor, Independent Assessment Lead & DevSecOps Auditor |
| **Evaluation Timestamp** | November 6, 2026 (`2026-11-06T10:00:00+05:30`) |
| **Primary Reference Document** | [`PHASE_8_RISK_ACCEPTANCE_MEMORANDUM.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/PHASE_8_RISK_ACCEPTANCE_MEMORANDUM.md) |
| **Governing Blocker** | `BLK-CANON-04` (Release Gate C Executive Authorization) |
| **Reconciled Entities** | 11 Residual Risk Items (`RR-01` through `RR-11`) |

---

## 1. Governance Rules for Residual Risk Disposition

In accordance with Section 8 of the Phase 8.1 Execution Directive:
1. **No Premature Acceptance:** `RR-04` must **NOT** be marked as `ACCEPTED` without verifiable, counter-signed DAA/CISO approval evidence.
2. **No Unsubstantiated Transfer:** `RR-07` must **NOT** be marked as `TRANSFERRED` without signed Service Level Agreements (SLAs) or memoranda of understanding with upstream perimeter providers.
3. **No Premature Closure:** Partially mitigated risks must remain explicitly cataloged as `PARTIALLY_MITIGATED` or `PROPOSED_ACCEPTANCE`.
4. **Roadmap Separation:** A planned remediation item scheduled for a future phase (e.g., Phase 9 or Phase 10) does **not** constitute current remediation.
5. **Universal Gate C Boundary:** Because the DAA and CISO signature block on `PHASE_8_RISK_ACCEPTANCE_MEMORANDUM.md` is unsigned, all eleven residual risks are formally governed as **`PENDING_FORMAL_ACCEPTANCE`**.

---

## 2. Itemized Forensic Reassessment of Residual Risks (RR-01 through RR-11)

### RR-01: Asymmetric RS256 / JWKS Architecture Migration
- **Technical Condition:** Historical vulnerability `SAST-001` / `CRYPTO-001` involved a hardcoded symmetric HMAC-SHA256 secret (`jwt.secret`) distributed across four microservices.
- **Current Mitigation:** Asymmetric RSA-2048 signing implemented in `auth-service` via `RsaKeyProvider.java`. Public JWKS endpoint exposed at `/.well-known/jwks.json`. Downstream services (`api-gateway`, `user-management`, `revenue`) verify signatures using cached public keys via `JwksPublicKeyResolver.java`. Legacy HS256 tokens disabled by default in production (`jwt.legacy-hs256-enabled=false`).
- **Residual Exposure:** Low. Dual-verification capability exists in source code during transition window if explicitly toggled on in non-prod.
- **Planned Remediation:** Completely purge legacy HS256 verification code and dependencies after transition window closes.
- **Target Phase:** Phase 10 (Consolidated Remediation).
- **Formal Owner:** Lead Security Architect.
- **Verification Evidence:** `EVD_P8_01_AUTH_SERVICE_TEST_EXECUTION.txt` (`JwksControllerTest`, `JwtHardeningRegressionTest` PASS).
- **Acceptance Status:** **`PROPOSED_ACCEPTANCE / PENDING_FORMAL_ACCEPTANCE`** (Code verified; executive sign-off pending).

---

### RR-02: Single-Point-of-Failure / Availability on Redis Outage
- **Technical Condition:** The API Gateway enforces real-time JWT revocation by checking token JTI identifiers against a Redis cache.
- **Current Mitigation:** Redis container secured with `requirepass ${SPRING_DATA_REDIS_PASSWORD}` and bound to loopback `127.0.0.1:6379`. Gateway implements strict fail-closed behavior (`HTTP 503 Service Unavailable`) on Redis timeout or outage, preventing unauthenticated access bypass.
- **Residual Exposure:** Moderate. An outage or crash of the single Redis node causes the API Gateway to drop all authenticated incoming traffic, inducing a denial-of-service condition.
- **Planned Remediation:** Deploy a multi-node Redis Sentinel or Redis Cluster high-availability architecture with automatic master failover.
- **Target Phase:** Phase 9 (Infrastructure Security & Resilience Hardening).
- **Formal Owner:** Lead DevOps Engineer & Infrastructure Architect.
- **Verification Evidence:** `AuthenticationFilterTest.java` (fail-closed verified); `docker-compose.yml` (`requirepass` verified).
- **Acceptance Status:** **`PROPOSED_ACCEPTANCE / PENDING_FORMAL_ACCEPTANCE`** (Compensating control active; HA queued for Phase 9).

---

### RR-03: Client-Side Token Storage Exposure in Web Browser
- **Technical Condition:** The frontend single-page application stores JWT bearer tokens in client-side storage (`localStorage` / session storage).
- **Current Mitigation:** Gateway enforces strict response headers: `Content-Security-Policy: default-src 'self'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`. Token lifetime is capped at 15 minutes, and Redis blacklisting tracks revoked tokens.
- **Residual Exposure:** Moderate. In the event of a Cross-Site Scripting (XSS) vulnerability, script execution could extract tokens from `localStorage`.
- **Planned Remediation:** Migrate React client authentication to use `HttpOnly; SameSite=Strict; Secure` session cookies with Double-Submit CSRF cookie protection.
- **Target Phase:** Phase 10 (Consolidated Remediation & Defensive Diffs).
- **Formal Owner:** Lead Frontend Architect.
- **Verification Evidence:** `EVD_P8_02_API_GATEWAY_TEST_EXECUTION.txt` (`SecurityHeadersFilterTest` PASS); `application-prod.properties` (15m expiry).
- **Acceptance Status:** **`PROPOSED_ACCEPTANCE / PENDING_FORMAL_ACCEPTANCE`** (Compensating controls active; cookie refactoring roadmapped).

---

### RR-04: Third-Party CA Certificate Lifecycle & e-Hastakshar Dependencies
- **Technical Condition:** e-Hastakshar digital signature validation depends on CDAC root and intermediate Certificate Authority (CA) certificates.
- **Current Mitigation:** `XmlSignatureUtil.java` enforces Apache XMLDSig secure validation, root anchor chaining, certificate temporal validity checks (`cert.checkValidity()`), and SHA-256 digest matching against incoming CDAC callbacks.
- **Residual Exposure:** Low to Moderate. Expiration of CDAC intermediate/root CA certificates or failure to obtain updated CRL/OCSP updates would cause eSign callback failures.
- **Planned Remediation:** Implement automated 60-day certificate expiration telemetry alerts and dynamic OCSP stapling monitoring.
- **Target Phase:** Phase 9 (Infrastructure Resilience).
- **Formal Owner:** Revenue Application Security Lead.
- **Verification Evidence:** `EVD_P8_04_REVENUE_TEST_EXECUTION.txt` (`EsignCallbackSecurityTest`, `XmlSignatureSecurityTest` PASS).
- **Acceptance Status:** **`PROPOSED_ACCEPTANCE / PENDING_FORMAL_ACCEPTANCE`** *(Reconciled: Previously mislabeled as "ACCEPTED & MONITORED"; corrected because formal DAA/CISO sign-off is pending)*.

---

### RR-05: Internal Plaintext Database and Cache Transit
- **Technical Condition:** Microservices communicate with PostgreSQL on TCP 5432 and Redis on TCP 6379 without transport layer encryption (TLS).
- **Current Mitigation:** Database host port 5432 is unmapped from the host in `docker-compose.yml`. Database and Redis traffic is strictly constrained to the internal private Docker bridge network (`lgd-network`). Loopback binding prevents external network interface access.
- **Residual Exposure:** Moderate. Compromise of a container or access to the Docker host allows packet sniffing on the virtual bridge interface.
- **Planned Remediation:** Configure PostgreSQL native TLS (`sslmode=verify-full`) on HikariCP connection pools, and enable TLS on Redis server and Lettuce client.
- **Target Phase:** Phase 9 (Infrastructure Security & Resilience Hardening).
- **Formal Owner:** Lead Infrastructure Architect & Database Administrator.
- **Verification Evidence:** `docker-compose.yml` (zero external 5432 port mapping verified); `application-prod.properties` inspection (`EVD_P8_09`).
- **Acceptance Status:** **`PROPOSED_ACCEPTANCE / PENDING_FORMAL_ACCEPTANCE`** (Compensating isolation active; TLS queued for Phase 9).

---

### RR-06: Container Execution Context & Root Privilege
- **Technical Condition:** Microservice Dockerfiles currently build container images without specifying an unprivileged user, causing container processes to run as `root` (UID 0).
- **Current Mitigation:** Containers are executed without `--privileged` flags; host capabilities are dropped; database port is unmapped; containers run on an isolated bridge network.
- **Residual Exposure:** Moderate. In the event of a container escape vulnerability (CWE-250), an attacker gains root privileges on the container engine.
- **Planned Remediation:** Rebuild all microservice Dockerfiles with dedicated non-root service accounts (`USER spring:spring`, UID `10001:10001`) and read-only root filesystems.
- **Target Phase:** Phase 9 (Infrastructure, Container & Network Hardening).
- **Formal Owner:** DevSecOps Lead.
- **Verification Evidence:** `Dockerfile` inspection across all services; `docker-compose.yml` inspection.
- **Acceptance Status:** **`DEFERRED / PENDING_FORMAL_ACCEPTANCE`** (Formally scheduled for Phase 9 container rebuild).

---

### RR-07: Distributed Edge Denial of Service (DDoS)
- **Technical Condition:** The API Gateway is the central entry point; large distributed traffic floods could overwhelm perimeter resources.
- **Current Mitigation:** Spring Cloud Gateway enforces a 16 KB response streaming buffer ceiling (`EXP-015`), and Redis-backed token-bucket rate limiting restricts authentication endpoints to 10 requests/min per IP.
- **Residual Exposure:** High. Layer 3/4 volumetric DDoS attacks or distributed botnets cannot be scrubbed by the gateway application layer alone.
- **Planned Remediation:** Deploy upstream edge protection via National Informatics Centre (NIC) Cloud WAF, Cloudflare Magic Transit, or dedicated DDoS scrubbing centers.
- **Target Phase:** Phase 9/10 (Perimeter Resilience).
- **Formal Owner:** Lead Perimeter Security Engineer & NIC Cloud Operations.
- **Verification Evidence:** `RouteValidatorTest.java`, `ApiLoggingFilterTest.java` (PASS).
- **Acceptance Status:** **`PROPOSED_TRANSFER / PENDING_FORMAL_ACCEPTANCE`** *(Reconciled: Previously mislabeled as "TRANSFERRED"; corrected because formal operational transfer agreement with cloud provider is pending executive approval)*.

---

### RR-08: Outbound Spreadsheet Export via SheetJS (`xlsx`)
- **Technical Condition:** Dependency `xlsx@0.18.5` in legacy frontend is subject to prototype pollution (CVE-2023-30533) and regular expression DoS (CVE-2024-22363).
- **Current Mitigation:** Detailed source code AST inspection confirms that `xlsx` is invoked **strictly for outbound file generation** (`XLSX.write()` / `XLSX.writeFile()`). The application never parses, reads, or deserializes untrusted user-uploaded spreadsheet files.
- **Residual Exposure:** Low. Vulnerability scanners (Trivy, npm audit) continue to flag the package, but runtime exploitability is neutralized by restricted usage.
- **Planned Remediation:** Migrate spreadsheet export routines from SheetJS to modern, actively maintained `exceljs` library.
- **Target Phase:** Phase 10 (Consolidated Remediation).
- **Formal Owner:** Lead Frontend Architect.
- **Verification Evidence:** AST code review of frontend modules; `PHASE4_SCA_INDEPENDENT_VERIFICATION_REPORT.md`.
- **Acceptance Status:** **`PROPOSED_ACCEPTANCE / PENDING_FORMAL_ACCEPTANCE`** (Compensating control verified; library migration roadmapped).

---

### RR-09: Zod Form Validation Schema Alignment
- **Technical Condition:** Dependency `zod@3.25.76` has an open advisory (GHSA-mrhx-c7xc-m3w5) regarding memory exhaustion on recursive, unbounded collections.
- **Current Mitigation:** Client-side Zod schemas validate shallow modal form fields (names, codes, phone numbers), not recursive objects. Strict server-side Bean Validation (`@Valid`, `@NotNull`, `@Size`, `@Pattern`) in Spring Boot controllers enforces authoritative data integrity.
- **Residual Exposure:** Low. Frontend presentation hints do not affect backend security posture.
- **Planned Remediation:** Refactor frontend form schemas to Zod 4.x or modern validation standard.
- **Target Phase:** Phase 10 (Consolidated Remediation).
- **Formal Owner:** Lead Frontend Architect.
- **Verification Evidence:** Backend controller unit tests (`UserControllerTest`, `AuthPrimaryControllerTest` PASS).
- **Acceptance Status:** **`PROPOSED_ACCEPTANCE / PENDING_FORMAL_ACCEPTANCE`** (Compensating control verified; schema refactor roadmapped).

---

### RR-10: Legacy Cryptographic jBCrypt Dependency & Progressive Hashing
- **Technical Condition:** Insecure legacy library `org.mindrot:jbcrypt:0.4` (unmaintained since 2015, CWE-1104) and weak work factor 10.
- **Current Mitigation:** `jbcrypt` completely purged from `auth-service/pom.xml`. Spring Security `BCryptPasswordEncoder(12)` actively enforced with empirical verification latency of ~211 ms. In `AuthServiceImpl.java`, progressive password hash upgrades trigger automatically on successful authentication (`passwordEncoder.upgradeEncoding(storedHash)`).
- **Residual Exposure:** Low. Inactive or dormant user accounts retain legacy hashes until their next interactive login.
- **Planned Remediation:** Issue administrative password reset directives for dormant accounts exceeding 180 days without authentication.
- **Target Phase:** Phase 10 (Operational Governance).
- **Formal Owner:** Auth Service Application Security Lead.
- **Verification Evidence:** `EVD_P8_08_BCRYPT_COST12_BENCHMARK.txt`; `AuthServiceImplTest.java` (PASS).
- **Acceptance Status:** **`PROPOSED_ACCEPTANCE / PENDING_FORMAL_ACCEPTANCE`** (Technical remediation verified in code and benchmark; formal governance sign-off requested).

---

### RR-11: Community EOL Lifecycle for Spring Boot 3.2.x Baseline
- **Technical Condition:** Spring Boot 3.2.x community OSS support has ended, creating potential exposure to unpatched framework-level vulnerabilities.
- **Current Mitigation:** Critical transitive sub-dependencies have been explicitly pinned to patched, supported versions in microservice POMs: Tomcat Embed Core `10.1.34` (CVE-2024-50379), Spring Security `6.3.8` (CVE-2024-38821), PostgreSQL JDBC `42.7.3` (CVE-2024-1597), Netty `4.1.115.Final` (CVE-2024-47535).
- **Residual Exposure:** Moderate. Non-critical transitive advisories (`SCA-004` Spring Web CVE-2024-38816, `SCA-007` Logback CVE-2024-12798) remain mitigated via input sanitization and disabled socket appenders.
- **Planned Remediation:** Upgrade all core platform microservices to Spring Boot 3.4.x LTS baseline.
- **Target Phase:** Phase 10 (Platform Modernization Sprint).
- **Formal Owner:** Enterprise Architecture Directorate.
- **Verification Evidence:** Microservice root `pom.xml` dependency declarations; `EVD_P8_09_SECRETS_CONFIG_INSPECTION.txt`.
- **Acceptance Status:** **`PROPOSED_ACCEPTANCE / PENDING_FORMAL_ACCEPTANCE`** (Compensating dependency overrides active; LTS upgrade roadmapped).

---

## 3. Residual Risk Summary & Action Dashboard

$$\begin{array}{|l|l|c|c|l|l|}
\hline
\textbf{Risk ID} & \textbf{Title} & \textbf{Severity} & \textbf{Target Phase} & \textbf{Reconciled Status} & \textbf{Gate C Clearance Prerequisite} \\
\hline
\text{RR-01} & \text{RS256/JWKS Migration} & \text{CRITICAL} & \text{Phase 10} & \text{PROPOSED\_ACCEPTANCE} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-02} & \text{Redis Sentinel HA} & \text{HIGH} & \text{Phase 9} & \text{PROPOSED\_ACCEPTANCE} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-03} & \text{Client HttpOnly Cookies} & \text{HIGH} & \text{Phase 10} & \text{PROPOSED\_ACCEPTANCE} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-04} & \text{Third-Party CA Lifecycle} & \text{HIGH} & \text{Phase 9} & \text{PROPOSED\_ACCEPTANCE} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-05} & \text{Internal DB/Redis TLS} & \text{MEDIUM} & \text{Phase 9} & \text{PROPOSED\_ACCEPTANCE} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-06} & \text{Non-Root Containers} & \text{MEDIUM} & \text{Phase 9} & \text{DEFERRED} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-07} & \text{Edge DDoS Protection} & \text{HIGH} & \text{Phase 9/10} & \text{PROPOSED\_TRANSFER} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-08} & \text{ExcelJS Migration} & \text{HIGH} & \text{Phase 10} & \text{PROPOSED\_ACCEPTANCE} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-09} & \text{Zod Modernization} & \text{MEDIUM} & \text{Phase 10} & \text{PROPOSED\_ACCEPTANCE} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-10} & \text{BCrypt Modernization} & \text{MEDIUM} & \text{Phase 10} & \text{PROPOSED\_ACCEPTANCE} & \text{DAA / CISO Signature on Section 4} \\
\text{RR-11} & \text{Spring Boot 3.2.x EOL} & \text{HIGH} & \text{Phase 10} & \text{PROPOSED\_ACCEPTANCE} & \text{DAA / CISO Signature on Section 4} \\
\hline
\end{array}$$

---
*Register certified independently by the Principal Application Security Auditor.*

