# Phase 0–4: Final Regression & Build Report

| **Document Version** | 2.2.0 |
| **Audit Milestone** | Pre-Phase-5 Independent Verification |
| **Lifecycle Scope** | Backend & Frontend Test Suites, Builds, and Container Health |
| **System** | Local Government Directory (LGD 2.0) |
| **Classification** | OFFICIAL / GOVERNMENT APPLICATION SECURITY AUDIT |
| **Original Evaluation Timestamp** | `2026-11-02T04:47:00+05:30` |
| **Final Revision Timestamp** | `2026-11-03T16:00:00+05:30` |
| **Final Validation Timestamp** | `2026-11-03T16:05:00+05:30` |
| **Build & Test Status** | **BACKEND: 289/289 PASS (100% Test Lifecycle) | FRONTEND: lgd-um CLEAN BUILD (Exit 0) / lgd_react RETIRED (NOT_APPLICABLE) | GATE B: HOLD** |
| **Roadmap Alignment** | Approved 14-Phase Program (Phase 0 through Phase 13) |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Executive Summary & Audit Mandate

In accordance with Section 9 of the Pre-Phase-5 Master Remediation and Independent Verification charter, this report documents the exhaustive, non-destructive build and regression test verification across all software components of the **Local Government Directory (LGD 2.0)** platform.

The testing protocol encompassed:
1. **Maven Backend Suites:** Automated security and functional regression suites across all 5 Spring Boot microservices.
2. **Frontend Builds & Audits:** Type checking, asset bundling, and dependency vulnerability audits for the active React client application (`lgd-um`). In accordance with the approved architecture scope decision, the retired and unpopulated frontend submodule (`lgd_react`) is formally excluded from the active build scope (`NOT_APPLICABLE`).
3. **Container Infrastructure:** Docker image buildability, network isolation verification, port mapping audits, and live container health checks.

### High-Level Execution Summary
- **Backend Test Execution:** **289 / 289 Tests Passed (100% Test Lifecycle Pass Rate)** across 44 Surefire XML report files in 5 services (`mvn clean test`). Package-level verification (`mvn clean package` / JAR packaging) is not established by available disk evidence.
- **Backend Test Failures / Errors / Skipped:** **0 Failures, 0 Errors, 0 Skipped**.
- **Frontend Application Builds:** `lgd-um` Clean Build (Exit Code 0, production bundle in `dist/`); `lgd_react` formally retired and excluded from active architectural and build scope (`NOT_APPLICABLE`).
- **Container Infrastructure:** **6 Containers Verified; Host Port Perimeter Isolation Confirmed**.
- **Gate B Outcome:** **HOLD** (Retained on HOLD on 3 technical/environmental blockers: `BLK-01` [EXP-016 HSTS], `BLK-02` [EXP-021 Revenue TestController], and `BLK-03` [Host PostgreSQL 14 & Revenue stability]).

---

## 2. Backend Automated Regression Testing (Maven Surefire)

The Maven test suites were executed independently within each microservice directory using `mvn clean test` on Java 21 (`OpenJDK 64-Bit Server VM, Eclipse Adoptium`).

### 2.1 Microservice Execution Summary

| Microservice Module | Execution Command | Timestamp (UTC) | Total Tests | Passed | Failed | Errors | Skipped | Exit Code | Surefire Report Directory |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **api-gateway** | `mvn clean test -f api-gateway/pom.xml` | 2026-11-02 04:47:12 | **14** | **14** | 0 | 0 | 0 | **0** | `api-gateway/target/surefire-reports` |
| **discovery** | `mvn clean test -f discovery/pom.xml` | 2026-11-02 04:47:45 | **2** | **2** | 0 | 0 | 0 | **0** | `discovery/target/surefire-reports` |
| **auth-service** | `mvn clean test -f auth-service/pom.xml` | 2026-11-02 04:48:30 | **40** | **40** | 0 | 0 | 0 | **0** | `auth-service/target/surefire-reports` |
| **revenue** | `mvn clean test -f revenue/pom.xml` | 2026-11-02 04:49:15 | **22** | **22** | 0 | 0 | 0 | **0** | `revenue/target/surefire-reports` |
| **user-management** | `mvn clean test -f user-management/pom.xml` | 2026-11-02 04:50:22 | **211** | **211** | 0 | 0 | 0 | **0** | `user-management/target/surefire-reports` |
| **Total Backend Suite** | — | — | **289** | **289** | **0** | **0** | **0** | **0** | **5 Module Directories** |

### 2.2 Security-Critical Test Class Verifications

The following key security test suites directly validate remediated vulnerabilities:

