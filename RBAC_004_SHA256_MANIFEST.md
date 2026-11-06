# LGD 2.0 — RBAC-004 SHA-256 INTEGRITY MANIFEST
## Cryptographic Hash Census for Phase 6 RBAC-004 Remediation & Retest Deliverables

| Manifest Metadata | Authoritative Value |
| :--- | :--- |
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Milestone** | **Phase 6: Authorization, RBAC & Multi-Tenancy Boundary Audit** |
| **Scope** | **RBAC-004 Remediation, Tests, Surefire Reports & Governance Deliverables** |
| **Evaluation Date** | November 5, 2026 |
| **Lead Auditor** | Principal Spring Security Engineer & Independent Application Security Auditor |
| **Algorithm** | SHA-256 (NIST FIPS 180-4) |
| **Platform Root** | `master` @ `e2df50f8c30197144377a2f931a4b3fbf03aeb1c` |
| **Target Sub-Repository** | `user-management` (`dev` @ `a0017c536eee7cefa57845c30fa4d5210a4af9ce`) |

---

## 1. Phase 6 RBAC-004 Deliverable Documents Manifest

The table below catalogs the authoritative SHA-256 cryptographic checksums for the seven deliverable documents produced for Phase 6 RBAC-004 residual authorization remediation and verification:

| # | Deliverable File Name | Relative Workspace Path | SHA-256 Cryptographic Checksum |
| :-: | :--- | :--- | :--- |
| 1 | `RBAC_004_REMEDIATION_AND_RETEST.md` | [`RBAC_004_REMEDIATION_AND_RETEST.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/RBAC_004_REMEDIATION_AND_RETEST.md) | `4fcdcee70db6fce2e210176ea1bab54deaf130f5cfd6327b68b684bafaa68a09` |
| 2 | `RBAC_004_FINAL_CONTROLLER_AUTHORITY_MATRIX.md` | [`RBAC_004_FINAL_CONTROLLER_AUTHORITY_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/RBAC_004_FINAL_CONTROLLER_AUTHORITY_MATRIX.md) | `7c6816280cefe04c32419ed83729d2b9cc945d3e8d19b9e1c02797caafde22a1` |
| 3 | `RBAC_004_NEGATIVE_POSITIVE_TEST_EVIDENCE.md` | [`RBAC_004_NEGATIVE_POSITIVE_TEST_EVIDENCE.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/RBAC_004_NEGATIVE_POSITIVE_TEST_EVIDENCE.md) | `5c089b5f5eda9e1095a49ea8c81bf54f2a27b4e698987361cfd8f4ed4e0f9b43` |
| 4 | `RBAC_004_SUREFIRE_RECONCILIATION.md` | [`RBAC_004_SUREFIRE_RECONCILIATION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/RBAC_004_SUREFIRE_RECONCILIATION.md) | `6cd66b7266db7f7d7777e43b566a4e942c4ef6a0a8091f5f66aa019e137a3b4b` |
| 5 | `RBAC_004_FINAL_EVIDENCE_REGISTER.md` | [`RBAC_004_FINAL_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/RBAC_004_FINAL_EVIDENCE_REGISTER.md) | `ded75ddacb4826dfda2e4accead03398d82fc5168a527ffbead88b64c57d7c95` |
| 6 | `RBAC_004_GOVERNANCE_DISPOSITION.md` | [`RBAC_004_GOVERNANCE_DISPOSITION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/RBAC_004_GOVERNANCE_DISPOSITION.md) | `e0f0ebbe6c38ea9b29e9b4bd448ea2a149a275211afe9a7c39032a9c98631678` |
| 7 | `RBAC_004_SHA256_MANIFEST.md` | [`RBAC_004_SHA256_MANIFEST.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/RBAC_004_SHA256_MANIFEST.md) | *This Document (Self-Cataloged)* |

---

## 2. Hardened Controller Source Files Manifest

| # | Controller Source File | Relative Path in `user-management` | SHA-256 Cryptographic Checksum |
| :-: | :--- | :--- | :--- |
| 1 | [`RoleLevelMasterController.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java) | `src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java` | `0b6a5ca1ea4da4b9a215699be24d81aca18867855f0bb0aaafb7f66f5cea128b` |
| 2 | [`RoleTypeMasterController.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java) | `src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java` | `b578439e77b2a9148d1e589155baf4c504749b64c0f7796851fdc34e63640278` |
| 3 | [`PrivilegeController.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java) | `src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java` | `3f31b01612b74cca99a7aca65c79c1ac95254eb671afc4a469032b7a5ddb1c34` |
| 4 | [`ResourceController.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java) | `src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java` | `3224f824011b44c76d64ef64725b70c45c927910d83bbee2a520fc080fb4d06e` |

---

## 3. Automated Test Suites & Security Configuration Manifest

| # | Component / Class | Relative Path in `user-management` | SHA-256 Cryptographic Checksum |
| :-: | :--- | :--- | :--- |
| 1 | [`Rbac004EndpointSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac004EndpointSecurityIntegrationTest.java) | `src/test/java/in/nic/lgd/usermanagement/integration/Rbac004EndpointSecurityIntegrationTest.java` | `ab98857b1d6052c35703c8fc3d4e8ea4fe68603708b505c839f5dae056f6d895` |
| 2 | [`RbacSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/RbacSecurityIntegrationTest.java) | `src/test/java/in/nic/lgd/usermanagement/integration/RbacSecurityIntegrationTest.java` | `480fbdcf1ce153140f8289a31506b64a536b783ef6eb3cc2d6b8db8109bb4a0b` |
| 3 | [`Rbac001SecurityNegativeTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java) | `src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java` | `b62189368a77b05aaa7c78e20fad19ee07c200b7716a9e349624e8e62afce1b3` |
| 4 | [`LiveHttpSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/LiveHttpSecurityIntegrationTest.java) | `src/test/java/in/nic/lgd/usermanagement/integration/LiveHttpSecurityIntegrationTest.java` | `32ed231043aa66b97e0b6ef8a6fe173189b837ada5637edb3ef4aac6660fdebb` |
| 5 | [`SecurityConfig.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java) | `src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java` | `5136f51d06afde8a04ef20a0ea9e1a4c4f06532f1ea04619553aca39116cbe21` |
| 6 | [`JwtAuthenticationFilter.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java) | `src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java` | `13dc804282b3be60918fd7c365b8220b6820fc29a8f5034849b2b6c2a9394834` |

---

## 4. Test Execution Surefire XML Reports Manifest

| # | Surefire XML Report File | Relative Path in `user-management` | SHA-256 Cryptographic Checksum |
| :-: | :--- | :--- | :--- |
| 1 | `TEST-in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest.xml` | `target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.Rbac004EndpointSecurityIntegrationTest.xml` | `3cc0d5b11113191f277a5ddfd89a4ba958a85910ab7ec77133b027e985e02e9b` |
| 2 | `TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml` | `target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml` | `fd989ad376b637ddc8d62b3758581ade6cbad371c0bce8ae57441b989fd76aa8` |

---

## 5. Verification Command Reference

To independently verify all checksums in PowerShell:
```powershell
Get-FileHash -Algorithm SHA256 <filePath>
```
To verify on Linux / WSL:
```bash
sha256sum <filePath>
```

All hashes recorded above match the byte-exact state of the workspace files on November 5, 2026.
