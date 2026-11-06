# LGD 2.0 — Phase 6 Test Classification Reconciliation Report
## Verification Level & HTTP Assertion Reclassification for TEST-MT-01 through TEST-MT-25

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Authorization, RBAC & Multi-Tenancy Boundary Audit** |
| **Document Purpose** | Comprehensive Reclassification of Multi-Tenancy Boundary Tests by True Technical Verification Level |
| **Auditing Authority** | Independent Principal Application Security Auditor |
| **Evaluation Date** | November 4, 2026 |
| **Test Scope** | **25 Discrete Test Permutations** (`TEST-MT-01` through `TEST-MT-25`) |
| **Reconciled Verdicts** | **25/25 Passing Verdicts Preserved** (Technical Verification Level Re-anchored) |

---

## 1. Test Classification Methodology & Rules

In accordance with Auditor Mandate 4, all 25 test permutations cataloged in `PHASE_6_MULTITENANCY_TEST_REGISTER.md` have been re-evaluated under strict security verification classifications:

### 1.1 Permitted Classifications
1. **`UNIT_TEST`**: Isolated class-level or service-level test utilizing test doubles (e.g. Mockito mocks) without bootstrapping the Spring application context or filter chain.
2. **`INTEGRATION_TEST`**: Test bootstrapping the Spring application context with Spring Security filters enabled (e.g. `@SpringBootTest` with `@AutoConfigureMockMvc`), executing requests in-memory via MockMvc.
3. **`STATIC_CODE_VERIFICATION`**: Security validation established purely through static AST code analysis, manual inspection of annotations (`@PreAuthorize`), or code logic flow analysis, lacking a dedicated automated test execution artifact.
4. **`FRONTEND_BUILD_VERIFICATION`**: Validation established via successful production frontend compiler build (e.g. Vite `npm run build`), TypeScript/JSX type checking, and module bundling.
5. **`FRONTEND_COMPONENT_TEST`**: Isolated DOM component test (e.g. React Testing Library / Jest) evaluating virtual UI state.
6. **`RUNTIME_API_TEST`**: End-to-end HTTP test executed over the network (TCP socket) against a live, deployed microservice or container instance.

### 1.2 Mandatory Categorization Rules
- **Mocked Service Rule:** Tests executing Mockito `@Mock` / `when().thenReturn()` service mocks must **NEVER** be classified as end-to-end or runtime API tests.
- **HTTP Status Assertion Rule:** For every reported HTTP status (e.g. `403 Forbidden`, `401 Unauthorized`, `200 OK`, `400 Bad Request`), the crosswalk must explicitly state whether the status was:
  - Asserted via Spring MockMvc (`.andExpect(status().isForbidden())`).
  - Asserted via an actual HTTP network probe.
  - Inferred from a Java exception mapping (`SecurityException` -> 403, `IllegalArgumentException` -> 400).
  - Inferred from code execution flow (absence of exception -> 200).
- **Verdict Preservation:** The actual test execution verdict (PASS) is strictly preserved, but the verification level is accurately re-anchored to reflect technical reality.

---

## 2. Reconciled Master Test Register (TEST-MT-01 to TEST-MT-25)

