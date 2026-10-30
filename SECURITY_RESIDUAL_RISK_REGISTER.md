# LGD 2.0 — Security Residual Risk Register
## Residual Risk Analysis & Operational Safeguards Post-Phase 1–3 Remediation

| **Document Version** | 2.0.0 (Mandatory External Audit Closure Review) |
|---|---|
| **Audited Scope** | LGD 2.0 Platform (Backend Services, Data Layer, Infrastructure, Integrations) |
| **Reviewer Role** | Senior Application Security Reviewer & Enterprise Risk Lead |
| **Date** | October 30, 2026 |
| **Status** | **FORMALLY DOCUMENTED & ACCEPTED RESIDUAL RISK BASELINE** |

---

## 1. Governance & Risk Framework

In accordance with NIST SP 800-30 Rev. 1 (*Guide for Conducting Risk Assessments*), ISO/IEC 27005, and OWASP Enterprise Security Guidelines, this **Residual Risk Register** documents the remaining risk exposure across the Local Government Directory 2.0 (LGD 2.0) platform following the completion of Phase 0–3 security remediations.

### Strict Risk Governance Principles:
1. **Non-Zero Risk Acknowledgement:** An accepted residual risk is never described as zero risk. Inherent architectural and operational exposures remain even after technical fixes are deployed.
2. **Distinction Between Implemented Controls vs. Future Improvements:** Implemented technical controls are strictly distinguished from future planned improvements. Future roadmap items (e.g. Asymmetric RS256 migration, Redis Enterprise cluster, WAF edge proxy) are explicitly documented as compensating controls or planned phase enhancements, not claimable as already completed controls.
3. **Mandatory Field Structure:** Every residual risk record (`RR-01` through `RR-07`) explicitly defines:
   - Existing Control
   - Remaining Exposure
   - Compensating Control
   - Owner
   - Planned Phase
   - Risk Acceptance Authority
   - Status (`RISK_ACCEPTED`)

---

## 2. Detailed Residual Risk Records (RR-01 through RR-07)

---

### RR-01: Shared Symmetric HMAC Key Distribution
- **Inherent Risk:** Critical (Hardcoded static HMAC-SHA256 secret committed in version control).
- **Existing Control:** Externalized `jwt.secret` to mandatory `${JWT_SECRET}` environment variable with minimum 256-bit entropy check on startup (`ProductionSecurityValidator.java`). Static secret constants removed from repository.
- **Remaining Exposure:** HS256 is a symmetric signing algorithm. The identical secret key is shared across `api-gateway`, `auth-service`, `user-management`, and `revenue`. If an attacker or compromised internal service extracts the symmetric key from any single container's memory or environment, valid tokens can still be forged across the entire cluster.
- **Compensating Control:**
  - Restrict container environment variable visibility and file system permissions.
  - Inject secrets at runtime via secure orchestration or enterprise vault (HashiCorp Vault / AWS Secrets Manager) rather than static files.
  - Enforce automated secret rotation schedule per `SECURITY_SECRETS_ROTATION_PLAN.md`.
- **Owner:** Application Security Lead & DevOps Engineering Lead
- **Planned Phase:** Phase 5 (Authentication & Session Audit) & Phase 7 (Cryptographic Hardening) — Migrate to asymmetric RSA (RS256) or Ed25519 signing where only `auth-service` holds private key.
- **Risk Acceptance Authority:** LGD 2.0 Designated Approving Authority (DAA) / Chief Information Security Officer (CISO)
- **Status:** **`RISK_ACCEPTED`**

---

### RR-02: Single-Point-of-Failure / Availability Risk on Redis Outage
- **Inherent Risk:** High (Token revocation bypass during Redis cache outage).
- **Existing Control:** Implemented strict fail-closed policy in API Gateway (`AuthenticationFilter.java`): if Redis is unreachable or connection drops, Gateway rejects requests with `HTTP 503 Service Unavailable` (`"Revocation service unavailable"`).
- **Remaining Exposure:** While fail-closed behavior guarantees that revoked tokens cannot bypass perimeter revocation checks, an unplanned Redis node crash, network partition, or performance degradation will cause complete denial of service (DoS) for all authenticated users across LGD 2.0.
- **Compensating Control:**
  - Deploy Redis in High-Availability (HA) topology using Redis Sentinel or Redis Enterprise multi-node cluster with automatic failover.
  - Enable Append-Only File (AOF) with `everysec` fsync and RDB snapshots to prevent blacklist state loss on restart.
  - Configure active healthcheck monitoring and automated alerting on Redis latency > 50ms.
- **Owner:** Lead Infrastructure Engineer & Database Administrator
- **Planned Phase:** Phase 9 (Container & Network Hardening) & Phase 12 (Disaster Recovery & HA Audit)
- **Risk Acceptance Authority:** LGD 2.0 Infrastructure Steering Committee / CISO
- **Status:** **`RISK_ACCEPTED`**

