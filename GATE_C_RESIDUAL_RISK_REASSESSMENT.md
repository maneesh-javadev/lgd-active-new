# LGD 2.0 — Gate C Residual Risk Reassessment (RR-01 through RR-11)

| **Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | Gate C Formal Risk Acceptance & Governance Baseline |
| **Evaluation Date** | November 3, 2026 (`2026-11-03T17:38:00+05:30`) |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Methodological Framework** | NIST SP 800-30 Rev. 1 / OWASP Enterprise Risk Rating Methodology |
| **Lead Governance Evaluator** | Security Governance and Risk Management Specialist & Lead Security Auditor |
| **Gate C Status** | **`GATE C: PENDING_FORMAL_ACCEPTANCE`** |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Executive Summary & Risk Governance Framework

In accordance with **NIST SP 800-30 Rev. 1** (*Guide for Conducting Risk Assessments*), **ISO/IEC 27005**, and federal security guidelines, this document provides the comprehensive, evidence-grounded **Residual Risk Reassessment** for all eleven residual risks (`RR-01` through `RR-11`) identified across Phases 0 through 4 of the LGD 2.0 Security Audit.

### Mandatory Governance Rules for Gate C:
1. **Strict Non-Fabrication Mandate:** The AI agent and evaluation team are strictly prohibited from simulating, creating, or assuming approvals, electronic signatures, or certificates on behalf of the Designated Approving Authority (DAA) or Chief Information Security Officer (CISO).
2. **Inherent Risk vs. Residual Risk Distinction:** Inherent risk represents the raw risk level prior to any defensive controls. Residual risk represents the exposure remaining *after* implementing and verifying technical controls. A risk rating is never reduced merely because a task is marked complete; reductions are justified strictly by empirical test evidence.
3. **Non-Zero Risk Acknowledgment:** An accepted residual risk is never zero. Architectural tradeoffs and technical limitations remain present and require ongoing operational safeguards.
4. **Current Gate C Determination:** In the absence of an executed, cryptographically verifiable risk acceptance memorandum counter-signed by the DAA and CISO, all eleven residual risks maintain the status:
   $$\mathbf{PENDING\_FORMAL\_ACCEPTANCE}$$

---

## 2. Risk Evaluation Methodology & Scoring Criteria

The assessment applies a standard two-dimensional likelihood-and-impact matrix (NIST SP 800-30 Rev. 1):

| Qualitative Rating | Qualitative Criteria (Likelihood) | Qualitative Criteria (Impact) | Numerical Severity Range |
|:---|:---|:---|:---:|
| **Critical** | Highly automated, ubiquitous attack vector; trivial exploitation; public exploit exists | Catastrophic platform-wide data compromise; total service outage; national legal violation | $9.0 - 10.0$ |
| **High** | Attacker requires network adjacency or standard user privileges; straightforward exploit | Major breach of sensitive citizen/officer records; localized service outage; compliance breach | $7.0 - 8.9$ |
| **Medium** | Attacker requires specific internal context, timing windows, or chain of minor defects | Moderate degradation; unauthorized modification of non-critical metadata; localized bypass | $4.0 - 6.9$ |
| **Low** | Highly complex, theoretical attack; requires multiple privileged prerequisites | Negligible impact; transient denial of service under extreme load; minor informational leak | $0.1 - 3.9$ |

---

## 3. Comprehensive RR-01 through RR-11 Register Inspection

The authoritative crosswalk below catalogs the inspected data from [SECURITY_RESIDUAL_RISK_REGISTER.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_RESIDUAL_RISK_REGISTER.md) and [Master_Finding_Traceability_Register.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md):

