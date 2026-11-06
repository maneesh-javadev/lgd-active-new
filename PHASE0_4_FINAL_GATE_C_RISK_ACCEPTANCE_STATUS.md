# LGD 2.0 — Phase 0–4 Final Gate C Assessment: Formal Risk Acceptance Status

| **Audit Assessment Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Gate** | **GATE C — FORMAL GOVERNANCE & RESIDUAL RISK ACCEPTANCE** |
| **Evaluation Date** | November 3, 2026 (`2026-11-03T15:13:00+05:30`) |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Scope** | Residual Risk Register (`RR-01` through `RR-11`), Operational Compensating Controls, Executive Authorization Status |
| **Auditor Role** | Lead Independent Application Security Auditor & Risk Evaluator |
| **Gate Determination** | **`GATE C: PENDING_FORMAL_ACCEPTANCE`** |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Executive Summary & Gate C Governance Standard

Gate C evaluates whether all unresolved, partially mitigated, or architectural residual risks identified across Phases 0 through 4 have received formal, authorized executive risk acceptance by the designated government authorities.

### Mandatory Governance Rules for Gate C:
1. **Separation of Gates:** Gate C is strictly independent of Gate A (Documentation) and Gate B (Technical Verification). A technical fix or documentary reconciliation cannot substitute for an authorized executive risk acceptance memo.
2. **Strict Non-Fabrication Policy:** No signature, approval stamp, memorandum, or certification may be simulated, assumed, or self-certified.
3. **Role $\neq$ Evidence:** Listing a role (e.g. "CISO" or "DAA") in a table indicates the *required decision-maker*, not that approval has been granted.
4. **Mandatory Acceptance Status:** In the absence of a genuine, physically signed or PKI-attested authorization memo from the Designated Approving Authority (DAA) or Chief Information Security Officer (CISO), every residual risk (`RR-01` through `RR-11`) must remain:
   $$\mathbf{PENDING\_FORMAL\_ACCEPTANCE}$$
5. **Single Governance Blocker Accounting:** This requirement constitutes the single active governance blocker (**`BLK-04`**, formerly BLK-05) in the authoritative 4-blocker register framework.

---


## 2. Comprehensive Review of Residual Risks RR-01 through RR-11

Every residual risk documented in [SECURITY_RESIDUAL_RISK_REGISTER.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_RESIDUAL_RISK_REGISTER.md) was reviewed in detail against active codebase evidence and operational controls:

### RR-01: Shared Symmetric HMAC Key Distribution
- **Risk Description:** Static HMAC-SHA256 signing secret shared symmetrically across multiple microservices.
- **Inherent Severity:** **Critical (9.4)** | **Residual Severity:** **Low (3.2)**
- **Current Technical Mitigation:** Removed hardcoded static secrets from Git properties. Enforced mandatory `${JWT_SECRET}` environment variable with minimum 256-bit entropy check on application startup ([ProductionSecurityValidator.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/config/ProductionSecurityValidator.java)).
- **Residual Exposure:** HS256 is a symmetric algorithm; identical secret is shared across `api-gateway`, `auth-service`, `user-management`, and `revenue`. Compromise of any single container exposes the key cluster-wide.
- **Required Decision-Maker:** Designated Approving Authority (DAA) / Chief Information Security Officer (CISO)
- **Supporting Evidence:** `ProductionSecurityValidatorTest` (5/5 PASS), [Secrets_Rotation_Plan.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Secrets_Rotation_Plan.md).
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for asymmetric RS256 migration in Phase 5 & 7).

---

### RR-02: Single-Point-of-Failure / Availability Risk on Redis Outage
- **Risk Description:** Complete denial of service across authenticated routes if Redis cache fails or disconnects.
- **Inherent Severity:** **High (8.2)** | **Residual Severity:** **Low (2.8)**
- **Current Technical Mitigation:** Strict fail-closed policy in API Gateway ([AuthenticationFilter.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/AuthenticationFilter.java)): if Redis is unreachable, requests are rejected with `HTTP 503 Service Unavailable`, preventing revoked token bypass.
- **Residual Exposure:** A single-node Redis failure halts all authenticated user traffic across the LGD 2.0 platform.
- **Required Decision-Maker:** Infrastructure Steering Committee / CISO
- **Supporting Evidence:** `AuthenticationFilterTest` (7/7 PASS), `redis:alpine` loopback binding `127.0.0.1:6379:6379`.
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for Redis Sentinel / HA Cluster in Phase 9).

