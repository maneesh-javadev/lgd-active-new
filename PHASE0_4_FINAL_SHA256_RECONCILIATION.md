# Phase 0–4: Final SHA-256 Checksum Reconciliation & Evidence Integrity Attestation

| **Document Version** | 1.2.0 (Authoritative Revalidation) |
|---|---|
| **Audit Milestone** | Phase 0–4 Independent Review & Gate A Revalidation |
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Original Evaluation Timestamp** | `2026-11-03T15:15:00+05:30` |
| **Final Revision Timestamp** | `2026-11-03T16:00:00+05:30` |
| **Final Validation Timestamp** | `2026-11-03T16:05:00+05:30` |
| **Classification** | OFFICIAL / GOVERNMENT APPLICATION SECURITY AUDIT |
| **Integrity Status** | **100% FORENSIC CONCORDANCE (57 ENTRIES = 51 PHYSICAL FILES + 6 DIRECTORIES)** |
| **Roadmap Alignment** | Approved 14-Phase Program (Phase 0 through Phase 13) |
| **Phase 5 Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Executive Summary & Verification Protocol

In compliance with Section 8, Section 9, and Section 10 of the independent audit reconciliation mandate, this document records the final, authoritative cryptographic checksums calculated directly from the saved bytes of all Phase 0–4 deliverables, governance registers, threat models, findings logs, and raw evidence artifacts.

### Authoritative Inventory Breakdown:
- **Evidence inventory:** 57 catalog entries = 51 physical files + 6 directories.
- **Physical file verification:** 51 physical files = 49 SHA-256-verified files + 2 separately workbook-verified files.
  - **49 SHA-256-Verified Files:** Evaluated via byte-level cryptographic digests computed directly from physical disk byte streams using Node.js `crypto.createHash('sha256')`.
  - **2 Workbook-Verified Files:** `SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx` and `DAST_Test_Case_Register.xlsx` verified via programmatic cell and row-level inspection (47 canonical operations and 153 dynamic test rows, cross-referenced with primary JSON records); these workbooks do not use synthetic or invented SHA-256 hashes.
