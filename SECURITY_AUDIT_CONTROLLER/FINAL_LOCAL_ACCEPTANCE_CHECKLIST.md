# LGD 2.0 — Final Local Acceptance Checklist
## Granular Acceptance Verification Matrix: Automated Agent Proofs vs. Owner Operational Actions

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Location** | `SECURITY_AUDIT_CONTROLLER/FINAL_LOCAL_ACCEPTANCE_CHECKLIST.md` |
| **Controller Baseline** | Version 2.0.0 (Final Security Remediation & Staging Readiness) |
| **Evaluation Date** | November 6, 2026 |
| **Checklist Scope** | Local Execution & Handover Validation |

---

## 1. Structure of Acceptance Checklist

This checklist separates platform readiness verification into three explicit, non-overlapping categories:
1. **Group 1: Agent-Verified Automated Tests & Checks** (Empirically verified by the audit agent).
2. **Group 2: Owner-Executed Manual Functional Validation** (Interactive end-user / browser actions).
3. **Group 3: Environmental Tests Blocked by Stopped PostgreSQL Service** (Awaiting authorized maintenance window).

---

## 2. Group 1: Agent-Verified Automated Tests & Checks (100% VERIFIED)

| Item ID | Verification Check Description | Target Component | Verification Method | Status | Evidence Reference |
|:---:|:---|:---|:---|:---:|:---|
| **CHK-AG-01** | Full Clean Build of 5 Microservices | All Maven modules | `mvn clean package` | **PASS** | `EVD_FINAL_07_BUILD_ARTIFACTS.txt` |
| **CHK-AG-02** | Automated Regression Suite Census | 55 Test Suites | 423 / 423 Tests Passed | **PASS** | `EVD_FINAL_03_SUREFIRE_CENSUS.txt` |
| **CHK-AG-03** | Cryptographic SHA-256 Digest Calculation | 5 JAR Artifacts | `Get-FileHash -Algorithm SHA256` | **PASS** | `EVD_FINAL_07_BUILD_ARTIFACTS.txt` |
| **CHK-AG-04** | Container Build from Root Context | 5 Dockerfiles | `podman build -f <service>/Dockerfile .` | **PASS** | `EVD_FINAL_09_CONTAINER_IMAGES.txt` |
| **CHK-AG-05** | Container Non-Root UID 10001 Execution | 5 Container Images | `podman run --entrypoint id <image>` | **PASS** | `EVD_FINAL_09_CONTAINER_IMAGES.txt` |
| **CHK-AG-06** | Lettuce Redis Client Customizer Bean | `revenue`, `user-mgmt` | AST Inspection of `RedisConfig.java` | **PASS** | `EVD_FINAL_02_CODE_DIFF.txt` |
| **CHK-AG-07** | Revenue 40-Route Census AST Test | `revenue` / `TestController` | Reflection & MockMvc (5/5 PASS) | **PASS** | `TestController40RouteCensusSecurityTest.java` |
| **CHK-AG-08** | Nginx Ingress TLS & HSTS Config | `nginx/nginx.conf` | RFC 6797 syntax validation | **PASS** | `EVD_FINAL_02_CODE_DIFF.txt` |
| **CHK-AG-09** | Pinned Redis 8.10.3 Digest Configuration | `docker-compose.yml` | Immutable sha256 digest verification | **PASS** | `EVD_FINAL_02_CODE_DIFF.txt` |
| **CHK-AG-10** | Production Gateway Port 8092 Unmapping | `docker-compose.prod.yml` | `ports: []` perimeter containment | **PASS** | `EVD_FINAL_02_CODE_DIFF.txt` |

---

## 3. Group 2: Owner-Executed Manual Functional Validation (QUEUED FOR OWNER)

| Item ID | Operational Action Description | Target Endpoint / UI | Expected Operational Behavior | Owner Role |
|:---:|:---|:---|:---|:---:|
| **CHK-OWN-01** | React Single-Page Application Authentication | `http://localhost:3000/login` | User logs in successfully; JWT received and stored securely in memory/cookie. | Frontend QA |
| **CHK-OWN-02** | Multi-Factor Authentication (MFA) Verification | `/api/v1/auth/mfa/verify` | TOTP/SMS OTP validated; session upgraded to authenticated. | Security QA |
| **CHK-OWN-03** | End-to-End User Creation & Role Assignment | `/api/v1/users/create` | Administrator creates new user; roles mapped; audit log generated. | Operations Lead |
| **CHK-OWN-04** | Document Upload & eSign Digital Signing | `/api/v1/revenue/esign` | PDF document uploaded, XML signature applied, and signature verified. | Business Analyst |
| **CHK-OWN-05** | Token Blacklist Dynamic Revocation | `/api/v1/auth/logout` | Token added to Redis blacklist; subsequent requests with token fail (401). | SecOps Engineer |

---

## 4. Group 3: Environmental Tests Blocked by Stopped PostgreSQL (BLOCKED BY ENV)

| Item ID | Blocked Operational Action | Root Cause Blocker | Action Required to Unblock | Blocker ID |
|:---:|:---|:---|:---|:---:|
| **CHK-BLK-01** | Local Native Database Service Startup | Service `postgresql-x64-14` is stopped | Administrator executes `Start-Service -Name postgresql-x64-14` in maintenance window | `BLK-CANON-03` |
| **CHK-BLK-02** | Live Revenue Container Steady State Launch | Depends on running PostgreSQL database | Start database, then execute `docker compose up -d revenue` | `BLK-CANON-03` |
| **CHK-BLK-03** | Physical Live HTTP Probe on `:18062/test/*` | Revenue container must be running in prod | Run probe `curl -k -I http://localhost:18062/test/ping` -> verify HTTP 404 | `BLK-CANON-02` |
| **CHK-BLK-04** | Live Perimeter Ingress TLS & HSTS Verification | Depends on live Nginx reverse proxy | Run probe `curl -k -I https://localhost:443/` -> verify HSTS header | `BLK-CANON-01` |
| **CHK-BLK-05** | Dynamic SCRAM & TLS Query via `pg_stat_ssl` | PostgreSQL service must be running | Execute SQL telemetry query: `SELECT * FROM pg_stat_ssl;` | `DISC-P914-05` |

### Telemetry Verification SQL Script (To be executed post-startup):
```sql
-- Execute in psql or pgAdmin connected to postgresql-x64-14:
SELECT 
    pid, 
    usename, 
    client_addr, 
    ssl, 
    version, 
    cipher, 
    bits 
FROM pg_stat_ssl 
JOIN pg_stat_activity USING (pid) 
WHERE datname = 'lgd_db';
```

---

## 5. Acceptance Attestation Summary

- **Automated Validation:** 10 / 10 Automated checks passed (100%).
- **Manual QA Actions:** 5 / 5 Actions prepared and queued for owner.
- **Environmental Actions:** 5 / 5 Actions explicitly mapped to canonical blockers pending authorized DBA maintenance window.

