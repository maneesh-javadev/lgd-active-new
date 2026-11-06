# LGD 2.0 — Phase 8.1 Canonical Blocker Register
## Authoritative Foundation Blocker Forensic Analysis, Technical Evidence Criteria & Governance Register

| **Blocker Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Phase** | Phase 8.1 — Independent Audit Reconciliation & Security Controller Finalization |
| **Document ID** | `LGD2-P8.1-BLK-REG` |
| **File Location** | `SECURITY_AUDIT_CONTROLLER/PHASE_8_1_CANONICAL_BLOCKER_REGISTER.md` |
| **Author / Auditor Role** | Principal Application Security Auditor, Independent Assessment Lead & DevSecOps Auditor |
| **Evaluation Timestamp** | November 6, 2026 (`2026-11-06T10:00:00+05:30`) |
| **Tracked Entities** | 4 Canonical Foundation Blockers (`BLK-CANON-01` through `BLK-CANON-04`) |
| **Active Environmental Holds** | 3 Open Technical Blockers (`BLK-CANON-01`, `BLK-CANON-02`, `BLK-CANON-03`) holding Gate B |
| **Active Governance Holds** | 1 Open Executive Blocker (`BLK-CANON-04`) holding Gate C |
| **Governing Policy** | **ANTI-CONFLATION & ZERO-FABRICATION MANDATE: BLOCKERS CANNOT BE COLLAPSED OR PREMATURELY CLOSED.** |

---

## 1. Blocker Governance Architecture & Anti-Conflation Policy

During the Phase 6 and Phase 8 security audits, a critical governance requirement was established:
1. **Segregation of Namespaces:** Foundational infrastructure blockers (`BLK-CANON-01` through `04`) must remain strictly isolated from localized phase delivery criteria (`BLK-P6-01` through `04`).
2. **Anti-Promotion Standard:** No blocker may be marked as resolved based on code review, unit test passes, or theoretical architectural proposals. Resolution mandates direct empirical evidence.
3. **Operational Isolation:** In compliance with Section 3.2 of the Phase 8.1 Directive, the audit team is not authorized to start Windows services, reconfigure Docker containers, or modify ingress infrastructure. Consequently, all physical environmental blockers are strictly preserved on **`HOLD`**.

```
========================================================================================================
                          CANONICAL BLOCKER STATUS DASHBOARD
========================================================================================================
  Blocker ID      Canonical Description                         Governing Gate   Evaluated Status
  ------------------------------------------------------------------------------------------------------
  BLK-CANON-01    Perimeter Ingress HTTPS/TLS & HSTS Efficacy    Gate B (Tech)    OPEN / PARTIALLY_VERIFIED
  BLK-CANON-02    Revenue Runtime Container & Mapping Census    Gate B (Tech)    OPEN / PARTIALLY_VERIFIED
  BLK-CANON-03    PostgreSQL 14 Service Runtime Availability    Gate B (Tech)    OPEN / BLOCKED_BY_ENV
  BLK-CANON-04    DAA / CISO Executive Risk Acceptance (RR01-11) Gate C (Gov)     OPEN / PENDING_ACCEPTANCE
========================================================================================================
```

---

## 2. In-Depth Forensic Analysis of the Four Canonical Blockers

### 2.1 BLK-CANON-01: Perimeter Ingress HTTPS/TLS & HSTS Transport Security

| Forensic Attribute | Technical Specification |
|:---|:---|
| **Canonical Identifier** | **`BLK-CANON-01`** |
| **Associated Vulnerability IDs** | `SAST-016`, `EXP-016`, `VULN-016`, `EV-006` |
| **Impacted Release Gate** | **Gate B (Technical Verification & Environmental Security)** |
| **Accountable Owner Role** | Lead Perimeter Security & DevOps Engineer |
| **Fresh Evidence Reference** | `EVD_P8_07_DOCKER_CONTAINER_CENSUS.txt`, `EVD_P8_1_03_BLOCKER_FORENSIC_PROBE.txt` |
| **Current Reconciled Status** | **`OPEN / PARTIALLY_VERIFIED`** |

#### A. Current Observed Physical State:
1. In `docker-compose.yml`, `api-gateway` publishes port `8092:8092` to the host network interface.
2. Fresh TCP probing (`EVD_P8_1_03`) confirms port `443` is closed (`TcpTestSucceeded = False`).
3. When the container stack was active, dispatched HTTP requests against `http://localhost:8092` returned:
   ```http
   HTTP/1.1 200 OK
   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
   ```
4. No TLS termination reverse proxy (Nginx, Envoy, Traefik) exists in front of the gateway, and Spring Cloud Gateway is not configured with an SSL keystore on port `8443`.

#### B. The Technical & Cryptographic Defect:
Under **RFC 6797 Section 7.2 (HSTS Processing Rules)**:
> *"An HTTP host that is not an HTTPS host MUST NOT send an HSTS header field... If an HTTP host sends an HSTS header field over HTTP, the user agent MUST ignore it."*

