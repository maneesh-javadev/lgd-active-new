# LGD 2.0 — CRITICAL FINDINGS CONTROLLER AUTHORITY MATRIX
# Complete Method-to-Authority Mapping for Master & Administrative Controllers

| Metadata Field | Value |
| :--- | :--- |
| **Document ID** | LGD2-P6-CTRL-AUTH-MATRIX |
| **Audit Scope** | RBAC-004 Method Security & Controller Authorization Coverage |
| **Microservice** | `user-management` |
| **Evaluation Period** | November 4, 2026 |
| **Global Security Configuration** | [`SecurityConfig.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java) (`@EnableMethodSecurity` active) |

---

## 1. Overview & Methodology

This matrix documents the complete method-to-authority mapping across all four controllers specified in finding [`RBAC-004`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_RBAC_FINDINGS_REGISTER.md#L117-L138):
1. [`PrivilegeController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java)
2. [`ResourceController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java)
3. [`RoleLevelMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java)
4. [`RoleTypeMasterController`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java)

Each endpoint was analyzed across seven dimensions:
- **HTTP Verb & Endpoint Path**
- **Java Controller Method Signature**
- **Effective `@PreAuthorize` Security Expression**
- **Required Authority / Role Grants**
- **Operation Category** (`READ`, `CREATE`, `UPDATE`, `DELETE`)
- **Tenant Scope & Data Isolation Enforcement**
- **Auditor Evaluation & Residual Risk Notes**

---

## 2. Complete Method-to-Authority Matrix

### 2.1 PrivilegeController (`/private/v1/privileges`)
**Class-Level Security Rule:** `@PreAuthorize("hasAnyAuthority('MANAGE_PRIVILEGE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')")`

