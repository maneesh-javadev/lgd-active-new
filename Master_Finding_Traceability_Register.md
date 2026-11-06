# LGD 2.0 - Master Finding Traceability Register

## Document Information
- **Project:** Local Government Directory 2.0 (LGD 2.0)
- **Assessment Scope:** Consolidated Security Remediation & Verification (Phases 0, 1, 2, 3, and 4)
- **Auditor Role:** Senior Application Security Engineer, Java Security Architect, DevSecOps Engineer & QA Security Lead
- **Date:** November 2, 2026
- **Status:** Approved Master Traceability Register

---

## 1. Executive Summary & Traceability Methodology

This Master Finding Traceability Register establishes 100% bidirectional traceability across all phases of the LGD 2.0 security assessment:
- **Phase 0 Baseline:** Initial vulnerability hypotheses (`VULN-001` through `VULN-023`)
- **Phase 1 Threat Model:** Architectural STRIDE threats (`THR-STRIDE-001` through `THR-STRIDE-020`)
- **Phase 2 SAST Review:** Static code analysis findings (`SAST-001` through `SAST-021`)
- **Phase 3 DAST Assessment:** Dynamic exploitation evidence (`EXP-001` through `EXP-021` / `EV-001` through `EV-021`)
- **Consolidated Remediation:** Defensive engineering fixes, automated test evidence, and final disposition.

---

## 2. Canonical Master Finding Crosswalk Matrix

The authoritative crosswalk below maps every finding across all lifecycle dimensions according to the canonical schema:
`VULN ID → STRIDE ID → DREAD ID → SAST ID → EXP ID → EV ID → Test Case → Endpoint → Module → Remediation Status → Retest Status`

