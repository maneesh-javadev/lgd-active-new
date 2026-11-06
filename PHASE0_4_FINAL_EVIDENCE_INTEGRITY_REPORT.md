# LGD 2.0 — Phase 0–4 Final Evidence Integrity Report & Cryptographic Attestation

| **Forensic Audit Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | Phase 0–4 Final Evidence Integrity & Forensic Checksum Attestation |
| **Original Evaluation Timestamp** | `2026-11-03T15:15:00+05:30` |
| **Final Revision Timestamp** | `2026-11-03T16:00:00+05:30` |
| **Final Validation Timestamp** | `2026-11-03T16:05:00+05:30` |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Classification** | OFFICIAL / GOVERNMENT APPLICATION SECURITY AUDIT |
| **Integrity Attestation** | **100% FORENSIC CONCORDANCE (57 ENTRIES = 51 PHYSICAL FILES + 6 DIRECTORIES)** |
| **Auditor Role** | Lead Independent Cryptographic Evaluator & Application Security Auditor |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Executive Summary & Forensic Audit Mandate

In accordance with Section 6, Section 10, and Section 11 of the Pre-Phase-5 Audit Closure mandate, this **Final Evidence Integrity Report** provides an exhaustive cryptographic attestation and forensic accounting of all deliverables, governance registers, threat models, automated test outputs, scanner dumps, dependency manifests, and validation scripts across Phases 0 through 4.

### Authoritative Inventory Breakdown:
- **57 total catalog entries = 51 physical files + 6 directories.**
- **51 physical files = 49 SHA-256-verified files + 2 separately workbook-verified files.**
  - **49 SHA-256-Verified Files:** Programmatically verified against exact SHA-256 digests computed directly from physical file contents on disk using Node.js `crypto.createHash('sha256')`.
  - **2 Workbook-Verified Files:** `SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx` and `DAST_Test_Case_Register.xlsx` verified via programmatic cell and row-level inspection (47 canonical operations and 153 dynamic test rows, cross-referenced with JSON dumps); these files do not use invented SHA-256 values.
- **6 Directory Entries:** 1 pre-remediation backup directory (`scratch/pre_remediation_backup/`) and 5 Maven Surefire XML test report directories (`target/surefire-reports/`), verified via physical presence, Git status comparison, and automated test execution (289/289 passed).

### 1.1 Strict Forensic Standards Applied
1. **Direct Disk Byte-Stream Calculation:** Checksums and exact byte sizes for all 49 eligible physical files were computed directly from physical disk byte streams using Node.js `crypto.createHash('sha256')`.
2. **Post-Edit Integrity:** All hashes reported in this catalog were calculated **after** all authorized documentation edits, crosswalk synchronizations, and register updates were completed and saved to disk.
3. **Zero Hash Reuse:** No hash value was copied or assumed from previous reports without programmatic re-verification.
4. **Separate Workbook Verification:** The two Excel workbooks are accounted for by programmatic cell and row inspection rather than arbitrary or synthetic hashes.
5. **Distinction Between Independent and Historical Evidence:**
   - **Independently Verified Evidence:** Facts, file byte sizes, and SHA-256 digests verified by direct file system inspection, Node.js hashing scripts, Maven Surefire XML parsing, and live local Docker inspect commands.
   - **Historical Evidence:** Pre-remediation baseline logs, past test execution summaries, and preliminary draft snapshots preserved for historical audit lineage and explicitly qualified as such.
6. **Zero Fabrication:** Missing, excluded, or unexecuted items (such as the excluded `lgd_react` frontend build marked `NOT_APPLICABLE`, host PostgreSQL engine scan, and DAA executive signatures) are explicitly recorded as excluded, pending, or out-of-scope rather than simulated.

---

## 2. Complete Physical File Evidence Manifest Table (51 Physical Files)