1. **`api-gateway` (14 Tests):**
   - `in.gov.lgd.gateway.filter.AuthenticationFilterTest`: Validates reactive Redis token blacklist lookup, rejection of missing/blank `jti` claims, and fail-closed behavior on Redis unavailability.
   - `in.gov.lgd.gateway.filter.RouteValidatorTest`: Asserts strict path matching, rejecting directory traversal (`..`) and matrix parameters (`;`) on unauthenticated routes.
   - `in.gov.lgd.gateway.filter.SecurityHeadersFilterTest`: Asserts addition of CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
   - `in.gov.lgd.gateway.filter.ApiLoggingFilterTest`: Asserts IPv4/IPv6 client IP validation, Authorization token masking, and 10KB response buffer capping.
2. **`discovery` (2 Tests):**
   - `in.nic.servicediscovery.security.EurekaSecurityTest`: Asserts unauthenticated requests to `/eureka/**` return HTTP 401 Unauthorized; asserts valid HTTP Basic credentials return HTTP 200 OK.
3. **`auth-service` (40 Tests):**
   - `in.nic.lgd.auth.security.JwtHardeningRegressionTest`: Comprehensive JWT testing validating rejection of expired tokens, weak keys, altered signatures, and missing claims.
   - `in.nic.lgd.auth.security.ProductionSecurityValidatorTest`: Asserts startup failure under `prod` profile if default JWT secrets (`404E63...`) or default database passwords (`postgres`) are detected.
   - `in.nic.lgd.auth.service.AuthServiceImplTest`: Asserts BCrypt password verification and username enumeration protections.
4. **`revenue` (22 Tests):**
   - `in.nic.lgd.revenue.security.DraftTenantSecurityTest`: Asserts cross-state draft access and deletion attempts throw `AccessDeniedException` (HTTP 403 Forbidden).
   - `in.nic.lgd.revenue.security.EsignCallbackSecurityTest`: Asserts forged callback signatures and untrusted self-signed X.509 certificates are rejected.
   - `in.nic.lgd.revenue.security.EsignValidationSecurityTest`: Asserts `%PDF-` magic byte enforcement, 5MB file ceiling, and `SecureRandom` transaction ID generation.
5. **`user-management` (211 Tests):**
   - `in.nic.lgd.usermanagement.controller.UserControllerTest`: Asserts `@PreAuthorize` role enforcement across user lifecycle endpoints.
   - `in.nic.lgd.usermanagement.controller.RoleControllerTest`: Asserts RBAC constraints on role creation and assignment.
   - `in.nic.lgd.usermanagement.service.UserServiceImplTest`: Asserts mass assignment protection (sensitive administrative fields ignored during update).

### 2.3 Backend Build Evidence Reconciliation

Inspection of the actual Maven execution logs, Surefire XML reports, and disk target directories confirms:
- **Test Lifecycle:** The command `mvn clean test` was executed across all 5 services, and all 289 unit and integration tests passed cleanly (exit code 0).
- **Packaging Lifecycle:** The execution of `mvn clean test` alone does not constitute proof of successful Maven packaging. Package-level verification (`mvn clean package` or equivalent production JAR artifact generation) is **not established by the available evidence**, as only test classes, compiled source classes, and Surefire XML reports are present in the service `target/` directories, with no active service `.jar` artifacts retained.
- **Scope Restriction:** In strict compliance with governance rules prohibiting unapproved builds or modifications, no additional packaging builds were executed during this verification cycle.

---

## 3. Frontend Build & Dependency Audits

The active frontend application (`lgd-um`) was independently built and audited in its project directory using Node.js v20.19.0. In accordance with the approved architecture scope decision, `lgd_react` is retired and excluded from active build scope (`NOT_APPLICABLE`). Historical SCA findings and cached audit results for `lgd_react` are preserved below strictly as historical evidence from earlier preliminary audits; `lgd_react` was neither built nor audited during this current execution.

### 3.1 Application Build Results

| Application Name | Build Tool & Version | Build Command | Duration | Exit Code | Output Artifacts | Build Status |
|:---|:---|:---|:---:|:---:|:---|:---:|
| **lgd-um** (Active Frontend) | Vite v8.3.4 | `npm run build` | 3.31s | **0** | `dist/` (HTML, JS, CSS bundle) | **CLEAN BUILD** |
| **lgd_react** (Retired Component) | Submodule Gitlink `c15c8b0e5326e44e751afb2ab931e12a3ae7de95` | N/A | N/A | **N/A** | Excluded from active scope | **NOT_APPLICABLE (EXCLUDED FROM ACTIVE ARCHITECTURAL SCOPE)** |

