# LGD 2.0 — Phase 9.1.5: PostgreSQL TLS & Certificate Rollback Review
## Catalog View Portability, Client-Side `verify-full` Validation, NTFS ACL Preservation & Selective Role Rollback

| **Review Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Document ID** | `LGD2-P9.1.5-POSTGRESQL-TLS-ROLLBACK-REVIEW` |
| **Audit Phase** | Phase 9.1.5 Workstream D & E (DISC-P914-04, DISC-P914-05, BLK-CANON-03, RR-05) |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Target Database Engine**| PostgreSQL 14 (Native Windows Service: `postgresql-x64-14`) |
| **Data Directory** | `E:\Program Files\PostgreSQL\14\data` |
| **Evaluators** | Lead DBA, Senior Cryptography Specialist & Independent Security Auditor |
| **Evaluation Timestamp** | November 6, 2026 (`2026-11-06T12:45:00+05:30`) |
| **Controller Version** | 1.9.0 (Phase 9.1.5 Authoritative Baseline) |
| **Status Classification** | **`DESIGN_VALIDATED / ROLLBACK_DESIGN_ONLY`** |

---

## 1. Executive Summary & Defect Remediation Scope

Independent technical audit of the Phase 9.1.4 Stage B blueprint identified two critical flaws in PostgreSQL cryptographic verification and rollback procedures:
1. **Unportable Catalog Function (`DISC-P914-04`):** Step B6-02 specified `SELECT ssl_is_used();` to verify database transport encryption. In PostgreSQL 14, `ssl_is_used()` requires installing the optional contrib extension `sslinfo`. It does not exist in standard PostgreSQL 14 installations, resulting in runtime SQL execution failure.
2. **Incomplete Certificate Backup & Rollback (`DISC-P914-05`):** Step B1-01 backed up only `postgresql.conf` and `pg_hba.conf`, omitting `server.crt`, `server.key`, `ca.crt`, and NTFS ACLs. Furthermore, the proposed role rollback relied on `pg_dumpall --globals-only`, which exposes plaintext password hashes on disk and indiscriminately overwrites unrelated cluster globals.

This review delivers:
- The standard, extension-free `pg_stat_ssl` catalog query.
- The authoritative 7-factor client-side `verify-full` verification protocol.
- An 11-step certificate backup, NTFS ACL preservation, and recovery runbook.
- A secure, selective, encrypted role rollback procedure.

---

## 2. Technical Evaluation of PostgreSQL TLS Verification Functions

### 2.1 The `ssl_is_used()` Extension Defect
- **Source:** PostgreSQL Contrib Module `sslinfo`.
- **Precondition:** Requires `CREATE EXTENSION sslinfo;` executed by a superuser on the target database.
- **PostgreSQL 14 Default Behavior:** In vanilla PostgreSQL 14, querying `ssl_is_used()` throws:
  `ERROR: function ssl_is_used() does not exist`.
- **Verdict:** Mandating `ssl_is_used()` in an automated deployment script introduces unnecessary superuser commands, external extension dependencies, and predictable test failures.

### 2.2 The Standard Built-in View: `pg_stat_ssl`
- **Source:** Core PostgreSQL System Catalog (Chapter 54). Standard in all versions from PostgreSQL 9.5 through 14.x.
- **Extension Dependency:** **NONE.** Built into the core server binary.
- **Session Scoping:** Filtering by `WHERE pid = pg_backend_pid()` ensures that the query returns the TLS parameters of the **exact connection executing the query**, eliminating false positives from other active backends.
- **Attributes Returned:**
  - `ssl`: boolean (`true` if session is encrypted).
  - `version`: text (negotiated TLS protocol, e.g., `TLSv1.3`).
  - `cipher`: text (negotiated AEAD cipher suite, e.g., `TLS_AES_256_GCM_SHA384`).
  - `bits`: integer (cryptographic key strength, e.g., `256`).
  - `client_dn`: text (Distinguished Name from client certificate, if mutual TLS is configured).