### 2.1 Phase 0: Baseline Discovery Deliverables
| Evidence ID | File Path | Format | Exact Byte Size | Size (KB) | Verification Status & Mechanism | Forensic Status |
|:---|:---|:---:|:---:|:---:|:---|:---:|
| **EVD-P0-01** | [`PHASE0_BASELINE_RECONCILIATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_BASELINE_RECONCILIATION_REPORT.md) | Markdown | 29,480 bytes | 28.8 KB | **SHA-256:** `a0aef0772389c832c1c80d059d80079ef668236d370a70a7dea930fa54a8ae5c` | **MATCH** |
| **EVD-P0-03** | [`API_Endpoint_Inventory.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/API_Endpoint_Inventory.md) | Markdown | 11,656 bytes | 11.4 KB | **SHA-256:** `6da2eee8c2263861d21af6de315f99b713bb270f1628647ef03bbf5c74af3232` | **MATCH** |
| **EVD-P0-04** | [`SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx) | Excel Workbook | 298,868 bytes | 291.9 KB | *[Workbook Inspected / Programmatic Row Verification]* (47 canonical operations verified vs API_Endpoint_Inventory.md) | **VERIFIED** |

---

### 2.2 Phase 1: Threat Modeling & Trust Boundary Deliverables
| Evidence ID | File Path | Format | Exact Byte Size | Size (KB) | SHA-256 Cryptographic Checksum | Forensic Status |
|:---|:---|:---:|:---:|:---:|:---|:---:|
| **EVD-P1-01** | [`PHASE1_THREAT_MODEL_VERIFICATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE1_THREAT_MODEL_VERIFICATION_REPORT.md) | Markdown | 24,360 bytes | 23.8 KB | `db8082bd141032998ee0ed87e9ee100bf5ce07eaf1c9cc4d81c42df38fff285b` | **MATCH** |
| **EVD-P1-02** | [`STRIDE_Threat_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/STRIDE_Threat_Register.md) | Markdown | 17,890 bytes | 17.5 KB | `f6b3a455a8d65e8be3bed85c28f784984369b1e3161d99217b1db190c896b042` | **MATCH** |
| **EVD-P1-03** | [`DREAD_Risk_Assessment.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DREAD_Risk_Assessment.md) | Markdown | 9,908 bytes | 9.7 KB | `204e26999ffd18b4dbd5666d7b157271d35052f183d4b72bce2ef39ca7fa9828` | **MATCH** |
| **EVD-P1-04** | [`Trust_Boundary_Analysis.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Trust_Boundary_Analysis.md) | Markdown | 18,895 bytes | 18.5 KB | `f94cbb9b60488979ab4dff5dc4ca01f27783bb1481c0c299a97b25333e0867f4` | **MATCH** |
| **EVD-P1-05** | [`Threat_Model_Report.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Threat_Model_Report.md) | Markdown | 52,713 bytes | 51.5 KB | `057d494b95733e2df60eb25a752cf01a873722ff8cad51e528d7699e301b0d89` | **MATCH** |
| **EVD-P1-06** | [`Threat_Mitigation_Roadmap.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Threat_Mitigation_Roadmap.md) | Markdown | 16,298 bytes | 15.9 KB | `00fb028605d03228508ae69d6c28ae427e0a3b4852a4f5c57daceabece760fca` | **MATCH** |
| **EVD-P1-07** | [`Attack_Tree_Diagrams.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Attack_Tree_Diagrams.md) | Markdown | 20,945 bytes | 20.5 KB | `79fc87fb82b841182af218fa8d3e8162a46d89e81a2502f2a3e9ea7448fc7784` | **MATCH** |
| **EVD-P1-08** | [`Attack_Surface_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Attack_Surface_Register.md) | Markdown | 15,588 bytes | 15.2 KB | `d66992761a27a4c753f480d2d324104a6108d660048db944471c5d770bbeee03` | **MATCH** |

---

### 2.3 Phase 2: Static Code Analysis (SAST) Deliverables
| Evidence ID | File Path | Format | Exact Byte Size | Size (KB) | SHA-256 Cryptographic Checksum | Forensic Status |
|:---|:---|:---:|:---:|:---:|:---|:---:|
| **EVD-P2-01** | [`PHASE2_SAST_INDEPENDENT_VERIFICATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE2_SAST_INDEPENDENT_VERIFICATION_REPORT.md) | Markdown | 15,599 bytes | 15.2 KB | `b11c628a87f6fbb168501375f7fea46c512a97752c097b48c9773d5dc92eb626` | **MATCH** |
| **EVD-P2-02** | [`SAST_Findings_Log.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SAST_Findings_Log.md) | Markdown | 72,079 bytes | 70.4 KB | `0cb3579df8cbf4bd835e56043fcada0d8afdfb93ed0508e15cabebc60eebe875` | **MATCH** |

---

### 2.4 Phase 3: Dynamic Application Security Testing (DAST) Deliverables
| Evidence ID | File Path | Format | Exact Byte Size | Size (KB) | Verification Status & Mechanism | Forensic Status |
|:---|:---|:---:|:---:|:---:|:---|:---:|
| **EVD-P3-01** | [`DAST_Penetration_Test_Report.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Penetration_Test_Report.md) | Markdown | 19,909 bytes | 19.4 KB | **SHA-256:** `568da926a62b956620096d2e73e48f952f9c67a6eb2b9db38b688bbe9f7bfdd3` | **MATCH** |
| **EVD-P3-02** | [`API_Vulnerability_Exploitation_Log.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/API_Vulnerability_Exploitation_Log.md) | Markdown | 39,987 bytes | 39.0 KB | **SHA-256:** `e1546eeaadd6fafbdbbd95686fb4612a5dafa25c4108ded52c3930204b8f3469` | **MATCH** |
| **EVD-P3-03** | [`DAST_Evidence_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Evidence_Register.md) | Markdown | 34,467 bytes | 33.7 KB | **SHA-256:** `45f51c898f9d3e4ef04eb3f8bf1851d97b727f7ddc911a9274afb2aa5d9090f8` | **MATCH** |
| **EVD-P3-04** | [`PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md) | Markdown | 25,557 bytes | 25.0 KB | **SHA-256:** `3c1e71bcbfaa7d1d844f295cc2464be783c3e01159d7130a7c93d9aec349a605` | **MATCH** |
| **EVD-P3-05** | [`scratch/live_dast_evidence_records.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/live_dast_evidence_records.json) | JSON | 19,168 bytes | 18.7 KB | **SHA-256:** `4a758d906d222e798d4f6a77421a9417eed28fd7f9960e70fc491840de98fd17` | **MATCH** |
| **EVD-P3-06** | [`DAST_Test_Case_Register.xlsx`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/DAST_Test_Case_Register.xlsx) | Excel Workbook | 164,713 bytes | 160.9 KB | *[Workbook Inspected / Programmatic Row Verification]* (153 test rows verified vs scratch/all_153_tests.json) | **VERIFIED** |
| **EVD-P3-07** | [`scratch/all_153_tests.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/all_153_tests.json) | JSON | 120,586 bytes | 117.8 KB | **SHA-256:** `51d9fb7e68ea160e798f4a459e74510fcac4a2a71e94356f7f07c7ead3c4195f` | **MATCH** |

---

### 2.5 Phase 4: Software Composition Analysis (SCA) Deliverables
| Evidence ID | File Path | Format | Exact Byte Size | Size (KB) | SHA-256 Cryptographic Checksum | Forensic Status |
|:---|:---|:---:|:---:|:---:|:---|:---:|
| **EVD-P4-01** | [`PHASE4_SCA_INDEPENDENT_VERIFICATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE4_SCA_INDEPENDENT_VERIFICATION_REPORT.md) | Markdown | 12,268 bytes | 12.0 KB | `470a08ab5316fb61bf2281e287ad3f0c92ef6b7954f35a6b95c2f4edb4d4ea0b` | **MATCH** |
| **EVD-P4-02** | [`SOFTWARE_BILL_OF_MATERIALS.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SOFTWARE_BILL_OF_MATERIALS.json) | JSON | 1,805,646 bytes | 1763.3 KB | `99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b` | **MATCH** |
| **EVD-P4-03** | [`scratch/validate_sbom_schema.js`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/validate_sbom_schema.js) | JavaScript | 11,144 bytes | 10.9 KB | `e4dc00045fc1d265c0c21495a396b928e5d98042361ab3bd497ae2dd4b7f4439` | **MATCH** |
| **EVD-P4-04** | [`scratch/sbom_validation_output.txt`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/sbom_validation_output.txt) | Plain Text | 2,561 bytes | 2.5 KB | `679dffbc077e8c39df7e4c0da04512a601870a4c7ad104327ac7d4a61126345a` | **MATCH** |
| **EVD-P4-05** | [`scratch/sbom_graph_validation_report.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/sbom_graph_validation_report.json) | JSON | 3,415 bytes | 3.3 KB | `3b2ef3ca3fecb2e2037b3a69ee78f785992f42b7df2ef478492320252a076848` | **MATCH** |
| **EVD-P4-06** | [`scratch/package_license_compliance_report.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/package_license_compliance_report.json) | JSON | 29,426 bytes | 28.7 KB | `c8749d4688bc88d5a08195b15be593bc174863f9c2fd65cac30e3b7b4a2156e2` | **MATCH** |
| **EVD-P4-07** | [`scratch/trivy_results/container_scan_summary.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/container_scan_summary.json) | JSON | 7,695 bytes | 7.5 KB | `d15a8da4e23a58199bc9e798ff64b0cff91186edfdcc4afeb439c5be351cf934` | **MATCH** |
| **EVD-P4-08** | [`scratch/trivy_results/postgresql_host_native_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/postgresql_host_native_trivy.json) | JSON | 657,196 bytes | 641.8 KB | `17e7e900b42a6dab877ee41c86c2c4e2fb7bddaad6d1f320c242473151e169b5` | **MATCH** |
| **EVD-P4-09** | [`SCA_LICENSE_COMPLIANCE_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SCA_LICENSE_COMPLIANCE_REPORT.md) | Markdown | 27,857 bytes | 27.2 KB | `21369f2ba5b16e415ed9a7bef7780057debce9fe36c9e49d1dde23210efe1f0d` | **MATCH** |
| **EVD-P4-10** | [`SECURITY_RESIDUAL_RISK_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_RESIDUAL_RISK_REGISTER.md) | Markdown | 25,278 bytes | 24.7 KB | `3d735362f3e05f206bb991bb9d38443fa5a73b130f657b74f0ca2234d562a5a9` | **MATCH** |
| **EVD-P4-11** | [`scratch/trivy_results/api-gateway_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/api-gateway_trivy.json) | JSON | 1,399,196 bytes | 1366.4 KB | `fd392d2b5654128f623afdf1a4ee56dab50140723bf85a961326048acdaaab6e` | **MATCH** |
| **EVD-P4-12** | [`scratch/trivy_results/auth-service_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/auth-service_trivy.json) | JSON | 1,513,607 bytes | 1478.1 KB | `36edda0b36fda474e8a69cb81ef53f02d403cf84a7b955df85af5d83b43443e5` | **MATCH** |
| **EVD-P4-13** | [`scratch/trivy_results/revenue_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/revenue_trivy.json) | JSON | 1,518,989 bytes | 1483.4 KB | `65ac9a3d455eb0d92f56d6b4cb664ccae60c3c7882a639dff22f0fcd2e8e6770` | **MATCH** |
| **EVD-P4-14** | [`scratch/trivy_results/service-discovery_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/service-discovery_trivy.json) | JSON | 689,601 bytes | 673.4 KB | `d7f30c5b839f647141d280cce7d5ba24e790a610c04dca3b8ec2038c54ec31cf` | **MATCH** |
| **EVD-P4-15** | [`scratch/trivy_results/user-management_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/user-management_trivy.json) | JSON | 1,485,869 bytes | 1451.0 KB | `f4df4f3a763f13c13dce72247416d2a57720a599b19bacfd44c1bd12f8d37c83` | **MATCH** |
| **EVD-P4-16** | [`scratch/trivy_results/redis-alpine_trivy.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/trivy_results/redis-alpine_trivy.json) | JSON | 66,853 bytes | 65.3 KB | `dcf7242ba29acd6baed115cd7fe1b39107047085aa9f28589f3d23a1ca4357dc` | **MATCH** |
| **EVD-P4-17** | [`revenue/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/pom.xml) | XML | 7,000 bytes | 6.8 KB | `e3640600b4ae77c072968598943b1ca35905f1201bf3a90d9f2141dcfafec529` | **MATCH** |
| **EVD-P4-18** | [`auth-service/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/pom.xml) | XML | 8,040 bytes | 7.9 KB | `4512dea000242203eb1dabc4c903959ab0fe4a51ce4a3c645c2e380d76db903e` | **MATCH** |
| **EVD-P4-19** | [`user-management/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/pom.xml) | XML | 15,248 bytes | 14.9 KB | `8a8fd43306e6fb24b0014e0d3989de276391e20ff1e455d5308bd165bd95a0b6` | **MATCH** |
| **EVD-P4-20** | [`api-gateway/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/pom.xml) | XML | 8,767 bytes | 8.6 KB | `e234446917535a82c5b6d00181aed9cd9f79523f8e277312de77a2f3d6983276` | **MATCH** |
| **EVD-P4-21** | [`discovery/pom.xml`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/discovery/pom.xml) | XML | 2,192 bytes | 2.1 KB | `4ce17b93d6862cec92a90b9bc1f9ef8fd7a5855964685b097d39d326daecc466` | **MATCH** |

---

### 2.6 Master Governance, Reconciliation & Attestation Deliverables
| Evidence ID | File Path | Format | Exact Byte Size | Size (KB) | SHA-256 Cryptographic Checksum | Forensic Status |
|:---|:---|:---:|:---:|:---:|:---|:---:|
| **EVD-GOV-01** | [`PHASE0_4_MASTER_TRACEABILITY_AND_DOCUMENT_RECONCILIATION_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_MASTER_TRACEABILITY_AND_DOCUMENT_RECONCILIATION_REPORT.md) | Markdown | 26,407 bytes | 25.8 KB | `58483f1da21660113ffe84977315098eeec6ba7cbc881b15ffca4aec509ceff9` | **MATCH** |
| **EVD-GOV-02** | [`Master_Finding_Traceability_Register.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Master_Finding_Traceability_Register.md) | Markdown | 49,553 bytes | 48.4 KB | `5901167dc40bd1f43e98f7f0cdbf44b19a830575fbe5dc2db46fb6d9c2069b85` | **MATCH** |
| **EVD-GOV-03** | [`SECURITY_PHASE_TRACKER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_PHASE_TRACKER.md) | Markdown | 24,668 bytes | 24.1 KB | `a98ccc320883ca6f3078f46c8998409a685def7222fc6f7fc463c8ef486bff6a` | **MATCH** |
| **EVD-GOV-04** | [`SECURITY_MASTER_FINDING_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_MASTER_FINDING_REGISTER.md) | Markdown | 21,784 bytes | 21.3 KB | `cf165ab86913ea48b32e39d09176b895c5ecea46467b18c9c6500da936f89e9b` | **MATCH** |
| **EVD-GOV-05** | [`Consolidated_Remediation_Report.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/Consolidated_Remediation_Report.md) | Markdown | 32,849 bytes | 32.1 KB | `cbaed78a5f20c06876e9c869f5c44f2dc97548f2e0127648ca5dc876bf9bd52c` | **MATCH** |
| **EVD-GOV-06** | [`PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md) | Markdown | 47,958 bytes | 46.8 KB | `eca3f4c2d77a4634a89d22e182685aa08c216e2307c23bc718ed8363b88a9bea` | **MATCH** |
| **EVD-GOV-07** | [`PHASE_4_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_4_EVIDENCE_REGISTER.md) | Markdown | 16,704 bytes | 16.3 KB | `035df45d23b7f7f32c32d22beb3f089b4eeccba5fb7137d2b0625659d0fd6039` | **MATCH** |
| **EVD-GOV-08** | [`PHASE0_4_FINAL_REGRESSION_AND_BUILD_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_FINAL_REGRESSION_AND_BUILD_REPORT.md) | Markdown | 13,335 bytes | 13.0 KB | `1db7615ba5bd28d98dd38cdddf25a04105ec9fe8b2ab3efaffd7c962882cc585` | **MATCH** |
| **EVD-GOV-09** | [`scratch/surefire_regression_execution_summary.json`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/surefire_regression_execution_summary.json) | JSON | 11,005 bytes | 10.7 KB | `dd39976504f778e451ec8a713e9618b3d87485428e179569341b5bf5d8df1cf5` | **MATCH** |
| **EVD-GOV-10** | [`PHASE0_4_REMEDIATION_EXECUTION_LOG.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_REMEDIATION_EXECUTION_LOG.md) | Markdown | 13,625 bytes | 13.3 KB | `4fca2b62e3180ea9e37340cb7e4c4af2996be77d509aa401b293e706525ccedc` | **MATCH** |

