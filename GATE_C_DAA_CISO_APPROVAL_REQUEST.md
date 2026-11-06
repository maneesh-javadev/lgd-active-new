# LGD 2.0 — Gate C Formal Risk Acceptance Submission & Executive Memorandum Request

| **Memorandum Control Metadata** | **Specification** |
|:---|:---|
| **Document Title** | Formal Risk Acceptance Submission & Executive Decision Request (Pre-Phase 5) |
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Submission Authority** | Lead Independent Security Auditor, Application Security Architect & Enterprise Risk Lead |
| **Addressed To (Reviewers)** | **Designated Approving Authority (DAA)** & **Chief Information Security Officer (CISO)** |
| **Audit Milestone** | Phase 0–4 Closure & Pre-Phase 5 Risk Acceptance Milestone (Gate C) |
| **Date of Submission** | November 3, 2026 (`2026-11-03T17:42:00+05:30`) |
| **Status of Decision** | **`PENDING_FORMAL_ACCEPTANCE`** |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Formal Executive Memorandum Summary

**TO:** Designated Approving Authority (DAA) & Chief Information Security Officer (CISO)  
**FROM:** Combined Security Architecture, DevSecOps & Independent Audit Team  
**DATE:** November 3, 2026  
**SUBJECT:** Executive Risk Acceptance Submission for Residual Risks `RR-01` through `RR-11` Prior to Phase 5 Authorization

### Purpose:
This memorandum formally transmits the consolidated **Residual Risk Decision Package** for the Local Government Directory 2.0 (LGD 2.0) platform following the conclusion of Phase 0 through Phase 4 security evaluations. 

In accordance with federal risk management frameworks (NIST SP 800-30 Rev. 1, ISO/IEC 27005), entry into Phase 5 (Authentication & Session Security Deep Audit) requires that all inherent architectural and operational residual risks be formally reviewed, assessed, and formally accepted or treated by executive leadership under **Gate C**.

---

## 2. Executive Summary of Evaluated Residual Risks (RR-01 through RR-11)

An overview of the eleven residual risks, their underlying exposures, verified technical controls, and proposed treatments is presented below:

### 1. RR-01: Shared Symmetric HMAC Key Distribution
- **Affected Asset:** All microservices (`api-gateway`, `auth-service`, `user-management`, `revenue`).
- **Residual Exposure:** HS256 is a symmetric signing algorithm. The identical secret key is shared across 4 microservices. If an attacker extracts the key from any single container's memory, valid administrative tokens can be forged cluster-wide.
- **Implemented Controls:** Mandatory `${JWT_SECRET}` env variable with $\ge 256$-bit entropy check on startup (`ProductionSecurityValidatorTest` 5/5 PASS).
- **Proposed Treatment:** **Mitigate**. Migrate to asymmetric RS256/Ed25519 in Phase 5 & Phase 7.
- **Accountable Owner:** Application Security Lead & DevOps Engineering Lead.

### 2. RR-02: Single-Point-of-Failure / Availability Risk on Redis Outage
- **Affected Asset:** Token Revocation & Edge Rate Limiter (`redis:alpine`).
- **Residual Exposure:** Strict fail-closed policy (`HTTP 503`) in `AuthenticationFilter` prevents revoked token bypass, but an unplanned Redis crash halts all authenticated user traffic across LGD 2.0.
- **Implemented Controls:** Fail-closed gateway filter (`AuthenticationFilterTest` 7/7 PASS); loopback binding `127.0.0.1:6379`.
- **Proposed Treatment:** **Mitigate**. Provision Redis Sentinel / HA Cluster in Phase 9.
- **Accountable Owner:** Lead Infrastructure Engineer & Database Administrator.

### 3. RR-03: Client-Side Token Storage Vulnerability to Browser Exploitation
- **Affected Asset:** Web Client Applications (`lgd-um` / `lgd_react`).
- **Residual Exposure:** Bearer tokens stored in browser `localStorage` or `sessionStorage` remain accessible to JavaScript. In the event of a client-side script compromise or supply-chain flaw, tokens could be exfiltrated.
- **Implemented Controls:** Gateway CSP (`default-src 'self'`), `X-Frame-Options: DENY`, 15-minute token expiration.
- **Proposed Treatment:** **Mitigate**. Transition session storage to `HttpOnly; SameSite=Strict; Secure` cookies with CSRF Double-Submit protection in Phase 5.
- **Accountable Owner:** Frontend Architecture Lead & UI Security Engineer.