- **6 Directory Entries:** 1 pre-remediation backup directory (`scratch/pre_remediation_backup/`) and 5 Maven Surefire XML test report directories (`target/surefire-reports/`), verified via physical presence, Git status comparison, and automated test execution (289/289 passed).
- **Final Governance Deliverables:** 8 revised reports, separately covered by the detached SHA-256 manifest [`PHASE0_4_FINAL_DELIVERABLE_SHA256_MANIFEST.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_FINAL_DELIVERABLE_SHA256_MANIFEST.md). In strict adherence to cryptographic non-circularity, this reconciliation report does not hash itself; its own integrity is attested within the detached manifest.

### Strict Verification Rules Applied:
1. **Recalculation Post-Edit:** All cryptographic digests were calculated strictly **after** all document edits were fully finalized and saved to disk.
2. **Byte-Level Computation:** Hashes and file sizes were computed directly from disk byte streams using Node.js `crypto.createHash('sha256')`.
3. **Zero Hash Reuse:** No previously declared or estimated hash was reused without byte-level recomputation.
4. **Physical Existence Verification:** Every indexed artifact was verified to physically exist in the local repository workspace.
5. **Clear Delineation of Raw Evidence:** Verified, missing, and non-reproducible raw evidence artifacts are explicitly cataloged.

---

## 2. Complete Cryptographic Checksum Reconciliation Table

### 2.1 Primary Governance Deliverables

| Artifact Description | File Path | Exact Byte Size | Size (KB) | SHA-256 Cryptographic Checksum | Verification Status |
|:---|:---|:---:|:---:|:---|:---:|
| **Authoritative Reconciled DAST Penetration Test Report** | [`DAST_Penetration_Test_Report.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Penetration_Test_Report.md) | 19,909 bytes | 19.4 KB | `568da926a62b956620096d2e73e48f952f9c67a6eb2b9db38b688bbe9f7bfdd3` | **CONFIRMED MATCH** |
| **Master Finding Register (19 Fixed, 2 Partial)** | [`SECURITY_MASTER_FINDING_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_MASTER_FINDING_REGISTER.md) | 21,784 bytes | 21.3 KB | `cf165ab86913ea48b32e39d09176b895c5ecea46467b18c9c6500da936f89e9b` | **CONFIRMED MATCH** |
| **Consolidated Security Remediation Report (19 Fixed, 2 Partial)** | [`Consolidated_Remediation_Report.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Consolidated_Remediation_Report.md) | 32,849 bytes | 32.1 KB | `cbaed78a5f20c06876e9c869f5c44f2dc97548f2e0127648ca5dc876bf9bd52c` | **CONFIRMED MATCH** |
| **Security Phase Execution Tracker & Roadmap** | [`SECURITY_PHASE_TRACKER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_PHASE_TRACKER.md) | 24,668 bytes | 24.1 KB | `a98ccc320883ca6f3078f46c8998409a685def7222fc6f7fc463c8ef486bff6a` | **CONFIRMED MATCH** |
| **Final Independent Audit Disposition Report** | [`PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md) | 47,958 bytes | 46.8 KB | `eca3f4c2d77a4634a89d22e182685aa08c216e2307c23bc718ed8363b88a9bea` | **CONFIRMED MATCH** |
| **Canonical Master Finding Traceability Register** | [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md) | 49,553 bytes | 48.4 KB | `5901167dc40bd1f43e98f7f0cdbf44b19a830575fbe5dc2db46fb6d9c2069b85` | **CONFIRMED MATCH** |
| **API Vulnerability Exploitation & Verification Log** | [`API_Vulnerability_Exploitation_Log.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/API_Vulnerability_Exploitation_Log.md) | 39,987 bytes | 39.0 KB | `e1546eeaadd6fafbdbbd95686fb4612a5dafa25c4108ded52c3930204b8f3469` | **CONFIRMED MATCH** |
| **DAST Dynamic Evidence Register** | [`DAST_Evidence_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Evidence_Register.md) | 34,467 bytes | 33.7 KB | `45f51c898f9d3e4ef04eb3f8bf1851d97b727f7ddc911a9274afb2aa5d9090f8` | **CONFIRMED MATCH** |
| **Phase 1 Threat Model Verification Report** | [`PHASE1_THREAT_MODEL_VERIFICATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE1_THREAT_MODEL_VERIFICATION_REPORT.md) | 24,360 bytes | 23.8 KB | `db8082bd141032998ee0ed87e9ee100bf5ce07eaf1c9cc4d81c42df38fff285b` | **CONFIRMED MATCH** |
| **Phase 2 SAST Independent Verification Report** | [`PHASE2_SAST_INDEPENDENT_VERIFICATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE2_SAST_INDEPENDENT_VERIFICATION_REPORT.md) | 15,599 bytes | 15.2 KB | `b11c628a87f6fbb168501375f7fea46c512a97752c097b48c9773d5dc92eb626` | **CONFIRMED MATCH** |
| **Phase 4 SCA Independent Verification Report** | [`PHASE4_SCA_INDEPENDENT_VERIFICATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE4_SCA_INDEPENDENT_VERIFICATION_REPORT.md) | 12,268 bytes | 12.0 KB | `470a08ab5316fb61bf2281e287ad3f0c92ef6b7954f35a6b95c2f4edb4d4ea0b` | **CONFIRMED MATCH** |
| **Authoritative STRIDE Threat Register** | [`STRIDE_Threat_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/STRIDE_Threat_Register.md) | 17,890 bytes | 17.5 KB | `f6b3a455a8d65e8be3bed85c28f784984369b1e3161d99217b1db190c896b042` | **CONFIRMED MATCH** |
| **Phase 1 Attack Surface Register (13 Reconciled Attack Surfaces)** | [`Attack_Surface_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Attack_Surface_Register.md) | 15,588 bytes | 15.2 KB | `d66992761a27a4c753f480d2d324104a6108d660048db944471c5d770bbeee03` | **CONFIRMED MATCH** |

### 2.2 Supporting Phase 0-4 Technical Reports

| Artifact Description | File Path | Exact Byte Size | Size (KB) | SHA-256 Cryptographic Checksum | Verification Status |
|:---|:---|:---:|:---:|:---|:---:|
| **Phase 0 Baseline Discovery Reconciliation Report** | [`PHASE0_BASELINE_RECONCILIATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_BASELINE_RECONCILIATION_REPORT.md) | 29,480 bytes | 28.8 KB | `a0aef0772389c832c1c80d059d80079ef668236d370a70a7dea930fa54a8ae5c` | **CONFIRMED MATCH** |
| **Phase 1 DREAD Quantitative Risk Assessment** | [`DREAD_Risk_Assessment.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DREAD_Risk_Assessment.md) | 9,908 bytes | 9.7 KB | `204e26999ffd18b4dbd5666d7b157271d35052f183d4b72bce2ef39ca7fa9828` | **CONFIRMED MATCH** |
| **Phase 1 Trust Boundary Analysis (TB-01 to TB-08)** | [`Trust_Boundary_Analysis.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Trust_Boundary_Analysis.md) | 18,895 bytes | 18.5 KB | `f94cbb9b60488979ab4dff5dc4ca01f27783bb1481c0c299a97b25333e0867f4` | **CONFIRMED MATCH** |
| **Phase 1 Comprehensive Threat Model Report** | [`Threat_Model_Report.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Threat_Model_Report.md) | 52,713 bytes | 51.5 KB | `057d494b95733e2df60eb25a752cf01a873722ff8cad51e528d7699e301b0d89` | **CONFIRMED MATCH** |
| **Phase 1 Threat Mitigation Roadmap** | [`Threat_Mitigation_Roadmap.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Threat_Mitigation_Roadmap.md) | 16,298 bytes | 15.9 KB | `00fb028605d03228508ae69d6c28ae427e0a3b4852a4f5c57daceabece760fca` | **CONFIRMED MATCH** |
| **Phase 1 Attack Tree Visual Diagrams** | [`Attack_Tree_Diagrams.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Attack_Tree_Diagrams.md) | 20,945 bytes | 20.5 KB | `79fc87fb82b841182af218fa8d3e8162a46d89e81a2502f2a3e9ea7448fc7784` | **CONFIRMED MATCH** |
| **Phase 2 SAST Findings Technical Log** | [`SAST_Findings_Log.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SAST_Findings_Log.md) | 72,079 bytes | 70.4 KB | `0cb3579df8cbf4bd835e56043fcada0d8afdfb93ed0508e15cabebc60eebe875` | **CONFIRMED MATCH** |
| **Phase 1 Threat Model Remediation Report** | [`PHASE1_THREAT_MODEL_REMEDIATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE1_THREAT_MODEL_REMEDIATION_REPORT.md) | 15,339 bytes | 15.0 KB | `c53dade0bb21da1ba18edae48f8d062cda8072435b2db09524fb7d50579181cd` | **CONFIRMED MATCH** |
| **Phase 1-3 Executive Technical Signoff Report** | [`PHASE1_PHASE2_PHASE3_SIGNOFF_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE1_PHASE2_PHASE3_SIGNOFF_REPORT.md) | 8,930 bytes | 8.7 KB | `b78252367e75baf92c7f1f5628a679ee30ece8062eefe438021bc04f7499a98a` | **CONFIRMED MATCH** |
| **Phase 3 DAST Remediation Report (Historical Oct 30 Snapshot Superseded by Final Verification)** | [`PHASE3_DAST_REMEDIATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE3_DAST_REMEDIATION_REPORT.md) | 21,155 bytes | 20.7 KB | `bd3b1f2bc5741a4f34832de66319f46cbcb275bdb12f4fff8920f98e0fcc4cc5` | **CONFIRMED MATCH** |
| **Phase 3 Final DAST Independent Verification Report** | [`PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md) | 25,557 bytes | 25.0 KB | `3c1e71bcbfaa7d1d844f295cc2464be783c3e01159d7130a7c93d9aec349a605` | **CONFIRMED MATCH** |
| **Phase 4 Open Source Software License Compliance Report** | [`SCA_LICENSE_COMPLIANCE_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_LICENSE_COMPLIANCE_REPORT.md) | 27,857 bytes | 27.2 KB | `21369f2ba5b16e415ed9a7bef7780057debce9fe36c9e49d1dde23210efe1f0d` | **CONFIRMED MATCH** |
| **Master Residual Risk Register (RR-01 to RR-11)** | [`SECURITY_RESIDUAL_RISK_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_RESIDUAL_RISK_REGISTER.md) | 25,278 bytes | 24.7 KB | `3d735362f3e05f206bb991bb9d38443fa5a73b130f657b74f0ca2234d562a5a9` | **CONFIRMED MATCH** |
| **Phase 4 Evidence Register & Command Audit Trail** | [`PHASE_4_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_4_EVIDENCE_REGISTER.md) | 16,704 bytes | 16.3 KB | `035df45d23b7f7f32c32d22beb3f089b4eeccba5fb7137d2b0625659d0fd6039` | **CONFIRMED MATCH** |
| **Master Traceability & Document Reconciliation Report** | [`PHASE0_4_MASTER_TRACEABILITY_AND_DOCUMENT_RECONCILIATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_MASTER_TRACEABILITY_AND_DOCUMENT_RECONCILIATION_REPORT.md) | 26,407 bytes | 25.8 KB | `58483f1da21660113ffe84977315098eeec6ba7cbc881b15ffca4aec509ceff9` | **CONFIRMED MATCH** |
| **Phase 0-4 Remediation Activity Execution Log** | [`PHASE0_4_REMEDIATION_EXECUTION_LOG.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_REMEDIATION_EXECUTION_LOG.md) | 13,625 bytes | 13.3 KB | `4fca2b62e3180ea9e37340cb7e4c4af2996be77d509aa401b293e706525ccedc` | **CONFIRMED MATCH** |
| **Final Regression & Build Verification Report** | [`PHASE0_4_FINAL_REGRESSION_AND_BUILD_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_FINAL_REGRESSION_AND_BUILD_REPORT.md) | 13,335 bytes | 13.0 KB | `1db7615ba5bd28d98dd38cdddf25a04105ec9fe8b2ab3efaffd7c962882cc585` | **CONFIRMED MATCH** |
| **Phase 0-4 Forensic Evidence Index & Catalog** | [`PHASE0_4_EVIDENCE_INDEX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_EVIDENCE_INDEX.md) | 18,454 bytes | 18.0 KB | `8cfe62c29f886c4e00f3df3867d30f64b055865757b10007bf340c53b6dccddf` | **CONFIRMED MATCH** |
| **Final Cross-Document Consistency Report (Gate A Revalidation & Discrepancies 1-44)** | [`PHASE0_4_FINAL_CROSS_DOCUMENT_CONSISTENCY_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_FINAL_CROSS_DOCUMENT_CONSISTENCY_REPORT.md) | 62,618 bytes | 61.2 KB | `5710b762a12c228ba23082519ff8d57912c93c1745e7f6531babf5eb3a7d8f78` | **CONFIRMED MATCH** |

