# LGD 2.0 — Security Residual Risk Register
## Residual Risk Analysis & Operational Safeguards Post-Phase 1–4 Assessment

| **Document Information** | |
|---|---|
| **Document Version** | 2.1.0 (Phase 4 Final Independent Review Corrections) |
| **Audited Scope** | LGD 2.0 Platform (Backend Services, Data Layer, Infrastructure, Frontend, Integrations) |
| **Reviewer Role** | Senior Application Security Reviewer & Enterprise Risk Lead |
| **Date** | October 30, 2026 |
| **Document Status** | **FORMAL RESIDUAL RISK REGISTER — PENDING FORMAL EXECUTIVE ACCEPTANCE** |

---

## 1. Governance & Risk Framework

In accordance with NIST SP 800-30 Rev. 1 (*Guide for Conducting Risk Assessments*), ISO/IEC 27005, and OWASP Enterprise Security Guidelines, this **Residual Risk Register** documents the remaining risk exposure across the Local Government Directory 2.0 (LGD 2.0) platform following the completion of Phase 0–4 security assessments.

### Strict Risk Governance Principles:
1. **Non-Zero Risk Acknowledgement:** An accepted residual risk is never described as zero risk. Inherent architectural and operational exposures remain even after technical fixes are deployed.
2. **Distinction Between Implemented Controls vs. Future Improvements:** Implemented technical controls are strictly distinguished from future planned improvements. Future roadmap items (e.g. Asymmetric RS256 migration, Redis Enterprise cluster, WAF edge proxy) are explicitly documented as compensating controls or planned phase enhancements, not claimable as already completed controls.
3. **Mandatory Field Structure:** Every residual risk record (`RR-01` through `RR-11`) explicitly defines:
   - **Inherent Risk & Severity**
   - **Existing Implemented Controls**
   - **Remaining Exposure**
   - **Compensating Controls**
   - **Risk Owner**
   - **Approving Authority Role**
   - **Actual Approval Status** (`PENDING_FORMAL_ACCEPTANCE` until formal DAA/CISO signature)
   - **Approval Date & Reference**
   - **Acceptance Scope**
   - **Expiry / Next Review Date**
   - **Planned Remediation Phase** (Mapped to approved 14-phase roadmap)
4. **Independent Audit Integrity:** A role listed as an approval authority is not evidence of approval. In the absence of an executed, signed authorization memo from the Designated Approving Authority (DAA) or Chief Information Security Officer (CISO), all residual risks are maintained in status **`PENDING_FORMAL_ACCEPTANCE`**.

---

## 2. Detailed Residual Risk Records (RR-01 through RR-11)

---

### RR-01: Shared Symmetric HMAC Key Distribution
- **Inherent Risk:** Critical (Static HMAC-SHA256 secret shared across services).
- **Existing Control:** Externalized `jwt.secret` to mandatory `${JWT_SECRET}` environment variable with minimum 256-bit entropy check on startup (`ProductionSecurityValidator.java`). Static secret constants removed from repository.
- **Remaining Exposure:** HS256 is a symmetric signing algorithm. The identical secret key is shared across `api-gateway`, `auth-service`, `user-management`, and `revenue`. If an attacker or compromised internal service extracts the symmetric key from any single container's memory or environment, valid tokens can be forged across the entire cluster.
- **Compensating Control:**
  - Restrict container environment variable visibility and file system permissions.
  - Inject secrets at runtime via secure orchestration or enterprise vault (HashiCorp Vault / AWS Secrets Manager) rather than static files.
  - Enforce automated secret rotation schedule per `SECURITY_SECRETS_ROTATION_PLAN.md`.