Emitting `Strict-Transport-Security` over an unencrypted cleartext HTTP channel provides zero transport security. Compliant browsers and vulnerability scanners silently discard the header. The application remains vulnerable to cleartext traffic interception, session hijacking, and man-in-the-middle SSL stripping.

#### C. Required Evidence for Closure:
To clear `BLK-CANON-01`, operations must provide the following empirical evidence artifacts:
1. **Verified TLS Termination:** Deployment of a reverse proxy or gateway listener terminating TLS 1.3 / TLS 1.2 modern cipher suites.
2. **Valid Certificate Chain:** Proof of a valid, trusted CA-signed x509 certificate chain (with subject matching the platform domain, valid expiration date, and verified SAN).
3. **HTTPS Enforcement & Redirection:** Verification that cleartext HTTP requests on port 80/8092 are unconditionally redirected via HTTP 301/308 to HTTPS.
4. **Backend Port Isolation:** Direct external access to raw backend port `8092` blocked at the firewall or Docker host interface (bound strictly to internal network).
5. **Trusted Forwarded-Header Configuration:** Correct configuration of `X-Forwarded-Proto: https` and `X-Forwarded-For` with trusted proxy CIDRs configured in Spring Cloud Gateway.
6. **HSTS Efficacy over HTTPS:** Captured response headers over `https://<domain>/` demonstrating that user agents receive and process `Strict-Transport-Security` over a secure channel.

---

### 2.2 BLK-CANON-02: Downstream Revenue Container & TestController Census

| Forensic Attribute | Technical Specification |
|:---|:---|
| **Canonical Identifier** | **`BLK-CANON-02`** |
| **Associated Vulnerability IDs** | `SAST-021`, `EXP-021`, `EV-008`, `EVD-GATEB-02` |
| **Impacted Release Gate** | **Gate B (Technical Verification & Environmental Security)** |
| **Accountable Owner Role** | Backend Integration & AppSec Specialist |
| **Fresh Evidence Reference** | `EVD_P8_07_DOCKER_CONTAINER_CENSUS.txt`, `EVD_P8_1_03_BLOCKER_FORENSIC_PROBE.txt` |
| **Current Reconciled Status** | **`OPEN / PARTIALLY_VERIFIED`** |

#### A. Current Observed Physical State:
1. Source inspection confirms `TestController.java` in `revenue` has `@Profile({"dev", "test"})`.
2. API Gateway routing rules do not forward `/test/*` paths, returning HTTP 403/404 at the perimeter.
3. Direct physical inspection of Docker container `revenue` (`d9f41a9feba0`) reveals status **`Exited (0)`**.
4. Direct container port `18062` is completely unreachable (`Connection refused`).

#### B. The Technical & Runtime Defect:
A static code annotation or gateway routing rule does not establish runtime bean omission:
1. **The 404 Fallacy:** A `404 Not Found` response from `http://revenue:18062/test/api1` alone does **not** prove the controller is absent. A 404 response can be triggered by URL pattern mismatch, servlet context prefix, HTTP method mismatch, or security filter drops.
2. **Actuator Mapping Requirement:** The only authoritative proof of controller bean omission is extracting the live Spring Boot Actuator endpoint mapping table (`GET /actuator/mappings`) from the running application context and proving zero routes registered for `TestController`.
3. **Runtime Barrier:** Because the `revenue` container cannot start without PostgreSQL (`BLK-CANON-03`), live container inspection cannot be executed.

#### C. Required Evidence for Closure:
1. **Container Runtime Steady-State:** Docker container `revenue` running continuously in `Up` status for $\ge 5$ minutes under production profile (`-Dspring.profiles.active=prod`).
2. **Internal Endpoint Mapping Census:** Direct dump of `http://localhost:18062/actuator/mappings` or `docker exec` probe proving zero mapping for `in.nic.lgd.revenue.controller.TestController`.
3. **Actual Controller Exposure Check:** Direct HTTP GET request to `http://localhost:18062/test/api1` returning connection refusal or application-level 404 accompanied by verified Actuator census.
4. **Actuator Access Restrictions:** Verification that `/actuator/*` endpoints are protected, restricted to internal administrative loopback, or disabled in production.

---

### 2.3 BLK-CANON-03: Host PostgreSQL 14 Availability & Revenue Steady-State

| Forensic Attribute | Technical Specification |
|:---|:---|
| **Canonical Identifier** | **`BLK-CANON-03`** |
| **Associated Vulnerability IDs** | `VULN-009`, `VULN-017`, `EVD-GATEB-03` |
| **Impacted Release Gate** | **Gate B (Technical Verification & Environmental Security)** |
| **Accountable Owner Role** | Lead Database Administrator & Infrastructure Lead |
| **Fresh Evidence Reference** | `EVD_P8_06_POSTGRESQL_SERVICE_PROBE.txt`, `EVD_P8_1_03_BLOCKER_FORENSIC_PROBE.txt` |
| **Current Reconciled Status** | **`OPEN / BLOCKED_BY_ENVIRONMENT`** |

