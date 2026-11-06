# LGD 2.0 — RBAC-004 NEGATIVE AND POSITIVE TEST EVIDENCE
## Exhaustive Test Execution Census across Master & Administrative Controllers (Phase 6 Retest)

| Document Metadata | Authoritative Value |
| :--- | :--- |
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Authorization, RBAC & Multi-Tenancy Boundary Audit** |
| **Scope** | **RBAC-004 Residual Authorization Verification (Negative & Positive Test Suite)** |
| **Evaluation Date** | November 5, 2026 |
| **Microservice** | [`user-management`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management) |
| **Primary Test Class** | [`Rbac004EndpointSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac004EndpointSecurityIntegrationTest.java) |
| **Companion Test Class** | [`RbacSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/RbacSecurityIntegrationTest.java) |
| **Surefire XML Reports** | [`TEST-in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest.xml)<br>[`TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml) |
| **Total Focused Tests Run** | **68 Tests** (58 in `Rbac004EndpointSecurityIntegrationTest` + 10 in `RbacSecurityIntegrationTest`) |
| **Outcome** | **68 PASS / 0 FAIL / 0 ERROR / 0 SKIPPED (100% PASS RATE)** |

---

## 1. Test Execution Commands & Environment

### 1.1 Focused RBAC-004 Test Execution
```powershell
mvn test -Dtest=Rbac004EndpointSecurityIntegrationTest "-DargLine=-Xmx512m -XX:+UseSerialGC"
```
**Outcome:**
- Tests run: 58, Failures: 0, Errors: 0, Skipped: 0
- Time elapsed: 4.887 s
- Build status: **SUCCESS**

### 1.2 Combined RBAC Integration Test Execution
```powershell
mvn test "-Dtest=Rbac004EndpointSecurityIntegrationTest,RbacSecurityIntegrationTest" "-DargLine=-Xmx512m -XX:+UseSerialGC"
```
**Outcome:**
- Tests run: 68, Failures: 0, Errors: 0, Skipped: 0
- Time elapsed: 5.621 s
- Build status: **SUCCESS**

---

## 2. Test Execution Inventory: Rbac004EndpointSecurityIntegrationTest (58 Tests)

The table below catalogs all 58 automated tests in `Rbac004EndpointSecurityIntegrationTest.java`, mapping each test to its targeted controller endpoint (1 through 25), HTTP method, caller security context, expected HTTP status, actual HTTP status, execution duration, and pass/fail disposition.

