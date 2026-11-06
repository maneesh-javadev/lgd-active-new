# LGD 2.0 — Phase 6 Final Surefire Test Suite Census Report
## Multi-Service XML Inventory, Non-Duplication Reconciliation & 395 vs 397 Analysis

| **Audit Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Multi-Service Surefire Regression Reconciliation** |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Census Timestamp** | November 5, 2026 (`2026-11-05T12:35:00+05:30`) |
| **Auditor Role** | Principal Quality Assurance Engineer & Independent Security Test Evaluator |
| **Total Test Suites Analyzed** | **50 Test Suites Across 5 Microservices** |
| **Total Test Cases Executed** | **397 Unique Discrete Tests** |
| **Failures / Errors / Skipped** | **0 Failures / 0 Errors / 0 Skipped (100.0% Pass Rate)** |
| **Discrepancy Resolution** | **Reconciled: Exactly 395 Application Tests + 2 Discovery Tests = 397 Full Platform Tests** |
| **Duplicate Test Detection** | **0 Duplicates Identified (100% Unique Method Coverage)** |
| **Stale Report Census** | **0 Stale Reports Detected (All Reports Generated from Current Source)** |

---

## 1. Executive Summary & Reconciliation Objective

The objective of this comprehensive Surefire XML census is to resolve the numerical discrepancies reported in historical Phase 6 artifacts regarding automated test execution counts, specifically reconciling **395 versus 397 tests**.

Through direct, programmatic XML parsing of every `TEST-*.xml` artifact within every microservice's `target/surefire-reports` directory, this census independently confirms:
1. Every individual `<testsuite>` and `<testcase>` element.
2. The exact test counts, failure counts, execution durations, and timestamps.
3. The complete absence of duplicate test cases, masked failures, or stale reports.
4. The exact scope distinction between the core business application microservices and the infrastructure service discovery component.

---

## 2. Definitive Reconciliation: 395 versus 397 Tests

### 2.1 The Scope Demarcation Equation
The apparent contradiction between audit documents citing **395 tests** and those citing **397 tests** is resolved by examining the architectural scope of the evaluations:

$$\text{Application Services Count} = \text{user-management}(301) + \text{revenue}(33) + \text{auth-service}(44) + \text{api-gateway}(17) = 395 \text{ tests}$$
$$\text{Infrastructure Service Discovery Count} = \text{discovery}(2) = 2 \text{ tests}$$
$$\text{Total Physical Repository Count} = 395 + 2 = 397 \text{ tests}$$

```
========================================================================================================
SUREFIRE RECONCILIATION BREAKDOWN
========================================================================================================
Scope A: Core Business Application Microservices
  • user-management:  31 test suites,  301 tests (PASS: 301, FAIL: 0, ERR: 0, SKIP: 0)
  • revenue:           4 test suites,   33 tests (PASS:  33, FAIL: 0, ERR: 0, SKIP: 0)
  • auth-service:     10 test suites,   44 tests (PASS:  44, FAIL: 0, ERR: 0, SKIP: 0)
  • api-gateway:       4 test suites,   17 tests (PASS:  17, FAIL: 0, ERR: 0, SKIP: 0)
  ------------------------------------------------------------------------------------------------------
  APPLICATION SUBTOTAL: 49 test suites, 395 tests (100.0% Pass Rate)

Scope B: Infrastructure Service Registry
  • discovery:         1 test suite,     2 tests (PASS:   2, FAIL: 0, ERR: 0, SKIP: 0)
  ------------------------------------------------------------------------------------------------------
  GRAND REPOSITORY TOTAL: 50 test suites, 397 tests (100.0% Pass Rate)
========================================================================================================
```