---

### RR-03: Client-Side Token Storage Vulnerability to Browser Exploitation
- **Risk Description:** JWT bearer tokens stored in browser `localStorage` / `sessionStorage` vulnerable to DOM inspection or script compromise.
- **Inherent Severity:** **High (8.0)** | **Residual Severity:** **Low (3.0)**
- **Current Technical Mitigation:** Strict Gateway Content-Security-Policy (`default-src 'self'`), `X-Frame-Options: DENY`, and short token lifespans (15-minute expiration).
- **Residual Exposure:** Client-side storage remains accessible to JavaScript; supply chain script compromise could harvest officer tokens.
- **Required Decision-Maker:** Application Security Architecture Board / CISO
- **Supporting Evidence:** `SecurityHeadersFilterTest` (1/1 PASS), Gateway HTTP live response headers.
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for HttpOnly SameSite=Strict cookie migration in Phase 5).

---

### RR-04: Third-Party Certificate Authority Lifecycle & Upstream eSign Dependencies
- **Risk Description:** Operational failure of gazette digital signing if external CDAC / CCA trust anchor certificates expire or rollover unexpectedly.
- **Inherent Severity:** **Critical (8.8)** | **Residual Severity:** **Low (2.5)**
- **Current Technical Mitigation:** Enforced `secureValidation = TRUE`, CDAC trust anchor chaining, validity period check, digital signature key usage check, and Redis replay locking.
- **Residual Exposure:** Reliance on upstream CDAC / CCA infrastructure; unannounced upstream root certificate changes or CRL network partitions will halt signing.
- **Required Decision-Maker:** Ministry Designated Approving Authority (DAA) / Project Director
- **Supporting Evidence:** `EsignCallbackSecurityTest` (13/13 PASS), [XmlSignatureUtil.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/XmlSignatureUtil.java).
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for operational monitoring and emergency fallback in Phase 8).

---

### RR-05: Unencrypted Internal Database & Cache Network Transit
- **Risk Description:** Plaintext TCP transit of PostgreSQL JDBC queries and Redis cache payloads between containers and host.
- **Inherent Severity:** **Medium (6.5)** | **Residual Severity:** **Low (2.2)**
- **Current Technical Mitigation:** Internal microservice ports unmapped from host; microservices communicate over Docker bridge `lgd-network`; Redis bound to loopback `127.0.0.1:6379:6379`; host firewall blocks untrusted access.
- **Residual Exposure:** PostgreSQL 14 runs natively on the Windows host (`host.docker.internal:5432`) without JDBC TLS encryption (`sslmode=require` disabled); Redis traffic traverses unencrypted TCP sockets. Host-level sniffing can observe queries and token blacklists.
- **Required Decision-Maker:** Security Operations Board / CISO
- **Supporting Evidence:** [docker-compose.yml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/docker-compose.yml), network port audit logs.
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for JDBC TLS and Redis TLS encryption in Phase 9).

---

### RR-06: Container Execution Context & Non-Root Privilege Hardening
- **Risk Description:** Containers executing Java application processes as default root user (`UID 0`), increasing container breakout risk.
- **Inherent Severity:** **Medium (6.5)** | **Residual Severity:** **Low (2.4)**
- **Current Technical Mitigation:** Internal container ports unmapped from host; network segmentation via bridge `lgd-network`; no privileged flags configured in Docker Compose.
- **Residual Exposure:** Processes run as UID 0 inside container namespaces. If an unpatched Linux kernel or Docker engine vulnerability is exploited via RCE, privilege escalation to host root is possible.
- **Required Decision-Maker:** DevSecOps Steering Group / CISO
- **Supporting Evidence:** Microservice Dockerfiles (`FROM eclipse-temurin:21-jdk`), Trivy container scans (`scratch/trivy_results/`).
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for non-root `USER 10001:10001` rebuild in Phase 9).

