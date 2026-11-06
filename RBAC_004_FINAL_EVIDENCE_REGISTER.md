# LGD 2.0 — RBAC-004 FINAL EVIDENCE REGISTER
## Authoritative Evidence Register & Verification Traceability for Phase 6 RBAC-004 Closure

| Document Metadata | Authoritative Value |
| :--- | :--- |
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Authorization, RBAC & Multi-Tenancy Boundary Audit** |
| **Finding ID** | **RBAC-004 (Residual Read/Write Authorization Separation Deficit)** |
| **Finding Severity** | Critical (CVSS 9.1: `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`) |
| **Prior Disposition** | `PARTIALLY_VERIFIED` |
| **Remediated Disposition**| **VERIFIED_FIXED** |
| **Date of Evaluation** | November 5, 2026 |
| **Lead Auditor** | Principal Spring Security Engineer & Independent Application Security Auditor |
| **Global Security Config** | [`SecurityConfig.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java) (`@EnableMethodSecurity` active) |

---

## 1. Repository Context & Evidence Provenance

| Scope Boundary | Repository Branch | HEAD Commit SHA | Evidence Nature |
| :--- | :--- | :--- | :--- |
| **Platform Root** | `master` | `e2df50f8c30197144377a2f931a4b3fbf03aeb1c` | Working-Tree & Local Git History |
| **user-management** | `dev` | `a0017c536eee7cefa57845c30fa4d5210a4af9ce` | Working-Tree Code, Test & Surefire Reports |
| **revenue** | `master` | `6697a77f3d99d30a08e1e1279be1350a41bc38be` | Working-Tree Code & Surefire Reports |
| **auth-service** | `dev` | `2f3ab07f8725bb7ea74c2d66579fc26c7104b2ee` | Working-Tree Code & Surefire Reports |
| **api-gateway** | `dev` | `1e19cca4ecab8d2be90ba33da4c29cf49f3e498c` | Working-Tree Code & Surefire Reports |

### 1.1 Classification of Evidence Artifacts
- **Working-Tree Evidence:**
  - Hardened controller source files in `user-management` with explicit method-level `@PreAuthorize` annotations.
  - Newly implemented automated integration test suite: `Rbac004EndpointSecurityIntegrationTest.java`.
  - Maven Surefire XML test execution output reports in `target/surefire-reports/`.
  - Phase 6 audit documentation deliverables generated in the workspace root.
- **Committed Evidence:**
  - Upstream baseline commits across sub-repositories (`user-management`: `a0017c536`, `revenue`: `6697a77`, `auth-service`: `2f3ab07`, `api-gateway`: `1e19cca`).
- **Deployed / Staged Runtime Evidence:**
  - Microservice container builds and docker-compose service definitions for local integration testing.

---

## 2. Master RBAC-004 End-to-End Traceability Matrix (All 25 Endpoints)

The table below provides direct end-to-end traceability for every single endpoint evaluated, linking the controller source file, line numbers, HTTP method, endpoint URI, test methods in `Rbac004EndpointSecurityIntegrationTest.java`, Surefire XML report, and SHA-256 hash.

| EP # | Controller & Source File | Line # | HTTP & URI | Method Signature | Effective Required Authority | Primary Test Method(s) | Surefire XML Report | File SHA-256 Checksum |
| :-: | :--- | :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | [`RoleLevelMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java) | L18, L30 | `POST /private/v1/role-levels` | `saveRoleLevel` | `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep01_createRoleLevel_Authorized`<br>`ep01_createRoleLevel_ViewOnly_Forbidden`<br>`ep01_createRoleLevel_RoleUser_Forbidden`<br>`ep01_createRoleLevel_Unauthenticated` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `0b6a5ca1ea4da4b9a215699be24d81aca18867855f0bb0aaafb7f66f5cea128b` |
| **2** | [`RoleLevelMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java) | L18, L39 | `GET /private/v1/role-levels` | `manageRoleLevels` | `VIEW_ROLE_LEVEL`, `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep02_getRoleLevels_Authorized`<br>`ep02_getRoleLevels_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `0b6a5ca1ea4da4b9a215699be24d81aca18867855f0bb0aaafb7f66f5cea128b` |
| **3** | [`RoleLevelMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java) | L18, L47 | `GET /private/v1/role-levels/{code}` | `viewRoleLevel` | `VIEW_ROLE_LEVEL`, `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep03_viewRoleLevel_Authorized`<br>`ep03_viewRoleLevel_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `0b6a5ca1ea4da4b9a215699be24d81aca18867855f0bb0aaafb7f66f5cea128b` |
| **4** | [`RoleLevelMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java) | L18, L55 | `POST /private/v1/role-levels/update/{code}` | `updateRoleLevel` | `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep04_updateRoleLevel_Authorized`<br>`ep04_updateRoleLevel_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `0b6a5ca1ea4da4b9a215699be24d81aca18867855f0bb0aaafb7f66f5cea128b` |
| **5** | [`RoleLevelMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java) | L18, L65 | `POST /private/v1/role-levels/delete/{code}` | `deleteRoleLevel` | `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep05_deleteRoleLevel_Authorized`<br>`ep05_deleteRoleLevel_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `0b6a5ca1ea4da4b9a215699be24d81aca18867855f0bb0aaafb7f66f5cea128b` |
| **6** | [`RoleLevelMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java) | L18, L73 | `GET /private/v1/role-levels/active` | `getActiveRoleLevels` | `VIEW_ROLE_LEVEL`, `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep06_getActiveRoleLevels_Authorized`<br>`ep06_getActiveRoleLevels_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `0b6a5ca1ea4da4b9a215699be24d81aca18867855f0bb0aaafb7f66f5cea128b` |
| **7** | [`RoleLevelMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java) | L18, L81 | `POST /private/v1/role-levels/update/{code}/toggle-status` | `toggleStatus` | `MANAGE_ROLE_LEVEL`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep07_toggleStatusRoleLevel_Authorized`<br>`ep07_toggleStatusRoleLevel_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `0b6a5ca1ea4da4b9a215699be24d81aca18867855f0bb0aaafb7f66f5cea128b` |
| **8** | [`RoleTypeMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java) | L18, L30 | `POST /private/v1/role-types` | `saveRoleType` | `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep08_createRoleType_Authorized`<br>`ep08_createRoleType_ViewOnly_Forbidden`<br>`ep08_createRoleType_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `b578439e77b2a9148d1e589155baf4c504749b64c0f7796851fdc34e63640278` |
| **9** | [`RoleTypeMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java) | L18, L39 | `GET /private/v1/role-types` | `manageRoleTypes` | `VIEW_ROLE_TYPE`, `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep09_getRoleTypes_Authorized`<br>`ep09_getRoleTypes_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `b578439e77b2a9148d1e589155baf4c504749b64c0f7796851fdc34e63640278` |
| **10** | [`RoleTypeMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java) | L18, L47 | `GET /private/v1/role-types/{code}` | `viewRoleType` | `VIEW_ROLE_TYPE`, `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep10_viewRoleType_Authorized`<br>`ep10_viewRoleType_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `b578439e77b2a9148d1e589155baf4c504749b64c0f7796851fdc34e63640278` |
| **11** | [`RoleTypeMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java) | L18, L55 | `POST /private/v1/role-types/update/{code}` | `updateRoleType` | `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep11_updateRoleType_Authorized`<br>`ep11_updateRoleType_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `b578439e77b2a9148d1e589155baf4c504749b64c0f7796851fdc34e63640278` |
| **12** | [`RoleTypeMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java) | L18, L65 | `POST /private/v1/role-types/delete/{code}` | `deleteRoleType` | `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep12_deleteRoleType_Authorized`<br>`ep12_deleteRoleType_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `b578439e77b2a9148d1e589155baf4c504749b64c0f7796851fdc34e63640278` |
| **13** | [`RoleTypeMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java) | L18, L73 | `GET /private/v1/role-types/active` | `getActiveRoleTypes` | `VIEW_ROLE_TYPE`, `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep13_getActiveRoleTypes_Authorized`<br>`ep13_getActiveRoleTypes_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `b578439e77b2a9148d1e589155baf4c504749b64c0f7796851fdc34e63640278` |
| **14** | [`RoleTypeMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java) | L18, L81 | `POST /private/v1/role-types/update/{code}/toggle-status` | `toggleStatus` | `MANAGE_ROLE_TYPE`, `MANAGE_MASTER`, `SUPER_ADMIN` | `ep14_toggleStatusRoleType_Authorized`<br>`ep14_toggleStatusRoleType_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `b578439e77b2a9148d1e589155baf4c504749b64c0f7796851fdc34e63640278` |
| **15** | [`PrivilegeController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java) | L33, L74 | `POST /private/v1/privileges` | `createPrivilege` | `MANAGE_PRIVILEGE`, `SUPER_ADMIN` | `ep15_createPrivilege_Authorized`<br>`ep15_createPrivilege_ViewOnly_Forbidden`<br>`ep15_createPrivilege_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3f31b01612b74cca99a7aca65c79c1ac95254eb671afc4a469032b7a5ddb1c34` |
| **16** | [`PrivilegeController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java) | L33, L83 | `POST /private/v1/privileges/update/{id}` | `updatePrivilege` | `MANAGE_PRIVILEGE`, `SUPER_ADMIN` | `ep16_updatePrivilege_Authorized`<br>`ep16_updatePrivilege_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3f31b01612b74cca99a7aca65c79c1ac95254eb671afc4a469032b7a5ddb1c34` |
| **17** | [`PrivilegeController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java) | L33, L95 | `GET /private/v1/privileges/{id}` | `getPrivilegeById` | `VIEW_PRIVILEGE`, `MANAGE_PRIVILEGE`, `SUPER_ADMIN` | `ep17_getPrivilegeById_Authorized`<br>`ep17_getPrivilegeById_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3f31b01612b74cca99a7aca65c79c1ac95254eb671afc4a469032b7a5ddb1c34` |
| **18** | [`PrivilegeController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java) | L33, L105 | `GET /private/v1/privileges` | `getAllPrivileges` | `VIEW_PRIVILEGE`, `MANAGE_PRIVILEGE`, `SUPER_ADMIN` | `ep18_getAllPrivileges_Authorized`<br>`ep18_getAllPrivileges_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3f31b01612b74cca99a7aca65c79c1ac95254eb671afc4a469032b7a5ddb1c34` |
| **19** | [`PrivilegeController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java) | L33, L120 | `POST /private/v1/privileges/delete/{id}` | `deletePrivilege` | `MANAGE_PRIVILEGE`, `SUPER_ADMIN` | `ep19_deletePrivilege_Authorized`<br>`ep19_deletePrivilege_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3f31b01612b74cca99a7aca65c79c1ac95254eb671afc4a469032b7a5ddb1c34` |
| **20** | [`ResourceController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java) | L23, L53 | `POST /private/v1/resources` | `saveResource` | `MANAGE_RESOURCE`, `SUPER_ADMIN` | `ep20_saveResource_Authorized`<br>`ep20_saveResource_ViewOnly_Forbidden`<br>`ep20_saveResource_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3224f824011b44c76d64ef64725b70c45c927910d83bbee2a520fc080fb4d06e` |
| **21** | [`ResourceController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java) | L23, L62 | `GET /private/v1/resources` | `manageResource` | `VIEW_RESOURCE`, `MANAGE_RESOURCE`, `SUPER_ADMIN` | `ep21_manageResource_Authorized`<br>`ep21_manageResource_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3224f824011b44c76d64ef64725b70c45c927910d83bbee2a520fc080fb4d06e` |
| **22** | [`ResourceController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java) | L23, L69 | `GET /private/v1/resources/{id}` | `viewResource` | `VIEW_RESOURCE`, `MANAGE_RESOURCE`, `SUPER_ADMIN` | `ep22_viewResource_Authorized`<br>`ep22_viewResource_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3224f824011b44c76d64ef64725b70c45c927910d83bbee2a520fc080fb4d06e` |
| **23** | [`ResourceController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java) | L23, L76 | `POST /private/v1/resources/update/{id}` | `updateResource` | `MANAGE_RESOURCE`, `SUPER_ADMIN` | `ep23_updateResource_Authorized`<br>`ep23_updateResource_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3224f824011b44c76d64ef64725b70c45c927910d83bbee2a520fc080fb4d06e` |
| **24** | [`ResourceController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java) | L23, L94 | `POST /private/v1/resources/delete/{id}` | `deleteResource` | `MANAGE_RESOURCE`, `SUPER_ADMIN` | `ep24_deleteResource_Authorized`<br>`ep24_deleteResource_ViewOnly_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3224f824011b44c76d64ef64725b70c45c927910d83bbee2a520fc080fb4d06e` |
| **25** | [`ResourceController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java) | L23, L105 | `POST /private/v1/resources/by-privilege-codes` | `getResourcesByPrivilegeCodes` | `VIEW_RESOURCE`, `MANAGE_RESOURCE`, `SUPER_ADMIN` | `ep25_getResourcesByPrivilegeCodes_Authorized`<br>`ep25_getResourcesByPrivilegeCodes_RoleUser_Forbidden` | `TEST-...Rbac004EndpointSecurityIntegrationTest.xml` | `3224f824011b44c76d64ef64725b70c45c927910d83bbee2a520fc080fb4d06e` |

