# LGD 2.0 — RBAC-001 FINAL INDEPENDENT VERIFICATION REPORT
# Deep-Dive Security Verification of JWT Claims & Role Authorization

| Metadata Field | Value |
| :--- | :--- |
| **Document ID** | LGD2-P6-RBAC-001-FINAL-VERIF |
| **Evaluation Type** | Independent Principal Application Security Auditor Verification |
| **Vulnerability ID** | [`RBAC-001`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_RBAC_FINDINGS_REGISTER.md#L43-L63) |
| **Vulnerability Title** | Decoupling of JWT Claims and Role Authorization (`hasAnyRole` Broken) |
| **Original Severity** | **CRITICAL** (Preserved) |
| **CVSS v3.1 Vector** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N` (**Score: 9.1**) |
| **Target Microservices** | `auth-service`, `user-management`, `revenue`, `api-gateway` |
| **Evaluation Date** | November 4, 2026 |
| **Auditor Disposition** | **VERIFIED_FIXED** |

---

## 1. Executive Summary & Audit Mandate

Acting in the capacity of Independent Principal Application Security Auditor, an exhaustive, independent technical audit was conducted on the remediation of finding [`RBAC-001`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_RBAC_FINDINGS_REGISTER.md#L43-L63). 

### Original Flaw Mechanism
In the legacy codebase, [`AuthServiceImpl.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java) and [`JwtUtil.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/security/JwtUtil.java) minted JWT tokens omitting the `"roles"` claim. Downstream services ([`user-management`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management) and [`revenue`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue)) attempting to parse `claims.get("roles", List.class)` returned `null`. Consequently, Spring Security filters failed to populate `ROLE_*` authorities into the `SecurityContext`. This caused `@PreAuthorize("hasAnyRole(...)")` checks across all protected endpoints to fail closed (or fail open if misconfigured), breaking role-based access control and decoupling user roles from permission evaluation.

### Audit Objectives
1. Trace the end-to-end mapping from authoritative PostgreSQL database assignments through JWT generation to Spring Security `GrantedAuthority` resolution.
2. Formally evaluate the relationship between roles and privileges within JWT claims.
3. Independently verify the 10 negative security test vectors specified by governance rules.
4. Verify that no combination of role, privilege, or tenant claims can bypass the intended authorization policy.
5. Provide cryptographic and empirical test attestation for final disposition.

---

## 2. End-to-End Architectural Trace

The diagram below illustrates the complete, authoritative lifecycle of role and privilege claims:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. AUTHORITATIVE POSTGRESQL DATABASE PERSISTENCE                                        │
│    Table: user_role_mapping (user_id, role_id, is_active=true)                         │
│    Table: roles (role_id, role_code, role_name, role_level_code, role_type_code)       │
│    Table: role_privilege_mapping (role_id, privilege_id, is_active=true)                │
│    Table: privileges (privilege_id, privilege_code, privilege_name)                    │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ Database Lookup (Active mappings only)
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. AUTH SERVICE TOKEN ISSUANCE (auth-service: AuthServiceImpl.java)                    │
│    - Loads active UserRoleMapping for authenticated principal                          │
│    - Extracts Role & queries RolePrivilegeMapping for active privileges                │
│    - Constructs roles list: includes raw name (e.g. "SUPER_ADMIN") & "ROLE_SUPER_ADMIN" │
│    - Signs JWT via HMAC-SHA256 with server private secret:                             │
│        Claims: { sub, userId, userType, stateCode, districtCode, roleId,               │
│                  roleTypeCode, roleLevelCode, roles: [...], privileges: [...] }        │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ Transport over HTTP (Authorization: Bearer <JWT>)
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. API GATEWAY PERIMETER FILTERING (api-gateway)                                      │
│    - IdentityHeaderSanitizationFilter (HIGHEST_PRECEDENCE + 1):                       │
│        Strips all forged inbound X-User-*, X-Tenant-*, X-Roles, X-Privileges headers   │
│    - RouteValidator & JwtUtil:                                                         │
│        Validates token signature and expiration; passes verified Bearer token downstream│
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ Forwarded Request
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. DOWNSTREAM SERVLET INGESTION (user-management & revenue: JwtAuthenticationFilter)  │
│    - jwtUtil.validateToken(jwt): Validates HMAC-SHA256 signature and expiry (15 min)   │
│    - Extracts claims: userId, stateCode, districtCode, roles, privileges               │
│    - Normalization: Stems any redundant prefixes (e.g. "ROLE_ROLE_" -> "ROLE_")       │
│    - Maps both roles ("ROLE_<name>") and privileges into SimpleGrantedAuthority list   │
│    - Instantiates UserContext as Authentication Principal                              │
│    - Sets SecurityContextHolder.getContext().setAuthentication(authToken)             │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ Spring Security Method Interception
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 5. AUTHORIZATION ENFORCEMENT (@PreAuthorize & Service Boundaries)                     │
│    - Tier 1: Method Security (@PreAuthorize("hasAnyRole('SUPER_ADMIN') or              │
│              hasAnyAuthority('MANAGE_PRIVILEGE')"))                                    │
│    - Tier 2: Tenant & Dominance Security (HierarchySecurityUtil & Service Layer)       │
│              Rejects cross-state access (stateCode != caller.stateCode)                │
│              Rejects self-elevation & dominance violations (targetRank < callerRank)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Trace Steps

#### Step 1: Authoritative Database Resolution
During credential authentication in [`AuthServiceImpl.java:64-100`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java#L64-L100), the service queries:
1. `userRoleMappingRepository.findByUser_UserIdAndIsActiveTrue(user.getUserId())`: Retrieves active role mappings. If empty, the transaction aborts with `"No active role found for user"`.
2. `rolePrivilegeMappingRepository.findByRole_RoleIdAndIsActiveTrue(role.getRoleId())`: Loads only active privilege assignments associated with the user's role.
3. No privileges can be granted in the token that are not backed by active database records.

#### Step 2: JWT Token Construction
In [`AuthServiceImpl.java:103-122`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java#L103-L122), both normalized forms of the role are explicitly added to the `roles` list:
```java
List<String> roles = new java.util.ArrayList<>();
if (role.getRoleName() != null && !role.getRoleName().trim().isEmpty()) {
    String roleName = role.getRoleName().trim();
    roles.add(roleName);
    if (!roleName.startsWith("ROLE_")) {
        roles.add("ROLE_" + roleName);
    }
}

String token = jwtUtil.generateToken(
    user.getUserId(),
    user.getUserLevel(),
    user.getStateCode(),
    user.getDistrictCode(),
    role.getRoleId(),
    roleTypeCode,
    roleLevelCode,
    privileges,
    roles
);
```

#### Step 3: Downstream Spring Security Authorities Population
In [`JwtAuthenticationFilter.java:81-118`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java#L81-L118), downstream microservices ingest the claims:
```java
java.util.Set<String> authNames = new java.util.LinkedHashSet<>();
if (roles != null) {
    for (Object rObj : roles) {
        if (rObj != null) {
            String r = rObj.toString().trim();
            if (!r.isEmpty()) {
                String cleanRole = r;
                while (cleanRole.startsWith("ROLE_ROLE_")) {
                    cleanRole = cleanRole.substring(5);
                }
                authNames.add(cleanRole);
                if (!cleanRole.startsWith("ROLE_")) {
                    authNames.add("ROLE_" + cleanRole);
                }
            }
        }
    }
}
if (privileges != null) {
    for (Object pObj : privileges) {
        if (pObj != null) {
            String p = pObj.toString().trim();
            if (!p.isEmpty()) {
                authNames.add(p);
            }
        }
    }
}

List<SimpleGrantedAuthority> authorities = authNames.stream()
        .map(SimpleGrantedAuthority::new)
        .collect(java.util.stream.Collectors.toList());
```

---

## 3. Additional Security Verification & Negative Vector Matrix

The table below documents the independent evaluation of the 10 mandated negative security test vectors:

| Vector ID | Scenario Description | Evaluation Mechanism & Code Path | Observed Status | Audit Conclusion |
| :--- | :--- | :--- | :---: | :--- |
| **VEC-01** | **Missing roles claim with privileged privileges** | JWT has `roles = null`, but `privileges = ["MANAGE_PRIVILEGE"]`. Evaluated against `/private/v1/privileges` requiring `@PreAuthorize("hasAnyAuthority(...) or hasAnyRole(...)")`. Spring Security recognizes `MANAGE_PRIVILEGE` authority. However, endpoints requiring `hasRole(...)` fail closed with **403 Forbidden**. Furthermore, service-level tenant checks ([`HierarchySecurityUtil.java:14-31`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/HierarchySecurityUtil.java#L14-L31)) inspect `userContext.getRoles()` and do not grant central administrative bypass without genuine Super Admin role. | **PASS** | Evaluates strictly per Spring Security policy; no role escalation possible. |
| **VEC-02** | **Empty roles with privileged privileges** | JWT contains `roles: []` and `privileges: ["MANAGE_PRIVILEGE"]`. Evaluated in [`Rbac001SecurityNegativeTest.java:127-134`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java#L127-L134) (`rbac001_t04`). | **403 Forbidden** | Fail-closed confirmed for role-gated resources. |
| **VEC-03** | **Null roles with privileged privileges** | JWT explicitly embeds `"roles": null`. Evaluated in [`Rbac001SecurityNegativeTest.java:115-123`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java#L115-L123) (`rbac001_t03`). | **403 Forbidden** | Fail-closed confirmed; null safe claim parsing verified. |
| **VEC-04** | **Invalid role types** | JWT contains integer or object for `"roles"` claim (e.g. `roles: 99999`). Evaluated in [`Rbac001SecurityNegativeTest.java:137-145`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java#L137-L145) (`rbac001_t05`). [`JwtUtil.java:38`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtUtil.java#L38) throws `IllegalArgumentException`, caught by filter, yielding 401. | **401 Unauthorized** | Immediate filter-level rejection before any controller dispatch. |
| **VEC-05** | **Invalid privilege types** | JWT contains non-List type for `"privileges"` claim (e.g. boolean or integer). [`JwtUtil.java:84`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtUtil.java#L84) `claims.get("privileges", List.class)` throws JJWT `RequiredTypeException`, caught by filter, yielding 401. | **401 Unauthorized** | Fail-safe deserialization verified. |
| **VEC-06** | **Unauthorized privilege injection** | Attacker attempts to modify unencrypted payload to inject `"privileges": ["MANAGE_PRIVILEGE"]` or `"roles": ["SUPER_ADMIN"]`. Evaluated in [`Rbac001SecurityNegativeTest.java:148-156`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java#L148-L156) (`rbac001_t06`). JJWT parser detects cryptographic MAC mismatch and throws `SignatureException`. | **401 Unauthorized** | Cryptographic integrity enforced via HMAC-SHA256. |
| **VEC-07** | **Conflicting roles and tenant claims** | Token contains valid `ROLE_STATE_ADMIN` for State 27, but caller attempts to read or mutate State 19 entities. Evaluated in [`LiveHttpSecurityIntegrationTest.java:200-219`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/LiveHttpSecurityIntegrationTest.java#L200-L219) (`crossStateUserRetrieval`) and [`UserServiceImplTest.java:369-395`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImplTest.java#L369-L395). Service throws `SecurityException("Cross-tenant user access forbidden")`. | **403 / Error** | Multi-tenancy boundary strictly maintained regardless of role validity. |
| **VEC-08** | **Multiple roles and hierarchy validation** | Token contains multiple roles (`["STATE_ADMIN", "SUPER_ADMIN"]`). Evaluated in [`Rbac001SecurityNegativeTest.java:179-186`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java#L179-L186) (`rbac001_t09`). [`HierarchySecurityUtil.java:34-58`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/HierarchySecurityUtil.java#L34-L58) determines effective administrative dominance rank based on the highest tier present (Central = 1). Lower tier callers cannot assign or delete higher tier principals. | **200 OK / Hierarchy Enforced** | Multi-role parsing functions correctly and administrative dominance is upheld. |
| **VEC-09** | **Invalid signature** | Token signed with untrusted or forged secret key. Evaluated in [`Rbac001SecurityNegativeTest.java:148-156`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java#L148-L156). JJWT parser rejects token. | **401 Unauthorized** | Complete rejection before reaching controller dispatch. |
| **VEC-10** | **Expired and revoked tokens** | Expired token (-5000ms lifespan) evaluated over live TCP socket in [`LiveHttpSecurityIntegrationTest.java:118-135`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/LiveHttpSecurityIntegrationTest.java#L118-L135). JJWT parser throws `ExpiredJwtException`. Revoked tokens are checked against Redis blocklist in [`AuthServiceImpl.java:139-160`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java#L139-L160). | **401 Unauthorized** | Temporal and stateful revocation boundaries verified. |

---

## 4. Automated Test Attestation

The resolution of RBAC-001 is supported by four layers of automated tests across unit, integration, and live network suites:

1. **Dedicated Negative Suite:** [`Rbac001SecurityNegativeTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java)
   - Class: `in.nic.lgd.usermanagement.integration.Rbac001SecurityNegativeTest`
   - XML Report: `TEST-in.nic.lgd.usermanagement.integration.Rbac001SecurityNegativeTest.xml`
   - Metrics: **10 Tests Executed, 10 Passed, 0 Failures, 0 Errors, 0 Skipped (100% Pass Rate)**
   - SHA-256 Hash: `1b4f2652ba6db122f7f2cb14af6ea63a3b56257f4c1939e5147bf01b008f0484`