### 2.3 Raw Evidence Artifacts & Tool Outputs

| Artifact Description | File Path | Exact Byte Size | Size (KB) | SHA-256 Cryptographic Checksum | Verification Status |
|:---|:---|:---:|:---:|:---|:---:|
| **Authoritative 46-Endpoint Business REST API Inventory** | [`API_Endpoint_Inventory.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/API_Endpoint_Inventory.md) | 11,656 bytes | 11.4 KB | `6da2eee8c2263861d21af6de315f99b713bb270f1628647ef03bbf5c74af3232` | **CONFIRMED MATCH** |
| **Master CycloneDX 1.5 JSON Software Bill of Materials** | [`SOFTWARE_BILL_OF_MATERIALS.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SOFTWARE_BILL_OF_MATERIALS.json) | 1,805,646 bytes | 1763.3 KB | `99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b` | **CONFIRMED MATCH** |
| **Comprehensive Recursive Semantic Cross-Document Validation Script (18 Check Categories)** | [`scratch/validate_documentation_semantics.js`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/validate_documentation_semantics.js) | 29,471 bytes | 28.8 KB | `ac0183376c9bf94fd80a026fc13c04b20249fd75ba9dd0981f44edd5b48646c4` | **CONFIRMED MATCH** |
| **Semantic Validator Negative Fixture Test Runner (8 Negative Fixtures)** | [`scratch/test_validator_negative_fixtures.js`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/test_validator_negative_fixtures.js) | 4,222 bytes | 4.1 KB | `4e94ed8d9e39979d84f51ba4415d6bf23793fc2a62d2b6166032da7a35fddd8d` | **CONFIRMED MATCH** |
| **AJV 8.20.0 Schema Validation Script for CycloneDX 1.5** | [`scratch/validate_sbom_schema.js`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/validate_sbom_schema.js) | 11,144 bytes | 10.9 KB | `e4dc00045fc1d265c0c21495a396b928e5d98042361ab3bd497ae2dd4b7f4439` | **CONFIRMED MATCH** |
| **CycloneDX 1.5 Schema Conformance Output (0 errors)** | [`scratch/sbom_validation_output.txt`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/sbom_validation_output.txt) | 2,561 bytes | 2.5 KB | `679dffbc077e8c39df7e4c0da04512a601870a4c7ad104327ac7d4a61126345a` | **CONFIRMED MATCH** |
| **Machine-Readable SBOM Graph Analysis & Cycle Report** | [`scratch/sbom_graph_validation_report.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/sbom_graph_validation_report.json) | 3,415 bytes | 3.3 KB | `3b2ef3ca3fecb2e2037b3a69ee78f785992f42b7df2ef478492320252a076848` | **CONFIRMED MATCH** |
| **Package-Level License Compliance Data** | [`scratch/package_license_compliance_report.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/package_license_compliance_report.json) | 29,426 bytes | 28.7 KB | `c8749d4688bc88d5a08195b15be593bc174863f9c2fd65cac30e3b7b4a2156e2` | **CONFIRMED MATCH** |
| **Raw Forensic DAST Records (12 Records, 11 Probes + 1 Code)** | [`scratch/live_dast_evidence_records.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/live_dast_evidence_records.json) | 19,168 bytes | 18.7 KB | `4a758d906d222e798d4f6a77421a9417eed28fd7f9960e70fc491840de98fd17` | **CONFIRMED MATCH** |
| **Parsed JSON Dump of All 153 Dynamic Test Cases** | [`scratch/all_153_tests.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/all_153_tests.json) | 120,586 bytes | 117.8 KB | `51d9fb7e68ea160e798f4a459e74510fcac4a2a71e94356f7f07c7ead3c4195f` | **CONFIRMED MATCH** |
| **Surefire XML Test Execution Metrics (289/289 Tests Passed)** | [`scratch/surefire_regression_execution_summary.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/surefire_regression_execution_summary.json) | 11,005 bytes | 10.7 KB | `dd39976504f778e451ec8a713e9618b3d87485428e179569341b5bf5d8df1cf5` | **CONFIRMED MATCH** |
| **Live Container Scan Summary (Trivy v0.76.1)** | [`scratch/trivy_results/container_scan_summary.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/container_scan_summary.json) | 7,695 bytes | 7.5 KB | `d15a8da4e23a58199bc9e798ff64b0cff91186edfdcc4afeb439c5be351cf934` | **CONFIRMED MATCH** |
| **pgAdmin 4 Yarn Lock Trivy Scan (not host engine)** | [`scratch/trivy_results/postgresql_host_native_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/postgresql_host_native_trivy.json) | 657,196 bytes | 641.8 KB | `17e7e900b42a6dab877ee41c86c2c4e2fb7bddaad6d1f320c242473151e169b5` | **CONFIRMED MATCH** |
| **Raw Trivy Scan: api-gateway Container Image** | [`scratch/trivy_results/api-gateway_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/api-gateway_trivy.json) | 1,399,196 bytes | 1366.4 KB | `fd392d2b5654128f623afdf1a4ee56dab50140723bf85a961326048acdaaab6e` | **CONFIRMED MATCH** |
| **Raw Trivy Scan: auth-service Container Image** | [`scratch/trivy_results/auth-service_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/auth-service_trivy.json) | 1,513,607 bytes | 1478.1 KB | `36edda0b36fda474e8a69cb81ef53f02d403cf84a7b955df85af5d83b43443e5` | **CONFIRMED MATCH** |
| **Raw Trivy Scan: revenue Container Image** | [`scratch/trivy_results/revenue_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/revenue_trivy.json) | 1,518,989 bytes | 1483.4 KB | `65ac9a3d455eb0d92f56d6b4cb664ccae60c3c7882a639dff22f0fcd2e8e6770` | **CONFIRMED MATCH** |
| **Raw Trivy Scan: service-discovery Container Image** | [`scratch/trivy_results/service-discovery_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/service-discovery_trivy.json) | 689,601 bytes | 673.4 KB | `d7f30c5b839f647141d280cce7d5ba24e790a610c04dca3b8ec2038c54ec31cf` | **CONFIRMED MATCH** |
| **Raw Trivy Scan: user-management Container Image** | [`scratch/trivy_results/user-management_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/user-management_trivy.json) | 1,485,869 bytes | 1451.0 KB | `f4df4f3a763f13c13dce72247416d2a57720a599b19bacfd44c1bd12f8d37c83` | **CONFIRMED MATCH** |
| **Raw Trivy Scan: redis:alpine Container Image** | [`scratch/trivy_results/redis-alpine_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/redis-alpine_trivy.json) | 66,853 bytes | 65.3 KB | `dcf7242ba29acd6baed115cd7fe1b39107047085aa9f28589f3d23a1ca4357dc` | **CONFIRMED MATCH** |
| **Hardened Maven POM: Revenue Service** | [`revenue/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/pom.xml) | 7,000 bytes | 6.8 KB | `e3640600b4ae77c072968598943b1ca35905f1201bf3a90d9f2141dcfafec529` | **CONFIRMED MATCH** |
| **Hardened Maven POM: Auth Service** | [`auth-service/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/pom.xml) | 8,040 bytes | 7.9 KB | `4512dea000242203eb1dabc4c903959ab0fe4a51ce4a3c645c2e380d76db903e` | **CONFIRMED MATCH** |
| **Hardened Maven POM: User Management Service** | [`user-management/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/pom.xml) | 15,248 bytes | 14.9 KB | `8a8fd43306e6fb24b0014e0d3989de276391e20ff1e455d5308bd165bd95a0b6` | **CONFIRMED MATCH** |
| **Hardened Maven POM: API Gateway** | [`api-gateway/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/pom.xml) | 8,767 bytes | 8.6 KB | `e234446917535a82c5b6d00181aed9cd9f79523f8e277312de77a2f3d6983276` | **CONFIRMED MATCH** |
| **Hardened Maven POM: Service Discovery** | [`discovery/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/discovery/pom.xml) | 2,192 bytes | 2.1 KB | `4ce17b93d6862cec92a90b9bc1f9ef8fd7a5855964685b097d39d326daecc466` | **CONFIRMED MATCH** |