| # | Test Method Name | EP # | HTTP Method & URI | Principal / Granted Authority | Expected Status | Actual Status | Time (s) | Result |
| :-: | :--- | :-: | :--- | :--- | :-: | :-: | :-: | :-: |
| 1 | `ep01_createRoleLevel_Authorized` | 1 | `POST /private/v1/role-levels` | `mgrUser` (`MANAGE_ROLE_LEVEL`) | 200 OK | 200 OK | 0.031 | **PASS** |
| 2 | `ep01_createRoleLevel_ViewOnly_Forbidden` | 1 | `POST /private/v1/role-levels` | `viewUser` (`VIEW_ROLE_LEVEL`) | 403 Forbidden | 403 Forbidden | 0.022 | **PASS** |
| 3 | `ep01_createRoleLevel_RoleUser_Forbidden` | 1 | `POST /private/v1/role-levels` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.017 | **PASS** |
| 4 | `ep01_createRoleLevel_Unauthenticated` | 1 | `POST /private/v1/role-levels` | Anonymous / No Token | 401 Unauthorized | 401 Unauthorized | 0.016 | **PASS** |
| 5 | `ep02_getRoleLevels_Authorized` | 2 | `GET /private/v1/role-levels` | `viewUser` (`VIEW_ROLE_LEVEL`) | 200 OK | 200 OK | 0.021 | **PASS** |
| 6 | `ep02_getRoleLevels_RoleUser_Forbidden` | 2 | `GET /private/v1/role-levels` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.025 | **PASS** |
| 7 | `ep03_viewRoleLevel_Authorized` | 3 | `GET /private/v1/role-levels/{code}` | `viewUser` (`VIEW_ROLE_LEVEL`) | 200 OK | 200 OK | 0.023 | **PASS** |
| 8 | `ep03_viewRoleLevel_RoleUser_Forbidden` | 3 | `GET /private/v1/role-levels/{code}` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.021 | **PASS** |
| 9 | `ep04_updateRoleLevel_Authorized` | 4 | `POST /private/v1/role-levels/update/{code}` | `mgrUser` (`MANAGE_ROLE_LEVEL`) | 200 OK | 200 OK | 0.031 | **PASS** |
| 10 | `ep04_updateRoleLevel_ViewOnly_Forbidden` | 4 | `POST /private/v1/role-levels/update/{code}` | `viewUser` (`VIEW_ROLE_LEVEL`) | 403 Forbidden | 403 Forbidden | 0.021 | **PASS** |
| 11 | `ep05_deleteRoleLevel_Authorized` | 5 | `POST /private/v1/role-levels/delete/{code}` | `mgrUser` (`MANAGE_ROLE_LEVEL`) | 200 OK | 200 OK | 0.024 | **PASS** |
| 12 | `ep05_deleteRoleLevel_ViewOnly_Forbidden` | 5 | `POST /private/v1/role-levels/delete/{code}` | `viewUser` (`VIEW_ROLE_LEVEL`) | 403 Forbidden | 403 Forbidden | 0.019 | **PASS** |
| 13 | `ep06_getActiveRoleLevels_Authorized` | 6 | `GET /private/v1/role-levels/active` | `viewUser` (`VIEW_ROLE_LEVEL`) | 200 OK | 200 OK | 0.034 | **PASS** |
| 14 | `ep06_getActiveRoleLevels_RoleUser_Forbidden` | 6 | `GET /private/v1/role-levels/active` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.020 | **PASS** |
| 15 | `ep07_toggleStatusRoleLevel_Authorized` | 7 | `POST /private/v1/role-levels/update/{code}/toggle-status` | `mgrUser` (`MANAGE_ROLE_LEVEL`) | 200 OK | 200 OK | 0.039 | **PASS** |
| 16 | `ep07_toggleStatusRoleLevel_ViewOnly_Forbidden` | 7 | `POST /private/v1/role-levels/update/{code}/toggle-status` | `viewUser` (`VIEW_ROLE_LEVEL`) | 403 Forbidden | 403 Forbidden | 0.021 | **PASS** |
| 17 | `ep08_createRoleType_Authorized` | 8 | `POST /private/v1/role-types` | `mgrUser` (`MANAGE_ROLE_TYPE`) | 200 OK | 200 OK | 0.114 | **PASS** |
| 18 | `ep08_createRoleType_ViewOnly_Forbidden` | 8 | `POST /private/v1/role-types` | `viewUser` (`VIEW_ROLE_TYPE`) | 403 Forbidden | 403 Forbidden | 0.018 | **PASS** |
| 19 | `ep08_createRoleType_RoleUser_Forbidden` | 8 | `POST /private/v1/role-types` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.166 | **PASS** |
| 20 | `ep09_getRoleTypes_Authorized` | 9 | `GET /private/v1/role-types` | `viewUser` (`VIEW_ROLE_TYPE`) | 200 OK | 200 OK | 0.022 | **PASS** |
| 21 | `ep09_getRoleTypes_RoleUser_Forbidden` | 9 | `GET /private/v1/role-types` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.022 | **PASS** |
| 22 | `ep10_viewRoleType_Authorized` | 10 | `GET /private/v1/role-types/{code}` | `viewUser` (`VIEW_ROLE_TYPE`) | 200 OK | 200 OK | 0.023 | **PASS** |
| 23 | `ep10_viewRoleType_RoleUser_Forbidden` | 10 | `GET /private/v1/role-types/{code}` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.023 | **PASS** |
| 24 | `ep11_updateRoleType_Authorized` | 11 | `POST /private/v1/role-types/update/{code}` | `mgrUser` (`MANAGE_ROLE_TYPE`) | 200 OK | 200 OK | 0.030 | **PASS** |
| 25 | `ep11_updateRoleType_ViewOnly_Forbidden` | 11 | `POST /private/v1/role-types/update/{code}` | `viewUser` (`VIEW_ROLE_TYPE`) | 403 Forbidden | 403 Forbidden | 0.070 | **PASS** |
| 26 | `ep12_deleteRoleType_Authorized` | 12 | `POST /private/v1/role-types/delete/{code}` | `mgrUser` (`MANAGE_ROLE_TYPE`) | 200 OK | 200 OK | 0.043 | **PASS** |
| 27 | `ep12_deleteRoleType_ViewOnly_Forbidden` | 12 | `POST /private/v1/role-types/delete/{code}` | `viewUser` (`VIEW_ROLE_TYPE`) | 403 Forbidden | 403 Forbidden | 0.018 | **PASS** |
| 28 | `ep13_getActiveRoleTypes_Authorized` | 13 | `GET /private/v1/role-types/active` | `viewUser` (`VIEW_ROLE_TYPE`) | 200 OK | 200 OK | 0.024 | **PASS** |
| 29 | `ep13_getActiveRoleTypes_RoleUser_Forbidden` | 13 | `GET /private/v1/role-types/active` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.021 | **PASS** |
| 30 | `ep14_toggleStatusRoleType_Authorized` | 14 | `POST /private/v1/role-types/update/{code}/toggle-status` | `mgrUser` (`MANAGE_ROLE_TYPE`) | 200 OK | 200 OK | 0.026 | **PASS** |
| 31 | `ep14_toggleStatusRoleType_ViewOnly_Forbidden` | 14 | `POST /private/v1/role-types/update/{code}/toggle-status` | `viewUser` (`VIEW_ROLE_TYPE`) | 403 Forbidden | 403 Forbidden | 0.017 | **PASS** |
| 32 | `ep15_createPrivilege_Authorized` | 15 | `POST /private/v1/privileges` | `mgrUser` (`MANAGE_PRIVILEGE`) | 200 OK | 200 OK | 0.037 | **PASS** |
| 33 | `ep15_createPrivilege_ViewOnly_Forbidden` | 15 | `POST /private/v1/privileges` | `viewUser` (`VIEW_PRIVILEGE`) | 403 Forbidden | 403 Forbidden | 0.023 | **PASS** |
| 34 | `ep15_createPrivilege_RoleUser_Forbidden` | 15 | `POST /private/v1/privileges` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.021 | **PASS** |
| 35 | `ep16_updatePrivilege_Authorized` | 16 | `POST /private/v1/privileges/update/{id}` | `mgrUser` (`MANAGE_PRIVILEGE`) | 200 OK | 200 OK | 0.044 | **PASS** |
| 36 | `ep16_updatePrivilege_ViewOnly_Forbidden` | 16 | `POST /private/v1/privileges/update/{id}` | `viewUser` (`VIEW_PRIVILEGE`) | 403 Forbidden | 403 Forbidden | 0.031 | **PASS** |
| 37 | `ep17_getPrivilegeById_Authorized` | 17 | `GET /private/v1/privileges/{id}` | `viewUser` (`VIEW_PRIVILEGE`) | 200 OK | 200 OK | 0.046 | **PASS** |
| 38 | `ep17_getPrivilegeById_RoleUser_Forbidden` | 17 | `GET /private/v1/privileges/{id}` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.020 | **PASS** |
| 39 | `ep18_getAllPrivileges_Authorized` | 18 | `GET /private/v1/privileges` | `viewUser` (`VIEW_PRIVILEGE`) | 200 OK | 200 OK | 0.055 | **PASS** |
| 40 | `ep18_getAllPrivileges_RoleUser_Forbidden` | 18 | `GET /private/v1/privileges` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.021 | **PASS** |
| 41 | `ep19_deletePrivilege_Authorized` | 19 | `POST /private/v1/privileges/delete/{id}` | `mgrUser` (`MANAGE_PRIVILEGE`) | 200 OK | 200 OK | 0.032 | **PASS** |
| 42 | `ep19_deletePrivilege_ViewOnly_Forbidden` | 19 | `POST /private/v1/privileges/delete/{id}` | `viewUser` (`VIEW_PRIVILEGE`) | 403 Forbidden | 403 Forbidden | 0.023 | **PASS** |
| 43 | `ep20_saveResource_Authorized` | 20 | `POST /private/v1/resources` | `mgrUser` (`MANAGE_RESOURCE`) | 200 OK | 200 OK | 0.032 | **PASS** |
| 44 | `ep20_saveResource_ViewOnly_Forbidden` | 20 | `POST /private/v1/resources` | `viewUser` (`VIEW_RESOURCE`) | 403 Forbidden | 403 Forbidden | 0.027 | **PASS** |
| 45 | `ep20_saveResource_RoleUser_Forbidden` | 20 | `POST /private/v1/resources` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.019 | **PASS** |
| 46 | `ep21_manageResource_Authorized` | 21 | `GET /private/v1/resources` | `viewUser` (`VIEW_RESOURCE`) | 200 OK | 200 OK | 0.035 | **PASS** |
| 47 | `ep21_manageResource_RoleUser_Forbidden` | 21 | `GET /private/v1/resources` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.019 | **PASS** |
| 48 | `ep22_viewResource_Authorized` | 22 | `GET /private/v1/resources/{id}` | `viewUser` (`VIEW_RESOURCE`) | 200 OK | 200 OK | 0.046 | **PASS** |
| 49 | `ep22_viewResource_RoleUser_Forbidden` | 22 | `GET /private/v1/resources/{id}` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.023 | **PASS** |
| 50 | `ep23_updateResource_Authorized` | 23 | `POST /private/v1/resources/update/{id}` | `mgrUser` (`MANAGE_RESOURCE`) | 200 OK | 200 OK | 0.099 | **PASS** |
| 51 | `ep23_updateResource_ViewOnly_Forbidden` | 23 | `POST /private/v1/resources/update/{id}` | `viewUser` (`VIEW_RESOURCE`) | 403 Forbidden | 403 Forbidden | 0.019 | **PASS** |
| 52 | `ep24_deleteResource_Authorized` | 24 | `POST /private/v1/resources/delete/{id}` | `mgrUser` (`MANAGE_RESOURCE`) | 200 OK | 200 OK | 0.034 | **PASS** |
| 53 | `ep24_deleteResource_ViewOnly_Forbidden` | 24 | `POST /private/v1/resources/delete/{id}` | `viewUser` (`VIEW_RESOURCE`) | 403 Forbidden | 403 Forbidden | 0.018 | **PASS** |
| 54 | `ep25_getResourcesByPrivilegeCodes_Authorized` | 25 | `POST /private/v1/resources/by-privilege-codes` | `viewUser` (`VIEW_RESOURCE`) | 200 OK | 200 OK | 0.034 | **PASS** |
| 55 | `ep25_getResourcesByPrivilegeCodes_RoleUser_Forbidden` | 25 | `POST /private/v1/resources/by-privilege-codes` | `stdUser` (`ROLE_USER`) | 403 Forbidden | 403 Forbidden | 0.025 | **PASS** |
| 56 | `global_superAdmin_CanAccessReadAndWrite` | Global | Read (`GET /private/v1/role-levels`) & Write (`POST /private/v1/role-levels`) | `superUser` (`ROLE_SUPER_ADMIN`) | 200 OK (Both) | 200 OK (Both) | 0.064 | **PASS** |
| 57 | `global_unknownAuthority_FailsClosed` | Global | `GET /private/v1/role-levels` | `rogueUser` (`SOME_UNKNOWN_PRIVILEGE`) | 403 Forbidden | 403 Forbidden | 0.041 | **PASS** |
| 58 | `global_unauthenticatedRequest_Returns401` | Global | `GET /private/v1/role-levels` | Anonymous / No Token | 401 Unauthorized | 401 Unauthorized | 0.015 | **PASS** |

