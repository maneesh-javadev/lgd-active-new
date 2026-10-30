# LGD 2.0 - Complete REST API Endpoint Inventory

| **Document Version** | 1.0.0 |
| **Audit Phase** | Phase 0: Project Discovery & Security Baseline |
| **Total Endpoints Identified** | 46 Distinct Operations |
| **Public Endpoints** | 12 |
| **Private / Secured Endpoints** | 34 |

---

## 1. Summary by Microservice

| Microservice | Base Context Path | Public APIs | Private APIs | Total APIs | Primary Role |
|---|---|---|---|---|---|
| **api-gateway** | `/` & `/fallback` | 1 | 0 | 1 | Ingress routing & Circuit-breaker Fallback |
| **auth-service** | `/audit/auth` | 1 | 5 | 6 | Authentication & Token Management |
| **user-management** | `/audit/user-management` | 0 | 25 | 25 | User, Role, Privilege Administration |
| **revenue** | `/audit/revenue` | 11 | 9 | 20 | Revenue Unit Management, Drafts, eSign |

---

## 2. API Endpoint Master Inventory Table

### 2.1 API Gateway Service (`api-gateway`)

| # | Controller | HTTP Method | Gateway Path | Service Internal Path | Scope | Payload / Parameters | Function / Description | Security Control |
|---|---|---|---|---|---|---|---|---|
| 1 | `FallbackController` | `GET` | `/fallback/block` | `/fallback/block` | **Public** | None | Circuit-breaker fallback route | Rate limiting & Whitelist |

---

### 2.2 Authentication Service (`auth-service`)

| # | Controller | HTTP Method | Gateway Path | Service Internal Path | Scope | Payload / Parameters | Function / Description | Security Control |
|---|---|---|---|---|---|---|---|---|
| 2 | `AuthSecondaryController` | `POST` | `/audit/auth/public/v1/auth/login` | `/public/v1/auth/login` | **Public** | `JSON (username, password)` | Officer login & JWT token issuance | Rate Limit, Uniform Error |
| 3 | `AuthPrimaryController` | `POST` | `/audit/auth/private/v1/auth/logout` | `/private/v1/auth/logout` | **Private** | `Bearer Token` | Session logout; adds JTI to Redis blacklist | JWT validation, Redis entry |
| 4 | `AuthPrimaryController` | `POST` | `/audit/auth/private/v1/auth/revoke-token` | `/private/v1/auth/revoke-token` | **Private** | `Bearer Token` | Explicit token revocation | JWT validation, Redis entry |
| 5 | `AuthPrimaryController` | `GET` | `/audit/auth/private/v1/auth/profile` | `/private/v1/auth/profile` | **Private** | `Bearer Token` | Retrieve authenticated officer profile | JWT validation (`@AuthenticationPrincipal`) |
| 6 | `AuthPrimaryController` | `GET` | `/audit/auth/private/v1/auth/menus` | `/private/v1/auth/menus` | **Private** | `Bearer Token` | Retrieve RBAC authorized navigation menus | JWT validation |
| 7 | `AuthPrimaryController` | `GET` | `/audit/auth/private/v1/auth/routes` | `/private/v1/auth/routes` | **Private** | `Bearer Token` | Retrieve allowed UI routes for officer | JWT validation |

---

### 2.3 User Management Service (`user-management`)