- **Permissions:** Any connected user (including `lgd_prod_user` and `lgd_monitor`) has permission to read `pg_stat_ssl` for their own backend PID.

### 2.3 Authoritative Verification Query
```sql
SELECT ssl, version, cipher, bits, compression
FROM pg_stat_ssl
WHERE pid = pg_backend_pid();
```
*Acceptance Rule:* `ssl` MUST equal `true`, `version` MUST equal `'TLSv1.3'`, and `cipher` MUST match approved AEAD ciphers (`TLS_AES_256_GCM_SHA384` or `TLS_AES_128_GCM_SHA256`).

---

## 3. Client-Side `verify-full` Validation vs. Server `ssl=true`

> [!CRITICAL]
> **The Server-Side `ssl=true` Fallacy:** A query to `pg_stat_ssl` returning `ssl=true` proves that the transport channel between the client and server is encrypted. It **DOES NOT PROVE** that the client authenticated the server's identity or verified its certificate!

If a client connects with `sslmode=require`:
- Traffic is encrypted.
- `pg_stat_ssl` reports `ssl=true`.
- **HOWEVER:** The client does not verify the Certificate Authority (CA) chain and does not verify that the server's hostname matches the certificate's Subject Alternative Names (SAN). An attacker performing active Man-in-the-Middle (MITM) spoofing can present a rogue self-signed certificate, and the client will accept it!

### 3.1 The 7-Factor Client Verification Protocol
To prove full cryptographic transport security, the verification procedure must validate:
1. **Server Listener Active:** PostgreSQL listens on SSL port with valid certificate loaded.
2. **Client Verification Parameter:** Connection string enforces `sslmode=verify-full`.
3. **CA Trust Anchor:** Client trusts `ca.crt` (LGD Internal Root CA) via `sslrootcert`.
4. **Certificate SAN Coverage:** Server certificate contains `DNS:host.docker.internal`, `DNS:localhost`, `IP:127.0.0.1`.
5. **Hostname Validation:** Client validates SAN against connection hostname; mismatches terminate the handshake.
6. **Untrusted Certificate Rejection:** Probes using untrusted or self-signed certificates are rejected.
7. **Expired Certificate Rejection:** Probes using expired certificates are rejected.

---

## 4. Comprehensive 11-Step Certificate Backup & Rollback Runbook

```mermaid
sequenceDiagram
    autonumber
    participant DBA as Lead DBA
    participant OS as Windows Filesystem
    participant ACL as NTFS ACL Engine
    participant PG as PostgreSQL Service

    Note over DBA,PG: PRE-CHANGE BACKUP PHASE (Stage B1-01)
    DBA->>OS: Enumerate existing cert files (*.crt, *.key, *.pem)
    DBA->>OS: Copy cert files to isolated backup directory
    DBA->>ACL: icacls *.* /save NTFS_ACLS_ORIG.acl
    DBA->>OS: Generate SHA-256 manifest of backup files
    DBA->>ACL: Restrict backup directory to Administrators (F)

    Note over DBA,PG: DEPLOYMENT PHASE (Stage B1-02)
    DBA->>OS: Deploy server.crt, server.key, ca.crt
    DBA->>ACL: icacls server.key /grant:r "NT SERVICE\postgresql-x64-14:(R)"

    Note over DBA,PG: ROLLBACK & RECOVERY PHASE (If TLS Fails)
    DBA->>PG: Stop-Service postgresql-x64-14
    DBA->>OS: Remove deployed certs; restore original certs
    DBA->>ACL: icacls E:\...\data /restore NTFS_ACLS_ORIG.acl
    DBA->>OS: Verify restored SHA-256 against manifest
    DBA->>PG: Start-Service postgresql-x64-14 (Verify Socket & Logs)
```

