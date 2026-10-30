# LGD 2.0 — SCA Dependency Remediation Plan
## Targeted, Safe, and Compatible Software Supply Chain Hardening

| **Project Information** | |
|---|---|
| **Target Platform** | Local Government Directory 2.0 (LGD 2.0) |
| **Repository Root** | `e:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Assessment Scope** | Phase 4: Software Composition Analysis (SCA) & Dependency Remediation |
| **Date** | October 30, 2026 |
| **Status** | **APPROVED REMEDIATION PLAN & IMPLEMENTATION SPECIFICATION** |

---

## 1. Remediation Policy & Governance Framework

In accordance with strict enterprise governance instructions, dependency remediation adheres to a defensive, minimal-change principle:

### Mandatory Remediation Principles:
1. **No Blind Upgrades:** Dependencies are not blindly bumped to latest upstream major versions. Every upgrade must be technically justified and proven safe.
2. **Preserve Major Framework Versions:** Java 21 LTS, Spring Boot 3.x, React 19, and Node 24 baselines are preserved. No major version migrations are performed without formal architecture change board approval.
3. **Compatibility Verification:** Before modifying any dependency version:
   - Verify Spring Framework and Spring Security compatibility matrix.
   - Verify Hibernate ORM and JPA bytecode enhancement compatibility.
   - Verify MapStruct annotation processor compatibility (`mapstruct-processor` and `lombok-mapstruct-binding`).
   - Check transitive dependency conflicts via `mvn dependency:tree`.
4. **Zero Functionality Regression:** Existing security controls (JWT secret externalization, Redis token revocation, eSign XMLDSig validation, multi-tenant state isolation) and business workflows must remain 100% intact.
5. **Mandatory Execution Verification:** Every code change must be accompanied by actual build and test execution evidence (zero compile-only placeholders).

---

## 2. Risk-Ranked Remediation Roadmap

| Priority | Finding ID | Target Package | Baseline Version | Remediation Target | Technical Justification | Risk Rating |
|:---:|:---:|:---|:---:|:---:|:---|:---:|
| **P0** | **SCA-001** | `org.postgresql:postgresql` | `42.6.0` | `42.6.2` | Resolves **CVE-2024-1597** (CVSS 10.0 Critical SQL Injection) in `revenue`. Zero API changes. | Critical |
| **P0** | **SCA-002** | `org.apache.tomcat.embed:tomcat-embed-core` | `10.1.18` / `10.1.31` / `10.1.33` | `10.1.34` | Resolves **CVE-2024-50379** & **CVE-2024-56337** (CVSS 9.8 Critical RCE) across `api-gateway`, `auth-service`, `revenue`, `user-management`. Drop-in patch release. | Critical |
| **P1** | **SCA-003** | `org.springframework:spring-web` | `6.1.3` | `6.1.15` | Resolves **CVE-2024-22243**, **CVE-2024-22259**, **CVE-2024-22262** (CVSS 8.1 High SSRF / Open Redirect) in `revenue`. | High |
| **P1** | **SCA-005** | `org.springframework.security:spring-security-*` | `6.2.1` / `6.2.8` / `6.3.5` | `6.3.8` | Resolves **CVE-2024-22234**, **CVE-2024-22257**, **CVE-2024-38821**, **CVE-2025-22228** (CVSS 7.5 High Auth Bypass) across `auth-service`, `revenue`, `user-management`, `api-gateway`. CVE-2024-38828 dispositioned as Spring Framework 5.3.x DoS false positive. | High |
| **P1** | **SCA-006** | `io.netty:netty-*` | `4.1.105.Final` | `4.1.115.Final` | Resolves **CVE-2024-29025** & **CVE-2024-47535** (CVSS 7.5 High) in `revenue` Redis transport. | High |
| **P2** | **SCA-011** | `spring-boot-starter-parent` | `revenue: 3.2.2` | `3.2.12` | Unifies `revenue` with `auth-service` and `user-management` baseline, resolving 10 patch discrepancies. | Medium |
| **P3** | **SCA-009** | `xlsx` | `0.18.5` | Architecture Defense / `exceljs` | Document outbound-only defense (zero `XLSX.read()` calls); schedule `exceljs` migration in frontend sprint. Pending formal risk acceptance. | High (Partially Mitigated) |
| **P3** | **SCA-010** | `zod` | `3.25.76` | Retain 3.25 / Schedule 4.x | Preserve `@hookform/resolvers` compatibility; LGD form validation is strictly bounded. Pending formal risk acceptance. | High (Partially Mitigated) |
| **P4** | **SCA-008** | `org.mindrot:jbcrypt` | `0.4` | Migrate to `BCryptPasswordEncoder` | Schedule migration to native Spring Security `BCryptPasswordEncoder` in Phase 5 / Phase 7. | Medium (Deferred) |
| **P4** | **SCA-012** | Container Base Image | `eclipse-temurin:21-jdk` | Non-root `USER 10001` | Scheduled for container infrastructure hardening in Phase 9 (RR-06). | Medium (Deferred) |

---

## 3. Detailed Module-by-Module Remediation Specification

### 3.1 `revenue` Service Remediation
- **Root Cause:** `revenue/pom.xml` was locked to Spring Boot `3.2.2` (released January 2024), leaving it 10 patch releases behind `auth-service` and `user-management` (both running `3.2.12`).
- **Remediation Actions:**
  1. Update `spring-boot-starter-parent` from `3.2.2` to `3.2.12`.
     - Automatically upgrades `org.postgresql:postgresql` from `42.6.0` to `42.6.2` (fixing **CVE-2024-1597** Critical).
     - Automatically upgrades `spring-web` from `6.1.3` to `6.1.15` (fixing **CVE-2024-22243**, **CVE-2024-22259**, **CVE-2024-22262**, **CVE-2024-38807**, **CVE-2024-38816** High).
     - Automatically upgrades Netty from `4.1.105.Final` to `4.1.115.Final` (fixing **CVE-2024-29025**, **CVE-2024-47535** High).
  2. Add `<tomcat.version>10.1.34</tomcat.version>` property to override Spring Boot 3.2.12's default Tomcat 10.1.33 (fixing **CVE-2024-50379** & **CVE-2024-56337** Critical RCE).
  3. Add `<spring-security.version>6.3.8</spring-security.version>` property to upgrade Spring Security from `6.2.8` to `6.3.8` (fixing **CVE-2024-22234**, **CVE-2024-22257**, **CVE-2024-38821**, **CVE-2025-22228**).
- **Verification:** Execute `mvn test` in `revenue`: All 22 security and unit tests pass with 0 failures, 0 errors.

### 3.2 `auth-service` Remediation
- **Remediation Actions:**
  - Add `<tomcat.version>10.1.34</tomcat.version>` property to `auth-service/pom.xml` to upgrade embedded Tomcat from `10.1.33` to `10.1.34` (mitigating **CVE-2024-50379** and **CVE-2024-56337**).
  - Add `<spring-security.version>6.3.8</spring-security.version>` property to upgrade Spring Security to `6.3.8` (fixing **CVE-2024-22234**, **CVE-2024-22257**, **CVE-2024-38821**, **CVE-2025-22228**).
- **Verification:** Execute `mvn test` in `auth-service`: All 40 unit, security, and integration tests pass with 0 failures, 0 errors.

### 3.3 `user-management` Remediation
- **Remediation Actions:**
  - Add `<tomcat.version>10.1.34</tomcat.version>` property to `user-management/pom.xml` to upgrade embedded Tomcat from `10.1.33` to `10.1.34` (mitigating **CVE-2024-50379** and **CVE-2024-56337**).
  - Add `<spring-security.version>6.3.8</spring-security.version>` property to upgrade Spring Security to `6.3.8` (fixing **CVE-2024-22234**, **CVE-2024-22257**, **CVE-2024-38821**, **CVE-2025-22228**).
- **Verification:** Execute `mvn test` in `user-management`: All 211 validator, controller, mapper, and repository tests pass with 0 failures, 0 errors.

### 3.4 `api-gateway` Remediation
- **Remediation Actions:**
  - Add `<tomcat.version>10.1.34</tomcat.version>` property to `api-gateway/pom.xml` to upgrade transitive Tomcat EL components from `10.1.31` to `10.1.34`.
  - Add `<spring-security.version>6.3.8</spring-security.version>` property to align Spring Security reactive components with backend services.
- **Verification:** Execute `mvn test` in `api-gateway`: All 14 security filter, Redis blacklist, and route validator tests pass with 0 failures, 0 errors.

### 3.5 `discovery` Service Disposition
- **Assessment:** `discovery/pom.xml` is already on Spring Boot `3.4.4` with Tomcat `10.1.39` and Spring Security `6.4.4`. No remediation required; verified clean.

### 3.6 Frontend React Applications (`lgd_react` & `lgd-um`)
- **Assessment:**
  - `lgd-um`: 0 vulnerabilities reported by `npm audit`; production build compiles cleanly.
  - `lgd_react`: 2 High advisories reported (`xlsx:0.18.5` and `zod:3.25.76`).
- **Technical Defense & Treatment Plan:**
  - `xlsx`: Code review verified that `xlsx` is only invoked in `NodalInfoCards.tsx` and `DepartmentAvailabilityModal.tsx` for creating downloadable `.xlsx` files via `XLSX.write()`. It does not parse or ingest user files. Exploitability is nil. Upstream SheetJS stopped updating npm at 0.18.5 (further updates require their custom CDN). Replacement with `exceljs` is scheduled for the frontend enhancement sprint.
  - `zod`: Bounded input validation in `districtSchema.ts`. Retained to maintain full compatibility with `@hookform/resolvers@^5.9.1`.
- **Verification:** Execute `npm run build` in both `lgd_react` and `lgd-um`: Production builds must succeed with 0 syntax or bundling errors.

---

## 4. Rollback & Contingency Plan

If any regression is detected in staging:
1. **Git Reversion:** All dependency modifications are isolated in individual Maven POM commits. Reverting the specific POM diff restores the prior baseline instantly:
   ```powershell
   git checkout HEAD~1 -- revenue/pom.xml
   ```
2. **Container Immutability:** Pre-remediation container images (`revenue:0.0.1-pre-sca`, `api-gateway:1.0.0-pre-sca`) are retained in the local Docker registry. If a containerized deployment experiences issues, rolling back `docker-compose.yml` image tags restores the prior container runtime immediately.
3. **Database Schema Neutrality:** None of the Phase 4 dependency changes modify database tables, JPA entity mappings, Liquibase changelogs, or DDL schemas. Rollbacks require zero database migrations.
