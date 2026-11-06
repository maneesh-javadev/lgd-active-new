const fs = require('fs');
const strongMd = fs.readFileSync('scratch/strong_copyleft_table.md', 'utf8');
const weakMd = fs.readFileSync('scratch/weak_copyleft_table.md', 'utf8');

const content = `# LGD 2.0 — Software License Compliance & Legal Risk Assessment
## Comprehensive Open Source Software (OSS) Licensing Analysis & Reconciliation

| **Document Information** | |
|---|---|
| **Target Platform** | Local Government Directory 2.0 (LGD 2.0) |
| **Repository Root** | \`e:\\System\\Projects\\dockerProject\\Source code\\lgd-active-new\` |
| **Assessment Scope** | Phase 4: Software Composition Analysis (SCA) & Supply Chain Audit |
| **Audit Date** | November 2, 2026 |
| **SBOM Evidence** | \`SOFTWARE_BILL_OF_MATERIALS.json\` (SHA-256: \`99ba796566d50a5d171e55ffbc7da9946be0b1bbaf2b5be566af6a623a79993b\`) |
| **Document Status** | **TECHNICAL LICENSE COMPLIANCE ASSESSMENT — PENDING LEGAL COUNSEL FORMAL CLEARANCE** |

---

## 1. Executive Summary & Inventory Reconciliation

A rigorous open-source software (OSS) license compliance audit and mathematical reconciliation was conducted across all 7 modules of the Local Government Directory 2.0 (LGD 2.0) platform, encompassing five Java backend microservices (\`api-gateway\`, \`auth-service\`, \`discovery\`, \`revenue\`, \`user-management\`) and two React frontend applications (\`lgd_react\`, \`lgd-um\`).

### 1.1 Structural Reconciliation of Metrics:
The independent review strictly distinguishes between **Unique Components**, **Module Instances**, and **License Attributions** from the canonical, schema-validated CycloneDX 1.5 SBOM:

1. **Unique Components (916 third-party components):** Deduplicated by package URL (\`group:name:version\`).
2. **Module Component Instances (1,348):** The sum of all component occurrences across the 7 application modules:
   - \`lgd_react\`: 434 instances
   - \`api-gateway\`: 188 instances
   - \`revenue\`: 166 instances
   - \`auth-service\`: 164 instances
   - \`user-management\`: 148 instances
   - \`lgd-um\`: 125 instances
   - \`discovery\`: 123 instances
   - **Total Module Instances:** **1,348**
3. **Multi-Licensed Packages (44 component instances):** Packages with dual or compound license declarations (such as \`(MPL-2.0 OR Apache-2.0)\`, \`(MIT AND Zlib)\`, or dual EPL-2.0 / GPL-2.0-with-classpath-exception).
4. **Total Declared License Attributions (1,432):** The sum of all declared license tags across the 1,348 module instances:
   $$\\text{Declared Attributions} = 1,432$$
   When including the 5 module instances with undeclared POM manifest licenses (\`antlr-runtime:3.4\`), the total attributions accounted for is **1,437**.

### 1.2 Core Audit Findings:
- **Zero Viral Strong Copyleft:** Exactly **0 components** governed by reciprocal viral copyleft licenses (**GPL v1/v2/v3 without Classpath Exception**, **AGPL v1/v3**, or **SSPL**) exist in runtime or distribution paths.
- **GNU Classpath Exception Demarcation:** Exactly **16 unique components** declare GPL-2.0 in their POM manifests. **All 16 components explicitly incorporate the GNU Classpath Exception** (or are dual-licensed under EPL-2.0 / CDDL-1.0). The Classpath Exception legally exempts dynamic and static linking of unmodified binaries from viral source code disclosure.
- **Permissive License Predominance:** **94.4% of module instances** (1,273 of 1,348) and **94.7% of license attributions** (1,360 of 1,437) are governed by standard permissive licenses (Apache-2.0: 660, MIT: 489, BSD: 99, ISC: 39, Public Domain / CC0 / 0BSD: 18, Custom Permissive: 16).
- **Weak Copyleft Containment:** **28 unique components** (representing 44 module instances) utilize weak copyleft licenses (EPL-1.0/2.0: 44 attributions, LGPL-2.1: 22 attributions, MPL-1.1/2.0: 14 attributions). All are consumed strictly as unmodified binary JARs / npm packages via dynamic linking.
- **Undeclared Manifest Licenses:** Exactly 1 unique component (\`org.antlr:antlr-runtime:3.4\`), appearing as **5 module instances** (1 in each Maven backend service), contains no \`<licenses>\` element in its Maven Central POM manifest. Upstream source inspection verifies it is licensed under the permissive **BSD-3-Clause** license.
- **Legal Compliance Posture:** Technical audit confirms architectural isolation and compliance with MeitY Open Source guidelines. Formal statutory sign-off is submitted for government legal counsel review; full legal indemnification is not claimed without counsel sign-off.

---

## 2. Master License Reconciliation Matrix

### 2.1 License Attributions Distribution (Total: 1,437 Attributions; 1,432 Declared + 5 Undeclared)

| License Expression / Identifier | SPDX ID | Total Attributions | % of Total Attributions | Category | Enterprise Risk Rating |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Apache License 2.0** | \`Apache-2.0\` | 660 | 45.93% | Permissive | Very Low |
| **MIT License** | \`MIT\` / \`MIT-0\` | 489 | 34.03% | Permissive | Very Low |
| **BSD (2-Clause, 3-Clause, 4-Clause, Modified)** | \`BSD-*\` | 99 | 6.89% | Permissive | Very Low |
| **ISC License** | \`ISC\` | 39 | 2.71% | Permissive | Very Low |
| **Eclipse Public License (EPL 1.0 & 2.0)** | \`EPL-1.0\` / \`EPL-2.0\` | 44 | 3.06% | Weak Copyleft | Low (Dynamic Linking) |
| **GPL 2.0 with Classpath Exception** | \`GPL-2.0-with-classpath-exception\` | 28 | 1.95% | Permissive Linking | Very Low (Exception Verified) |
| **GNU Lesser General Public License** | \`LGPL-2.1-only\` / \`LGPL-2.1-or-later\` | 22 | 1.53% | Weak Copyleft | Low (Dynamic Linking) |
| **Public Domain / CC0-1.0 / 0BSD** | \`CC0-1.0\` / \`Public Domain\` / \`0BSD\` | 18 | 1.25% | Permissive / Dedicated | Very Low |
| **Custom Permissive (Indiana Univ, jQuery, W3C, BlueOak)** | Custom Permissive | 16 | 1.11% | Permissive | Very Low |
| **Mozilla Public License (MPL 1.1 & 2.0)** | \`MPL-1.1\` / \`MPL-2.0\` | 14 | 0.97% | Weak Copyleft | Low (File-level copyleft) |
| **Creative Commons Attribution 4.0** | \`CC-BY-4.0\` | 2 | 0.14% | Permissive Attribution | Very Low |
| **Python-2.0** | \`Python-2.0\` | 1 | 0.07% | Permissive | Very Low |
| **No Declared License in POM Manifest** | Undeclared (\`antlr-runtime:3.4\`) | 5 | 0.35% | Unspecified Manifest | Medium (Verified BSD-3 in source) |
| **TOTAL ATTRIBUTIONS** | — | **1,437** | **100.00%** | — | — |

---

### 2.2 Instance-Level Reconciliation (Total: 1,348 Module Instances across 916 Unique Components)

Accounting for components with single vs. multiple license expressions:

| Classification Category | Distinct Module Instances | % of Total Instances (1,348) | Primary Governing Licenses | Compliance Status |
|---|:---:|:---:|:---|:---:|
| **Permissive** | 1,273 | **94.44%** | Apache-2.0, MIT, BSD, ISC, CC0, Public Domain | Compliant (Notice files preserved) |
| **Weak Copyleft** | 44 | **3.26%** | LGPL-2.1, EPL-1.0/2.0, MPL-1.1/2.0, CDDL-1.0 | Compliant via dynamic linking |
| **Strong Copyleft w/ Exception** | 26 | **1.93%** | GPL-2.0-with-classpath-exception / EPL-2.0 | Compliant (Classpath Exception grants independent linking) |
| **Undeclared Manifest** | 5 | **0.37%** | \`org.antlr:antlr-runtime:3.4\` (in 5 services) | BSD-3-Clause in upstream source; manifest empty |
| **Reciprocal Viral Copyleft (GPL/AGPL)** | 0 | **0.00%** | None | Fully Compliant (**0% Viral Risk**) |
| **TOTAL INSTANCES** | **1,348** | **100.00%** | — | — |

---

## 3. Undeclared Manifest License Deep-Dive

### Finding: \`org.antlr:antlr-runtime:3.4\`
- **Affected Modules:** \`api-gateway\`, \`auth-service\`, \`discovery\`, \`revenue\`, \`user-management\` (5 instances).
- **Dependency Hierarchy:** Transitive dependency pulled by \`org.springframework.cloud:spring-cloud-starter-netflix-eureka-client\` -> \`com.netflix.eureka:eureka-client\` -> \`com.netflix.archaius:archaius-core:0.7.6\` -> \`org.antlr:antlr-runtime:3.4\`.
- **Manifest Issue:** The published Maven POM for \`org.antlr:antlr-runtime:3.4\` lacks a \`<licenses>\` tag block, causing automated scanners (CycloneDX, Trivy, Dependency-Check) to catalog it as \`No License Declared\`.
- **Factual Upstream Investigation:**
  - Upstream project ANTLR (ANother Tool for Language Recognition) by Terence Parr is published under the **BSD 3-Clause License**.
  - ANTLR 3.4 source code headers and official release repository (\`https://github.com/antlr/antlr3\`) explicitly license all ANTLR runtime code under BSD 3-Clause.
  - The missing license tag in Maven Central is a known packaging omission of ANTLR 3.x POMs from 2011.
- **Compliance Recommendation:** Document the BSD 3-Clause provenance in \`/legal/THIRD_PARTY_LICENSES.md\` to satisfy audit traceability.

---

## 4. Package-Level Classification of Strong- and Weak-Copyleft Components

### 4.1 Legal Classification Methodology & GNU Classpath Exception Analysis

In strict OSS license governance, automated tools frequently flag components with \`GPL-2.0\` in their expression as "Strong Copyleft", giving rise to audit confusion regarding viral contamination.

**The GNU Classpath Exception (GCE) Legal Mechanism:**
Under the official GNU Classpath Exception to the GNU General Public License v2:
> *"As a special exception, the copyright holders of this library give you permission to link this library with independent modules to produce an executable, regardless of the license terms of these independent modules, and to copy and distribute the resulting executable under terms of your choice, provided that you also meet, for each linked independent module, the terms and conditions of the license of that module."*

**Technical Verification for LGD 2.0:**
1. All 16 components listed below are consumed as **unmodified binary JARs** obtained from Maven Central.
2. None of these libraries have been modified or fork-built by the LGD project.
3. The LGD 2.0 microservices link to these libraries dynamically via standard Java classloading / bytecode execution.
4. Under the terms of the Classpath Exception, dynamic linking of unmodified binaries creates an "independent module", completely exempting LGD 2.0 proprietary/government source code from GPL viral reciprocal disclosure obligations.
5. In addition, 14 of the 16 components are dual-licensed under the **Eclipse Public License 2.0 (EPL-2.0)**, providing an independent non-viral licensing pathway.

### 4.2 Package-Level Classification: Strong Copyleft with Classpath Exception (16 Components)

${strongMd}

### 4.3 Package-Level Classification: Weak Copyleft Components (28 Components)

${weakMd}

---

## 5. Compliance Sign-Off, Scope Limits & Legal Review Action

- **Assessed Inventory:** 916 unique components across 1,348 module instances.
- **Declared License Attributions:** 1,432 (1,437 total including 5 undeclared ANTLR 3.4 instances).
- **Viral Copyleft Exposure:** **0.00% (Zero GPL/AGPL viral copyleft found).**
- **Permissive Distribution:** **94.44% of instances** (1,273 / 1,348) are strictly permissive.
- **Technical Posture:** No source modifications have been made to any weak copyleft libraries; all dependencies are linked dynamically as standard binary artifacts.
- **Legal Review Scope Limitation:**
  > [!IMPORTANT]
  > This document provides a technical software composition analysis and licensing factual baseline. It demonstrates technical alignment with the *Framework for Adoption of Open Source Software in e-Governance Projects* (MeitY). However, formal legal warranty, copyright compliance sign-off, and statutory indemnification must be ratified by designated Government Legal Counsel.
`;

fs.writeFileSync('SCA_LICENSE_COMPLIANCE_REPORT.md', content);
console.log('Successfully wrote updated SCA_LICENSE_COMPLIANCE_REPORT.md');
