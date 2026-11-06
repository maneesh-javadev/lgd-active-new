# LGD 2.0 — Phase 9.1: PostgreSQL TLS & Authentication Architecture Specification

| **Document Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Phase** | Phase 9.1 — Infrastructure Design Validation & Implementation Readiness |
| **Document ID** | `LGD2-P9.1-PG-TLS-AUTH` |
| **File Location** | `SECURITY_AUDIT_CONTROLLER/PHASE_9_1_POSTGRESQL_TLS_AND_AUTHENTICATION_DESIGN.md` |
| **Architectural Roles** | Principal Infrastructure Security Architect & PostgreSQL Security Engineer |
| **Validation Timestamp** | November 6, 2026 (`2026-11-06T10:35:00+05:30`) |
| **Governing Finding & Risk** | `RR-05` (Internal Transport Cleartext), `BLK-CANON-03` (PostgreSQL 14 Availability), `SAST-002` |
| **Execution Mode** | **STRICTLY READ-ONLY ASSESSMENT & DESIGN SPECIFICATION** |

---

## 1. Executive Summary & Objective

The empirical forensic inspection of the host operating system identified that the native Windows service `postgresql-x64-14` is stopped (`BLK-CANON-03`), transport layer encryption is disabled (`ssl = off`), and the client authentication configuration (`pg_hba.conf`) is configured with an unauthenticated, perimeter-wide `trust` rule (`host all all 0.0.0.0/0 trust`).

The objective of **Workstream C (Phase 9.1)** is to:
1. Conduct an exhaustive rule-by-rule forensic audit of `pg_hba.conf` and `postgresql.conf`.
2. Design a hardened, production-grade TLS 1.3/1.2 encryption architecture with verified server identity (`sslmode=verify-full`).
3. Construct a corrected, strictly ordered `pg_hba.conf` policy aligned with verified host and container network subnets (remediating the erroneous `172.16.0.0/12` assumption).
4. Establish clear administrative, container, monitoring, and backup authentication segmentation using `scram-sha-256`.

---

## 2. Forensic Audit of Active PostgreSQL 14 Configuration

### 2.1 File Location & Service Status
- **Host Installation Directory:** `E:\Program Files\PostgreSQL\14\data\`
- **Authoritative Configuration Files:**
  - `E:\Program Files\PostgreSQL\14\data\postgresql.conf`
  - `E:\Program Files\PostgreSQL\14\data\pg_hba.conf`
  - `E:\Program Files\PostgreSQL\14\data\postgresql.auto.conf`
- **Windows Service Status:**
  ```powershell
  Status   Name               DisplayName
  ------   ----               -----------
  Stopped  postgresql-x64-14  postgresql-x64-14 - PostgreSQL Server.
  ```

### 2.2 Forensic Inspection of `postgresql.conf`
- **Active Listener Parameter:** `listen_addresses = '*'` (Line 59).
  - PostgreSQL binds to all physical and virtual IPv4/IPv6 network adapters on the host.
- **SSL Parameters:**
  ```properties
  #ssl = off
  #ssl_cert_file = 'server.crt'
  #ssl_key_file = 'server.key'
  ```
  - All SSL directives are commented out. The engine default (`ssl = off`) is active.
  - Zero cryptographic certificates (`server.crt`, `server.key`, `ca.crt`) exist in `E:\Program Files\PostgreSQL\14\data\`.
  - All database client communication is transmitted in unencrypted cleartext across network adapters.

### 2.3 Rule-by-Rule Forensic Audit of Ordered `pg_hba.conf`
The active, uncommented rules in `E:\Program Files\PostgreSQL\14\data\pg_hba.conf` (lines 85–95) are:

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32             trust
host    all             all             ::1/128                   trust
local   replication     all                                      trust
host    replication     all             127.0.0.1/32             trust
host    replication     all             ::1/128                  trust
host    all             all             0.0.0.0/0             	 trust
```

#### Rule Evaluation Mechanics & Catastrophic Exposure:
1. **First-Match Precedence:**
   > [!CRITICAL]
   > PostgreSQL processes `pg_hba.conf` records sequentially from top to bottom. It connects the client using the **FIRST rule that matches** the connection type, database, user, and client IP address. Subsequent rules are completely ignored!
2. **Analysis of Line 95 (`host all all 0.0.0.0/0 trust`):**
   - **Connection Type (`host`):** Matches both unencrypted cleartext and SSL connections.
   - **Database (`all`):** Matches all databases, including `lgd`, `postgres`, and `template1`.
   - **User (`all`):** Matches all database roles, including the `postgres` superuser!
   - **Address (`0.0.0.0/0`):** Matches EVERY IPv4 address on any interface (corporate LAN, public internet, Docker bridge, WSL network).
   - **Method (`trust`):** Completely bypasses password verification. The client supplies any username, and PostgreSQL grants immediate access without authentication!
3. **Local Socket Exposure (`local all all trust`):**
   - Any local process on the host machine can connect via named pipes / local sockets as `postgres` without supplying credentials.
