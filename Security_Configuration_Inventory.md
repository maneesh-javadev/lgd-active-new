# LGD 2.0 - Security Configuration Inventory

| **Document Version** | 1.0.0 |
| **Audit Phase** | Phase 0: Project Discovery & Security Baseline |
| **Scope** | All configuration files, properties, profiles, environment files, and container definitions |
| **Confidentiality Rule** | Passwords and sensitive secrets are masked per audit rules |

---

## 1. Executive Summary

This inventory documents all security-relevant configuration parameters identified across the LGD 2.0 modules. Configurations were analyzed across 8 operational domains:
1. Cryptographic Keys & JWT Parameters
2. Relational Database Connections (PostgreSQL)
3. In-Memory Cache & Session Stores (Redis)
4. Cross-Origin Resource Sharing (CORS)
5. Service Discovery & Mesh Registration (Eureka)
6. File Storage & Upload Constraints
7. External API & e-Hastakshar Keystores
8. API Documentation & OpenAPI Exposure

---

## 2. Configuration Domains & Findings

### 2.1 Cryptographic & JWT Signing Configurations

| Property Key | Default / Configured Value | Services Present | Security Evaluation |
|---|---|---|---|
| `jwt.secret` | `404E6352...` (Static 64-byte hex string) | `api-gateway`, `auth-service`, `user-management`, `revenue`, `docker-compose.yml` | **CRITICAL GAP:** Hardcoded secret committed in Git across all services. Enables arbitrary token forgery if code is accessed. |
| `jwt.expiration` | `86400000` (24 Hours) / `604800000` (7 Days) | `api-gateway`, `revenue`, `auth-service` | **HIGH GAP:** Excessively long token TTL without automated refresh token rotation. Stolen tokens remain valid for up to 7 days. |

---

### 2.2 Relational Database Configurations (PostgreSQL)

| Property Key | Configured Pattern | Services Present | Security Evaluation |
|---|---|---|---|
| `spring.datasource.url` | `jdbc:postgresql://10.248.213.206:5432/lgd_new` | `api-gateway`, `auth-service`, `user-management`, `revenue` | **HIGH GAP:** Fixed staging IP committed in properties. Connection lacks SSL enforcement (`sslmode=require` / `sslmode=verify-full` is missing). |
| `spring.datasource.username` | `postgres` | All services | **MEDIUM GAP:** Application connects as superuser `postgres` rather than a restricted least-privilege schema user. |
| `spring.datasource.password` | `[MASKED_STAGING_PASSWORD]` | All services & compose | **HIGH GAP:** Database plaintext password committed directly in source files. |
| `spring.jpa.show-sql` | `true` | `api-gateway`, `revenue` | **LOW GAP:** SQL statements printed to stdout/logs in production, risking data leakage in log analyzers. |

---

### 2.3 Redis Cache & Revocation Store Configurations

| Property Key | Configured Pattern | Services Present | Security Evaluation |
|---|---|---|---|
| `spring.data.redis.host` | `host.docker.internal` / `10.248.213.206` | `auth-service`, `user-management`, `revenue`, compose | Functional connectivity. |
| `spring.data.redis.port` | `6379` | All backend services | Standard default port. |
| `spring.data.redis.password` | *(Not configured / Blank)* | All backend services | **MEDIUM GAP:** Redis operates without password authentication (`requirepass` disabled). Any network peer can inspect or flush tokens. |

---

### 2.4 Cross-Origin Resource Sharing (CORS) Configurations

| Property Key / File | Configured Value | Service | Security Evaluation |
|---|---|---|---|
| `CorsConfig.java` | Origin Whitelist: `https://lgdirectory.gov.in`, `http://localhost:5173`, `http://localhost:5174` | `user-management` | **SECURED:** Wildcard `*` removed; strictly bound to configured domains with credentials enabled. |
| `EsignPrimaryController` | Bound to `${cors.allowed-origins}` | `revenue` | **SECURED:** Removed `@CrossOrigin(origins = "*")`. |
| `EsignSecondaryController` | Bound to `${cors.allowed-origins}` | `revenue` | **SECURED:** Removed `@CrossOrigin(origins = "*")`. |
| `cors.allowed-origins` | `http://localhost:3000,http://localhost:4200,...` | `docker-compose.yml` (`auth-service`) | Development origins allowed; must be restricted in production environment variables. |