---

### 2.7 Cataloged Directory Entries (6 Directories)
| Evidence ID | Directory Path | Directory Type | Description / Test Scope | Verification Mechanism | Status |
|:---|:---|:---:|:---|:---|:---:|
| **EVD-P0-02** | `scratch/pre_remediation_backup/` | Pre-Remediation Backup | Snapshot of pre-audit Git status, commit HEAD, and document hashes. | Git commit hash comparison (`root_status.txt`, `root_head.txt`) | **VERIFIED** |
| **EVD-P2-03** | `api-gateway/target/surefire-reports/` | Test Reports (14 tests) | Surefire XML/TXT reports for Gateway security filters and RouteValidator. | Maven test execution (14/14 PASS, 0 failures, 0 errors) | **VERIFIED** |
| **EVD-P2-04** | `discovery/target/surefire-reports/` | Test Reports (2 tests) | Surefire reports validating Eureka HTTP Basic authentication. | Maven test execution (2/2 PASS, 0 failures, 0 errors) | **VERIFIED** |
| **EVD-P2-05** | `auth-service/target/surefire-reports/` | Test Reports (40 tests) | Surefire reports for JWT hardening, entropy, and BCrypt verification. | Maven test execution (40/40 PASS, 0 failures, 0 errors) | **VERIFIED** |
| **EVD-P2-06** | `revenue/target/surefire-reports/` | Test Reports (22 tests) | Surefire reports for BOLA draft checks, XMLDSig, and upload guards. | Maven test execution (22/22 PASS, 0 failures, 0 errors) | **VERIFIED** |
| **EVD-P2-07** | `user-management/target/surefire-reports/`| Test Reports (211 tests) | Surefire reports for method security and mass assignment guards. | Maven test execution (211/211 PASS, 0 failures, 0 errors) | **VERIFIED** |