- **Risk Owner:** Application Security Lead & DevOps Engineering Lead
- **Approving Authority Role:** Designated Approving Authority (DAA) / Chief Information Security Officer (CISO)
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** LGD 2.0 Pre-Production Staging Deployment; valid pending Phase 5 & 7 execution
- **Expiry / Review Date:** 90 Days from baseline (January 28, 2027) or Phase 5 Gate Review
- **Planned Remediation Phase:** Phase 5 (Authentication & Session Security Audit) & Phase 7 (Cryptography & Secrets Management Hardening) — Migrate to asymmetric RSA (RS256) or Ed25519 signing where only `auth-service` holds private key.

---

### RR-02: Single-Point-of-Failure / Availability Risk on Redis Outage
- **Inherent Risk:** High (Token revocation bypass during Redis cache outage).
- **Existing Control:** Implemented strict fail-closed policy in API Gateway (`AuthenticationFilter.java`): if Redis is unreachable or connection drops, Gateway rejects requests with `HTTP 503 Service Unavailable` (`"Revocation service unavailable"`).
- **Remaining Exposure:** While fail-closed behavior guarantees that revoked tokens cannot bypass perimeter revocation checks, an unplanned Redis node crash, network partition, or performance degradation will cause complete denial of service (DoS) for all authenticated users across LGD 2.0.
- **Compensating Control:**
  - Deploy Redis in High-Availability (HA) topology using Redis Sentinel or Redis Enterprise multi-node cluster with automatic failover.
  - Enable Append-Only File (AOF) with `everysec` fsync and RDB snapshots to prevent blacklist state loss on restart.
  - Configure active healthcheck monitoring and automated alerting on Redis latency > 50ms.
- **Risk Owner:** Lead Infrastructure Engineer & Database Administrator
- **Approving Authority Role:** Infrastructure Steering Committee / Chief Information Security Officer (CISO)
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** Single-node Redis staging architecture pending HA cluster provisioning
- **Expiry / Review Date:** 90 Days from baseline (January 28, 2027) or Phase 9 Gate Review
- **Planned Remediation Phase:** Phase 9 (Infrastructure, Container & Network Hardening) & Phase 12 (Comprehensive Audit Deliverables Finalization)

---

### RR-03: Client-Side Token Storage Vulnerability to Browser Exploitation
- **Inherent Risk:** High (XSS credential harvesting of officer tokens).
- **Existing Control:** Strict `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` headers injected at API Gateway. Frontend form inputs sanitized.
- **Remaining Exposure:** The current single-page frontend application (`lgd_react` / `lgd-um`) stores JWT tokens in browser storage (`localStorage` / `sessionStorage`). Any zero-day client-side script execution, malicious third-party dependency (supply chain flaw), or browser extension compromise can access and exfiltrate the stored bearer token.
- **Compensating Control:**
  - Strict Content-Security-Policy (`default-src 'self'`) restricts unauthorized script execution and outbound exfiltration endpoints.
  - Enforce short token lifespans (15-minute expiration) with automated refresh tokens.
  - Implement Web Application Firewall (WAF) inspecting for client-side script injection patterns.
- **Risk Owner:** Frontend Architecture Lead & UI Security Engineer
- **Approving Authority Role:** Application Security Architecture Board / CISO
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** LGD 2.0 Web Client Interface (`lgd_react` and `lgd-um`)
- **Expiry / Review Date:** Phase 5 Gate Review (Authentication & Session Security Audit)
- **Planned Remediation Phase:** Phase 5 (Authentication & Session Security Audit) — Migrate session tokens to `HttpOnly; SameSite=Strict; Secure` cookies with CSRF Double-Submit protection.

---

### RR-04: Third-Party Certificate Authority Lifecycle & Upstream eSign Dependencies
- **Inherent Risk:** Critical (Forged XMLDSig callbacks & fake gazette order signing).
- **Existing Control:** Enforced `secureValidation = TRUE`, CDAC trust anchor certificate validation, X.509 validity period check, `digitalSignature` keyUsage (bit 0) enforcement, PDF SHA-256 hash match, and Redis distributed atomic replay lock.
- **Remaining Exposure:** The e-Hastakshar verification engine relies on external trust anchor certificates issued by CDAC / Controller of Certifying Authorities (CCA). If upstream root certificates expire, undergo unannounced key rollover, or CRL/OCSP endpoints experience network partition, valid gazette publication workflows will fail.
- **Compensating Control:**
  - Automated certificate lifecycle monitoring tool alerting 60 and 30 days prior to CDAC trust anchor expiration.
  - Pre-production staging environment to validate upcoming CDAC certificate updates prior to production rollout.
  - Dedicated administrative fallback procedure for gazette order signing under formal legal emergency declaration.