---

### 2.5 Service Discovery Configurations (Eureka)

| Property Key | Configured Value | Services Present | Security Evaluation |
|---|---|---|---|
| `eureka.client.service-url.defaultZone` | `http://service-discovery:8761/eureka/` | `api-gateway`, `auth-service`, `user-management`, `revenue` | Functional internal registration. |
| `eureka.client.register-with-eureka` | `true` (clients), `false` (discovery) | All services | Standard discovery behavior. |
| `eureka.instance.prefer-ip-address` | `true` | All services | Appropriate for containerized bridge networking. |
| *Authentication* | *(None)* | `discovery` | **HIGH GAP:** Eureka dashboard and REST API run unauthenticated on port 8761. |

---

### 2.6 File Upload & Multipart Storage Configurations

| Property Key | Configured Value | Service | Security Evaluation |
|---|---|---|---|
| `spring.servlet.multipart.enabled` | `true` | `revenue` | Multi-part processing enabled for government order attachments. |
| `spring.servlet.multipart.max-file-size` | `10MB` | `revenue` | **GOOD PRACTICE:** File size ceiling enforced against DoS. |
| `spring.servlet.multipart.max-request-size`| `20MB` | `revenue` | **GOOD PRACTICE:** Request ceiling enforced. |
| `ESIGN_OUTPUT_FILE_PATH` | `/tmp/uploadFile` | `revenue`, compose | Target directory for temporary PDF buffer processing. |

---

### 2.7 Electronic Signature (e-Hastakshar) Configurations

| Property Key | Configured Value | Service | Security Evaluation |
|---|---|---|---|
| `esign.esp.url` | `${ESIGN_ESP_URL:https://...}` | `revenue` | External CDAC e-Hastakshar URL. |
| `esign.asp.id` | `${ESIGN_ASP_ID:TEST_ASP_ID}` | `revenue` | Application Service Provider Identifier. |
| `esign.response.url` | `.../public/v1/ehastakshar/response` | `revenue` | ESP post-back return URL. |
| `esign.enforce-signature` | `true` | `revenue` | **SECURED:** Enforces strict XML-DSig signature verification before completing transactions. |
| Keystore Path / Password | Configured via environment/properties | `revenue` (`XmlSignatureUtil`) | Keystore PKCS12 credentials should be mounted via Docker secrets. |

---

### 2.8 Swagger & Documentation Exposure Configurations

| Property Key | Configured Value | Services Present | Security Evaluation |
|---|---|---|---|
| `springdoc.api-docs.enabled` | `true` | `api-gateway`, microservices | OpenAPI generation enabled. |
| `springdoc.swagger-ui.enabled` | `true` | `api-gateway`, microservices | **MEDIUM GAP:** Interactive Swagger UI active in production configuration. Exposes API surface, DTO schemas, and parameters. |
| `springdoc.swagger-ui.path` | `/audit/docs` | `api-gateway` | Gateway documentation aggregation portal. |

---

## 3. Configuration Security Recommendations

1. **Environment Externalization:** Move all instances of `jwt.secret`, `spring.datasource.password`, and `keystorePassword` to environment variables or enterprise secret vaults (Docker Secrets / HashiCorp Vault).
2. **PostgreSQL TLS Enforcement:** Append `sslmode=verify-full&sslrootcert=/path/to/root.crt` to JDBC URLs.
3. **Eureka Basic Authentication:** Secure `service-discovery` with Spring Security HTTP Basic authentication.
4. **Disable Swagger in Production:** Configure `springdoc.swagger-ui.enabled=false` and `springdoc.api-docs.enabled=false` under the production Spring profile.
