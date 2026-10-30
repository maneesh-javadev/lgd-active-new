# LGD 2.0 — Security Secrets Rotation Plan
## Production Secrets Management, Dual-Key Rotation Procedures & Emergency Runbooks

| **Document Version** | 1.0.0 |
|---|---|
| **Audited Scope** | JWT Keys, Database Passwords, Redis Credentials, Eureka Basic Auth, eSign Keystores |
| **Reviewer Role** | Independent Senior Application Security Reviewer |
| **Date** | October 30, 2026 |
| **Policy Mandate** | **MANDATORY SECRETS ENCRYPTION & ZERO DOWNTIME ROTATION** |

> [!CAUTION]
> **OPERATIONAL SAFETY NOTICE:**
> In strict accordance with the security assessment mandate:
> 1. **Do NOT rotate live production credentials without explicit, written stakeholder approval.**
> 2. **Never print, export, or log actual plaintext secret values in reports, terminals, or tickets.**
> 3. This document establishes the formal operational plan, lifecycle schedule, and runbooks for future approved rotation cycles.

---

## 1. Secrets Inventory & Classification

| Secret ID | Target Component | Storage Location | Entropy Standard | Rotation Schedule | Impact of Compromise |
|:---:|:---|:---|:---|:---:|:---|
| **SEC-01** | JWT Signing Secret (`jwt.secret`) | Environment Variable (`JWT_SECRET`) / Vault | 256-bit Hex / Base64 (64 hex characters) | Every 90 Days | Full administrative token forgery across all services |
| **SEC-02** | PostgreSQL Password (`spring.datasource.password`) | Environment Variable (`SPRING_DATASOURCE_PASSWORD`) / Vault | Minimum 24 characters, high complexity alphanumeric + symbols | Every 180 Days | Direct database access, bulk data exfiltration/corruption |
| **SEC-03** | Redis Auth Password (`spring.data.redis.password`) | Environment Variable (`SPRING_DATA_REDIS_PASSWORD`) / Vault | Minimum 32 characters, high entropy | Every 180 Days | Token blacklist flush, session replay attacks |
| **SEC-04** | Eureka Discovery Basic Auth | Environment Variable (`EUREKA_PASSWORD`) / Vault | Minimum 20 characters alphanumeric | Every 180 Days | Rogue service registration, traffic interception |
| **SEC-05** | eSign Keystore & Auth Key | Keystore file (`.p12`) / Env (`ESIGN_KEYSTORE_PASSWORD`, `ESIGN_AUTH_KEY`) | Hardware Security Module (HSM) / Protected Keystore | Per CDAC Policy / Annual | Unauthorized digital signing of official gazettes |

---

## 2. Zero-Downtime Dual-Key Rotation Procedures

### 2.1 JWT Secret Dual-Key Rotation (Zero User Session Invalidation)
When rotating symmetric HMAC JWT secrets without logging out active government officers:

```
Phase A: Single Active Key
[Key 1 (Active Signer & Verifier)]

Phase B: Dual-Key Transition (Overlapping Window: 24 Hours)
[Key 2 (New Active Signer)] ──► Signs newly issued tokens
[Key 1 (Secondary Verifier)] ──► Validates existing in-flight tokens

Phase C: Key 1 Retirement (After 24h JWT Expiration Window)
[Key 2 (Sole Active Signer & Verifier)]
```

#### Step-by-Step JWT Rotation Runbook:
1. **Generation:** Generate a new 256-bit cryptographically secure key:
   ```bash
   openssl rand -hex 32
   ```
2. **Staging Dual Configuration:**
   - Configure `auth-service` with `JWT_SECRET_PRIMARY=<New_Key>` (for signing new tokens) and `JWT_SECRET_SECONDARY=<Old_Key>` (for validating older unexpired tokens).
   - Configure downstream services (`api-gateway`, `user-management`, `revenue`) to verify tokens against `JWT_SECRET_PRIMARY`, falling back to `JWT_SECRET_SECONDARY` on signature failure.
