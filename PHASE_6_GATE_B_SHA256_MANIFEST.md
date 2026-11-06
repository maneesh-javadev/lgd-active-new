# LGD 2.0 — Phase 6 Gate B Cryptographic SHA-256 Manifest
## Authoritative Deliverable Digests & Integrity Register

| **Manifest Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Document ID** | `LGD2-P6-GATE-B-SHA256-MANIFEST` |
| **Milestone** | Phase 6 Gate B Technical Verification Closure |
| **Generation Date** | November 4, 2026 (`2026-11-04T16:15:00+05:30`) |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Algorithm** | SHA-256 (256-bit cryptographic digest) |
| **Integrity Scope** | Authoritative Phase 6 Gate B Deliverables & Hardening Source Files |

---

## 1. Master Phase 6 Gate B Deliverables Manifest

| # | Deliverable / Artifact File Path | File Size | SHA-256 Cryptographic Hash | Verification Role |
|:-:|:---|:---:|:---:|:---|
| 1 | [`PHASE_6_GATE_B_TECHNICAL_VERIFICATION_CLOSURE_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_GATE_B_TECHNICAL_VERIFICATION_CLOSURE_REPORT.md) | ~14.5 KB | `61A753A87009C4858023CA56C3721EC667C1120418B52C9B84D21EF67570D15B` | Authoritative Gate B Closure Report |
| 2 | [`PHASE_6_GATE_B_TECHNICAL_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_GATE_B_TECHNICAL_EVIDENCE_REGISTER.md) | ~7.2 KB | `356A838973337200C9D9B70E90D4517E6C3F5BA80FA72979AF13C726629A7A80` | Gate B Evidence Register (22 Artifacts) |
| 3 | [`PHASE_6_GATE_B_REGRESSION_AND_RETEST_REPORT.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_GATE_B_REGRESSION_AND_RETEST_REPORT.md) | ~8.1 KB | `26E562F1BED643F766FC55B1D54A5350A02BC89090E312F60E09DF9CC1B5A9AF` | 329-Test Regression & Retest Report |
| 4 | [`PHASE_6_RBAC_FINDINGS_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_RBAC_FINDINGS_REGISTER.md) | ~31.0 KB | `CC4C0AD2B571B8227BA255F1DF2E27C803E08C542E9D5CAC3E036A468C8CC77A` | Master 16-Finding RBAC Register |
| 5 | [`PHASE_6_EVIDENCE_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_EVIDENCE_REGISTER.md) | ~24.5 KB | `9FBC7AB0785C742E2CAE7A9436DBA5DA2CBB4891959E1571AE0E7CF27005E08E` | Authorization Evidence Register |
| 6 | [`PHASE_6_AUTHORIZATION_ENDPOINT_MATRIX.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_AUTHORIZATION_ENDPOINT_MATRIX.md) | ~18.8 KB | `2DFAE1284162427CBF7AAEA9D1051945BF19EFD24DF84B8D442C2EEF89B3EB83` | Endpoint Authorization Crosswalk |
| 7 | [`PHASE_6_MULTITENANCY_TEST_REGISTER.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/PHASE_6_MULTITENANCY_TEST_REGISTER.md) | ~13.9 KB | `587E41927071CA007E3C3926367F7B063B7DC465BAA13D0534AFDC7B785B1FAD` | Multi-Tenancy Boundary Test Register |
| 8 | [`security-audit/phase-6-remediation/final-verification/PHASE_6_FINAL_GOVERNANCE_DISPOSITION.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/final-verification/PHASE_6_FINAL_GOVERNANCE_DISPOSITION.md) | ~9.8 KB | `63C6ECEC2043E28CCFF752CBCC52EC58AA1D1F6A7C6BE111DDAFA53E610E5A5D` | Gate Alignment & Governance Disposition |
| 9 | [`security-audit/phase-6-remediation/final-verification/PHASE_6_RBAC_002_PRODUCTION_PARITY_STATUS.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/final-verification/PHASE_6_RBAC_002_PRODUCTION_PARITY_STATUS.md) | ~15.4 KB | `34718B0C033869002B317E3B0977CA552F23CE0B72B7A313C52C61631AFD7BE1` | RBAC-002 Production Parity Status |
| 10 | [`security-audit/phase-6-remediation/final-verification/PHASE_6_GATEWAY_HEADER_HARDENING_STATUS.md`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/security-audit/phase-6-remediation/final-verification/PHASE_6_GATEWAY_HEADER_HARDENING_STATUS.md) | ~12.2 KB | `E2D133E9A51E44AA813AC5DFD3004C30D0D67196F6C88CD39EE3DC79A4BD294B` | Gateway Header Hardening Status |

---

## 2. Technical Code & Configuration Hardening Manifest

| # | Hardening Target File | Relative Path | SHA-256 Cryptographic Hash |
|:-:|:---|:---|:---:|
| 1 | Programmatic Header Sanitizer | [`api-gateway/src/main/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilter.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilter.java) | `E8A9EA2DACAC4229CBBDF3ADEB7D73D99AAE4C2C4E23B17EAFDF663578D6C7FE` |
| 2 | Automated Header Test Suite | [`api-gateway/src/test/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilterTest.java`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/test/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilterTest.java) | `4EBDC4AEAFEF72CD2EE318D9DFF023FC75218D1407AD42F80799BB59F2454F53` |
| 3 | Auth Service Prod Config | [`auth-service/src/main/resources/application-prod.properties`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/resources/application-prod.properties) | `60497CE465B44F0227A4F2A40F90A5EEE0797A88BFE5D1575FAD4783AF350300` |
| 4 | User Management Prod Config | [`user-management/src/main/resources/application-prod.properties`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/resources/application-prod.properties) | `FEF837919B0DFB633F3C5ADC833220489F21D62D5E71510C3AFF554368102BE2` |
| 5 | API Gateway Base Config | [`api-gateway/src/main/resources/application.properties`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/resources/application.properties) | `65315D9E910AC021BB5AE3C60D4FE01A3DC98767100925DF1A9EF039E9FFA661` |
| 6 | API Gateway Prod Config | [`api-gateway/src/main/resources/application-prod.properties`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/resources/application-prod.properties) | `44EDC726E15E0C36C31490C4E13A13B649AE6B6F75DAA708AFDDF1B84273E27D` |
| 7 | Revenue Prod Config | [`revenue/src/main/resources/application-prod.properties`](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/resources/application-prod.properties) | `099F187073109412D8F59A4DC1079A280E97E166313135BF5B9B853B2E4AE0B2` |

---

## 3. Manifest Integrity Attestation

All digests in this manifest have been computed directly from repository disk storage using PowerShell `Get-FileHash -Algorithm SHA256`.

*Certified by:*  
**DevSecOps Engineer & Principal Application Security Engineer**
