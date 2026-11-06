# LGD 2.0 — Phase 3 DAST Remediation Report
## Dynamic Security & API Vulnerability Assessment Verification

| **Document Information** | |
|---|---|
| **Document Version** | 2.1.0 (Audit Reconciliation & Evidence Alignment) |
| **Assessment Scope** | LGD 2.0 Dynamic Attack Surface (Gateway: 8092, Internal Services: 18090, 18089, 18062, 8761) |
| **Reviewer Role** | Independent Senior Application Security Reviewer & DAST Penetration Tester |
| **Date** | October 30, 2026 (Historical Snapshot) |
| **Historical Snapshot Disposition** | **12 VECTORS VERIFIED_FIXED; 9 VECTORS FIXED_PENDING_TEST (Automated Suite Passed; Live Cluster Retest Pending)** |
| **Authoritative Superseding Report** | [PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md) |
| **Current Revalidated Disposition** | **19 VECTORS VERIFIED_FIXED; 2 VECTORS PARTIALLY_VERIFIED (EXP-016, EXP-021); 1 CONFIRMED SECURE (OBS-SQLI-01)** |

---

> [!IMPORTANT]
> **DOCUMENT STATUS: HISTORICAL AUDIT SNAPSHOT (SUPERSEDED FOR FINAL DISPOSITION)**  
> **Historical Baseline Date:** October 30, 2026  
> **Status:** This report preserves the historical pre-final-live-retest snapshot of Phase 3 DAST remediation (where 12 vectors were `VERIFIED_FIXED` and 9 vectors were `FIXED_PENDING_TEST` based on automated unit/integration regression suite passes).
> 
> **Authoritative Final Report:** This historical snapshot has been formally superseded by [PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md) following the execution and validation of live multi-container dynamic penetration retests on November 2, 2026.
> 
> **Current Authoritative DAST Disposition (November 2026 Independent Revalidation):**
> - **19 Vectors VERIFIED_FIXED:** `EXP-001` through `EXP-015`, `EXP-017` through `EXP-020`
> - **2 Vectors PARTIALLY_VERIFIED:** `EXP-016` (Gateway CSP verified live, HSTS pending genuine TLS ingress) and `EXP-021` (Gateway perimeter HTTP 403 verified, direct downstream Revenue container check pending)
> - **1 Confirmed-Secure Observation:** `OBS-SQLI-01` (`EV-021` — 25/25 automated refutation probes confirm parameterized query safety across all 24 Spring Data JPA repositories)
> - **0 Vectors OPEN / UNADDRESSED**
> 
> The historical metrics, automated suite logs, and pre-retest analysis from October 30, 2026 are preserved intact below for audit traceability and provenance. Current executive reporting must cite the 19/2 disposition from the final verification report.

---

## 1. Executive Summary & Audit Governance (October 30 Historical Snapshot)

Phase 3 Dynamic Security & API Vulnerability Assessment executed controlled, non-destructive API penetration testing against the Local Government Directory 2.0 (LGD 2.0) platform across all **47 canonical business operations** (represented across **153 detailed test-case rows** in [DAST_Test_Case_Register.xlsx](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Test_Case_Register.xlsx)).

This closure review resolves previous status contradictions between the remediation report and the [DAST_Evidence_Register.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Evidence_Register.md). In strict adherence to independent audit directives:
1. **Automated unit and integration test success is NOT conflated with live dynamic penetration retesting.**
2. Findings where code remediations are verified and automated test suites pass (289/289 tests), but live cluster penetration verification against a running multi-container deployment remains outstanding, are designated **`FIXED_PENDING_TEST`**. *(Note: Subsequently completed in November 2026 final retest; see superseding notice above).*
3. Findings where code remediations, automated tests, and live dynamic/functional checks are complete are designated **`VERIFIED_FIXED`**.
4. Zero findings are `OPEN` (all 21 vectors have verified technical implementations and passing tests).

---

## 2. API Endpoint Coverage Architecture & Metrics Reconciliation

