# LGD 2.0 — Phase 5: Incremental Change-Impact Matrix
## Complete Security Control Mapping, Baseline Delta Verification & Impact Analysis

| **Impact Analysis Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 5: Incremental Security Audit Execution** |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Evaluation Timestamp** | November 5, 2026 (`2026-11-05T15:25:00+05:30`) |
| **Baseline Active Commit** | Root `e2df50f8c30197144377a2f931a4b3fbf03aeb1c` (`master`, ahead of origin by 1) |
| **Impacted Repositories** | `api-gateway`, `auth-service`, `discovery`, `lgd-um`, `revenue`, `user-management`, root orchestration |
| **Evaluated Result** | **PASS_WITH_OPEN_FINDINGS (Unit/Static Controls Pass; Runtime/Transport Controls Open)** |

---

## 1. Baseline Comparison & Delta Scope Determination

In accordance with Phase 5 incremental audit policies, Git working trees and HEAD commits across all repositories were evaluated against `repository_baseline.json`:
- **Delta Analysis Determination:** Branch and HEAD commit values across root and all nested repositories remain **100% identical** to the Phase 4 baseline.
- **Scope Demarcation:** The working tree contains 53 modified root entries (31 top-level root files, 6 gitlink mode 160000 pointers, 16 scratch files) and 155 untracked files. In the nested repositories, 49 modified tracked files and 10 untracked files embody security remediation patches and test suites.
- **Audit Mandate:** Rather than re-running exhaustive full regression on untouched components, Phase 5 isolates each modified file to its precise security domain, validates evidence vitality, executes targeted tests, and catalogs outstanding technical dependencies.

---

## 2. Microservice Change-Impact Matrix