### 4. RR-04: Third-Party Certificate Authority Lifecycle & Upstream eSign Dependencies
- **Affected Asset:** Digital Gazette Publication Engine (`revenue` / e-Hastakshar).
- **Residual Exposure:** The digital order signing engine relies on external root certificates issued by CDAC / CCA. If upstream certificates expire or CRL/OCSP endpoints experience network partition, gazette publication workflows will fail.
- **Implemented Controls:** Enforced `secureValidation = true`, CDAC trust anchor chaining, validity period check, and Redis replay locking (`EsignCallbackSecurityTest` 13/13 PASS).
- **Proposed Treatment:** **Accept & Monitor**. Implement 60-day automated certificate expiration monitoring in Phase 8.
- **Accountable Owner:** Lead Integration Architect & e-Governance Compliance Lead.

### 5. RR-05: Unencrypted Internal Database & Cache Network Transit
- **Affected Asset:** Container-to-Host Network Boundary (`host.docker.internal:5432` & Redis).
- **Residual Exposure:** PostgreSQL 14 runs natively on the Windows host, and microservices connect across the Docker bridge without JDBC TLS encryption (`sslmode=require` disabled); Redis traffic traverses unencrypted TCP sockets.
- **Implemented Controls:** Internal container ports unmapped from host; isolated Docker bridge network `lgd-network`.
- **Proposed Treatment:** **Mitigate**. Enforce JDBC TLS and Redis TLS encryption in Phase 9.
- **Accountable Owner:** DevSecOps Lead & Database Administrator.

### 6. RR-06: Container Execution Context & Non-Root Privilege Hardening
- **Affected Asset:** Container Base Images (`eclipse-temurin:21-jdk`).
- **Residual Exposure:** Microservice processes execute as `root` (UID 0) within container namespaces. If an RCE vulnerability is chained with a Linux kernel privilege escalation flaw, container breakout is possible.
- **Implemented Controls:** Host ports unmapped; bridge isolation; no privileged container flags.
- **Proposed Treatment:** **Mitigate**. Rebuild Dockerfiles with unprivileged service account (`USER spring:spring`, UID 10001) in Phase 9.
- **Accountable Owner:** DevSecOps Engineer & Container Infrastructure Lead.

### 7. RR-07: Distributed Edge Denial of Service (DDoS) Mitigation
- **Affected Asset:** API Gateway Perimeter Interface (Port `8092`).
- **Residual Exposure:** Application-level token-bucket rate limiting cannot absorb massive volumetric SYN floods or multi-gigabit DDoS attacks exceeding network interface capacity.
- **Implemented Controls:** Netty memory buffering ceiling (64 KB); Redis token-bucket rate limiter on public auth routes.
- **Proposed Treatment:** **Transfer**. Implement upstream NIC National Cloud WAF and edge DDoS mitigation in Phase 9 & 10.
- **Accountable Owner:** Network Operations Lead & SOC Lead.

### 8. RR-08: Outbound Spreadsheet Generation & SheetJS (xlsx) Upstream CDN Transition
- **Affected Asset:** Client-Side Export Utilities (`NodalInfoCards.tsx`, `DepartmentAvailabilityModal.tsx`).
- **Residual Exposure:** Pinned dependency `xlsx@0.18.5` is flagged by automated scanners for CVE-2023-30533, generating compliance inquiries.
- **Implemented Controls:** Code audit confirms `xlsx` is strictly invoked for outbound export (`XLSX.write()`), never for parsing untrusted input.
- **Proposed Treatment:** **Mitigate**. Replace SheetJS with the modern `exceljs` library in Phase 10.
- **Accountable Owner:** Frontend Architecture Lead & UI Security Engineer.

