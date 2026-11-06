# LGD 2.0 — Master Configuration Baseline
## Verified Safe Configuration, Toolchain Inventory & Nonsecret Environmental Baseline

| **Configuration Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Document Role** | Safe Nonsecret Configuration Baseline & Infrastructure Inventory |
| **Authoritative Sources** | Microservice `pom.xml` files, `docker-compose.yml`, `.env.example`, Git index, Phase 8 Reports |
| **Evaluation Timestamp** | November 6, 2026 (`2026-11-06T09:20:00+05:30`) |
| **Secret Sanitization Mandate** | **STRICT: ZERO SECRETS STORED. ONLY VARIABLE NAMES AND DESCRIPTIVE IDENTIFIERS RECORDED.** |
| **Mandatory Program Directive** | **PHASE 8 COMPLETED — 100% INDEPENDENT SECURITY VALIDATION & AUDIT CLOSURE (CONDITIONAL_READY).** |

---

## 1. Secret Sanitization & Confidentiality Safeguards

> [!CAUTION]
> **Strict Anti-Secret Mandate:** Under no circumstances are passwords, API tokens, JWT private/shared keys, keystore credentials, or cryptographic materials committed or stored in this baseline. This document records only **variable names, property keys, architectural mechanisms, and secure reference identifiers**.

---

## 2. Git Repository & Nested Module Commit References

All six nested repositories operate as independent Git repositories (not submodules). The table below captures the exact evaluated commit references:

| Repository / Module | Relative Directory Path | Working Branch | Inspected HEAD Commit Hash | Gitlink Index Commit (Root Index) | Working Tree State | Module Scope |
|:---|:---|:---:|:---:|:---:|:---|:---|
| **`Root Platform`** | `.` | `master` | `e2df50f8c30197144377a2f931a4b3fbf03aeb1c` | N/A (Root Index) | 53 Modified, 155 Untracked | LGD 2.0 Multi-Service Platform Root |
| **`api-gateway`** | `api-gateway/` | `dev` | `1e19cca2aface10f1561fda37d32efc144310fa9` | `e6d78e89fb28d46011a52a0c2a7398ad23d49a2a` | 5 Modified, 2 Untracked | Reactive API Gateway & Edge Security Filter |
| **`auth-service`** | `auth-service/` | `dev` | `2f3ab070da64f8675a8a6ea70b06eb522224e786` | `1aa920e8478cb264b81f1e80ddfbf3a79f9e2544` | 6 Modified, 0 Untracked | Authentication & JWT Issuance Service |
| **`discovery`** | `discovery/` | `dev` | `f7f7adcf50f6818c7477a1fc08f39351160d83a2` | `f7f7adcf50f6818c7477a1fc08f39351160d83a2` | 1 Modified, 1 Untracked | Netflix Eureka Service Registry |
| **`lgd-um`** | `lgd-um/` | `dev` | `d65c994083ca05c9c1f4badeef1d1d821817f4de` | `733315769c785fa66a1f80e50efc05957835c3b1` | 4 Modified, 1 Untracked | React User Management Web Application |
| **`revenue`** | `revenue/` | `master` | `6697a77d73a28a22765e1b750f6a085be8e32922` | `082ab515c84ceb6656a068c12a4d4f3557014994` | 16 Modified, 1 Untracked | Revenue, Drafts & e-Hastakshar Service |
| **`user-management`** | `user-management/` | `dev` | `a0017c536eee7cefa57845c30fa4d5210a4af9ce` | `3e761fbad810b6c3b79eb89f47ed9a20bc1fbe14` | 17 Modified, 5 Untracked | Core User, Role, and Privilege Management |
| **`lgd_react`** | `lgd_react/` | *N/A (No .git)* | *N/A* | `c15c8b0e5326e44e751afb2ab931e12a3ae7de95` | Static directory | **RETIRED FROM ACTIVE SCOPE (`RR-09`)** |

---

## 3. Verified Toolchain & Host Environment Baseline

