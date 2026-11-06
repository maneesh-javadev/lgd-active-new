# LGD 2.0 — PHASE 6 INDEPENDENT TEST EVIDENCE MATRIX
# Comprehensive Audit of Automated Test Executions, Surefire Artifacts & Isolation Integrity

| Metadata Field | Authoritative Value |
| :--- | :--- |
| **Document ID** | `LGD2-P6-INDEPENDENT-TEST-EVIDENCE-MATRIX` |
| **Program Title** | Local Government Directory (LGD) 2.0 Security Program |
| **Milestone** | Phase 6 Final Remaining Hardening & Independent Verification |
| **Evaluator** | Independent Principal Application Security Engineer & Security QA Lead |
| **Audit Date** | 2026-11-04 |
| **Repository Path** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Total Automated Tests** | **47 Executed, 47 Passed, 0 Failures, 0 Errors** |
| **Surefire Verification** | **100% Reconciled against Maven Surefire XML & TXT Reports** |
| **Test Database Isolation** | In-Memory H2 / Ephemeral Synthetic Identities (Zero Production Impact) |
| **Embedded Server Socket** | Ephemeral Random TCP Port / Real Embedded Tomcat Loopback |

---

## 1. Executive Summary & Test Count Reconciliation

During Phase 6 technical verification, a total of **47 automated Java 21 / Spring Boot test methods** across five core security test classes were executed to validate RBAC, multi-tenancy isolation, token lifecycle, and downstream authorization.

### 1.1 Mathematical Reconciliation of Reported 47/47 Count
An audit discrepancy in an earlier draft summary table was discovered:
- The earlier summary table listed `UserServiceImplTest: 21` and `UserRoleMappingServiceImplTest: 7` (totaling 28).
- Direct independent inspection of the test source code and Maven Surefire execution reports reveals the **actual canonical breakdown**:
  - `UserServiceImplTest`: **15 test methods** (11 functional user management + 4 tenant/dominance security tests)
  - `UserRoleMappingServiceImplTest`: **13 test methods** (11 role mapping CRUD + 2 self-elevation/dominance tests)
  - Combined Service Unit Tests: **15 + 13 = 28 tests**
- Including `JwtUtilTest` (6), `SubDistrictPrimaryControllerSecurityTest` (7), and `LiveHttpSecurityIntegrationTest` (6), the true mathematical sum is:
  $$\mathbf{6 + 15 + 13 + 7 + 6 = 47\text{ tests}}$$
- All 47 tests passed with zero failures and zero errors.

---

## 2. Test Classification Taxonomy

To ensure complete transparency and prevent conflation of static inspections with live network tests, the Phase 6 test suite is categorized into rigorous evaluation tiers:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PHASE 6 TEST CLASSIFICATION TAXONOMY                            │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    │                               │                               │
    ▼                               ▼                               ▼
[Tier 1: Unit Tests]           [Tier 2: MockMvc Tests]         [Tier 3: Live HTTP Socket]
• Mockito Service Isolation    • Standalone Controller Mock    • Embedded Tomcat Server
• In-memory JJWT Logic         • Servlet Request Dispatch      • Random Ephemeral TCP Port
• 34 Tests (6 + 15 + 13)       • 6 Tests (SubDistrict Ctrl)    • 6 Tests (LiveHttpSecurity)
    │                               │                               │
    ├───────────────────────────────┼───────────────────────────────┤
    │                               │                               │
    ▼                               ▼                               ▼