| # | Controller | HTTP Method | Gateway Path | Service Internal Path | Scope | Payload / Parameters | Function / Description | Security Control |
|---|---|---|---|---|---|---|---|---|
| 8 | `UserController` | `POST` | `/audit/user-management/private/v1/users` | `/private/v1/users` | **Admin** | `JSON (CreateUserDto)` | Create user with role and hierarchy | Password Policy, Tenant Check |
| 9 | `UserController` | `GET` | `/audit/user-management/private/v1/users` | `/private/v1/users` | **Admin** | Query Params | List all users | Tenant Isolation |
| 10 | `UserController` | `GET` | `/audit/user-management/private/v1/users/{userId}` | `/private/v1/users/{userId}` | **Private** | Path Variable `userId` | Retrieve user details by ID | Object-level authorization |
| 11 | `UserController` | `POST` | `/audit/user-management/private/v1/users/update` | `/private/v1/users/update` | **Admin** | `JSON (UpdateUserDto)` | Update user attributes / credentials | Password Policy, Boundary Check |
| 12 | `UserController` | `POST` | `/audit/user-management/private/v1/users/delete/{userId}` | `/private/v1/users/delete/{userId}` | **Admin** | Path Variable `userId` | Soft delete user and record history | Boundary Check |
| 13 | `UserController` | `GET` | `/audit/user-management/private/v1/users/login-id/{loginId}` | `/private/v1/users/login-id/{loginId}` | **Admin** | Path Variable `loginId` | Check or fetch user by login ID | Authorization check |
| 14 | `RoleController` | `POST` | `/audit/user-management/private/v1/roles` | `/private/v1/roles` | **Admin** | `JSON (CreateRoleDto)` | Create new administrative role | Super Admin validation |
| 15 | `RoleController` | `GET` | `/audit/user-management/private/v1/roles` | `/private/v1/roles` | **Private** | Query Params | List all roles | JWT validation |
| 16 | `RoleController` | `GET` | `/audit/user-management/private/v1/roles/{roleId}` | `/private/v1/roles/{roleId}` | **Private** | Path Variable `roleId` | Get role details by ID | JWT validation |
| 17 | `RoleController` | `POST` | `/audit/user-management/private/v1/roles/update` | `/private/v1/roles/update` | **Admin** | `JSON (UpdateRoleDto)` | Update role definition | Super Admin validation |
| 18 | `RoleController` | `POST` | `/audit/user-management/private/v1/roles/delete/{roleId}` | `/private/v1/roles/delete/{roleId}` | **Admin** | Path Variable `roleId` | Delete role | Super Admin validation |
| 19 | `RoleController` | `POST` | `/audit/user-management/private/v1/roles/toggle-status/{roleId}` | `/private/v1/roles/toggle-status/{roleId}` | **Admin** | Path Variable `roleId` | Toggle role active status | Super Admin validation |
| 20 | `RoleController` | `GET` | `/audit/user-management/private/v1/roles/active` | `/private/v1/roles/active` | **Private** | None | List active roles for selection | JWT validation |
| 21 | `RoleController` | `GET` | `/audit/user-management/private/v1/roles/level/{levelCode}` | `/private/v1/roles/level/{levelCode}` | **Private** | Path Variable `levelCode` | Filter roles by level | JWT validation |
| 22 | `RoleController` | `GET` | `/audit/user-management/private/v1/roles/type/{typeCode}` | `/private/v1/roles/type/{typeCode}` | **Private** | Path Variable `typeCode` | Filter roles by type | JWT validation |
| 23 | `RoleController` | `GET` | `/audit/user-management/private/v1/roles/{roleId}/history` | `/private/v1/roles/{roleId}/history` | **Admin** | Path Variable `roleId` | View role audit history | Admin privilege |
| 24 | `PrivilegeController` | `GET` | `/audit/user-management/private/v1/privileges` | `/private/v1/privileges` | **Private** | None | List all privileges | JWT validation |
| 25 | `PrivilegeController` | `POST` | `/audit/user-management/private/v1/privileges` | `/private/v1/privileges` | **Admin** | `JSON (PrivilegeDto)` | Create system privilege | Super Admin validation |
| 26 | `PrivilegeController` | `POST` | `/audit/user-management/private/v1/privileges/update` | `/private/v1/privileges/update` | **Admin** | `JSON (PrivilegeDto)` | Update system privilege | Super Admin validation |
| 27 | `PrivilegeController` | `POST` | `/audit/user-management/private/v1/privileges/delete/{id}` | `/private/v1/privileges/delete/{id}` | **Admin** | Path Variable `id` | Delete system privilege | Super Admin validation |
| 28 | `ResourceController` | `GET` | `/audit/user-management/private/v1/resources` | `/private/v1/resources` | **Private** | None | List all secure UI/API resources | JWT validation |
| 29 | `ResourceController` | `POST` | `/audit/user-management/private/v1/resources` | `/private/v1/resources` | **Admin** | `JSON (ResourceDto)` | Register protected resource | Super Admin validation |
| 30 | `UserRoleMappingController` | `GET` | `/audit/user-management/private/v1/user-roles` | `/private/v1/user-roles` | **Admin** | Query Params | List all user-role mappings | Tenant check |
| 31 | `UserRoleMappingController` | `POST` | `/audit/user-management/private/v1/user-roles` | `/private/v1/user-roles` | **Admin** | `JSON (MappingDto)` | Assign role to officer | Escalation prevention |
| 32 | `UserRoleMappingController` | `POST` | `/audit/user-management/private/v1/user-roles/delete/{mappingId}` | `/private/v1/user-roles/delete/{mappingId}` | **Admin** | Path Variable `mappingId` | Revoke role from officer | Escalation prevention |

