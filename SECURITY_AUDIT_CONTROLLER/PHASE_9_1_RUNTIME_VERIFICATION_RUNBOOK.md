# LGD 2.0 — Phase 9.1: Revenue & PostgreSQL Runtime Verification Runbook (BLK-CANON-02 & BLK-CANON-03)

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Phase** | Phase 9.1 — Infrastructure Design Validation & Implementation Readiness |
| **Document ID** | `LGD2-P9.1-RUNTIME-RUNBOOK` |
| **File Location** | `SECURITY_AUDIT_CONTROLLER/PHASE_9_1_RUNTIME_VERIFICATION_RUNBOOK.md` |
| **Operational Roles** | Principal Infrastructure Security Architect, Lead DBA & Senior AppSec Auditor |
| **Validation Timestamp** | November 6, 2026 (`2026-11-06T10:35:00+05:30`) |
| **Governing Blockers** | `BLK-CANON-02` (Revenue Container & TestController Census) & `BLK-CANON-03` (PostgreSQL 14 Availability) |
| **Execution Mode** | **OPERATIONAL RUNBOOK SPECIFICATION (EXECUTION LOCKED PENDING SEPARATE AUTHORIZATION)** |

---

## 1. Executive Mission & Environmental Context

Currently, two active technical blockers prevent release Gate B closure:
1. **`BLK-CANON-03` (Host PostgreSQL 14 Availability):** The native Windows service `postgresql-x64-14` is in `Stopped` status on the host machine.
2. **`BLK-CANON-02` (Revenue Runtime & TestController Census):** Container `revenue` fails during HikariCP datasource initialization because PostgreSQL is offline. Consequently, dynamic runtime verification confirming that `@Profile({"dev", "test"})` on `TestController` successfully omits `/test/**` endpoints in production cannot be executed.

In strict compliance with the **Read-Only Assessment Mode**, this document establishes the **safe, non-destructive operational runbook** to be executed during a separately authorized Stage B / verification window.

---

## 2. Pre-Execution Safety Checklist & Authorization Boundary

Prior to initiating any command in this runbook, the lead engineer and independent auditor must verify:
- [ ] Explicit written authorization from the Designated Approving Authority (DAA) or User for Stage B execution.
- [ ] Backup copy of host `postgresql.conf` and `pg_hba.conf` exists in `E:\Program Files\PostgreSQL\14\data\backup\`.
- [ ] Windows PowerShell session opened with Administrator privileges.
- [ ] Git working tree confirmed clean (`git status` reports no uncommitted mutations).
- [ ] No production traffic is currently routed to the host machine.

---

## 3. Phase 1: Host PostgreSQL 14 Recovery & Verification (`BLK-CANON-03`)

### Step 1.1: Verify Service Status
Execute in PowerShell:
```powershell
Get-Service -Name postgresql-x64-14
```
**Expected Output:**
```
Status   Name               DisplayName
------   ----               -----------
Stopped  postgresql-x64-14  postgresql-x64-14 - PostgreSQL Server.
```

### Step 1.2: Start Native Windows PostgreSQL Service
```powershell
Start-Service -Name postgresql-x64-14
```

### Step 1.3: Verify Running Status & Port 5432 Listener
```powershell
# Confirm service state is Running
Get-Service -Name postgresql-x64-14 | Select-Object Status, Name

# Confirm TCP port 5432 is actively listening on localhost
Test-NetConnection -ComputerName 127.0.0.1 -Port 5432
```
**Expected Output:**
```
Status: Running
TcpTestSucceeded : True
```

### Step 1.4: Verify Database Connectivity & SCRAM-SHA-256 Authentication
Connect using `psql` to verify the engine responds and validates credentials:
```powershell
& "E:\Program Files\PostgreSQL\14\bin\psql.exe" -h 127.0.0.1 -p 5432 -U postgres -d lgd -c "SELECT version(), current_setting('password_encryption'), current_setting('ssl');"
```
**Acceptance Criteria for `BLK-CANON-03` Closure:**
- `TcpTestSucceeded` is `True`.
- Query returns PostgreSQL 14.x version string.
- Database `lgd` is accessible.

---

## 4. Phase 2: Revenue Container Steady-State & HikariCP Startup

### Step 2.1: Start Redis and Revenue Containers
In repository root (`E:\System\Projects\dockerProject\Source code\lgd-active-new`):
```powershell
# Ensure discovery and redis are running first
docker compose up -d service-discovery redis