---

## 3. Catalog of Raw Evidence Artifacts: Verified, Missing & Non-Reproducible

In adherence to Section 10 and Section 11 of the reconciliation mandate, every raw evidence artifact is forensically categorized:

### 3.1 Fully Verified Raw Evidence Artifacts (Available on Disk)
1. **Surefire Automated Test Reports (44 XML Files / 289 Tests):**
   - `api-gateway/target/surefire-reports/`: 14 tests run, 14 passed, 0 failures, 0 errors.
   - `discovery/target/surefire-reports/`: 2 tests run, 2 passed, 0 failures, 0 errors.
   - `revenue/target/surefire-reports/`: 22 tests run, 22 passed, 0 failures, 0 errors.
   - `auth-service/target/surefire-reports/`: 40 tests run, 40 passed, 0 failures, 0 errors.
   - `user-management/target/surefire-reports/`: 211 tests run, 211 passed, 0 failures, 0 errors.
   - *Consolidated Metric:* **289 tests passed across 44 test suites (100% test lifecycle pass rate, 0 failures, 0 errors)** in `scratch/surefire_regression_execution_summary.json`. Note: Package-level verification (`mvn package` / JAR packaging) is not established by available disk evidence.
2. **Forensic Live DAST Records (`scratch/live_dast_evidence_records.json`):**
   - 12 raw JSON records capturing live HTTP requests, status codes, and sanitized responses across 11 live edge probes and 1 code observation (`EXP-001`, `EXP-011`, `EXP-012`, `EXP-013`, `EXP-014`, `EXP-016`, `EXP-019-UI`, `EXP-019-DOCS`, `EXP-020-UNAUTH`, `EXP-020-AUTH`, `EXP-021`, `OBS-SQLI-01`).