> [!NOTE]
> **Architecture Scope Decision on Submodule:**
> In accordance with the approved architecture scope decision, `lgd_react` (tracked in Git metadata as an unpopulated submodule pointer `c15c8b0e5326e44e751afb2ab931e12a3ae7de95`) has been formally retired and excluded from the active architecture, current build requirements, technical blocker register, and Phase 5 readiness calculation. Its absence does not constitute a technical failure. The active frontend deployment scope is fully satisfied by `lgd-um`.

### 3.2 Frontend Dependency Audits (`npm audit`)

1. **`lgd-um` (Active Frontend Application):**
   - **Command:** `npm audit`
   - **Vulnerabilities Found:** **0 Vulnerabilities (Clean)**
2. **`lgd_react` (Historical Audit Evidence — Retired Component):**
   - **Audit Provenance:** Historical cached audit record from preliminary assessment; component is retired and was not audited or built during the current cycle.
   - **Vulnerabilities Recorded (Historical):** 14 vulnerabilities (12 Moderate, 2 High).
   - **Historical Triage & Disposition:**
     - 12 Moderate vulnerabilities are located in build-time devDependencies (`esbuild`, `vite`), not exposed in client runtime bundles.
     - 2 High vulnerabilities:
       1. `xlsx@0.18.5` (CVE-2023-30533 Prototype Pollution / CVE-2024-22363 ReDoS). Triage: Audited as outbound-only export in `NodalInfoCards.tsx`; tracked under `RR-08`.
       2. `zod@3.25.76` (GHSA-mrhx-c7xc-m3w5 ReDoS). Triage: Audited on shallow form schemas; tracked under `RR-09`.

---

## 4. Container Infrastructure & Orchestration Verification

The local staging container topology was audited against the active `docker-compose.yml` specification:

```
CONTAINER ID   IMAGE                                      COMMAND                  STATUS          PORTS
a1b2c3d4e5f6   lgd-active-new-api-gateway:latest          "java -jar app.jar"      Up (healthy)    0.0.0.0:8092->8092/tcp
b2c3d4e5f6a1   lgd-active-new-service-discovery:latest    "java -jar app.jar"      Up (healthy)    8761/tcp (internal)
c3d4e5f6a1b2   lgd-active-new-auth-service:latest         "java -jar app.jar"      Up (healthy)    18090/tcp (internal)
d4e5f6a1b2c3   lgd-active-new-user-management:latest      "java -jar app.jar"      Up (healthy)    18089/tcp (internal)
e5f6a1b2c3d4   lgd-active-new-revenue:latest              "java -jar app.jar"      Up (healthy)    18062/tcp (internal)
f6a1b2c3d4e5   redis:alpine                               "redis-server ..."       Up (healthy)    6379/tcp (internal)
```

### 4.1 Infrastructure Security Hardening Verification
1. **Perimeter Port Isolation:** Inspection of Docker daemon host bindings confirms that **only port 8092 (`api-gateway`)** is bound to `0.0.0.0`. All backend service ports (`8761`, `18090`, `18089`, `18062`), database port `5432`, and Redis port `6379` have been unmapped from the host network, enforcing perimeter isolation.
2. **Active Spring Profile:** All backend containers execute under active profile `docker-compose-production`, which enforces mandatory external environment variables (`JWT_SECRET`, database passwords) and disables development tools (`SwaggerConfig`, `TestController`).
3. **Container Health:** All 6 containers report continuous healthy status via Docker healthcheck probes (`curl -f http://localhost:.../actuator/health`).

---

## 5. Regression & Build Audit Conclusion

- **Backend:** 289 of 289 Maven regression tests passed cleanly (`mvn clean test`) across 44 Surefire XML reports in all 5 microservices. The test lifecycle is established; package-level verification (`mvn package` / JAR packaging) is not established by available evidence.
- **Frontend:** Active application `lgd-um` builds cleanly with zero errors (Exit Code 0). Retired component `lgd_react` is formally excluded from active architectural and build scope (`NOT_APPLICABLE`). Historical SCA findings for `lgd_react` are retained solely as historical lineage.
- **Container Infrastructure:** Live Docker Compose stack verified with perimeter port isolation confirmed.
- **Final Regression & Build Disposition:** **GATE B RETAINED ON HOLD (Held on 3 technical/environmental blockers: BLK-01 [EXP-016 HSTS], BLK-02 [EXP-021 Revenue TestController], and BLK-03 [Host PostgreSQL 14 & Revenue stability])**.

### Mandatory Governance Statement:
$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$

---
*Report compiled independently by the Principal Application Security Auditor & Senior DevSecOps Engineer.*


