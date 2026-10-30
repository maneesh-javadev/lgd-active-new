# LGD 2.0 - Threat Mitigation Roadmap

## Document Information
- **Project:** Local Government Directory (LGD 2.0)
- **Phase:** Phase 1 - Threat Modeling & Trust Boundary Analysis
- **Standard:** OWASP Risk Remediation Framework & NIST SP 800-53
- **Classification:** Official Government Security Document

---

## 1. Executive Summary & Strategy

The threat modeling analysis of LGD 2.0 across 8 trust boundaries identified **20 major STRIDE threats**, including **9 Critical-risk threats** and **8 High-risk threats**. The threats stem primarily from:
1. **Perimeter exposure:** Docker publishing internal microservice and database ports directly to `0.0.0.0`.
2. **Cryptographic weaknesses:** Hardcoded static HMAC secret keys without rotation.
3. **Multi-tenancy gaps:** Absence of server-side state/district tenant scoping in entity queries (BOLA/IDOR).
4. **Third-party callback trust:** Insufficient cryptographic verification on CDAC e-Hastakshar eSign callbacks.
5. **Infrastructure trust assumptions:** Unauthenticated Eureka service discovery and unauthenticated Redis caching.

The **Threat Mitigation Roadmap** establishes a phased, defense-in-depth plan to remediate all identified architectural and systemic threats without causing functional disruption to existing government workflows.

---

## 2. Mitigation Prioritization Tiers

```
+-----------------------------------------------------------------------------------+
|  TIER 0: IMMEDIATE STOP-THE-BLEED (Days 1 - 3)                                    |
|  - Eliminate external network exposure of internal ports (Postgres, Redis, Eureka) |
|  - Disable dangerous Actuator endpoints (/env, /heapdump) in production          |
|  - Enforce Redis password authentication (requirepass)                            |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|  TIER 1: CRYPTOGRAPHIC & PERIMETER INTEGRITY (Days 4 - 10)                        |
|  - Migrate JWT from symmetric HS256 to asymmetric RS256 / Ed25519                |
|  - Implement strict CDAC e-Hastakshar callback HMAC verification & nonce checks   |
|  - Secure Eureka discovery with HTTP Basic authentication                         |
|  - Enforce Gateway rate limiting on /api/auth/login and public endpoints         |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|  TIER 2: MULTI-TENANCY & AUTHORIZATION HARDENING (Days 11 - 21)                  |
|  - Implement TenantSecurityContext to enforce stateCode/districtCode isolation   |
|  - Add method-level @PreAuthorize on all controller endpoints                    |
|  - Enforce strict DTO parameter binding to prevent mass assignment of roles       |
|  - Implement Redis token blacklist check across all downstream microservices     |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|  TIER 3: AUDITABILITY & CLIENT-SIDE DEFENSE-IN-DEPTH (Days 22 - 30)              |
|  - Migrate token storage from localStorage to HttpOnly SameSite=Strict cookies    |
|  - Implement Hibernate Envers entity audit logging for all boundary changes      |
|  - Implement strict Content Security Policy (CSP) and sanitization filters        |
|  - Mask Authorization headers and sensitive PII in ApiLoggingFilter               |
+-----------------------------------------------------------------------------------+
```

---

## 3. Comprehensive Mitigation Traceability Matrix