3. **Master Dynamic Test Case Register (`scratch/all_153_tests.json` & `DAST_Test_Case_Register.xlsx`):**
   - 153 test rows categorized across SAST exploits (21), baseline operations (47), boundary fuzzing (60), and SQLi refutation probes (25). Verified via programmatic row-level verification without invented hashes.
4. **Master CycloneDX 1.5 SBOM (`SOFTWARE_BILL_OF_MATERIALS.json`):**
   - Schema-validated via AJV 8.20.0 against official CycloneDX 1.5 JSON schemas (`scratch/sbom_validation_output.txt`).
   - 916 unique components across 1,348 module instances; 924 graph nodes, 1,899 dependency edges, 0 orphan refs, 0 orphan targets, 3 closed pairwise peer-dependency cycles. SHA-256: `99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b`.
5. **Raw Aqua Security Trivy Container Scans (`scratch/trivy_results/`):**
   - 6 raw container image scans (`api-gateway`, `auth-service`, `revenue`, `service-discovery`, `user-management`, `redis:alpine`) in JSON format.
6. **Hardened Maven POM Manifests (5 Modules):**
   - Upgraded Maven configurations committed and verified on disk.
7. **Comprehensive Semantic Validation Script (`scratch/validate_documentation_semantics.js`):**
   - 18 check suites verifying 100% concordance across roadmap boundaries, finding IDs, counts, statuses, and cross-document mappings.