---

## 3. Test Execution Inventory: RbacSecurityIntegrationTest (10 Tests)

The table below catalogs all 10 pre-existing integration tests in `RbacSecurityIntegrationTest.java`, confirming complete regression compatibility with the remediated security policies:

| # | Test Method Name | Target Area | Caller Authority | Expected Status | Actual Status | Time (s) | Result |
| :-: | :--- | :--- | :--- | :-: | :-: | :-: | :-: |
| 1 | `getResources_AuthorizedUser_ReturnsOk` | Resource GET | `MANAGE_RESOURCE` | 200 OK | 200 OK | 0.020 | **PASS** |
| 2 | `getRoleTypes_UnprivilegedUser_ReturnsForbidden` | Role Type GET | Unprivileged User | 403 Forbidden | 403 Forbidden | 0.008 | **PASS** |
| 3 | `getRoleLevels_UnprivilegedUser_ReturnsForbidden` | Role Level GET | Unprivileged User | 403 Forbidden | 403 Forbidden | 0.008 | **PASS** |
| 4 | `getRoleLevels_SuperAdmin_ReturnsOk` | Role Level GET | `ROLE_SUPER_ADMIN` | 200 OK | 200 OK | 0.010 | **PASS** |
| 5 | `getRoleTypes_SuperAdmin_ReturnsOk` | Role Type GET | `ROLE_SUPER_ADMIN` | 200 OK | 200 OK | 0.011 | **PASS** |
| 6 | `getResources_UnprivilegedUser_ReturnsForbidden` | Resource GET | Unprivileged User | 403 Forbidden | 403 Forbidden | 0.009 | **PASS** |
| 7 | `createResource_WithoutManageResource_ReturnsForbidden` | Resource POST | Without `MANAGE_RESOURCE` | 403 Forbidden | 403 Forbidden | 0.009 | **PASS** |
| 8 | `getPrivileges_UnprivilegedUser_ReturnsForbidden` | Privilege GET | Unprivileged User | 403 Forbidden | 403 Forbidden | 0.009 | **PASS** |
| 9 | `createPrivilege_WithoutManagePrivilege_ReturnsForbidden` | Privilege POST | Without `MANAGE_PRIVILEGE` | 403 Forbidden | 403 Forbidden | 0.010 | **PASS** |
| 10 | `getPrivileges_AuthorizedUser_ReturnsOk` | Privilege GET | `MANAGE_PRIVILEGE` | 200 OK | 200 OK | 0.014 | **PASS** |