| Priority | Threat ID | Target Component | Threat Scenario | Remediation Action | Vulnerability Ref | Est. Effort | Verification Method |
|:---|:---|:---|:---|:---|:---|:---:|:---|
| **P0** | `THR-STRIDE-012` | PostgreSQL | Direct DB access on port 5432 | Remove host port publishing in `docker-compose.yml`; restrict to internal bridge network | `VULN-007` | 0.5 Day | Port scan from external host confirms port 5432 closed |
| **P0** | `THR-STRIDE-007` | Redis | Unauthenticated `FLUSHALL` wiping token blacklist | Set strong `requirepass` in `redis.conf`; unbind port 6379 from `0.0.0.0` | `VULN-009` | 0.5 Day | `redis-cli ping` without auth returns `(error) NOAUTH` |
| **P0** | `THR-STRIDE-011` | Discovery & Services | Spring Actuator environment secret leakage | Restrict actuator exposure to `health,info`; require ADMIN role on separate port | `VULN-015` | 1 Day | `curl /actuator/env` returns `404 Not Found` |
| **P0** | `THR-STRIDE-004` | Revenue & User Mgmt | Direct microservice access bypassing Gateway | Remove host ports `8081`, `8082`, `8083` in docker-compose; route only via Gateway | `VULN-007` | 0.5 Day | External HTTP request to `:8083` times out / connection refused |
| **P1** | `THR-STRIDE-001` | Auth Service & Gateway | JWT forgery via static HMAC secret | Replace HS256 with RS256 asymmetric keys; store private key in HashiCorp Vault | `VULN-001` | 3 Days | Attempt forging token with custom claims fails cryptographic check |
| **P1** | `THR-STRIDE-002` | Eureka Discovery | Rogue microservice registration | Enable Spring Security HTTP Basic auth on Eureka; update client credentials | `VULN-008` | 2 Days | Unauthenticated `POST /eureka/apps` returns `401 Unauthorized` |
| **P1** | `THR-STRIDE-003` | Revenue Service | CDAC eSign callback spoofing | Implement HMAC signature check, Redis one-time nonce verification, and CCA CA chain check | `VULN-006` | 3 Days | Synthetic callback without valid HMAC returns `403 Forbidden` |
| **P1** | `THR-STRIDE-016` | Gateway & Auth | Brute force / credential stuffing | Configure Redis Token Bucket rate limiter on `/api/auth/login` (5 attempts/min) | `VULN-019` | 2 Days | 6th rapid login attempt returns `429 Too Many Requests` |
| **P1** | `THR-STRIDE-008` | Revenue Service | PDF document hash substitution | Store immutable SHA-256 before eSign dispatch; assert exact match upon callback | `VULN-011` | 2 Days | Modifying PDF byte before signing aborts transaction |
| **P2** | `THR-STRIDE-005` | Revenue Service | Cross-tenant draft manipulation (BOLA) | Implement `TenantSecurityContext` filter binding SQL queries to JWT `stateCode` | `VULN-003` | 4 Days | Requesting State 27 draft using State 19 token returns `403 Forbidden` |
| **P2** | `THR-STRIDE-006` | User Management | Role injection via Mass Assignment | Use immutable `UserUpdateDTO` without role fields; dedicated admin role mapping API | `VULN-004` | 3 Days | Submitting `"roles": ["SUPER_ADMIN"]` in user update is ignored or rejected |
| **P2** | `THR-STRIDE-018` | User Mgmt & Revenue | Missing method-level security | Enable `@EnableMethodSecurity` and annotate all sensitive controller methods | `VULN-012` | 4 Days | Calling admin endpoint with operator token returns `403 Forbidden` |
| **P2** | `THR-STRIDE-019` | Revenue Service | District-to-State escalation | Implement workflow state machine validating role tier against transition state | `VULN-005` | 3 Days | District token attempting state approval returns `403 Forbidden` |
| **P2** | `THR-STRIDE-015` | Revenue Service | Large upload resource exhaustion | Set multipart max file size to 5MB; validate MIME via Apache Tika magic bytes | `VULN-018` | 2 Days | Uploading 10MB or non-PDF file returns `413` or `415` |
| **P3** | `THR-STRIDE-014` | React Frontend | Client-side token theft via XSS | Migrate tokens to `HttpOnly, Secure, SameSite=Strict` cookies; configure strict CSP | `VULN-017` | 3 Days | `document.cookie` in browser console cannot read auth token |
| **P3** | `THR-STRIDE-009` | All Services | Missing entity-level audit trails | Implement Hibernate Envers for automated auditing of entity modifications | `VULN-014` | 4 Days | Modifying village record creates timestamped revision row in DB |
| **P3** | `THR-STRIDE-010` | API Gateway | Sensitive token leakage in logs | Configure regex masking in `ApiLoggingFilter` and Logback for Authorization headers | `VULN-002` | 1 Day | Log inspection shows `Authorization: Bearer [REDACTED]` |
| **P3** | `THR-STRIDE-013` | API Gateway | Swagger/OpenAPI exposure in prod | Disable `springdoc-openapi` in production profile via `@Profile("!prod")` | `VULN-016` | 1 Day | Accessing `/swagger-ui/index.html` in prod returns `404 Not Found` |
| **P3** | `THR-STRIDE-017` | API Gateway | Regular Expression DoS (ReDoS) | Audit all regex route patterns; replace with linear-time DFA regex engine | `VULN-020` | 2 Days | Complex regex string evaluated in under 5ms |
| **P3** | `THR-STRIDE-020` | React Frontend | Client route guard manipulation | Enforce zero-trust architecture; ensure backend validates every action independently | `VULN-021` | 2 Days | Unhiding admin buttons in DOM still results in `403` on click |