- **Risk Owner:** Lead Integration Architect & e-Governance Compliance Lead
- **Approving Authority Role:** Ministry Designated Approving Authority (DAA) / Project Director
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** Gazette publication and digital order signing workflows
- **Expiry / Review Date:** Phase 8 Gate Review (Business Logic & eSign Workflow Security)
- **Planned Remediation Phase:** Phase 8 (Business Logic & eSign Workflow Security)

---

### RR-05: Unencrypted Internal Database & Cache Network Transit
- **Inherent Risk:** Medium (Sniffing or tampering with database queries and cache payloads).
- **Existing Control:** Internal backend microservice ports (8761, 18090, 18089, 18062) are unmapped from the host, strictly isolated on Docker network `lgd-network`. Host OS firewall and network boundaries restrict unauthorized external access to host ports 5432 and 6379.
- **Remaining Exposure:** PostgreSQL 14 runs natively on the Host OS (`0.0.0.0:5432` / `[::]:5432`, Windows PID 16496), and containerized microservices connect across the bridge gateway via `host.docker.internal:5432`. Redis runs in a Docker container (`redis:alpine`, `03b849547c5f`) with port 6379 published to host interface `0.0.0.0:6379`. Neither PostgreSQL nor Redis traffic is encrypted; database transactions (JDBC over TCP) and Redis cache operations (RESP over TCP) traverse unencrypted plaintext TCP sockets without TLS/SSL encryption (`sslmode=require` not configured; Redis TLS disabled). Any process with network sniffing or host administrative privileges can inspect raw SQL queries, citizen records, and token revocation blacklists in transit.
- **Compensating Control:**
  - Restrict host OS administrative access strictly to authorized administrators using hardened SSH/RDP credentials with MFA.
  - Windows host firewall and network security group policies blocking untrusted external access to ports 5432 and 6379.
  - Container-to-host bridge routing isolated from public internet routing tables.
- **Risk Owner:** DevSecOps Lead & Database Administrator
- **Approving Authority Role:** Security Operations Board / CISO
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** Local and staging container-to-host network transit (PostgreSQL on host, Redis container published to host)
- **Expiry / Review Date:** Phase 9 Gate Review (Infrastructure, Container & Network Hardening)
- **Planned Remediation Phase:** Phase 9 (Infrastructure, Container & Network Hardening) — Enforce TLS transport encryption (`sslmode=require` / `sslmode=verify-full`) on JDBC connections and Redis TLS / Stunnel encryption.

---

### RR-06: Container Execution Context & Non-Root Privilege Hardening
- **Inherent Risk:** Medium (Container breakout or privilege escalation).
- **Existing Control:** Internal microservice ports are removed from public host publishing; internal services are isolated on `lgd-network`.
- **Remaining Exposure:** Default base container images run the Java application process as `root` (UID 0) within the container namespace. In the event of a remote code execution vulnerability (e.g. deserialization or native library flaw), container isolation could be breached if Linux kernel vulnerabilities exist.
- **Compensating Control:**
  - Run containers with Docker security options: `--security-opt no-new-privileges:true`.
  - Drop unnecessary Linux capabilities: `cap_drop: [ALL]`, `cap_add: [NET_BIND_SERVICE]`.
  - Enforce read-only root filesystems with ephemeral `/tmp` volumes in production staging.
