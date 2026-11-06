# LGD 2.0 — Phase 6 Remaining Technical Verification Gaps
## Outstanding Security, Architecture, Testing, and Governance Deficits

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Authorization, RBAC & Multi-Tenancy Boundary Audit** |
| **Document Purpose** | Comprehensive Catalog of Remaining Technical Verification Gaps, Uncommitted Tests, Architectural Risks, and Governance Blockers |
| **Auditing Authority** | Independent Principal Application Security Auditor |
| **Evaluation Date** | November 4, 2026 |
| **Milestone Verdict** | **`PENDING_REMEDIATION_AND_INDEPENDENT_RETEST`** |
| **Gate Status** | **Gate A: PASS (Synced) | Gate B: HOLD | Gate C: PENDING_FORMAL_ACCEPTANCE** |

---

## 1. Executive Summary of Remaining Gaps

While substantial source-code remediation was implemented during Phase 6 across Java 21 backend microservices and the React frontend, an independent technical audit reveals **seven distinct verification, architectural, and governance gaps** that prevent Phase 6 from receiving unconditional independent security acceptance.

Phase 6 is accurately characterized as **`COMPLETED_ACCORDING_TO_SUBMITTED_DEVELOPER_EVIDENCE`**, but remains **`PENDING_INDEPENDENT_SECURITY_RETEST`**.

---

## 2. Technical Verification Gaps Catalog

```
+----------------------------------------------------------------------------------------------------+
|                                    SUMMARY OF VERIFICATION GAPS                                   |
|                                                                                                    |
|  [GAP-01] Zero End-to-End Runtime HTTP API Network Verification (403/401 Inferred, Not Wire Probed) |
|  [GAP-02] JWT Expiration Profile Contradiction (Prod retains 24h default; 15m test output absent)  |
|  [GAP-03] Missing Negative Unit Test Fixtures in user-management (Claims unsupported by code)       |
|  [GAP-04] Complete Absence of Automated Controller Test Suites in revenue microservice             |
|  [GAP-05] Downstream Microservice Redis Revocation Blind Spot (TB-03 & TB-04 un-checked)           |
|  [GAP-06] Frontend Authorization Verification Limited to Compiler Build (Runtime DOM untested)      |
|  [GAP-07] Active Technical Blockers BLK-01, BLK-02, BLK-03, BLK-04 Preserved as OPEN               |
+----------------------------------------------------------------------------------------------------+
```

---

### Gap GAP-01: Zero End-to-End Runtime HTTP API Network Verification
- **Severity:** **HIGH**
- **Affected Dimension:** Runtime Verification Completeness
- **Description:**
  All 25 test permutations (`TEST-MT-01` through `TEST-MT-25`) reported in Phase 6 registers were executed in-memory or validated via static analysis:
  - 10 tests were executed as isolated Mockito unit tests calling service methods directly.
  - 4 tests were executed using Spring Boot MockMvc inside the JVM.
  - 9 tests were evaluated purely via static AST code inspection.
  - 2 tests were validated via Vite production compiler build.
- **Deficit:**
  **Not a single test was transmitted over TCP socket** to running microservice container ports (Gateway 8092, Auth 18090, User-Management 18089, Revenue 18062).
- **Risk:**
  Network filters, gateway route forwards, HTTP message converters, CORS headers, reverse proxy header stripping, and production servlet filters remain unverified in an authentic end-to-end network deployment.
- **Required Action for Independent Retest:**
  Execute automated DAST/API penetration testing using OWASP ZAP or Postman/Newman collections transmitting authentic HTTP requests with signed JWT bearer tokens against all 52 endpoints.

---