---

### 2.4 Revenue Service (`revenue`)

| # | Controller | HTTP Method | Gateway Path | Service Internal Path | Scope | Payload / Parameters | Function / Description | Security Control |
|---|---|---|---|---|---|---|---|---|
| 33 | `StateSecondaryController` | `GET` | `/audit/revenue/public/v1/state` | `/public/v1/state` | **Public** | None | Get active state directory | Public rate limiting |
| 34 | `StateSecondaryController` | `GET` | `/audit/revenue/public/v1/state/{stateCode}` | `/public/v1/state/{stateCode}` | **Public** | Path Variable `stateCode` | Get single state entity | Public rate limiting |
| 35 | `DistrictSecondaryController` | `GET` | `/audit/revenue/public/v1/district/{stateCode}` | `/public/v1/district/{stateCode}` | **Public** | Path Variable `stateCode` | List districts in state | Public rate limiting |
| 36 | `SubDistrictSecondaryController` | `GET` | `/audit/revenue/public/v1/subdistrict/{districtCode}` | `/public/v1/subdistrict/{districtCode}` | **Public** | Path Variable `districtCode` | List sub-districts in district | Public rate limiting |
| 37 | `VillageSecondaryController` | `GET` | `/audit/revenue/public/v1/village/{subdistrictCode}` | `/public/v1/village/{subdistrictCode}` | **Public** | Path Variable `subdistrictCode` | List villages in subdistrict | Public rate limiting |
| 38 | `DistrictPrimaryController` | `POST` | `/audit/revenue/private/v1/district` | `/private/v1/district` | **Private** | Multipart Form-Data | Create district draft with order file | Size limits, MIME validation |
| 39 | `DistrictPrimaryController` | `POST` | `/audit/revenue/private/v1/district/publish/create` | `/private/v1/district/publish/create` | **Admin** | Multipart Form-Data | Publish created district into gazette | State tenant boundary check |
| 40 | `SubDistrictPrimaryController` | `POST` | `/audit/revenue/private/v1/subdistrict` | `/private/v1/subdistrict` | **Private** | Multipart Form-Data | Create subdistrict draft | Size limits, MIME validation |
| 41 | `SubDistrictPrimaryController` | `POST` | `/audit/revenue/private/v1/subdistrict/publish/create` | `/private/v1/subdistrict/publish/create` | **Admin** | Multipart Form-Data | Publish created subdistrict | State tenant boundary check |
| 42 | `DraftPrimaryController` | `GET` | `/audit/revenue/private/v1/draft/{entityType}` | `/private/v1/draft/{entityType}` | **Private** | Path Variable `entityType` | List pending drafts for user state | Scoped by UserContext state |
| 43 | `DraftPrimaryController` | `POST` | `/audit/revenue/private/v1/draft/delete/{draftCode}/{entityType}` | `/private/v1/draft/delete/{draftCode}/{entityType}` | **Admin** | Path Variables | Delete pending draft | Tenant ownership check |
| 44 | `EsignPrimaryController` | `POST` | `/audit/revenue/private/v1/ehastakshar/initiate` | `/private/v1/ehastakshar/initiate` | **Private** | Multipart PDF file | Generate XML-DSig & initiate eSign | Restricted CORS, Auth check |
| 45 | `EsignSecondaryController` | `POST` | `/audit/revenue/public/v1/ehastakshar/response` | `/public/v1/ehastakshar/response` | **Callback** | URL-Encoded `respon` (XML) | ESP callback processing & PDF signing | XXE Protection, XML-DSig Verify |
| 46 | `EntityPublishController` | `GET` | `/audit/revenue/private/v1/publish/generate-entity-notification/pdf/{entityType}/{draftCode}` | `/private/v1/publish/generate-entity-notification/pdf/...` | **Private** | Path Variables | Generate official notification PDF | State tenant validation |