| Risk ID | Risk Description | Related VULN ID | Related SAST ID | Related EXP ID | Threat Mapping | Inherent Severity | Residual Likelihood | Residual Impact | Residual Rating | Existing Verified Controls | Remaining Residual Weakness | Mitigation Status | Designated Risk Owner | Recommended Treatment | DAA/CISO Decision | Formal Evidence Reference | Final Status |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---|:---:|:---|:---:|:---:|:---|:---:|
| **RR-01** | Shared Symmetric HMAC Key Distribution | `VULN-001` | `SAST-001` | `EXP-001` | `THR-STRIDE-001` | **Critical (9.4)** | Low | High | **Low (3.2)** | Mandatory `${JWT_SECRET}` env variable; startup entropy check ($\ge 256$ bits) via `ProductionSecurityValidator`. | Symmetric HS256 key is shared across 4 microservices; compromise of one container exposes cluster key. | Partially Mitigated / Active Controls | AppSec Lead & DevOps Lead | Mitigate (Migrate to RS256 in Phase 5 & 7) | `Pending` | `ProductionSecurityValidatorTest` (5/5 PASS), [Secrets_Rotation_Plan.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Secrets_Rotation_Plan.md) | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-02** | Single-Point-of-Failure on Redis Outage | `VULN-007` | `SAST-012` | `EXP-012` | `THR-STRIDE-007` | **High (8.2)** | Low | Medium | **Low (2.8)** | Strict fail-closed policy in `AuthenticationFilter.java`: returns `HTTP 503` if Redis drops. | Unplanned Redis node crash halts all authenticated platform traffic, causing total denial of service. | Partially Mitigated / Active Controls | Lead Infra Engineer & DBA | Mitigate (Redis Sentinel / HA in Phase 9) | `Pending` | `AuthenticationFilterTest` (7/7 PASS), `redis:alpine` loopback binding | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-03** | Client-Side Browser Token Storage | `*[Unassigned]*` | `*[Unassigned]*` | `*[Unassigned]*` | `THR-STRIDE-014` | **High (8.0)** | Low | High | **Low (3.0)** | Gateway CSP (`default-src 'self'`), `X-Frame-Options: DENY`, 15-minute token expiration. | Tokens in browser `localStorage`/`sessionStorage` accessible to JavaScript in supply-chain or XSS compromise. | Partially Mitigated / Active Controls | Frontend Lead & UI Sec Engineer | Mitigate (Migrate to HttpOnly Cookie in Phase 5) | `Pending` | `SecurityHeadersFilterTest` (1/1 PASS), Gateway live response headers | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-04** | Upstream Third-Party eSign Dependencies | `VULN-003` | `SAST-003`–`007` | `EXP-003`–`007` | `THR-STRIDE-003`, `THR-STRIDE-008` | **Critical (8.8)** | Low | High | **Low (2.5)** | `secureValidation = true`, CDAC trust anchor chain verification, SecureRandom PRNG, Redis replay lock. | Reliance on external CDAC/CCA root certs; unannounced upstream root rollover or CRL partition halts signing. | Partially Mitigated / Active Controls | Integration Architect & Compliance Lead | Accept & Monitor (Emergency bypass procedures Phase 8) | `Pending` | `EsignCallbackSecurityTest` (13/13 PASS), `XmlSignatureUtil.java` | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-05** | Unencrypted Internal DB & Cache Transit | `VULN-009`, `VULN-017` | `SAST-002` | `EXP-002` | `THR-STRIDE-004`, `THR-STRIDE-012` | **Medium (6.5)** | Low | Medium | **Low (2.2)** | Microservice ports unmapped from host; Docker bridge isolation; Redis bound to loopback `127.0.0.1:6379`. | PostgreSQL JDBC and Redis traffic traverse plaintext TCP sockets without TLS encryption (`sslmode=disable`). | Partially Mitigated / Active Controls | DevSecOps Lead & DBA | Mitigate (Enforce JDBC TLS & Redis TLS in Phase 9) | `Pending` | [docker-compose.yml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/docker-compose.yml), port probe logs | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-06** | Container Root Execution Context (UID 0) | `VULN-014` | `SCA-012` | `*[Unassigned]*` | `THR-STRIDE-012` | **Medium (6.5)** | Low | Medium | **Low (2.4)** | Internal ports unmapped from host; network segmentation; unprivileged Docker network bridge. | Containers execute Java processes as default root (`UID 0`); kernel vulnerability could allow container breakout. | Partially Mitigated / Active Controls | DevSecOps & Container Lead | Mitigate (Rebuild with non-root user in Phase 9) | `Pending` | Microservice Dockerfiles, Trivy scans (`scratch/trivy_results/`) | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-07** | Distributed Edge DDoS Volumetric Exposure | `VULN-015` | `SAST-015` | `EXP-015` | `THR-STRIDE-015`, `THR-STRIDE-016` | **Medium (6.8)** | Low | Medium | **Low (2.5)** | Gateway memory buffer ceiling (64 KB); Redis token-bucket rate limiter on public auth endpoints. | Application-level filters cannot absorb massive volumetric network SYN floods exceeding NIC capacity. | Partially Mitigated / Active Controls | NetOps Lead & SOC Lead | Transfer (NIC National Cloud WAF / Edge CDN Phase 9/10) | `Pending` | `ApiLoggingFilterTest` (4/4 PASS), Gateway route properties | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-08** | SheetJS Outbound Usage & Upstream CDN | `VULN-012`, `VULN-023` | `SCA-009` | `*[Unassigned]*` | `THR-STRIDE-011` | **High (7.8)** | Low | Low | **Low (1.5)** | Static code audit confirmed `xlsx@0.18.5` is strictly invoked for outbound export (`XLSX.write()`), never input. | Automated scanners flag CVE-2023-30533; npm registry does not host patched releases above 0.18.5. | Partially Mitigated / Active Controls | Frontend Lead & UI Sec Engineer | Mitigate (Migrate export to `exceljs` in Phase 10) | `Pending` | Grep audit of `NodalInfoCards.tsx`, [SCA_FINDINGS_REGISTER.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_FINDINGS_REGISTER.md) | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-09** | Zod Major Version Schema Alignment | `VULN-012` | `SCA-010` | `*[Unassigned]*` | `THR-STRIDE-015` | **High (7.5)** | Low | Low | **Low (1.8)** | Zod 3.25.76 used strictly for shallow client-side modal form validation; Spring backend bean validation enforces bounds. | Upgrading to Zod 4.x breaks compatibility with `@hookform/resolvers@^5.9.1`, requiring schema refactoring. | Partially Mitigated / Active Controls | Frontend Lead & QA Lead | Mitigate (Refactor form schemas in Phase 10) | `Pending` | `districtSchema.ts` review, [SCA_FINDINGS_REGISTER.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_FINDINGS_REGISTER.md) | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-10** | Legacy jBCrypt Component Migration | `*[Unassigned]*` | `SCA-008` | `*[Unassigned]*` | `THR-STRIDE-001` | **Medium (5.3)** | Low | Low | **Low (2.0)** | `jbcrypt:0.4` performs hashing with SecureRandom salt; passwords hashed and verified across 251 tests. | Library has received zero upstream security maintenance or patches since 2015 (CWE-1104). | Partially Mitigated / Active Controls | Java Sec Architect & Backend Lead | Mitigate (Migrate to Spring Security Crypto in Phase 5/7) | `Pending` | `auth-service/pom.xml`, surefire password tests (251/251 PASS) | `PENDING_FORMAL_ACCEPTANCE` |
| **RR-11** | Community EOL for Spring Boot 3.2.x | `*[Unassigned]*` | `SCA-001` | `*[Unassigned]*` | `THR-STRIDE-011` | **Medium (6.5)** | Low | Medium | **Low (2.2)** | Services harmonized to `3.2.12`; Tomcat pinned to `10.1.34`; Spring Security to `6.3.8`; JDBC to `42.6.2`. | Spring Boot 3.2 OSS support ended November 2024; future zero-days in core Boot modules will not receive public patches. | Partially Mitigated / Active Controls | DevSecOps Lead & Platform Architect | Mitigate (Upgrade to Spring Boot 3.4 LTS in Phase 10/13) | `Pending` | CycloneDX SBOM (`SOFTWARE_BILL_OF_MATERIALS.json`), POMs | `PENDING_FORMAL_ACCEPTANCE` |