### 9. RR-09: Zod Major Version Upgrade & Form Validation Schema Alignment
- **Affected Asset:** Client Form Validation (`districtSchema.ts`).
- **Residual Exposure:** Upgrading from Zod 3.25.76 to 4.x breaks compatibility with `@hookform/resolvers@^5.9.1`, requiring schema refactoring.
- **Implemented Controls:** Zod is used strictly for shallow client-side modal form validation; Spring backend bean validation independently enforces constraints.
- **Proposed Treatment:** **Mitigate**. Modernize form validation schemas during Phase 10 frontend maintenance.
- **Accountable Owner:** Frontend Lead Developer & QA Lead.

### 10. RR-10: Legacy Cryptographic Migration from jBCrypt to Spring Security Crypto
- **Affected Asset:** Password Hashing (`auth-service`, `user-management`).
- **Residual Exposure:** `jbcrypt:0.4` has had zero upstream maintenance or updates since 2015 (CWE-1104).
- **Implemented Controls:** Hashing utilizes SecureRandom salts; validated across 251 regression tests.
- **Proposed Treatment:** **Mitigate**. Refactor user password hashing to native `BCryptPasswordEncoder` in Phase 5 & 7.
- **Accountable Owner:** Java Security Architect & Lead Backend Engineer.

### 11. RR-11: Community EOL Lifecycle Monitoring for Spring Boot 3.2.x Baseline
- **Affected Asset:** Core Microservices Platform (`auth-service`, `revenue`, `user-management`).
- **Residual Exposure:** Spring Boot 3.2.x community OSS support ended in November 2024. Future zero-day vulnerabilities in Spring Boot core will not receive public open-source patches.
- **Implemented Controls:** Services harmonized to `3.2.12`; Tomcat pinned to `10.1.34`; Spring Security to `6.3.8`; JDBC to `42.6.2`.
- **Proposed Treatment:** **Mitigate**. Upgrade platform to Spring Boot 3.4.x LTS baseline in Phase 10 & 13.
- **Accountable Owner:** DevSecOps Lead & Enterprise Platform Architect.

---

## 3. Decision Requested from DAA and CISO

Executive leadership is requested to review the supporting documentation and select one of the following formal determinations:

- [ ] **OPTION A: FORMALLY ACCEPT RESIDUAL RISKS (APPROVE GATE C)**  
  Formally accept the residual risks `RR-01` through `RR-11` under the compensating controls and phased remediation roadmap detailed above, authorizing formal clearance of Gate C.

- [ ] **OPTION B: CONDITIONAL ACCEPTANCE WITH REMEDIATION DIRECTIVES**  
  Accept residual risks subject to specific operational conditions, shortened review intervals, or expedited remediation timelines.

- [ ] **OPTION C: REJECT RISK ACCEPTANCE (RETURN FOR REMEDIATION)**  
  Reject risk acceptance for specified findings, directing immediate remediation prior to Phase 5 entry.

---

## 4. Formal Action & Signature Block (To Be Completed by Executives)

```text
========================================================================================
                            FORMAL EXECUTIVE ACTION
========================================================================================

DESIGNATED APPROVING AUTHORITY (DAA):
Decision:       [   ] APPROVED        [   ] REJECTED        [   ] CONDITIONALLY APPROVED
Official Name:  ________________________________________________________________________
Designation:    ________________________________________________________________________
Date:           ________________________
Signature:      ________________________________________________________________________

CHIEF INFORMATION SECURITY OFFICER (CISO):
Concurrence:    [   ] CONCUR          [   ] NON-CONCUR      [   ] CONCUR WITH CONDITIONS
Official Name:  ________________________________________________________________________
Designation:    Chief Information Security Officer (CISO)
Date:           ________________________
Signature:      ________________________________________________________________________

Conditions / Exclusions:
________________________________________________________________________________________
________________________________________________________________________________________

Next Mandatory Governance Review Date: ________________________ (Within 90 Days)
========================================================================================
```

---

## 5. Mandatory Audit Governance Statement

This document represents the formal executive submission package. In strict adherence to audit integrity and non-fabrication mandates:
- The AI agent and security review team **cannot** execute, sign, or simulate these approvals.
- Until a counter-signed authorization memorandum is issued, Gate C remains in status **`PENDING_FORMAL_ACCEPTANCE`**.
- Technical verification blockers under Gate B (`BLK-01`, `BLK-02`, `BLK-03`) remain on `HOLD`.

### Mandatory Stopping Statement:
$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$
