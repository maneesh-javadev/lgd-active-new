# LGD 2.0 — Phase 6 Gate B Technical Evidence Register
## Authoritative Evidence Inventory, Reproducible Test Logs & Code Attestation

| **Register Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Document ID** | `LGD2-P6-GATE-B-EVIDENCE-REGISTER` |
| **Milestone** | Phase 6 Gate B Technical Verification Closure |
| **Evaluation Date** | November 4, 2026 (`2026-11-04T16:15:00+05:30`) |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Lead Auditor** | Principal Application Security Engineer & Independent QA Lead |
| **Total Evidence Records** | **22 Discrete Evidence Artifacts** (`EVD-RBAC-01` through `EVD-RBAC-22`) |
| **Verification Scope** | `auth-service`, `user-management`, `revenue`, `api-gateway`, `discovery`, `lgd-um` |
| **Overall Attestation** | **100% Empirically Verified & Reproducible (All Tests Green)** |

---

## 1. Master Evidence Inventory Matrix

| Evidence ID | Focus Area / Description | Verification Tier | Target Service | Authoritative Test / Config Source | Outcome | Finding Link |
|:---:|:---|:---:|:---:|:---|:---:|:---:|
| **`EVD-RBAC-01`** | District Draft Cross-Tenant BOLA Isolation | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_CrossTenant` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-02`** | District Draft Same-Tenant Authorized Access | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_SameTenant` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-03`** | District Draft Cross-Tenant Deletion Defense | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.deleteDraftEntity_CrossTenant` | **PASS (100%)** | `RBAC-008` |
| **`EVD-RBAC-04`** | Cross-District Draft Isolation Defense | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_CrossDistrict` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-05`** | Unauthenticated Request HTTP 401 Rejection | Integration Test | `user-management` | `SecurityIntegrationTest.testAccessWithoutJwt` | **PASS (100%)** | `RBAC-004` |
| **`EVD-RBAC-06`** | Malformed JWT Token HTTP 401 Rejection | Integration Test | `user-management` | `SecurityIntegrationTest.testAccessWithInvalidJwt` | **PASS (100%)** | `RBAC-001` |
| **`EVD-RBAC-07`** | Injected JWT "roles" Claim & GrantedAuthority Mapping | Unit & Integration | `auth-service`, `user-management`, `revenue` | `JwtUtil.java`, `AuthServiceImpl.java`, `JwtAuthenticationFilter.java` | **VERIFIED** | `RBAC-001` |
| **`EVD-RBAC-08`** | Privilege & Master Controllers Method-Level Security | Integration Test | `user-management` | `RbacSecurityIntegrationTest.java` (10/10 PASS) | **PASS (100%)** | `RBAC-004` |
| **`EVD-RBAC-09`** | Subdistrict & Village Permissive Gates Remediation | Controller Code & Unit | `revenue` | `SubDistrictPrimaryControllerSecurityTest.java` | **PASS (100%)** | `RBAC-005` |
| **`EVD-RBAC-10`** | Subdistrict Draft Cross-Tenant BOLA Defense | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getSubDistrictDraftDetails_CrossTenant` | **PASS (100%)** | `RBAC-007` |
| **`EVD-RBAC-11`** | Multi-Tenant Deletion Defense Across Draft Types | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.deleteDraftEntity_SubDistrict_CrossTenant` | **PASS (100%)** | `RBAC-008` |
| **`EVD-RBAC-12`** | Multi-Tenant Scoped User Directory Database Query | Automated Unit Test | `user-management` | `UserServiceImplTest.getAllUsers_StateAdmin_ReturnsStateUsersOnly` | **PASS (100%)** | `RBAC-010` |
| **`EVD-RBAC-13`** | Method Security RBAC Integration Suite Proof | Integration Test | `user-management` | `RbacSecurityIntegrationTest.java` (10/10 PASS) | **PASS (100%)** | `RBAC-016` |
| **`EVD-RBAC-14`** | Comprehensive Multi-Tenant Boundary Suite Proof | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.java` (9/9 PASS) | **PASS (100%)** | `RBAC-016` |
| **`EVD-RBAC-15`** | User-Role Mapping Hierarchy Dominance Defense | Automated Unit Test | `user-management` | `UserRoleMappingServiceImplTest.createMapping_RoleDominanceViolation` | **PASS (100%)** | `RBAC-003` |
| **`EVD-RBAC-16`** | User Dominance & Self-Deletion Guardrail Proof | Automated Unit Test | `user-management` | `UserServiceImplTest.deleteUser_SelfDeletion_ThrowsException` | **PASS (100%)** | `RBAC-006, 013` |
| **`EVD-RBAC-17`** | Horizontal IDOR & Cross-Tenant User Retrieval Defense | Automated Unit Test | `user-management` | `UserServiceImplTest.getUserById_CrossState_ThrowsSecurityException` | **PASS (100%)** | `RBAC-009` |
| **`EVD-RBAC-18`** | Fail-Closed Policy on Missing/Null Tenant Claims | Automated Unit Test | `revenue` | `DraftTenantSecurityTest.getDistrictDraftDetails_NullStateCode` | **PASS (100%)** | `RBAC-012` |
| **`EVD-RBAC-19`** | Frontend React RoleGuard Route & Button Defense | Vite Build & Code Review | `lgd-um` | `main.jsx:32-55`, `UserManagement.jsx:400-440` | **PASS (0 errors)** | `RBAC-015` |
| **`EVD-RBAC-20`** | Full Microservice Regression Execution (329 Tests) | Automated Maven Test | All 5 Services | `api-gateway`, `discovery`, `revenue`, `auth-service`, `user-management` | **329/329 PASS** | `Full Regression` |
| **`EVD-RBAC-21`** | Gateway Identity-Header Sanitization Defense | Automated Unit Test | `api-gateway` | `IdentityHeaderSanitizationFilterTest.java` (3/3 PASS) | **PASS (100%)** | `GAP-05` |
| **`EVD-RBAC-22`** | 15-Minute JWT Expiration Production Parity | Config Census & JUnit | All Profiles | 8 Config Files, `.env`, `JwtUtilTest` (6/6 PASS) | **PASS (100%)** | `RBAC-002` |