### Gap GAP-02: JWT Expiration Profile Contradiction & Runtime Verification Pending (`RBAC-002`)
- **Severity:** **HIGH**
- **Affected Microservices:** `auth-service`, `user-management`, `revenue`
- **Description:**
  Remediation records claim `RBAC-002` was closed by capping JWT token lifespan to 15 minutes (`900000` ms).
  However, physical inspection of properties files reveals a critical contradiction:
  - `auth-service/src/main/resources/application.properties:39`: `jwt.expiration=${JWT_EXPIRATION:900000}` (15 min).
  - `auth-service/src/main/resources/application-prod.properties:20`: `jwt.expiration=${JWT_EXPIRATION:86400000}` (**24 Hours**).
  - `user-management/src/main/resources/application-prod.properties:20`: `jwt.expiration=${JWT_EXPIRATION:86400000}` (**24 Hours**).
- **Test Deficit:**
  The automated test `JwtHardeningRegressionTest.java:46` hardcoded `@TestPropertySource(properties = {"jwt.expiration=3600000"})` (1 hour). There is **no test output anywhere in the repository** demonstrating runtime issuance or expiration of a 900,000 ms token.
- **Status:**
  Formally marked as **`RUNTIME_VERIFICATION_PENDING`**.
- **Required Action for Independent Retest:**
  Align `application-prod.properties` to `${JWT_EXPIRATION:900000}` and execute an integration test verifying that a token minted with `900000` ms expiration is rejected with HTTP 401 Unauthorized after 15 minutes and 1 second.

---

### Gap GAP-03: Missing Negative Unit Test Fixtures in `user-management`
- **Severity:** **MEDIUM**
- **Affected Microservice:** `user-management`
- **Description:**
  The Phase 6 Evidence Register cited automated unit tests in `UserServiceImplTest` and `UserRoleMappingServiceImplTest` for multiple key security assertions. Physical source review reveals that **these test methods do not exist**:
  1. `EVD-RBAC-12` claimed `UserServiceImplTest.getAllUsers_StateAdmin_ReturnsStateUsersOnly` (`TEST-MT-09`). **Reality:** Only `getAllUsers_ShouldReturnList()` exists; state filtering is untested.
  2. `EVD-RBAC-15` claimed self-elevation rejection test in `UserRoleMappingServiceImplTest` (`TEST-MT-16`). **Reality:** Zero negative tests asserting `Self-role assignment/elevation is forbidden`.
  3. `EVD-RBAC-16` claimed self-deletion and superior officer deletion rejection in `UserServiceImplTest` (`TEST-MT-17`, `TEST-MT-18`, `TEST-MT-23`). **Reality:** Zero negative tests asserting dominance violations.
  4. `EVD-RBAC-17` claimed cross-tenant IDOR rejection in `UserServiceImplTest` (`TEST-MT-22`). **Reality:** Zero cross-tenant negative tests exist.
- **Risk:**
  While the security checks are present in Java source code, they are not protected by automated regression guards in CI/CD and could be silently broken during future refactoring.
- **Required Action for Independent Retest:**
  Implement explicit JUnit 5 / Mockito negative test fixtures in `UserServiceImplTest.java` and `UserRoleMappingServiceImplTest.java` asserting `SecurityException` across all four conditions.

---

### Gap GAP-04: Complete Absence of Automated Controller Test Suites in `revenue`
- **Severity:** **MEDIUM**
- **Affected Microservice:** `revenue`
- **Description:**
  Submitted deliverables claim `TEST-MT-10` and `TEST-MT-21` were verified via automated unit/integration tests in `SubDistrictPrimaryController`.
  Inspection of `revenue/src/test/java` reveals **only three test classes**:
  - `DraftTenantSecurityTest.java` (Service-level Mockito tests)
  - `EsignCallbackSecurityTest.java`
  - `EsignValidationSecurityTest.java`
  There are **zero controller test classes** in `revenue`.
- **Risk:**
  Spring `@PreAuthorize` SpEL annotations on `SubDistrictPrimaryController` and `VillagePrimaryController` have never been verified within a Spring DispatcherServlet context.
- **Required Action for Independent Retest:**
  Implement a Spring MockMvc test class `SubDistrictPrimaryControllerSecurityTest.java` asserting HTTP 403 Forbidden on unprivileged publication and reorganization draft requests.

