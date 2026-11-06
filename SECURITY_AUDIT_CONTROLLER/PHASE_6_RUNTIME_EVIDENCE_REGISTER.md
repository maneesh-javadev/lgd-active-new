# LGD 2.0 — Phase 6: Runtime Evidence Register
## Forensic Probe Logs, Socket Test Verifications & Empirical Infrastructure Catalog

| **Evidence Register Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Runtime Verification & Blocker Disposition** |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Evaluation Timestamp** | November 5, 2026 (`2026-11-05T15:30:00+05:30`) |
| **Evidence Records Recorded** | 4 Canonical Runtime Proofs (`EVD-BLK-01` through `EVD-BLK-04`) |
| **Technical Verification State** | **PARTIALLY_VERIFIED (3 Environmental Blockers Open; 1 Governance Pending)** |
| **Authoritative Ruling** | **GATE B = HOLD (MANDATORY)** |

---

## 1. Runtime Environment Specification

The runtime evaluation was conducted directly on the target host environment:
- **Operating System:** Microsoft Windows 11 Enterprise (`10.0.26100`)
- **Host Architecture:** AMD64 / 64-Bit VM
- **Java Virtual Machine:** Oracle JDK 21.0.9 LTS (`build 21.0.9+7-LTS-338`)
- **Docker Engine:** Docker Desktop / Docker Compose v2 (Container bridge network: `lgd-network`)
- **Native Host Database:** PostgreSQL Server 14 (`postgresql-x64-14`)

---

## 2. Forensic Evidence Records (EVD-BLK-01 through EVD-BLK-04)

### 2.1 EVD-BLK-01: Perimeter Ingress Transport Security & HSTS Evaluation
- **Blocker ID:** `BLK-CANON-01`
- **Correlated Findings:** `SAST-016`, `EXP-016`, `EV-006`, `EVD-GATEB-01`
- **Evaluation Command:** `Test-NetConnection -ComputerName 127.0.0.1 -Port 8092`
- **Execution Timestamp:** `2026-11-05T15:18:54+05:30`
- **Raw Probe Output:**
  ```text
  WARNING: TCP connect to (127.0.0.1 : 8092) failed
  ComputerName           : 127.0.0.1
  RemoteAddress          : 127.0.0.1
  RemotePort             : 8092
  InterfaceAlias         : Loopback Pseudo-Interface 1
  SourceAddress          : 127.0.0.1
  PingSucceeded          : True
  PingReplyDetails (RTT) : 0 ms
  TcpTestSucceeded       : False
  ```
- **Configuration Analysis (`docker-compose.yml`):**
  - Line 152–153: `ports: - "8092:8092"`
  - Protocol: Unencrypted HTTP/1.1
- **Normative Standards Check (RFC 6797 §7.2):**
  - *"An HTTP host that is not an HTTPS host MUST NOT send an HSTS header field... If an HTTP host sends an HSTS header field over HTTP, the user agent MUST ignore it."*
- **Empirical Determination:** Ingress transport is cleartext HTTP. No TLS certificate or SSL termination reverse proxy is running. Browsers will discard any HSTS headers emitted over HTTP.
- **Evidence Result:** **`PARTIALLY_VERIFIED / BLOCKED_BY_ENVIRONMENT`**.

---

### 2.2 EVD-BLK-02: Downstream Revenue Container & TestController Census
- **Blocker ID:** `BLK-CANON-02`
- **Correlated Findings:** `SAST-021`, `EXP-021`, `EV-008`, `EVD-GATEB-02`
- **Evaluation Command:** `docker ps -a --filter "name=revenue"`
- **Execution Timestamp:** `2026-11-05T15:18:21+05:30`
- **Raw Probe Output:**
  ```text
  CONTAINER ID   IMAGE                          COMMAND   CREATED      STATUS                   PORTS       NAMES
  d9f41a9feba0   lgd-active-new-revenue:latest  ""        3 days ago   Exited (0) 6 hours ago   18062/tcp   revenue
  ```
- **Application Startup Log Trace:**
  ```text
  2026-11-05 09:14:12.302 [main] INFO  c.z.h.HikariDataSource - HikariPool-1 - Starting...
  2026-11-05 09:14:14.518 [main] ERROR c.z.h.p.HikariPool - HikariPool-1 - Exception during pool initialization.
  org.postgresql.util.PSQLException: Connection to host.docker.internal:5432 refused.
  	at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:342)
  	at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:54)
  2026-11-05 09:14:14.530 [main] ERROR o.s.b.SpringApplication - Application run failed
  ```
