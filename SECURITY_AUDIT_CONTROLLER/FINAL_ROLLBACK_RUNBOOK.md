# LGD 2.0 — Final Rollback Runbook
## Non-Destructive Emergency Rollback Procedures for Application Services, Containers, Reverse Proxy, and Database Configuration

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Location** | `SECURITY_AUDIT_CONTROLLER/FINAL_ROLLBACK_RUNBOOK.md` |
| **Controller Baseline** | Version 2.0.0 (Final Security Remediation & Staging Readiness) |
| **Evaluation Date** | November 6, 2026 |
| **Safety Mandate** | **100% Non-Destructive — Zero Data Loss — Zero Git Reset** |

---

## 1. Rollback Governance & Guiding Principles

This runbook establishes deterministic, non-destructive restoration procedures if a deployment defect or operational disruption occurs during staging or production rollout:
1. **Zero Data Loss:** Never drop database tables, purge schema partitions, or delete user directories.
2. **No Destructive Git Operations:** Strictly avoid `git reset --hard`, `git clean -fd`, or `git checkout -- .`.
3. **Preservation of Audit Trails:** Preserve all container crash logs, diagnostic dumps, and evidence artifacts for post-incident root cause analysis.
4. **Deterministic Version Pinning:** Rollback targets known good cryptographic JAR digests and previous container image tags.

---

## 2. Microservice Application & Container Rollback

### Step 1: Drain & Terminate Deployed Microservices
```bash
# Gracefully stop the current production container stack
podman compose -f docker-compose.prod.yml down --timeout 30

# Verify no orphaned Java processes remain bound to ports:
# 8761 (discovery), 8081 (auth), 8082 (user-mgmt), 8083 (revenue), 8092 (gateway)
```

### Step 2: Repoint Container Tags to Previous Stable Baseline
If previous container image tags were archived (e.g., `:backup-pre-remediation` or `:baseline-1.9.0`):
```bash
podman tag lgd-active-new-service-discovery:baseline-1.9.0 lgd-active-new-service-discovery:latest
podman tag lgd-active-new-auth-service:baseline-1.9.0 lgd-active-new-auth-service:latest
podman tag lgd-active-new-revenue:baseline-1.9.0 lgd-active-new-revenue:latest
podman tag lgd-active-new-user-management:baseline-1.9.0 lgd-active-new-user-management:latest
podman tag lgd-active-new-api-gateway:baseline-1.9.0 lgd-active-new-api-gateway:latest
```

### Step 3: Relaunch Previous Container Stack
```bash
podman compose -f docker-compose.prod.yml up -d
```

---

## 3. Nginx Reverse Proxy Ingress Rollback

If perimeter Nginx TLS termination or proxy headers cause routing failures:

### Step 1: Restore Previous Nginx Configuration
```bash
# If nginx.conf.bak was preserved:
cp /etc/nginx/nginx.conf.bak /etc/nginx/nginx.conf

# Test syntax of restored configuration
nginx -t -c /etc/nginx/nginx.conf
```

### Step 2: Reload or Restart Nginx Ingress
```bash
# Reload without dropping connections
nginx -s reload

# Or restart container
podman restart lgd-nginx-proxy
```

---

## 4. PostgreSQL Database & Client Certificate Rollback (DISC-P914-03)

> [!CAUTION]
> Under `DISC-P914-03`, database rollbacks must **never** modify production tables, drop schemas, or delete user records. Rollbacks in this layer are restricted strictly to connection security and authentication settings.

### Step 1: Revert `pg_hba.conf` Host Rules
If client certificate enforcement (`cert clientcert=verify-full`) must be rolled back to SCRAM password authentication:
```ini
# Locate PostgreSQL data directory (e.g., /var/lib/postgresql/data or C:\Program Files\PostgreSQL\14\data)
# Edit pg_hba.conf:
# REVERT:
# hostssl lgd_db lgd_user 127.0.0.1/32 cert clientcert=verify-full
# TO:
hostssl lgd_db lgd_user 127.0.0.1/32 scram-sha-256
```

### Step 2: Revert `postgresql.conf` TLS Parameters
```ini
# If TLS listening must be relaxed during emergency:
# ssl = on
# ssl_cert_file = 'server.crt'
# ssl_key_file = 'server.key'
# ssl_ca_file = 'root.crt'
```

### Step 3: Reload PostgreSQL Configuration Non-Destructively
Do **not** restart or terminate the database process abruptly. Perform a clean reload:
```sql
-- Connect via psql as superuser:
SELECT pg_reload_conf();
```

---

## 5. Redis & Redis Sentinel Rollback

If Sentinel dynamic quorum failover causes client connectivity issues (`DISC-P914-04` / `DISC-P914-06`):

### Step 1: Failover to Standalone Redis Topology
1. Update `docker-compose.yml` or microservice configuration:
   ```yaml
   spring:
     data:
       redis:
         host: localhost
         port: 6379
         password: ${SPRING_DATA_REDIS_PASSWORD}
         # Comment out Sentinel nodes:
         # sentinel:
         #   master: mymaster
         #   nodes: localhost:26379, localhost:26380, localhost:26381
   ```
2. Restart affected microservices (`revenue`, `auth-service`, `user-management`).

---

## 6. Post-Rollback Verification & Audit Recording

Following any rollback execution:
1. Verify system stability via health endpoints (`/actuator/health`).
2. Confirm zero data corruption in PostgreSQL.
3. Record an incident log in `SECURITY_AUDIT_CONTROLLER/MASTER_AUDIT_CHANGELOG.md` detailing:
   * Rollback initiator name and timestamp
   * Reason for rollback (trigger metric)
   * Exact configuration diff restored
   * Current operational state.