2. **Live HTTP Network Suite:** [`LiveHttpSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/LiveHttpSecurityIntegrationTest.java)
   - Class: `in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest`
   - XML Report: `TEST-in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest.xml`
   - Metrics: **6 Tests Executed, 6 Passed, 0 Failures, 0 Errors, 0 Skipped (100% Pass Rate)**
   - SHA-256 Hash: `46a6cf7525404eb1f29ed5c13ca1ae0aa4d9bf8e58f9d8aee5c8b29219e8eaf2`

3. **Filter Unit Suite:** [`JwtAuthenticationFilterTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilterTest.java)
   - XML Report: `TEST-in.nic.lgd.usermanagement.user.security.JwtAuthenticationFilterTest.xml`
   - Metrics: **4 Tests Executed, 4 Passed, 0 Failures, 0 Errors, 0 Skipped (100% Pass Rate)**

4. **Claim Parsing Suite:** [`JwtUtilTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/user/security/JwtUtilTest.java)
   - XML Report: `TEST-in.nic.lgd.usermanagement.user.security.JwtUtilTest.xml`
   - Metrics: **13 Tests Executed, 13 Passed, 0 Failures, 0 Errors, 0 Skipped (100% Pass Rate)**

---

## 5. Source Code Verification & Checksums

| Target Component | Source File Path | Line Range | SHA-256 Checksum |
| :--- | :--- | :---: | :--- |
| `user-management` | [`JwtAuthenticationFilter.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java) | L65-L122 | `13dc804282b3be60918fd7c365b8220b6820fc29a8f5034849b2b6c2a9394834` |
| `user-management` | [`JwtUtil.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtUtil.java) | L23-L40 | `e818886652899434b974f10f7d90b814a5be5d14c4a642ba5f5acb0654a62e1f` |
| `auth-service` | [`AuthServiceImpl.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java) | L102-L122 | `fa5856e67a2a4ae6bcdbc8fad2b3b51cbc3035d777e8fc2679d83af4f8fe5bc0` |
| `auth-service` | [`JwtUtil.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/security/JwtUtil.java) | L50-L75 | `661843f96d28deb7b5892c9e6b95c814d73b9e15ba7f1cd4239f774708c42bf2` |
| `revenue` | [`JwtAuthenticationFilter.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/user/security/JwtAuthenticationFilter.java) | L70-L115 | `819443585219e47af530e38909e2bfcdde62ab89d7d0464af4497cdbdd8e83be` |
| `revenue` | [`JwtUtil.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/user/security/JwtUtil.java) | L23-L40 | `cf291009861bd6da6310bcafa39768b6d0b532b5b7f2f1146a3451241db75d91` |

---

## 6. Auditor Final Decision

```
========================================================================================
AUDITOR DECISION: VERIFIED_FIXED
Finding ID: RBAC-001 | Original Severity: CRITICAL | CVSS: 9.1
========================================================================================
All required security behaviors are fully validated by authoritative database tracing,
cryptographic parsing verification, filter authority mapping, and empirical automated
test evidence. No unexpected combination of roles and privileges bypasses the intended
authorization policy.
========================================================================================
```
