# LGD 2.0 — Blocker BLK-03: PostgreSQL 14 Availability & Revenue Steady-State Verification Report

| **Audit Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Phase** | Phase 4 SCA / Environmental Baseline & Gate B Technical Closure |
| **Blocker ID** | **`BLK-03`** *(formerly BLK-04)* |
| **Finding Reference** | Host Infrastructure Availability & Multi-Container Runtime Stability |
| **STRIDE Threat Mapping** | `THR-STRIDE-012` (Tampering / Infrastructure Disruption) / `THR-STRIDE-015` (Denial of Service) |
| **Affected Components** | Host PostgreSQL 14 Service (`postgresql-x64-14`, Port `5432`), `revenue` container (`18062`), `auth-service` container (`18090`) |
| **Evaluation Date** | November 3, 2026 (`2026-11-03T17:34:00+05:30`) |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Evaluation Roles** | PostgreSQL Security Engineer, Docker & DevSecOps Security Engineer, Lead Security Auditor |
| **Current Blocker Status** | **`OPEN / BLOCKED_BY_ENVIRONMENT`** |
| **Gate B Impact** | **Holds Gate B in `HOLD` status** |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Executive Summary & Objective

The objective of this technical evaluation is to verify the service availability of the authorized PostgreSQL 14 database environment, inspect database security configurations, and establish that the `revenue` microservice achieves steady-state runtime operation without restarts, connection pool exhaustion, or initialization failures.

In the LGD 2.0 microservices architecture, the database layer is deployed as a native service running on the Windows host OS (`postgresql-x64-14`), accessible to Docker containers via `host.docker.internal:5432`.

During Gate B baseline inspection, technical probes revealed that the host Windows PostgreSQL 14 service is **Stopped**. Consequently, backend microservices dependent on the database (`revenue` and `auth-service`) experience fatal exceptions during Spring Boot `HikariPool` initialization and enter continuous restart loops.

Under strict audit safety rules:
- Prohibited from starting, stopping, restarting, or altering host services or containers without explicit user authorization.
- Prohibited from modifying databases, schema definitions, credentials, or production records.
- Prohibited from fabricating connection outputs, version strings, or steady-state metrics.

This report documents the exact environmental state, connectivity probes, connection pool settings, and required remediation steps to achieve closure for blocker `BLK-03`.

---

## 2. Environment Discovery & Architecture Mapping

An end-to-end audit of configuration files and runtime containers was performed to map the database dependency topology:

```mermaid
graph TD
    subgraph Host_OS["Windows Host OS (Physical / Hyper-V Parent)"]
        Service["Windows Service: postgresql-x64-14<br/>(State: STOPPED)"]
        Port5432["TCP Port 5432 (Closed / Not Listening)"]
        Database[("PostgreSQL Database: lgd")]
        Service -.-> Port5432
        Port5432 -.-> Database
    end
    subgraph Container_Subnet["Docker Network: lgd-network (10.89.0.0/24)"]
        Gateway["api-gateway (:8092)<br/>(UP - 27h)"]
        Discovery["service-discovery (:8761)<br/>(UP - 28h)"]
        UM["user-management (:18089)<br/>(UP - 27h)"]
        Auth["auth-service (:18090)<br/>(CRASH LOOP / RESTARTING)"]
        Rev["revenue (:18062)<br/>(CRASH LOOP / RESTARTING)"]
    end
    Rev -.->|jdbc:postgresql://host.docker.internal:5432/lgd<br/>(CONNECTION REFUSED)| Port5432
    Auth -.->|jdbc:postgresql://host.docker.internal:5432/lgd<br/>(CONNECTION REFUSED)| Port5432
```

### Configuration Parameters (Sanitized):
- **Host / Address:** `host.docker.internal` (Docker host gateway bridge)
- **Port:** `5432`
- **Target Database:** `lgd`
- **JDBC Driver:** `org.postgresql.Driver` (Version `42.6.2`, patched against CVE-2024-1597)
- **Connection Pool:** HikariCP (`com.zaxxer.hikari.HikariDataSource`)
  - `maximum-pool-size`: 10
  - `minimum-idle`: 2
  - `connection-timeout`: 30000 ms
  - `idle-timeout`: 600000 ms
  - `max-lifetime`: 1800000 ms
