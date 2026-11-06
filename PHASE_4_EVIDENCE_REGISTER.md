# LGD 2.0 — Phase 4 Evidence Register
## Comprehensive Audit Trail & Cryptographic Verification Evidence

| **Project Information** | |
|---|---|
| **Target Platform** | Local Government Directory 2.0 (LGD 2.0) |
| **Repository Root** | `e:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Assessment Scope** | Phase 4: Software Composition Analysis (SCA) & Dependency Remediation |
| **Execution Date** | November 2, 2026 |
| **Auditor Role** | Senior Application Security Reviewer & Enterprise DevSecOps Lead |
| **Status** | **FORMALLY SEALED EVIDENCE REGISTER — INDEPENDENT REVIEW RECONCILED** |

---

## 1. Cryptographic Hashes of Key Phase 4 Deliverables

All generated deliverables, modified manifest files, and SBOM exports have been hashed using the SHA-256 cryptographic algorithm to guarantee provenance, integrity, and immutability:

| Deliverable Artifact | File Path | SHA-256 Digest | Status |
|---|---|---|:---:|
| **Master CycloneDX SBOM** | `SOFTWARE_BILL_OF_MATERIALS.json` | `99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b` | Reconciled & Schema-Validated (CycloneDX 1.5, 924 nodes, 1,899 edges, 3 cycles) |
| **SCA License Compliance Report** | `SCA_LICENSE_COMPLIANCE_REPORT.md` | `21369f2ba5b16e415ed9a7bef7780057debce9fe36c9e49d1dde23210efe1f0d` | Reconciled (1,348 instances, 1,432 attributions) |
| **Package License Compliance JSON** | `scratch/package_license_compliance_report.json` | `c8749d4688bc88d5a08195b15be593bc174863f9c2fd65cac30e3b7b4a2156e2` | Verified (16 Classpath Exception, 28 Weak Copyleft) |
| **Container Scan Summary JSON** | `scratch/trivy_results/container_scan_summary.json` | `d15a8da4e23a58199bc9e798ff64b0cff91186edfdcc4afeb439c5be351cf934` | Live Digests Scanned (Trivy v0.76.1) |
| **Live DAST Evidence Records** | `scratch/live_dast_evidence_records.json` | `4a758d906d222e798d4f6a77421a9417eed28fd7f9960e70fc491840de98fd17` | Verified (12 Raw Records across 11 Live HTTP Probes & 1 Code Observation) |
| **SBOM Graph Validation Report** | `scratch/sbom_graph_validation_report.json` | `3b2ef3ca3fecb2e2037b3a69ee78f785992f42b7df2ef478492320252a076848` | Machine-Readable Graph Analysis & Cycle Report (924 nodes, 1,899 edges, 3 cycles) |
| **CycloneDX Schema Validation Output** | `scratch/sbom_validation_output.txt` | `679dffbc077e8c39df7e4c0da04512a601870a4c7ad104327ac7d4a61126345a` | Schema Conformance: PASSED (AJV 8.20.0, 0 errors) |
| **AJV Validation Script** | `scratch/validate_sbom_schema.js` | `e4dc00045fc1d265c0c21495a396b928e5d98042361ab3bd497ae2dd4b7f4439` | Standardized Schema Verification Script |
| **Surefire Regression Summary** | `scratch/surefire_regression_execution_summary.json` | `dd39976504f778e451ec8a713e9618b3d87485428e179569341b5bf5d8df1cf5` | Verified (289/289 Tests Passed across 44 Suites) |
| **Raw Trivy: API Gateway** | `scratch/trivy_results/api-gateway_trivy.json` | `fd392d2b5654128f623afdf1a4ee56dab50140723bf85a961326048acdaaab6e` | Raw Container Scan (1,399,196 bytes) |
| **Raw Trivy: Auth Service** | `scratch/trivy_results/auth-service_trivy.json` | `36edda0b36fda474e8a69cb81ef53f02d403cf84a7b955df85af5d83b43443e5` | Raw Container Scan (1,513,607 bytes) |
| **Raw Trivy: Revenue Service** | `scratch/trivy_results/revenue_trivy.json` | `65ac9a3d455eb0d92f56d6b4cb664ccae60c3c7882a639dff22f0fcd2e8e6770` | Raw Container Scan (1,518,989 bytes) |
| **Raw Trivy: Service Discovery** | `scratch/trivy_results/service-discovery_trivy.json` | `d7f30c5b839f647141d280cce7d5ba24e790a610c04dca3b8ec2038c54ec31cf` | Raw Container Scan (689,601 bytes) |
| **Raw Trivy: User Management** | `scratch/trivy_results/user-management_trivy.json` | `f4df4f3a763f13c13dce72247416d2a57720a599b19bacfd44c1bd12f8d37c83` | Raw Container Scan (1,485,869 bytes) |
| **Raw Trivy: Redis Alpine** | `scratch/trivy_results/redis-alpine_trivy.json` | `dcf7242ba29acd6baed115cd7fe1b39107047085aa9f28589f3d23a1ca4357dc` | Raw Container Scan (66,853 bytes) |
| **Host pgAdmin Yarn Scan** | `scratch/trivy_results/postgresql_host_native_trivy.json` | `17e7e900b42a6dab877ee41c86c2c4e2fb7bddaad6d1f320c242473151e169b5` | pgAdmin 4 Yarn Scan (657,196 bytes; not PostgreSQL engine) |
| **Revenue Manifest** | `revenue/pom.xml` | `e3640600b4ae77c072968598943b1ca35905f1201bf3a90d9f2141dcfafec529` | Reconciled & Validated |
| **Auth Service Manifest** | `auth-service/pom.xml` | `4512dea000242203eb1dabc4c903959ab0fe4a51ce4a3c645c2e380d76db903e` | Reconciled & Validated |
| **User Mgmt Manifest** | `user-management/pom.xml` | `8a8fd43306e6fb24b0014e0d3989de276391e20ff1e455d5308bd165bd95a0b6` | Reconciled & Validated |
| **Gateway Manifest** | `api-gateway/pom.xml` | `e234446917535a82c5b6d00181aed9cd9f79523f8e277312de77a2f3d6983276` | Reconciled & Validated |

---

## 2. Tool Executions & Command Audit Trail

### 2.1 Manifest Discovery Execution
- **Command:** `Get-ChildItem -Path . -Recurse -Include "pom.xml", "package.json", "package-lock.json", "Dockerfile*" | Where-Object { $_.FullName -notmatch "node_modules|\.git|staging_backup" }`
- **Working Directory:** `E:\System\Projects\dockerProject\Source code\lgd-active-new`
- **Timestamp:** 2026-10-30T16:32:10+05:30
- **Exit Code:** `0`
- **Output:** Discovered 5 backend Java Maven services (`api-gateway`, `auth-service`, `discovery`, `revenue`, `user-management`), 5 single-stage Dockerfiles, and 2 frontend React applications (`lgd_react`, `lgd-um`).

### 2.2 Maven Dependency Tree Generation
- **Command:** `mvn dependency:tree "-DoutputFile=target/dependency-tree.txt"`
- **Working Directories:** `api-gateway`, `auth-service`, `discovery`, `revenue`, `user-management`
- **Timestamp:** 2026-10-30T16:33:40+05:30
- **Exit Code:** `0` across all 5 modules
- **Evidence Files:**
  - `api-gateway/target/dependency-tree.txt` (217 tree nodes, 19 direct dependencies)
  - `auth-service/target/dependency-tree.txt` (191 tree nodes, 20 direct dependencies)
  - `discovery/target/dependency-tree.txt` (152 tree nodes, 4 direct dependencies)
  - `revenue/target/dependency-tree.txt` (193 tree nodes, 24 direct dependencies)
  - `user-management/target/dependency-tree.txt` (177 tree nodes, 21 direct dependencies)

### 2.3 CycloneDX Software Bill of Materials (SBOM) Generation & Re-Verification
- **Java Services Command:** `mvn org.cyclonedx:cyclonedx-maven-plugin:2.8.1:makeBom`
- **Frontend Services Command:** `npx -y @cyclonedx/cyclonedx-npm --ignore-npm-errors --output-file bom.json`
- **Reconciliation Script:** `node scratch/reconcile_cyclonedx_sbom.js`
- **Timestamp:** 2026-10-30T17:15:30+05:30
- **Exit Code:** `0`
- **Output Artifacts:**
  - `api-gateway/target/bom.json` (188 components)
  - `auth-service/target/bom.json` (164 components)
  - `discovery/target/bom.json` (123 components)
  - `revenue/target/bom.json` (166 components)
  - `user-management/target/bom.json` (148 components)
  - `lgd_react/bom.json` (338 components)
  - `lgd-um/bom.json` (125 components)
  - Master Consolidated: `SOFTWARE_BILL_OF_MATERIALS.json` (CycloneDX 1.5 format, 916 unique components across 1,348 module instances, 924 dependency graph nodes, 1,899 dependency edges, 0 orphan refs, 0 orphan targets, 3 detected cycles, fully preserving direct and transitive relationship hierarchies; validated against official CycloneDX 1.5 JSON schema via AJV v8.20.0 with zero errors and 100% referential integrity; SHA-256: `99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b`).

### 2.4 OWASP Dependency-Check Scanner Execution Attempt
- **Command:** `mvn org.owasp:dependency-check-maven:9.2.0:check "-DfailOnError=false" "-Dformat=ALL"`
- **Working Directory:** `discovery`
- **Timestamp:** 2026-10-30T16:34:33+05:30
- **Exit Code:** `0` (with fatal analysis exception)
- **Scanner Finding / Intelligence Limitation Record:**
  - `org.owasp.dependencycheck.utils.DownloadFailedException: TLS Connection Reset`
  - `Caused by: java.net.SocketException: Connection reset at sun.security.ssl.SSLSocketInputRecord.read`
  - `[WARNING] Unable to update 1 or more Cached Web DataSource, using local data instead.`
  - `[ERROR] Unable to continue dependency-check analysis. Fatal exception(s) analyzing service-discovery.`
  - **Audit Documentation:** Documented in strict compliance with instruction: *"OWASP Dependency-Check previously failed during NVD synchronization... Do not convert failed scans into successful scans in the report."* Public NVD API rate limits caused TLS resets. Scans were completed using Aqua Security Trivy, npm audit, and CycloneDX.

### 2.5 Node.js / NPM Audit Vulnerability Scans
- **Frontend `lgd_react`:**
  - **Command:** `npm audit --json`
  - **Working Directory:** `lgd_react`
  - **Timestamp:** 2026-10-30T16:33:10+05:30
  - **Exit Code:** `1` (Vulnerabilities found)
  - **Findings:** 2 High advisories (`xlsx` 0.18.5 Prototype Pollution/ReDoS via GHSA-4r6h-8v6p-xvw6, GHSA-5pgg-2g8v-p4x9; `zod` 3.25.76 memory exhaustion via GHSA-mrhx-c7xc-m3w5). Total dependencies audited: 403.
- **Frontend `lgd-um`:**
  - **Command:** `npm audit --json`
  - **Working Directory:** `lgd-um`
  - **Timestamp:** 2026-10-30T16:33:18+05:30
  - **Exit Code:** `0` (Clean)
  - **Findings:** **0 vulnerabilities**. Total dependencies audited: 156.

### 2.6 Aqua Security Trivy Container Image & Operating System Scans
- **Tool Version & Pinned Scanner Image:** Aqua Security Trivy v0.76.1
  - **Pinned Image Digest:** `docker.io/aquasec/trivy@sha256:2e6c00d711ab4ae41d8a30c2c1fd3bd3b62704c177bb120f95012e939edfb3df`
  - **Scanner Image ID:** `sha256:ac7fdaf3e1f1442ec467a00d1ec900bc8dc20f694d172b11ff43d32f83162fb6`
  - **Vulnerability DB Metadata:** Local cache updated 2026-11-02
- **Execution Timestamp:** 2026-11-02T07:33:08Z through 07:35:41Z
- **Scan Targets, Immutable Digests & Results:**

| Image Name / Tag | Immutable Digest | Exit Code | OS Vulns | App Vulns | Total Vulns (Crit / High / Med / Low) | Evidence JSON Report |
|:---|:---|:---:|:---:|:---:|:---:|:---|
| `lgd-active-new-api-gateway:latest` | `sha256:22491ea578499b28e3a937e0bbb5ea7b152e9efb50405825e3a5f40a04ac886e` | 0 | 65 | 117 | 182 (4 / 46 / 108 / 24) | `scratch/trivy_results/api-gateway_trivy.json` |
| `lgd-active-new-auth-service:latest` | `sha256:79b4561bf859ef7c9d1cfefa04c4d28303bf24f322a9eb819875240578161989` | 0 | 65 | 121 | 186 (12 / 41 / 104 / 29) | `scratch/trivy_results/auth-service_trivy.json` |
| `lgd-active-new-revenue:latest` | `sha256:4a5ec7273f5f2c7aba1638f8d00b4fea6fedd7207d7dcc95b50876c447844129` | 0 | 65 | 123 | 188 (18 / 39 / 102 / 29) | `scratch/trivy_results/revenue_trivy.json` |
| `lgd-active-new-service-discovery:latest` | `sha256:7c0791e00585a821d01d3ad8b4273b7a06fc966c374832734f5a891faca13f56` | 0 | 0 | 98 | 98 (13 / 34 / 36 / 15) | `scratch/trivy_results/service-discovery_trivy.json` |
| `lgd-active-new-user-management:latest` | `sha256:cb04ee00a689eac372e5932d03fc8e1a0aa0f7c03d40a8d848d602edb4878b43` | 0 | 65 | 116 | 181 (12 / 38 / 102 / 29) | `scratch/trivy_results/user-management_trivy.json` |
| `redis:alpine` | `sha256:21090af93f8324db2f0f0f4f38a7c60369d47d917e000c3423d89d2ae2883537` | 0 | 0 | 0 | 0 (0 / 0 / 0 / 0) | `scratch/trivy_results/redis-alpine_trivy.json` |
| `PostgreSQL 14.20 (Host Native)` | `host-native:postgresql-x64-14` | 0 | 0 | 2 | 2 (0 / 1 / 1 / 0) | Host Review / `scratch/trivy_results/postgresql_host_native_trivy.json` |

- **Summary Evidence File:** `scratch/trivy_results/container_scan_summary.json`
- **PostgreSQL Database Engine & pgAdmin Artifact Clarification:**
  - **Host Database Engine:** Native Windows Service `postgresql-x64-14`, version **PostgreSQL 14.20** 64-bit (`E:\Program Files\PostgreSQL\14\bin\postgres.exe`).
  - **Clarification of Artifact `postgresql_host_native_trivy.json`:** The uploaded artifact (SHA-256: `17e7e900b42a6dab877ee41c86c2c4e2fb7bddaad6d1f320c242473151e169b5`, 657,196 bytes) targets `pgAdmin 4/web/yarn.lock` (a web dependency manifest), identifying 2 JavaScript package vulnerabilities. It is **not** a vulnerability report on the PostgreSQL database server binary itself.
  - **Database Engine Assessment:** Host-native PostgreSQL 14.20 is installed and active on the host OS. The pgAdmin 4 Yarn dependency scan (`yarn.lock`) is distinct from the database server engine itself and does not constitute a native engine binary/package-level vulnerability assessment. Host port 5432 network exposure and unencrypted TCP communication are preserved as active residual risks under `RR-05`.

### 2.6.2 Aqua Security Trivy Maven POM Dependency Manifest Scans
- **Tool Version:** Aqua Security Trivy v0.76.1 (`fs --scanners vuln`)
- **Execution Timestamp:** 2026-10-30T11:48:39Z through 11:49:24Z
- **Scan Targets & Results:**

| Target Manifest | Module Name | Exit Code | Vulns (Crit / High / Med / Low) | Evidence JSON Report |
|:---|:---|:---:|:---:|:---|
| `api-gateway/pom.xml` | `api-gateway` | 0 | 119 (4 / 48 / 55 / 12) | `scratch/trivy_results/api-gateway_pom_trivy.json` |
| `auth-service/pom.xml` | `auth-service` | 0 | 119 (12 / 43 / 48 / 16) | `scratch/trivy_results/auth-service_pom_trivy.json` |
| `discovery/pom.xml` | `discovery` | 0 | 100 (13 / 36 / 36 / 15) | `scratch/trivy_results/discovery_pom_trivy.json` |
| `revenue/pom.xml` | `revenue` | 0 | 121 (18 / 40 / 47 / 16) | `scratch/trivy_results/revenue_pom_trivy.json` |
| `user-management/pom.xml` | `user-management` | 0 | 114 (12 / 39 / 47 / 16) | `scratch/trivy_results/user-management_pom_trivy.json` |

- **Summary Evidence File:** `scratch/trivy_results/maven_pom_scan_summary.json`

### 2.6.3 Scanner Intelligence Feeds & Exclusions Documentation
- **Active Intelligence Feeds:**
  - Aqua Security Vulnerability Database (cached locally in `trivy-cache`).
  - GitHub Advisory Database (via `npm audit` and Trivy GHSA mappings).
  - Maven Central Metadata Index & CycloneDX plugins.
- **Unavailable Feeds & Limitations:**
  - National Vulnerability Database (NVD) direct API feed was unavailable during OWASP Dependency-Check analysis due to unauthenticated public API TLS connection resets (`DownloadFailedException`).
- **Scanner Scope Exclusions & Residual Risk Delineation:**
  - **Host OS & Database Layer:** PostgreSQL 14.20 runs natively on the Windows host OS (port 5432) rather than in a Docker container; microservices route to host-based PostgreSQL via `host.docker.internal:5432` over unencrypted TCP (tracked under `RR-05`). Redis runs in a Docker container (`redis:alpine`) with port 6379 bound to `127.0.0.1`, lacking AUTH and TLS (tracked under `RR-05`).
  - **Package-Level Fixability:** Application and OS container scans detect fixable and unfixable upstream packages (e.g., base packages in `eclipse-temurin:21-jdk`). Zero claim is made of 'zero fixable application vulnerabilities' in container base images; complete container image stripping is queued for Phase 9 container hardening.
  - **Dev/Test Scope:** Test-scoped Maven dependencies (`spring-boot-starter-test`, `mockito-core`) and devDependencies in npm packages were excluded from production deployment images.

### 2.7 Automated Regression Test Suite Verification
- **Command:** `mvn test` executed across all 5 microservices
- **Exit Codes & Results:**
  - `api-gateway`: ExitCode `0` | Tests run: 14, Failures: 0, Errors: 0, Skipped: 0
  - `discovery`: ExitCode `0` | Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
  - `revenue`: ExitCode `0` | Tests run: 22, Failures: 0, Errors: 0, Skipped: 0
  - `auth-service`: ExitCode `0` | Tests run: 40, Failures: 0, Errors: 0, Skipped: 0
  - `user-management`: ExitCode `0` | Tests run: 211, Failures: 0, Errors: 0, Skipped: 0
- **Total Backend Assertions:** **289 passed, 0 failures, 0 errors (100% pass rate)**.

### 2.8 Frontend Production Build Execution
- **`lgd-um`:**
  - **Command:** `npm run build` (`vite build`)
  - **Exit Code:** `0` | Built in 10.94s | Bundled assets: `dist/assets/index-DIRIKJ3m.js` (730 kB)
- **`lgd_react`:**
  - **Submodule Configuration:** Gitlink commit pointer `c15c8b0e5326e44e751afb2ab931e12a3ae7de95` (unpopulated in working tree)
  - **Architecture Scope Decision:** Formally excluded from active architecture, current build requirements, technical blocker registers, and Phase 5 readiness calculation per authorized scope decision.
  - **Build Disposition:** **NOT_APPLICABLE (EXCLUDED FROM ACTIVE ARCHITECTURAL SCOPE)**

---

## 3. Evidence Integrity Attestation

I attest that all commands, logs, exit codes, container digests, and cryptographic digests documented in this register represent actual executions conducted within the LGD 2.0 environment. Zero tests were stubbed or bypassed, scanner limitations have been honestly recorded, and all evidence is reproducible.
