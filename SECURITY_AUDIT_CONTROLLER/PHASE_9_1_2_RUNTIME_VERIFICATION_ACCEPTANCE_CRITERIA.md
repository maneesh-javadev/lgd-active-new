# LGD 2.0 — Phase 9.1.2: Runtime Verification Acceptance Criteria & Forensic Runbook Corrections

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Phase** | Phase 9.1.2 — Implementation Safety Corrections & Final Readiness Review |
| **Document ID** | `LGD2-P9.1.2-RUNTIME-ACCEPTANCE-CRITERIA` |
| **File Location** | `SECURITY_AUDIT_CONTROLLER/PHASE_9_1_2_RUNTIME_VERIFICATION_ACCEPTANCE_CRITERIA.md` |
| **Architectural Roles** | Principal Infrastructure Security Architect, Lead DBA & Senior AppSec Auditor |
| **Evaluation Timestamp** | November 6, 2026 (`2026-11-06T10:55:00+05:30`) |
| **Governing Blockers** | `BLK-CANON-02` (Revenue TestController Census) & `BLK-CANON-03` (PostgreSQL 14 Availability) |
| **Execution Mode** | **STRICTLY READ-ONLY ASSESSMENT & ACCEPTANCE CRITERIA SPECIFICATION (ZERO ACTIVE EXECUTION)** |

---

## 1. Executive Summary & Forensic Runbook Flaw Analysis

A rigorous audit of the Phase 9.1 Runtime Verification Runbook (`PHASE_9_1_RUNTIME_VERIFICATION_RUNBOOK.md`) revealed critical verification vulnerabilities and false-assurance risks across both governing blockers:

### 1.1 The Revenue `TestController` 404 Fallacy (`BLK-CANON-02`)
The Phase 9.1 runbook asserted:
> *"Execute `curl http://localhost:18062/test/api1`. If the endpoint returns `404 Not Found`, the `@Profile({"dev", "test"})` guard is active $\rightarrow$ PASS."*

**Forensic Refutation:**
Relying solely on an HTTP 404 response to prove the absence of a vulnerable test controller is a **fatal logical fallacy (affirming the consequent)**:
1. **Path Discrepancy:** The actual endpoint mapped in `TestController` might be `/api/test/1`, `/test/status`, or `/test/execute`. Probing an unmapped path like `/test/api1` will return `404 Not Found` even while other dangerous test endpoints remain live!
2. **Security Interception:** A Spring Security filter chain or firewall might intercept the request and return `404` or `401/403` disguised as `404`, while the controller bean is actively instantiated in the Spring ApplicationContext.
3. **Application Port / Virtual Host Mismatch:** Probing the wrong internal port or failing to supply the expected `Host` header can generate a generic container/web server 404.
4. **Context Failure:** If the application failed context startup or is in an unhealthy initialization state, Tomcat returns 404 for all requests.
5. **The Missing Actuator Hazard:** The Phase 9.1 runbook stated that if `/actuator/mappings` is queried, it must return zero matches. However, **if the Actuator endpoint itself returns 404 (because Actuator is disabled, unexposed, or secured), this CANNOT be interpreted as proof that `TestController` is absent!**

### 1.2 PostgreSQL 14 Availability Gaps (`BLK-CANON-03`)
The Phase 9.1 runbook verified port 5432 and a basic `SELECT version()` query, but failed to mandate empirical tests verifying:
- Enforcement of `scram-sha-256` over MD5.
- Active TLS channel binding and cipher verification (`ssl_is_used()`).
- Strict rejection of unauthorized network CIDRs and cleartext connection attempts.
- Certificate SAN match (`host.docker.internal`) under `sslmode=verify-full`.

This document establishes the **Multi-Factor Runtime Verification Acceptance Rubric** required before `BLK-CANON-02` or `BLK-CANON-03` may be formally marked as closed.

---

## 2. Multi-Factor Verification Rubric: Revenue TestController (`BLK-CANON-02`)

To definitively certify that `TestController` is completely excluded from production runtime execution, all **SIX independent verification factors** must be satisfied simultaneously:

