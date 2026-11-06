# LGD 2.0 — CRITICAL FINDINGS FINAL SHA-256 MANIFEST
# Cryptographic Checksum Inventory of Evidence, Code, and Deliverables

| Metadata Field | Value |
| :--- | :--- |
| **Document ID** | LGD2-P6-CRIT-SHA256-MANIFEST |
| **Milestone** | Phase 6 Critical Vulnerability Remediation Evidence Reconciliation |
| **Auditor** | Independent Principal Application Security Auditor |
| **Calculation Timestamp** | November 4, 2026 |
| **Hash Algorithm** | SHA-256 (FIPS PUB 180-4) |
| **Verification Tool** | Node.js `crypto.createHash('sha256')` |

---

## 1. Phase 6 Critical Findings Deliverables Manifest

The table below lists the authoritative SHA-256 cryptographic hashes for the audit deliverables generated under `security-audit/phase-6-remediation/critical-findings/`:

| Deliverable File Name | File Size (Bytes) | Cryptographic SHA-256 Checksum |
| :--- | :---: | :--- |
| [`RBAC_001_FINAL_INDEPENDENT_VERIFICATION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/critical-findings/RBAC_001_FINAL_INDEPENDENT_VERIFICATION.md) | 23,340 | `14db7ed0e9a765352252db6dcd609bfd169f23674cf34f0c4470018221a29eda` |
| [`RBAC_004_FINAL_INDEPENDENT_VERIFICATION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/critical-findings/RBAC_004_FINAL_INDEPENDENT_VERIFICATION.md) | 16,817 | `d82034478f5af171625f1cfefc6d8b4c452195b719148c7045814c9e96bb75fc` |
| [`CRITICAL_FINDINGS_TEST_COUNT_RECONCILIATION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/critical-findings/CRITICAL_FINDINGS_TEST_COUNT_RECONCILIATION.md) | 16,393 | `b97b355069dc74435e0648521fa26bdf64ea293ae9ff0dc62bd8a3e7a3853bab` |
| [`CRITICAL_FINDINGS_CONTROLLER_AUTHORITY_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/critical-findings/CRITICAL_FINDINGS_CONTROLLER_AUTHORITY_MATRIX.md) | 14,483 | `38263bcb219c261c3e6a6729e037d2fa6bb073904c69baf9ad875cdab87e7f9e` |
| [`CRITICAL_FINDINGS_FINAL_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/critical-findings/CRITICAL_FINDINGS_FINAL_EVIDENCE_REGISTER.md) | 11,019 | `d7c86fdfd0c80d0ce1c0e94bb41b84475ea0005dfbdc6184c34657f310924bf8` |
| [`CRITICAL_FINDINGS_FINAL_SHA256_MANIFEST.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/critical-findings/CRITICAL_FINDINGS_FINAL_SHA256_MANIFEST.md) | Self-Referential | Manifest file |
| [`CRITICAL_FINDINGS_FINAL_GOVERNANCE_DISPOSITION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/critical-findings/CRITICAL_FINDINGS_FINAL_GOVERNANCE_DISPOSITION.md) | 6,853 | `8c2d97e4ebfaa4135289d47b2d9d819b6a3bd303f3388ca9bea4d2f04abf62af` |

---

## 2. Production Source Code Manifest

| Component | File Path | File Size | Cryptographic SHA-256 Checksum |
| :--- | :--- | :---: | :--- |
| `user-management` | [`JwtAuthenticationFilter.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java) | 5,816 B | `13dc804282b3be60918fd7c365b8220b6820fc29a8f5034849b2b6c2a9394834` |
| `user-management` | [`JwtUtil.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtUtil.java) | 3,493 B | `e818886652899434b974f10f7d90b814a5be5d14c4a642ba5f5acb0654a62e1f` |
| `user-management` | [`SecurityConfig.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java) | 4,744 B | `5136f51d06afde8a04ef20a0ea9e1a4c4f06532f1ea04619553aca39116cbe21` |
| `user-management` | [`HierarchySecurityUtil.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/HierarchySecurityUtil.java) | 3,531 B | `8af469b0347cc90f66968936cb597bcedbadf06c0ef6cb5b796574e518cdf61d` |
| `user-management` | [`UserContext.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/session/UserContext.java) | 577 B | `9e4e029c9cb83c304ba7237fa2019c0a395d7e1316adf44f2eec487ffd0bd6a1` |
| `user-management` | [`PrivilegeController.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java) | 6,242 B | `38124b14651c5284464b64bc4d1291ef72d33d3309b78a04d1894904125a2878` |
| `user-management` | [`ResourceController.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java) | 5,554 B | `55a1cb18d121f89d714004ae77df9e0d8434b9eed866f524083d8e89cb1b8fca` |
| `user-management` | [`RoleLevelMasterController.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java) | 4,636 B | `a6a8540037fdf7b5f11e58b962eaad73e0ebbf47993dbf05742ce062f4115e50` |
| `user-management` | [`RoleTypeMasterController.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java) | 4,556 B | `08dc0714432a8569f1826389e69b6f4ab88abaa72cc043991d27f1960489ccc9` |
| `user-management` | [`UserServiceImpl.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImpl.java) | 18,066 B | `ef0abcd6e7de7fedc3429570ffe662266c74fd4360b901a6e97662688f1af6c0` |
| `user-management` | [`UserRoleMappingServiceImpl.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserRoleMappingServiceImpl.java) | 11,364 B | `f3d6aae5375a82f34f5d3dde9d2204ae4756a7f8929028173dbf513001fd407d` |
| `auth-service` | [`JwtUtil.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/security/JwtUtil.java) | 5,281 B | `661843f96d28deb7b5892c9e6b95c814d73b9e15ba7f1cd4239f774708c42bf2` |
| `auth-service` | [`AuthServiceImpl.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java) | 6,999 B | `fa5856e67a2a4ae6bcdbc8fad2b3b51cbc3035d777e8fc2679d83af4f8fe5bc0` |
| `revenue` | [`JwtAuthenticationFilter.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/user/security/JwtAuthenticationFilter.java) | 4,915 B | `819443585219e47af530e38909e2bfcdde62ab89d7d0464af4497cdbdd8e83be` |
| `revenue` | [`JwtUtil.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/user/security/JwtUtil.java) | 3,486 B | `cf291009861bd6da6310bcafa39768b6d0b532b5b7f2f1146a3451241db75d91` |
| `revenue` | [`UserContext.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/user/session/UserContext.java) | 570 B | `3d366615b9275058e79c8edc872ce9bc2196a89e12eab9bf52e9421f5c5bbfd5` |
| `api-gateway` | [`JwtUtil.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/util/JwtUtil.java) | 2,301 B | `93304deb0ff2c685a509f3f331f81d410a82e79d5a18a7bbe0e546afa3886f11` |
| `api-gateway` | [`IdentityHeaderSanitizationFilter.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilter.java) | 2,654 B | `e8a9ea2dacac4229cbbdf3adeb7d73d99aae4c2c4e23b17eafdf663578d6c7fe` |

---

## 3. Test Suite Source Code Manifest

| Component | File Path | File Size | Cryptographic SHA-256 Checksum |
| :--- | :--- | :---: | :--- |
| `user-management` | [`Rbac001SecurityNegativeTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java) | 8,371 B | `b62189368a77b05aaa7c78e20fad19ee07c200b7716a9e349624e8e62afce1b3` |
| `user-management` | [`RbacSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/RbacSecurityIntegrationTest.java) | 4,878 B | `480fbdcf1ce153140f8289a31506b64a536b783ef6eb3cc2d6b8db8109bb4a0b` |
| `user-management` | [`LiveHttpSecurityIntegrationTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/integration/LiveHttpSecurityIntegrationTest.java) | 8,708 B | `32ed231043aa66b97e0b6ef8a6fe173189b837ada5637edb3ef4aac6660fdebb` |
| `user-management` | [`UserServiceImplTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImplTest.java) | 16,388 B | `715821138103a052fc22bd3335adddd80bd33ef131120168684a130f95053b52` |
| `user-management` | [`UserRoleMappingServiceImplTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserRoleMappingServiceImplTest.java) | 9,848 B | `6010fb2f58c948a3b5dd4c720be90a400230ab911757bc499663e69ce3061c62` |
| `revenue` | [`SubDistrictPrimaryControllerSecurityTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/test/java/in/nic/lgd/revenue/security/SubDistrictPrimaryControllerSecurityTest.java) | 13,056 B | `d9806a45b489d962edb4317dccc2b44c4cc75c1a14f4dfd3c8f5e8412527ad64` |
| `api-gateway` | [`IdentityHeaderSanitizationFilterTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/test/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilterTest.java) | 5,167 B | `4ebdc4aeafef72cd2ee318d9dff023fc75218d1407ad42f80799bb59f2454f53` |