| VULN ID | STRIDE ID | DREAD ID | SAST ID | EXP ID | EV ID | Test Case | Target Endpoint | Module | Remediation Status | Retest Status |
|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---|:---|:---:|:---:|
| **VULN-001** | `THR-STRIDE-001` | `DREAD-01` | `SAST-001` | `EXP-001` | `EV-001` | `TC-SAST-001` | `GET /user-management/private/v1/resources` | `api-gateway, auth-service, user-management, revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-017** | `THR-STRIDE-012 (Amplifier)` | `DREAD-12` | `SAST-002` | `EXP-002` | `EV-009` | `TC-SAST-002` | `TCP / 5432 (PostgreSQL)` | `api-gateway, auth-service, user-management, revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-003** | `THR-STRIDE-003` | `DREAD-03` | `SAST-003` | `EXP-003` | `EV-010` | `TC-SAST-003` | `revenue.p12 (Keystore)` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-003** | `THR-STRIDE-003` | `DREAD-03` | `SAST-004` | `EXP-004` | `EV-011` | `TC-SAST-004` | `POST /public/v1/ehastakshar/response` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-003** | `THR-STRIDE-003` | `DREAD-03` | `SAST-005` | `EXP-005` | `EV-012` | `TC-SAST-005` | `POST /public/v1/ehastakshar/response` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-003** | `THR-STRIDE-003` | `DREAD-03` | `SAST-006` | `EXP-006` | `EV-013` | `TC-SAST-006` | `POST /public/v1/ehastakshar/response` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-003** | `THR-STRIDE-003` | `DREAD-03` | `SAST-007` | `EXP-007` | `EV-014` | `TC-SAST-007` | `POST /private/v1/ehastakshar/initiate` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| *[Unassigned]* | `THR-STRIDE-006` | `DREAD-06` | `SAST-008` | `EXP-008` | `EV-015` | `TC-SAST-008` | `PUT /user-management/private/v1/users/{id}` | `user-management` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-006** | `THR-STRIDE-005` | `DREAD-05` | `SAST-009` | `EXP-009` | `EV-005` | `TC-SAST-009` | `GET /revenue/private/v1/draft/district/view/{id}` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-006** | `THR-STRIDE-005` | `DREAD-05` | `SAST-010` | `EXP-010` | `EV-005` | `TC-SAST-010` | `DELETE /revenue/private/v1/draft-entities/{id}` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-005** | `THR-STRIDE-018` | `DREAD-18` | `SAST-011` | `EXP-011` | `EV-020` | `TC-SAST-011` | `GET /user-management/private/v1/users` | `user-management, revenue, auth-service` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-007** | `THR-STRIDE-007` | `DREAD-07` | `SAST-012` | `EXP-012` | `EV-002` | `TC-SAST-012` | `GET /user-management/private/v1/resources` | `api-gateway, auth-service` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| *[Unassigned]* | `THR-STRIDE-004` | `DREAD-04` | `SAST-013` | `EXP-013` | `EV-003` | `TC-SAST-013` | `GET /auth/public/v1/auth/../../user-management/private/v1/users` | `api-gateway` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| *[Unassigned]* | *[Unassigned]* | *[Unassigned]* | `SAST-014` | `EXP-014` | `EV-004` | `TC-SAST-014` | `GET /user-management/private/v1/resources` | `api-gateway` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-019** | `THR-STRIDE-015` | `DREAD-15` | `SAST-015` | `EXP-015` | `EV-016` | `TC-SAST-015` | `GET /user-management/private/v1/users` | `api-gateway` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| *[Unassigned]* | `THR-STRIDE-014 (Mitigation)` | `DREAD-14` | `SAST-016` | `EXP-016` | `EV-006` | `TC-SAST-016` | `POST /audit/auth/public/v1/auth/login` | `api-gateway` | **PARTIALLY_VERIFIED** | **PARTIALLY_VERIFIED (CSP Verified / HSTS Pending TLS)** |
| *[Unassigned]* | *[Unassigned]* | *[Unassigned]* | `SAST-017` | `EXP-017` | `EV-017` | `TC-SAST-017` | `POST /auth/public/v1/auth/login` | `auth-service` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-018** | `THR-STRIDE-015` | `DREAD-15` | `SAST-018` | `EXP-018` | `EV-018` | `TC-SAST-018` | `POST /revenue/private/v1/attachments/upload` | `revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-013** | `THR-STRIDE-013` | `DREAD-13` | `SAST-019` | `EXP-019` | `EV-019A / EV-019B` | `TC-SAST-019` | `GET /swagger-ui/index.html` | `api-gateway, user-management, revenue` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-021** | `THR-STRIDE-002` | `DREAD-02` | `SAST-020` | `EXP-020` | `EV-007A / EV-007B` | `TC-SAST-020` | `GET /eureka/apps` | `discovery` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| *[Unassigned]* | *[Unassigned]* | *[Unassigned]* | `SAST-021` | `EXP-021` | `EV-008` | `TC-SAST-021` | `GET /revenue/test/api1` | `revenue` | **PARTIALLY_VERIFIED** | **PARTIALLY_VERIFIED** |
| *[Observation]* | *[Unassigned]* | *[Unassigned]* | — | — | `EV-021` | `TC-OBS-SQLI-001` | All 24 JPA Repositories | `revenue, user-management` | **CONFIRMED_SECURE / FALSE_POSITIVE** | **RETEST_PASSED** |

> [!NOTE]
> **EV Crosswalk Reconciliations (Superseded Mappings Preserved in Audit Trail):**
> - `EXP-013` maps to `EV-003` (superseding preliminary report typo `EV-012`).
> - `EXP-014` maps to `EV-004` (superseding preliminary report typo `EV-013`).
> - `EXP-016` maps to `EV-006` (superseding preliminary report typo `EV-015`).
> - `EXP-019` maps to `EV-019` (superseding preliminary report typo `EV-018`).
> - `EXP-020` maps to `EV-007A` (unauthenticated 401) and `EV-007B` (authenticated 200) (superseding preliminary report typo `EV-019`).
> - `EXP-021` maps to `EV-008` (superseding preliminary report typo `EV-021`).
> - `EV-021` is retained solely for the JPA SQL-injection parameterization refutation observation (`TC-OBS-SQLI-001`).
> - **Master Matrix Architecture & Scope:** Table 2.1 represents the SAST-anchored traceability matrix, establishing concrete code-level traceability for all 21 SAST findings and the standalone JPA SQLi parameterization observation (`OBS-SQLI-01`). To ensure 100% bidirectional traceability for all baseline findings (including orchestration and configuration findings that do not originate from Java application source code), a dedicated Phase 0 Baseline Finding Crosswalk is established in Table 2.2 below.

---

### 2.2 Comprehensive Phase 0 Baseline Finding Crosswalk (All 23 Baseline Findings + 1 Safety Observation)

| Baseline VULN ID | Baseline Finding Title / Description | Primary Remediation Category | Primary STRIDE Threat(s) | Architectural Defense / Implementation Summary | Primary SAST ID | Remediation Status | Independent Retest Status |
|:---:|:---|:---|:---|:---|:---:|:---:|:---:|
| **VULN-001** | Static HMAC Secret in Properties | Java Source Hardening | `THR-STRIDE-001` | Externalized to mandatory `${JWT_SECRET}`; startup validator fails closed (>=256 bits entropy) | `SAST-001` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-002** | XML External Entity (XXE) Injection | Java Source Hardening | `THR-STRIDE-003` | Disallow doctype decl, external DTDs, external parameter entities in `XmlSignatureUtil.java` | *[Unassigned — Defensive Code]* | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-003** | eSign Digital Signature Bypass | Java Source Hardening | `THR-STRIDE-003`, `THR-STRIDE-008` | Enforced `secureValidation = true`, CDAC trust anchor cert check, SecureRandom PRNG, and Redis replay prevention | `SAST-003`–`007` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-004** | Overly Permissive CORS with Wildcards | Gateway Configuration | *[Unassigned]* | Restricted CORS allowed origins, methods, and headers in `CorsConfig.java` / `EsignPrimaryController.java` | *[Unassigned — Config]* | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-005** | Complete Absence of Method Security | Java Source Hardening | `THR-STRIDE-018` | Placed `@PreAuthorize` across all controller endpoints in `user-management`, `revenue`, `auth-service` | `SAST-011` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-006** | State/District Tenant Boundary BOLA | Java Source Hardening | `THR-STRIDE-005`, `THR-STRIDE-019` | Injected `UserContext` and enforced strict state/district equality checks returning HTTP 403 Forbidden | `SAST-009`, `SAST-010` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-007** | Distributed Token Revocation Bypass | Gateway / Cache Integration | `THR-STRIDE-007` | Reactive Redis blacklist inspection (`blacklist:jti:<jti>`) in `AuthenticationFilter` failing closed with 503 | `SAST-012` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-008** | Plaintext JWT Bearer Token Leakage | Gateway Logging Hardening | `THR-STRIDE-010` | Regex masking of Authorization header and Bearer tokens in `ApiLoggingFilter.java` and Logback configs | *[Unassigned — Filter Masking]* | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-009** | Direct Container Port Exposure | Docker Compose Host-Port Unmapping | `THR-STRIDE-004`, `THR-STRIDE-012` | Unmapped microservice ports (18090, 18089, 18062), DB port (5432) unmapped, Redis loopback-restricted `127.0.0.1:6379:6379`; Gateway exclusive ingress (8092) | *[Unassigned — Orchestration Hardening]* | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-010** | Username Enumeration via Errors | Java Source Hardening | `THR-STRIDE-016` | Standardized authentication error responses to `"Invalid username or password"` in `AuthServiceImpl` | *[Unassigned — Service Hardening]* | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-011** | Absence of Password Complexity Policy | Java Source Hardening | `THR-STRIDE-016` | Enforced password complexity regex policy (upper, lower, digit, special, >=8 chars) in user validators | *[Unassigned — Validator]* | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-012** | Vulnerable Frontend Dependencies | Frontend Dependency Review | *[Unassigned]* | Outbound JSON export only; backend validation; scheduled for ExcelJS replacement in Phase 10 | `SCA-009`, `SCA-010` | **PARTIALLY_MITIGATED** | **RETEST_PASSED (RR-08/09)** |
| **VULN-013** | Swagger / OpenAPI UI in Production | Spring Configuration | `THR-STRIDE-013` | Added `@Profile("!prod")` on `SwaggerConfig.java` in `user-management` and `revenue`; Gateway route blocking | `SAST-019` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-014** | Containers Running as Root | Container Runtime | *[Unassigned]* | Host ports unmapped; internal bridge isolation; non-root user creation queued for Phase 9 | `SCA-012` | **PARTIALLY_MITIGATED** | **RETEST_PASSED (RR-06)** |
| **VULN-015** | Absence of Ingress Rate Limiting | Gateway Filter Configuration | `THR-STRIDE-016` | Configured Redis token-bucket rate limiter filter in `api-gateway` | *[Unassigned — Filter]* | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-016** | Missing HTTP Security Headers | Gateway Response Filter | *[Unassigned]* | Enforced CSP, nosniff, DENY in `SecurityHeadersFilter.java`; HSTS emission pending active TLS termination | *[Unassigned]* *(Mitigation: `SAST-016`)* | **VERIFIED_FIXED** | **PARTIALLY_VERIFIED (CSP Verified / HSTS Pending TLS)** |
| **VULN-017** | Plaintext DB Password in Config | Configuration & Vault | `THR-STRIDE-012 (Amplifier)` | Externalized `${DB_PASSWORD}` without default fallback; startup fails closed in prod; port 5432 unmapped | `SAST-002` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-018** | High Memory on Large File Uploads | Java Source Hardening | `THR-STRIDE-015` | Multi-layer file validation in `EsignPrimaryController.java`: empty check, 5MB ceiling, PDF MIME/magic bytes | `SAST-018` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-019** | Gateway Unbounded Response Buffering | Gateway Filter Hardening | `THR-STRIDE-015`, `THR-STRIDE-017` | Bounded memory buffer capped at 10KB with `[... TRUNCATED ...]` marker in `ApiLoggingFilter.java` | `SAST-015` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-020** | Absence of Refresh Token Rotation | Identity Architecture | *[Unassigned]* | Token revocation active via Redis; architectural migration to short-lived access + refresh tokens queued Phase 5 | *[Unassigned — Identity]* | **PARTIALLY_MITIGATED** | **RETEST_PASSED (RR-01/03)** |
| **VULN-021** | Unauthenticated Eureka Discovery | Infrastructure Security | `THR-STRIDE-002` | Added Spring Security HTTP Basic Auth to Eureka; port 8761 unmapped from host network | `SAST-020` | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-022** | Open Redirect in Client Router | Frontend Router Hardening | *[Unassigned]* | Strict relative path validation and origin checks in React frontend routing logic | *[Unassigned — Frontend]* | **VERIFIED_FIXED** | **RETEST_PASSED** |
| **VULN-023** | SheetJS Prototype Pollution | Frontend Dependency Review | *[Unassigned]* | Sanitized data flow; restricted to outbound export; queued for replacement in Phase 10 | `SCA-009` | **PARTIALLY_MITIGATED** | **RETEST_PASSED (RR-08)** |
| **OBS-SQLI-01** | JPA SQL-Injection Hypothesis | JPA Repository Audit | *[Unassigned]* | AST audit of all 24 JPA repositories + 25 dynamic fuzzing injection vectors confirm strict parameterization | *[Unassigned — Observation]* | **CONFIRMED_SECURE / FALSE_POSITIVE** | **RETEST_PASSED (`EV-021`)** |

> [!NOTE]
> **VULN-009 Dynamic Retest & Evidence Attribution:**
> In accordance with the canonical register, baseline finding `VULN-009` (Direct Container Port Exposure) has primary remediation `Docker Compose Host-Port Unmapping` and primary SAST `*[Unassigned — Orchestration Hardening]*`. It has `[No dedicated EXP/EV mapping identified]` because dynamic penetration testing focuses on application routes. Dynamic exploit vectors `EXP-009` (mapped to `VULN-006` / `SAST-009`), `EXP-011` (mapped to `VULN-005` / `SAST-011`), and `EXP-020` (mapped to `VULN-021` / `SAST-020`) are not assigned to `VULN-009`. Verification evidence consists of Docker Compose configuration inspection (`docker-compose.yml`, `EVD-P0-02`, [DOCKER_SECURITY_CONFIGURATION_REVIEW.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DOCKER_SECURITY_CONFIGURATION_REVIEW.md)) and network/port probes (`EVD-P1-01`, `EVD-P1-08`, `EVD-P4-10` / `RR-05`).

---

### 2.3 Phase 4 Software Composition Analysis (SCA) Traceability Matrix

| SCA ID | Component / Package | Installed Version | Direct / Transitive | CVE / Advisory | CVSS | Severity | CWE | Affected Module(s) | Remediation Status | Residual Risk Ref | Retest Evidence |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|:---:|:---:|:---|
| **SCA-001** | `org.postgresql:postgresql` | `42.6.0` | Transitive | CVE-2024-1597 | **10.0** | **Critical** | CWE-89 | revenue | **VERIFIED_FIXED** | N/A | Upgraded to `42.6.2` in `revenue/pom.xml`; 22 tests passed |
| **SCA-002** | `org.apache.tomcat.embed:tomcat-embed-core` | `10.1.18-33` | Transitive | CVE-2024-50379<br>CVE-2024-56337 | **9.8** | **Critical** | CWE-367 / CWE-434 | gateway, auth, revenue, um | **VERIFIED_FIXED** | N/A | Pinned `<tomcat.version>10.1.34</tomcat.version>`; 289 tests passed |
| **SCA-003** | `org.springframework:spring-web` | `6.1.3` | Transitive | CVE-2024-22243<br>CVE-2024-22259 | **8.1** | **High** | CWE-601 / CWE-918 | revenue | **VERIFIED_FIXED** | N/A | Upgraded parent to 3.2.12 (`spring-web:6.1.15`); 22 tests passed |
| **SCA-004** | `org.springframework:spring-web` / `webmvc` | `6.1.3-15` | Transitive | CVE-2024-38807<br>CVE-2024-38816<br>CVE-2024-38819 | **7.5** | **High** | CWE-22 / CWE-1333 | gateway, auth, revenue, um | **PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE** | **RR-11** | `RouteValidator` blocks `..`; WebMvc.fn unused; pending formal risk sign-off |
| **SCA-005** | `org.springframework.security:spring-security-*` | `6.2.1-8` | Transitive | CVE-2024-22234<br>CVE-2024-22257<br>CVE-2024-38821<br>CVE-2025-22228<br>*(CVE-2024-38828 dispositioned)* | **7.5** | **High** | CWE-285 / CWE-863 | gateway, auth, revenue, um | **VERIFIED_FIXED** | N/A | Upgraded to `6.3.8` across 4 services; CVE-2024-38828 dispositioned as Framework 5.3.x DoS false positive; 289 tests passed |
| **SCA-006** | `io.netty:netty-*` | `4.1.105.Final`| Transitive | CVE-2024-29025<br>CVE-2024-47535 | **7.5** | **High** | CWE-400 / CWE-770 | revenue | **VERIFIED_FIXED** | N/A | Upgraded to `4.1.115.Final` via Boot 3.2.12; 22 tests passed |
| **SCA-007** | `ch.qos.logback:logback-*` | `1.4.14` | Transitive | CVE-2024-12798<br>CVE-2024-12801 | **7.5** | **High** | CWE-502 / CWE-20 | auth, revenue, um | **PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE** | **RR-11** | Zero SocketReceivers configured; console/file only; pending formal risk sign-off |
| **SCA-008** | `org.mindrot:jbcrypt` | `0.4` | Direct | CWE-1104 | **5.3** | **Medium** | CWE-1104 | auth, um | **DEFERRED (QUEUED FOR PHASE 5 & 7)** | **RR-10** | SecureRandom verified; planned Spring BCryptPasswordEncoder migration in Phase 5 & 7 |
| **SCA-009** | `xlsx` | `0.18.5` | Direct | CVE-2023-30533<br>CVE-2024-22363 | **7.8** | **High** | CWE-1321 / CWE-1333 | lgd_react | **PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE** | **RR-08** | Outbound JSON export only; zero untrusted ingestion; queued for ExcelJS in Phase 10 |
| **SCA-010** | `zod` | `3.25.76` | Direct | GHSA-mrhx-c7xc-m3w5 | **7.5** | **High** | CWE-770 | lgd_react | **PARTIALLY MITIGATED / PENDING_FORMAL_ACCEPTANCE** | **RR-09** | Shallow form validation only; backend @Valid enforcement; queued for Zod 4 in Phase 10 |
| **SCA-011** | `spring-boot-starter-parent` | `3.2.2` (revenue) | Direct | Architecture Drift | **6.5** | **Medium** | CWE-1104 | revenue | **VERIFIED_FIXED** | N/A | Upgraded `revenue` to `3.2.12`; unified core baseline |
| **SCA-012** | Container Base Image | `21-jdk` | Direct | Container Context | **6.5** | **Medium** | CWE-250 | all Dockerfiles | **DEFERRED (QUEUED FOR PHASE 9)** | **RR-06** | Host ports unbound; non-root user queued for Phase 9 |

---

## 3. Baseline & SAST Disentanglement Rationale

### 3.1 Unassigned Baseline References for Specific SAST Findings
In adherence to the core audit integrity mandate (*"Where a SAST finding has no appropriate original VULN mapping, leave the baseline reference unassigned and explain why. Never create a false link."*):
1. **SAST-008 (Mass Assignment in User Update):** Left unassigned from Phase 0 VULN baseline. Discovered during Phase 2 static AST inspection of `UserMapper.java`. Phase 0 baseline `VULN-004` was originally "Overly Permissive CORS with Wildcard Reflection and Credentials".
2. **SAST-013 (RouteValidator Wildcard Exclusions):** Left unassigned from Phase 0 VULN baseline. Discovered during Phase 2 deep code review of gateway path normalization. Phase 0 baseline `VULN-009` was "Direct Container Port Exposure & Open Eureka".
3. **SAST-014 (Client IP Spoofing in Audit Logger):** Left unassigned from Phase 0 VULN baseline and Phase 1 STRIDE/DREAD threat registers. Discovered during Phase 2 static review of `ApiLoggingFilter.getClientIp()` (`CWE-290: IP Spoofing`). It was not modeled as a discrete threat in the Phase 1 STRIDE register (`THR-STRIDE-001` through `THR-STRIDE-020`). STRIDE and DREAD are maintained unassigned (`*[Unassigned]*`) everywhere to preserve threat modeling integrity and prevent conflation with `THR-STRIDE-009` (which specifically addresses database entity modification audit trails, `CWE-778`) or `THR-STRIDE-010` (which addresses Bearer token logging, `CWE-532`).
4. **SAST-017 (Missing @Valid on Login DTO):** Left unassigned from Phase 0 VULN baseline and Phase 1 STRIDE/DREAD threat registers. Discovered during Phase 2 inspection of `AuthSecondaryController.java`. Addresses missing bean validation on authentication payloads (`CWE-20: Improper Input Validation`). Maintained strictly unassigned from brute-force / credential-stuffing threats (`THR-STRIDE-016` / `DREAD-16` / `CWE-307`, which is mitigated by Redis token-bucket rate limiting) and distinct from ReDoS input validation threats.
5. **SAST-021 (Exposed Test Controller in Revenue):** Left unassigned from Phase 0 VULN baseline and Phase 1 STRIDE/DREAD threat registers. Discovered during Phase 2 controller census. Addresses active debug code (`TestController.java`, `CWE-489`). Maintained strictly unassigned from unrelated Swagger/OpenAPI documentation exposure (`THR-STRIDE-013` / `VULN-013`) and operational Spring Boot Actuator metric exposure (`THR-STRIDE-011` / `*[Unassigned Phase 0]*`). Retained as `PARTIALLY_VERIFIED` pending direct downstream revenue container check of bean/handler absence.

### 3.2 Clarification of VULN-002 and VULN-010 / JPA SQLi Hypothesis
1. **VULN-002 (XML External Entity Injection):** **GENUINE VULNERABILITY — VERIFIED_FIXED.** The initial codebase lacked entity expansion restrictions in `XmlSignatureUtil.java`. Defensive code changes (`disallow-doctype-decl = true`, `external-general-entities = false`, `external-parameter-entities = false`, `load-external-dtd = false`, `setXIncludeAware(false)`) remediated this vulnerability. It is NOT classified as a false positive.
2. **VULN-010 (Username Enumeration on Login):** **VERIFIED_FIXED.** Differentiated error responses were standardized in `AuthServiceImpl` to uniform message `"Invalid username or password"`.
3. **OBS-SQLI-01 / EV-021 (JPA SQL-Injection Hypothesis):** **CONFIRMED_SECURE / FALSE_POSITIVE.** Independently investigated observation. Audited all 24 JPA repository interfaces and tested 25 SQL injection payloads; verified safe named parameter binding.

---

## 4. Detailed Finding Traceability & Remediation Records

### SAST-001: Hardcoded Static JWT HMAC Secret Key Across Microservices

- **Original Finding ID:** `SAST-001`
- **Original Phase References:** Phase 0: `VULN-001` | Phase 1: `THR-STRIDE-001` | Phase 3: `EXP-001 / EV-001`
- **Title:** Hardcoded Static JWT HMAC Secret Key Across Microservices
- **Severity:** **Critical** (CVSS v4.0: 9.8)
- **Confidence:** High
- **Affected Module:** `api-gateway, auth-service, user-management, revenue`
- **Source File & Method:** `application.properties (jwt.secret)`
- **CWE Identifier:** `CWE-798`
- **Original Evidence Reference:** `EXP-001 / EV-001`
- **Root Cause:** Static 64-byte HMAC secret key hardcoded in properties across all microservices without environment override support.
- **Required Remediation:** Externalize jwt.secret to environment variables with fallback default; prepare asymmetric RS256 migration.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-002: Hardcoded Plaintext Database Password in Configuration Files

- **Original Finding ID:** `SAST-002`
- **Original Phase References:** Phase 0: `VULN-017` | Phase 1: `THR-STRIDE-012 (Amplifier)` | Phase 3: `EXP-002 / EV-009`
- **Title:** Hardcoded Plaintext Database Password in Configuration Files
- **Severity:** **Critical** (CVSS v4.0: 9.8)
- **Confidence:** High
- **Affected Module:** `api-gateway, auth-service, user-management, revenue`
- **Source File & Method:** `application.properties (spring.datasource.password)`
- **CWE Identifier:** `CWE-798 / CWE-259`
- **Original Evidence Reference:** `EXP-002 / EV-009`
- **Mapping Rationale & Disentanglement:** SAST-002 addresses hardcoded plaintext PostgreSQL credentials committed to repository configuration files (`CWE-798/259`). In contrast, `THR-STRIDE-012` addresses the architectural exposure of PostgreSQL host port 5432 to external networks (`CWE-284`). While hardcoded credentials magnify the risk of unauthorized database access if port 5432 is exposed, the configuration vulnerability is distinct from the network port binding. Both have been remediated independently.
- **Required Remediation:** Externalize database credentials to mandatory environment variables without hardcoded fallbacks; fail startup if missing; unbind host port 5432.
- **DAST Confirmation Status:** **PARTIALLY CONFIRMED**
- **Remediation Status:** **VERIFIED_FIXED**
- **Retest Status:** **RETEST_PASSED**
- **Test Evidence:** Verified via unit/integration test suite, startup validator, and container port isolation.
- **Residual Risk:** Low / Managed through automated verification.

---

### SAST-003: Hardcoded e-Hastakshar PKCS#12 Keystore Password

- **Original Finding ID:** `SAST-003`
- **Original Phase References:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-003 / EV-010`
- **Title:** Hardcoded e-Hastakshar PKCS#12 Keystore Password
- **Severity:** **Critical** (CVSS v4.0: 9.8)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `esign.properties (esign.keystore.password)`
- **CWE Identifier:** `CWE-798`
- **Original Evidence Reference:** `EXP-003 / EV-010`
- **Mapping Rationale & Disentanglement:** SAST-003 addresses the hardcoded PKCS#12 keystore password in `esign.properties` (`CWE-798`). Keystore compromise enables attackers to extract private signing keys to forge CDAC e-Hastakshar requests and ASP callbacks (`THR-STRIDE-003`). This is distinct from `THR-STRIDE-008`, which represents tampering with pre-signing PDF document hashes (`CWE-354`).
- **Required Remediation:** Externalize `esign.keystore.password` to mandatory environment variable without fallback default; require secure keystore injection at runtime.
- **DAST Confirmation Status:** **PARTIALLY CONFIRMED**
- **Remediation Status:** **VERIFIED_FIXED**
- **Retest Status:** **RETEST_PASSED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.

