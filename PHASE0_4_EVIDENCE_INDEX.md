# Phase 0–4: Forensic Evidence Index & Artifact Catalog

| **Document Version** | 2.2.0 |
| **Audit Milestone** | Pre-Phase-5 Independent Verification (Gate A Closure) |
| **Lifecycle Scope** | Forensic Evidence Master Inventory & Artifact Catalog |
| **System** | Local Government Directory (LGD 2.0) |
| **Classification** | OFFICIAL / GOVERNMENT APPLICATION SECURITY AUDIT |
| **Original Evaluation Timestamp** | `2026-11-03T15:15:00+05:30` |
| **Final Revision Timestamp** | `2026-11-03T16:00:00+05:30` |
| **Final Validation Timestamp** | `2026-11-03T16:05:00+05:30` |
| **Index Status** | **ALL FORENSIC ARTIFACTS INDEXED & RECONCILED (57 ENTRIES = 51 FILES + 6 DIRECTORIES)** |
| **Roadmap Alignment** | Approved 14-Phase Program (Phase 0 through Phase 13) |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Executive Summary & Audit Mandate

In accordance with Section 11 of the Pre-Phase-5 Master Remediation and Independent Verification mandate, this **Forensic Evidence Index** catalogs all raw data files, automated test reports, container logs, scanner outputs, dependency manifests, and cryptographic checksums generated and validated across Phases 0 through 4.

### Authoritative Inventory Breakdown:
- **57 total catalog entries = 51 physical files + 6 directories.**
- **51 physical files = 49 SHA-256-verified files + 2 separately workbook-verified files.**
  - **49 SHA-256-Verified Files:** Directly verified against disk byte streams using Node.js `crypto.createHash('sha256')`.
  - **2 Workbook-Verified Files:** `SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx` and `DAST_Test_Case_Register.xlsx` verified via programmatic cell and row-level inspection (47 canonical operations and 153 dynamic test rows, cross-referenced with JSON records); these workbooks do not use fabricated hash entries.
- **6 Directory Entries:** 1 pre-remediation backup directory (`scratch/pre_remediation_backup/`) + 5 Maven Surefire test report directories (`api-gateway/target/surefire-reports/`, `discovery/target/surefire-reports/`, `auth-service/target/surefire-reports/`, `revenue/target/surefire-reports/`, `user-management/target/surefire-reports/`), verified via physical presence, Git status comparison, and automated test execution (289/289 passed).

Every entry in this catalog corresponds to an actual, inspectable artifact stored within the repository or its persistent scratch directory. In compliance with security standards, all credentials, tokens, session keys, and sensitive database secrets have been redacted from published evidence logs.

---

## 2. Phase 0: Discovery & Baseline Evidence

| Evidence ID | File Path | Format / Exact Size | Description / Scope | Verification Mechanism |
|:---|:---|:---:|:---|:---|
| **EVD-P0-01** | `PHASE0_BASELINE_RECONCILIATION_REPORT.md` | Markdown (29,480 bytes) | Master baseline reconciliation report resolving endpoint and file counts. | **SHA-256:** `a0aef0772389c832c1c80d059d80079ef668236d370a70a7dea930fa54a8ae5c` |
| **EVD-P0-02** | `scratch/pre_remediation_backup/` | Directory (Multi-file) | Pre-remediation snapshot of Git status, commit HEAD, and document hashes. | Git commit hash comparison |
| **EVD-P0-03** | `API_Endpoint_Inventory.md` | Markdown (11,656 bytes) | Baseline inventory of 46 production business REST API endpoints. | **SHA-256:** `6da2eee8c2263861d21af6de315f99b713bb270f1628647ef03bbf5c74af3232` |
| **EVD-P0-04** | `SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx` | Excel (298,868 bytes) | Master workbook tracking all 47 canonical operations and cross-phase links. | Workbook cell inspection / programmatic row verification (47 canonical operations verified) |

---

## 3. Phase 1: Threat Modeling & Trust Boundary Evidence