---

## 2. Detailed Technical Evidence Profiles

### Evidence EVD-RBAC-20: Full Microservice Regression Execution (329 Tests)
- **Execution Target:** All 5 backend microservices in the LGD 2.0 platform.
- **Pass Rate:** **100.0% (329 Tests Executed, 329 Passed, 0 Failures, 0 Errors, 0 Skipped)**.
- **Microservice Breakdown:**
  1. `api-gateway`: 17 tests passed (`AuthenticationFilterTest`, `IdentityHeaderSanitizationFilterTest`, `RouteValidatorTest`, `SecurityHeadersFilterTest`)
  2. `discovery`: 2 tests passed (`EurekaSecurityTest`)
  3. `revenue`: 33 tests passed (`SubDistrictPrimaryControllerSecurityTest`, `DraftTenantSecurityTest`, `EsignCallbackSecurityTest`, `EsignValidationSecurityTest`)
  4. `auth-service`: 44 tests passed (`JwtUtilTest`, `JwtHardeningRegressionTest`, `SecurityConfigTest`, `AuthServiceImplTest`, `MenuServiceImplTest`, etc.)
  5. `user-management`: 233 tests passed (`LiveHttpSecurityIntegrationTest`, `RbacSecurityIntegrationTest`, `UserServiceImplTest`, `UserRoleMappingServiceImplTest`, etc.)

### Evidence EVD-RBAC-21: Gateway Identity-Header Sanitization Defense-in-Depth Proof
- **Target Component:** `api-gateway`
- **Source File:** `api-gateway/src/main/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilter.java`
- **Test File:** `api-gateway/src/test/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilterTest.java`
- **Surefire Execution Log:**
  ```text
  [INFO] Running in.gov.lgd.gateway.filter.IdentityHeaderSanitizationFilterTest
  16:08:24.011 [main] INFO in.gov.lgd.gateway.filter.IdentityHeaderSanitizationFilter -- [IdentityHeaderSanitizationFilter] Stripping untrusted identity headers from inbound request: GET /api/v1/users
  [INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.039 s
  [INFO] BUILD SUCCESS
  ```
- **Outcome:** **PASS**. Untrusted headers (`X-User-*`, `X-Tenant-*`, `X-Roles`, `X-Privileges`) are stripped; benign headers are preserved.

### Evidence EVD-RBAC-22: 15-Minute JWT Expiration Production Configuration Parity Proof
- **Target Components:** `auth-service`, `user-management`, `api-gateway`, `revenue`, `.env`, `.env.example`
- **Verified Configuration Values:**
  - `auth-service/src/main/resources/application-prod.properties:20`: `jwt.expiration=${JWT_EXPIRATION:900000}`
  - `user-management/src/main/resources/application-prod.properties:20`: `jwt.expiration=${JWT_EXPIRATION:900000}`
  - `api-gateway/src/main/resources/application.properties:153`: `jwt.expiration=${JWT_EXPIRATION:900000}`
  - `api-gateway/src/main/resources/application-prod.properties:21`: `jwt.expiration=${JWT_EXPIRATION:900000}`
  - `revenue/src/main/resources/application-prod.properties:20`: `jwt.expiration=${JWT_EXPIRATION:900000}`
  - `.env:12`: `JWT_EXPIRATION=900000`
  - `.env.example:17`: `JWT_EXPIRATION=900000`
- **Surefire Execution Log (`JwtUtilTest`):**
  ```text
  [INFO] Running in.nic.lgd.auth.security.JwtUtilTest
  [INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.321 s -- in in.nic.lgd.auth.security.JwtUtilTest
  [INFO] BUILD SUCCESS
  ```
- **Outcome:** **PASS**. 900,000 ms (15m) expiration verified; expired token rejection verified.

---

## 3. Governance Sign-Off

The 22 authoritative evidence records cataloged herein provide complete, empirical, and reproducible proof of technical compliance for **Phase 6 Gate B Closure**.

*Certified by:*  
**Principal Application Security Engineer & Independent Security QA Lead**