# Launch revenue container
docker compose up -d revenue
```

### Step 2.2: Verify Active Profile (`prod`) & HikariCP Initialization
Inspect the container startup logs:
```powershell
docker logs revenue --tail 100
```
**Expected Log Signatures:**
```
The following 1 profile is active: "prod"
...
HikariPool-1 - Starting...
HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@...
HikariPool-1 - Start completed.
...
Started RevenueApplication in ... seconds (process running for ...)
```

### Step 2.3: Verify 5-Minute Steady-State Runtime
Execute a timed health probe loop to confirm the container does not exit or crash:
```powershell
$startTime = Get-Date
Write-Host "Monitoring container 'revenue' for 5 minutes steady-state..."
for ($i = 1; $i -le 10; $i++) {
    Start-Sleep -Seconds 30
    $status = docker inspect -f '{{.State.Status}}' revenue
    $elapsed = (Get-Date) - $startTime
    Write-Host "[+$([int]$elapsed.TotalSeconds)s] Container status: $status"
    if ($status -ne "running") {
        Write-Error "CRITICAL: Container 'revenue' crashed! Status: $status"
        docker logs revenue --tail 50
        break
    }
}
```
**Acceptance Criteria:** Container maintains continuous `running` status for $\ge 300\text{ seconds}$ (5 minutes).

---

## 5. Phase 3: Downstream Endpoint & TestController Reachability Census (`BLK-CANON-02`)

### Step 3.1: Direct Downstream HTTP Probe on Port 18062
> [!NOTE]
> In production compose (`docker-compose.yml`), port 18062 is not exposed to the host interface.
> To probe the container directly, execute the curl command from inside the Docker bridge network via an ephemeral test runner or `docker exec`:

```powershell
docker exec revenue wget -qO- --spider --server-response http://localhost:18062/test/api1 2>&1 | Select-String "HTTP/"
```
Or via host development override if authorized:
```powershell
curl -s -o /dev/null -w "%{http_code}" http://localhost:18062/test/api1
```
**Expected HTTP Response:** `404` (Not Found).
- If the endpoint returns `200 OK`, `TestController` is erroneously exposed in production $\rightarrow$ **FAIL**.
- If the endpoint returns `404 Not Found`, the `@Profile({"dev", "test"})` guard is active $\rightarrow$ **PASS**.

### Step 3.2: Actuator Mapping Census for `TestController`
Extract the live endpoint mapping table from Spring Boot Actuator:
```powershell
$mappings = docker exec revenue wget -qO- http://localhost:18062/actuator/mappings
if ($mappings -match "TestController" -or $mappings -match "/test/") {
    Write-Error "CRITICAL DEFECT: TestController or /test/** endpoints present in live Actuator mappings!"
} else {
    Write-Host "CENSUS CONFIRMED: 0 occurrences of TestController in production Actuator mappings."
}
```
**Acceptance Criteria for `BLK-CANON-02` Closure:**
1. Direct probe to `/test/api1` returns `HTTP 404 Not Found`.
2. Actuator mapping census returns **zero** matches for `TestController` and `/test/**`.

---

## 6. Contingency & Rollback Procedures

### 6.1 Database Connection Failure (HikariCP Timeout)
- **Symptom:** `HikariPool-1 - Connection is not available, request timed out after 30000ms`.
- **Diagnostic Steps:**
  1. Verify host Windows firewall allows inbound connections on port 5432 from Docker gateway:
     ```powershell
     Get-NetFirewallRule -DisplayName "*PostgreSQL*"
     ```
  2. Verify `pg_hba.conf` allows the container bridge IP `10.89.0.0/24`.
  3. Verify PostgreSQL service is listening on all interfaces (`listen_addresses = '*'`).

### 6.2 Emergency Container Rollback
If the revenue container enters an unrecoverable restart loop:
```powershell
docker compose stop revenue
docker compose rm -f revenue
```
Restore the database configuration from the pre-execution backup:
```powershell
Copy-Item "E:\Program Files\PostgreSQL\14\data\backup\postgresql.conf" "E:\Program Files\PostgreSQL\14\data\postgresql.conf"
Copy-Item "E:\Program Files\PostgreSQL\14\data\backup\pg_hba.conf" "E:\Program Files\PostgreSQL\14\data\pg_hba.conf"
Restart-Service -Name postgresql-x64-14
```

---

## 7. Deliverable Verification & Stage B Readiness

| Checkpoint | Requirement | Pre-Stage B Status |
|:---|:---|:---:|
| **Non-Destructive Design** | Fully parameterized scripts; zero modifications applied during Phase 9.1. | **VERIFIED** |
| **BLK-CANON-03 Closure Path** | Detailed PowerShell service startup, listener test, and SCRAM auth check. | **RUNBOOK READY** |
| **BLK-CANON-02 Closure Path** | Direct container probe and Actuator mappings extraction with zero-match rule. | **RUNBOOK READY** |
| **Contingency & Rollback** | Step-by-step firewall diagnostic and backup restore procedures defined. | **VERIFIED** |