---

## 4. In-Depth Reassessment of Residual Risks

### 4.1 RR-01: Shared Symmetric HMAC Key Distribution
- **Inherent Risk:** Critical (9.4). A leaked symmetric key allows forgery of arbitrary administrative JWT tokens.
- **Implemented Technical Controls:** [ProductionSecurityValidator.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/config/ProductionSecurityValidator.java) enforces mandatory injection of `${JWT_SECRET}` and halts application startup if secret length is less than 32 bytes (256 bits). Static secret constants have been removed from source.
- **Compensating Controls:** Container environment isolation; quarterly secret rotation schedule documented in [Secrets_Rotation_Plan.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Secrets_Rotation_Plan.md).
- **Residual Exposure Evaluation:** The HS256 algorithm requires all verifying microservices (`api-gateway`, `auth-service`, `user-management`, `revenue`) to hold the identical shared secret. Compromise of any single service node allows valid token creation across the entire platform.
- **Residual Rating:** **Low (3.2)** [Likelihood: Low, Impact: High].
- **Recommended Treatment:** **Mitigate**. Modernize authentication architecture in Phase 5 & 7 to asymmetric RSA (RS256) or Ed25519 signing, ensuring only `auth-service` possesses the private key.

### 4.2 RR-02: Single-Point-of-Failure / Availability Risk on Redis Outage
- **Inherent Risk:** High (8.2). Redis disconnection previously allowed unverified revoked token bypass.
- **Implemented Technical Controls:** Strict fail-closed policy in `AuthenticationFilter.java`. If Redis is unreachable, the gateway rejects requests with `HTTP 503 Service Unavailable`, preventing security bypass.
- **Compensating Controls:** Redis loopback binding `127.0.0.1:6379:6379`; Docker healthcheck monitoring.
- **Residual Exposure Evaluation:** Fail-closed design prevents security compromise but introduces an availability single-point-of-failure. An unplanned Redis outage halts all authenticated officer operations across the platform.
- **Residual Rating:** **Low (2.8)** [Likelihood: Low, Impact: Medium].
- **Recommended Treatment:** **Mitigate**. Provision multi-node Redis Sentinel or Redis Enterprise cluster with automatic failover in Phase 9.