### 2.2 Deep Forensic Inspection of Discovery Microservice Tests
- **XML Report Path:** [`discovery/target/surefire-reports/TEST-in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/discovery/target/surefire-reports/TEST-in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest.xml)
- **Suite Class Name:** `in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest`
- **Total Suite Execution Time:** 10.444 seconds (Tests active duration: 1.216 seconds)
- **Framework Context:** Spring Cloud Netflix Eureka Server `4.2.1` with Spring Security `6.4.4` / Spring Boot `3.4.4`
- **Itemized Test Methods:**
  1. `<testcase name="authenticatedAccess_PassesSecurityFilter" classname="in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest" time="1.196"/>`
     - **Assertion:** Dispatches an HTTP GET request to `/` supplying valid HTTP Basic credentials (`eureka.username` / `eureka.password`). Asserts that the Spring Security filter chain authenticates the request and permits access to the Eureka dashboard with HTTP 200 OK.
  2. `<testcase name="unauthenticatedAccess_Returns401" classname="in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest" time="0.02"/>`
     - **Assertion:** Dispatches an unauthenticated HTTP GET request to `/`. Asserts that `BasicAuthenticationFilter` rejects the request with HTTP 401 Unauthorized (`WWW-Authenticate: Basic realm="Realm"`).

---

## 3. Comprehensive Itemized Surefire Suite Inventory (All 50 Suites)

### 3.1 `api-gateway` Microservice (4 Suites / 17 Tests)

| # | Test Suite Class Name | Tests | Fail | Err | Skip | Time (s) | Surefire XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | `in.gov.lgd.gateway.filter.AuthenticationFilterTest` | 8 | 0 | 0 | 0 | 6.652 | [`TEST-in.gov.lgd.gateway.filter.AuthenticationFilterTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/target/surefire-reports/TEST-in.gov.lgd.gateway.filter.AuthenticationFilterTest.xml) |
| 2 | `in.gov.lgd.gateway.filter.IdentityHeaderSanitizationFilterTest` | 3 | 0 | 0 | 0 | 0.038 | [`TEST-in.gov.lgd.gateway.filter.IdentityHeaderSanitizationFilterTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/target/surefire-reports/TEST-in.gov.lgd.gateway.filter.IdentityHeaderSanitizationFilterTest.xml) |
| 3 | `in.gov.lgd.gateway.filter.RouteValidatorTest` | 5 | 0 | 0 | 0 | 0.016 | [`TEST-in.gov.lgd.gateway.filter.RouteValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/target/surefire-reports/TEST-in.gov.lgd.gateway.filter.RouteValidatorTest.xml) |
| 4 | `in.gov.lgd.gateway.filter.SecurityHeadersFilterTest` | 1 | 0 | 0 | 0 | 0.039 | [`TEST-in.gov.lgd.gateway.filter.SecurityHeadersFilterTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/target/surefire-reports/TEST-in.gov.lgd.gateway.filter.SecurityHeadersFilterTest.xml) |

---

### 3.2 `auth-service` Microservice (10 Suites / 44 Tests)

| # | Test Suite Class Name | Tests | Fail | Err | Skip | Time (s) | Surefire XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | `in.nic.lgd.auth.controller.AuthPrimaryControllerTest` | 6 | 0 | 0 | 0 | 2.837 | [`TEST-in.nic.lgd.auth.controller.AuthPrimaryControllerTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.controller.AuthPrimaryControllerTest.xml) |
| 2 | `in.nic.lgd.auth.controller.AuthSecondaryControllerTest` | 1 | 0 | 0 | 0 | 0.024 | [`TEST-in.nic.lgd.auth.controller.AuthSecondaryControllerTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.controller.AuthSecondaryControllerTest.xml) |
| 3 | `in.nic.lgd.auth.security.JwtHardeningRegressionTest` | 6 | 0 | 0 | 0 | 18.225 | [`TEST-in.nic.lgd.auth.security.JwtHardeningRegressionTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.security.JwtHardeningRegressionTest.xml) |
| 4 | `in.nic.lgd.auth.security.JwtUtilTest` | 6 | 0 | 0 | 0 | 0.053 | [`TEST-in.nic.lgd.auth.security.JwtUtilTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.security.JwtUtilTest.xml) |
| 5 | `in.nic.lgd.auth.security.ProductionSecurityValidatorTest` | 5 | 0 | 0 | 0 | 0.012 | [`TEST-in.nic.lgd.auth.security.ProductionSecurityValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.security.ProductionSecurityValidatorTest.xml) |
| 6 | `in.nic.lgd.auth.security.SecurityConfigTest` | 6 | 0 | 0 | 0 | 3.680 | [`TEST-in.nic.lgd.auth.security.SecurityConfigTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.security.SecurityConfigTest.xml) |
| 7 | `in.nic.lgd.auth.service.impl.AuthServiceImplTest` | 6 | 0 | 0 | 0 | 1.201 | [`TEST-in.nic.lgd.auth.service.impl.AuthServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.service.impl.AuthServiceImplTest.xml) |
| 8 | `in.nic.lgd.auth.service.impl.MenuServiceImplTest` | 3 | 0 | 0 | 0 | 0.151 | [`TEST-in.nic.lgd.auth.service.impl.MenuServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.service.impl.MenuServiceImplTest.xml) |
| 9 | `in.nic.lgd.auth.service.impl.RouteServiceImplTest` | 3 | 0 | 0 | 0 | 0.011 | [`TEST-in.nic.lgd.auth.service.impl.RouteServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.service.impl.RouteServiceImplTest.xml) |
| 10 | `in.nic.lgd.auth.service.impl.UserProfileServiceImplTest` | 2 | 0 | 0 | 0 | 0.153 | [`TEST-in.nic.lgd.auth.service.impl.UserProfileServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.service.impl.UserProfileServiceImplTest.xml) |

---

### 3.3 `discovery` Microservice (1 Suite / 2 Tests)

| # | Test Suite Class Name | Tests | Fail | Err | Skip | Time (s) | Surefire XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | `in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest` | 2 | 0 | 0 | 0 | 10.444 | [`TEST-in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/discovery/target/surefire-reports/TEST-in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest.xml) |