- **Risk Owner:** DevSecOps Engineer & Container Infrastructure Lead
- **Approving Authority Role:** DevSecOps Steering Group / CISO
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** Base container images (`eclipse-temurin:21-jdk`) for all 5 backend microservices
- **Expiry / Review Date:** Phase 9 Gate Review (Infrastructure, Container & Network Hardening)
- **Planned Remediation Phase:** Phase 9 (Infrastructure, Container & Network Hardening) — Rebuild Dockerfiles with dedicated unprivileged user (`USER spring:spring`, non-root UID 10001).

---

### RR-07: Distributed Edge Denial of Service (DDoS) Mitigation
- **Inherent Risk:** Medium (Perimeter flooding and volumetric request exhaustion).
- **Existing Control:** API Gateway route validation, memory buffering ceiling (64KB), uniform error messaging, and application-level Redis token-bucket rate limiting on public authentication routes.
- **Remaining Exposure:** Application-level rate limiting executing in Spring Cloud Gateway cannot absorb large-scale volumetric Distributed Denial of Service (DDoS) attacks (e.g. SYN floods, HTTP flood exceeding gateway network interface capacity). Large attack volumes will exhaust gateway CPU and socket descriptors before application filters execute.
- **Compensating Control:**
  - Front public edge with Enterprise Web Application Firewall (WAF) / Content Delivery Network (NIC National Cloud WAF / Cloudflare Enterprise).
  - Implement upstream volumetric rate limiting, SYN flood protection, and GeoIP filtering at the edge routing layer.
  - Configure upstream reverse proxy (Nginx / HAProxy) with connection pooling and request burst limits.
- **Risk Owner:** Network Operations Lead & Security Operations Center (SOC) Lead
- **Approving Authority Role:** National Informatics Centre (NIC) Network Security Authority / CISO
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** Perimeter API Gateway ingress interface
- **Expiry / Review Date:** Phase 9 & Phase 10 Gate Review
- **Planned Remediation Phase:** Phase 9 (Infrastructure, Container & Network Hardening) & Phase 10 (Remediation Implementation & Defensive Diffs)

---

### RR-08: Outbound Spreadsheet Generation & SheetJS (xlsx) Upstream CDN Transition
- **Inherent Risk:** High (Prototype Pollution CVE-2023-30533, ReDoS CVE-2024-22363 in SheetJS < 0.20.2).
- **Existing Control:** Static code analysis verified that `xlsx` is only invoked in `NodalInfoCards.tsx` and `DepartmentAvailabilityModal.tsx` for creating downloadable `.xlsx` files via `XLSX.write()`. It does not parse or ingest user-supplied files via `XLSX.read()`.
- **Remaining Exposure:** The library version locked in `package.json` (`0.18.5`) is flagged on automated scanner dashboards as vulnerable, creating external compliance inquiries. Upstream SheetJS ceased publishing updates to public npm at 0.18.5, requiring custom CDN repository configuration to upgrade.
- **Compensating Control:**
  - Content-Security-Policy disallows untrusted script execution.
  - Client-side validation guarantees only internal JSON data is formatted for export.
  - Zero server-side spreadsheet parsing executed in backend microservices.
- **Risk Owner:** Frontend Architecture Lead & UI Security Engineer
- **Approving Authority Role:** Application Security Board / CISO
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** Client-side spreadsheet export components (`NodalInfoCards.tsx`, `DepartmentAvailabilityModal.tsx`)
- **Expiry / Review Date:** Phase 10 Gate Review (Remediation Implementation & Defensive Diffs)
- **Planned Remediation Phase:** Phase 10 (Remediation Implementation & Defensive Diffs) / Frontend Maintenance Sprint — Transition export utility to `exceljs` library.

---