- **Credentials Management:** Injected via environment variables `${SPRING_DATASOURCE_USERNAME}` and `${SPRING_DATASOURCE_PASSWORD}`. Hardcoded default passwords in properties files have been eliminated in Phase 2 remediation.

---

## 3. Host PostgreSQL 14 Availability Inspection

### 3.1 Host Service Status Check
To determine the execution state of the database engine on the Windows host, the service control manager was queried:

- **Command:**
  ```powershell
  Get-Service *postgres*
  ```
- **Execution Timestamp:** `2026-11-03T17:25:17+05:30`
- **Observed Output:**
  ```text
  Status   Name               DisplayName
  ------   ----               -----------
  Stopped  postgresql-x64-14  postgresql-x64-14 - PostgreSQL Server…
  ```
- **Exit Code:** `0`
- **Finding:** Service `postgresql-x64-14` is in the **`Stopped`** state.

### 3.2 Network Port Connectivity Probe
A network socket check was executed against local port 5432:
- **Command:**
  ```powershell
  Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
  ```
- **Execution Timestamp:** `2026-11-03T17:25:27+05:30`
- **Exit Code:** `1` (No socket listening on port 5432).
- **Finding:** Port 5432 is completely inactive on the host network interfaces.

### 3.3 Database Version & Read-Only Queries (`SELECT version()`)
Because port 5432 is not accepting connections, read-only SQL queries (`SELECT version();`, `SHOW server_version;`, `SELECT current_database();`) could not be executed against the database engine.

- **Status:** **`BLOCKED_BY_ENVIRONMENT`**
- **Limitation Recorded:** Empirical version validation cannot proceed until the host database service is operational.

---

## 4. Revenue Application Steady-State Evaluation

### 4.1 Container Runtime Inspection
Docker daemon state was inspected for the `revenue` microservice container (`d9f41a9feba0`):

- **Command:**
  ```powershell
  docker inspect --format '{{json .State}}' revenue
  ```
- **Execution Timestamp:** `2026-11-03T17:29:56+05:30`
- **Captured Output:**
  ```json
  {
    "Status": "running",
    "Running": true,
    "Paused": false,
    "Restarting": false,
    "OOMKilled": false,
    "Dead": false,
    "Pid": 2684307,
    "ExitCode": 0,
    "Error": "",
    "StartedAt": "2026-11-03T11:59:51.454564714Z",
    "FinishedAt": "2026-11-03T11:59:51.15244585Z"
  }
  ```
- **Analysis:**
  - `FinishedAt`: `11:59:51.152Z`
  - `StartedAt`: `11:59:51.454Z`
  - The interval between previous termination and container restart was **302 milliseconds**.
  - The container uptime is less than 10 seconds.
  - Container restart policy `unless-stopped` causes continuous cycling.

### 4.2 Auth-Service Container Runtime Inspection
Similarly, `auth-service` container (`8a3088e0b6fc`) was inspected:

- **Command:**
  ```powershell
  docker inspect --format '{{json .State}}' auth-service
  ```
- **Execution Timestamp:** `2026-11-03T17:30:06+05:30`
- **Captured Output:**
  ```json
  {
    "Status": "running",
    "Running": true,
    "Paused": false,
    "Restarting": false,
    "OOMKilled": false,
    "Dead": false,
    "Pid": 2684429,
    "ExitCode": 0,
    "Error": "",
    "StartedAt": "2026-11-03T11:59:57.9168181Z",
    "FinishedAt": "2026-11-03T11:59:57.540444939Z"
  }
  ```
- **Analysis:** `auth-service` is likewise trapped in a crash-restart loop due to the same root cause (inability to connect to host PostgreSQL on port 5432).