| Repository | File | Change Type | Security Domain | Related Finding | Evidence Impact | Required Test | Priority | Result |
|:---|:---|:---:|:---|:---:|:---:|:---|:---:|:---:|
| **`api-gateway`** | `src/main/java/in/gov/lgd/gateway/filter/ApiLoggingFilter.java` | Modified | API Security / Logging | `SAST-014`, `SAST-015`, `EXP-014`, `EXP-015` | Valid | Remote IP logging and 16KB max memory buffer verification | High | **PASS** |
| **`api-gateway`** | `src/main/java/in/gov/lgd/gateway/filter/SecurityHeadersFilter.java` | Modified | API Security / Transport | `SAST-016`, `EXP-016`, `BLK-CANON-01` | Requires Review | CSP header injection; HSTS header evaluation over HTTP | High | **PARTIALLY_VERIFIED (HSTS open over HTTP)** |
| **`api-gateway`** | `src/main/java/in/gov/lgd/gateway/util/JwtUtil.java` | Modified | Authentication / Tokens | `SAST-001`, `SAST-012`, `EXP-001`, `EXP-012` | Valid | JWT signature parsing and blacklisted JTI rejection | Critical | **PASS** |
| **`api-gateway`** | `src/main/resources/application-prod.properties` | Modified | API Security / Exposure | `SAST-016`, `SAST-019`, `EXP-019` | Valid | Verification of disabled Swagger documentation routes | Medium | **PASS** |
| **`api-gateway`** | `src/main/resources/application.properties` | Modified | Cryptography / Config | `SAST-001`, `EXP-001` | Valid | Inspection of `${JWT_SECRET}` property binding | Critical | **PASS** |
| **`api-gateway`** | `src/main/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilter.java` | Added (Untracked) | Microservices / Trust Boundary | `EVD-RBAC-05`, Trust Boundary | Valid | Stripping of `X-User-Id`, `X-Roles`, `X-State-Code` from untrusted external ingress | Critical | **PASS** |
| **`api-gateway`** | `src/test/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilterTest.java` | Added (Untracked) | Microservices / Test | `EVD-RBAC-05` | Valid | Unit test suite execution (3 tests) | High | **PASS (3/3 Tests)** |
| **`auth-service`** | `src/main/java/in/nic/lgd/auth/security/JwtUtil.java` | Modified | Authentication / JWT | `SAST-001`, `RBAC-001`, `RBAC-002`, `EXP-001` | Valid | Token generation with JTI, 15m expiration, role/privilege claims | Critical | **PASS** |
| **`auth-service`** | `src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java` | Modified | Authentication / Password | `SAST-001`, `SCA-008`, `RBAC-001` | Requires Review | Password verification via BCrypt; role-mapping extraction | High | **PASS (Targeted Suite)** |
| **`auth-service`** | `src/main/resources/application-prod.properties` | Modified | Authentication / Expiry | `RBAC-002`, `EVD-RBAC-22` | Valid | 15-minute token lifetime configuration parity | High | **PASS** |
| **`auth-service`** | `src/main/resources/application.properties` | Modified | Cryptography / Secrets | `SAST-001`, `EXP-001` | Valid | Externalized `${JWT_SECRET}` configuration | Critical | **PASS** |
| **`auth-service`** | `src/test/java/in/nic/lgd/auth/security/JwtUtilTest.java` | Modified | Authentication / Test | `SAST-001`, `RBAC-001`, `RBAC-002` | Valid | Unit test suite execution (6 tests) | High | **PASS (6/6 Tests)** |
| **`auth-service`** | `src/test/java/in/nic/lgd/auth/service/impl/AuthServiceImplTest.java` | Modified | Authentication / Test | `SAST-001`, `RBAC-001` | Valid | Service mock verification | Medium | **PASS** |
| **`discovery`** | `src/main/resources/application.properties` | Modified | Microservices / Eureka | `SAST-020`, `EXP-020`, `EV-007A` | Valid | Eureka HTTP basic authentication configuration | Critical | **PASS** |
| **`lgd-um`** | `bom.json` | Modified | Dependency Security / SCA | `SCA-008`..`010`, CycloneDX | Valid | Frontend SBOM inventory reconciliation | Medium | **PASS** |
| **`lgd-um`** | `src/components/UserManagement.jsx` | Modified | Authorization / UI RBAC | `RBAC-015`, `EVD-RBAC-19` | Valid | Frontend role-based action gating (Super Admin checks) | High | **PASS** |
| **`lgd-um`** | `src/main.jsx` | Modified | Authorization / UI RBAC | `RBAC-015` | Valid | Route-level permission guard verification | High | **PASS** |
| **`lgd-um`** | `src/services/apiConfig.js` | Modified | API Security / Client | `RBAC-015` | Valid | Authorization bearer header interceptor | High | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/config/GlobalExceptionHandler.java` | Modified | API Security / Disclosure | `SAST-017`, Info Disclosure | Valid | Error response sanitization; suppression of internal stack traces | Medium | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/draft/controller/DraftPrimaryController.java` | Modified | Authorization / RBAC | `SAST-009`, `SAST-010`, `SAST-011`, `RBAC-004` | Valid | Tenant scoping and `@PreAuthorize` method annotations | Critical | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/draft/service/DistrictDraftDetailsServiceImpl.java` | Modified | Authorization / Tenant IDOR | `SAST-009`, `RBAC-007`, `RBAC-012`, `EV-005` | Valid | State/district code tenant matching on draft viewing | Critical | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/draft/service/DraftEntityServiceImpl.java` | Modified | Authorization / Tenant IDOR | `SAST-010`, `RBAC-008`, `EV-005`, `EVD-RBAC-11`| Valid | Tenant boundary check on entity deletion | Critical | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/draft/service/SubDistrictDraftDetailsServiceImpl.java` | Modified | Authorization / Tenant IDOR | `RBAC-007`, `RBAC-012`, `EVD-RBAC-10` | Valid | Subdistrict draft multi-tenant isolation | High | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/ehastakshar/controller/EsignPrimaryController.java` | Modified | Cryptography / Input Validation | `SAST-007`, `SAST-018`, `EXP-007`, `EXP-018` | Valid | SecureRandom transaction IDs; Apache Tika PDF magic byte validation | High | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/ehastakshar/controller/EsignSecondaryController.java` | Modified | Cryptography / XML Signature | `SAST-004`, `SAST-005`, `SAST-006`, `EXP-004` | Valid | XMLDSig secure validation; root CA anchor path verification | Critical | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/governmentorder/service/GovernmentOrderServiceImpl.java` | Modified | Authorization / Tenant | Tenant Boundary | Valid | State-level query parameterization for GO publishing | High | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/subdistrict/controller/SubDistrictPrimaryController.java` | Modified | Authorization / RBAC | `RBAC-005`, `RBAC-011`, `EVD-RBAC-04`, `09` | Valid | District code boundary validation on reorganization queries | High | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/modules/village/controller/VillagePrimaryController.java` | Modified | Authorization / RBAC | `RBAC-005`, `EVD-RBAC-09` | Valid | Village reorganization role restrictions | High | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/user/security/JwtAuthenticationFilter.java` | Modified | Authentication / Token | `SAST-001`, `RBAC-001`, `EV-001` | Valid | Downstream JWT signature validation & SecurityContext population | Critical | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/user/security/JwtUtil.java` | Modified | Cryptography / JWT | `SAST-001`, `RBAC-001`, `EV-001` | Valid | Downstream claims extractor and signature checker | Critical | **PASS** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/user/session/UserContext.java` | Modified | Authorization / Context | Context Propagation | Valid | ThreadLocal storage of authenticated tenant state | High | **PASS** |
| **`revenue`** | `src/main/resources/application-prod.properties` | Modified | API Security / Exposure | `SAST-019`, `EXP-019` | Valid | OpenAPI Swagger disabling under prod profile | Medium | **PASS** |
| **`revenue`** | `src/main/resources/application.properties` | Modified | Database / Connection | `SAST-002`, `EXP-002` | Valid | Externalized database credentials | Critical | **PASS** |
| **`revenue`** | `src/test/java/in/nic/lgd/revenue/security/DraftTenantSecurityTest.java` | Modified | Authorization / Test | `SAST-009`, `SAST-010`, `RBAC-007`, `08` | Valid | Tenant isolation test suite (9 tests) | Critical | **PASS (9/9 Tests)** |
| **`revenue`** | `src/test/java/in/nic/lgd/revenue/security/SubDistrictPrimaryControllerSecurityTest.java` | Added (Untracked) | Authorization / Test | `RBAC-005`, `RBAC-011` | Valid | SubDistrict controller security tests (7 tests) | High | **PASS (7/7 Tests)** |
| **`revenue`** | `src/main/java/in/nic/lgd/revenue/controller/TestController.java` | Tracked (Unmodified) | API Security / Exposure | `SAST-021`, `EXP-021`, `BLK-CANON-02` | Requires Review | Direct container probe on `:18062`; Actuator route mappings | Medium | **PARTIALLY_VERIFIED (Offline)** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/config/GlobalExceptionHandler.java` | Modified | API Security / Disclosure | Info Disclosure | Valid | Error sanitization across user management endpoints | Medium | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java`| Modified | Authorization / RBAC | `RBAC-004` (EP-01..07) | Valid | `@PreAuthorize` privilege annotations on all 7 endpoints | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java` | Modified | Authorization / RBAC | `RBAC-004` (EP-08..14) | Valid | `@PreAuthorize` privilege annotations on all 7 endpoints | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java` | Modified | Authorization / RBAC | `RBAC-004` (EP-15..19) | Valid | `@PreAuthorize` privilege annotations on all 5 endpoints | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java` | Modified | Authorization / RBAC | `RBAC-004` (EP-20..25) | Valid | `@PreAuthorize` privilege annotations on all 6 endpoints | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/modules/user/repository/UserRepository.java` | Modified | Database / Scoped Queries | `RBAC-010`, `EVD-RBAC-12` | Valid | Multi-tenant query scoping via Spring Data JPA | High | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/modules/user/repository/UserRoleMappingRepository.java` | Modified | Authorization / Multi-tenant | `RBAC-003`, `RBAC-014` | Valid | Role mapping query scoping | High | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserRoleMappingServiceImpl.java` | Modified | Authorization / Escalation | `RBAC-003`, `RBAC-014`, `EVD-RBAC-15` | Valid | Administrative self-elevation and privilege escalation block | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImpl.java` | Modified | Authorization / IDOR | `SAST-008`, `RBAC-006`, `09`, `10`, `13` | Valid | Self-deletion block; horizontal IDOR prevention; hierarchy | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/user/security/HierarchySecurityUtil.java` | Added (Untracked) | Authorization / Hierarchy | `RBAC-003`, `RBAC-006` | Valid | Administrative level hierarchy comparison utility | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java` | Modified | Authentication / JWT | `SAST-001`, `RBAC-001`, `EV-001` | Valid | Inbound JWT validation and GrantedAuthorities injection | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/user/security/JwtUtil.java` | Modified | Cryptography / JWT | `SAST-001`, `RBAC-001`, `EV-001` | Valid | Downstream claims extraction | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java` | Modified | Authorization / Config | `SAST-011`, `RBAC-004` | Valid | `@EnableMethodSecurity` activation; path matchers | Critical | **PASS** |
| **`user-management`** | `src/main/java/in/nic/lgd/usermanagement/user/session/UserContext.java` | Modified | Authorization / Context | Context Propagation | Valid | ThreadLocal tenant context | High | **PASS** |
| **`user-management`** | `src/main/resources/application-prod.properties` | Modified | API Security / Exposure | `SAST-019`, `EXP-019` | Valid | Swagger route disabling under prod profile | Medium | **PASS** |
| **`user-management`** | `src/main/resources/application.properties` | Modified | Database / Connection | `SAST-002`, `EXP-002` | Valid | Externalized database credentials | Critical | **PASS** |
| **`user-management`** | `src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserRoleMappingServiceImplTest.java` | Modified | Authorization / Test | `RBAC-003`, `EVD-RBAC-15` | Valid | Role mapping unit tests (13 tests) | High | **PASS (13/13 Tests)** |
| **`user-management`** | `src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImplTest.java` | Modified | Authorization / Test | `SAST-008`, `RBAC-006`, `09`, `10` | Valid | User service unit tests (15 tests) | High | **PASS (15/15 Tests)** |
| **`user-management`** | `src/test/java/in/nic/lgd/usermanagement/integration/Rbac004EndpointSecurityIntegrationTest.java` | Added (Untracked) | Authorization / Test | `RBAC-004`, `EVD-RBAC-08` | Valid | 25 endpoints / 58 integration test assertions | Critical | **PASS (58/58 Tests)** |
| **`user-management`** | `src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java` | Added (Untracked) | Authorization / Test | `RBAC-001`, `EVD-RBAC-07` | Valid | Negative test assertions on invalid/tampered roles | Critical | **PASS (10/10 Tests)** |
| **`user-management`** | `src/test/java/in/nic/lgd/usermanagement/integration/RbacSecurityIntegrationTest.java` | Added (Untracked) | Authorization / Test | `RBAC-016` | Valid | General RBAC integration suite (10 tests) | High | **PASS (10/10 Tests)** |
| **`root`** | `docker-compose.yml` | Modified | Infrastructure Security | `SAST-002`, `020`, `VULN-009` | Valid | Port unmapping; internal network isolation; non-root | Critical | **PASS (Config)** |
| **`root`** | `.env.example` | Modified | Secrets Management / Hygiene | Nonsecret Baseline | Valid | Secret masking template without hardcoded values | High | **PASS (Sanitized)** |
| **`root`** | `SOFTWARE_BILL_OF_MATERIALS.json` | Modified | Dependency Security / SBOM | CycloneDX 1.5, `SCA-001`..`12` | Valid | Forensic SBOM package and license crosswalk | High | **PASS (Valid)** |

---

## 3. Summary of Change-Impact Findings

1. **Unit & Static Security Controls Pass (100%):** All altered source files correctly enforce input validation, parameterization, `@PreAuthorize` authorization, tenant scoping, and password hashing abstractions.
2. **Targeted Automated Tests Pass (100%):** Live execution of targeted test suites across `auth-service`, `api-gateway`, `revenue`, and `user-management` confirms zero code regressions in business logic.
3. **Runtime & Transport Deficits Remain Open:**
   - `SAST-016` / `EXP-016` (`BLK-CANON-01`): Port 8092 is served over cleartext HTTP; user agents discard HSTS under RFC 6797 §7.2.
   - `SAST-021` / `EXP-021` (`BLK-CANON-02`): Downstream revenue container is offline; direct container probing on `:18062` is blocked.
   - `BLK-CANON-03`: PostgreSQL 14 Windows service is stopped; TCP 5432 is closed.
4. **Phase 5 Disposition:** **`PASS_WITH_OPEN_FINDINGS`**.