| Tool / Runtime Component | Verified Version | Distribution / Vendor | Verified Host Installation Path |
|:---|:---|:---|:---|
| **Operating System** | Windows 11 Enterprise (Version 10.0, Build 26100, amd64) | Microsoft Corporation | Host Physical Architecture |
| **Java Development Kit (JDK)**| **Java 21.0.9 LTS** (Build 21.0.9+7-LTS-338) | Oracle Corporation (SE Environment) | `C:\Program Files\Java\jdk-21` |
| **Build Automation (Maven)** | **Apache Maven 3.9.12** | Apache Software Foundation | `E:\System\Projects\IDE\apache-maven-3.9.12` |
| **Node.js Runtime** | **Node.js v24.18.0** | OpenJS Foundation | System Environment PATH |
| **Node Package Manager (npm)**| **npm 11.16.0** | npm, Inc. | System Environment PATH |
| **Container Engine** | **Docker Engine 29.7.2** (Build a7dcaa6) | Docker Desktop / WSL2 Engine | Host Docker Socket |
| **Container Orchestration** | **Docker Compose v5.5.0** | Docker, Inc. | System Environment PATH |
| **Container Base Image** | `eclipse-temurin:21-jdk` | Eclipse Adoptium | Docker Hub Official Image |

---

## 4. Microservice Framework & Dependency Baseline

Authoritative Source: Microservice root `pom.xml` manifests

| Microservice | Spring Boot Parent | Spring Cloud BOM | Patched Tomcat Core | Patched Spring Security | Additional Hardened Libraries |
|:---|:---:|:---:|:---:|:---:|:---|
| **`api-gateway`** | `3.3.5` | `2023.0.3` | `10.1.34` | `6.3.8` | Resilience4j `2.2.0`, MapStruct `1.5.5.Final` |
| **`auth-service`** | `3.2.12` | `2023.0.1` | `10.1.34` | `6.3.8` | Lombok `1.18.48`, MapStruct `1.6.3` |
| **`discovery`** | `3.4.4` | `2024.0.1` | Embedded | Managed by Boot | Netflix Eureka Server `4.2.1` |
| **`revenue`** | `3.2.12` | `2023.0.1` | `10.1.34` | `6.3.8` | Apache Tika `3.2.3`, PDFBox `3.0.5`, MapStruct `1.5.5.Final` |
| **`user-management`**| `3.2.12` | `2023.0.1` | `10.1.34` | `6.3.8` | Apache Tika `3.2.3`, PDFBox `3.0.5`, Lombok `1.18.48`, MapStruct `1.6.3` |
| **`lgd-um` (Frontend)**| N/A (Vite / React) | N/A | N/A | N/A | React `18.3.1`, React Router DOM `7.18.4`, Chart.js `4.5.1`, Tailwind `3.4.17` |

---

## 5. Nonsecret Effective Deployment & Network Configuration