| Test ID | Test Category & Objective | Target Endpoint & Request Parameters | Submitted Execution Method | Reconciled Classification | Target Component & Source Anchor | Reported HTTP Status | HTTP Status Assertion Mechanism | True Verification Depth | Reconciled Verdict | Independent Auditor Remarks |
|:---:|:---|:---|:---|:---:|:---|:---:|:---|:---|:---:|:---|
| **`TEST-MT-01`** | **Multi-Tenancy:** Cross-State District Draft View Isolation | `GET /private/v1/draft/district/view/501`<br>State 19 user -> State 27 draft | Automated JUnit Mockito (`DraftTenantSecurityTest`) | **`UNIT_TEST`** | `revenue`<br>`DraftTenantSecurityTest.java:60-76` | **403 Forbidden** | **Inferred from Exception Mapping** (`assertThrows(SecurityException.class)`) | Service Method Level (Mockito direct call) | **PASS** | Mockito unit test instantiating `DistrictDraftDetailsServiceImpl`. No HTTP request or MockMvc involved. |
| **`TEST-MT-02`** | **Multi-Tenancy:** Same-State District Draft View Permitted | `GET /private/v1/draft/district/view/502`<br>State 19 user -> State 19 draft | Automated JUnit Mockito (`DraftTenantSecurityTest`) | **`UNIT_TEST`** | `revenue`<br>`DraftTenantSecurityTest.java:78-95` | **200 OK** | **Inferred from Code Flow** (`assertDoesNotThrow(...)`) | Service Method Level (Mockito direct call) | **PASS** | Mockito unit test confirming no exception thrown for same-tenant access. |
| **`TEST-MT-03`** | **Multi-Tenancy:** Cross-District Draft View within State | `GET /private/v1/draft/district/view/701`<br>District 101 -> District 202 | Automated JUnit Mockito (`DraftTenantSecurityTest`) | **`UNIT_TEST`** | `revenue`<br>`DraftTenantSecurityTest.java:136-155` | **403 Forbidden** | **Inferred from Exception Mapping** (`assertThrows(SecurityException.class)`) | Service Method Level (Mockito direct call) | **PASS** | Mockito unit test verifying district-level isolation within the same state. |
| **`TEST-MT-04`** | **Multi-Tenancy:** Cross-State District Draft Deletion | `POST /private/v1/draft/delete/601/D`<br>State 19 user -> State 27 draft | Automated JUnit Mockito (`DraftTenantSecurityTest`) | **`UNIT_TEST`** | `revenue`<br>`DraftTenantSecurityTest.java:98-114` | **403 Forbidden** | **Inferred from Exception Mapping** (`assertThrows(SecurityException.class)`) | Service Method Level (Mockito direct call) | **PASS** | Mockito unit test verifying tenant check on deletion of entity type 'D'. |
| **`TEST-MT-05`** | **Multi-Tenancy:** Same-State District Draft Deletion | `POST /private/v1/draft/delete/602/D`<br>State 19 user -> State 19 draft | Automated JUnit Mockito (`DraftTenantSecurityTest`) | **`UNIT_TEST`** | `revenue`<br>`DraftTenantSecurityTest.java:116-133` | **200 OK** | **Inferred from Code Flow** (`assertDoesNotThrow(...)`) | Service Method Level (Mockito direct call) | **PASS** | Mockito unit test verifying repository deletion proceeds for same-state draft. |
| **`TEST-MT-06`** | **Multi-Tenancy (BOLA):** Cross-State Subdistrict Draft View | `GET /private/v1/draft/subdistrict/view/801`<br>State 19 user -> State 27 draft | Automated JUnit Mockito (`DraftTenantSecurityTest`) | **`UNIT_TEST`** | `revenue`<br>`DraftTenantSecurityTest.java:157-174` | **403 Forbidden** | **Inferred from Exception Mapping** (`assertThrows(SecurityException.class)`) | Service Method Level (Mockito direct call) | **PASS** | Mockito unit test verifying `SubDistrictDraftDetailsServiceImpl` stateCode check (`RBAC-007`). |
| **`TEST-MT-07`** | **Multi-Tenancy:** Cross-State Subdistrict Draft Deletion | `POST /private/v1/draft/delete/802/T`<br>State 19 user -> State 27 draft | Automated JUnit Mockito (`DraftTenantSecurityTest`) | **`UNIT_TEST`** | `revenue`<br>`DraftTenantSecurityTest.java:176-194` | **403 Forbidden** | **Inferred from Exception Mapping** (`assertThrows(SecurityException.class)`) | Service Method Level (Mockito direct call) | **PASS** | Mockito unit test verifying non-district entity deletion check for type 'T' (`RBAC-008`). |
| **`TEST-MT-08`** | **Multi-Tenancy:** Cross-State Village Draft Deletion | `POST /private/v1/draft/delete/808/V`<br>State 19 user -> State 27 draft | Automated Regression Suite (`DraftEntityServiceImpl`) | **`STATIC_CODE_VERIFICATION`** | `revenue`<br>`DraftEntityServiceImpl.java:54-73` | **403 Forbidden** | **Inferred from Exception Mapping** (Code review of `resolveDraftStateCode`) | Static AST Code Inspection | **PASS** | Logic handles all types ('D', 'T', 'B', 'V') in code, but no dedicated unit test for type 'V' exists in test suite. |
| **`TEST-MT-09`** | **Multi-Tenancy:** Global User Directory Scoping | `GET /private/v1/users`<br>District Admin (State 19, Dist 101) | Automated Unit Suite (`UserServiceImplTest`) | **`STATIC_CODE_VERIFICATION`** | `user-management`<br>`UserServiceImpl.java:105-125` | **200 OK (Scoped)** | **Inferred from Code Flow** (Repository query branching) | Static AST Code Inspection | **PASS** | Scoping logic added to `UserServiceImpl`, but cited test method `getAllUsers_StateAdmin_ReturnsStateUsersOnly` does not exist in `UserServiceImplTest.java`. |
| **`TEST-MT-10`** | **Multi-Tenancy:** Cross-District Status Probing | `GET /private/v1/subdistrict/draft-status/201,202`<br>Dist 101 user queries Dist 201 | Controller Tenant Filter (`SubDistrictPrimaryController`) | **`STATIC_CODE_VERIFICATION`** | `revenue`<br>`SubDistrictPrimaryController.java:112-126` | **403 Forbidden** | **Inferred from Exception Mapping** (Throws `SecurityException` on mismatch) | Static AST Code Inspection | **PASS** | Controller asserts jurisdiction match; however, no automated unit test exists for `SubDistrictPrimaryController`. |
| **`TEST-MT-11`** | **Multi-Tenancy:** Forged/Omitted StateCode Claim | `GET /private/v1/draft/district/view/901`<br>Non-central token (`stateCode: null`) | Automated JUnit Mockito (`DraftTenantSecurityTest`) | **`UNIT_TEST`** | `revenue`<br>`DraftTenantSecurityTest.java:196-216` | **403 Forbidden** | **Inferred from Exception Mapping** (`assertThrows(SecurityException.class)`) | Service Method Level (Mockito direct call) | **PASS** | Mockito unit test verifying fail-closed behavior when non-central user has null `stateCode` (`RBAC-012`). |
| **`TEST-MT-12`** | **RBAC:** Unauthenticated Access Rejection | `GET /api/v1/users`<br>No Authorization Header | Automated JUnit MockMvc (`SecurityIntegrationTest`) | **`INTEGRATION_TEST`** | `user-management`<br>`SecurityIntegrationTest.java:25-29` | **401 Unauthorized** | **Asserted via Spring MockMvc** (`.andExpect(status().isUnauthorized())`) | In-Memory Spring MockMvc Context | **PASS** | Full Spring context with filter chain; asserts HTTP 401 via `mockMvc.perform()`. |
| **`TEST-MT-13`** | **RBAC:** Malformed/Tampered JWT Rejection | `GET /api/v1/users`<br>Bearer `invalid.token.value` | Automated JUnit MockMvc (`SecurityIntegrationTest`) | **`INTEGRATION_TEST`** | `user-management`<br>`SecurityIntegrationTest.java:31-36` | **401 Unauthorized** | **Asserted via Spring MockMvc** (`.andExpect(status().isUnauthorized())`) | In-Memory Spring MockMvc Context | **PASS** | Full Spring context with filter chain; asserts HTTP 401 via `mockMvc.perform()`. |
| **`TEST-MT-14`** | **RBAC:** Role Claim Presence in Issued JWT | `POST /public/v1/auth/login`<br>Generates JWT with `"roles"` array | Automated Unit Test (`AuthServiceImplTest`, `JwtUtilTest`) | **`UNIT_TEST`** | `auth-service`<br>`JwtUtilTest.java`, `AuthServiceImplTest.java` | **200 OK (Hardened)** | **Inferred from Code Flow** (`claims.get("roles") != null`) | Service & Util Unit Test Level | **PASS** | Unit tests assert that JWT claims map contains `"roles"` list. |
| **`TEST-MT-15`** | **RBAC:** `hasAnyRole` Evaluation in Downstream Services | `POST /private/v1/district/publish/create`<br>Bearer Token (Role: `STATE_ADMIN`) | Automated Filter Unit Tests (`JwtAuthenticationFilterTest`) | **`UNIT_TEST`** | `user-management`<br>`JwtAuthenticationFilterTest.java:55-80` | **200 OK** | **Inferred from Code Flow** (GrantedAuthorities mapped) | Filter Unit Test Level | **PASS** | Unit test verifies that `JwtAuthenticationFilter` populates `SimpleGrantedAuthority("ROLE_STATE_ADMIN")`. |
| **`TEST-MT-16`** | **Vertical Escalation:** Self-Elevation via Role Mapping | `POST /private/v1/user-roles`<br>District Admin assigns `SUPER_ADMIN` to self | Automated Unit Test (`UserRoleMappingServiceImplTest`) | **`STATIC_CODE_VERIFICATION`** | `user-management`<br>`UserRoleMappingServiceImpl.java:210-232` | **403 Forbidden** | **Inferred from Exception Mapping** (Throws `SecurityException` on self-assignment) | Static AST Code Inspection | **PASS** | Check implemented in `UserRoleMappingServiceImpl`, but no automated test method exists in `UserRoleMappingServiceImplTest.java`. |
| **`TEST-MT-17`** | **Vertical Escalation:** District Admin Creates Central Admin | `POST /private/v1/users`<br>District Admin creates Central Admin (`userLevel: 'C'`) | Automated Unit Test (`UserServiceImplTest`) | **`STATIC_CODE_VERIFICATION`** | `user-management`<br>`UserServiceImpl.java:64-75` | **403 Forbidden** | **Inferred from Exception Mapping** (Throws `SecurityException` on rank violation) | Static AST Code Inspection | **PASS** | Dominance check implemented in code, but no negative test exists in `UserServiceImplTest.java`. |
| **`TEST-MT-18`** | **Vertical Escalation:** Lower Tier Deletes Superior Officer | `POST /private/v1/users/delete/5`<br>District Admin deletes State Admin | Automated Unit Test (`UserServiceImplTest`) | **`STATIC_CODE_VERIFICATION`** | `user-management`<br>`UserServiceImpl.java:166-175` | **403 Forbidden** | **Inferred from Exception Mapping** (Throws `SecurityException` on rank dominance) | Static AST Code Inspection | **PASS** | Dominance check implemented in code, but no negative test exists in `UserServiceImplTest.java`. |
| **`TEST-MT-19`** | **Privilege Enforcement:** Unauthorized Privilege Creation | `POST /private/v1/privileges`<br>Viewer role creates privilege | Automated Integration Test (`RbacSecurityIntegrationTest`) | **`INTEGRATION_TEST`** | `user-management`<br>`RbacSecurityIntegrationTest.java:90-97` | **403 Forbidden** | **Asserted via Spring MockMvc** (`.andExpect(status().isForbidden())`) | In-Memory Spring MockMvc Context | **PASS** | Bootstraps `@SpringBootTest` with `@WithMockUser(authorities = {"VIEW_PRIVILEGE"})`. Asserts 403. |
| **`TEST-MT-20`** | **Privilege Enforcement:** Unauthorized Resource Modification | `POST /private/v1/resources`<br>Viewer role creates resource | Automated Integration Test (`RbacSecurityIntegrationTest`) | **`INTEGRATION_TEST`** | `user-management`<br>`RbacSecurityIntegrationTest.java:99-107` | **403 Forbidden** | **Asserted via Spring MockMvc** (`.andExpect(status().isForbidden())`) | In-Memory Spring MockMvc Context | **PASS** | Bootstraps `@SpringBootTest` with `@WithMockUser(authorities = {"VIEW_RESOURCE"})`. Asserts 403. |
| **`TEST-MT-21`** | **Privilege Enforcement:** Unauthorized Subdistrict Publication | `POST /private/v1/subdistrict/publish/create`<br>Unprivileged user publishes | Automated Unit Test (`SubDistrictPrimaryController`) | **`STATIC_CODE_VERIFICATION`** | `revenue`<br>`SubDistrictPrimaryController.java:144` | **403 Forbidden** | **Inferred from Exception Mapping** (`@PreAuthorize` annotation mapping) | Static AST Code Inspection | **PASS** | Method annotated with `@PreAuthorize`, but no automated test suite exists for `SubDistrictPrimaryController`. |
| **`TEST-MT-22`** | **Horizontal IDOR:** Cross-Tenant User Profile Lookup | `GET /private/v1/users/89`<br>State 19 user -> State 27 user | Automated Unit Test (`UserServiceImplTest`) | **`STATIC_CODE_VERIFICATION`** | `user-management`<br>`UserServiceImpl.java:93-100` | **403 Forbidden** | **Inferred from Exception Mapping** (Throws `SecurityException` on state mismatch) | Static AST Code Inspection | **PASS** | StateCode check added to `getUserById`, but no negative test exists in `UserServiceImplTest.java`. |
| **`TEST-MT-23`** | **Administrative Guardrails:** Self-Deletion Prevention | `POST /private/v1/users/delete/{self_id}`<br>Admin deletes own account | Automated Unit Test (`UserServiceImplTest`) | **`STATIC_CODE_VERIFICATION`** | `user-management`<br>`UserServiceImpl.java:158-164` | **400 Bad Request** | **Inferred from Exception Mapping** (Throws `IllegalArgumentException`) | Static AST Code Inspection | **PASS** | Guardrail added in `deleteUser`, but no negative test exists in `UserServiceImplTest.java`. |
| **`TEST-MT-24`** | **Frontend Enforcement:** Direct URL Route Navigation | Direct browser URL navigation to `/roles` without authority | React Component Verification & Vite Build (`lgd-um`) | **`FRONTEND_BUILD_VERIFICATION`** | `lgd-um`<br>`main.jsx:32-55`, `apiConfig.js` | **Access Denied View** | **Inferred from Client React Routing** (`<RoleGuard>` conditional render) | Frontend Compiler & AST Inspection | **PASS** | Verified via Vite production build (`npm run build` in 5.79s, 0 errors) and JSX code inspection. |
| **`TEST-MT-25`** | **Frontend Enforcement:** Privileged Button Visibility | Inspection of Edit/Delete action buttons in User Table | React Component Verification & Vite Build (`lgd-um`) | **`FRONTEND_BUILD_VERIFICATION`** | `lgd-um`<br>`UserManagement.jsx:400-440` | **Action Buttons Hidden** | **Inferred from Client DOM Rendering** (JSX conditional render) | Frontend Compiler & AST Inspection | **PASS** | Verified via Vite production build and JSX code inspection. |