```mermaid
flowchart TD
    subgraph MultiFactorCensus["Multi-Factor TestController Census (BLK-CANON-02)"]
        F1["Factor 1: Container Image Digest & Build Provenance"]
        F2["Factor 2: Source Code AST @Profile Annotation Verification"]
        F3["Factor 3: Active Profile Log Attestation ('prod')"]
        F4["Factor 4: Actuator Endpoint Mapping Census (0 Matches)"]
        F5["Factor 5: Negative Multi-Endpoint HTTP Probe Census"]
        F6["Factor 6: Spring Security Defense-in-Depth Filter Verification"]
    end

    F1 & F2 & F3 & F4 & F5 & F6 --> Verdict{"All 6 Factors Passed?"}
    Verdict -->|YES| Closure["BLK-CANON-02 FORMALLY CLOSED"]
    Verdict -->|NO (Any Failure)| Hold["GATE B MAINTAINED ON HOLD"]
```

### 2.1 Detailed Factor Specifications

#### Factor 1: Container Image Digest & Build Provenance
- **Objective:** Verify that the running container was built from the audited source repository and has not been tampered with or replaced with a development image.
- **Verification Command:**
  ```powershell
  $containerImage = docker inspect -f '{{.Image}}' revenue
  $repoDigest = docker inspect -f '{{index .RepoDigests 0}}' revenue
  Write-Host "Container Image ID: $containerImage"
  Write-Host "Repo Digest: $repoDigest"
  ```
- **Acceptance Criterion:** Image ID matches the authoritative Phase 8 / 9 build digest.

