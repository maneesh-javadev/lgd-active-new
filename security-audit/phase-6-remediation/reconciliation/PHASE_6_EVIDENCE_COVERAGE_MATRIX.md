# LGD 2.0 — Phase 6 Evidence Coverage Matrix & Quality Evaluation Report
## Reconciliation of Evidence Records EVD-RBAC-01 through EVD-RBAC-20 against Tests & Findings

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Authorization, RBAC & Multi-Tenancy Boundary Audit** |
| **Document Purpose** | Comprehensive Evidence Traceability Matrix, Artifact Census, and Verification Quality Analysis |
| **Auditing Authority** | Independent Principal Application Security Auditor |
| **Evaluation Date** | November 4, 2026 |
| **Scope Evaluated** | 20 Evidence Records (`EVD-RBAC-01`–`20`), 25 Tests (`TEST-MT-01`–`25`), 16 Findings (`RBAC-001`–`016`) |

---

## 1. Authoritative Evidence Reconciliation Matrix

The table below reconciles every evidence artifact submitted in `PHASE_6_EVIDENCE_REGISTER.md` against its associated test cases, security findings, actual file artifacts in the repository, and verified technical quality.

| Evidence ID | Submitted Evidence Title | Associated Test(s) | Associated Finding(s) | Primary Physical Artifact / Source Anchor | Raw Surefire XML / Build Log Reference | Evidence Type & Quality | Reconciled Auditor Evaluation |
|:---:|:---|:---:|:---:|:---|:---|:---:|:---|
| **`EVD-RBAC-01`** | District Draft Cross-Tenant BOLA Isolation Proof | `TEST-MT-01` | `SAST-009`, `RBAC-007` | `revenue/src/test/java/.../DraftTenantSecurityTest.java:60-76` | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` (Line 93) | **Unit Test**<br>(High Quality) | **VERIFIED:** Isolated Mockito unit test asserting `SecurityException` on cross-tenant draft view. |
| **`EVD-RBAC-02`** | District Draft Same-Tenant Authorized Access Proof | `TEST-MT-02` | `SAST-009`, `RBAC-007` | `revenue/src/test/java/.../DraftTenantSecurityTest.java:78-95` | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` (Line 89) | **Unit Test**<br>(High Quality) | **VERIFIED:** Asserted via `assertDoesNotThrow(...)` in Mockito unit test. |
| **`EVD-RBAC-03`** | District Draft Cross-Tenant Deletion Defense Proof | `TEST-MT-04` | `SAST-010`, `RBAC-008` | `revenue/src/test/java/.../DraftTenantSecurityTest.java:98-114` | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` (Line 84) | **Unit Test**<br>(High Quality) | **VERIFIED:** Asserted `SecurityException` on cross-tenant deletion of entity type 'D'. |
| **`EVD-RBAC-04`** | District Boundary Cross-District Draft Isolation Proof | `TEST-MT-03` | `SAST-009`, `RBAC-011` | `revenue/src/test/java/.../DraftTenantSecurityTest.java:136-155` | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` (Line 61) | **Unit Test**<br>(High Quality) | **VERIFIED:** Asserted `SecurityException` when District 101 officer views District 202 draft. |
| **`EVD-RBAC-05`** | Unauthenticated Request HTTP 401 Unauthorized Proof | `TEST-MT-12` | `VULN-005`, `AUTH-001` | `user-management/src/test/.../SecurityIntegrationTest.java:25-29` | `user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.SecurityIntegrationTest.xml` | **Integration Test**<br>(High Quality) | **VERIFIED:** MockMvc test asserting `.andExpect(status().isUnauthorized())` on unauthenticated call. |
| **`EVD-RBAC-06`** | Malformed JWT Token HTTP 401 Rejection Proof | `TEST-MT-13` | `VULN-005`, `AUTH-001` | `user-management/src/test/.../SecurityIntegrationTest.java:31-36` | `user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.SecurityIntegrationTest.xml` | **Integration Test**<br>(High Quality) | **VERIFIED:** MockMvc test asserting `.andExpect(status().isUnauthorized())` on malformed bearer string. |
| **`EVD-RBAC-07`** | Injected JWT "roles" Claim & Authority Mapping Proof | `TEST-MT-14`, `TEST-MT-15` | `RBAC-001` | `auth-service/JwtUtil.java:70`, `AuthServiceImpl.java:82`, `JwtAuthenticationFilter.java` | `auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.security.JwtHardeningRegressionTest.xml` | **Unit Test & Code**<br>(High Quality) | **VERIFIED:** `auth-service` mints `"roles"` claim; downstream filters populate `ROLE_*` `GrantedAuthority`. |
| **`EVD-RBAC-08`** | Privilege & Master Controllers Method-Level Security Proof | `TEST-MT-19`, `TEST-MT-20` | `RBAC-004` | `user-management/src/test/.../RbacSecurityIntegrationTest.java:90-107` | `user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml` | **Integration Test**<br>(High Quality) | **VERIFIED:** In-memory Spring MockMvc assertions verifying HTTP 403 on missing privilege and 200 on authorized. |
| **`EVD-RBAC-09`** | Subdistrict & Village Permissive Gates Remediation Proof | `TEST-MT-21` | `RBAC-005` | `revenue/src/main/java/.../SubDistrictPrimaryController.java:49, 144` | *No automated test file exists in revenue module* | **Static Code Only**<br>(Moderate Quality) | **DEFICIENT EVIDENCE:** Verification is based strictly on static AST code review of `@PreAuthorize`. No automated test artifact exists. |
| **`EVD-RBAC-10`** | Subdistrict Draft Cross-Tenant BOLA Remediation Proof | `TEST-MT-06` | `RBAC-007` | `revenue/src/test/java/.../DraftTenantSecurityTest.java:157-174` | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` (Line 79) | **Unit Test**<br>(High Quality) | **VERIFIED:** Injected `UserContext` into `SubDistrictDraftDetailsServiceImpl`; asserted `SecurityException` on mismatch. |
| **`EVD-RBAC-11`** | Multi-Tenant Deletion Defense across All Draft Entity Types | `TEST-MT-07` | `RBAC-008` | `revenue/src/test/java/.../DraftTenantSecurityTest.java:176-194` | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` (Line 103) | **Unit Test**<br>(High Quality) | **PARTIALLY VERIFIED:** Unit test verifies subdistrict type 'T'. Entity type 'V' (Village) is supported in code but lacks automated test. |
| **`EVD-RBAC-12`** | Multi-Tenant Scoped User Directory Database Query Proof | `TEST-MT-09` | `RBAC-010` | `user-management/src/main/java/.../UserServiceImpl.java:105-125` | *Cited test method does not exist in UserServiceImplTest* | **Static Code Only**<br>(Defective Citation) | **DEFICIENT EVIDENCE:** Cited test `getAllUsers_StateAdmin_ReturnsStateUsersOnly` does NOT exist in code. Scoping verified purely by code inspection. |
| **`EVD-RBAC-13`** | Method Security RBAC Integration Suite Proof (10 Tests) | `TEST-MT-19`, `TEST-MT-20` | `RBAC-004`, `RBAC-016` | `user-management/src/test/.../RbacSecurityIntegrationTest.java` | `user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml` | **Integration Test**<br>(Duplicate Container) | **DUPLICATE EVIDENCE:** Aggregates 10 MockMvc tests covering master controllers. Duplicate container of `EVD-RBAC-08`. |
| **`EVD-RBAC-14`** | Comprehensive Multi-Tenant Boundary Suite (9 Tests) | `TEST-MT-01`–`07`, `TEST-MT-11` | `RBAC-007`, `RBAC-008`, `RBAC-012`, `RBAC-016` | `revenue/src/test/java/.../DraftTenantSecurityTest.java` | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` | **Unit Test**<br>(Duplicate Container) | **DUPLICATE EVIDENCE:** Aggregates 9 Mockito unit tests. Container duplicate of `EVD-RBAC-01`, `02`, `03`, `04`, `10`, `11`, `18`. |
| **`EVD-RBAC-15`** | User-Role Mapping Hierarchy Dominance & Self-Elevation | `TEST-MT-16` | `RBAC-003` | `user-management/src/main/java/.../UserRoleMappingServiceImpl.java:210-232` | *No security test method in UserRoleMappingServiceImplTest* | **Static Code Only**<br>(Defective Citation) | **DEFICIENT EVIDENCE:** Code implements self-assignment check, but cited unit test is absent from `UserRoleMappingServiceImplTest.java`. |
| **`EVD-RBAC-16`** | User Hierarchy Dominance & Self-Deletion Guardrail Defense | `TEST-MT-17`, `TEST-MT-18`, `TEST-MT-23` | `RBAC-006`, `RBAC-013` | `user-management/src/main/java/.../UserServiceImpl.java:60-78, 158-176` | *No dominance or self-deletion tests in UserServiceImplTest* | **Static Code Only**<br>(Defective Citation) | **DEFICIENT EVIDENCE:** Dominance and self-deletion checks implemented in Java code, but unbacked by automated unit tests. |
| **`EVD-RBAC-17`** | Horizontal IDOR & Cross-Tenant User Retrieval Defense | `TEST-MT-22` | `RBAC-009` | `user-management/src/main/java/.../UserServiceImpl.java:93-100` | *No cross-tenant test in UserServiceImplTest* | **Static Code Only**<br>(Defective Citation) | **DEFICIENT EVIDENCE:** `stateCode` boundary check implemented in `getUserById`, but cited negative unit test is absent. |
| **`EVD-RBAC-18`** | Fail-Closed Policy on Missing/Null Tenant Claims | `TEST-MT-11` | `RBAC-012` | `revenue/src/test/java/.../DraftTenantSecurityTest.java:196-216` | `revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` (Line 98) | **Unit Test**<br>(High Quality) | **VERIFIED:** Mockito unit test asserting `SecurityException` when userContext has null `stateCode`. |
| **`EVD-RBAC-19`** | Frontend React RoleGuard Route & Action Button Authorization | `TEST-MT-24`, `TEST-MT-25` | `RBAC-015` | `lgd-um/src/main.jsx:32-55`, `UserManagement.jsx:400-440` | Vite Build Log (333 modules transformed, 0 errors, 5.79s) | **Frontend Build**<br>(Moderate Quality) | **VERIFIED (Static/Build):** Verified via compiler build and JSX review. Interactive runtime browser DAST retesting pending. |
| **`EVD-RBAC-20`** | Full Microservice Automated Test Suite Regression Proof | Aggregate (304 Tests) | Cross-Service Macro Health | `api-gateway`, `discovery`, `auth-service`, `user-management`, `revenue` | 5 Maven Surefire XML Directories (All passing, 0 failures, 0 errors) | **Maven Regression**<br>(Macro Health) | **VERIFIED:** 304 passing unit/integration tests confirm zero compile errors or legacy regressions across platform. |

---

## 2. Reconciled Evidence Categorization

### 2.1 Missing Evidence
The independent audit identified four critical areas where submitted deliverables claimed automated test verification, but **no supporting execution evidence exists**:
1. **JWT 15-Minute Expiration Runtime Proof (`RBAC-002`):**
   - The test suite `JwtHardeningRegressionTest.java` hardcoded `@TestPropertySource(properties = {"jwt.expiration=3600000"})` (1 hour).
   - No test exists in any repository module asserting that the 15-minute (`900000` ms) configuration property is used in runtime or that production profiles override 24-hour defaults.
2. **Missing Negative Security Unit Tests in `user-management`:**
   - `EVD-RBAC-12` claimed `UserServiceImplTest.getAllUsers_StateAdmin_ReturnsStateUsersOnly`. (Does not exist in file).
   - `EVD-RBAC-15` claimed self-elevation rejection test in `UserRoleMappingServiceImplTest`. (Does not exist in file).
   - `EVD-RBAC-16` claimed self-deletion and superior officer deletion rejection in `UserServiceImplTest`. (Does not exist in file).
   - `EVD-RBAC-17` claimed cross-tenant IDOR rejection test in `UserServiceImplTest`. (Does not exist in file).
3. **Missing Automated Controller Tests in `revenue`:**
   - `EVD-RBAC-09` and `TEST-MT-10` / `TEST-MT-21` claimed unit test coverage for `SubDistrictPrimaryController`. The `revenue` test folder contains zero controller test classes.
4. **Omission of Direct Evidence for `RBAC-014`:**
   - `EVD-RBAC-01` through `EVD-RBAC-20` completely omitted a dedicated evidence record for `RBAC-014` (Cross-Tenant User-to-Role Mapping Disclosure).

### 2.2 Duplicate Evidence Records
Two submitted evidence records represent container duplicates that artificially inflate the perceived volume of distinct verification proofs:
1. **`EVD-RBAC-13` (Method Security RBAC Suite):** Completely subsumes the test cases already cataloged under `EVD-RBAC-08` from `RbacSecurityIntegrationTest.java`.
2. **`EVD-RBAC-14` (Multi-Tenant Boundary Suite):** Completely subsumes the 9 Mockito tests individually indexed under `EVD-RBAC-01`, `02`, `03`, `04`, `10`, `11`, and `18`.

### 2.3 Tests with No Direct Automated Evidence
Nine of the 25 scenarios rely solely on static AST code review of Java methods without any automated test execution artifact in Surefire reports:
- `TEST-MT-08` (Cross-State Village Draft Deletion 'V')
- `TEST-MT-09` (Global User Directory Scoping)
- `TEST-MT-10` (Cross-District Status Probing)
- `TEST-MT-16` (Self-Elevation via Role Mapping)
- `TEST-MT-17` (District Admin Creating Central Admin)
- `TEST-MT-18` (Lower Tier Deleting Superior Officer)
- `TEST-MT-21` (Unauthorized Subdistrict Publication)
- `TEST-MT-22` (Horizontal Cross-Tenant User Profile Lookup)
- `TEST-MT-23` (Administrative Self-Deletion Prevention)

### 2.4 Evidence Supporting Only Unit-Level Behavior
Eight evidence records execute exclusively within Mockito unit tests without bootstrapping the Spring application context, web filter chain, or database transactions:
- `EVD-RBAC-01`, `EVD-RBAC-02`, `EVD-RBAC-03`, `EVD-RBAC-04`, `EVD-RBAC-10`, `EVD-RBAC-11`, `EVD-RBAC-14`, `EVD-RBAC-18`.
- In these tests, the service classes (`DistrictDraftDetailsServiceImpl`, `DraftEntityServiceImpl`, `SubDistrictDraftDetailsServiceImpl`) are instantiated directly with `new`, and `UserContext` is populated manually. While this confirms algorithmic correctness, it does **not** verify that Spring Security correctly extracts claims from incoming HTTP requests or that exceptions are translated into HTTP 403 Forbidden responses.

### 2.5 Evidence Requiring Independent HTTP-Level Verification
Because 0 out of 25 scenarios were executed against live container network sockets, **all 25 scenarios require independent HTTP-level retesting** by the penetration test team against running microservice instances:
1. Validating JWT bearer token propagation through `api-gateway` (Port 8092).
2. Verifying HTTP 403 Forbidden responses across master controllers in `user-management` (Port 18089).
3. Verifying HTTP 403 Forbidden responses on cross-state draft requests in `revenue` (Port 18062).
4. Validating real-time session termination upon token expiration (15 minutes).