| Evidence ID | File Path | Format / Exact Size | Description / Scope | Verification Mechanism |
|:---|:---|:---:|:---|:---|
| **EVD-P1-01** | `PHASE1_THREAT_MODEL_VERIFICATION_REPORT.md` | Markdown (24,360 bytes) | Verification report validating 8 trust boundaries, 20 STRIDE, and 20 DREAD findings. | **SHA-256:** `db8082bd141032998ee0ed87e9ee100bf5ce07eaf1c9cc4d81c42df38fff285b` |
| **EVD-P1-02** | `STRIDE_Threat_Register.md` | Markdown (17,890 bytes) | Authoritative STRIDE register containing all 20 discrete threat scenarios. | **SHA-256:** `f6b3a455a8d65e8be3bed85c28f784984369b1e3161d99217b1db190c896b042` |
| **EVD-P1-03** | `DREAD_Risk_Assessment.md` | Markdown (9,908 bytes) | DREAD quantitative scoring matrix (12 Critical, 8 High). | **SHA-256:** `204e26999ffd18b4dbd5666d7b157271d35052f183d4b72bce2ef39ca7fa9828` |
| **EVD-P1-04** | `Trust_Boundary_Analysis.md` | Markdown (18,895 bytes) | In-depth analysis of trust boundaries `TB-01` through `TB-08`. | **SHA-256:** `f94cbb9b60488979ab4dff5dc4ca01f27783bb1481c0c299a97b25333e0867f4` |
| **EVD-P1-05** | `Threat_Model_Report.md` | Markdown (52,713 bytes) | Comprehensive Phase 1 architectural threat model report. | **SHA-256:** `057d494b95733e2df60eb25a752cf01a873722ff8cad51e528d7699e301b0d89` |
| **EVD-P1-06** | `Threat_Mitigation_Roadmap.md` | Markdown (16,298 bytes) | Threat mitigation engineering roadmap across architectural phases. | **SHA-256:** `00fb028605d03228508ae69d6c28ae427e0a3b4852a4f5c57daceabece760fca` |
| **EVD-P1-07** | `Attack_Tree_Diagrams.md` | Markdown (20,945 bytes) | Attack trees analyzing threat paths across multi-tenant and authentication boundaries. | **SHA-256:** `79fc87fb82b841182af218fa8d3e8162a46d89e81a2502f2a3e9ea7448fc7784` |
| **EVD-P1-08** | `Attack_Surface_Register.md` | Markdown (15,588 bytes) | Comprehensive attack surface register covering components AS-001 through AS-011. | **SHA-256:** `d66992761a27a4c753f480d2d324104a6108d660048db944471c5d770bbeee03` |

---

## 4. Phase 2: SAST & Deep Code Review Evidence

| Evidence ID | File Path | Format / Exact Size | Description / Scope | Verification Mechanism |
|:---|:---|:---:|:---|:---|
| **EVD-P2-01** | `PHASE2_SAST_INDEPENDENT_VERIFICATION_REPORT.md` | Markdown (15,599 bytes) | Independent verification report for all 21 SAST findings (`SAST-001`–`021`). | **SHA-256:** `b11c628a87f6fbb168501375f7fea46c512a97752c097b48c9773d5dc92eb626` |
| **EVD-P2-02** | `SAST_Findings_Log.md` | Markdown (72,079 bytes) | Detailed technical findings log with verbatim vulnerable and remediated code snippets. | **SHA-256:** `0cb3579df8cbf4bd835e56043fcada0d8afdfb93ed0508e15cabebc60eebe875` |
| **EVD-P2-03** | `api-gateway/target/surefire-reports/` | XML / TXT (14 tests) | Surefire test execution reports for Gateway security filters and route validator. | Maven test execution (14/14 PASS) |
| **EVD-P2-04** | `discovery/target/surefire-reports/` | XML / TXT (2 tests) | Surefire reports validating Eureka HTTP Basic authentication. | Maven test execution (2/2 PASS) |
| **EVD-P2-05** | `auth-service/target/surefire-reports/` | XML / TXT (40 tests) | Surefire reports for JWT hardening, entropy validation, and BCrypt verification. | Maven test execution (40/40 PASS) |
| **EVD-P2-06** | `revenue/target/surefire-reports/` | XML / TXT (22 tests) | Surefire reports for BOLA draft checks, XMLDSig validation, and file upload guards. | Maven test execution (22/22 PASS) |
| **EVD-P2-07** | `user-management/target/surefire-reports/`| XML / TXT (211 tests) | Surefire reports for method security annotations and mass-assignment prevention. | Maven test execution (211/211 PASS) |

---

## 5. Phase 3: DAST & Dynamic Penetration Testing Evidence