---

## 3. Reconciliation Summary Statistics

### 3.1 Verification Level Breakdown

```
+-----------------------------------------------------------------------------------------+
| Classification               | Count | Percentage | Verification Description            |
+-----------------------------------------------------------------------------------------+
| UNIT_TEST                    |   10  |   40.0%    | Isolated Mockito & Service Tests    |
| INTEGRATION_TEST             |    4  |   16.0%    | In-Memory Spring Boot MockMvc Tests |
| STATIC_CODE_VERIFICATION     |    9  |   36.0%    | Static AST / Logic Analysis Only    |
| FRONTEND_BUILD_VERIFICATION  |    2  |    8.0%    | Production Vite Build & JSX Review  |
| FRONTEND_COMPONENT_TEST      |    0  |    0.0%    | No standalone React Testing Lib tests|
| RUNTIME_API_TEST             |    0  |    0.0%    | Zero live network HTTP API tests    |
+-----------------------------------------------------------------------------------------+
| TOTAL                        |   25  |  100.0%    | 100% of Scenarios Cataloged         |
+-----------------------------------------------------------------------------------------+
```

### 3.2 HTTP Status Verification Mechanism Distribution

```
+-----------------------------------------------------------------------------------------+
| HTTP Status Evaluation Mechanism                         | Count | Associated Tests     |
+-----------------------------------------------------------------------------------------+
| Asserted via Spring MockMvc (.andExpect)                 |    4  | MT-12, 13, 19, 20    |
| Inferred from Java Exception Mapping (SecurityException) |   12  | MT-01, 03, 04, 06,   |
|                                                          |       | MT-07, 08, 10, 11,   |
|                                                          |       | MT-16, 17, 18, 22    |
| Inferred from Code Flow / Absence of Exception           |    6  | MT-02, 05, 09, 14,   |
|                                                          |       | MT-15, 21            |
| Inferred from Validation Exception (IllegalArgumentExc)  |    1  | MT-23                |
| Inferred from Client-Side React Interception             |    2  | MT-24, 25            |
| Asserted via Actual HTTP Network Request over TCP        |    0  | None                 |
+-----------------------------------------------------------------------------------------+
| TOTAL                                                    |   25  |                      |
+-----------------------------------------------------------------------------------------+
```

### 3.3 Key Auditor Findings on Test Suite Deficiencies
1. **Zero End-to-End Runtime HTTP Verification:** Not a single test in Phase 6 was executed against running container ports over the network. All reported HTTP codes in unit tests were projected based on expected framework exception translation.
2. **Untested Service Logic (False Test Claims):** Nine test cases (`TEST-MT-08`, `09`, `10`, `16`, `17`, `18`, `21`, `22`, `23`) were reported in submitted registers as passing automated unit tests, but exist **only as source-code implementation logic** without corresponding test execution artifacts in Maven Surefire reports.
3. **MockMvc Scope Limitation:** The four integration tests in `RbacSecurityIntegrationTest` and `SecurityIntegrationTest` validate in-memory Spring DispatcherServlet handling with `@WithMockUser`, but do not test actual JWT signature generation, gateway token forwarding, or cross-service Eureka communication.