---

### Gap GAP-05: Downstream Microservice Redis Revocation Blind Spot
- **Severity:** **HIGH**
- **Affected Trust Boundaries:** `TB-03` (`api-gateway` -> `user-management`) & `TB-04` (`api-gateway` -> `revenue`)
- **Description:**
  As noted under finding `RBAC-002` and baseline finding `AUTH-002`, token revocation via Redis blacklist (`blacklist:jti:<jti>`) is queried **only by `api-gateway` and `auth-service`**.
  Neither `user-management` nor `revenue` injects Redis or queries blacklists in `JwtAuthenticationFilter.java`.
- **Risk:**
  If an attacker bypasses the gateway via network pivot, container direct-port access (18089/18062), or internal service mesh routing, revoked tokens remain fully valid until token expiration.
- **Required Action for Independent Retest:**
  Validate gateway ingress network isolation (Kubernetes NetworkPolicies / Docker bridge segregation) or implement Redis token blacklist checking in downstream microservice security filters.

---

### Gap GAP-06: Frontend Authorization Verification Limited to Compiler Build
- **Severity:** **LOW / INFORMATIONAL**
- **Affected Component:** `lgd-um` (React Frontend)
- **Description:**
  Remediation of `RBAC-015` was verified via a successful production compiler build (`npm run build` in 5.79s, 0 errors) and manual JSX inspection of `<RoleGuard>` and conditional buttons in `UserManagement.jsx`.
- **Deficit:**
  No automated headless browser tests (e.g. Playwright, Cypress) or React Testing Library unit tests exist in `lgd-um/src` to assert that unauthorized users cannot view protected DOM elements.
- **Required Action for Independent Retest:**
  Perform interactive browser DAST testing logging in as District Officer, State Admin, and Clerk to confirm that admin action buttons and restricted tabs are cleanly suppressed in the live UI.

---

### Gap GAP-07: Active Technical Blockers Preserved as OPEN
- **Severity:** **HIGH (Governance Blocker)**
- **Preserved Statuses:**
  - **`BLK-01` (EXP-016):** Gateway TLS/HSTS Ingress Termination — **OPEN / DEFERRED**.
  - **`BLK-02` (EXP-021):** Downstream `TestController` Census & Segregation — **OPEN / DEFERRED**.
  - **`BLK-03` (INFRA):** PostgreSQL 14 Production Steady-State Container Migration — **OPEN / DEFERRED**.
  - **`BLK-04` (GOV):** Formal CISO/DAA Residual Risk Acceptance (`RR-01`–`11`) — **OPEN / PENDING**.
- **Governance Mandate:**
  Under the rules of engagement, Phase 6 must not close or alter any of these four blockers. They remain strictly open until their genuine technical and administrative conditions are satisfied.

---

## 3. Summary of Retesting Requirements

| Gap Identifier | Area | Priority | Target Deliverable / Action Required for Retest Team |
|:---:|:---|:---:|:---|
| **GAP-01** | Microservice Runtime APIs | **P1** | Execute live HTTP network DAST against Ports 8092, 18089, 18062, 18090. |
| **GAP-02** | JWT Token Expiration | **P1** | Sync `application-prod.properties` to 900000ms; verify 15-minute token expiry. |
| **GAP-03** | `user-management` Tests | **P2** | Add missing negative JUnit fixtures to `UserServiceImplTest.java`. |
| **GAP-04** | `revenue` Controller Tests | **P2** | Implement `SubDistrictPrimaryControllerSecurityTest.java` with MockMvc. |
| **GAP-05** | Service Revocation Isolation| **P2** | Verify gateway port ingress isolation or add Redis checks downstream. |
| **GAP-06** | Frontend Client UI | **P3** | Interactive browser DAST verifying button and route suppression. |
| **GAP-07** | Governance Blockers | **P1** | Maintain BLK-01..04 as OPEN; await executive DAA sign-off. |