| # | HTTP Verb | URI Pattern | Method Signature | Effective Authorization Rule | Op Type | Tenant Boundary | Service Auth / DB Check | Security Posture & Residual Risk |
| :-: | :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **1** | `POST` | `/private/v1/privileges` | `createPrivilege(@Valid @RequestBody CreatePrivilegeDto)` | `hasAnyAuthority('MANAGE_PRIVILEGE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `CREATE` | Global | DTO Validator (`CreatePrivilegeValidator`) | **SECURE.** Blocked for unauthenticated/ROLE_USER. |
| **2** | `POST` | `/private/v1/privileges/update`, `/update/{id}` | `updatePrivilege(@PathVariable Long id, @Valid @RequestBody UpdtaePrivilegeDto)` | `hasAnyAuthority('MANAGE_PRIVILEGE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `UPDATE` | Global | DTO Validator (`UpdatePrivilegeValidator`) | **SECURE.** Blocked for unauthorized callers. |
| **3** | `GET` | `/private/v1/privileges/{id}` | `getPrivilegeById(@PathVariable Long id)` | `hasAnyAuthority('MANAGE_PRIVILEGE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | `rolePrivilegeRepository.existsActiveByPrivilegeId` | **COARSE.** Read requires full `MANAGE_PRIVILEGE` or Super Admin; no separate `VIEW_PRIVILEGE`. |
| **4** | `GET` | `/private/v1/privileges` | `getAllPrivileges()` | `hasAnyAuthority('MANAGE_PRIVILEGE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | Sets `existInRole` status flag | **COARSE.** Read requires full `MANAGE_PRIVILEGE` or Super Admin; no separate `VIEW_PRIVILEGE`. |
| **5** | `POST` | `/private/v1/privileges/delete/{id}` | `deletePrivilege(@PathVariable Long id)` | `hasAnyAuthority('MANAGE_PRIVILEGE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `DELETE` | Global | Checks `existsActiveByPrivilegeId` (throws if assigned) | **SECURE.** Mutating delete protected by authority and business constraint. |

---

### 2.2 ResourceController (`/private/v1/resources`)
**Class-Level Security Rule:** `@PreAuthorize("hasAnyAuthority('MANAGE_RESOURCE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')")`

| # | HTTP Verb | URI Pattern | Method Signature | Effective Authorization Rule | Op Type | Tenant Boundary | Service Auth / DB Check | Security Posture & Residual Risk |
| :-: | :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **6** | `POST` | `/private/v1/resources` | `saveResource(@Valid @RequestBody CreateResourceDto)` | `hasAnyAuthority('MANAGE_RESOURCE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `CREATE` | Global | DTO Validator (`CreateResourceValidator`) | **SECURE.** Blocked for unauthorized callers. |
| **7** | `GET` | `/private/v1/resources` | `manageResource()` | `hasAnyAuthority('MANAGE_RESOURCE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | Returns resource listing | **COARSE.** Reading resources requires `MANAGE_RESOURCE` or Super Admin. |
| **8** | `GET` | `/private/v1/resources/{resourceId}` | `viewResource(@PathVariable Long resourceId)` | `hasAnyAuthority('MANAGE_RESOURCE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | Retrieves resource entity | **COARSE.** Reading resource requires `MANAGE_RESOURCE` or Super Admin. |
| **9** | `POST` | `/private/v1/resources/update`, `/update/{resourceId}` | `updateResource(@PathVariable Long resourceId, @Valid @RequestBody UpdateResourceDto)` | `hasAnyAuthority('MANAGE_RESOURCE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `UPDATE` | Global | Checks `privilegeResourceRepository.existsByResourceResourceId` | **SECURE.** Cannot update if linked to privilege. |
| **10** | `POST` | `/private/v1/resources/delete/{resourceId}` | `deleteResource(@PathVariable Long resourceId)` | `hasAnyAuthority('MANAGE_RESOURCE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `DELETE` | Global | Checks `privilegeResourceRepository.existsByResourceResourceId` | **SECURE.** Cannot delete if linked to privilege. |
| **11** | `POST` | `/private/v1/resources/by-privilege-codes` | `getResourcesByPrivilegeCodes(@RequestBody List<String>)` | `hasAnyAuthority('MANAGE_RESOURCE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | Queries resources by privilege code list | **COARSE.** Read operation exposed over POST; requires `MANAGE_RESOURCE`. |

---

### 2.3 RoleLevelMasterController (`/private/v1/role-levels`)
**Class-Level Security Rule:** `@PreAuthorize("hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_LEVEL', 'MANAGE_ROLE_LEVEL', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')")`

| # | HTTP Verb | URI Pattern | Method Signature | Effective Authorization Rule | Op Type | Tenant Boundary | Service Auth / DB Check | Security Posture & Residual Risk |
| :-: | :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **12** | `POST` | `/private/v1/role-levels` | `saveRoleLevel(@RequestBody RoleLevelMasterDto)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_LEVEL', 'MANAGE_ROLE_LEVEL', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `CREATE` | Global | `roleLevelMasterService.saveRoleLevel` | ⚠️ **RESIDUAL GAP:** User with only `VIEW_ROLE_LEVEL` authority can create role levels. |
| **13** | `GET` | `/private/v1/role-levels` | `manageRoleLevels()` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_LEVEL', 'MANAGE_ROLE_LEVEL', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | `roleLevelMasterService.manageRoleLevels` | **SECURE.** Viewers and Managers permitted. |
| **14** | `GET` | `/private/v1/role-levels/{roleLevelCode}` | `viewRoleLevel(@PathVariable String roleLevelCode)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_LEVEL', 'MANAGE_ROLE_LEVEL', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | `roleLevelMasterService.viewRoleLevel` | **SECURE.** Viewers and Managers permitted. |
| **15** | `POST` | `/private/v1/role-levels/update/{roleLevelCode}` | `updateRoleLevel(@PathVariable String roleLevelCode, @RequestBody RoleLevelMasterDto)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_LEVEL', 'MANAGE_ROLE_LEVEL', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `UPDATE` | Global | `roleLevelMasterService.updateRoleLevel` | ⚠️ **RESIDUAL GAP:** User with only `VIEW_ROLE_LEVEL` authority can update role levels. |
| **16** | `POST` | `/private/v1/role-levels/delete/{roleLevelCode}` | `deleteRoleLevel(@PathVariable String roleLevelCode)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_LEVEL', 'MANAGE_ROLE_LEVEL', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `DELETE` | Global | `roleLevelMasterService.deleteRoleLevel` | ⚠️ **RESIDUAL GAP:** User with only `VIEW_ROLE_LEVEL` authority can delete role levels. |
| **17** | `GET` | `/private/v1/role-levels/active` | `getActiveRoleLevels()` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_LEVEL', 'MANAGE_ROLE_LEVEL', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | `roleLevelMasterService.getActiveRoleLevels` | **SECURE.** Viewers and Managers permitted. |
| **18** | `POST` | `/private/v1/role-levels/update/{roleLevelCode}/toggle-status` | `toggleStatus(@PathVariable String roleLevelCode)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_LEVEL', 'MANAGE_ROLE_LEVEL', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `UPDATE` | Global | `roleLevelMasterService.toggleStatus` | ⚠️ **RESIDUAL GAP:** User with only `VIEW_ROLE_LEVEL` authority can toggle active status. |

---

### 2.4 RoleTypeMasterController (`/private/v1/role-types`)
**Class-Level Security Rule:** `@PreAuthorize("hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_TYPE', 'MANAGE_ROLE_TYPE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')")`

| # | HTTP Verb | URI Pattern | Method Signature | Effective Authorization Rule | Op Type | Tenant Boundary | Service Auth / DB Check | Security Posture & Residual Risk |
| :-: | :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **19** | `POST` | `/private/v1/role-types` | `saveRoleType(@RequestBody RoleTypeMasterDto)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_TYPE', 'MANAGE_ROLE_TYPE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `CREATE` | Global | `roleTypeMasterService.saveRoleType` | ⚠️ **RESIDUAL GAP:** User with only `VIEW_ROLE_TYPE` authority can create role types. |
| **20** | `GET` | `/private/v1/role-types` | `manageRoleTypes()` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_TYPE', 'MANAGE_ROLE_TYPE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | `roleTypeMasterService.manageRoleTypes` | **SECURE.** Viewers and Managers permitted. |
| **21** | `GET` | `/private/v1/role-types/{roleTypeCode}` | `viewRoleType(@PathVariable String roleTypeCode)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_TYPE', 'MANAGE_ROLE_TYPE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | `roleTypeMasterService.viewRoleType` | **SECURE.** Viewers and Managers permitted. |
| **22** | `POST` | `/private/v1/role-types/update/{roleTypeCode}` | `updateRoleType(@PathVariable String roleTypeCode, @RequestBody RoleTypeMasterDto)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_TYPE', 'MANAGE_ROLE_TYPE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `UPDATE` | Global | `roleTypeMasterService.updateRoleType` | ⚠️ **RESIDUAL GAP:** User with only `VIEW_ROLE_TYPE` authority can update role types. |
| **23** | `POST` | `/private/v1/role-types/delete/{roleTypeCode}` | `deleteRoleType(@PathVariable String roleTypeCode)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_TYPE', 'MANAGE_ROLE_TYPE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `DELETE` | Global | `roleTypeMasterService.deleteRoleType` | ⚠️ **RESIDUAL GAP:** User with only `VIEW_ROLE_TYPE` authority can delete role types. |
| **24** | `GET` | `/private/v1/role-types/active` | `getActiveRoleTypes()` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_TYPE', 'MANAGE_ROLE_TYPE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `READ` | Global | `roleTypeMasterService.getActiveRoleTypes` | **SECURE.** Viewers and Managers permitted. |
| **25** | `POST` | `/private/v1/role-types/update/{roleTypeCode}/toggle-status` | `toggleStatus(@PathVariable String roleTypeCode)` | `hasAnyAuthority('MANAGE_MASTER', 'VIEW_ROLE_TYPE', 'MANAGE_ROLE_TYPE', 'ROLE_SUPER_ADMIN') or hasAnyRole('SUPER_ADMIN')` | `UPDATE` | Global | `roleTypeMasterService.toggleStatus` | ⚠️ **RESIDUAL GAP:** User with only `VIEW_ROLE_TYPE` authority can toggle active status. |

---

## 3. Analysis & Remediation Recommendations

### 3.1 Read vs Write Separation Analysis
1. **Privilege & Resource Controllers:** Currently enforce a single coarse authority (`MANAGE_PRIVILEGE`, `MANAGE_RESOURCE`). While safe against unauthorized writes, it forces read-only operators to hold full administrative capabilities.
   - *Target Recommendation:* Introduce `@PreAuthorize("hasAnyAuthority('VIEW_PRIVILEGE', 'MANAGE_PRIVILEGE', ...)")` on `GET` methods, and reserve `MANAGE_PRIVILEGE` for mutating `POST` methods.
2. **Master Controllers (Role Level & Role Type):** Currently combine `VIEW_*` and `MANAGE_*` in an `OR` condition at the class level without method-level overrides.
   - *Target Recommendation:* Remove `VIEW_*` from class level or add method-level `@PreAuthorize("hasAnyAuthority('MANAGE_ROLE_LEVEL', 'MANAGE_MASTER', 'ROLE_SUPER_ADMIN')")` on all mutating `POST` methods.

---

## 4. Auditor Conclusion

```
========================================================================================
CONTROLLER AUTHORITY MATRIX AUDIT SUMMARY
========================================================================================
Total Controllers Audited:             4
Total Endpoints Evaluated:             25
Endpoints Protected Against Public:    25 / 25 (100% Protected)
Coarse Authorization Functional:       YES (Unauthenticated & ROLE_USER blocked)
Fine-Grained Read/Write Separation:    PARTIALLY COMPLETE (Residual gaps on 8 master endpoints)
Auditor Evaluation:                    PARTIALLY_VERIFIED
========================================================================================
```