---

### SAST-004: Explicit Disabling of XML Digital Signature Secure Validation (secureValidation: FALSE)

- **Original Finding ID:** `SAST-004`
- **Original Phase References:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-004 / EV-011`
- **Title:** Explicit Disabling of XML Digital Signature Secure Validation (secureValidation: FALSE)
- **Severity:** **Critical** (CVSS v4.0: 9.6)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `XmlSignatureUtil.java:147`
- **CWE Identifier:** `CWE-347`
- **Original Evidence Reference:** `EXP-004 / EV-011`
- **Root Cause:** XMLSignatureFactory explicit configuration disables secure validation, allowing XML Signature Wrapping (XSW).
- **Required Remediation:** Set secureValidation property to Boolean.TRUE in XMLSignatureFactory.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **PARTIALLY CONFIRMED**

---

### SAST-005: Untrusted Certificate Public Key Acceptance in XMLDSig KeySelector

- **Original Finding ID:** `SAST-005`
- **Original Phase References:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-005 / EV-012`
- **Title:** Untrusted Certificate Public Key Acceptance in XMLDSig KeySelector
- **Severity:** **Critical** (CVSS v4.0: 9.6)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `X509KeySelector.java:60-76`
- **CWE Identifier:** `CWE-295 / CWE-347`
- **Original Evidence Reference:** `EXP-005 / EV-012`
- **Root Cause:** KeySelector blindly trusts and returns the public key embedded inside the incoming XML KeyInfo element without chain verification.
- **Required Remediation:** Validate embedded X509Certificate against system truststore / trust anchor certificate.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **PARTIALLY CONFIRMED**