3. **Deployment:** Restart microservices using a rolling update strategy (API Gateway -> Downstream Services -> Auth Service).
4. **Observation Window:** Wait 24 hours (maximum configured JWT access token validity period).
5. **Retirement:** Remove `JWT_SECRET_SECONDARY`. All services now operate exclusively on `JWT_SECRET_PRIMARY`.

---

## 3. Database Credential Rotation Runbook (PostgreSQL)

To rotate PostgreSQL passwords with zero application connection pool errors:

1. **Create Dual Database Role:**
   - Log into PostgreSQL as `postgres` superuser.
   - Create a secondary administrative user matching identical schema permissions:
     ```sql
     CREATE USER lgd_prod_user_b WITH PASSWORD 'NEW_STRONG_PASSWORD_HERE';
     GRANT lgd_app_role TO lgd_prod_user_b;
     ```
2. **Update Application Environment Variables:**
   - Update `SPRING_DATASOURCE_USERNAME=lgd_prod_user_b` and `SPRING_DATASOURCE_PASSWORD=NEW_STRONG_PASSWORD_HERE` in secrets manager.
3. **Rolling Service Restart:**
   - Perform rolling restart of microservices (`auth-service`, `user-management`, `revenue`, `api-gateway`).
   - HikariCP connection pools will establish active connections using `lgd_prod_user_b`.
4. **Verify Health:**
   - Query `/actuator/health` on all services; assert database component status is `UP`.
5. **Decommission Old Role:**
   - After confirming all services have migrated to the new user:
     ```sql
     REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA um, revenue FROM lgd_prod_user_a;
     DROP USER lgd_prod_user_a;
     ```

---

## 4. Redis Credential Rotation Runbook

1. **Configure Redis Dual Authentication:**
   - Redis 6+ Access Control Lists (ACL) support dual users:
     ```
     ACL SETUSER lgd_worker_new on >NEW_REDIS_PASSWORD_HERE ~* +@all
     ```
2. **Update Gateway and Microservices:**
   - Update `SPRING_DATA_REDIS_PASSWORD=NEW_REDIS_PASSWORD_HERE`.
3. **Restart Services:**
   - Perform rolling restart of `api-gateway`, `user-management`, `revenue`, and `auth-service`.
4. **Revoke Old Redis Credentials:**
   - Remove legacy ACL user from Redis server:
     ```
     ACL DELUSER lgd_worker_old
     ```

---

## 5. Emergency Credential Compromise Runbook

In the event of an active security incident or accidental public exposure of production credentials:

1. **Immediate Escalation:** Notify the Chief Information Security Officer (CISO) and Lead Security Architect.
2. **Immediate Token Invalidation:**
   - Flush Redis revocation store or issue immediate global token invalidation epoch:
     ```
     redis-cli SET "auth:global:revocation_epoch" $(date +%s)
     ```
3. **Instant Key Overwrite:**
   - Generate emergency 256-bit key.
   - Overwrite `${JWT_SECRET}` in environment secrets.
   - Forcibly restart all services simultaneously. All existing forged or captured tokens will immediately fail signature validation across the entire perimeter.
4. **Database & Infrastructure Quarantine:**
   - Instantly change database and Redis passwords.
   - Terminate active client connections:
     ```sql
     SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE usename = 'compromised_user';
     ```
5. **Forensic Audit:**
   - Review API Gateway access logs for the preceding 72 hours for suspicious calls from unexpected IP addresses using the compromised credentials.

---

## 6. Approval & Execution Sign-Off Matrix

No production rotation shall occur without completed sign-off:

| Role | Name | Department | Approval Status |
|:---|:---|:---|:---:|
| Senior Security Reviewer | Antigravity Independent Auditor | Application Security | **PLAN APPROVED** |
| Lead DevOps Engineer | Production Operations Lead | Infrastructure & Cloud | Pending Execution Call |
| System Owner / CISO | LGD 2.0 Project Director | Ministry of Panchayati Raj / NIC | Pending Execution Call |