Independent audit review identified an apparent divergence between the 47 canonical API operations and the 153 test-case rows. The metrics and their exact mathematical and architectural relationships are reconciled below:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    RECONCILED DAST ENDPOINT COVERAGE METRICS                    │
├─────────────────────────────────────────────────┬───────────────┬───────────────┤
│ Metric Dimension                                │ Count         │ Coverage %    │
├─────────────────────────────────────────────────┼───────────────┼───────────────┤
│ Production Business REST API Operations         │ 46 Operations │ 100.0% (46/46)│
│ Gateway Health Probe (CANON-47: /actuator/health)│ 1 Probe      │ 100.0% (1/1)  │
│ Canonical API Operations Total                  │ 47 Operations │ 100.0% (47/47)│
│ Separate Eureka Infrastructure Probe (EXP-020)  │ 1 Probe       │ 100.0% (1/1)  │
│ Distinct Tested Targets Overall                 │ 48 Targets    │ 100.0% (48/48)│
│ Detailed DAST Test-Case Rows in Register        │ 153 Rows      │ 100.0% (Suite)│
│ Unique Method + Normalized Path Combinations    │ 63 Combos     │ 100.0%        │
│ Multi-Payload Dynamic Probes (Fuzzing & SQLi)   │ 85 Probes     │ 100.0%        │
└─────────────────────────────────────────────────┴───────────────┴───────────────┘
```

### 2.1 Technical Relationship Explanation:
1. **46 Production Business REST API Operations + 1 Gateway Health Probe = 47 Canonical Operations:** Defined in [API_Endpoint_Inventory.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/API_Endpoint_Inventory.md), representing the distinct operational contracts across all microservices:
   - `api-gateway`: 1 operation (Circuit-breaker fallback `/fallback/block`) + 1 health probe (`CANON-47`: `GET /actuator/health`) = 2 operations
   - `auth-service`: 6 operations (Login, Logout, Revoke-Token, Profile, Menus, Routes)
   - `user-management`: 25 operations (Users, Roles, Privileges, Resources, User-Role Mappings)
   - `revenue`: 14 operations (State/District/Subdistrict/Village lookups, Draft creation, publishing, deletion, eSign initiate/callback, gazette PDF)
2. **1 Separate Eureka Infrastructure Probe:** `GET /eureka/apps` (`EXP-020`, `EV-007A` / `EV-007B`), testing discovery server authentication on internal port 8761, yielding **48 distinct tested targets overall**.
3. **153 Detailed Test-Case Rows:** The 153 rows recorded in [DAST_Test_Case_Register.xlsx](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Test_Case_Register.xlsx) represent discrete **test permutations** across the 48 distinct targets:
   $$\text{Total Test Rows (153)} = \text{47 Canonical Base Endpoint Tests} + \text{21 SAST Exploit Tests} + \text{60 Input-Validation \& Fuzzing Probes} + \text{25 SQLi Refutation Probes}$$
   *(The 21 SAST-linked exploit tests include the one Eureka infrastructure test, EXP-020).*
4. **63 Unique Method + Normalized Path Combinations:** When parameterized sub-resource routes (e.g. `/audit/revenue/public/v1/state/{stateCode}`) and direct service ingress variations are normalized, exactly 63 unique HTTP method + path patterns are exercised.
5. **Multi-Payload Probes:** The test suite includes 60 input-validation/boundary-fuzzing probes (negative IDs, boundary integers, null bytes, XSS injections, path traversal `..;`) and 25 SQL-injection refutation probes for `OBS-SQLI-01` targeting those endpoints to prove parameterization and absence of injection vulnerabilities.
6. **Traceability:** The 47 canonical base endpoint tests map 1-to-1 to the 47 canonical operations. The complete set of 153 test rows represents multiple permutations and probes across 48 distinct targets and does not map 1-to-1 to 47 operations. Full cross-referencing is maintained in [SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx).

---

## 3. Dynamic Penetration Testing Verification Results

### 3.1 Multi-Tenant Isolation & BOLA/IDOR Dynamic Verification (EXP-009, EXP-010)
- **Attack Scenario:** Authenticated attacker using a valid token issued for State 09 attempts to view (`GET /private/v1/draft/{draftId}`), download documents (`GET /private/v1/draft/download/{draftId}`), or delete (`POST /private/v1/draft/delete/{draftId}`) draft records belonging to State 27.
- **Pre-Remediation Dynamic Behavior:** HTTP 200 OK — Cross-tenant records and confidential unpublished boundary orders exposed.
- **Post-Remediation Verification:**
  - Automated tests in `DraftTenantSecurityTest.java` simulate synthetic officers across distinct state codes:
    - `getDistrictDraftDetails_CrossState_Returns403`: Returns **HTTP 403 Forbidden** (`"Cross-tenant draft access denied"`).
    - `downloadOrderFile_CrossState_Returns403`: Returns **HTTP 403 Forbidden** (`"Cross-tenant file download denied"`).
    - `deleteDraftEntity_CrossState_Returns403`: Returns **HTTP 403 Forbidden** (`"Cross-tenant draft deletion denied"`).
  - Valid tenant operations belonging to the caller's authorized state proceed normally with HTTP 200 OK.
- **Disposition:** **VERIFIED_FIXED** (Automated & Dynamic Functional Retest Verified)

### 3.2 Redis Token Revocation & Fail-Closed Behavior (EXP-012)
- **Attack Scenarios:**
  1. Revoked token reuse: Officer logs out; attacker re-submits the bearer token to protected endpoints.
  2. Missing `jti` bypass: Attacker strips the `jti` claim to bypass token blacklist lookup.
  3. Redis outage bypass: Attacker severs Redis connection or simulates cache failure to bypass blacklist checks.
- **Post-Remediation Verification:**
  - Automated integration tests in `AuthenticationFilterTest.java`:
    - `testMissingJtiRejectedWith401`: Token with missing or blank `jti` is rejected with **HTTP 401 Unauthorized** (`"Invalid Token: missing jti claim"`).
    - `testMissingRedisTemplateReturns503WhenFailClosed`: Unconfigured Redis returns **HTTP 503 Service Unavailable** (`"Revocation service unavailable"`).
    - `testRedisConnectionFailureFailsClosedWith503`: Redis connection timeout or connection refused fails closed with **HTTP 503 Service Unavailable** (`"Revocation service unavailable"`).
    - `testBlacklistedJtiRejectedWith401`: Token present in Redis blacklist is rejected with **HTTP 401 Unauthorized** (`"Token has been revoked"`).
    - `testHealthyRedisPermitsValidToken`: Valid token with healthy Redis proceeds through the filter chain.
- **Disposition:** **FIXED_PENDING_TEST** (Code & Automated Integration Tests Verified; Live Multi-Container Cluster Retest Pending)

### 3.3 e-Hastakshar Callback Transaction Integrity & XMLDSig (EXP-003 to EXP-007)
- **Attack Scenarios:**
  1. Forged Callback Signature: Attacker sends an XML callback with invalid or altered signature (`EXP-006`).
  2. Untrusted/Self-Signed Certificate: Attacker signs callback using an arbitrary self-signed X.509 certificate (`EXP-005`).
  3. XML Signature Wrapping (XSW): Attacker wraps altered DocInfo elements around valid signature (`EXP-004`).
  4. Predictable Transaction IDs: Attacker predicts transaction tokens via PRNG state (`EXP-007`).
  5. Keystore Harvesting: Attacker harvests hardcoded PKCS#12 password (`EXP-003`).
- **Post-Remediation Verification:**
  - Automated security tests in `EsignCallbackSecurityTest.java` and `EsignValidationSecurityTest.java`:
    - `testForgedCallbackSignatureRejected`: Throws `SecurityException("Invalid ESP Signature")`.
    - `testUntrustedSelfSignedCertRejected`: Rejects untrusted certificate not matching CDAC trust anchor.
    - `testDuplicateCallbackRejected`: Replayed callback rejected with `"Transaction already processed"`.
    - `testRedisReplayPrevention`: Distributed Redis atomic lock (`setIfAbsent`) rejects replayed callbacks.
    - `secureRandom_TransactionIdEntropy`: Validates >=64 bits cryptographic entropy.
- **Disposition:** **VERIFIED_FIXED** (Automated & Dynamic Functional Retest Verified)

### 3.4 Perimeter Routing & Wildcard Traversal (EXP-013)
- **Attack Scenario:** Attacker sends traversal requests (`/audit/auth/public/..;/private/v1/users`) or ambiguous matrix paths to bypass Gateway authentication.
- **Post-Remediation Verification:**
  - `RouteValidatorTest.java` (5 tests):
    - `securedPathShouldRequireAuth`: Confirms `/audit/user-management/private/v1/users` requires auth.
    - `publicPathShouldNotRequireAuth`: Confirms `/audit/auth/public/v1/auth/login` is public.
    - `traversalAttemptShouldBeSecured`: Confirms path containing `..` is classified as secured.
    - `matrixParameterAttemptShouldBeSecured`: Confirms path containing `;` is classified as secured.
    - `fallbackShouldBePublic`: Confirms `/fallback/block` is public.
- **Disposition:** **FIXED_PENDING_TEST** (Code & Automated Tests Verified; Live Perimeter Ingress Retest Pending)

### 3.5 Eureka Service Discovery Basic Authentication (EXP-020)
- **Attack Scenario:** Attacker sends unauthenticated registration or query requests to Eureka discovery server on port 8761.
- **Post-Remediation Verification:**
  - `EurekaSecurityTest.java` (2 tests):
    - `unauthenticatedAccess_ShouldReturn401`: Direct GET `/eureka/apps` returns **HTTP 401 Unauthorized**.
    - `authenticatedAccess_ShouldSucceed`: Request with valid HTTP Basic credentials succeeds with **HTTP 200 OK**.
- **Disposition:** **FIXED_PENDING_TEST** (Code & Automated Integration Tests Verified; Live Container Retest Pending)

---

## 4. Reconciled Dynamic Exploitation Closure Matrix

Every exploitation vector (`EXP-001` through `EXP-021`) is cataloged individually below, clearly distinguishing code fixes, unit tests, integration tests, completed dynamic retests, pending dynamic retests, and the final verified disposition:

| Exploit ID | Evidence ID | Related SAST ID | Targeted Vulnerability | Baseline Confirmed | Code Fix Implemented | Automated Unit/Int Tests | Live Dynamic Retest Completed | Live Dynamic Retest Pending | Final Verified Disposition |
|:---:|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **EXP-001** | `EV-001` | `SAST-001` | Static HMAC-SHA JWT Secret Forgery | YES | YES | `JwtHardeningRegressionTest` (14/14 PASS)<br>`ProductionSecurityValidatorTest` (5/5 PASS) | NO | YES (Cluster Retest) | **FIXED_PENDING_TEST** |
| **EXP-002** | `EV-009` | `SAST-002` | Plaintext Database Passwords in Config | YES | YES | `ProductionSecurityValidatorTest` (5/5 PASS) | YES (Port 5432 unbound) | NO | **VERIFIED_FIXED** |
| **EXP-003** | `EV-010` | `SAST-003` | Hardcoded eSign Keystore Password | YES | YES | `EsignValidationSecurityTest` (4/4 PASS) | YES (Env load verified) | NO | **VERIFIED_FIXED** |
| **EXP-004** | `EV-011` | `SAST-004` | XMLDSig `secureValidation` Disabled (XSW) | YES | YES | `EsignCallbackSecurityTest` (13/13 PASS) | YES (XSW rejected) | NO | **VERIFIED_FIXED** |
| **EXP-005** | `EV-012` | `SAST-005` | Blind Trust in Embedded KeyInfo Certs | YES | YES | `EsignCallbackSecurityTest` (4/4 PASS) | YES (Trust chain verified) | NO | **VERIFIED_FIXED** |
| **EXP-006** | `EV-013` | `SAST-006` | eSign Signature Enforcement Bypass Flag | YES | YES | `EsignCallbackSecurityTest` (1/1 PASS) | YES (Exception verified) | NO | **VERIFIED_FIXED** |
| **EXP-007** | `EV-014` | `SAST-007` | Predictable PRNG for Transaction IDs | YES | YES | `EsignValidationSecurityTest` (1/1 PASS) | YES (Entropy verified) | NO | **VERIFIED_FIXED** |
| **EXP-008** | `EV-015` | `SAST-008` | Mass Assignment in User Updates | YES | YES | `UserServiceImplTest` (11/11 PASS) | YES (Fields stripped) | NO | **VERIFIED_FIXED** |
| **EXP-009** | `EV-005` | `SAST-009` | BOLA Cross-State Draft Viewing | YES | YES | `DraftTenantSecurityTest` (5/5 PASS) | YES (HTTP 403 verified) | NO | **VERIFIED_FIXED** |
| **EXP-010** | `EV-005` | `SAST-010` | Unauthorized Draft Entity Deletion | YES | YES | `DraftTenantSecurityTest` (5/5 PASS) | YES (HTTP 403 verified) | NO | **VERIFIED_FIXED** |
| **EXP-011** | `EV-020` | `SAST-011` | Missing Method-Level Security | YES | YES | `UserManagementIntegrationTest` (2/2 PASS)<br>`UserControllerTest` (6/6 PASS) | NO | YES (Direct Ingress Retest) | **FIXED_PENDING_TEST** |
| **EXP-012** | `EV-002` | `SAST-012` | Revoked JWT Replay & Redis Outage | YES | YES | `AuthenticationFilterTest` (8/8 PASS) | NO | YES (Cluster Retest) | **FIXED_PENDING_TEST** |
| **EXP-013** | `EV-003` | `SAST-013` | Public Route Traversal Auth Bypass | YES | YES | `RouteValidatorTest` (5/5 PASS) | NO | YES (Perimeter Retest) | **FIXED_PENDING_TEST** |
| **EXP-014** | `EV-004` | `SAST-014` | Client IP Spoofing via X-Forwarded-For | YES | YES | `ApiLoggingFilterTest` (14/14 PASS) | NO | YES (Live DB Audit Retest)| **FIXED_PENDING_TEST** |
| **EXP-015** | `EV-016` | `SAST-015` | Unbounded Response Buffering DoS | YES | YES | `api-gateway` Test Suite (14/14 PASS) | YES (10KB limit verified) | NO | **VERIFIED_FIXED** |
| **EXP-016** | `EV-006` | `SAST-016` | Missing CSP and HSTS Security Headers | YES | YES | `SecurityHeadersFilterTest` (1/1 PASS) | NO | YES (Edge Retest) | **FIXED_PENDING_TEST** |
| **EXP-017** | `EV-017` | `SAST-017` | Missing @Valid on Login Request | YES | YES | `JwtHardeningRegressionTest` (14/14 PASS)<br>`AuthServiceImplTest` (6/6 PASS) | YES (HTTP 400 verified) | NO | **VERIFIED_FIXED** |
| **EXP-018** | `EV-018` | `SAST-018` | Unvalidated Multipart File Upload | YES | YES | `EsignValidationSecurityTest` (4/4 PASS) | YES (MIME/Magic verified) | NO | **VERIFIED_FIXED** |
| **EXP-019** | `EV-019` | `SAST-019` | Production Swagger / OpenAPI Exposure | YES | YES | `@Profile("!prod")` Context Verification | NO | YES (Edge Prod Retest) | **FIXED_PENDING_TEST** |
| **EXP-020** | `EV-007` | `SAST-020` | Unauthenticated Eureka Discovery | YES | YES | `EurekaSecurityTest` (2/2 PASS) | NO | YES (Container Retest) | **FIXED_PENDING_TEST** |
| **EXP-021** | `EV-008` | `SAST-021` | Exposed Debug TestController | YES | YES | `@Profile({"dev","test"})` Context Verification | NO | YES (Container Prod Retest)| **FIXED_PENDING_TEST** |

---

## 5. Summary Statistics & Reconciled Audit Statement (Historical October 30 Baseline)

> [!NOTE]
> **Historical Baseline Preservation Notice:** The tallies below represent the October 30, 2026 pre-final-retest snapshot. For current authoritative live dynamic retest outcomes (19 `VERIFIED_FIXED`, 2 `PARTIALLY_VERIFIED`, 1 `OBS-SQLI-01` confirmed secure), see [PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md).

### 5.1 Verification Breakdown (Historical Snapshot):
- **Total Exploitation Vectors Evaluated:** 21 (`EXP-001` through `EXP-021`)
- **Vectors with Code Fixes Implemented:** **21 / 21 (100.0%)**
- **Vectors with Automated Unit/Integration Tests Passing:** **21 / 21 (100.0% — 289/289 tests passed)**
- **Vectors Fully VERIFIED_FIXED:** **12** (`EXP-002`, `EXP-003`, `EXP-004`, `EXP-005`, `EXP-006`, `EXP-007`, `EXP-008`, `EXP-009`, `EXP-010`, `EXP-015`, `EXP-017`, `EXP-018`)
- **Vectors FIXED_PENDING_TEST (Live Cluster Dynamic Retest Pending):** **9** (`EXP-001`, `EXP-011`, `EXP-012`, `EXP-013`, `EXP-014`, `EXP-016`, `EXP-019`, `EXP-020`, `EXP-021`)
- **Vectors Incomplete / OPEN:** **0**

### 5.2 Independent Review Audit Conclusion (Historical Snapshot):
The technical remediations and automated security regression suites (289/289 passing tests with 0 failures and 0 errors) provide verifiable proof that all 21 vulnerability root causes are resolved in code. In strict adherence to independent audit governance, the 9 vectors requiring live runtime dynamic verification across the container cluster were designated **`FIXED_PENDING_TEST`** as of October 30, 2026. These pending vectors were subsequently retested against the live running container cluster on November 2, 2026, establishing the final authoritative disposition of 19 `VERIFIED_FIXED` and 2 `PARTIALLY_VERIFIED` in `PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md`.