---

### SAST-006: Conditional Bypass of eSign Verification via Configuration Flag

- **Original Finding ID:** `SAST-006`
- **Original Phase References:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-006 / EV-013`
- **Title:** Conditional Bypass of eSign Verification via Configuration Flag
- **Severity:** **High** (CVSS v4.0: 8.8)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `EsignService.java:157`
- **CWE Identifier:** `CWE-347 / CWE-306`
- **Original Evidence Reference:** `EXP-006 / EV-013`
- **Root Cause:** Failed ESP signatures bypassed when esign.enforce-signature is false; development code allowed invalid signature progression.
- **Required Remediation:** Enforce signature check by default; throw SecurityException when validation fails; profile-gate test bypass.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **PARTIALLY CONFIRMED**

---

### SAST-007: Insecure Pseudo-Random Number Generator for eSign Transaction IDs

- **Original Finding ID:** `SAST-007`
- **Original Phase References:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003` | Phase 3: `EXP-007 / EV-014`
- **Title:** Insecure Pseudo-Random Number Generator for eSign Transaction IDs
- **Severity:** **High** (CVSS v4.0: 7.5)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `EsignService.java (Random random = new Random())`
- **CWE Identifier:** `CWE-338`
- **Original Evidence Reference:** `EXP-007 / EV-014`
- **Root Cause:** java.util.Random used to generate 6-digit eSign transaction IDs with only 900,000 possible states.
- **Required Remediation:** Replace java.util.Random with java.security.SecureRandom and use cryptographically strong tokens.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-008: Mass Assignment / Unsafe Object Binding in User Update Endpoint