4. **Conclusion on Reject Rules:**
   - Placing a reject rule at the bottom of the file (e.g. `hostnossl all all 0.0.0.0/0 reject`) while keeping line 95 is completely useless because line 95 matches every IPv4 connection first!
   - The entire rule table must be purged of `trust` directives.

---

## 3. Verified Host & Container Network Subnet Topology

The previous assessment assumed Docker container traffic originated from `172.16.0.0/12`. Forensic network inspection disproves this assumption:

```powershell
# Verified Host Interfaces:
127.0.0.1/8       - Loopback Pseudo-Interface
10.25.85.121/24   - Physical Host Ethernet Interface
172.20.32.1/20    - vEthernet (WSL Hyper-V Firewall)

# Verified Docker Bridge Networks:
10.88.0.0/16      - Default Docker Bridge (docker0)
10.89.0.0/24      - LGD 2.0 Project Bridge (lgd-network / lgd-data-tier)
```

- When microservice containers connect to PostgreSQL via `host.docker.internal:5432` (`host-gateway`), packets enter the host via:
  1. The Docker bridge gateway IP: `10.89.0.1` (originating from container range `10.89.0.0/24`).
  2. The WSL2 virtual adapter IP: `172.20.32.1` (originating from WSL subsystem range `172.20.32.0/20`).
- Therefore, configuring `172.16.0.0/12` would either fail to match container traffic or force engineers to permit `10.0.0.0/8`, which is an dangerously broad class-A network encompassing entire enterprise intranets!
- **Accurate Subnet Pinning:**
  - Microservice Bridge Subnet: `10.89.0.0/24`
  - WSL Virtual Subnet: `172.20.32.0/20`
  - Host Loopback Subnet: `127.0.0.1/32` and `::1/128`

---

## 4. Hardened PostgreSQL TLS Architecture Specification

### 4.1 Server Certificate & Private Key Requirements
1. **Cryptographic Standard:**
   - RSA 4096-bit or ECDSA (Curve `prime256v1` / `secp384r1`).
   - Signed by the authoritative enterprise Internal Root/Intermediate Certificate Authority (`lgd-internal-ca.crt`).
2. **Subject Alternative Name (SAN) Validation:**
   > [!IMPORTANT]
   > Microservices connect using `jdbc:postgresql://host.docker.internal:5432/lgd?sslmode=verify-full`.
   > Under `sslmode=verify-full`, the PostgreSQL JDBC driver strictly checks that the connection hostname matches a `dNSName` or `iPAddress` in the Subject Alternative Name (SAN) extension.
   > **`host.docker.internal` is NOT present in standard certificates by default.**
   
   The X.509 v3 certificate MUST be generated with the following SAN extension:
   ```ini
   [ alt_names ]
   DNS.1 = host.docker.internal
   DNS.2 = localhost
   DNS.3 = lgd-database.internal
   IP.1  = 127.0.0.1
   IP.2  = 10.89.0.1
   IP.3  = 172.20.32.1
   ```
3. **Windows Host File Permissions (NTFS ACLs):**
   - PostgreSQL on Windows will fail to start if `server.key` has permissive file permissions.
   - Permissions on `server.key` must be restricted exclusively to the PostgreSQL service account (`NT SERVICE\postgresql-x64-14`) or Administrators:
     ```powershell
     icacls "E:\Program Files\PostgreSQL\14\data\server.key" /inheritance:r
     icacls "E:\Program Files\PostgreSQL\14\data\server.key" /grant:r "NT SERVICE\postgresql-x64-14:(R)"
     icacls "E:\Program Files\PostgreSQL\14\data\server.key" /grant:r "SYSTEM:(R)"
     icacls "E:\Program Files\PostgreSQL\14\data\server.key" /grant:r "Administrators:(R)"
     ```

### 4.2 Target `postgresql.conf` TLS & Cipher Parameters
Deploy in `E:\Program Files\PostgreSQL\14\data\postgresql.conf`:

```properties
# ==============================================================================
# LGD 2.0 Hardened TLS & Security Configuration (PostgreSQL 14)
# ==============================================================================

# Connection and Listener
listen_addresses = 'localhost,127.0.0.1,10.89.0.1,172.20.32.1'
port = 5432
max_connections = 100

# TLS Configuration
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
ssl_ca_file = 'ca.crt'

# TLS Protocol Enforcement (Minimum TLS 1.2; TLS 1.3 Preferred)
ssl_min_protocol_version = 'TLSv1.2'
ssl_max_protocol_version = 'TLSv1.3'

# AEAD Strong Cipher Suites Only (Prohibit CBC, 3DES, RC4, MD5)
ssl_ciphers = 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256'
ssl_prefer_server_ciphers = on

# Authentication Cryptography
password_encryption = scram-sha-256
```

### 4.3 Zero-Downtime Certificate Renewal
PostgreSQL 14 supports reloading SSL certificates without terminating the database engine or dropping active client connections:
```sql
SELECT pg_reload_conf();
```
Or via Windows command line:
```cmd
"E:\Program Files\PostgreSQL\14\bin\pg_ctl.exe" reload -D "E:\Program Files\PostgreSQL\14\data"
```
The engine re-reads `server.crt` and `server.key` dynamically.