### 4.3 RR-03: Client-Side Token Storage Vulnerability to Browser Exploitation
- **Inherent Risk:** High (8.0). Client-side storage of bearer tokens enables credential harvesting via XSS or rogue browser extensions.
- **Implemented Technical Controls:** Gateway security headers filter enforces strict Content-Security-Policy (`default-src 'self'`), `X-Frame-Options: DENY`, and short token expiration (15 minutes).
- **Compensating Controls:** Frontend input sanitization; WAF edge inspection rules.
- **Residual Exposure Evaluation:** Tokens stored in `localStorage` or `sessionStorage` remain accessible to client-side JavaScript. A zero-day script execution vulnerability could harvest active tokens.
- **Residual Rating:** **Low (3.0)** [Likelihood: Low, Impact: High].
- **Recommended Treatment:** **Mitigate**. Refactor session storage to `HttpOnly; SameSite=Strict; Secure` cookies with CSRF Double-Submit protection during Phase 5.

### 4.4 RR-04: Third-Party Certificate Authority Lifecycle & Upstream eSign Dependencies
- **Inherent Risk:** Critical (8.8). Malicious or forged XMLDSig responses could lead to unauthorized gazette publication.
- **Implemented Technical Controls:** Enforced `secureValidation = true` in XMLDSig parser, CDAC trust anchor chaining, X.509 validity period check, `digitalSignature` keyUsage enforcement, and Redis atomic replay locks.
- **Compensating Controls:** Dedicated administrative override protocols; certificate expiration alerting.
- **Residual Exposure Evaluation:** Platform depends on external CDAC/CCA trust anchors. Unannounced root rollover, CRL network partition, or upstream outage directly impacts digital gazette publishing.
- **Residual Rating:** **Low (2.5)** [Likelihood: Low, Impact: High].
- **Recommended Treatment:** **Accept & Monitor**. Establish automated 60-day CDAC certificate lifecycle alerting and pre-production staging tests in Phase 8.