---

## 4. Defense-in-Depth Architectural Layers

### 4.1 Layer 1: Perimeter & Edge Defense (API Gateway)
- **Rate Limiting:** Distributed Redis token-bucket filter (max 100 req/min for general APIs, 5 req/min for auth).
- **Request Sanitization:** Enforce request body limits (max 10MB for multipart, max 500KB for JSON).
- **Security Headers:** Enforce `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`.
- **Log Obfuscation:** Mask Bearer tokens, passwords, OTPs, and mobile numbers in Gateway logs.

### 4.2 Layer 2: Service Mesh & Inter-Service Isolation (East-West Security)
- **Docker Isolation:** Remove all `ports:` directives for backend microservices in `docker-compose.yml`, exposing only port 8080/443 on the Gateway.
- **Service Discovery Protection:** HTTP Basic authentication on Eureka with individual credentials per microservice.
- **Service-to-Service Authentication:** Implement HMAC signature or shared secret header (`X-Internal-Service-Key`) verified on every internal call.

### 4.3 Layer 3: Application & Controller Authorization Layer
- **Method-Level Security:** Mandate `@PreAuthorize("hasRole('...')")` on 100% of controller methods.
- **Tenant Context Enforcement:** Global `TenantSecurityContext` resolving `stateCode` and `districtCode` exclusively from cryptographically validated JWT claims.
- **DTO Parameter Binding:** Strict separation of Input DTOs and Persistence Entities; use `@JsonProperty(access = JsonProperty.Access.READ_ONLY)` on system-managed fields.

### 4.4 Layer 4: Data Layer Security (PostgreSQL & Redis)
- **Database Network Binding:** Bind PostgreSQL port 5432 to Docker bridge network only.
- **Least-Privilege Database Roles:** Separate migration user (DDL) from application user (DML only: SELECT, INSERT, UPDATE, DELETE).
- **Redis Authentication & Encryption:** Require strong authentication (`requirepass`) and TLS transport.

### 4.5 Layer 5: External Integration Security (CDAC e-Hastakshar)
- **Callback Signature Validation:** Validate XML digital signature against official CDAC e-Hastakshar public certificate.
- **Transaction Nonce Verification:** Store one-time `txnId` with 15-minute TTL in Redis; discard on first use.
- **Document Hash Audit:** Recalculate SHA-256 digest of signed PDF; verify identical match with pre-signing digest.

---

## 5. Security Regression & Verification Framework

To guarantee fixes remain effective across releases:
1. **Automated CI/CD Security Gates:** Integrate SAST (Semgrep/SonarQube) and dependency scanning (OWASP Dependency-Check).
2. **Integration Test Suite:** Add positive and negative authorization tests asserting `403 Forbidden` on cross-tenant and role-elevation attempts.
3. **Container Baseline Scanning:** Scan base Docker images with Trivy to catch OS and library CVEs prior to staging deployment.
4. **Periodic Penetration Testing:** Conduct bi-annual grey-box penetration testing aligned with OWASP ASVS Level 2.