---

## 3. Cryptographic Audit Reconciliation Summary

```
========================================================================================
LGD 2.0 FORENSIC EVIDENCE CHECKSUM ATTRIBUTES & CONCORDANCE SUMMARY
========================================================================================
Total Catalog Entries in Evidence Index:       57
  - Total Physical Files:                      51
    * Files with SHA-256 Cryptographic Digest: 49 (100.0% match)
    * Workbooks with Cell/Row Verification:     2 (100.0% verified)
  - Total Cataloged Directories:                6 (1 backup + 5 Surefire reports)
Total Physical Files Located on Disk:          51 / 51 (100.0%)
Total Directories Located and Inspected:        6 / 6 (100.0%)
Total Cryptographic Hash Matches:              49 / 49 (100.0%)
Total Cryptographic Hash Mismatches:            0 (0.0%)
Total Workbook Inspection Matches:              2 / 2 (100.0%)
Total Missing Files or Directories:             0 (0.0%)
----------------------------------------------------------------------------------------
FINAL FORENSIC & CRYPTOGRAPHIC VERDICT:        100% RECONCILED & SEALED
========================================================================================
```

---

## 4. Forensic Working-Tree Attribution & Path-by-Path Reconciliation

### 4.1 Resolution of Prior Discrepancy (Untracked Deliverables vs. Working-Tree Modifications)
In previous draft evaluations, four deliverables (`PHASE0_4_EVIDENCE_INDEX.md`, `PHASE0_4_FINAL_SHA256_RECONCILIATION.md`, `scratch/phase0_4_authoritative_sha256_manifest.json`, and `scratch/phase0_4_authoritative_sha256_manifest.md`) were listed under the `CURRENT_CYCLE_CHANGE` category with an indicated count of 2.