---

## 4. Surefire XML Test Reports Manifest

| Component | Surefire XML Report File | Test Count | SHA-256 Checksum |
| :--- | :--- | :---: | :--- |
| `user-management` | `TEST-in.nic.lgd.usermanagement.integration.Rbac001SecurityNegativeTest.xml` | 10 | `1b4f2652ba6db122f7f2cb14af6ea63a3b56257f4c1939e5147bf01b008f0484` |
| `user-management` | `TEST-in.nic.lgd.usermanagement.integration.RbacSecurityIntegrationTest.xml` | 10 | `42c1d79913aaa9eaff5f5b67885b2430f78dcffcf2e70b045676a8ff4df36bff` |
| `user-management` | `TEST-in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest.xml` | 6 | `46a6cf7525404eb1f29ed5c13ca1ae0aa4d9bf8e58f9d8aee5c8b29219e8eaf2` |
| `discovery` | `TEST-in.nic.servicediscovery.egra.service_discovery.EurekaSecurityTest.xml` | 2 | `658c2f9f93f62caceee3d5208e5a6cde5e2b66297f69eb8a6697b14cabd08ccb` |

---

## 5. Verification Command

To independently verify the hashes in this manifest against the local workspace, execute:

```powershell
Get-FileHash -Algorithm SHA256 "user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java"
Get-FileHash -Algorithm SHA256 "user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java"
Get-FileHash -Algorithm SHA256 "user-management/src/test/java/in/nic/lgd/usermanagement/integration/RbacSecurityIntegrationTest.java"
```
