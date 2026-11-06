# LGD 2.0 — Final Staging Deployment Runbook
## Production-Grade Staging Deployment Procedure, Resource Constraints, and Perimeter Ingress Architecture

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Location** | `SECURITY_AUDIT_CONTROLLER/FINAL_STAGING_DEPLOYMENT_RUNBOOK.md` |
| **Controller Baseline** | Version 2.0.0 (Final Security Remediation & Staging Readiness) |
| **Evaluation Date** | November 6, 2026 |
| **Target Environment** | Staging / Pre-Production Multi-Host Container Cluster |

---

## 1. Staging Architecture & Deployment Topology

The staging environment replicates the production security posture with perimeter TLS termination, hardened microservice containers, non-root execution, and network isolation:

```mermaid
flowchart TD
    Client["HTTPS Client (Browser / External API)"] -->|Port 443 / TLS 1.3| Nginx["Nginx Reverse Proxy\n(nginx:1.26-alpine)\nTerminates TLS & Enforces HSTS"]
    Nginx -->|HTTP (Internal Overlay)| Gateway["API Gateway\n(Port 8092 Internal)\nno-new-privileges / UID 10001"]
    Gateway -->|Internal Routing| Discovery["Service Discovery (8761)"]
    Gateway -->|JWT Authenticated| Auth["Auth Service (8081)"]
    Gateway -->|RBAC Protected| UM["User Management (8082)"]
    Gateway -->|RBAC Protected| Rev["Revenue Service (8083)"]
    UM & Rev -->|SCRAM-SHA-256| Postgres[("PostgreSQL 14\n(Host Native / TLS)")]
    Auth & UM & Rev -->|Auth / Lettuce| Redis[("Redis Sentinel Cluster\n(Pinned Digest: 8.10.3)")]
```

---

## 2. Container Image Registry & Cryptographic Inventory

All microservice images must be tagged and verified against their respective build artifacts prior to deployment:

| Service Module | Container Image Tag | Base Image | Non-Root UID | Packaging JAR SHA-256 Checksum |
|:---|:---|:---|:---:|:---|
| **discovery** | `lgd-active-new-service-discovery:latest` | `eclipse-temurin:21-jdk-alpine` | 10001 | `7D9CA0E66365375FD16BA708E4C7A3A100CDC739C87F1A632CE408FF29BEB677` |
| **auth-service** | `lgd-active-new-auth-service:latest` | `eclipse-temurin:21-jdk-alpine` | 10001 | `7A42CB99D180D7DF1ADBB5C7705AED43048528839D28CE6A856B7878FB61AA6E` |
| **revenue** | `lgd-active-new-revenue:latest` | `eclipse-temurin:21-jdk-alpine` | 10001 | `5C6097F1269609CD09011AFF80800826F472D2B9B7F35A6149882C8E7CDA5088` |
| **api-gateway** | `lgd-active-new-api-gateway:latest` | `eclipse-temurin:21-jdk-alpine` | 10001 | `D6A0DEE1B9A15B7B58A6016A6156781C54C034A36A2B766C588C0ADCC8C76468` |
| **user-management**| `lgd-active-new-user-management:latest` | `eclipse-temurin:21-jdk-alpine` | 10001 | `BEE8EBAC82984E8AFBDA3864972BC5905D129C7C48CAF8FBF8CCFDE316D1C44D` |

---

## 3. Resource Constraints & Container Limits

Production orchestration via `docker-compose.prod.yml` enforces strict CPU and memory resource limits:

| Container Service | Memory Reservation | Memory Hard Limit | CPU Reservation | CPU Quota (Limit) |
|:---|:---:|:---:|:---:|:---:|
| **`service-discovery`** | 512 MB | 1024 MB | 0.25 cores | 0.50 cores |
| **`auth-service`** | 512 MB | 1024 MB | 0.50 cores | 1.00 cores |
| **`user-management`** | 768 MB | 1536 MB | 0.50 cores | 1.00 cores |
| **`revenue`** | 768 MB | 1536 MB | 0.50 cores | 1.00 cores |
| **`api-gateway`** | 512 MB | 1024 MB | 0.50 cores | 1.00 cores |
| **`nginx`** | 128 MB | 256 MB | 0.10 cores | 0.50 cores |
| **`redis`** | 256 MB | 512 MB | 0.25 cores | 0.50 cores |

---

## 4. Staging Deployment Execution Steps

### Phase 1: Pre-Flight Environment Validation
1. Verify TLS certificates are present in `/etc/ssl/certs/lgd/` (`fullchain.pem` and `privkey.pem`).
2. Verify Redis Sentinel nodes are healthy and responding to PING.
3. Verify PostgreSQL database schemas and migrations are up to date.

### Phase 2: Deploy Ingress & Container Infrastructure
Execute on the staging host:
```bash
# 1. Pull / verify pinned Redis digest
podman pull docker.io/library/redis@sha256:21090af93f8324db2f0f0f4f38a7c60369d47d917e000c3423d89d2ae2883537

# 2. Build or pull production microservice images
podman compose -f docker-compose.prod.yml build

# 3. Launch stack in detached mode
podman compose -f docker-compose.prod.yml up -d
```

### Phase 3: Post-Deployment Smoke Verification
```bash
# 1. Verify container runtime health
podman compose -f docker-compose.prod.yml ps

# 2. Verify Nginx port 443 TLS handshake & HSTS header
curl -k -I https://staging.lgd.gov.in/

# Expected Response Headers:
# HTTP/1.1 200 OK (or 404 for unmapped root)
# Strict-Transport-Security: max-age=31536000; includeSubDomains
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY

# 3. Verify cleartext HTTP port 80 redirect
curl -I http://staging.lgd.gov.in/
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://staging.lgd.gov.in/

# 4. Verify API Gateway port 8092 is NOT accessible externally
nc -zv staging.lgd.gov.in 8092
# Expected: Connection refused or timed out
```

---

## 5. Deployment Abort & Rollback Triggers

If any of the following conditions occur during post-deployment verification, halt the rollout immediately and execute [`FINAL_ROLLBACK_RUNBOOK.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_AUDIT_CONTROLLER/FINAL_ROLLBACK_RUNBOOK.md):
- Any microservice container experiences restart loops (`CrashLoopBackOff` or exit code $\ne 0$).
- Actuator health check reports `DOWN` for database or Redis connections.
- Ingress TLS handshake fails or HSTS headers are absent.
- API Gateway returns `HTTP 502 Bad Gateway` on core authentication endpoints.