### RR-09: Zod Major Version Upgrade & Form Validation Schema Alignment
- **Inherent Risk:** High (Memory exhaustion on oversized constrained collections GHSA-mrhx-c7xc-m3w5).
- **Existing Control:** Zod 3.25.76 is used strictly for shallow modal form field validation in `districtSchema.ts` (state code, district name, headquarter). It does not validate unbounded collections, streaming arrays, or arbitrary JSON payloads.
- **Remaining Exposure:** Upgrading to Zod 4.x breaks backward compatibility with `@hookform/resolvers@^5.9.1` and requires schema refactoring across form validation components.
- **Compensating Control:**
  - Backend `@Valid` bean validation and controller schema constraints reject malformed or oversized payloads server-side regardless of client validation.
  - Form input lengths are bounded by HTML DOM `maxlength` attributes.
- **Risk Owner:** Frontend Lead Developer & QA Lead
- **Approving Authority Role:** Application Security Architecture Board / CISO
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** `lgd_react` district management forms
- **Expiry / Review Date:** Phase 10 Gate Review (Remediation Implementation & Defensive Diffs)
- **Planned Remediation Phase:** Phase 10 (Remediation Implementation & Defensive Diffs) / Frontend Modernization Sprint

---

### RR-10: Legacy Cryptographic Migration from jBCrypt to Spring Security Crypto
- **Inherent Risk:** Medium (Use of unmaintained third-party library `jbcrypt:0.4` released in 2015, CWE-1104).
- **Existing Control:** `jbcrypt:0.4` currently performs BCrypt hashing and verification using `SecureRandom` salt generation in `AuthServiceImpl` and `UserServiceImpl`. Salt entropy and round parameters meet standard work factor requirements.
- **Remaining Exposure:** The upstream project has had zero security maintenance or updates since 2015.
- **Compensating Control:**
  - Salt generation is validated using cryptographically strong PRNG.
  - Authentication routes are rate-limited via API Gateway Redis token bucket.
  - Hash values are stored securely in PostgreSQL with column masking in application logs.
- **Risk Owner:** Java Security Architect & Lead Backend Engineer
- **Approving Authority Role:** Chief Information Security Officer (CISO)
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** Password hashing in `auth-service` and `user-management`
- **Expiry / Review Date:** Phase 5 Gate Review (Authentication & Session Security Audit)
- **Planned Remediation Phase:** Phase 5 (Authentication & Session Security Audit) & Phase 7 (Cryptography & Secrets Management Hardening) — Refactor user password hashing to native `org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder`.

---

### RR-11: Community EOL Lifecycle Monitoring for Spring Boot 3.2.x Baseline
- **Inherent Risk:** Medium (Spring Boot 3.2.x OSS Community support ended in November 2024).
- **Existing Control:** `revenue` was harmonized to `3.2.12` (aligning with `auth-service` and `user-management`). Embedded Tomcat was explicitly pinned to `10.1.34` (mitigating CVE-2024-50379 / CVE-2024-56337 RCE), Spring Security pinned to `6.3.8`, and PostgreSQL JDBC upgraded to `42.6.2` (mitigating CVE-2024-1597 SQLi).
- **Remaining Exposure:** While all known critical and high vulnerabilities in active dependency paths have been patched, future zero-day vulnerabilities in Spring Boot 3.2.x will not receive public open-source patches.
- **Compensating Control:**
  - Explicit version overrides in Maven properties (e.g., `<tomcat.version>`, `<spring-security.version>`) permit granular dependency patching without full framework upgrades.
  - Continuous vulnerability monitoring against GitHub Advisory and NVD databases.
  - Network isolation on `lgd-network` prevents direct unauthorized ingress to backend microservices.
- **Risk Owner:** DevSecOps Lead & Enterprise Platform Architect
- **Approving Authority Role:** Designated Approving Authority (DAA) / CISO
- **Actual Approval Status:** **`PENDING_FORMAL_ACCEPTANCE`**
- **Approval Date & Reference:** Pending Formal Sign-off (No executed DAA authorization memo on file)
- **Acceptance Scope:** Core microservices baseline (`auth-service`, `revenue`, `user-management`)
- **Expiry / Review Date:** 90 Days from baseline (January 28, 2027) or Phase 10 Gate Review
- **Planned Remediation Phase:** Phase 10 (Remediation Implementation & Defensive Diffs) & Phase 13 (DevSecOps CI/CD Integration & Roadmap Sign-Off) — Plan multi-module framework upgrade to Spring Boot 3.4.x LTS baseline across all services.