### 3.2 Missing or Non-Independently Reproducible Evidence Artifacts
1. **Frontend Production Build for `lgd_react`:**
   - *Status:* **NOT APPLICABLE (EXCLUDED FROM ACTIVE ARCHITECTURAL SCOPE)**
   - *Root Cause:* Per architectural scope reconciliation decision, `lgd_react` is a retired frontend component (submodule pointer `mode 160000`, commit `c15c8b0e5326e44e751afb2ab931e12a3ae7de95`) excluded from active architecture, build requirements, and blocker register. It does not constitute a technical failure.
2. **Native PostgreSQL 14.20 Host Engine Binary Vulnerability Scan:**
   - *Status:* **NOT PERFORMED / EXCLUDED FROM TOOL SCOPE**
   - *Root Cause:* The host PostgreSQL 14.20 instance (Windows PID 16496) runs natively on the Windows host OS. The retained scan artifact (`scratch/trivy_results/postgresql_host_native_trivy.json`) evaluates the `yarn.lock` dependencies of the pgAdmin 4 web GUI, **not** the PostgreSQL database engine binary. Host engine security is managed under residual risk `RR-05`.
3. **OWASP Dependency-Check Scanner Output:**
   - *Status:* **SCAN EXECUTION FAILED / INTELLIGENCE FEED UNAVAILABLE**
   - *Root Cause:* During execution on `discovery`, direct National Vulnerability Database (NVD) API calls experienced TLS connection resets (`DownloadFailedException`) due to public NVD rate limits. Dependency security was instead completed using Aqua Security Trivy v0.76.1, npm audit, and CycloneDX.