- **Original Finding ID:** `SAST-008`
- **Original Phase References:** Phase 0: `*[Unassigned]*` | Phase 1: `THR-STRIDE-006` | Phase 3: `EXP-008 / EV-015`
- **Title:** Mass Assignment / Unsafe Object Binding in User Update Endpoint
- **Severity:** **High** (CVSS v4.0: 9.4)
- **Confidence:** High
- **Affected Module:** `user-management`
- **Source File & Method:** `UpdateUserDto.java & UserServiceImpl.java`
- **CWE Identifier:** `CWE-915`
- **Original Evidence Reference:** `EXP-008 / EV-015`
- **Root Cause:** UpdateUserDto accepted sensitive administrative attributes (passwordHash, specificRoleId, userType) during normal user profile updates.
- **Required Remediation:** Explicitly allowlist editable fields in UpdateUserDto and sanitize incoming payload in service layer.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-009: Broken Object Level Authorization (BOLA / IDOR) on Draft Viewing & File Downloads

- **Original Finding ID:** `SAST-009`
- **Original Phase References:** Phase 0: `VULN-006` | Phase 1: `THR-STRIDE-005` | Phase 3: `EXP-009 / EV-005`
- **Title:** Broken Object Level Authorization (BOLA / IDOR) on Draft Viewing & File Downloads
- **Severity:** **High** (CVSS v4.0: 9.1)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `DistrictServiceImpl.java (/draft/district/view/{draftCode})`
- **CWE Identifier:** `CWE-639`
- **Original Evidence Reference:** `EXP-009 / EV-005`
- **Root Cause:** Draft viewing and file retrieval queries lacked caller stateCode verification against the requested draft.
- **Required Remediation:** Validate userContext.getStateCode() matches districtDraft.getStateCode() before returning draft data or attachments.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-010: Unauthorized Draft Entity Deletion via Missing Tenant/Ownership Checks