---

## 3. Residual Risk Summary Register

| Risk ID | Title | Inherent Severity | Residual Severity | Risk Owner | Approving Authority Role | Approval Reference & Date | Acceptance Scope | Expiry / Review Date | Formal Status |
|:---:|:---|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| **RR-01** | Symmetric Key Exposure | **Critical** | **Low** | AppSec Lead & DevOps Lead | DAA / CISO | Pending Formal Sign-off | Staging deployment | Jan 28, 2027 / Phase 5 | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-02** | Redis Fail-Closed Availability | **High** | **Low** | Lead Infra & DBA | Infra Steering / CISO | Pending Formal Sign-off | Single-node Redis | Jan 28, 2027 / Phase 9 | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-03** | Browser Token Storage | **High** | **Low** | Frontend Lead & UI Sec | AppSec Board / CISO | Pending Formal Sign-off | Web Client Interface | Phase 5 Gate | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-04** | Third-Party eSign Dependency | **Critical** | **Low** | Integration Architect | Project Director / DAA | Pending Formal Sign-off | Gazette signing flow | Phase 8 Gate | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-05** | Unencrypted Database Transit | **Medium** | **Low** | DevSecOps Lead & DBA | SecOps Board / CISO | Pending Formal Sign-off | Host-to-container TCP | Phase 9 Gate | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-06** | Container Root Execution | **Medium** | **Low** | DevSecOps & Container Lead | DevSecOps Group / CISO | Pending Formal Sign-off | Base Docker images | Phase 9 Gate | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-07** | Volumetric DDoS Vulnerability | **Medium** | **Low** | NetOps & SOC Lead | NIC Network Authority | Pending Formal Sign-off | Gateway edge ingress | Phase 9/10 Gate | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-08** | SheetJS Outbound Export & CDN | **High** | **Low** | Frontend Lead & UI Sec | AppSec Board / CISO | Pending Formal Sign-off | Client Excel export | Phase 10 Gate | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-09** | Zod Form Validation Baseline | **High** | **Low** | Frontend Lead & QA Lead | AppSec Board / CISO | Pending Formal Sign-off | District forms | Phase 10 Gate | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-10** | Legacy jBCrypt Component | **Medium** | **Low** | Java Sec & Backend Lead | CISO | Pending Formal Sign-off | Password hashing | Phase 5 Gate | **`PENDING_FORMAL_ACCEPTANCE`** |
| **RR-11** | Spring Boot 3.2.x EOL Baseline | **Medium** | **Low** | DevSecOps & Platform Arch | DAA / CISO | Pending Formal Sign-off | Boot 3.2.12 services | Jan 28, 2027 / Phase 10 | **`PENDING_FORMAL_ACCEPTANCE`** |

---

## 4. Operational Monitoring & Ongoing Risk Governance

To maintain operational oversight while risks are pending formal executive acceptance:
1. **Secrets Rotation:** Quarterly rotation of `${JWT_SECRET}` and annual rotation of database credentials per `SECURITY_SECRETS_ROTATION_PLAN.md`.
2. **SIEM Telemetry:** Real-time log forwarding from API Gateway to Central SIEM with automated alerts on Redis connection drops or HTTP 401/403 spikes.
3. **Upstream Health Monitoring:** Weekly automated checks of CDAC e-Hastakshar certificate validity.
4. **SCA Monitoring:** Continuous CycloneDX SBOM regeneration and CVE feed cross-referencing in CI/CD pipelines.
5. **Formal Executive Submission:** This register is formally submitted to the Designated Approving Authority (DAA) and CISO for formal review, signature, and risk acceptance memorandum issuance prior to production deployment authorization.

