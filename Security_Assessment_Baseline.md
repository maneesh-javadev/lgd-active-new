# LGD 2.0 - Security Assessment Baseline Report

| **Document Version** | 1.0.0 |
| **Audit Phase** | Phase 0: Project Discovery & Security Baseline |
| **System** | Local Government Directory (LGD 2.0) |
| **Assessment Type** | Full-Spectrum Static, Architectural, and Configuration Baseline |

---

## 1. Executive Baseline Summary

Before any remediation activities commenced, a complete security assessment baseline was established by inspecting the source code, configuration files, container definitions, and dependency trees across all LGD 2.0 services.

The baseline assessment revealed **23 distinct security findings**:
- **3 Critical Severity Findings**
- **9 High Severity Findings**
- **6 Medium Severity Findings**
- **4 Low Severity Findings**
- **1 Informational Finding**

Additionally, software composition analysis of the frontend nodal dashboard (`lgd_react`) revealed **23 baseline package vulnerabilities** (1 Critical, 16 High, 5 Moderate, 1 Low).

---

## 2. Baseline Vulnerability Matrix

| Vulnerability ID | Vulnerability Title | Affected Component | CWE | Severity | Baseline Risk Description |
|---|---|---|---|---|---|
| **VULN-001** | Hardcoded Static JWT Secret | Gateway, Auth, UM, Revenue, Compose | CWE-798 | **CRITICAL** (CVSS 9.8) | Static 64-byte key allows arbitrary token forgery. |
| **VULN-002** | XML External Entity (XXE) Injection | Revenue Service (`EsignService`, `XmlSignatureUtil`) | CWE-611 | **CRITICAL** (CVSS 9.8) | Unauthenticated public endpoint `/response` parses untrusted XML without entity restrictions. |
| **VULN-003** | Electronic Signature Verification Bypass | Revenue Service (`EsignService`) | CWE-347 | **CRITICAL** (CVSS 9.1) | Commented-out exception allows forged eSign responses to be accepted. |
| **VULN-004** | Permissive CORS with Wildcard & Credentials | User Management (`CorsConfig`), Revenue (`EsignPrimaryController`) | CWE-942 | **HIGH** (CVSS 8.5) | Wildcard origin reflection combined with `allowCredentials=true`. |
| **VULN-005** | Missing Method-Level Authorization | User Management & Revenue Controllers | CWE-862 | **HIGH** (CVSS 8.8) | Controllers check only authentication, omitting `@PreAuthorize` role/privilege enforcement. |
| **VULN-006** | State & District Tenant Boundary Bypass (BOLA) | Revenue Service (`DistrictServiceImpl`, `DraftEntityServiceImpl`) | CWE-639 | **HIGH** (CVSS 8.5) | Draft publishing and deletion operations lack state ownership checks. |
| **VULN-007** | Distributed Token Revocation Bypass | API Gateway, User Management, Revenue | CWE-613 | **HIGH** (CVSS 7.5) | Gateway and downstream services do not inspect Redis blacklist upon request handling. |
| **VULN-008** | Plaintext JWT Bearer Token Leakage | API Gateway (`AuthenticationFilter`, `ApiLoggingFilter`) | CWE-532 / CWE-312 | **HIGH** (CVSS 7.5) | Cleartext JWTs logged to console and stored in PostgreSQL `ws_access_log`. |
| **VULN-009** | Direct Container Port Exposure & Open Eureka | Docker Compose, Discovery Service | CWE-284 | **HIGH** (CVSS 7.5) | Internal service ports (8761, 18090, 18089, 18062) accessible directly on host. |
| **VULN-010** | Username Enumeration on Login | Auth Service (`AuthServiceImpl`, `GlobalExceptionHandler`) | CWE-204 | **MEDIUM** (CVSS 5.3) | Differentiated responses for non-existent user vs. invalid password. |
| **VULN-011** | Absence of Password Complexity Policy | User Management (`CreateUserValidator`, `UpdateUserValidator`) | CWE-521 | **MEDIUM** (CVSS 5.3) | Single-character passwords allowed without minimum length or complexity checks. |
| **VULN-012** | Vulnerable Frontend Dependencies | Frontend (`lgd_react/package.json`) | CWE-1035 | **HIGH** (CVSS 7.8) | 23 vulnerable packages identified via `npm audit` (SheetJS, Vite, Zod, React Router). |
| **VULN-013** | Swagger UI Public Documentation Exposure | API Gateway, Microservice Configurations | CWE-200 | **LOW** (CVSS 4.3) | OpenAPI definitions and interactive consoles publicly available. |
| **VULN-014** | Microservice Containers Running as Root | Microservice Dockerfiles | CWE-250 | **MEDIUM** (CVSS 6.5) | Dockerfiles lack unprivileged `USER` directive. |
| **VULN-015** | Absence of Rate Limiting on Ingress | API Gateway | CWE-307 | **MEDIUM** (CVSS 6.5) | No rate limits on authentication and public API endpoints. |
| **VULN-016** | Missing HTTP Security Headers | API Gateway | CWE-693 | **LOW** (CVSS 3.7) | Responses lack `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`. |
| **VULN-017** | Committed Plaintext Database Credentials | Microservice `application.properties` | CWE-798 | **HIGH** (CVSS 7.5) | Plaintext PostgreSQL credentials committed in repository properties. |
| **VULN-018** | High Memory Consumption on Document Uploads | Revenue Service (`CommonOrderValidationService`) | CWE-770 | **MEDIUM** (CVSS 5.3) | `Loader.loadPDF(file.getBytes())` loads complete document buffers in memory. |
| **VULN-019** | Gateway Missing Strict Content-Length Cap | API Gateway | CWE-400 | **LOW** (CVSS 3.5) | Ingress requests not strictly capped before microservice proxying. |
| **VULN-020** | Absence of Refresh Token Rotation | Auth Service | CWE-384 | **MEDIUM** (CVSS 5.9) | Static JWT issuance without short-lived access / rotating refresh token architecture. |
| **VULN-021** | Unauthenticated Eureka Instance Registry | Service Discovery (`discovery`) | CWE-287 | **MEDIUM** (CVSS 6.5) | Instance metadata and network topology exposed on port 8761. |
| **VULN-022** | Open Redirect Potential in Client Router | Frontend (`lgd_react`) | CWE-601 | **MEDIUM** (CVSS 6.1) | Unvalidated redirect parameters in client routing components. |
| **VULN-023** | Prototype Pollution in SheetJS Library | Frontend (`lgd_react`) | CWE-1321 | **HIGH** (CVSS 7.8) | Unpatched SheetJS `xlsx` 0.18.5 dependency. |

---

## 3. Baseline Test Coverage & Quality Assessment

- **`auth-service`:** 35 unit/integration tests present; 100% pass rate in isolated context.
- **`user-management`:** 87 validator unit tests pass. Integration slice tests require test-profile H2 isolation.
- **`revenue`:** 0 existing unit tests in `src/test`. Codebase compiles cleanly.
- **`api-gateway`:** 0 existing unit tests in `src/test`. Codebase compiles cleanly.
- **`discovery`:** Eureka server configuration functional and compiles cleanly.
- **`lgd-um`:** NPM audit: 0 vulnerabilities.
- **`lgd_react`:** NPM audit: 23 baseline vulnerabilities.