---

### RR-07: Distributed Edge Denial of Service (DDoS) Mitigation
- **Risk Description:** Perimeter flooding attacks exceeding API Gateway bandwidth or socket descriptor limits.
- **Inherent Severity:** **Medium (6.8)** | **Residual Severity:** **Low (2.5)**
- **Current Technical Mitigation:** Gateway memory buffering ceiling (64 KB), path traversal rejection, uniform error responses, and Redis token-bucket rate limiting on `/auth/public/**`.
- **Residual Exposure:** Application-level rate limiting cannot absorb massive volumetric SYN floods or distributed DDoS traffic exceeding server network interface cards.
- **Required Decision-Maker:** National Informatics Centre (NIC) Network Security Authority / CISO
- **Supporting Evidence:** [ApiLoggingFilter.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/ApiLoggingFilter.java), [RouteValidator.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/RouteValidator.java).
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for NIC National Cloud WAF / upstream DDoS edge protection in Phase 9 & 10).

---

### RR-08: Outbound Spreadsheet Generation & SheetJS (xlsx) Upstream CDN Transition
- **Risk Description:** Pinned npm dependency `xlsx@0.18.5` in `lgd_react` flagged for Prototype Pollution (CVE-2023-30533) and ReDoS (CVE-2024-22363).
- **Inherent Severity:** **High (7.8)** | **Residual Severity:** **Low (1.5)**
- **Current Technical Mitigation:** Static code audit confirmed `xlsx` is strictly used for outbound file export (`XLSX.write()`) in `NodalInfoCards.tsx` and `DepartmentAvailabilityModal.tsx`. It never parses incoming files (`XLSX.read()`).
- **Residual Exposure:** Automated scanners flag the package; public npm does not host patched versions above 0.18.5 (hosted exclusively on SheetJS CDN).
- **Required Decision-Maker:** Application Security Board / CISO
- **Supporting Evidence:** Code grep of `lgd_react/src` confirming outbound-only usage, [SCA_FINDINGS_REGISTER.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_FINDINGS_REGISTER.md).
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for migration to `exceljs` library in Phase 10).

---

### RR-09: Zod Major Version Upgrade & Form Validation Schema Alignment
- **Risk Description:** Memory exhaustion vulnerability (GHSA-mrhx-c7xc-m3w5) in `zod@3.25.76` when parsing constrained recursive collections.
- **Inherent Severity:** **High (7.5)** | **Residual Severity:** **Low (1.8)**
- **Current Technical Mitigation:** Zod is used strictly for shallow client-side modal form validation in `districtSchema.ts` (state code, district name, headquarter); backend Spring bean validation independently enforces bounds.
- **Residual Exposure:** Upgrading to Zod 4.x breaks compatibility with `@hookform/resolvers@^5.9.1`, requiring form schema refactoring.
- **Required Decision-Maker:** Application Security Architecture Board / CISO
- **Supporting Evidence:** `districtSchema.ts` review, [SCA_FINDINGS_REGISTER.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_FINDINGS_REGISTER.md).
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for Zod 4 modernization sprint in Phase 10).

---

### RR-10: Legacy Cryptographic Migration from jBCrypt to Spring Security Crypto
- **Risk Description:** Use of unmaintained third-party library `org.mindrot:jbcrypt:0.4` (CWE-1104, unmaintained since 2015).
- **Inherent Severity:** **Medium (5.3)** | **Residual Severity:** **Low (2.0)**
- **Current Technical Mitigation:** BCrypt hashing performs SecureRandom salt generation; passwords hashed and verified correctly across 251 test cases.
- **Residual Exposure:** No active security maintenance or vulnerability patches from upstream maintainers.
- **Required Decision-Maker:** Chief Information Security Officer (CISO)
- **Supporting Evidence:** `auth-service/pom.xml`, `user-management/pom.xml`, automated password test suites (251/251 PASS).
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for native `BCryptPasswordEncoder` refactor in Phase 5 & 7).