---

## 3. Test Execution Verification Commands & Observed Results

1. **Focused RBAC-004 Test Execution:**
   - **Command:** `mvn test -Dtest=Rbac004EndpointSecurityIntegrationTest "-DargLine=-Xmx512m -XX:+UseSerialGC"`
   - **Target Class:** [`Rbac004EndpointSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac004EndpointSecurityIntegrationTest.java)
   - **Observed Result:** `Tests run: 58, Failures: 0, Errors: 0, Skipped: 0` (100% Pass)
2. **Combined RBAC Verification Execution:**
   - **Command:** `mvn test "-Dtest=Rbac004EndpointSecurityIntegrationTest,RbacSecurityIntegrationTest" "-DargLine=-Xmx512m -XX:+UseSerialGC"`
   - **Target Classes:** [`Rbac004EndpointSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac004EndpointSecurityIntegrationTest.java) + [`RbacSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/RbacSecurityIntegrationTest.java)
   - **Observed Result:** `Tests run: 68, Failures: 0, Errors: 0, Skipped: 0` (100% Pass)
3. **Full Microservice Regression Execution (`user-management`):**
   - **Command:** `mvn test "-DargLine=-Xmx512m -XX:+UseSerialGC"`
   - **Observed Result:** `Tests run: 301, Failures: 0, Errors: 0, Skipped: 0` (BUILD SUCCESS)
4. **Full Platform Multi-Service Regression Execution:**
   - **`revenue`:** `Tests run: 33, Failures: 0, Errors: 0` (BUILD SUCCESS)
   - **`auth-service`:** `Tests run: 44, Failures: 0, Errors: 0` (BUILD SUCCESS)
   - **`api-gateway`:** `Tests run: 17, Failures: 0, Errors: 0` (BUILD SUCCESS)
   - **Total Core Platform Regression:** `395 Tests Run, 395 Passed, 0 Failures, 0 Errors`

---

## 4. Auditor Certification

I hereby attest that the evidence recorded in this register has been independently collected, verified under live Spring Security test dispatch with `@EnableMethodSecurity` active, and reconciled with exact cryptographic checksums and execution logs. Finding `RBAC-004` is fully verified as resolved.