---

## 5. Authoritative, Hardened `pg_hba.conf` Specification

The table below defines the complete, ordered client authentication policy. It completely purges `trust`, enforces TLS encryption on remote connections via `hostssl`, requires `scram-sha-256`, and terminates with an explicit catch-all `reject`.

```
# ==============================================================================
# LGD 2.0 Authoritative Client Authentication Policy (pg_hba.conf)
# Evaluation Order: Top to bottom; FIRST MATCHING RULE WINS.
# ==============================================================================
# TYPE     DATABASE        USER            ADDRESS                 METHOD

# ------------------------------------------------------------------------------
# 1. Local Host Administration (Windows Named Pipes & Loopback)
# ------------------------------------------------------------------------------
local      all             postgres                                scram-sha-256
host       all             postgres        127.0.0.1/32            scram-sha-256
host       all             postgres        ::1/128                 scram-sha-256

# ------------------------------------------------------------------------------
# 2. Local Replication (Standby / WAL Archiving)
# ------------------------------------------------------------------------------
local      replication     all                                     scram-sha-256
hostssl    replication     lgd_repl_user   127.0.0.1/32            scram-sha-256
hostssl    replication     lgd_repl_user   ::1/128                 scram-sha-256

# ------------------------------------------------------------------------------
# 3. Application Containers (Docker Microservices Bridge Networks)
#    Strictly requires TLS (hostssl) and SCRAM-SHA-256 password authentication.
#    Plaintext connections (hostnossl) will be immediately dropped.
# ------------------------------------------------------------------------------
hostssl    lgd             lgd_prod_user   10.89.0.0/24            scram-sha-256
hostssl    lgd             lgd_prod_user   172.20.32.0/20          scram-sha-256

# ------------------------------------------------------------------------------
# 4. Approved Monitoring & Health Probes (Dedicated Read-Only Role)
# ------------------------------------------------------------------------------
hostssl    lgd             lgd_monitor     127.0.0.1/32            scram-sha-256
hostssl    lgd             lgd_monitor     10.89.0.0/24            scram-sha-256

# ------------------------------------------------------------------------------
# 5. Default Catch-All Boundary (EXPLICIT REJECT)
#    Any connection not explicitly matched above (including all cleartext remote
#    connections and unauthorized networks) is immediately rejected.
# ------------------------------------------------------------------------------
hostnossl  all             all             0.0.0.0/0               reject
hostnossl  all             all             ::0/0                   reject
host       all             all             0.0.0.0/0               reject
host       all             all             ::0/0                   reject
```

---

## 6. Microservice JDBC Client Implementation Specification

### 6.1 JDBC URL Parameters & Certificate Truststore Mount
All microservices connecting to PostgreSQL (`api-gateway`, `auth-service`, `revenue`, `user-management`) must enforce `sslmode=verify-full`:

```properties
# application-prod.properties
spring.datasource.url=jdbc:postgresql://host.docker.internal:5432/lgd?ssl=true&sslmode=verify-full&sslrootcert=/etc/ssl/certs/lgd-internal-ca.crt
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

# HikariCP Connection Validation
spring.datasource.hikari.connection-timeout=5000
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
```

### 6.2 Container Volume Mount (`docker-compose.yml`)
To make the root CA accessible to unprivileged non-root containers (UID `10001`), mount the CA certificate file as read-only:

```yaml
services:
  revenue:
    volumes:
      - ./certs/lgd-internal-ca.crt:/etc/ssl/certs/lgd-internal-ca.crt:ro
```

### 6.3 Failure Mode Analysis
If an attacker attempts a Man-in-the-Middle (MITM) spoofing attack, or if the server certificate expires, or if the hostname mismatches `host.docker.internal`:
- The PostgreSQL JDBC driver aborts the TLS handshake immediately during socket initialization.
- HikariCP logs: `PSQLException: The server name host.docker.internal does not match the server certificate`.
- The application fails closed and refuses to transmit credentials or query parameters over unverified channels.

---

## 7. Deliverable Verification & Stage B Readiness

| Checkpoint | Requirement | Pre-Stage B Status |
|:---|:---|:---:|
| **Ordered Rule Precedence** | Replaces all `trust` rules; places SCRAM-SHA-256 rules before terminal `reject`. | **VERIFIED** |
| **Verified Subnet Accuracy** | Corrected subnet references to `10.89.0.0/24` and `172.20.32.0/20` (disproved `172.16.0.0/12`). | **VERIFIED** |
| **SAN Specification** | Explicitly includes `DNS:host.docker.internal` for `sslmode=verify-full` compatibility. | **VERIFIED** |
| **File Permissions** | Documented Windows NTFS ACLs (`icacls`) required for `server.key` service account access. | **VERIFIED** |
| **Zero-Downtime Reload** | Documented `pg_ctl reload` / `SELECT pg_reload_conf();` procedure for certificate renewal. | **VERIFIED** |