A forensic inspection of the actual Git working tree via `git status --porcelain` reveals that:
1. All four of these deliverables are **untracked files (`??`)**, not tracked modified paths (`M` or `m`).
2. None of these four paths is included in the 52 modified paths reported by `git status --short`.
3. These final governance deliverables are segregated from the working-tree inventory and are independently attested under the detached manifest [`PHASE0_4_FINAL_DELIVERABLE_SHA256_MANIFEST.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_FINAL_DELIVERABLE_SHA256_MANIFEST.md).

### 4.2 Forensic Working-Tree Classification Summary (52 Modified Paths)
Every one of the 52 modified paths reported by `git status --short` is classified into exactly one of four objective forensic categories:

| Classification | Path Count | Category Definition & Forensic Scope | Forensic Evidence Base |
|:---|:---:|:---|:---|
| **`PRE_EXISTING`** | **12** | Artifacts generated in preliminary SCA cycles prior to the current audit session | Documented in pre-audit baseline snapshot [`scratch/pre_remediation_backup/root_status.txt`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/scratch/pre_remediation_backup/root_status.txt) and Git commit `e2df50f`. |
| **`AUTHORIZED_PREVIOUS_REMEDIATION`** | **36** | Governance registers, threat models, submodules, and auxiliary scan logs modified under Phase 1–4 remediation instructions | Authorized commits across submodules (`api-gateway`, `auth-service`, `discovery`, `lgd-um`, `revenue`, `user-management`), commit `57f7f40`, and approved documentary remediation charters. |
| **`CURRENT_CYCLE_CHANGE`** | **2** | Tracked repository files modified during the current audit cycle to reconcile blockers and gate statuses | Direct modifications to [`SECURITY_PHASE_TRACKER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/SECURITY_PHASE_TRACKER.md) and [`PHASE_4_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_4_EVIDENCE_REGISTER.md) for 4-blocker accounting and Gate A/B/C synchronization. |
| **`UNDETERMINED`** | **2** | Valid security configurations lacking an initial baseline snapshot | Modified in prior remediation sessions but omitted from `root_status.txt`; preserved as `UNDETERMINED` pursuant to non-fabrication standards. |
| **TOTAL** | **52** | **Complete reconciliation of all modified working-tree paths** | **100% Concordance with `git status --short`** |

---

### 4.3 Complete Path-by-Path Attribution Table (52 Modified Paths)

| # | Modified File Path | Git Status | Forensic Classification | Forensic Evidence Base & Attribution Rationale |
|:---:|:---|:---:|:---|:---|
| 1 | `.gitignore` | ` M` | `UNDETERMINED` | Modified in prior sessions to ignore local artifacts; lacks pre-audit snapshot in `root_status.txt`. Preserved as `UNDETERMINED`. |
| 2 | `API_Vulnerability_Exploitation_Log.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 3 DAST exploitation log; recorded in `root_status.txt` and updated pursuant to authorized Phase 3 remediation charter. |
| 3 | `Attack_Surface_Register.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 1 Attack Surface inventory (13 attack surfaces); updated under approved Phase 1 remediation instructions. |
| 4 | `Attack_Tree_Diagrams.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 1 visual attack trees; updated under approved Phase 1 threat remediation instructions. |
| 5 | `Consolidated_Remediation_Report.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Master Phase 1–3 remediation report (19 verified fixed, 2 partial); updated under authorized remediation charter. |
| 6 | `DAST_Evidence_Register.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 3 DAST dynamic evidence register; recorded in `root_status.txt` and updated under authorized Phase 3 remediation. |
| 7 | `DAST_Penetration_Test_Report.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 3 DAST test report; recorded in `root_status.txt` and updated under authorized remediation instructions. |
| 8 | `Master_Finding_Traceability_Register.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Canonical traceability register; recorded in `root_status.txt` and updated under authorized remediation instructions. |
| 9 | `PHASE1_PHASE2_PHASE3_SIGNOFF_REPORT.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Executive technical signoff report; updated under authorized Phase 1–3 remediation charter. |
| 10 | `PHASE1_THREAT_MODEL_REMEDIATION_REPORT.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 1 threat model remediation report; updated under authorized Phase 1 remediation charter. |
| 11 | `PHASE3_DAST_REMEDIATION_REPORT.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 3 DAST remediation report; recorded in `root_status.txt` and updated under authorized Phase 3 remediation charter. |
| 12 | `PHASE_4_EVIDENCE_REGISTER.md` | ` M` | `CURRENT_CYCLE_CHANGE` | Updated during current audit cycle to integrate 4-blocker accounting (`BLK-01` to `BLK-04`), PostgreSQL 14 engine distinction, and live container digests. |
| 13 | `PHASE_4_SCA_ASSESSMENT_REPORT.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 4 SCA assessment report; recorded in `root_status.txt` and updated under authorized Phase 4 remediation charter. |
| 14 | `Residual_Risk_Register.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Historical Phase 1–3 residual risk register; recorded in `root_status.txt` and updated under authorized remediation charter. |
| 15 | `SAST_Findings_Log.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 2 SAST findings technical log (21 SAST findings); updated under authorized Phase 2 remediation charter. |
| 16 | `SCA_FINDINGS_REGISTER.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 4 SCA findings register; recorded in `root_status.txt` and updated under authorized Phase 4 remediation charter. |
| 17 | `SCA_LICENSE_COMPLIANCE_REPORT.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 4 OSS license compliance report; recorded in `root_status.txt` and updated under authorized Phase 4 remediation charter. |
| 18 | `SCA_REMEDIATION_PLAN.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 4 SCA remediation plan; recorded in `root_status.txt` and updated under authorized Phase 4 remediation charter. |
| 19 | `SECURITY_MASTER_FINDING_REGISTER.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Master finding register (23 baseline findings); recorded in `root_status.txt` and updated under authorized remediation charter. |
| 20 | `SECURITY_PHASE_TRACKER.md` | ` M` | `CURRENT_CYCLE_CHANGE` | Updated during current audit cycle to record Gate A/B/C dispositions, 4-blocker inventory, and mandatory stopping statement. |
| 21 | `SECURITY_RESIDUAL_RISK_REGISTER.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Master residual risk register (RR-01 to RR-11); recorded in `root_status.txt` and updated under authorized remediation charter. |
| 22 | `SOFTWARE_BILL_OF_MATERIALS.json` | ` M` | `PRE_EXISTING` | CycloneDX 1.5 JSON SBOM generated in Phase 4 baseline; recorded in `root_status.txt` and `sbom_sha256.csv`. |
| 23 | `STRIDE_Threat_Register.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Authoritative STRIDE register (20 discrete threats); updated under authorized Phase 1 remediation charter. |
| 24 | `Security_Architecture_Inventory.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Security architecture inventory; updated under authorized remediation charter. |
| 25 | `Security_Phase_Execution_Plan.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 0 execution plan; recorded in `root_status.txt` and updated under authorized remediation charter. |
| 26 | `Threat_Mitigation_Roadmap.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Phase 1 threat mitigation roadmap; updated under authorized Phase 1 remediation charter. |
| 27 | `Threat_Model_Report.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Comprehensive threat model report; updated under authorized Phase 1 remediation charter. |
| 28 | `Trust_Boundary_Analysis.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Trust boundary analysis (TB-01 to TB-08); updated under authorized Phase 1 remediation charter. |
| 29 | `Vulnerability_Master_Register.md` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Baseline vulnerability register; updated under authorized remediation charter. |
| 30 | `api-gateway` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Submodule pointer; authorized security commits (`RouteValidator`, `SecurityHeadersFilter`, `AuthenticationFilter`). |
| 31 | `auth-service` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Submodule pointer; authorized security commits (JWT entropy, BCrypt, `AuthSecondaryController` `@Valid`). |
| 32 | `discovery` | ` m` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Submodule pointer; authorized security commits (Eureka HTTP Basic authentication). |
| 33 | `docker-compose.yml` | ` M` | `UNDETERMINED` | Host port unmapping and loopback-restricted Redis mapping; modified in prior remediation but lacks pre-audit snapshot in `root_status.txt`. Preserved as `UNDETERMINED`. |
| 34 | `lgd-um` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Submodule pointer; active React frontend client application under authorized engineering commits. |
| 35 | `revenue` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Submodule pointer; authorized security commits (XMLDSig, BOLA checks, `TestController` `@Profile`). |
| 36 | `scratch/license_analysis_data.json` | ` M` | `PRE_EXISTING` | Package license compliance dataset; recorded in pre-audit baseline snapshot `root_status.txt`. |
| 37 | `scratch/reconcile_cyclonedx_sbom.js` | ` M` | `PRE_EXISTING` | CycloneDX SBOM reconciliation utility; recorded in pre-audit baseline snapshot `root_status.txt`. |
| 38 | `scratch/trivy_results/api-gateway_trivy.json` | ` M` | `PRE_EXISTING` | Aqua Security Trivy container scan output (JSON); committed in baseline `e2df50f`. |
| 39 | `scratch/trivy_results/api-gateway_trivy.txt` | ` M` | `PRE_EXISTING` | Aqua Security Trivy container scan plain text log; committed in baseline `e2df50f`. |
| 40 | `scratch/trivy_results/auth-service_trivy.json` | ` M` | `PRE_EXISTING` | Aqua Security Trivy container scan output (JSON); committed in baseline `e2df50f`. |
| 41 | `scratch/trivy_results/auth-service_trivy.txt` | ` M` | `PRE_EXISTING` | Aqua Security Trivy container scan plain text log; committed in baseline `e2df50f`. |
| 42 | `scratch/trivy_results/container_scan_summary.json` | ` M` | `PRE_EXISTING` | Aqua Security Trivy consolidated container scan metrics; committed in baseline `e2df50f`. |
| 43 | `scratch/trivy_results/redis-alpine_trivy.json` | ` M` | `PRE_EXISTING` | Aqua Security Trivy container scan output (JSON); committed in baseline `e2df50f`. |
| 44 | `scratch/trivy_results/redis-alpine_trivy.txt` | ` M` | `PRE_EXISTING` | Aqua Security Trivy container scan plain text log; committed in baseline `e2df50f`. |
| 45 | `scratch/trivy_results/revenue_trivy.json` | ` M` | `PRE_EXISTING` | Aqua Security Trivy container scan output (JSON); committed in baseline `e2df50f`. |
| 46 | `scratch/trivy_results/revenue_trivy.txt` | ` M` | `PRE_EXISTING` | Aqua Security Trivy container scan plain text log; committed in baseline `e2df50f`. |
| 47 | `scratch/trivy_results/service-discovery_trivy.json` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Aqua Security Trivy container scan (JSON); re-scanned post-Eureka auth remediation. |
| 48 | `scratch/trivy_results/service-discovery_trivy.txt` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Aqua Security Trivy container scan (TXT); re-scanned post-Eureka auth remediation. |
| 49 | `scratch/trivy_results/user-management_trivy.json` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Aqua Security Trivy container scan (JSON); re-scanned post-UserMapper DTO remediation. |
| 50 | `scratch/trivy_results/user-management_trivy.txt` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Aqua Security Trivy container scan (TXT); re-scanned post-UserMapper DTO remediation. |
| 51 | `scratch/update_excel_registers.js` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Register synchronization utility committed in `57f7f40`; updated under authorized remediation to redact exposed secrets. |
| 52 | `user-management` | ` M` | `AUTHORIZED_PREVIOUS_REMEDIATION` | Submodule pointer; authorized security commits (`UserMapper` DTO mass assignment hardening). |

---

### 4.4 Inventory Separation: Evidence Catalog vs. Detached Governance Manifest
To maintain absolute forensic clarity, two distinct inventories are formally established:
1. **Primary Evidence Inventory (57 Catalog Entries):**
   - **51 Physical Files:** 49 SHA-256-verified files + 2 separately workbook-verified files (`SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx` and `DAST_Test_Case_Register.xlsx`).
   - **6 Directory Entries:** 1 pre-remediation backup directory + 5 Maven Surefire test report directories.
   - Cataloged in [`PHASE0_4_EVIDENCE_INDEX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_EVIDENCE_INDEX.md).