---

### 3.4 `revenue` Microservice (4 Suites / 33 Tests)

| # | Test Suite Class Name | Tests | Fail | Err | Skip | Time (s) | Surefire XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | `in.nic.lgd.revenue.security.DraftTenantSecurityTest` | 9 | 0 | 0 | 0 | 3.484 | [`TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.DraftTenantSecurityTest.xml) |
| 2 | `in.nic.lgd.revenue.security.EsignCallbackSecurityTest` | 13 | 0 | 0 | 0 | 1.361 | [`TEST-in.nic.lgd.revenue.security.EsignCallbackSecurityTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.EsignCallbackSecurityTest.xml) |
| 3 | `in.nic.lgd.revenue.security.EsignValidationSecurityTest` | 4 | 0 | 0 | 0 | 0.197 | [`TEST-in.nic.lgd.revenue.security.EsignValidationSecurityTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.EsignValidationSecurityTest.xml) |
| 4 | `in.nic.lgd.revenue.security.SubDistrictPrimaryControllerSecurityTest` | 7 | 0 | 0 | 0 | 2.796 | [`TEST-in.nic.lgd.revenue.security.SubDistrictPrimaryControllerSecurityTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.SubDistrictPrimaryControllerSecurityTest.xml) |

---

### 3.5 `user-management` Microservice (31 Suites / 301 Tests)

| # | Test Suite Class Name | Tests | Fail | Err | Skip | Time (s) | Surefire XML Report File |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | `in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest` | 6 | 0 | 0 | 0 | 14.577 | [`TEST-in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest.xml) |
| 2 | `in.nic.lgd.usermanagement.integration.Rbac001SecurityNegativeTest` | 10 | 0 | 0 | 0 | 3.527 | [`TEST-in.nic.lgd.usermanagement.integration.Rbac001SecurityNegativeTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.Rbac001SecurityNegativeTest.xml) |
| 3 | `in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest` | 58 | 0 | 0 | 0 | 2.016 | [`TEST-in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest.xml) |
| 4 | `in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest` | 10 | 0 | 0 | 0 | 0.132 | [`TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml) |
| 5 | `in.nic.lgd.usermanagement.integration.SecurityIntegrationTest` | 2 | 0 | 0 | 0 | 0.035 | [`TEST-in.nic.lgd.usermanagement.integration.SecurityIntegrationTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.SecurityIntegrationTest.xml) |
| 6 | `in.nic.lgd.usermanagement.integration.UserManagementIntegrationTest` | 2 | 0 | 0 | 0 | 2.830 | [`TEST-in.nic.lgd.usermanagement.integration.UserManagementIntegrationTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.UserManagementIntegrationTest.xml) |
| 7 | `in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeControllerTest` | 2 | 0 | 0 | 0 | 3.348 | [`TEST-in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeControllerTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeControllerTest.xml) |
| 8 | `in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeResourceControllerTest` | 3 | 0 | 0 | 0 | 1.851 | [`TEST-in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeResourceControllerTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.privilege.controller.PrivilegeResourceControllerTest.xml) |
| 9 | `in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeResourceServiceImplTest` | 5 | 0 | 0 | 0 | 0.699 | [`TEST-in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeResourceServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeResourceServiceImplTest.xml) |
| 10 | `in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeServiceImplTest` | 6 | 0 | 0 | 0 | 0.194 | [`TEST-in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.privilege.service.impl.PrivilegeServiceImplTest.xml) |
| 11 | `in.nic.lgd.usermanagement.modules.privilege.validator.CreatePrivilegeValidatorTest` | 13 | 0 | 0 | 0 | 0.087 | [`TEST-in.nic.lgd.usermanagement.modules.privilege.validator.CreatePrivilegeValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.privilege.validator.CreatePrivilegeValidatorTest.xml) |
| 12 | `in.nic.lgd.usermanagement.modules.privilege.validator.PrivilegeValidatorTest` | 7 | 0 | 0 | 0 | 0.038 | [`TEST-in.nic.lgd.usermanagement.modules.privilege.validator.PrivilegeValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.privilege.validator.PrivilegeValidatorTest.xml) |
| 13 | `in.nic.lgd.usermanagement.modules.resource.controller.ResourceControllerTest` | 10 | 0 | 0 | 0 | 1.590 | [`TEST-in.nic.lgd.usermanagement.modules.resource.controller.ResourceControllerTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.resource.controller.ResourceControllerTest.xml) |
| 14 | `in.nic.lgd.usermanagement.modules.resource.mapper.ResourceMapperTest` | 5 | 0 | 0 | 0 | 0.014 | [`TEST-in.nic.lgd.usermanagement.modules.resource.mapper.ResourceMapperTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.resource.mapper.ResourceMapperTest.xml) |
| 15 | `in.nic.lgd.usermanagement.modules.resource.service.impl.ResourceServiceImplTest` | 9 | 0 | 0 | 0 | 0.026 | [`TEST-in.nic.lgd.usermanagement.modules.resource.service.impl.ResourceServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.resource.service.impl.ResourceServiceImplTest.xml) |
| 16 | `in.nic.lgd.usermanagement.modules.resource.validator.CreateResourceValidatorTest` | 17 | 0 | 0 | 0 | 0.040 | [`TEST-in.nic.lgd.usermanagement.modules.resource.validator.CreateResourceValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.resource.validator.CreateResourceValidatorTest.xml) |
| 17 | `in.nic.lgd.usermanagement.modules.resource.validator.UpdateResourceValidatorTest` | 19 | 0 | 0 | 0 | 0.129 | [`TEST-in.nic.lgd.usermanagement.modules.resource.validator.UpdateResourceValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.resource.validator.UpdateResourceValidatorTest.xml) |
| 18 | `in.nic.lgd.usermanagement.modules.role.controller.RoleControllerTest` | 5 | 0 | 0 | 0 | 1.617 | [`TEST-in.nic.lgd.usermanagement.modules.role.controller.RoleControllerTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.role.controller.RoleControllerTest.xml) |
| 19 | `in.nic.lgd.usermanagement.modules.role.service.impl.RoleServiceImplTest` | 11 | 0 | 0 | 0 | 0.931 | [`TEST-in.nic.lgd.usermanagement.modules.role.service.impl.RoleServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.role.service.impl.RoleServiceImplTest.xml) |
| 20 | `in.nic.lgd.usermanagement.modules.role.validator.CreateRoleValidatorTest` | 7 | 0 | 0 | 0 | 0.019 | [`TEST-in.nic.lgd.usermanagement.modules.role.validator.CreateRoleValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.role.validator.CreateRoleValidatorTest.xml) |
| 21 | `in.nic.lgd.usermanagement.modules.role.validator.UpdateRoleValidatorTest` | 7 | 0 | 0 | 0 | 0.013 | [`TEST-in.nic.lgd.usermanagement.modules.role.validator.UpdateRoleValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.role.validator.UpdateRoleValidatorTest.xml) |
| 22 | `in.nic.lgd.usermanagement.modules.user.controller.UserControllerTest` | 6 | 0 | 0 | 0 | 1.032 | [`TEST-in.nic.lgd.usermanagement.modules.user.controller.UserControllerTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.controller.UserControllerTest.xml) |
| 23 | `in.nic.lgd.usermanagement.modules.user.controller.UserRoleMappingControllerTest` | 7 | 0 | 0 | 0 | 0.470 | [`TEST-in.nic.lgd.usermanagement.modules.user.controller.UserRoleMappingControllerTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.controller.UserRoleMappingControllerTest.xml) |
| 24 | `in.nic.lgd.usermanagement.modules.user.repository.UserRepositoryTest` | 6 | 0 | 0 | 0 | 1.898 | [`TEST-in.nic.lgd.usermanagement.modules.user.repository.UserRepositoryTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.repository.UserRepositoryTest.xml) |
| 25 | `in.nic.lgd.usermanagement.modules.user.repository.UserRoleMappingRepositoryTest` | 6 | 0 | 0 | 0 | 0.333 | [`TEST-in.nic.lgd.usermanagement.modules.user.repository.UserRoleMappingRepositoryTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.repository.UserRoleMappingRepositoryTest.xml) |
| 26 | `in.nic.lgd.usermanagement.modules.user.service.impl.UserRoleMappingServiceImplTest` | 13 | 0 | 0 | 0 | 0.721 | [`TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserRoleMappingServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserRoleMappingServiceImplTest.xml) |
| 27 | `in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest` | 15 | 0 | 0 | 0 | 0.796 | [`TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest.xml) |
| 28 | `in.nic.lgd.usermanagement.modules.user.validator.CreateUserValidatorTest` | 9 | 0 | 0 | 0 | 0.026 | [`TEST-in.nic.lgd.usermanagement.modules.user.validator.CreateUserValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.validator.CreateUserValidatorTest.xml) |
| 29 | `in.nic.lgd.usermanagement.modules.user.validator.UpdateUserValidatorTest` | 8 | 0 | 0 | 0 | 0.022 | [`TEST-in.nic.lgd.usermanagement.modules.user.validator.UpdateUserValidatorTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.validator.UpdateUserValidatorTest.xml) |
| 30 | `in.nic.lgd.usermanagement.user.security.JwtAuthenticationFilterTest` | 4 | 0 | 0 | 0 | 0.041 | [`TEST-in.nic.lgd.usermanagement.user.security.JwtAuthenticationFilterTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.user.security.JwtAuthenticationFilterTest.xml) |
| 31 | `in.nic.lgd.usermanagement.user.security.JwtUtilTest` | 13 | 0 | 0 | 0 | 0.121 | [`TEST-in.nic.lgd.usermanagement.user.security.JwtUtilTest.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.user.security.JwtUtilTest.xml) |

---

## 4. Duplicate and Stale Report Analysis

1. **Non-Duplication Verification:**
   - Every one of the 397 individual `<testcase>` records was indexed using its fully qualified signature: `service_name::classname#method_name`.
   - Result: Exactly **397 unique test case keys** identified.
   - **Zero duplicates** were detected across all 50 XML report files.

2. **Stale Report Verification:**
   - All Surefire report timestamps correspond to the latest test executions.
   - Target directory timestamps match current test execution cycles.
   - **Zero stale or orphaned test reports** exist in the workspace.