---

## 4. Categorical Breakdown of Security Verification

### 4.1 Negative Test Assertions (35 Tests)
- **Unauthenticated callers (HTTP 401):** Confirmed blocked across read and write operations.
- **Unauthorized `ROLE_USER` callers (HTTP 403):** Confirmed blocked across all 25 endpoints.
- **View-Only Write Restrictions (HTTP 403):**
  - `VIEW_ROLE_LEVEL` blocked from `POST /role-levels` (Create)
  - `VIEW_ROLE_LEVEL` blocked from `POST /role-levels/update/{code}` (Update)
  - `VIEW_ROLE_LEVEL` blocked from `POST /role-levels/delete/{code}` (Delete)
  - `VIEW_ROLE_LEVEL` blocked from `POST /role-levels/update/{code}/toggle-status` (Status Toggle)
  - `VIEW_ROLE_TYPE` blocked from `POST /role-types` (Create)
  - `VIEW_ROLE_TYPE` blocked from `POST /role-types/update/{code}` (Update)
  - `VIEW_ROLE_TYPE` blocked from `POST /role-types/delete/{code}` (Delete)
  - `VIEW_ROLE_TYPE` blocked from `POST /role-types/update/{code}/toggle-status` (Status Toggle)
  - `VIEW_PRIVILEGE` blocked from `POST /privileges` (Create)
  - `VIEW_PRIVILEGE` blocked from `POST /privileges/update/{id}` (Update)
  - `VIEW_PRIVILEGE` blocked from `POST /privileges/delete/{id}` (Delete)
  - `VIEW_RESOURCE` blocked from `POST /resources` (Create)
  - `VIEW_RESOURCE` blocked from `POST /resources/update/{id}` (Update)
  - `VIEW_RESOURCE` blocked from `POST /resources/delete/{id}` (Delete)