| Evidence ID | File Path | Format / Exact Size | Description / Scope | Verification Mechanism |
|:---|:---|:---:|:---|:---|
| **EVD-P3-01** | `DAST_Penetration_Test_Report.md` | Markdown (19,909 bytes) | Authoritative reconciled DAST report delineating baseline from post-remediation. | **SHA-256:** `568da926a62b956620096d2e73e48f952f9c67a6eb2b9db38b688bbe9f7bfdd3` |
| **EVD-P3-02** | `API_Vulnerability_Exploitation_Log.md` | Markdown (39,987 bytes) | Technical exploit reproduction log mapping 21 vectors to evidence and canonical operations. | **SHA-256:** `e1546eeaadd6fafbdbbd95686fb4612a5dafa25c4108ded52c3930204b8f3469` |
| **EVD-P3-03** | `DAST_Evidence_Register.md` | Markdown (34,467 bytes) | Consolidated dynamic evidence catalog linking `EXP-001`–`021` to `EV-001`–`021`. | **SHA-256:** `45f51c898f9d3e4ef04eb3f8bf1851d97b727f7ddc911a9274afb2aa5d9090f8` |
| **EVD-P3-04** | `PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md` | Markdown (25,557 bytes) | Final verification report detailing the resolution of 21 exploit vectors. | **SHA-256:** `3c1e71bcbfaa7d1d844f295cc2464be783c3e01159d7130a7c93d9aec349a605` |
| **EVD-P3-05** | `scratch/live_dast_evidence_records.json` | JSON (19,168 bytes) | Raw forensic DAST records (12 JSON records across 11 live HTTP probes & 1 code observation) verifying 9 vectors. | **SHA-256:** `4a758d906d222e798d4f6a77421a9417eed28fd7f9960e70fc491840de98fd17` |
| **EVD-P3-06** | `DAST_Test_Case_Register.xlsx` | Excel (164,713 bytes) | Full 153-row dynamic penetration test case register. | Programmatic row analysis / row-level verification (153 rows verified vs scratch/all_153_tests.json) |
| **EVD-P3-07** | `scratch/all_153_tests.json` | JSON (1,20,586 bytes) | Parsed JSON dump of all 153 DAST test case rows for automated verification. | **SHA-256:** `51d9fb7e68ea160e798f4a459e74510fcac4a2a71e94356f7f07c7ead3c4195f` |

---

## 6. Phase 4: Software Composition Analysis & Dependency Evidence

