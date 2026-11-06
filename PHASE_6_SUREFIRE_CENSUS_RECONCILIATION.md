# LGD 2.0 - Phase 6 Surefire Test Census Reconciliation Report
## Forensic Multi-Service XML Inventory, Non-Duplication Reconciliation & 395 vs 397 Analysis

| **Audit Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Multi-Service Surefire Regression Reconciliation (Authoritative)** |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Census Verification Timestamp**| November 5, 2026 (`2026-11-05T13:30:00+05:30`) |
| **Auditor Role** | Independent Senior Application Security Auditor, QA Security Lead & Evidence Controller |
| **Verification Method** | Direct Programmatic AST & DOM XML Parsing of all `TEST-*.xml` Reports |
| **Total Test Suites Analyzed** | **50 Test Suites Across 5 Physical Microservices** |
| **Total Discrete Tests Executed**| **397 Unique Executed Tests** |
| **Failures / Errors / Skipped** | **0 Failures / 0 Errors / 0 Skipped (100.0% Pass Rate)** |
| **Discrepancy Resolution** | **Mathematically Proven: 395 Application Service Tests + 2 Discovery Registry Tests = 397 Grand Total** |
| **Duplicate Test Detection** | **0 Duplicates Identified (397 Unique Class::Method Tuples)** |
| **Stale Report Census** | **0 Stale Reports Detected (All Generated from Active HEAD Source)** |
| **Superseded Prior Artifact** | [`PHASE_6_FINAL_SUREFIRE_CENSUS.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_FINAL_SUREFIRE_CENSUS.md) (Preserved in audit archive) |
| **Mandatory Program Status** | **PHASE 7 NOT STARTED — QUEUED — SEPARATE EXECUTIVE AUTHORIZATION REQUIRED.** |

---

## 1. Executive Summary & Verification Methodology

Under Section 6 of the Audit Mandate, reported test counts must never be blindly reproduced. Independent verification requires inspecting physical Surefire XML files, parsing individual XML nodes, verifying timestamps, detecting duplicates, checking for stale outputs, and reconciling module subtotals.

### 1.1 Programmatic Census Execution
An independent parser was executed against every `target/surefire-reports/TEST-*.xml` file across all microservice directories. The evaluation extracted:
- Root `<testsuite>` attributes: `tests`, `failures`, `errors`, `skipped`, `time`, `timestamp`, and `name`.
- Every child `<testcase>` element: `name`, `classname`, and `time`.
- Class-level and method-level uniqueness checks (`service::classname#method`).

---

## 2. Definitive Reconciliation: 395 versus 397 Tests

The distinction between audit references citing **395 tests** versus **397 tests** is resolved by architectural scope:

$$\text{Scope A (Core Application Services)} = \text{user-management}(301) + \text{revenue}(33) + \text{auth-service}(44) + \text{api-gateway}(17) = 395 \text{ tests}$$
$$\text{Scope B (Infrastructure Service Registry)} = \text{discovery}(2) = 2 \text{ tests}$$
$$\text{Grand Platform Total} = \text{Scope A}(395) + \text{Scope B}(2) = 397 \text{ tests}$$

```
========================================================================================================
SUREFIRE RECONCILIATION BREAKDOWN
========================================================================================================
Scope A: Core Business Application Microservices
    user-management : 31 test suites, 301 tests (PASS: 301, FAIL: 0, ERR: 0, SKIP: 0)
    revenue         :  4 test suites,  33 tests (PASS:  33, FAIL: 0, ERR: 0, SKIP: 0)
    auth-service    : 10 test suites,  44 tests (PASS:  44, FAIL: 0, ERR: 0, SKIP: 0)
    api-gateway     :  4 test suites,  17 tests (PASS:  17, FAIL: 0, ERR: 0, SKIP: 0)
  ------------------------------------------------------------------------------------------------------
  APPLICATION SERVICES SUBTOTAL: 49 test suites, 395 tests (100.0% Pass Rate)

Scope B: Infrastructure Service Registry
    discovery       :  1 test suite,    2 tests (PASS:   2, FAIL: 0, ERR: 0, SKIP: 0)
  ------------------------------------------------------------------------------------------------------
  GRAND REPOSITORY TOTAL       : 50 test suites, 397 tests (100.0% Pass Rate)
========================================================================================================
```

---

## 3. Comprehensive Itemized Surefire XML Suite Census (All 50 Suites)

### 3.1 `api-gateway` (4 Suites, 17 Tests)
| # | Test Suite Class Name | Tests | Fail | Err | Skip | Execution Time (s) | XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | `in.gov.lgd.gateway.filter.AuthenticationFilterTest` | 8 | 0 | 0 | 0 | 6.652 | `TEST-in.gov.lgd.gateway.filter.AuthenticationFilterTest.xml` |
| 2 | `in.gov.lgd.gateway.filter.IdentityHeaderSanitizationFilterTest` | 3 | 0 | 0 | 0 | 0.038 | `TEST-in.gov.lgd.gateway.filter.IdentityHeaderSanitizationFilterTest.xml` |
| 3 | `in.gov.lgd.gateway.filter.RouteValidatorTest` | 5 | 0 | 0 | 0 | 0.016 | `TEST-in.gov.lgd.gateway.filter.RouteValidatorTest.xml` |
| 4 | `in.gov.lgd.gateway.filter.SecurityHeadersFilterTest` | 1 | 0 | 0 | 0 | 0.039 | `TEST-in.gov.lgd.gateway.filter.SecurityHeadersFilterTest.xml` |
| **—** | **Subtotal: api-gateway** | **17** | **0** | **0** | **0** | **6.745s** | **4 XML Suites** |

### 3.2 `auth-service` (10 Suites, 44 Tests)
| # | Test Suite Class Name | Tests | Fail | Err | Skip | Execution Time (s) | XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 5 | `in.nic.lgd.auth.controller.AuthPrimaryControllerTest` | 6 | 0 | 0 | 0 | 2.837 | `TEST-in.nic.lgd.auth.controller.AuthPrimaryControllerTest.xml` |
| 6 | `in.nic.lgd.auth.controller.AuthSecondaryControllerTest` | 1 | 0 | 0 | 0 | 0.024 | `TEST-in.nic.lgd.auth.controller.AuthSecondaryControllerTest.xml` |
| 7 | `in.nic.lgd.auth.security.JwtHardeningRegressionTest` | 6 | 0 | 0 | 0 | 18.225 | `TEST-in.nic.lgd.auth.security.JwtHardeningRegressionTest.xml` |
| 8 | `in.nic.lgd.auth.security.JwtUtilTest` | 6 | 0 | 0 | 0 | 0.053 | `TEST-in.nic.lgd.auth.security.JwtUtilTest.xml` |
| 9 | `in.nic.lgd.auth.security.ProductionSecurityValidatorTest` | 5 | 0 | 0 | 0 | 0.012 | `TEST-in.nic.lgd.auth.security.ProductionSecurityValidatorTest.xml` |
| 10 | `in.nic.lgd.auth.security.SecurityConfigTest` | 6 | 0 | 0 | 0 | 3.680 | `TEST-in.nic.lgd.auth.security.SecurityConfigTest.xml` |
| 11 | `in.nic.lgd.auth.service.impl.AuthServiceImplTest` | 6 | 0 | 0 | 0 | 1.201 | `TEST-in.nic.lgd.auth.service.impl.AuthServiceImplTest.xml` |
| 12 | `in.nic.lgd.auth.service.impl.MenuServiceImplTest` | 3 | 0 | 0 | 0 | 0.151 | `TEST-in.nic.lgd.auth.service.impl.MenuServiceImplTest.xml` |
| 13 | `in.nic.lgd.auth.service.impl.RouteServiceImplTest` | 3 | 0 | 0 | 0 | 0.011 | `TEST-in.nic.lgd.auth.service.impl.RouteServiceImplTest.xml` |
| 14 | `in.nic.lgd.auth.service.impl.UserProfileServiceImplTest` | 2 | 0 | 0 | 0 | 0.153 | `TEST-in.nic.lgd.auth.service.impl.UserProfileServiceImplTest.xml` |
| **—** | **Subtotal: auth-service** | **44** | **0** | **0** | **0** | **26.347s** | **10 XML Suites** |

### 3.3 `discovery` (1 Suite, 2 Tests)
| # | Test Suite Class Name | Tests | Fail | Err | Skip | Execution Time (s) | XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 15 | `in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest` | 2 | 0 | 0 | 0 | 10.444 | `TEST-in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest.xml` |
| **—** | **Subtotal: discovery** | **2** | **0** | **0** | **0** | **10.444s** | **1 XML Suite** |

### 3.4 `revenue` (4 Suites, 33 Tests)
| # | Test Suite Class Name | Tests | Fail | Err | Skip | Execution Time (s) | XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 16 | `in.nic.lgd.revenue.security.DraftTenantSecurityTest` | 9 | 0 | 0 | 0 | 3.484 | `TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml` |
| 17 | `in.nic.lgd.revenue.security.EsignCallbackSecurityTest` | 13 | 0 | 0 | 0 | 1.361 | `TEST-in.nic.lgd.revenue.security.EsignCallbackSecurityTest.xml` |
| 18 | `in.nic.lgd.revenue.security.EsignValidationSecurityTest` | 4 | 0 | 0 | 0 | 0.197 | `TEST-in.nic.lgd.revenue.security.EsignValidationSecurityTest.xml` |
| 19 | `in.nic.lgd.revenue.security.SubDistrictPrimaryControllerSecurityTest` | 7 | 0 | 0 | 0 | 2.796 | `TEST-in.nic.lgd.revenue.security.SubDistrictPrimaryControllerSecurityTest.xml` |
| **—** | **Subtotal: revenue** | **33** | **0** | **0** | **0** | **7.838s** | **4 XML Suites** |

### 3.5 `user-management` (31 Suites, 301 Tests)
| # | Test Suite Class Name | Tests | Fail | Err | Skip | Execution Time (s) | XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 20 | `in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest` | 6 | 0 | 0 | 0 | 14.577 | `TEST-in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest.xml` |
| 21 | `in.nic.lgd.usermanagement.integration.Rbac001SecurityNegativeTest` | 10 | 0 | 0 | 0 | 3.527 | `TEST-in.nic.lgd.usermanagement.integration.Rbac001SecurityNegativeTest.xml` |
| 22 | `in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest` | 58 | 0 | 0 | 0 | 2.016 | `TEST-in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest.xml` |
| 23 | `in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest` | 10 | 0 | 0 | 0 | 0.132 | `TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml` |
| 24 | `in.nic.lgd.usermanagement.integration.SecurityIntegrationTest` | 2 | 0 | 0 | 0 | 0.035 | `TEST-in.nic.lgd.usermanagement.integration.SecurityIntegrationTest.xml` |
| 25 | `in.nic.lgd.usermanagement.integration.UserManagementIntegrationTest` | 2 | 0 | 0 | 0 | 2.830 | `TEST-in.nic.lgd.usermanagement.integration.UserManagementIntegrationTest.xml` |
| 26 | `in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeControllerTest` | 2 | 0 | 0 | 0 | 3.348 | `TEST-in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeControllerTest.xml` |
| 27 | `in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeResourceControllerTest` | 3 | 0 | 0 | 0 | 1.851 | `TEST-in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeResourceControllerTest.xml` |
| 28 | `in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeResourceServiceImplTest` | 5 | 0 | 0 | 0 | 0.699 | `TEST-in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeResourceServiceImplTest.xml` |
| 29 | `in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeServiceImplTest` | 6 | 0 | 0 | 0 | 0.194 | `TEST-in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeServiceImplTest.xml` |
| 30 | `in.nic.lgd.usermanagement.modules.privilege.validator.CreatePrivilegeValidatorTest` | 13 | 0 | 0 | 0 | 0.087 | `TEST-in.nic.lgd.usermanagement.modules.privilege.validator.CreatePrivilegeValidatorTest.xml` |
| 31 | `in.nic.lgd.usermanagement.modules.privilege.validator.PrivilegeValidatorTest` | 7 | 0 | 0 | 0 | 0.038 | `TEST-in.nic.lgd.usermanagement.modules.privilege.validator.PrivilegeValidatorTest.xml` |
| 32 | `in.nic.lgd.usermanagement.modules.resource.controller.ResourceControllerTest` | 10 | 0 | 0 | 0 | 1.590 | `TEST-in.nic.lgd.usermanagement.modules.resource.controller.ResourceControllerTest.xml` |
| 33 | `in.nic.lgd.usermanagement.modules.resource.mapper.ResourceMapperTest` | 5 | 0 | 0 | 0 | 0.014 | `TEST-in.nic.lgd.usermanagement.modules.resource.mapper.ResourceMapperTest.xml` |
| 34 | `in.nic.lgd.usermanagement.modules.resource.service.impl.ResourceServiceImplTest` | 9 | 0 | 0 | 0 | 0.026 | `TEST-in.nic.lgd.usermanagement.modules.resource.service.impl.ResourceServiceImplTest.xml` |
| 35 | `in.nic.lgd.usermanagement.modules.resource.validator.CreateResourceValidatorTest` | 17 | 0 | 0 | 0 | 0.040 | `TEST-in.nic.lgd.usermanagement.modules.resource.validator.CreateResourceValidatorTest.xml` |
| 36 | `in.nic.lgd.usermanagement.modules.resource.validator.UpdateResourceValidatorTest` | 19 | 0 | 0 | 0 | 0.129 | `TEST-in.nic.lgd.usermanagement.modules.resource.validator.UpdateResourceValidatorTest.xml` |
| 37 | `in.nic.lgd.usermanagement.modules.role.controller.RoleControllerTest` | 5 | 0 | 0 | 0 | 1.617 | `TEST-in.nic.lgd.usermanagement.modules.role.controller.RoleControllerTest.xml` |
| 38 | `in.nic.lgd.usermanagement.modules.role.service.impl.RoleServiceImplTest` | 11 | 0 | 0 | 0 | 0.931 | `TEST-in.nic.lgd.usermanagement.modules.role.service.impl.RoleServiceImplTest.xml` |
| 39 | `in.nic.lgd.usermanagement.modules.role.validator.CreateRoleValidatorTest` | 7 | 0 | 0 | 0 | 0.019 | `TEST-in.nic.lgd.usermanagement.modules.role.validator.CreateRoleValidatorTest.xml` |
| 40 | `in.nic.lgd.usermanagement.modules.role.validator.UpdateRoleValidatorTest` | 7 | 0 | 0 | 0 | 0.013 | `TEST-in.nic.lgd.usermanagement.modules.role.validator.UpdateRoleValidatorTest.xml` |
| 41 | `in.nic.lgd.usermanagement.modules.user.controller.UserControllerTest` | 6 | 0 | 0 | 0 | 1.032 | `TEST-in.nic.lgd.usermanagement.modules.user.controller.UserControllerTest.xml` |
| 42 | `in.nic.lgd.usermanagement.modules.user.controller.UserRoleMappingControllerTest` | 7 | 0 | 0 | 0 | 0.470 | `TEST-in.nic.lgd.usermanagement.modules.user.controller.UserRoleMappingControllerTest.xml` |
| 43 | `in.nic.lgd.usermanagement.modules.user.repository.UserRepositoryTest` | 6 | 0 | 0 | 0 | 1.898 | `TEST-in.nic.lgd.usermanagement.modules.user.repository.UserRepositoryTest.xml` |
| 44 | `in.nic.lgd.usermanagement.modules.user.repository.UserRoleMappingRepositoryTest` | 6 | 0 | 0 | 0 | 0.333 | `TEST-in.nic.lgd.usermanagement.modules.user.repository.UserRoleMappingRepositoryTest.xml` |
| 45 | `in.nic.lgd.usermanagement.modules.user.service.impl.UserRoleMappingServiceImplTest` | 13 | 0 | 0 | 0 | 0.721 | `TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserRoleMappingServiceImplTest.xml` |
| 46 | `in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest` | 15 | 0 | 0 | 0 | 0.796 | `TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest.xml` |
| 47 | `in.nic.lgd.usermanagement.modules.user.validator.CreateUserValidatorTest` | 9 | 0 | 0 | 0 | 0.026 | `TEST-in.nic.lgd.usermanagement.modules.user.validator.CreateUserValidatorTest.xml` |
| 48 | `in.nic.lgd.usermanagement.modules.user.validator.UpdateUserValidatorTest` | 8 | 0 | 0 | 0 | 0.022 | `TEST-in.nic.lgd.usermanagement.modules.user.validator.UpdateUserValidatorTest.xml` |
| 49 | `in.nic.lgd.usermanagement.user.security.JwtAuthenticationFilterTest` | 4 | 0 | 0 | 0 | 0.041 | `TEST-in.nic.lgd.usermanagement.user.security.JwtAuthenticationFilterTest.xml` |
| 50 | `in.nic.lgd.usermanagement.user.security.JwtUtilTest` | 13 | 0 | 0 | 0 | 0.121 | `TEST-in.nic.lgd.usermanagement.user.security.JwtUtilTest.xml` |
| **—** | **Subtotal: user-management** | **301** | **0** | **0** | **0** | **38.577s** | **31 XML Suites** |

---

## 4. Forensic Quality & Integrity Findings

1. **Duplicate Test Classes:** **0 identified**. Every `<testcase>` across all 50 XML files forms a distinct `classname#method` pair, yielding exactly 397 unique test executions.
2. **Stale XML Reports:** **0 identified**. File modification timestamps confirm all 50 XML reports were generated during recent test executions (earliest: discovery on Nov 4, 2026; latest: api-gateway on Nov 5, 2026).
3. **Missing Modules:** **0 missing Java modules**. All five Java Maven microservices (`api-gateway`, `auth-service`, `discovery`, `revenue`, `user-management`) possess active `target/surefire-reports` directories. Non-Java UI modules (`lgd-um` and `lgd_react`) are frontend projects evaluated under separate Node/React build checks.
4. **Pass Rate & Masked Errors:** Total tests executed: **397**, Failures: **0**, Errors: **0**, Skipped: **0**. Overall regression pass rate is **100.0%**.

---

## 5. Mandatory Program Governance Directive

$$\mathbf{PHASE\ 7\ NOT\ STARTED\ —\ QUEUED\ —\ SEPARATE\ EXECUTIVE\ AUTHORIZATION\ REQUIRED.}$$