#### A. Current Observed Physical State:
1. Windows Service Control Manager probe executed (`Get-Service -Name '*postgres*'`).
2. Native service `postgresql-x64-14` (PostgreSQL Server 14) is in status **`Stopped`**.
3. Network connection probe (`Test-NetConnection -Port 5432`) returns **`TcpTestSucceeded : False`**.
4. Docker container `revenue` startup logs record fatal HikariCP failure:
   ```
   org.postgresql.util.PSQLException: Connection to host.docker.internal:5432 refused.
   Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
   ```
5. Container exits immediately upon database connection failure.

#### B. The Technical & Operational Barrier:
In strict compliance with Section 3.2 of the Phase 8.1 Directive (*"Do not start or stop services. Do not start PostgreSQL or Docker containers. Perform static inspection and analyze existing evidence only"*), the auditor cannot start Windows services. The database remains offline until administrative operations personnel execute service startup.

#### C. Required Evidence for Closure:
1. **Database Service Status:** Native Windows service `postgresql-x64-14` running in status `Running` (`StartType: Automatic`).
2. **TCP Connectivity:** TCP probe confirming port 5432 is listening on `127.0.0.1` and `host.docker.internal`.
3. **Authenticated Database Connection:** Successful connection pool initialization using configured application credentials (`${SPRING_DATASOURCE_USERNAME}`, `${SPRING_DATASOURCE_PASSWORD}`).
4. **Application Connectivity:** Microservice startup logs confirming HikariCP connection pool acquisition (`HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection`).
5. **Schema & Migration Verification:** Verification that the `lgd_revenue` database schema and Liquibase/Flyway migrations are applied and accessible.

---

### 2.4 BLK-CANON-04: Formal Executive DAA / CISO Residual Risk Authorization

| Forensic Attribute | Technical Specification |
|:---|:---|
| **Canonical Identifier** | **`BLK-CANON-04`** |
| **Associated Vulnerability IDs** | `RR-01` through `RR-11`, Release Gate C Governance |
| **Impacted Release Gate** | **Gate C (Executive Governance & Production Release Authorization)** |
| **Accountable Owner Role** | Designated Approving Authority (DAA) & Chief Information Security Officer (CISO) |
| **Fresh Evidence Reference** | `SECURITY_AUDIT_CONTROLLER/PHASE_8_RISK_ACCEPTANCE_MEMORANDUM.md` |
| **Current Reconciled Status** | **`OPEN / PENDING_FORMAL_ACCEPTANCE`** |

#### A. Current Observed Governance State:
1. The comprehensive Risk Acceptance Memorandum (`PHASE_8_RISK_ACCEPTANCE_MEMORANDUM.md`) has been fully drafted, itemizing all eleven residual risks (`RR-01` through `RR-11`), their inherent severity, compensating controls, and remediation roadmaps.
2. Forensic inspection confirms that Section 4 of the memorandum contains blank signature placeholders (`DAA Signature Present: False`, `CISO Signature Present: False`).
3. No counter-signed approvals, executive directives, or Architecture Review Board (ARB) minutes have been provided.

#### B. The Governance Boundary:
Audit rules strictly prohibit simulated signatures or synthetic approvals:
- Technical remediation does not equal risk acceptance.
- Unit test passes do not waive governance oversight.
- Release Gate C must remain on **`PENDING_FORMAL_ACCEPTANCE`** until genuine, un-simulated signatures are executed by the DAA and CISO.

#### C. Required Evidence for Closure:
1. **Memorandum Status:** Formally submitted to the DAA and CISO.
2. **Proposed Acceptance:** Verified itemization of risks `RR-01` through `RR-11`.
3. **Actual Approval:** Counter-signed signature blocks from both executive authorities.
4. **Signatory Verification:** Confirmation of legal authority (DAA, Ministry of Panchayati Raj / NIC; CISO, Enterprise Directorate).
5. **Approval Date & Expiration:** Documented signature execution date and 90-day re-evaluation schedule.
6. **Scope & Conditions:** Formally recorded directives, operational conditions, and compensatory monitoring mandates.

---

## 3. Road to Resolution Matrix

$$\begin{array}{|l|l|l|l|}
\hline
\textbf{Blocker ID} & \textbf{Responsible Team} & \textbf{Prerequisite Action} & \textbf{Gate Cleared} \\
\hline
\text{BLK-CANON-03} & \text{Host Database Admin} & \text{Execute: } \texttt{Start-Service postgresql-x64-14} & \text{Step 1 of Gate B} \\
\text{BLK-CANON-02} & \text{DevOps / AppSec} & \text{Restart Compose stack; capture } \texttt{/actuator/mappings} & \text{Step 2 of Gate B} \\
\text{BLK-CANON-01} & \text{Perimeter DevOps} & \text{Deploy TLS proxy on 443; redirect HTTP; verify HSTS} & \text{Step 3 of Gate B} \\
\text{BLK-CANON-04} & \text{DAA \& CISO} & \text{Convene ARB; review \& counter-sign Risk Memorandum} & \text{Gate C} \\
\hline
\end{array}$$

---
*Register certified independently by the Principal Application Security Auditor.*

