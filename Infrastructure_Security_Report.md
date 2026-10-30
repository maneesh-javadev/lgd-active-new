# LGD 2.0 - Infrastructure & Container Security Report

| **Document Version** | 1.0.0 |
| **Audit Date** | October 2026 |
| **Scope** | Docker Compose, Microservice Dockerfiles, Eureka Discovery, PostgreSQL, Redis, Network Ingress |

---

## 1. Executive Summary

This report assesses the deployment architecture, container security configurations, virtualization layer, and database connectivity of the LGD 2.0 ecosystem. Core focus areas include:
- Container process privilege minimization (root vs. unprivileged user execution).
- Internal vs. external network surface isolation.
- Service discovery protection and metadata integrity.
- Credential externalization and database access controls.

---

## 2. Infrastructure Security Evaluation

### 2.1 Container Virtualization & Privileges (Dockerfiles)
- **Baseline Risk:** All microservice Dockerfiles used `FROM eclipse-temurin:21-jdk` without declaring a non-root `USER`. Containers executed as UID 0 (`root`).
- **Impact:** If an attacker achieves code execution inside any container, they possess root capabilities within that container filesystem and increased potential for container escape.
- **Remediation Specification:**
  In each microservice `Dockerfile`, define a dedicated system user before the `ENTRYPOINT`:
  ```dockerfile
  RUN groupadd -r spring && useradd -r -g spring -u 1001 spring
  USER spring:spring
  ```

---

### 2.2 Network Boundary & Port Exposure (`docker-compose.yml`)
- **Baseline Risk:** Ports for internal services were exposed directly to the host machine interface:
  - `service-discovery`: 8761:8761
  - `auth-service`: 18090:18090
  - `user-management`: 18089:18089
  - `revenue`: 18062:18062
  - `api-gateway`: 8092:8092
- **Impact:** Attackers or rogue machines on the local network could directly query internal microservices, bypassing API Gateway filters, rate limits, and authentication checks.
- **Remediation Specification:**
  Remove public port bindings from internal microservices. Internal services communicate exclusively over the internal bridge network `lgd-network`.
  Only `api-gateway` exposes port `8092:8092` to external ingress traffic.

---

### 2.3 Service Discovery Security (Eureka)
- **Baseline Risk:** The Netflix Eureka server ran without authentication. Any container or host able to reach port 8761 could query all registered service instances, fetch IP addresses, or register rogue instances to poison service discovery routing.
- **Remediation Specification:**
  1. Add `spring-boot-starter-security` to `discovery/pom.xml`.
  2. Configure HTTP Basic Authentication with strong credentials in Eureka server.
  3. Update downstream services to register via `http://user:password@service-discovery:8761/eureka/`.

---

### 2.4 Database & Cache Security (PostgreSQL & Redis)
- **PostgreSQL Database:**
  - Credentials (`postgres@206`) and IP (`10.248.213.206`) were committed in plaintext in `application.properties`.
  - **Remediation:** Remove hardcoded credentials; supply database URL and credentials via encrypted environment variables (`SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}`).
  - **Transport Security:** Enforce SSL connection parameter (`?sslmode=verify-full`) between microservices and the database server.
- **Redis Cache & Blacklist:**
  - Staging Redis host `10.248.213.206:6379` lacked password authentication.
  - **Remediation:** Enable Redis `requirepass` authentication and enforce password verification across all Spring Data Redis configurations (`spring.data.redis.password=${REDIS_PASSWORD}`).

---

## 3. Infrastructure Hardening Checklist

| Area | Control | Status |
|---|---|---|
| **Container User** | Execute containers as unprivileged UID 1001 (`spring`) | Configured |
| **Port Exposure** | Remove host port publishing for internal microservices | Configured |
| **Ingress Control** | Enforce single ingress gateway (8092) for all client traffic | Implemented |
| **Service Discovery** | Require HTTP Basic Auth for Eureka registration & inspection | Planned |
| **Secrets Management** | Replace committed static passwords with environment secrets | Documented |
| **Transport Encryption** | Enforce TLS 1.3 on external gateway ingress and database links | Planned |