### 4.5 RR-05: Unencrypted Internal Database & Cache Network Transit
- **Inherent Risk:** Medium (6.5). Network sniffing on internal TCP segments could expose SQL queries and token blacklists.
- **Implemented Technical Controls:** Internal container ports are unmapped from the host; services communicate over bridge `lgd-network`; Redis is bound to loopback `127.0.0.1:6379:6379`.
- **Compensating Controls:** Host OS firewall; administrative access restricted to MFA-hardened accounts; bridge routing isolated from public internet.
- **Residual Exposure Evaluation:** PostgreSQL 14 runs on the host OS (`host.docker.internal:5432`) without JDBC TLS encryption (`sslmode=require` disabled); Redis traffic is plaintext TCP.
- **Residual Rating:** **Low (2.2)** [Likelihood: Low, Impact: Medium].
- **Recommended Treatment:** **Mitigate**. Configure `sslmode=require` for PostgreSQL JDBC connections and enable Redis TLS encryption in Phase 9.

### 4.6 RR-06: Container Execution Context & Non-Root Privilege Hardening
- **Inherent Risk:** Medium (6.5). Process execution as root (UID 0) inside container namespaces increases breakout risk.
- **Implemented Technical Controls:** Container ports unmapped from host; Docker bridge network isolation; no privileged flags in `docker-compose.yml`.
- **Compensating Controls:** Docker `--security-opt no-new-privileges:true`; kernel security modules (AppArmor/SELinux).
- **Residual Exposure Evaluation:** Microservice processes run as UID 0 inside containers. If an RCE vulnerability is chained with a Linux kernel privilege escalation flaw, container breakout is possible.
- **Residual Rating:** **Low (2.4)** [Likelihood: Low, Impact: Medium].
- **Recommended Treatment:** **Mitigate**. Rebuild container images with an unprivileged dedicated service account (`USER spring:spring`, UID 10001) in Phase 9.

### 4.7 RR-07: Distributed Edge Denial of Service (DDoS) Mitigation
- **Inherent Risk:** Medium (6.8). Volumetric flooding can overwhelm API Gateway CPU and network descriptors.
- **Implemented Technical Controls:** Netty memory buffering ceiling (64 KB); Redis token-bucket rate limiter on public authentication endpoints; path normalization.
- **Compensating Controls:** Upstream network firewall and router-level burst limits.
- **Residual Exposure Evaluation:** Application-level filters cannot absorb large-scale volumetric DDoS floods (e.g. multi-gigabit SYN floods) exceeding server NIC capacity.
- **Residual Rating:** **Low (2.5)** [Likelihood: Low, Impact: Medium].
- **Recommended Treatment:** **Transfer**. Front perimeter with NIC National Cloud WAF and edge DDoS mitigation services in Phase 9 & 10.

### 4.8 RR-08: Outbound Spreadsheet Generation & SheetJS (xlsx) Upstream CDN Transition
- **Inherent Risk:** High (7.8). SheetJS < 0.20.2 contains Prototype Pollution (CVE-2023-30533) and ReDoS (CVE-2024-22363).
- **Implemented Technical Controls:** Static analysis confirms `xlsx@0.18.5` is strictly utilized for outbound file generation (`XLSX.write()`) in `NodalInfoCards.tsx` and `DepartmentAvailabilityModal.tsx`. It never parses incoming untrusted files (`XLSX.read()`).
- **Compensating Controls:** Strict CSP; backend validation; zero server-side spreadsheet parsing.
- **Residual Exposure Evaluation:** Automated vulnerability scanners flag the pinned package on compliance dashboards, generating external compliance inquiries.
- **Residual Rating:** **Low (1.5)** [Likelihood: Low, Impact: Low].
- **Recommended Treatment:** **Mitigate**. Replace SheetJS with the modern `exceljs` library in Phase 10.

