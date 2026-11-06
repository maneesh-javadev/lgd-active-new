# LGD 2.0 — Final Local Execution Guide
## Complete Step-by-Step Operator Runbook for Local Development, Testing, and Runtime Orchestration

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Location** | `SECURITY_AUDIT_CONTROLLER/FINAL_LOCAL_EXECUTION_GUIDE.md` |
| **Controller Baseline** | Version 2.0.0 (Final Security Remediation & Staging Readiness) |
| **Evaluation Date** | November 6, 2026 |
| **Runtime Mode** | Local Multi-Service Development & Container Orchestration |

---

## 1. Prerequisites & Toolchain Verification

Before initiating local execution, verify that all host toolchains and operational prerequisites are installed and functional:

```powershell
# 1. Verify Java 21 LTS
java -version
# Expected: openjdk version "21.0.9" (or higher 21 LTS)

# 2. Verify Apache Maven
mvn -version
# Expected: Apache Maven 3.9.x or higher

# 3. Verify Container Engine (Podman or Docker)
podman --version   # or docker --version
docker compose version

# 4. Verify OpenSSL (for local TLS certificate generation)
openssl version
```

---

## 2. Infrastructure Setup: PostgreSQL & Redis Sentinel

### 2.1 Native PostgreSQL 14 Host Service
> [!IMPORTANT]
> The native Windows PostgreSQL 14 service (`postgresql-x64-14`) is currently **STOPPED** to safeguard production data. To execute against the local database, an authorized administrator must start the service:

```powershell
# Check current PostgreSQL service status
Get-Service -Name postgresql-x64-14

# Start PostgreSQL service (requires Administrator privileges)
Start-Service -Name postgresql-x64-14

# Verify listening port on 5432
Test-NetConnection -ComputerName 127.0.0.1 -Port 5432
```

### 2.2 Redis & Redis Sentinel
The platform requires Redis with authentication (`requirepass`) and Sentinel topology:

```powershell
# Run standalone Redis with pinned digest for local development:
podman run -d --name lgd-redis `
  -p 6379:6379 `
  docker.io/library/redis@sha256:21090af93f8324db2f0f0f4f38a7c60369d47d917e000c3423d89d2ae2883537 `
  redis-server --requirepass "LgdRedisSecretAuth2026!"
```

---

## 3. Environment Variable Configuration

Create a local environment file `.env.local` or set environment variables in your terminal:

```powershell
# ==============================================================================
# LGD 2.0 Local Environment Variables
# ==============================================================================
# Database Configuration (PostgreSQL 14)
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/lgd_db?sslmode=disable"
$env:SPRING_DATASOURCE_USERNAME="lgd_user"
$env:SPRING_DATASOURCE_PASSWORD="LgdDatabasePassword2026!"

# Redis Configuration
$env:SPRING_DATA_REDIS_HOST="localhost"
$env:SPRING_DATA_REDIS_PORT="6379"
$env:SPRING_DATA_REDIS_PASSWORD="LgdRedisSecretAuth2026!"

# Cryptography & JWT Secrets (Min 256-bit secret)
$env:JWT_SECRET="c2VjdXJlX2xnZF8yXzBfc3VwZXJfc2VjcmV0X2tleV9mb3JfaHMyNTZfdmVyaWZpY2F0aW9uXzIwMjYh"
$env:JWT_EXPIRATION="86400000"

# Eureka Discovery Configuration
$env:EUREKA_CLIENT_SERVICEURL_DEFAULTZONE="http://lgd_eureka_admin:EurekaSecretPass2026!@localhost:8761/eureka/"

# Spring Active Profile
$env:SPRING_PROFILES_ACTIVE="dev"
```

---

## 4. Multi-Service Startup Procedure (Local Maven Execution)

Services must be launched in strict sequential order to allow service discovery and configuration binding to complete:

```mermaid
flowchart TD
    Infra["1. Infra: PostgreSQL (5432) & Redis (6379)"] --> Discovery["2. service-discovery (8761)"]
    Discovery --> Auth["3. auth-service (8081)"]
    Discovery --> UM["4. user-management (8082)"]
    Discovery --> Rev["5. revenue (8083)"]
    Auth & UM & Rev --> Gateway["6. api-gateway (8092 / Internal)"]
    Gateway --> Nginx["7. Nginx TLS Ingress (443 / 80)"]
