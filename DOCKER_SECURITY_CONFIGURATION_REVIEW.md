# LGD 2.0 — Docker Security Configuration Review & Deployment Reconciliation

| **Document Version** | 1.0.0 (Mandatory External Audit Closure Review) |
|---|---|
| **Platform** | Local Government Directory 2.0 (LGD 2.0) |
| **Repository Path** | `e:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Auditor Role** | Senior DevSecOps Engineer & Principal Security Architect |
| **Date** | October 30, 2026 |
| **Audit Status** | **RECONCILED & HARDENED (AUTHORITATIVE SPECIFICATION ESTABLISHED)** |

---

## 1. Executive Summary & Assessment Scope

During the external security review of the October 30, 2026 Phase 0–3 closure package, multiple deployment configuration inconsistencies, unhardened compose variants, and erroneous network topology claims were identified across the repository's container orchestration manifests.

This review provides a complete comparative audit of all Docker Compose manifests, resolves configuration discrepancies, establishes an authoritative production baseline, and documents the factual network topology.

### Inspected Docker Compose Artifacts:
1. `docker-compose.yml` (Root repository deployment specification)
2. `docker-compose(4).yml` (Legacy unhardened iteration reviewed during external audit)
3. `final-docker-compose-file.txt` (Legacy 9-service unhardened deployment template)
4. `staging_backup/docker-compose.yml` (Pre-remediation historical baseline compose)
5. `docker-compose.prod.yml` (Authoritative Production Override Specification)
6. `docker-compose.dev.yml` (Authoritative Development-Only Local Loopback Override)

---

## 2. Comparative Analysis of Inspected Compose Manifests

| Inspection Criteria | `final-docker-compose-file.txt` (Legacy Template) | `docker-compose(4).yml` (External Review Ref) | `staging_backup/docker-compose.yml` | `docker-compose.yml` (Authoritative Production) | `docker-compose.dev.yml` (Development-Only) |
|:---|:---|:---|:---|:---|:---|
| **Services Defined** | 9 services (`service-discovery`, `auth-service`, `user-management`, `block`, `localbody`, `revenue`, `reports-dashboard`, `lgd-chatbot`, `api-gateway`) | 5 core microservices | 7 services (legacy monolithic) | 5 core active microservices (`service-discovery`, `auth-service`, `user-management`, `revenue`, `api-gateway`) | Extends 5 core microservices |
| **Internal Port Exposure** | **CRITICAL FLAW:** All 9 services bound to `0.0.0.0` (8761, 18090, 18089, 18064, 18063, 18062, 18065, 18068, 8092) | **CRITICAL FLAW:** All internal ports mapped to `0.0.0.0` | **CRITICAL FLAW:** All internal ports mapped to `0.0.0.0` | **ENFORCED SECURE:** **Zero published ports** for internal services. Only API Gateway exposes port `8092`. | **CONTROLLED DEV:** Ports published **strictly to `127.0.0.1`** (loopback only). |
| **Database Credentials** | Hardcoded username `postgres`, password `${SPRING_DATASOURCE_PASSWORD}` | Hardcoded username `postgres` | Not externalized | **ENFORCED SECURE:** Mandatory `${SPRING_DATASOURCE_USERNAME}` and `${SPRING_DATASOURCE_PASSWORD}` without default fallbacks. | Inherited from base compose |
| **Redis Authentication** | No password defined (unauthenticated) | No password defined | No password defined | **ENFORCED SECURE:** Mandatory `${SPRING_DATA_REDIS_PASSWORD}` without empty (`:-`) fallback. | Inherited from base compose |
| **Eureka Credentials** | Unauthenticated `http://service-discovery:8761/eureka/` | Unauthenticated | Unauthenticated | **ENFORCED SECURE:** Unified HTTP Basic credentials (`${EUREKA_USERNAME}:${EUREKA_PASSWORD}`) across server & clients. | Inherited from base compose |
| **JWT Secret Injection** | Missing / Not defined | Hardcoded hex secret | Not externalized | **ENFORCED SECURE:** Mandatory `${JWT_SECRET}` (>=256 bits entropy) validated on startup. | Inherited from base compose |
| **eSign Keystore Secret** | Not defined | Not defined | Not defined | **ENFORCED SECURE:** Mandatory `${ESIGN_KEYSTORE_PASSWORD}` without fallback in `revenue`. | Inherited from base compose |
| **Topology Claim Accuracy** | Claims isolated network | Claims isolated network | No isolation claim | **FACTUAL TOPOLOGY:** `host.docker.internal` explicitly documented as host-gateway routing, NOT private Docker network isolation. | Inherited from base compose |