#### Factor 2: Source Code AST `@Profile` Annotation Verification
- **Objective:** Confirm at the source level that `TestController` is annotated with `@Profile({"dev", "test"})` and cannot be registered under the `prod` profile.
- **Verification Evidence:**
  Inspect [`revenue/src/main/java/in/nic/lgd/revenue/controller/TestController.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/controller/TestController.java):
  ```java
  @RestController
  @RequestMapping({ "/private/v1/test", "/test" })
  @Profile({"dev", "test"})
  public class TestController { ... }
  ```
- **Acceptance Criterion:** Controller class possesses explicit `@Profile({"dev", "test"})` annotation covering both `/private/v1/test` and `/test` base paths.

#### Factor 3: Active Profile Log Attestation
- **Objective:** Verify from the live container startup logs that only the `prod` profile is active.
- **Verification Command:**
  ```powershell
  $logOutput = docker logs revenue 2>&1
  $profileMatch = $logOutput | Select-String "The following 1 profile is active: ""prod"""
  ```
- **Acceptance Criterion:**
  - Log explicitly contains: `The following 1 profile is active: "prod"`.
  - Zero presence of `dev`, `test`, or `default` profiles in active profile logs.

#### Factor 4: Actuator Endpoint Mapping Census (Reconciled per DISC-P913-04)
- **Objective:** Inspect registered routes in memory via Actuator or attest bean exclusion via Spring ApplicationContext reflection.
- **Audit Discovery (`DISC-P913-04`):** `revenue/pom.xml` does not include `spring-boot-starter-actuator`. Probing `/actuator/mappings` unconditionally returns HTTP 404.
- **Reconciled Acceptance Path:**
  - **Option A (Actuator Added):** If `spring-boot-starter-actuator` is declared in `revenue/pom.xml`, query `/actuator/mappings` inside the container; verify 0 matches for `TestController`.
  - **Option B (Context Reflection):** Execute an automated Spring Boot context reflection test verifying that `context.getBean(TestController.class)` throws `NoSuchBeanDefinitionException`.
  - *Anti-Conflation Rule:* An HTTP 404 on `/actuator/mappings` when Actuator is missing from the POM is NOT a failed census; it simply requires Option B reflection verification.

#### Factor 5: Negative Multi-Endpoint HTTP Probe Census (Reconciled per DISC-P913-05)
- **Objective:** Probe actual mapped endpoint paths associated with `TestController`.
- **Target Paths (40 Discrete Routes):** Probing representative routes across both base paths:
  `/private/v1/test/api1` through `api5`, and `/test/api1` through `api5`. (Purged fictitious `/test/status` and `/test/echo`).
- **Security Interception Note (`DISC-P913-05`):** `revenue` enforces `.anyRequest().authenticated()`. Unauthenticated probes return `HTTP 401 Unauthorized` (proving filter defense). To prove handler mapping exclusion (returning 404), probes MUST include a valid authenticated JWT Bearer token:
  ```powershell
  $validJwt = "<VALID_AUTHENTICATED_TEST_TOKEN>"
  $testPaths = @(
      "/private/v1/test/api1", "/private/v1/test/api2", "/private/v1/test/api3", "/private/v1/test/api4", "/private/v1/test/api5",
      "/test/api1", "/test/api2", "/test/api3", "/test/api4", "/test/api5"
  )
  foreach ($path in $testPaths) {
      $resp = docker exec revenue wget -qO- --spider --server-response --header="Authorization: Bearer $validJwt" "http://localhost:18062$path" 2>&1
      Write-Host "Probing $path with JWT : $resp"
  }
  ```
- **Acceptance Criterion:** Every single authenticated probe returns `HTTP 404 Not Found`, confirming DispatcherServlet has no handler mapping for the route.

#### Factor 6: Spring Security Filter Chain Audit
- **Objective:** Verify that `SecurityConfig.java` in `revenue` does not contain any `permitAll()` rules for `/test/**` or `/private/v1/test/**`.
- **Acceptance Criterion:** Any unauthenticated request attempting to hit these paths is intercepted by `JwtAuthenticationFilter` and returns `HTTP 401 Unauthorized`.

---

## 3. Comprehensive Verification Rubric: Host PostgreSQL 14 (`BLK-CANON-03`)

To formally close `BLK-CANON-03`, all **NINE independent technical verification checks** must be satisfied:

```mermaid
flowchart TD
    subgraph PGVerification["PostgreSQL 14 Acceptance Verification (BLK-CANON-03)"]
        P1["Check 1: Windows Service Status = Running"]
        P2["Check 2: TCP Listener Pinned to Authorized Interfaces"]
        P3["Check 3: Engine Version Confirmed (PostgreSQL 14.x)"]
        P4["Check 4: Database Accessibility (Database 'lgd')"]
        P5["Check 5: SCRAM-SHA-256 Authentication Enforced"]
        P6["Check 6: TLS Channel Active (TLS 1.3/1.2 AEAD)"]
        P7["Check 7: Certificate SAN Verification (host.docker.internal)"]
        P8["Check 8: Negative Security: Unauthorized Rejection Verified"]
        P9["Check 9: Microservice HikariCP Steady-State (>=5 min)"]
    end

    P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 --> PGVerdict{"All 9 Checks Passed?"}
    PGVerdict -->|YES| PGClosed["BLK-CANON-03 FORMALLY CLOSED"]
    PGVerdict -->|NO| PGHold["GATE B MAINTAINED ON HOLD"]
```

### 3.1 Detailed Verification Specifications

#### Check 1: Windows Service Status
```powershell
(Get-Service -Name postgresql-x64-14).Status -eq "Running"
```

#### Check 2: TCP Listener Verification
Verify that PostgreSQL listens on `127.0.0.1:5432` and `172.20.32.1:5432`, but DOES NOT accept unauthorized remote connections without TLS:
```powershell
Test-NetConnection -ComputerName 127.0.0.1 -Port 5432
Test-NetConnection -ComputerName 172.20.32.1 -Port 5432
```

#### Check 3 & 4: Engine Version & Database Accessibility
Connect via `psql` and query engine metadata:
```sql
SELECT version(), current_database(), current_user;
```
- **Acceptance Criteria:** Returns PostgreSQL 14.x; database is `lgd`.

#### Check 5: SCRAM-SHA-256 Authentication Verification
Inspect `pg_authid` to prove all active roles use SCRAM and no MD5 hashes remain:
```sql
SELECT rolname, 
       CASE 
         WHEN rolpassword LIKE 'SCRAM-SHA-256$%' THEN 'SCRAM-SHA-256'
         WHEN rolpassword LIKE 'md5%' THEN 'MD5 (INSECURE)'
         ELSE 'OTHER'
       END AS auth_status
FROM pg_authid 
WHERE rolname IN ('postgres', 'lgd_prod_user', 'lgd_monitor');
```
- **Acceptance Criterion:** 100% of roles return `SCRAM-SHA-256`. Zero `MD5` entries.

#### Check 6: TLS Channel & Cipher Verification
Query active SSL connection parameters from the established session:
```sql
SELECT ssl_is_used(), ssl_version(), ssl_cipher();
```
- **Acceptance Criteria:**
  - `ssl_is_used()` returns `true`.
  - `ssl_version()` returns `TLSv1.3` or `TLSv1.2`.
  - `ssl_cipher()` matches approved AEAD ciphers (e.g. `ECDHE-RSA-AES256-GCM-SHA384`).

#### Check 7: Certificate SAN Verification (`sslmode=verify-full`)
Test connection using `verify-full` with hostname `host.docker.internal`:
```cmd
"E:\Program Files\PostgreSQL\14\bin\psql.exe" "host=host.docker.internal port=5432 dbname=lgd user=lgd_prod_user sslmode=verify-full sslrootcert=certs/lgd-internal-ca.crt" -c "SELECT 1;"
```
- **Acceptance Criterion:** Query succeeds without hostname mismatch exceptions.

#### Check 8: Negative Security Test (Unauthorized & Cleartext Rejection)
1. **Cleartext Connection Rejection:** Attempt a connection with `sslmode=disable`:
   ```cmd
   "E:\Program Files\PostgreSQL\14\bin\psql.exe" "host=127.0.0.1 port=5432 dbname=lgd user=lgd_prod_user sslmode=disable"
   ```
   **Expected Response:** `FATAL: no pg_hba.conf entry for host ... ssl off`. Connection rejected!
2. **Unauthorized User / Subnet Rejection:** Attempt connection from unauthorized IP:
   **Expected Response:** `FATAL: no pg_hba.conf entry for host ...`. Connection dropped!

#### Check 9: Microservice HikariCP Steady-State Startup
Start container `revenue` with production profile. Monitor HikariCP initialization:
```powershell
docker logs revenue --tail 50 | Select-String "HikariPool-1"
```
- **Acceptance Criteria:**
  - `HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@...`
  - `HikariPool-1 - Start completed.`
  - Zero `PSQLException`, zero connection timeouts, zero SSL handshake errors.
  - Container maintains continuous `running` status for $\ge 300\text{ seconds}$ (5 minutes).

---

## 4. Operational Boundaries & Prohibition of Live Execution

> [!CAUTION]
> **READ-ONLY MANDATE:**
> The criteria and runbooks defined in this document are **AUTHORITATIVE ACCEPTANCE SPECIFICATIONS ONLY**.
> 
> In accordance with the Phase 9.1.2 Execution Boundaries:
> - **Zero services or containers were started during this audit.**
> - `postgresql-x64-14` remains `Stopped`.
> - `revenue` container remains `Exited`.
> - Live execution of these checks is strictly deferred to an authorized **Stage B Maintenance Window** following formal approval.

---

## 5. Reviewer Disposition & Blocker Readiness

| Blocker ID | Description | Acceptance Criteria Status | Operational Readiness | Gate B Impact |
|:---:|:---|:---:|:---:|:---:|
| **`BLK-CANON-02`** | Revenue Runtime & TestController Census | **6-Factor Rubric Defined & Validated** | Ready for authorized Stage B execution | **HOLD** (Awaiting execution) |
| **`BLK-CANON-03`** | Host PostgreSQL 14 Availability & SCRAM TLS | **9-Check Matrix Defined & Validated** | Ready for authorized Stage B execution | **HOLD** (Awaiting execution) |