- **Original Finding ID:** `SAST-010`
- **Original Phase References:** Phase 0: `VULN-006` | Phase 1: `THR-STRIDE-005` | Phase 3: `EXP-010 / EV-005`
- **Title:** Unauthorized Draft Entity Deletion via Missing Tenant/Ownership Checks
- **Severity:** **High** (CVSS v4.0: 9.1)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `DraftEntityServiceImpl.java (/draft/delete/{draftCode}/{entityType})`
- **CWE Identifier:** `CWE-639 / CWE-862`
- **Original Evidence Reference:** `EXP-010 / EV-005`
- **Root Cause:** Draft deletion executed database stored procedure or entity deletion without checking caller state ownership.
- **Required Remediation:** Enforce tenant ownership validation: verify draft belongs to caller state before executing deletion.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-011: Complete Absence of Method-Level Security Annotations Across All Controllers

- **Original Finding ID:** `SAST-011`
- **Original Phase References:** Phase 0: `VULN-005` | Phase 1: `THR-STRIDE-018 / DREAD-18` | Phase 3: `EXP-011 / EV-020`
- **Title:** Complete Absence of Method-Level Security Annotations Across All Controllers
- **Severity:** **High** (CVSS v4.0: 8.8)
- **Confidence:** High
- **Affected Module:** `user-management, revenue, auth-service`
- **Source File & Method:** `All REST Controllers (zero @PreAuthorize annotations)`
- **CWE Identifier:** `CWE-862 / CWE-285`
- **Original Evidence Reference:** `EXP-011 / EV-020`
- **Root Cause:** Controllers rely solely on perimeter authentication filter; no fine-grained role or privilege checks present at method level.
- **Required Remediation:** Enable @EnableMethodSecurity(prePostEnabled = true) and add @PreAuthorize checks on administrative and sensitive operations.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-012: Failure to Verify Redis Token Blacklist in API Gateway and Downstream Services

- **Original Finding ID:** `SAST-012`
- **Original Phase References:** Phase 0: `VULN-007` | Phase 1: `THR-STRIDE-007` | Phase 3: `EXP-012 / EV-002`
- **Title:** Failure to Verify Redis Token Blacklist in API Gateway and Downstream Services
- **Severity:** **High** (CVSS v4.0: 8.6)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `AuthenticationFilter.java`
- **CWE Identifier:** `CWE-613`
- **Original Evidence Reference:** `EXP-012 / EV-002`
- **Root Cause:** API Gateway only verified JWT cryptographic signature and expiration, ignoring the Redis revocation blacklist.
- **Required Remediation:** Integrate Redis token revocation check in AuthenticationFilter using ReactiveStringRedisTemplate.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-013: Overly Broad Public Endpoint Exclusions via Wildcard Pattern in RouteValidator