---

## 3. Reconciliation of 10 Specific Audit Requirements

### Requirement 1: Internal microservices must not be exposed on all host interfaces
- **Defect Identified:** Legacy compose manifests (`final-docker-compose-file.txt`, `docker-compose(4).yml`, and earlier iterations of `docker-compose.yml`) bound internal microservices to all host interfaces (`0.0.0.0:18090`, `0.0.0.0:18089`, `0.0.0.0:18062`, `0.0.0.0:8761`), completely subverting API Gateway perimeter controls, rate limiting, and access logging.
- **Correction Applied:** Removed all `ports:` mapping directives for internal microservices from the authoritative production `docker-compose.yml`. Microservices communicate exclusively through the internal Docker bridge network (`lgd-network`).

### Requirement 2: For production, remove published ports from internal services unless an explicitly approved operational requirement exists
- **Defect Identified:** Internal services had published ports without documented operational business justification.
- **Correction Applied:** In `docker-compose.yml`, ports for `service-discovery`, `auth-service`, `user-management`, and `revenue` have been completely removed. Only `api-gateway` publishes port `8092:8092`. Any direct traffic to internal services from outside Docker host is physically dropped by Docker daemon routing.

### Requirement 3: If local development requires host access, bind only to 127.0.0.1 and clearly label the configuration as development-only
- **Correction Applied:** Created dedicated development override manifest [docker-compose.dev.yml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/docker-compose.dev.yml).
- **Configuration Standard:**
  ```yaml
  # WARNING: DEVELOPMENT-ONLY CONFIGURATION — NEVER DEPLOY TO PRODUCTION
  services:
    service-discovery:
      ports: ["127.0.0.1:8761:8761"]
    auth-service:
      ports: ["127.0.0.1:18090:18090"]
    user-management:
      ports: ["127.0.0.1:18089:18089"]
    revenue:
      ports: ["127.0.0.1:18062:18062"]
    api-gateway:
      ports: ["127.0.0.1:8092:8092"]
  ```

### Requirement 4: Remove empty Redis password fallbacks
- **Defect Identified:** Previous compose manifests utilized `${SPRING_DATA_REDIS_PASSWORD:-}`, providing an empty string fallback when the environment variable was omitted. This allowed microservices to connect to unauthenticated Redis instances without throwing a configuration error.
- **Correction Applied:** Eliminated `:-` fallback across all services in `docker-compose.yml`:
  ```yaml
  SPRING_DATA_REDIS_PASSWORD: ${SPRING_DATA_REDIS_PASSWORD}
  ```
  If `SPRING_DATA_REDIS_PASSWORD` is unset in the environment, container startup warns or fails closed.

### Requirement 5: Require database credentials without a default production username or password
- **Defect Identified:** Previous compose manifests defaulted `SPRING_DATASOURCE_USERNAME` to `postgres` via `${SPRING_DATASOURCE_USERNAME:-postgres}`.
- **Correction Applied:** Eliminated `:-postgres` default username fallback. Database credentials now strictly enforce mandatory external injection:
  ```yaml
  SPRING_DATASOURCE_USERNAME: ${SPRING_DATASOURCE_USERNAME}
  SPRING_DATASOURCE_PASSWORD: ${SPRING_DATASOURCE_PASSWORD}
  ```
  In production runtime, `ProductionSecurityValidator.java` asserts that `spring.datasource.password` is non-blank and rejects known default passwords (`postgres`, `postgres@206`, `admin`).

### Requirement 6: Verify Eureka server credentials and client credentials use the same configured identity
- **Defect Identified:** In earlier manifests, `service-discovery` did not declare `EUREKA_USERNAME` and `EUREKA_PASSWORD` in its container `environment:` block, falling back to internal application defaults, while client services authenticated against `http://${EUREKA_USERNAME}:${EUREKA_PASSWORD}@service-discovery:8761/eureka/`. Under custom environment credentials, this caused authentication mismatch and client registration failure.
- **Correction Applied:** Added explicit credential environment variables to `service-discovery` in `docker-compose.yml`:
  ```yaml
  service-discovery:
    environment:
      EUREKA_USERNAME: ${EUREKA_USERNAME}
      EUREKA_PASSWORD: ${EUREKA_PASSWORD}
  ```
  Both the Eureka server and all client microservices (`auth-service`, `user-management`, `revenue`, `api-gateway`) now read the identical `EUREKA_USERNAME` and `EUREKA_PASSWORD` identity variables from the environment.