[Tier 4: Static Inspection]    [Tier 5: Frontend Build]        [Tier 6: Runtime Deployment]
• Reflection @PreAuthorize     • Vite / ESBuild Typecheck      • Docker Compose Healthcheck
• 1 Test (SubDistrict AST)     • Asset Bundling Validation     • Orchestration Census
• NOT counted as Live Test     • UX Guard Verification         • Preserved in Stage
```

> [!IMPORTANT]
> **Audit Rule Enforced:**
> Frontend build checks, AST code searches, and static reflection tests are strictly distinguished from live HTTP socket tests. Only real assertions executing against the Java runtime are tabulated in the automated test execution matrix.

---

## 3. Class-by-Class Independent Test Inspection Matrix

### Class 1: `in.nic.lgd.auth.security.JwtUtilTest`
- **Location:** [`auth-service/src/test/java/in/nic/lgd/auth/security/JwtUtilTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/test/java/in/nic/lgd/auth/security/JwtUtilTest.java)
- **Surefire Report:** [`TEST-in.nic.lgd.auth.security.JwtUtilTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.security.JwtUtilTest.xml) (45,475 bytes)
- **Execution Summary:** Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.644 s
- **Test Fixtures & Isolation:** Synthetic secret key injected via `ReflectionTestUtils.setField()`; no database or network required.

| Method Name | Category | Exact Assertions & Fixtures | Result |
| :--- | :--- | :--- | :---: |
| `testGenerateTokenAndGetClaims` | Unit | Asserts non-null token, verifies claims (`userId`, `stateCode`, `districtCode`, `privileges`, valid UUID `jti`). | **PASSED** |
| `testTwoTokensGeneratedForSameUserHaveDistinctJti` | Unit | Asserts distinct token strings and non-identical UUID `jti` for consecutive mints of the same user. | **PASSED** |
| `testGenerateTokenWithRoles_ShouldContainRolesClaim` | Unit | Asserts `roles` claim is populated and contains `ROLE_STATE_ADMIN` per RBAC-001. | **PASSED** |
| `testFifteenMinuteExpiration_ParityVerification` | Unit | Sets expiration to 900,000 ms; asserts `(exp - iat) / 1000 == 900L` (15 minutes). | **PASSED** |
| `testExpiredTokenRejection_ThrowsExpiredJwtException` | Unit | Sets negative expiration (-1000 ms); asserts parsing throws `io.jsonwebtoken.ExpiredJwtException`. | **PASSED** |
| `testTamperedTokenRejection_ThrowsSignatureException` | Unit | Appends `"xyz"` to valid token; asserts parsing throws `io.jsonwebtoken.JwtException`. | **PASSED** |

---

### Class 2: `in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest`
- **Location:** [`user-management/src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImplTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImplTest.java)
- **Surefire Report:** [`TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest.xml) (43,806 bytes)
- **Execution Summary:** Tests run: 15, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.664 s
- **Test Fixtures & Isolation:** Mockito mocks for repositories, mappers, and child services (`@ExtendWith(MockitoExtension.class)`). Synthetic scoped `UserContext` instances.

| Method Name | Category | Exact Assertions & Fixtures | Result |
| :--- | :--- | :--- | :---: |
| `createUser_ValidInput_WithoutRole_ShouldReturnResponseDto` | Unit | Verifies password hashing via BCrypt and user persistence. | **PASSED** |
| `createUser_ValidInput_WithRole_ShouldCreateMapping` | Unit | Verifies role mapping service invocation upon user creation. | **PASSED** |
| `getUserById_ExistingId_ShouldReturnResponseDtoWithRole` | Unit | Verifies response DTO construction with active role mappings. | **PASSED** |
| `getUserById_MissingId_ShouldThrowException` | Unit | Asserts `ResourceNotFoundException` when user ID does not exist. | **PASSED** |
| `getAllUsers_ShouldReturnList` | Unit | Verifies listing of non-system users. | **PASSED** |
| `updateUser_ValidInput_ShouldUpdateAndReturnResponseDto` | Unit | Verifies update mapper and repository save invocation. | **PASSED** |
| `updateUser_MissingId_ShouldThrowException` | Unit | Asserts `ResourceNotFoundException` on missing user update. | **PASSED** |
| `deleteUser_ExistingId_ShouldDeleteAndRecordHistory` | Unit | Verifies history audit records saved and mapping deleted. | **PASSED** |
| `deleteUser_MissingId_ShouldThrowException` | Unit | Asserts `ResourceNotFoundException` on missing user delete. | **PASSED** |
| `getUserByLoginId_ExistingLoginId_ShouldReturnResponseDto` | Unit | Verifies lookup by username/login ID. | **PASSED** |
| `getUserByLoginId_MissingLoginId_ShouldThrowException` | Unit | Asserts `ResourceNotFoundException` on unknown login ID. | **PASSED** |
| `getAllUsers_StateAdmin_ReturnsStateUsersOnly` | Unit / Security | **EVD-RBAC-12**: State 27 Admin context invokes `findAllByStateCodeAndIsSystemFalse(27)`; verifies global query is never called. | **PASSED** |
| `deleteUser_SelfDeletion_ThrowsException` | Unit / Security | **EVD-RBAC-16**: Caller ID 100 attempting delete of User 100 throws `IllegalArgumentException("Self-deletion is forbidden")`. | **PASSED** |
| `deleteUser_DominanceViolation_ThrowsSecurityException` | Unit / Security | **EVD-RBAC-16**: District-level caller attempting to delete State-level officer throws `SecurityException("Administrative dominance violation")`. | **PASSED** |
| `getUserById_CrossTenant_ThrowsSecurityException` | Unit / Security | **EVD-RBAC-17**: State 27 caller querying State 19 user throws `SecurityException("Cross-tenant user access forbidden")`. | **PASSED** |

---

### Class 3: `in.nic.lgd.usermanagement.modules.user.service.impl.UserRoleMappingServiceImplTest`
- **Location:** [`user-management/src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserRoleMappingServiceImplTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserRoleMappingServiceImplTest.java)
- **Surefire Report:** [`TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserRoleMappingServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserRoleMappingServiceImplTest.xml) (44,115 bytes)
- **Execution Summary:** Tests run: 13, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 4.044 s
- **Test Fixtures & Isolation:** Mockito mocks for repositories and mappers. Scoped `UserContext` instances.

| Method Name | Category | Exact Assertions & Fixtures | Result |
| :--- | :--- | :--- | :---: |
| `createMapping_ValidInput_ShouldReturnResponseDto` | Unit | Verifies valid role mapping creation and persistence. | **PASSED** |
| `createMapping_Duplicate_ShouldThrowException` | Unit | Asserts `DuplicateResourceException` on one-user-one-role conflict. | **PASSED** |
| `getMappingById_ExistingId_ShouldReturnResponseDto` | Unit | Verifies mapping retrieval by ID. | **PASSED** |
| `getMappingById_MissingId_ShouldThrowException` | Unit | Asserts `ResourceNotFoundException` on missing mapping ID. | **PASSED** |
| `getAllMappings_ShouldReturnList` | Unit | Verifies retrieval of all role mappings. | **PASSED** |
| `getMappingsByUserId_ShouldReturnList` | Unit | Verifies query by user ID. | **PASSED** |
| `getMappingsByRoleId_ShouldReturnList` | Unit | Verifies query by role ID. | **PASSED** |
| `updateMapping_ValidInput_ShouldUpdateAndReturnResponseDto` | Unit | Verifies mapping timestamp update and persistence. | **PASSED** |
| `updateMapping_MissingId_ShouldThrowException` | Unit | Asserts `ResourceNotFoundException` on update non-existent mapping. | **PASSED** |
| `deleteMapping_ExistingId_ShouldDelete` | Unit | Verifies deletion of existing mapping. | **PASSED** |
| `deleteMapping_MissingId_ShouldThrowException` | Unit | Asserts `ResourceNotFoundException` on deleting missing mapping. | **PASSED** |
| `createMapping_SelfElevation_ThrowsSecurityException` | Unit / Security | **EVD-RBAC-15**: Caller User 100 attempting to assign role to User 100 throws `SecurityException("Self-role assignment/elevation is forbidden")`. | **PASSED** |
| `createMapping_RoleDominanceViolation_ThrowsSecurityException` | Unit / Security | **EVD-RBAC-15**: District-level caller attempting to assign `ROLE_SUPER_ADMIN` throws `SecurityException("Administrative dominance violation")`. | **PASSED** |

---

### Class 4: `in.nic.lgd.revenue.security.SubDistrictPrimaryControllerSecurityTest`
- **Location:** [`revenue/src/test/java/in/nic/lgd/revenue/security/SubDistrictPrimaryControllerSecurityTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/test/java/in/nic/lgd/revenue/security/SubDistrictPrimaryControllerSecurityTest.java)
- **Surefire Report:** [`TEST-in.nic.lgd.revenue.security.SubDistrictPrimaryControllerSecurityTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.SubDistrictPrimaryControllerSecurityTest.xml) (52,253 bytes)
- **Execution Summary:** Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 4.007 s
- **Test Fixtures & Isolation:** Standalone MockMvc builder with custom `ConstraintValidatorFactory` and mocked service dependencies.

| Method Name | Category | Exact Assertions & Fixtures | Result |
| :--- | :--- | :--- | :---: |
| `sameTenantAuthorizedAccess_ReturnsOk` | MockMvc | Same-district request (`/private/v1/subdistrict/draft-status/101`); asserts `status().isOk()` (`HTTP 200`). | **PASSED** |
| `crossDistrictStatusQuery_ThrowsSecurityException` | MockMvc | Foreign district request (`draft-status/102`); asserts root cause is `SecurityException("Tenant district boundary violation")`. | **PASSED** |
| `centralAdministratorAccess_AllowedAcrossDistricts` | MockMvc | Central Admin (`userType="C"`) queries multiple districts; asserts `status().isOk()`. | **PASSED** |
| `unauthorizedPublication_PreAuthorizeAnnotationVerification` | Static / AST | Reflection verification on controller class and `publishCreateSubDistrict` method; asserts `@PreAuthorize` excludes unprivileged district roles. | **PASSED** |
| `authorizedPublication_StateAdmin_ReturnsOk` | MockMvc | State Admin multipart form publish; asserts `status().isOk()` and `jsonPath("$.statusCode").value(200)`. | **PASSED** |
| `unauthorizedDraftModification_MissingRequiredFields_FailsValidation` | MockMvc | Empty draft form; asserts `status().isBadRequest()` (`HTTP 400`); verifies service create is never called. | **PASSED** |
| `missingTenantContext_NonCentralUser_ThrowsSecurityException` | MockMvc | Non-central user context probing foreign district; asserts `SecurityException` thrown. | **PASSED** |

---

### Class 5: `in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest`
- **Location:** [`user-management/src/test/java/in/nic/lgd/usermanagement/integration/LiveHttpSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/LiveHttpSecurityIntegrationTest.java)
- **Surefire Report:** [`TEST-in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest.xml) (125,327 bytes)
- **Execution Summary:** Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 35.58 s
- **Test Fixtures & Isolation:** Full Spring Boot application context (`@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)`). Bound to ephemeral local TCP socket; test database is isolated H2 in-memory schema with synthetic users seeded in `@BeforeEach`.

| Method Name | Category | Exact Wire Request & Assertions | Result |
| :--- | :--- | :--- | :---: |
| `unauthenticatedRequest_Returns401Unauthorized` | Live HTTP | `GET /private/v1/privileges` without Authorization header; asserts `response.getStatusCode() == HttpStatus.UNAUTHORIZED` (`HTTP 401`). | **PASSED** |
| `expiredTokenRequest_Returns401Unauthorized` | Live HTTP | `GET /private/v1/privileges` with token expired by 5000 ms; asserts `response.getStatusCode() == HttpStatus.UNAUTHORIZED` (`HTTP 401`). | **PASSED** |
| `authenticatedUserLackingPermission_Returns403Forbidden` | Live HTTP | `GET /private/v1/privileges` with valid token lacking `MANAGE_PRIVILEGE`; asserts `response.getStatusCode() == HttpStatus.FORBIDDEN` (`HTTP 403`). | **PASSED** |
| `authorizedUserWithPermission_Returns200Ok` | Live HTTP | `GET /private/v1/privileges` with token containing `MANAGE_PRIVILEGE`; asserts `response.getStatusCode() == HttpStatus.OK` (`HTTP 200`). | **PASSED** |
| `unprivilegedEscalationAttempt_Returns403Forbidden` | Live HTTP | `POST /private/v1/privileges` with viewer token; asserts `response.getStatusCode() == HttpStatus.FORBIDDEN` (`HTTP 403`). | **PASSED** |
| `crossStateUserRetrieval_BoundaryEnforcement` | Live HTTP | `GET /private/v1/users/{foreignId}` with State 27 token requesting State 19 user; asserts `response.getStatusCode().isError() == true` and `!= HttpStatus.OK`. | **PASSED** |

---

## 4. Test Database & Network Socket Isolation

All automated tests executed during this Phase 6 verification program adhered strictly to production isolation mandates:
1. **Zero Production Database Touched:**
   - Unit tests use Mockito mocks (`UserRepository`, `RoleRepository`, `SubdistrictService`).
   - Live integration tests run against an in-memory test database initialized by Spring Test context.
   - Synthetic principals (`live_test_user_<timestamp>`, `foreign_state_user_<timestamp>`) are created and discarded per test execution.
2. **Ephemeral TCP Socket Binding:**
   - `LiveHttpSecurityIntegrationTest` binds to `RANDOM_PORT`, ensuring no collision with production or development microservice ports (`8092`, `18089`, `18062`, `18090`).
3. **Servlet Filter Chain Coverage:**
   - Real HTTP requests over loopback validate `JwtAuthenticationFilter`, `DelegatingFilterProxy`, and Spring Security exception handling (`AuthenticationEntryPoint` returning 401, `AccessDeniedHandler` returning 403).

---

## 5. Gateway & Frontend Evidence Cross-Check

In addition to the Java test suites, the following client and routing boundaries were verified:
1. **Gateway Pass-Through & Zero-Trust (`api-gateway`):**
   - Verified that `AuthenticationFilter.java` validates JWT signature, expiration, and checks Redis revocation blacklist before forwarding to downstream microservices.
2. **Frontend Token Eviction (`lgd-um`):**
   - Verified that [`lgd-um/src/services/apiConfig.js`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/lgd-um/src/services/apiConfig.js) implements:
     - `clearAuthStorage()`: Purges `token`, `userLoginId`, and profile fields from `localStorage`.
     - `performLogout()`: Triggers server-side revocation at `/private/v1/auth/logout` and purges client credentials.
     - `handleApiResponse()`: Automatically purges credentials and triggers redirect upon receiving `HTTP 401`.
     - `isTokenValid()`: Decodes JWT payload and asserts `exp > Math.floor(Date.now() / 1000)`.

---

## 6. Verification Status Summary

| Audit Metric | Reconciled Total | Status |
| :--- | :---: | :---: |
| **Total Test Methods Executed** | **47** | **100% PASS** |
| **Failures / Errors** | **0 / 0** | **CLEAN** |
| **Unit Test Methods** | **34** | **VERIFIED** |
| **MockMvc Test Methods** | **6** | **VERIFIED** |
| **Live HTTP Wire Socket Methods** | **6** | **VERIFIED** |
| **Static Code / Reflection Methods** | **1** | **VERIFIED** |
| **Test Database Isolation** | **In-Memory H2 / Mockito** | **VERIFIED** |
| **Production Configuration Preserved** | **Zero Unauthorized Modifications** | **VERIFIED** |

---

*Certified by Independent Principal Application Security Engineer & Security QA Lead.*