2. **Revised Governance Deliverables (8 Deliverables):**
   - 8 revised governance reports and determinations (`PHASE0_4_EVIDENCE_INDEX.md`, `PHASE0_4_FINAL_EVIDENCE_INTEGRITY_REPORT.md`, `PHASE0_4_FINAL_SHA256_RECONCILIATION.md`, `PHASE0_4_FINAL_GATE_A_ASSESSMENT.md`, `PHASE0_4_FINAL_INDEPENDENT_REVIEW_REPORT.md`, `PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md`, `PHASE0_4_FINAL_REGRESSION_AND_BUILD_REPORT.md`, `PHASE5_ENTRY_READINESS_DECISION.md`).
   - Separately recorded with exact byte sizes and SHA-256 digests in the detached manifest [`PHASE0_4_FINAL_DELIVERABLE_SHA256_MANIFEST.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE0_4_FINAL_DELIVERABLE_SHA256_MANIFEST.md).


## 5. Attestation Outcome & Mandatory Stopping Statement

$$\mathbf{EVIDENCE\ INTEGRITY\ ATTESTATION:\ 100\%\ VERIFIED\ \&\ SEALED}$$

### Mandatory Governance Statement:
$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$

---
*Evidence Integrity Report independently compiled, hashed, and attested by the Lead Cryptographic Evaluator.*