| Evidence ID | File Path | Format / Exact Size | Description / Scope | Verification Mechanism |
|:---|:---|:---:|:---|:---|
| **EVD-P4-01** | `PHASE4_SCA_INDEPENDENT_VERIFICATION_REPORT.md` | Markdown (12,268 bytes) | Independent SCA verification report detailing 12 findings, SBOM, and licenses. | **SHA-256:** `470a08ab5316fb61bf2281e287ad3f0c92ef6b7954f35a6b95c2f4edb4d4ea0b` |
| **EVD-P4-02** | `SOFTWARE_BILL_OF_MATERIALS.json` | JSON (18,05,646 bytes) | Regenerated CycloneDX 1.5 JSON SBOM (916 unique components, 1,348 instances). | **SHA-256:** `99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b` |
| **EVD-P4-03** | `scratch/validate_sbom_schema.js` | JavaScript (11,144 bytes) | AJV validation script asserting SBOM conformance against official CycloneDX 1.5 schema. | **SHA-256:** `e4dc00045fc1d265c0c21495a396b928e5d98042361ab3bd497ae2dd4b7f4439` |
| **EVD-P4-04** | `scratch/sbom_validation_output.txt` | TXT (2,561 bytes) | Official CycloneDX 1.5 JSON Schema validation output (AJV 8.20.0, Exit code 0, 0 errors). | **SHA-256:** `679dffbc077e8c39df7e4c0da04512a601870a4c7ad104327ac7d4a61126345a` |
| **EVD-P4-05** | `scratch/sbom_graph_validation_report.json` | JSON (3,415 bytes) | Machine-readable graph analysis and cycle report (924 nodes, 1,899 edges, 3 cycles). | **SHA-256:** `3b2ef3ca3fecb2e2037b3a69ee78f785992f42b7df2ef478492320252a076848` |
| **EVD-P4-06** | `scratch/package_license_compliance_report.json` | JSON (29,426 bytes) | Package-level license compliance report (16 Classpath Exception, 28 weak copyleft, 0 viral copyleft). | **SHA-256:** `c8749d4688bc88d5a08195b15be593bc174863f9c2fd65cac30e3b7b4a2156e2` |
| **EVD-P4-07** | `scratch/trivy_results/container_scan_summary.json` | JSON (7,695 bytes) | Live container image scans (Trivy v0.76.1) separating OS and Application vulnerabilities. | **SHA-256:** `d15a8da4e23a58199bc9e798ff64b0cff91186edfdcc4afeb439c5be351cf934` |
| **EVD-P4-08** | `scratch/trivy_results/postgresql_host_native_trivy.json` | JSON (6,57,196 bytes) | Trivy filesystem assessment for pgAdmin 4 web dependencies (yarn.lock; distinct from PostgreSQL engine binary). | **SHA-256:** `17e7e900b42a6dab877ee41c86c2c4e2fb7bddaad6d1f320c242473151e169b5` |
| **EVD-P4-09** | `SCA_LICENSE_COMPLIANCE_REPORT.md` | Markdown (27,857 bytes) | Authoritative open source license compliance and legal risk assessment. | **SHA-256:** `21369f2ba5b16e415ed9a7bef7780057debce9fe36c9e49d1dde23210efe1f0d` |
| **EVD-P4-10** | `SECURITY_RESIDUAL_RISK_REGISTER.md` | Markdown (25,278 bytes) | Master residual risk register containing `RR-01` through `RR-11` as pending acceptance. | **SHA-256:** `3d735362f3e05f206bb991bb9d38443fa5a73b130f657b74f0ca2234d562a5a9` |
| **EVD-P4-11** | `scratch/trivy_results/api-gateway_trivy.json` | JSON (13,99,196 bytes) | Complete raw Trivy scan report for `api-gateway` container image. | **SHA-256:** `fd392d2b5654128f623afdf1a4ee56dab50140723bf85a961326048acdaaab6e` |
| **EVD-P4-12** | `scratch/trivy_results/auth-service_trivy.json` | JSON (15,13,607 bytes) | Complete raw Trivy scan report for `auth-service` container image. | **SHA-256:** `36edda0b36fda474e8a69cb81ef53f02d403cf84a7b955df85af5d83b43443e5` |
| **EVD-P4-13** | `scratch/trivy_results/revenue_trivy.json` | JSON (15,18,989 bytes) | Complete raw Trivy scan report for `revenue` container image. | **SHA-256:** `65ac9a3d455eb0d92f56d6b4cb664ccae60c3c7882a639dff22f0fcd2e8e6770` |
| **EVD-P4-14** | `scratch/trivy_results/service-discovery_trivy.json` | JSON (6,89,601 bytes) | Complete raw Trivy scan report for `service-discovery` container image. | **SHA-256:** `d7f30c5b839f647141d280cce7d5ba24e790a610c04dca3b8ec2038c54ec31cf` |
| **EVD-P4-15** | `scratch/trivy_results/user-management_trivy.json` | JSON (14,85,869 bytes) | Complete raw Trivy scan report for `user-management` container image. | **SHA-256:** `f4df4f3a763f13c13dce72247416d2a57720a599b19bacfd44c1bd12f8d37c83` |
| **EVD-P4-16** | `scratch/trivy_results/redis-alpine_trivy.json` | JSON (66,853 bytes) | Complete raw Trivy scan report for `redis:alpine` container image. | **SHA-256:** `dcf7242ba29acd6baed115cd7fe1b39107047085aa9f28589f3d23a1ca4357dc` |
| **EVD-P4-17** | `revenue/pom.xml` | XML (7,000 bytes) | Hardened Maven POM for Revenue Service (PostgreSQL JDBC 42.6.2, Spring Boot 3.2.12). | **SHA-256:** `e3640600b4ae77c072968598943b1ca35905f1201bf3a90d9f2141dcfafec529` |
| **EVD-P4-18** | `auth-service/pom.xml` | XML (8,040 bytes) | Hardened Maven POM for Auth Service (Spring Security 6.3.8, Tomcat 10.1.34). | **SHA-256:** `4512dea000242203eb1dabc4c903959ab0fe4a51ce4a3c645c2e380d76db903e` |
| **EVD-P4-19** | `user-management/pom.xml` | XML (15,248 bytes) | Hardened Maven POM for User Management Service (Spring Security 6.3.8, Tomcat 10.1.34). | **SHA-256:** `8a8fd43306e6fb24b0014e0d3989de276391e20ff1e455d5308bd165bd95a0b6` |
| **EVD-P4-20** | `api-gateway/pom.xml` | XML (8,767 bytes) | Hardened Maven POM for API Gateway (Reactive Redis, Spring Security 6.3.8). | **SHA-256:** `e234446917535a82c5b6d00181aed9cd9f79523f8e277312de77a2f3d6983276` |
| **EVD-P4-21** | `discovery/pom.xml` | XML (2,192 bytes) | Hardened Maven POM for Service Discovery (HTTP Basic Auth, Spring Boot 3.2.12). | **SHA-256:** `4ce17b93d6862cec92a90b9bc1f9ef8fd7a5855964685b097d39d326daecc466` |