---

### RR-03: Client-Side Token Storage Vulnerability to Browser Exploitation
- **Inherent Risk:** High (XSS credential harvesting of officer tokens).
- **Existing Control:** Strict `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` headers injected at API Gateway. Frontend form inputs sanitized.
- **Remaining Exposure:** The current single-page frontend application (`lgd_react` / `lgd-um`) stores JWT tokens in browser storage (`localStorage` / `sessionStorage`). Any zero-day client-side script execution, malicious third-party dependency (supply chain flaw), or browser extension compromise can access and exfiltrate the stored bearer token.
- **Compensating Control:**
  - Strict Content-Security-Policy (`default-src 'self'`) restricts unauthorized script execution and outbound exfiltration endpoints.
  - Enforce short token lifespans (15-minute expiration) with automated refresh tokens.
  - Implement Web Application Firewall (WAF) inspecting for client-side script injection patterns.
- **Owner:** Frontend Architecture Lead & UI Security Engineer
- **Planned Phase:** Phase 5 (Authentication & Session Security Audit) — Migrate session tokens to `HttpOnly; SameSite=Strict; Secure` cookies with CSRF Double-Submit protection.
- **Risk Acceptance Authority:** Application Security Architecture Board / CISO
- **Status:** **`RISK_ACCEPTED`**

---

### RR-04: Third-Party Certificate Authority Lifecycle & Upstream eSign Dependencies
- **Inherent Risk:** Critical (Forged XMLDSig callbacks & fake gazette order signing).
- **Existing Control:** Enforced `secureValidation = TRUE`, CDAC trust anchor certificate validation, X.509 validity period check, `digitalSignature` keyUsage (bit 0) enforcement, PDF SHA-256 hash match, and Redis distributed atomic replay lock.
- **Remaining Exposure:** The e-Hastakshar verification engine relies on external trust anchor certificates issued by CDAC / Controller of Certifying Authorities (CCA). If upstream root certificates expire, undergo unannounced key rollover, or CRL/OCSP endpoints experience network partition, valid gazette publication workflows will fail.
- **Compensating Control:**
  - Automated certificate lifecycle monitoring tool alerting 60 and 30 days prior to CDAC trust anchor expiration.
  - Pre-production staging environment to validate upcoming CDAC certificate updates prior to production rollout.
  - Dedicated administrative fallback procedure for gazette order signing under formal legal emergency declaration.
- **Owner:** Lead Integration Architect & e-Governance Compliance Lead
- **Planned Phase:** Phase 8 (Business Logic & eSign Workflow Security Audit)
- **Risk Acceptance Authority:** Ministry Designated Approving Authority (DAA) / Project Director
- **Status:** **`RISK_ACCEPTED`**

---

### RR-05: Unencrypted Internal Database & Cache Network Transit
- **Inherent Risk:** Medium (Sniffing or tampering with database queries and cache payloads).
- **Existing Control:** Containers communicate via Docker network bridge; internal database and Redis ports are not published to external network interfaces. Host OS firewall restricts access.
- **Remaining Exposure:** PostgreSQL and Redis run on the container host network (accessed via `host.docker.internal`). Traffic between container virtual interfaces and host services traverses unencrypted plaintext TCP sockets (TCP 5432 and TCP 6379). Any process with root/packet capture privileges on the Docker host OS can inspect raw SQL queries, citizen records, and Redis token blacklists.
- **Compensating Control:**
  - Restrict host OS shell access strictly to authorized administrators using hardened SSH key pairs with MFA.
  - Bind PostgreSQL and Redis strictly to loopback (`127.0.0.1`) or the internal Docker bridge gateway IP (`172.17.0.1`), blocking `0.0.0.0` bindings.
  - Host OS audit logging (Auditd) monitoring packet capture utilities (`tcpdump`, `wireshark`).
- **Owner:** DevSecOps Lead & Database Administrator
- **Planned Phase:** Phase 9 (Infrastructure, Container & Network Hardening) — Enforce TLS transport encryption (`sslmode=require` / `sslmode=verify-full`) and mTLS for Redis connections.
- **Risk Acceptance Authority:** LGD 2.0 Security Operations Board / CISO
- **Status:** **`RISK_ACCEPTED`**

---

### RR-06: Container Execution Context & Non-Root Privilege Hardening
- **Inherent Risk:** Medium (Container breakout or privilege escalation).
- **Existing Control:** Internal microservice ports are removed from public host publishing; internal services are isolated on `lgd-network`.
- **Remaining Exposure:** Default base container images run the Java application process as `root` (UID 0) within the container namespace. In the event of a remote code execution vulnerability (e.g. deserialization or native library flaw), container isolation could be breached if Linux kernel vulnerabilities exist.
- **Compensating Control:**
  - Run containers with Docker security options: `--security-opt no-new-privileges:true`.
  - Drop unnecessary Linux capabilities: `cap_drop: [ALL]`, `cap_add: [NET_BIND_SERVICE]`.
  - Enforce read-only root filesystems with ephemeral `/tmp` volumes in production staging.