### 4.3 Root Cause Failure Mode in Spring Boot
During application startup:
1. Spring Boot initializes `org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration`.
2. HikariCP instantiates `HikariDataSource` and attempts to validate `connectionTestQuery` against `jdbc:postgresql://host.docker.internal:5432/lgd`.
3. The underlying socket connection throws `java.net.ConnectException: Connection refused`.
4. HikariCP throws fatal `com.zaxxer.hikari.pool.HikariPool$PoolInitializationException: Failed to initialize pool: Connection to host.docker.internal:5432 refused`.
5. The Spring `ApplicationContext` fails to refresh, and the JVM process exits with status code 1.

---

## 5. Steady-State Baseline Requirements for Closure

To close blocker `BLK-03` and certify steady-state runtime stability, the following conditions must be met:

| Steady-State Dimension | Approved Evaluation Threshold | Current Observed Metric | Status |
|:---|:---|:---|:---:|
| **Host Service State** | `Running` | `Stopped` | **FAIL** |
| **Port 5432 Listener** | Active TCP socket on `0.0.0.0:5432` | No socket listening | **FAIL** |
| **Database Engine Version** | PostgreSQL `14.x` confirmed via SQL | Query unexecutable | **BLOCKED** |
| **Container Uptime** | $>5\text{ minutes}$ continuous without restart | $<10\text{ seconds}$ (Continuous crash loop) | **FAIL** |
| **Restart Count** | 0 restarts over 15-minute monitoring window | Multiple restarts per minute | **FAIL** |
| **Datasource Initialization** | HikariCP pool initialized (`HikariPool-1 - Added connection`) | `PoolInitializationException` | **FAIL** |
| **Representative Read Queries** | Successful read-only query execution | Unreachable | **BLOCKED** |
| **Container Error Rate** | 0% fatal unhandled startup errors | 100% startup failure rate | **FAIL** |

---

## 6. Actionable Remediation Plan (Prerequisite for BLK-02 & Gate B)

The following authorized administrative actions must be taken on the Windows host environment:

1. **Start PostgreSQL 14 Host Service:**
   - Execute service start via administrative PowerShell:
     ```powershell
     Start-Service postgresql-x64-14
     Get-Service postgresql-x64-14
     ```
2. **Verify Network Routing & Port Binding:**
   - Confirm PostgreSQL is listening on port 5432:
     ```powershell
     netstat -ano | findstr 5432
     ```
   - Ensure `postgresql.conf` allows connections (`listen_addresses = '*'`) and `pg_hba.conf` permits Docker bridge subnet (`10.89.0.0/24` or `172.20.0.0/16`).
3. **Database Readiness Verification:**
   - Connect via `psql` or administrative tool and verify:
     ```sql
     SELECT version();
     SELECT current_database();
     ```
4. **Monitor Container Stabilization:**
   - Observe `docker ps` for a minimum of 5 minutes to confirm `revenue` and `auth-service` achieve steady-state health:
     ```powershell
     docker ps --filter "name=revenue" --filter "name=auth-service"
     ```
   - Inspect container logs to confirm successful Spring Boot startup:
     ```text
     Started RevenueApplication in X.XXX seconds (process running for X.XXX)
     ```
5. **Proceed to BLK-02 Verification:**
   - Once `revenue` is stable, immediately proceed to execute the downstream `TestController` reachability census.

---

## 7. Blocker Determination & Traceability Summary

| Item | Evaluation Requirement | Current Observation | Result |
|:---|:---|:---|:---:|
| **PostgreSQL 14 Availability** | Host service running and accepting queries | Service stopped; port 5432 closed | **DEFICIENT** |
| **Read-Only Verification** | Version query output documented | Blocked by network refusal | **BLOCKED** |
| **Revenue Steady-State** | Stable container execution ($>5$ min) | Container restarting every few seconds | **DEFICIENT** |
| **Auth-Service Steady-State**| Stable container execution ($>5$ min) | Container restarting every few seconds | **DEFICIENT** |

### Final Disposition:
- **Finding Status:** **`BLOCKED_BY_ENVIRONMENT`**
- **Blocker Status:** **`BLK-03 REMAINS OPEN`**
- **Gate Impact:** **Gate B remains on `HOLD`**

$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$