```

### Step 1: Launch Service Discovery (Port 8761)
Open Terminal 1:
```powershell
cd "E:\System\Projects\dockerProject\Source code\lgd-active-new\discovery"
mvn spring-boot:run
# Wait until log outputs: "EurekaServerBootstrap - Initialized server context"
```

### Step 2: Launch Authentication Service (Port 8081)
Open Terminal 2:
```powershell
cd "E:\System\Projects\dockerProject\Source code\lgd-active-new\auth-service"
mvn spring-boot:run
# Wait until registered with Eureka: "Registration status: 204"
```

### Step 3: Launch User Management Service (Port 8082)
Open Terminal 3:
```powershell
cd "E:\System\Projects\dockerProject\Source code\lgd-active-new\user-management"
mvn spring-boot:run
# Wait until database connection and Liquibase/Hibernate migrations complete
```

### Step 4: Launch Revenue Service (Port 8083)
Open Terminal 4:
```powershell
cd "E:\System\Projects\dockerProject\Source code\lgd-active-new\revenue"
mvn spring-boot:run
# Note: TestController endpoints are active ONLY under 'dev' or 'test' profiles
```

### Step 5: Launch API Gateway (Port 8092)
Open Terminal 5:
```powershell
cd "E:\System\Projects\dockerProject\Source code\lgd-active-new\api-gateway"
mvn spring-boot:run
# Gateway routes incoming traffic to downstream services
```

---

## 5. Health Check Endpoints & Health Verification

Once services are running, verify each service health endpoint:

| Service | Local Direct URL | Actuator Health Endpoint | Expected Health JSON |
|:---|:---|:---|:---|
| **Service Discovery** | `http://localhost:8761` | `http://localhost:8761/actuator/health` | `{"status":"UP"}` |
| **Auth Service** | `http://localhost:8081` | `http://localhost:8081/actuator/health` | `{"status":"UP"}` |
| **User Management** | `http://localhost:8082` | `http://localhost:8082/actuator/health` | `{"status":"UP","components":{"db":{"status":"UP"}}}` |
| **Revenue Service** | `http://localhost:8083` | `http://localhost:8083/actuator/health` | `{"status":"UP","components":{"db":{"status":"UP"}}}` |
| **API Gateway** | `http://localhost:8092` | `http://localhost:8092/actuator/health` | `{"status":"UP"}` |

### Quick Verification Script:
```powershell
@(8761, 8081, 8082, 8083, 8092) | ForEach-Object {
    $port = $_
    try {
        $res = Invoke-RestMethod -Uri "http://localhost:$port/actuator/health" -TimeoutSec 3
        Write-Host "Port $port Health: $($res.status)" -ForegroundColor Green
    } catch {
        Write-Host "Port $port Health: FAILED ($_)" -ForegroundColor Red
    }
}
```

---

## 6. Docker Compose Orchestration (Local Container Stack)

To run the complete containerized stack locally using the root build contexts:

```powershell
# 1. Build all 5 service container images
podman build -t lgd-active-new-service-discovery:latest -f discovery/Dockerfile .
podman build -t lgd-active-new-auth-service:latest -f auth-service/Dockerfile .
podman build -t lgd-active-new-revenue:latest -f revenue/Dockerfile .
podman build -t lgd-active-new-user-management:latest -f user-management/Dockerfile .
podman build -t lgd-active-new-api-gateway:latest -f api-gateway/Dockerfile .

# 2. Start container stack with Docker Compose
docker compose up -d

# 3. Check status of running containers
docker compose ps
```

---

## 7. Graceful Shutdown & Cleanup

To shut down all services cleanly without data corruption:

```powershell
# For Docker Compose:
docker compose down

# For Individual Terminals:
# Press Ctrl+C in each terminal window in reverse order (Gateway -> Revenue -> User Management -> Auth -> Discovery)

# To stop standalone Redis:
podman stop lgd-redis; podman rm lgd-redis
```