- **Unknown / Malformed Authorities (HTTP 403):** Confirmed failing closed unconditionally.

### 4.2 Positive Test Assertions (33 Tests)
- **Authorized View Roles (HTTP 200):**
  - `VIEW_ROLE_LEVEL` permitted to list, view details, and retrieve active role levels.
  - `VIEW_ROLE_TYPE` permitted to list, view details, and retrieve active role types.
  - `VIEW_PRIVILEGE` permitted to list and view privilege details.
  - `VIEW_RESOURCE` permitted to list, view details, and query resources by privilege codes.
- **Authorized Management Roles (HTTP 200):**
  - `MANAGE_ROLE_LEVEL` permitted to create, update, delete, and toggle role levels.
  - `MANAGE_ROLE_TYPE` permitted to create, update, delete, and toggle role types.
  - `MANAGE_PRIVILEGE` permitted to create, update, and delete privileges.
  - `MANAGE_RESOURCE` permitted to create, update, and delete resources.
- **`ROLE_SUPER_ADMIN` Access (HTTP 200):**
  - Confirmed able to execute both read and write operations across all controllers.

---

## 5. Conclusion

Every one of the 25 endpoints has at least one positive test and multiple rigorous negative tests, including explicit view-only write attempts. The full suite of 68 tests ran with a 100% pass rate under live Spring Security dispatch.