4. **HSTS Security Header Dynamic Retest on Ingress TLS:**
   - *Status:* **PARTIALLY_VERIFIED (Pending Active TLS Ingress)**
   - *Root Cause:* Per RFC 6797, Strict-Transport-Security (HSTS) headers are strictly ignored and must not be emitted over plaintext HTTP. While CSP and other security headers were confirmed live over HTTP, dynamic validation of HSTS is pending genuine HTTPS/TLS ingress termination (`SAST-016` / `EXP-016`).
5. **Direct Downstream Revenue Container Verification for TestController Absence:**
   - *Status:* **PARTIALLY_VERIFIED (Gateway Perimeter 403 Confirmed; Downstream Check Pending)**
   - *Root Cause:* Dynamic edge testing confirmed that the API Gateway perimeter returns HTTP 403 Forbidden for `/revenue/test/api1` (`EXP-021` / `EV-008`). Direct in-container probe confirming that `TestController` beans are uninstantiated in the running Revenue container under the production profile remains pending.
6. **Formal Human Governance Sign-Off Memo (DAA/CISO Signatures):**
   - *Status:* **PENDING_FORMAL_ACCEPTANCE**
   - *Root Cause:* Residual risks `RR-01` through `RR-11` are thoroughly mitigated by operational controls, but formal executive risk acceptance requires an executed, signed authorization memo from the Designated Approving Authority (DAA) or CISO. In compliance with non-fabrication mandates, signatures are not fabricated.