---

## 7. Master Governance & Traceability Evidence

| Evidence ID | File Path | Format / Exact Size | Description / Scope | Verification Mechanism |
|:---|:---|:---:|:---|:---|
| **EVD-GOV-01** | `PHASE0_4_MASTER_TRACEABILITY_AND_DOCUMENT_RECONCILIATION_REPORT.md` | Markdown (26,407 bytes) | Master traceability report uniting VULN, STRIDE, DREAD, SAST, EXP, SCA, and RR. | **SHA-256:** `58483f1da21660113ffe84977315098eeec6ba7cbc881b15ffca4aec509ceff9` |
| **EVD-GOV-02** | `Master_Finding_Traceability_Register.md` | Markdown (49,553 bytes) | Synchronized master finding register updated to cover Phases 0–4. | **SHA-256:** `5901167dc40bd1f43e98f7f0cdbf44b19a830575fbe5dc2db46fb6d9c2069b85` |
| **EVD-GOV-03** | `SECURITY_PHASE_TRACKER.md` | Markdown (24,668 bytes) | Official 14-phase roadmap tracker reflecting Phase 0–4 completion and Phase 5 halt. | **SHA-256:** `a98ccc320883ca6f3078f46c8998409a685def7222fc6f7fc463c8ef486bff6a` |
| **EVD-GOV-04** | `SECURITY_MASTER_FINDING_REGISTER.md` | Markdown (21,784 bytes) | Master finding register recording 19 VERIFIED_FIXED and 2 PARTIALLY_VERIFIED findings. | **SHA-256:** `cf165ab86913ea48b32e39d09176b895c5ecea46467b18c9c6500da936f89e9b` |
| **EVD-GOV-05** | `Consolidated_Remediation_Report.md` | Markdown (32,849 bytes) | Consolidated Phase 1-3 finding resolution report updated to 19 fixed / 2 partial. | **SHA-256:** `cbaed78a5f20c06876e9c869f5c44f2dc97548f2e0127648ca5dc876bf9bd52c` |
| **EVD-GOV-06** | `PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md` | Markdown (47,958 bytes) | Final independent audit disposition with three-gate evaluation and Phase 5 boundary. | **SHA-256:** `eca3f4c2d77a4634a89d22e182685aa08c216e2307c23bc718ed8363b88a9bea` |
| **EVD-GOV-07** | `PHASE_4_EVIDENCE_REGISTER.md` | Markdown (16,704 bytes) | Sealed cryptographic evidence register for Phase 4 deliverables. | **SHA-256:** `035df45d23b7f7f32c32d22beb3f089b4eeccba5fb7137d2b0625659d0fd6039` |
| **EVD-GOV-08** | `PHASE0_4_FINAL_REGRESSION_AND_BUILD_REPORT.md` | Markdown (13,335 bytes) | Final regression and build report (289 passes, lgd-um clean build, lgd_react NOT_APPLICABLE). | **SHA-256:** `1db7615ba5bd28d98dd38cdddf25a04105ec9fe8b2ab3efaffd7c962882cc585` |
| **EVD-GOV-09** | `scratch/surefire_regression_execution_summary.json` | JSON (11,005 bytes) | Aggregated Surefire XML test metrics (289 tests run, 289 passed, 0 failures, 0 errors across 44 suites). | **SHA-256:** `dd39976504f778e451ec8a713e9618b3d87485428e179569341b5bf5d8df1cf5` |
| **EVD-GOV-10** | `PHASE0_4_REMEDIATION_EXECUTION_LOG.md` | Markdown (13,625 bytes) | Chronological execution log of all Phase 0–4 engineering activities. | **SHA-256:** `4fca2b62e3180ea9e37340cb7e4c4af2996be77d509aa401b293e706525ccedc` |

---

## 8. Forensic Index Conclusion

All 57 catalog entries (51 physical files and 6 directories) are actively present in the repository file system, forensically validated, and indexed with zero integrity discrepancies:
- **51 physical files:** 49 eligible physical files verified via exact 100% SHA-256 digest concordance directly from disk byte streams, and 2 Excel workbooks verified via separate workbook cell inspection and programmatic row-level verification.
- **6 directories:** 1 pre-remediation backup directory verified via Git lineage and commit snapshots, and 5 Maven Surefire test report directories verified via Surefire XML test suite parse (289/289 tests passed).

Zero orphaned entries, zero missing files or directories, and zero fabricated digests exist.

### Mandatory Governance Statement:
$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$

---
*Index compiled independently by the Principal Application Security Auditor.*