### 4.1 Detailed Runbook Controls
1. **Control 1 (Certificate Census):** Enumerate `server.crt`, `server.key`, `ca.crt`, `root.crt` in data directory.
2. **Control 2 (Pre-Change Archiving):** Copy all identified certificate and key files to `$backupDir\postgresql_certs\`.
3. **Control 3 (NTFS ACL Preservation):** Execute `icacls "E:\Program Files\PostgreSQL\14\data\*.*" /save "$backupDir\NTFS_ACLS_ORIG.acl"`.
4. **Control 4 (SHA-256 Manifest):** Generate `CERT_SHA256_MANIFEST.txt` containing cryptographically verified hashes of all backed up files.
5. **Control 5 (Backup Access Restriction):** Restrict `$backupDir` using `icacls "$backupDir" /inheritance:r /grant:r "Administrators:(OI)(CI)(F)"`.
6. **Control 6 (Encryption at Rest):** Protect backup keys using DPAPI / Windows EFS (`cipher /e "$backupDir"`).
7. **Control 7 (Restoration Execution):** Remove newly deployed certs; copy backed up certs back to data directory.
8. **Control 8 (ACL Restoration):** Restore exact original NTFS permissions: `icacls "E:\Program Files\PostgreSQL\14\data" /restore "$backupDir\NTFS_ACLS_ORIG.acl"`.
9. **Control 9 (Integrity Attestation):** Re-compute SHA-256 hashes of restored files and confirm match against manifest.
10. **Control 10 (Service Account Permission Audit):** Confirm `NT SERVICE\postgresql-x64-14` holds read permissions on restored files.
11. **Control 11 (Post-Rollback Health Check):** Start PostgreSQL service and confirm clean socket binding on port 5432.

---

## 5. Role Backup Safety & The `pg_dumpall` Hazard

### 5.1 Vulnerabilities of `pg_dumpall --globals-only`
1. **Credential Disclosure:** `pg_dumpall --globals-only` exports SQL statements containing plaintext password verifiers:
   `ALTER ROLE postgres WITH ENCRYPTED PASSWORD 'SCRAM-SHA-256$...';`
   Even with SCRAM-SHA-256, exposing salt, stored key, and server key on disk allows offline dictionary attacks.
2. **Indiscriminate Overwrite:** Restoring globals drops and replaces all cluster roles, tablespaces, and database configurations. Unrelated accounts created by other DBAs during the maintenance window are erased.
3. **Administrative Lockout:** Restoring full globals can overwrite modified admin credentials, locking out operations staff.

### 5.2 Authoritative Selective Role Rollback Protocol
Instead of restoring full cluster globals, rollback must use targeted, role-specific restoration:
1. **Pre-Change Role State Capture:**
   Capture role metadata (without extracting hashes) into a timestamped audit record.
2. **Targeted Rollback Scripting:**
   Generate explicit rollback scripts scoped strictly to modified roles:
   ```sql
   ALTER ROLE lgd_prod_user WITH PASSWORD '${PRE_CHANGE_APP_PASSWORD}';
   ALTER ROLE lgd_repl_user WITH PASSWORD '${PRE_CHANGE_REPL_PASSWORD}';
   ALTER ROLE lgd_monitor WITH PASSWORD '${PRE_CHANGE_MONITOR_PASSWORD}';
   ```
3. **Encrypted Globals Backup (Disaster Recovery Only):**
   If a full globals dump is taken, it must be piped immediately into an encrypted file:
   ```powershell
   pg_dumpall --globals-only | openssl enc -aes-256-cbc -salt -out "$backupDir\globals_encrypted.bin" -pass env:BACKUP_KEY
   ```
4. **Post-Restore Verification:**
   Query `pg_roles` to verify target roles are active and able to authenticate.

---

## 6. Audit Disposition & Status

- **Finding `DISC-P914-04`:** **`DESIGN_VALIDATED`** (`pg_stat_ssl` and 7-factor `verify-full` protocol adopted).
- **Finding `DISC-P914-05`:** **`DESIGN_VALIDATED`** (11-control certificate runbook and selective role rollback adopted).
- **Rollback Feasibility:** In accordance with audit standards, because this procedure has not been physically executed in a staging window, its operational status remains:
  $$\mathbf{STATUS:\ ROLLBACK\_DESIGN\_ONLY}$$