Authoritative Source: [`docker-compose.yml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/docker-compose.yml)

### 5.1 Network Segmentation & Port Exposure Architecture

```
========================================================================================================
NETWORK SEGMENTATION & PORT ALLOCATION POLICY
========================================================================================================
Network Name:      lgd-network (Driver: bridge)
Ingress Interface: 0.0.0.0:8092  -> api-gateway (The ONLY externally published ingress port in prod)
Loopback Admin:    127.0.0.1:6379 -> redis (Loopback-only host binding for administrative cache inspection)
Host Gateway:      host.docker.internal:host-gateway (Routes to host-native PostgreSQL 14 on port 5432)

Private Container-Only Ports (NOT exposed on public host interfaces):
  • service-discovery:  8761 (Eureka registry, Basic Auth authenticated)
  • auth-service:       18090 (Routed exclusively via Gateway on lgd-network)
  • user-management:    18089 (Routed exclusively via Gateway on lgd-network)
  • revenue:            18062 (Routed exclusively via Gateway on lgd-network)
========================================================================================================
```

### 5.2 Nonsecret Runtime Environment Variables & Resource Limits

| Service Container | Active Profile | JVM Resource Constraints (`JAVA_TOOL_OPTIONS`) | Service Routing URLs | Health Check Endpoint |
|:---|:---:|:---:|:---|:---|
| **`service-discovery`**| Default | `-Xms256m -Xmx512m` | `SERVER_PORT=8761` | `wget http://localhost:8761/actuator/health` |
| **`auth-service`** | `prod` | `-Xms256m -Xmx512m` | `REVENUE_SERVICE_URL=http://revenue:18062/public/v1` | Eureka Heartbeat |
| **`user-management`** | `prod` | `-Xms256m -Xmx512m` | `SERVER_PORT=18089` | Eureka Heartbeat |
| **`revenue`** | `prod` | `-Xms256m -Xmx512m` | `USER_SERVICE_URL=http://auth-service:18090` | Eureka Heartbeat |
| **`api-gateway`** | `prod` | `-Xms256m -Xmx512m` | `USER_MANAGEMENT_SERVICE_URL=http://user-management:18089` | Eureka Heartbeat |

- **Token Expiration Parity:** In accordance with `RBAC-002`, token lifespan is standardized at `900000` ms (15 minutes) across all production configuration files and `.env.example`.
- **CORS Allowed Origins:** Restricted to specified development/staging origins: `http://localhost:3000,http://localhost:4200,http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176`.
- **Memory Buffering Limit:** Gateway response logging capped strictly at 16 KB via streaming decorator (`SAST-015`).

---

## 6. Secret Inventory & Secure Reference Identifiers

In strict adherence to security governance, only secret reference names are documented:

| Secret Reference Name | Purpose & Consuming Service | Security Policy & Hardening Rule |
|:---|:---|:---|
| **`${SPRING_DATASOURCE_USERNAME}`** | PostgreSQL database service account user | Mandatory environment variable; must not use default `postgres`. |
| **`${SPRING_DATASOURCE_PASSWORD}`** | PostgreSQL database service account password | Mandatory environment variable; fallback defaults eliminated; startup fails closed. |
| **`${SPRING_DATA_REDIS_PASSWORD}`** | Redis authentication password | Mandatory environment variable; enforces AUTH command on connection. |
| **`${EUREKA_USERNAME}`** | Eureka service registry HTTP Basic user | Mandatory environment variable; client and server credentials synchronized. |
| **`${EUREKA_PASSWORD}`** | Eureka service registry HTTP Basic password | Mandatory environment variable; fallback defaults eliminated (`SAST-020`). |
| **`${JWT_SECRET}`** | HMAC-SHA256 signing secret | Must be $\ge 256$ bits (32 bytes) hex or base64; hardcoded keys removed (`SAST-001`). |
| **`${ESIGN_KEYSTORE_PASSWORD}`** | PKCS#12 e-Hastakshar keystore password | Mandatory environment variable; plaintext password removed from properties (`SAST-003`). |
| **`${ESIGN_AUTH_KEY}`** | CDAC ASP authentication key | Injected at runtime for electronic signature requests. |

---

## 7. Environment-Dependent Test Requirements

| Test Suite Category | Required Runtime Environment | Compensating Mock / Test Strategy |
|:---|:---|:---|
| **Unit Tests (350+ Tests)** | Pure Java / Spring Test Context | In-memory Mockito mocks for repositories, external HTTP clients, and Redis. |
| **JPA Repository Tests** | In-Memory H2 / Embedded Context | Hibernate test dialect with schema validation; zero dependency on live PostgreSQL. |
| **Live Integration Tests** | Localhost Network Interfaces | Uses TestRestTemplate and MockMvc against local ephemeral HTTP ports. |
| **Gate B Ingress Retest** | Live Docker Network + TLS Proxy | Requires Windows service `postgresql-x64-14` active on 5432 and TLS reverse proxy on 443/8443. |

---

## 8. Mandatory Program Stopping Directive

$$\mathbf{STOP:\ CONFIGURATION\ BASELINE\ SAFELY\ RECORDED\ (ZERO\ SECRETS\ STORED).}$$
$$\mathbf{PHASE\ 7\ NOT\ STARTED\ —\ QUEUED\ —\ SEPARATE\ EXECUTIVE\ AUTHORIZATION\ REQUIRED.}$$