- **Owner:** DevSecOps Engineer & Container Infrastructure Lead
- **Planned Phase:** Phase 9 (Container & Network Hardening) — Rebuild Dockerfiles with dedicated unprivileged user (`USER spring:spring`, non-root UID 10001).
- **Risk Acceptance Authority:** DevSecOps Steering Group / CISO
- **Status:** **`RISK_ACCEPTED`**

---

### RR-07: Distributed Edge Denial of Service (DDoS) Mitigation
- **Inherent Risk:** Medium (Perimeter flooding and volumetric request exhaustion).
- **Existing Control:** API Gateway route validation, memory buffering ceiling (64KB), uniform error messaging, and application-level Redis token-bucket rate limiting on public authentication routes.
- **Remaining Exposure:** Application-level rate limiting executing in Spring Cloud Gateway cannot absorb large-scale volumetric Distributed Denial of Service (DDoS) attacks (e.g. SYN floods, HTTP flood exceeding gateway network interface capacity). Large attack volumes will exhaust gateway CPU and socket descriptors before application filters execute.
- **Compensating Control:**
  - Front public edge with Enterprise Web Application Firewall (WAF) / Content Delivery Network (NIC National Cloud WAF / Cloudflare Enterprise).
  - Implement upstream volumetric rate limiting, SYN flood protection, and GeoIP filtering at the edge routing layer.
  - Configure upstream reverse proxy (Nginx / HAProxy) with connection pooling and request burst limits.
- **Owner:** Network Operations Lead & Security Operations Center (SOC) Lead
- **Planned Phase:** Phase 9 & Phase 10 (Perimeter Defense & WAF Integration)
- **Risk Acceptance Authority:** National Informatics Centre (NIC) Network Security Authority / CISO
- **Status:** **`RISK_ACCEPTED`**

---

## 3. Residual Risk Summary Register

| Risk ID | Title | Inherent Severity | Residual Severity | Key Remaining Exposure | Planned Remediation Phase | Risk Acceptance Authority | Formal Status |
|:---:|:---|:---:|:---:|:---|:---:|:---|:---:|
| **RR-01** | Symmetric Key Exposure | **Critical** | **Low** | Shared HMAC secret across all 4 services | Phase 5 & 7 (RS256 Asymmetric Migration) | CISO / DAA | **`RISK_ACCEPTED`** |
| **RR-02** | Redis Fail-Closed Availability | **High** | **Low** | Temporary service outage on Redis crash | Phase 9 & 12 (Redis Sentinel HA Cluster) | CISO / Infra Steering | **`RISK_ACCEPTED`** |
| **RR-03** | Browser Token Storage | **High** | **Low** | XSS token theft from browser storage | Phase 5 (HttpOnly Secure Cookies Migration) | CISO / AppSec Board | **`RISK_ACCEPTED`** |
| **RR-04** | Third-Party eSign Dependency | **Critical** | **Low** | Upstream CDAC CA root expiration/rollover | Phase 8 (eSign Workflow Audit & Monitoring) | Project Director / DAA | **`RISK_ACCEPTED`** |
| **RR-05** | Unencrypted Database Transit | **Medium** | **Low** | Host-gateway plaintext network traffic | Phase 9 (PostgreSQL/Redis TLS Wire Encryption)| CISO / SecOps Board | **`RISK_ACCEPTED`** |
| **RR-06** | Container Root Execution | **Medium** | **Low** | Default container namespace running UID 0 | Phase 9 (Non-root `USER spring` in Dockerfile) | CISO / DevSecOps Group | **`RISK_ACCEPTED`** |
| **RR-07** | Volumetric DDoS Vulnerability | **Medium** | **Low** | Edge network saturation before gateway | Phase 9 & 10 (Upstream NIC Cloud WAF / CDN) | NIC Network Authority | **`RISK_ACCEPTED`** |

---

## 4. Operational Monitoring & Ongoing Risk Governance

To maintain the accepted risk posture:
1. **Secrets Rotation:** Quarterly rotation of `${JWT_SECRET}` and annual rotation of database credentials per `SECURITY_SECRETS_ROTATION_PLAN.md`.
2. **SIEM Telemetry:** Real-time log forwarding from API Gateway to Central SIEM with automated alerts on Redis connection drops or HTTP 401/403 spikes.
3. **Upstream Health Monitoring:** Weekly automated checks of CDAC e-Hastakshar certificate validity.
4. **Independent Annual Review:** Mandatory annual reassessment of all accepted residual risks prior to deployment renewals.