- **Source Inspection (`revenue/.../TestController.java`):**
  - `@Profile({"dev", "test"})` is present on class declaration.
  - In `docker-compose.yml`, `revenue` environment is `SPRING_PROFILES_ACTIVE: prod`.
- **Empirical Determination:** While source code confirms profile-gating, container runtime steady-state could not be established because HikariCP pool initialization failed against offline PostgreSQL. Private port 18062 cannot be queried for `/actuator/mappings` census while container is terminated.
- **Evidence Result:** **`PARTIALLY_VERIFIED / BLOCKED_BY_ENVIRONMENT`**.

---

### 2.3 EVD-BLK-03: Host PostgreSQL 14 Native Service Status & Socket Reachability
- **Blocker ID:** `BLK-CANON-03`
- **Correlated Findings:** `VULN-009`, `VULN-017`, `EVD-GATEB-03`
- **Evaluation Commands:**
  1. `Get-Service -Name *postgres*`
  2. `Test-NetConnection -ComputerName 127.0.0.1 -Port 5432`
- **Execution Timestamp:** `2026-11-05T15:18:31+05:30`
- **Raw Service Query Output:**
  ```text
  Status   Name               DisplayName
  ------   ----               -----------
  Stopped  postgresql-x64-14  postgresql-x64-14 - PostgreSQL Server.
  ```
- **Raw Socket Connectivity Output:**
  ```text
  WARNING: TCP connect to (127.0.0.1 : 5432) failed
  ComputerName           : 127.0.0.1
  RemoteAddress          : 127.0.0.1
  RemotePort             : 5432
  InterfaceAlias         : Loopback Pseudo-Interface 1
  SourceAddress          : 127.0.0.1
  PingSucceeded          : True
  PingReplyDetails (RTT) : 0 ms
  TcpTestSucceeded       : False
  ```
- **Empirical Determination:** The native host PostgreSQL 14 service is stopped. TCP port 5432 is closed. Applications attempting to connect to `host.docker.internal:5432` fail immediately with connection refusal. Operational rules prohibit unilateral service activation.
- **Evidence Result:** **`BLOCKED_BY_ENVIRONMENT`**.

---

### 2.4 EVD-BLK-04: Formal Governance Instrument Verification
- **Blocker ID:** `BLK-CANON-04`
- **Correlated Findings:** `RR-01` through `RR-11` (Gate C Governance)
- **Evaluation Target:** [`GATE_C_DAA_CISO_APPROVAL_REQUEST.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/GATE_C_DAA_CISO_APPROVAL_REQUEST.md)
- **Execution Timestamp:** `2026-11-05T15:30:00+05:30`
- **Inspection Assessment:**
  - Section 4 Signature Blocks for Designated Approving Authority (DAA) and Chief Information Security Officer (CISO) are presently blank (`[Pending Formal Execution]`).
  - Pursuant to Governance Transition Rules 11–18, Gate C cannot be promoted to PASS without verified physical or digital signatures from appointed executive authorities.
- **Evidence Result:** **`PENDING_FORMAL_ACCEPTANCE`**.

---

## 3. Summary of Runtime Verification Status

```
========================================================================================================
PHASE 6 RUNTIME EVIDENCE RECONCILIATION
========================================================================================================
Evidence ID  Target Requirement                         Evaluated Condition           Status
--------------------------------------------------------------------------------------------------------
EVD-BLK-01   Perimeter TLS & HSTS over HTTPS (EXP-016)   Cleartext HTTP port 8092      OPEN / PARTIAL
EVD-BLK-02   Revenue Container Direct Probe (EXP-021)   Container revenue Exited      OPEN / PARTIAL
EVD-BLK-03   PostgreSQL 14 Host Availability (Port 5432) Service Stopped / Closed      OPEN / BLOCKED
EVD-BLK-04   DAA / CISO Signed Risk Memo (RR-01..11)     Signature blocks blank        OPEN / PENDING
========================================================================================================
```

$$\mathbf{FINAL\ TECHNICAL\ VERIFICATION\ RULING:\ GATE\ B\ HOLD\ (MANDATORY)}$$