### Requirement 7: Verify JWT_SECRET is mandatory
- **Defect Identified:** Static fallback strings in earlier configurations allowed arbitrary token forgery.
- **Correction Applied:** Verified and enforced in `docker-compose.yml`:
  ```yaml
  JWT_SECRET: ${JWT_SECRET}
  ```
  No fallback string is present. `ProductionSecurityValidator.java` enforces that `JWT_SECRET` has at least 256 bits of cryptographic entropy and fails container startup under `prod` profile if missing or weak.

### Requirement 8: Verify ESIGN_KEYSTORE_PASSWORD is mandatory
- **Defect Identified:** `revenue` service omitted `ESIGN_KEYSTORE_PASSWORD` from its compose environment block, risking runtime fallback to classpath properties.
- **Correction Applied:** Added mandatory environment variable to `revenue` service in `docker-compose.yml`:
  ```yaml
  revenue:
    environment:
      ESIGN_KEYSTORE_PASSWORD: ${ESIGN_KEYSTORE_PASSWORD}
  ```
  Classpath properties fallback `:amITbPANCH@E` was completely excised from `esign.properties`.

### Requirement 9 & 10: Ensure PostgreSQL and Redis network isolation claims match actual topology and verify host.docker.internal is not incorrectly described as private Docker-network isolation
- **Critical Factual Correction:** Previous reports erroneously claimed: *"Microservices and PostgreSQL isolated to private Docker bridge (lgd-network)"*.
- **Actual Network Topology:**
  1. Microservices execute inside Docker containers attached to `lgd-network` (bridge).
  2. PostgreSQL (port 5432) and Redis (port 6379) are reached via `host.docker.internal` using `extra_hosts: ["host.docker.internal:host-gateway"]`.
  3. `host.docker.internal` routes network packets across the Docker virtual bridge interface out to the **container host OS network namespace**.
  4. **PostgreSQL and Redis DO NOT reside inside the private Docker bridge.** They run directly on the host or on external network nodes.
  5. Describing `host.docker.internal` as "private Docker-network isolation" was factually false and has been retracted from all audit registers.
- **Compensating Controls Required:**
  - Host OS firewall (iptables/nftables/Windows Advanced Firewall) must bind PostgreSQL (5432) and Redis (6379) to `127.0.0.1` or the specific `docker0` bridge gateway IP (`172.17.0.1`), preventing exposure on public/corporate interfaces (`0.0.0.0`).
  - Strong, non-default database and Redis authentication passwords must be enforced.
  - Wire encryption (`sslmode=require` / TLS) is required for production database transit.

---

## 4. Authoritative Deployment Architecture Reference

The definitive deployment architecture consists of:
1. **Base Manifest:** [docker-compose.yml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/docker-compose.yml) (Contains service definitions, inter-service networking, volumes, healthchecks, and strict environment parameterization without published internal ports).
2. **Production Override:** [docker-compose.prod.yml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/docker-compose.prod.yml) (Enforces `SPRING_PROFILES_ACTIVE=prod`, `restart: always`, resource limits).
3. **Development Override:** [docker-compose.dev.yml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/docker-compose.dev.yml) (Binds internal ports strictly to `127.0.0.1` for local debugging).
4. **Environment Template:** [.env.example](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/.env.example) (Standardized environment variable names with dummy placeholders; zero production secrets committed).

---

## 5. Deprecation Notice: `final-docker-compose-file.txt` and Legacy Files

The following files are formally classified as **DEPRECATED AND INSECURE**:
- `final-docker-compose-file.txt`: Contains hardcoded credentials, unauthenticated Eureka, and `0.0.0.0` port mappings for 9 services. Must **NOT** be used for any staging or production deployment.
- `staging_backup/docker-compose.yml`: Archived pre-remediation historical reference.

**AUTHORITATIVE COMMANDS:**
```bash
# Production Deployment
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Development / Local Inspection
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```