---

### RR-11: Community EOL Lifecycle Monitoring for Spring Boot 3.2.x Baseline
- **Risk Description:** Spring Boot 3.2.x reached end of open-source community support in November 2024.
- **Inherent Severity:** **Medium (6.5)** | **Residual Severity:** **Low (2.2)**
- **Current Technical Mitigation:** Backend microservices harmonized to `3.2.12`; critical dependencies explicitly overridden (Tomcat `10.1.34`, Spring Security `6.3.8`, PostgreSQL JDBC `42.6.2`).
- **Residual Exposure:** Future zero-day vulnerabilities in Spring Boot 3.2 core will not receive public open-source patches.
- **Required Decision-Maker:** Designated Approving Authority (DAA) / CISO
- **Supporting Evidence:** Microservice `pom.xml` manifests, CycloneDX SBOM (`SOFTWARE_BILL_OF_MATERIALS.json`).
- **Approval Evidence Reference:** None (No signed executive authorization memo on file).
- **Formal Status:** **`PENDING_FORMAL_ACCEPTANCE`** (Planned for framework upgrade to Spring Boot 3.4.x LTS in Phase 10 & 13).

---

## 3. Summary Risk Matrix & Gate C Determination

| Risk ID | Title | Inherent | Residual | Approving Authority | Approval Status | Target Closure Phase |
|:---:|:---|:---:|:---:|:---|:---:|:---:|
| **RR-01** | Shared Symmetric HMAC Key | Critical | Low | DAA / CISO | `PENDING_FORMAL_ACCEPTANCE` | Phase 5 & 7 |
| **RR-02** | Redis Outage Availability Risk | High | Low | Infra Committee / CISO | `PENDING_FORMAL_ACCEPTANCE` | Phase 9 |
| **RR-03** | Browser Token Storage Exposure | High | Low | AppSec Board / CISO | `PENDING_FORMAL_ACCEPTANCE` | Phase 5 |
| **RR-04** | Upstream eSign CA Dependency | Critical | Low | Ministry DAA / Project Dir | `PENDING_FORMAL_ACCEPTANCE` | Phase 8 |
| **RR-05** | Unencrypted DB & Cache Transit | Medium | Low | SecOps Board / CISO | `PENDING_FORMAL_ACCEPTANCE` | Phase 9 |
| **RR-06** | Container Root Execution (UID 0) | Medium | Low | DevSecOps Group / CISO | `PENDING_FORMAL_ACCEPTANCE` | Phase 9 |
| **RR-07** | Volumetric DDoS Exposure | Medium | Low | NIC Network Authority | `PENDING_FORMAL_ACCEPTANCE` | Phase 9 & 10 |
| **RR-08** | SheetJS Outbound Usage & CDN | High | Low | AppSec Board / CISO | `PENDING_FORMAL_ACCEPTANCE` | Phase 10 |
| **RR-09** | Zod Form Validation Alignment | High | Low | AppSec Board / CISO | `PENDING_FORMAL_ACCEPTANCE` | Phase 10 |
| **RR-10** | Legacy jBCrypt Component | Medium | Low | CISO | `PENDING_FORMAL_ACCEPTANCE` | Phase 5 & 7 |
| **RR-11** | Spring Boot 3.2.x EOL Lifecycle | Medium | Low | DAA / CISO | `PENDING_FORMAL_ACCEPTANCE` | Phase 10 & 13 |

### Gate C Final Determination:
$$\mathbf{GATE\ C\ STATUS:\ PENDING\_FORMAL\_ACCEPTANCE}$$

In strict accordance with audit integrity and anti-fabrication mandates, Gate C cannot be marked PASS until an official, executed authorization memorandum is issued and signed by the Designated Approving Authority (DAA) and Chief Information Security Officer (CISO). This constitutes the single active governance blocker (**`BLK-04`**, formerly BLK-05) required for Phase 5 authorization.

### Mandatory Stopping Statement:
$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$

---
*Gate C Assessment compiled and attested by the Lead Independent Security Auditor.*