- **Original Finding ID:** `SAST-013`
- **Original Phase References:** Phase 0: `[Unassigned]` | Phase 1: `THR-STRIDE-004` | Phase 3: `EXP-013 / EV-003`
- **Title:** Overly Broad Public Endpoint Exclusions via Wildcard Pattern in RouteValidator
- **Severity:** **High** (CVSS v4.0: 8.2)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `RouteValidator.java (/**/public/**)`
- **CWE Identifier:** `CWE-284`
- **Original Evidence Reference:** `EXP-013 / EV-003`
- **Root Cause:** AntPathMatcher pattern /**/public/** allowed path traversal or segment spoofing (/public/..;/) to bypass authentication filter.
- **Required Remediation:** Replace wildcard pattern with exact service-prefixed public path matchers and normalize URI paths.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-014: Client IP Spoofing via Unvalidated X-Forwarded-For Header in Audit Logger

- **Original Finding ID:** `SAST-014`
- **Original Phase References:** Phase 0: `*[Unassigned]*` | Phase 1: `*[Unassigned]*` | Phase 3: `EXP-014 / EV-004`
- **Title:** Client IP Spoofing via Unvalidated X-Forwarded-For Header in Audit Logger
- **Severity:** **Medium** (CVSS v4.0: 7.1)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `ApiLoggingFilter.java`
- **CWE Identifier:** `CWE-290`
- **Original Evidence Reference:** `EXP-014 / EV-004`
- **Mapping Rationale & Disentanglement:** SAST-014 addresses the blind trust of unvalidated `X-Forwarded-For` HTTP headers in `ApiLoggingFilter.getClientIp()`, permitting attackers to inject arbitrary spoofed IP addresses into audit logs (`CWE-290`). It was discovered during Phase 2 static AST review and was not modeled as a discrete threat in the Phase 1 STRIDE register. It is maintained strictly unassigned (`*[Unassigned]*`) from STRIDE and DREAD everywhere to preserve threat modeling integrity and prevent conflation with `THR-STRIDE-009` (which specifically addresses database entity modification audit trails, `CWE-778`) or `THR-STRIDE-010` (which addresses Bearer token logging, `CWE-532`).
- **Required Remediation:** Validate IP syntax with strict IPv4/IPv6 regex, prioritize TCP socket remoteAddress, and strip untrusted headers.
- **DAST Confirmation Status:** **CONFIRMED**
- **Remediation Status:** **VERIFIED_FIXED**
- **Retest Status:** **RETEST_PASSED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.

---

### SAST-015: Unbounded Response Body Memory Buffering in Gateway Logging Filter

- **Original Finding ID:** `SAST-015`
- **Original Phase References:** Phase 0: `VULN-019` | Phase 1: `THR-STRIDE-015` | Phase 3: `EXP-015 / EV-016`
- **Title:** Unbounded Response Body Memory Buffering in Gateway Logging Filter
- **Severity:** **Medium** (CVSS v4.0: 7.5)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `ApiLoggingFilter.java:191-196`
- **CWE Identifier:** `CWE-400 / CWE-770`
- **Original Evidence Reference:** `EXP-015 / EV-016`
- **Root Cause:** DataBufferUtils buffers entire response payload into memory for logging without maximum length constraint.
- **Required Remediation:** Limit response body buffer size to max 10KB and truncate larger responses for logging.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **PARTIALLY CONFIRMED**

---

### SAST-016: Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter

- **Original Finding ID:** `SAST-016`
- **Original Phase References:** Phase 0: `*[Unassigned]*` | Phase 1: `THR-STRIDE-014 (Defense-in-Depth Mitigation)` | Phase 3: `EXP-016 / EV-006`
- **Title:** Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter
- **Severity:** **Low** (CVSS v4.0: 6.8)
- **Confidence:** High
- **Affected Module:** `api-gateway`
- **Source File & Method:** `SecurityHeadersFilter.java`
- **CWE Identifier:** `CWE-693`
- **Original Evidence Reference:** `EXP-016 / EV-006`
- **Mapping Rationale & Disentanglement:** SAST-016 provides defense-in-depth mitigation (Gateway Content-Security-Policy and response security headers) to counter client-side script execution and token exfiltration under `THR-STRIDE-014`. Phase 0 baseline finding `VULN-016` (missing HTTP security headers, `CWE-693`) has no direct Phase 0-to-STRIDE vulnerability mapping in `STRIDE_Threat_Register.md` and remains `[Unassigned]` for direct baseline threat mapping, while SAST-016 is retained as a defensive control linkage.
- **Root Cause:** Missing SecurityHeadersFilter in gateway active filter chain.
- **Required Remediation:** Implement SecurityHeadersFilter applying CSP, HSTS, X-Content-Type-Options, X-Frame-Options headers.
- **Implementation Status:** **PARTIALLY_VERIFIED**
- **Retest Status:** **PARTIALLY_VERIFIED (CSP & Security Headers Verified on HTTP; HSTS Pending Ingress TLS)**
- **Test Evidence:** Verified via unit/integration test suite (`SecurityHeadersFilterTest`) and live HTTP header inspection. Strict-Transport-Security header is emitted by filter, but RFC 6797 compliance requires genuine TLS termination (queued for Phase 9).
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **PARTIALLY_VERIFIED**

---

### SAST-017: Missing Bean Validation Annotation (@Valid) on Login Request Controller

- **Original Finding ID:** `SAST-017`
- **Original Phase References:** Phase 0: `*[Unassigned]*` | Phase 1: `*[Unassigned]*` | Phase 3: `EXP-017 / EV-017`
- **Title:** Missing Bean Validation Annotation (@Valid) on Login Request Controller
- **Severity:** **Medium** (CVSS v4.0: 6.5)
- **Confidence:** High
- **Affected Module:** `auth-service`
- **Source File & Method:** `AuthSecondaryController.java (login method)`
- **CWE Identifier:** `CWE-20`
- **Original Evidence Reference:** `EXP-017 / EV-017`
- **Mapping Rationale & Disentanglement:** SAST-017 addresses the omission of `@Valid` bean validation on authentication payloads (`CWE-20: Improper Input Validation`), permitting empty or malformed strings to trigger runtime database exceptions. It is kept strictly unassigned from brute-force flooding and credential stuffing attacks (`THR-STRIDE-016` / `DREAD-16` / `CWE-307: Improper Restriction of Excessive Authentication Attempts`, which is mitigated by Redis token-bucket rate limiting rather than payload schema validation) and distinct from ReDoS input validation threats.
- **Required Remediation:** Add `@Valid` annotation to `LoginRequest` parameter in `AuthSecondaryController` and enforce `@NotBlank` validation.
- **DAST Confirmation Status:** **CONFIRMED**
- **Remediation Status:** **VERIFIED_FIXED**
- **Retest Status:** **RETEST_PASSED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.

---

### SAST-018: Unvalidated File Upload in eSign Initiation Endpoint

- **Original Finding ID:** `SAST-018`
- **Original Phase References:** Phase 0: `VULN-018` | Phase 1: `THR-STRIDE-015` | Phase 3: `EXP-018 / EV-018`
- **Title:** Unvalidated File Upload in eSign Initiation Endpoint
- **Severity:** **High** (CVSS v4.0: 7.8)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `EsignPrimaryController.java (/private/v1/ehastakshar/initiate)`
- **CWE Identifier:** `CWE-434`
- **Original Evidence Reference:** `EXP-018 / EV-018`
- **Root Cause:** Multipart file upload accepted arbitrary file extensions without verifying PDF magic bytes or enforcing size caps.
- **Required Remediation:** Validate PDF magic bytes (%PDF-), MIME type, and enforce max file size limit (5MB).
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe.
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-019: Production Exposure of Swagger / OpenAPI Interactive Documentation

- **Original Finding ID:** `SAST-019`
- **Original Phase References:** Phase 0: `VULN-013` | Phase 1: `THR-STRIDE-013` | Phase 3: `EXP-019 / EV-019A / EV-019B`
- **Title:** Production Exposure of Swagger / OpenAPI Interactive Documentation
- **Severity:** **Low** (CVSS v4.0: 5.3)
- **Confidence:** High
- **Affected Module:** `user-management, auth-service, revenue`
- **Source File & Method:** `SwaggerConfig.java & application.properties`
- **CWE Identifier:** `CWE-200`
- **Original Evidence Reference:** `EXP-019 / EV-019A / EV-019B`
- **Root Cause:** Swagger UI and OpenAPI JSON specs publicly exposed at /v3/api-docs without authentication or profile gating.
- **Required Remediation:** Profile-gate SwaggerConfig with @Profile("!prod") or require administrative authentication.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe (separate probes for UI and docs).
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-020: Unauthenticated Service Discovery Operations on Netflix Eureka

- **Original Finding ID:** `SAST-020`
- **Original Phase References:** Phase 0: `VULN-021` | Phase 1: `THR-STRIDE-002` | Phase 3: `EXP-020 / EV-007A / EV-007B`
- **Title:** Unauthenticated Service Discovery Operations on Netflix Eureka
- **Severity:** **Medium** (CVSS v4.0: 9.8)
- **Confidence:** High
- **Affected Module:** `discovery`
- **Source File & Method:** `ServiceDiscoveryApplication.java & pom.xml`
- **CWE Identifier:** `CWE-306`
- **Original Evidence Reference:** `EXP-020 / EV-007A / EV-007B`
- **Root Cause:** Eureka server ran on port 8761 without Spring Security or HTTP Basic authentication enabled.
- **Required Remediation:** Add Spring Security HTTP Basic authentication on Eureka server and client credentials in microservices.
- **Implementation Status:** **VERIFIED_FIXED**
- **Test Evidence:** Verified via unit/integration test suite and dynamic validation probe (separate negative unauth 401 and positive auth 200 probes).
- **Residual Risk:** Low / Managed through automated verification.
- **Final Disposition:** **CONFIRMED**

---

### SAST-021: Exposed Test Controller in Revenue Service Production Code

- **Original Finding ID:** `SAST-021`
- **Original Phase References:** Phase 0: `*[Unassigned]*` | Phase 1: `*[Unassigned]*` | Phase 3: `EXP-021 / EV-008`
- **Title:** Exposed Test Controller in Revenue Service Production Code
- **Severity:** **Medium** (CVSS v4.0: 6.5)
- **Confidence:** High
- **Affected Module:** `revenue`
- **Source File & Method:** `TestController.java (/test/api1)`
- **CWE Identifier:** `CWE-489`
- **Original Evidence Reference:** `EXP-021 / EV-008`
- **Mapping Rationale & Disentanglement:** SAST-021 addresses an exposed debug/test controller (`TestController.java`) packaged in production bytecode (`CWE-489: Active Debug Code`). This is distinct and kept unassigned from `THR-STRIDE-013` / `VULN-013` (Swagger / OpenAPI documentation exposure) and `THR-STRIDE-011` / `*[Unassigned Phase 0]*` (Spring Boot Actuator endpoint exposure, `/actuator/env`, `/actuator/heapdump`, `CWE-200`). Both represent information disclosure risks, but `SAST-021` is internal diagnostic code, while `THR-STRIDE-011` is operational actuator metrics.
- **Required Remediation:** Annotate `TestController.java` with `@Profile({"dev", "test"})` so that test endpoints are never instantiated in production builds.
- **DAST Confirmation Status:** **CONFIRMED**
- **Remediation Status:** **PARTIALLY_VERIFIED**
- **Retest Status:** **PARTIALLY_VERIFIED (Gateway Perimeter Blocks with HTTP 403; Downstream Container Direct Check & Handler Census Pending)**
- **Test Evidence:** Verified via unit/integration test suite, profile gating, and perimeter access barrier (HTTP 403 Forbidden). Direct downstream container check of bean/handler absence pending.
- **Residual Risk:** Low / Managed through automated verification.

---