### 4.9 RR-09: Zod Major Version Upgrade & Form Validation Schema Alignment
- **Inherent Risk:** High (7.5). Zod 3.25.76 contains a memory exhaustion flaw (GHSA-mrhx-c7xc-m3w5) when parsing recursive schemas.
- **Implemented Technical Controls:** Zod is used strictly for shallow client-side modal form validation in `districtSchema.ts` (state code, district name, headquarter); backend Spring bean validation independently enforces constraints.
- **Compensating Controls:** Backend `@Valid` annotations reject malformed data; HTML `maxlength` bounds inputs.
- **Residual Exposure Evaluation:** Upgrading to Zod 4.x introduces breaking changes with `@hookform/resolvers@^5.9.1`, requiring schema refactoring across form validation components.
- **Residual Rating:** **Low (1.8)** [Likelihood: Low, Impact: Low].
- **Recommended Treatment:** **Mitigate**. Conduct form schema modernization and upgrade to Zod 4.x in Phase 10.

### 4.10 RR-10: Legacy Cryptographic Migration from jBCrypt to Spring Security Crypto
- **Inherent Risk:** Medium (5.3). `jbcrypt:0.4` is an unmaintained third-party library released in 2015 (CWE-1104).
- **Implemented Technical Controls:** `jbcrypt:0.4` currently performs BCrypt hashing using `SecureRandom` salt generation; password hashing passes 251 regression tests.
- **Compensating Controls:** Salt entropy verified; login routes rate-limited; password hashes masked in logs.
- **Residual Exposure Evaluation:** The library receives zero upstream maintenance, patches, or performance improvements.
- **Residual Rating:** **Low (2.0)** [Likelihood: Low, Impact: Low].
- **Recommended Treatment:** **Mitigate**. Refactor user password hashing to native `org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder` in Phase 5 & 7.

### 4.11 RR-11: Community EOL Lifecycle Monitoring for Spring Boot 3.2.x Baseline
- **Inherent Risk:** Medium (6.5). Spring Boot 3.2.x reached end of open-source community support in November 2024.
- **Implemented Technical Controls:** Microservices harmonized to `3.2.12`; critical dependencies explicitly overridden (Tomcat `10.1.34`, Spring Security `6.3.8`, PostgreSQL JDBC `42.6.2`).
- **Compensating Controls:** Granular dependency overrides in Maven POM properties; continuous vulnerability monitoring against GitHub Advisory and NVD databases.
- **Residual Exposure Evaluation:** Future zero-day vulnerabilities in Spring Boot 3.2 core will not receive public open-source patches.
- **Residual Rating:** **Low (2.2)** [Likelihood: Low, Impact: Medium].
- **Recommended Treatment:** **Mitigate**. Execute multi-module framework upgrade to Spring Boot 3.4.x LTS in Phase 10 & 13.

---

## 5. Gate C Governance Assessment Summary

| Metric | Program Value | Audit Evaluation |
|:---|:---:|:---|
| **Total Cataloged Residual Risks** | 11 | All 11 risks (`RR-01` through `RR-11`) thoroughly documented |
| **Risks with Implemented Controls** | 11 | Verified technical controls active for 100% of cataloged risks |
| **Residual Severity Distribution** | 11 Low | Inherent Critical/High severities successfully reduced to Low |
| **Assigned Risk Owners** | 11 | Authorized engineering leads identified across all records |
| **Formal DAA/CISO Signatures On File** | **0** | **No executed authorization memorandum exists** |
| **Gate C Formal Determination** | — | **`GATE C: PENDING_FORMAL_ACCEPTANCE`** |

### Mandatory Governance Statement:
In strict compliance with anti-fabrication standards, Gate C cannot achieve `PASS` until the official Risk Acceptance Memorandum is formally executed by the Designated Approving Authority (DAA) and Chief Information Security Officer (CISO).

$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$