---

## 4. Final Audit Gate Determinations

- **Gate A (Documentation Integrity, Traceability & Governance):** **`PASS`**
  - **Determination:** Revalidated to **PASS** upon complete reconciliation of all 57 catalog entries in the Evidence Index (51 physical files + 6 directories), 100% resolution of all 44 identified documentary discrepancies, successful zero-defect execution of semantic cross-document validation script `scratch/validate_documentation_semantics.js` across all 66 repository Markdown documents (18 verification categories), and 100% failure detection across 8 negative error fixtures (`scratch/test_validator_negative_fixtures.js`).
  - **Cryptographic & Verification Criterion Distinction:**
    - **49 Eligible Physical Files:** 100% cryptographic SHA-256 concordance verified directly from disk byte streams.
    - **2 Excel Workbook Files:** Separate workbook inspection and programmatic row-level verification confirmed for `SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx` (47 operations) and `DAST_Test_Case_Register.xlsx` (153 rows); zero invented hashes.
    - **6 Cataloged Directories:** Physical presence and test suite verification confirmed (1 backup directory + 5 Maven Surefire XML report directories, with 289/289 passed tests).
  - All 44 cross-document discrepancies resolved with zero contradictions.
  - Complete bidirectional traceability across all 23 baseline findings, 20 STRIDE threats, 20 DREAD quantitative assessments, 21 SAST findings, 47 canonical operations, and 153 dynamic test rows.
  - Dedicated baseline traceability row established for VULN-009 (Docker host port unmapping) with zero false EXP/EV associations (`[No dedicated EXP/EV mapping identified]`).
  - SAST-013 canonical identity reconciled and preserved as RouteValidator wildcard exclusion in `api-gateway` (disassociated from Jasypt credentials).
  - VULN-016 baseline confirmed `*[Unassigned]*` from STRIDE, with SAST-016 linked solely as defense-in-depth mitigation under `THR-STRIDE-014 (Mitigation)`.
  - Repository-integrity attestation forensically reconciled and qualified (`UNDETERMINED` for un-snapshotted baseline files).

- **Gate B (Technical Verification Completeness):** **`HOLD`**
  - Held due to three active technical/environmental blockers:
    - `BLK-01`: `EXP-016` genuine HTTPS/TLS HSTS verification (`PARTIALLY_VERIFIED`).
    - `BLK-02`: `EXP-021` Revenue downstream `TestController` census (`PARTIALLY_VERIFIED`).
    - `BLK-03`: Host PostgreSQL 14 service availability and Revenue container stability.
  - (Note: Former frontend build blocker retired as `NOT_APPLICABLE` per architectural scope decision; active frontend `lgd-um` builds cleanly with Exit Code 0; Gate B criteria apply solely to active components).

- **Gate C (Formal Governance & Risk Acceptance):** **`PENDING_FORMAL_ACCEPTANCE`**
  - All 11 residual risks (`RR-01` through `RR-11`) remain pending formal authorization memo from the Designated Approving Authority (DAA) / CISO.

---

## 5. Master Governance Outcome & Final Mandatory Statement

$$\mathbf{OVERALL\ AUDIT\ STATUS:\ PENDING\_REMEDIATION\_AND\_INDEPENDENT\_RETEST}$$

### Mandatory Governance Statement:

$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$

---
*Report executed, verified, and sealed independently in strict adherence to evidence integrity and non-fabrication mandates.*

