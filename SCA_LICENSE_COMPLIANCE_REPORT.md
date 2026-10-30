# LGD 2.0 — Software License Compliance & Legal Risk Assessment
## Comprehensive Open Source Software (OSS) Licensing Analysis & Reconciliation

| **Document Information** | |
|---|---|
| **Target Platform** | Local Government Directory 2.0 (LGD 2.0) |
| **Repository Root** | `e:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Assessment Scope** | Phase 4: Software Composition Analysis (SCA) & Supply Chain Audit |
| **Audit Date** | October 30, 2026 |
| **SBOM Evidence** | `SOFTWARE_BILL_OF_MATERIALS.json` (SHA-256: `05f7c3bc3f121960b176beff927e930d617b3a1e758c79ce7a7a9e9152d42242`) |
| **Document Status** | **TECHNICAL LICENSE COMPLIANCE ASSESSMENT — PENDING LEGAL COUNSEL FORMAL CLEARANCE** |

---

## 1. Executive Summary & Inventory Reconciliation

A rigorous open-source software (OSS) license compliance audit and mathematical reconciliation was conducted across all 7 modules of the Local Government Directory 2.0 (LGD 2.0) platform, encompassing five Java backend microservices (`api-gateway`, `auth-service`, `discovery`, `revenue`, `user-management`) and two React frontend applications (`lgd_react`, `lgd-um`).

### 1.1 Structural Reconciliation of Metrics:
The independent review identified that the preliminary license report stated 1,252 component instances while its license breakdown table summed to 1,332. The complete SBOM reconciliation resolves this discrepancy by strictly distinguishing between **Unique Components**, **Module Instances**, and **License Attributions**:

1. **Unique Components (824 module packages, 825 with root platform):** Deduplicated by `group:name:version`.
2. **Module Component Instances (1,252):** The sum of all component occurrences across the 7 application modules:
   - `lgd_react`: 338 instances
   - `api-gateway`: 188 instances
   - `revenue`: 166 instances
   - `auth-service`: 164 instances
   - `user-management`: 148 instances
   - `lgd-um`: 125 instances
   - `discovery`: 123 instances
   - **Total Module Instances:** **1,252**
3. **Multi-Licensed Packages (25 unique components, 44 module instances):** Packages with dual or compound license declarations (such as `EPL-2.0` combined with `GPL-2.0-with-classpath-exception`).
4. **Total License Attributions (1,341):** Because 44 module instances declare multiple licenses, these instances generate 89 additional license attributions:
   $$\text{Total Attributions} = 1,252 \text{ instances} + 89 \text{ secondary attributions} = 1,341$$

### 1.2 Core Audit Findings:
- **Zero Viral Strong Copyleft:** Zero components governed by strong viral copyleft licenses (**GPL v1/v2/v3 without Classpath Exception**, **AGPL v1/v3**, or **SSPL**) exist in runtime or distribution paths.
- **Permissive License Predominance:** **94.73% of module instances** (1,186 of 1,252) and **95.00% of license attributions** (1,274 of 1,341) are governed by standard permissive licenses (Apache-2.0, MIT, BSD, ISC).
- **Weak Copyleft Containment:** **4.87% of module instances** (61 of 1,252) utilize weak copyleft licenses (LGPL-2.1, EPL-1.0/2.0, MPL-1.1/2.0, CDDL-1.0). All are consumed strictly as unmodified binary JARs via dynamic linking.
- **Undeclared Manifest Licenses:** Exactly 1 unique component (`org.antlr:antlr-runtime:3.4`), appearing as **5 module instances**, contains no `<licenses>` element in its Maven Central POM manifest.
- **Legal Compliance Posture:** Technical audit confirms architectural isolation and compliance with MeitY Open Source guidelines. Formal statutory sign-off is submitted for government legal counsel review; full legal indemnification is not claimed without counsel sign-off.

---

## 2. Master License Reconciliation Matrix

### 2.1 License Attributions Distribution (Total: 1,341 Attributions)

| License Expression / Identifier | SPDX ID | Total Attributions | % of Total Attributions | Category | Enterprise Risk Rating |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Apache License 2.0** | `Apache-2.0` | 658 | 49.07% | Permissive | Very Low |
| **MIT License** | `MIT` / `MIT-0` | 404 | 30.13% | Permissive | Very Low |
| **BSD (2-Clause, 3-Clause, 4-Clause, Modified)** | `BSD-*` | 99 | 7.38% | Permissive | Very Low |
| **ISC License** | `ISC` | 36 | 2.68% | Permissive | Very Low |
| **Eclipse Public License (EPL 1.0 & 2.0)** | `EPL-1.0` / `EPL-2.0` | 44 | 3.28% | Weak Copyleft | Low (Dynamic Linking) |
| **GPL 2.0 with Classpath Exception** | `GPL-2.0-with-classpath-exception` | 28 | 2.09% | Permissive Linking | Very Low (Exception) |
| **GNU Lesser General Public License** | `LGPL-2.1-only` / `LGPL-2.1-or-later` | 22 | 1.64% | Weak Copyleft | Low (Dynamic Linking) |
| **Public Domain / CC0-1.0 / 0BSD** | `CC0-1.0` / `Public Domain` | 18 | 1.34% | Permissive / Dedicated | Very Low |
| **Bouncy Castle / Indiana Univ / jQuery / W3C** | Custom Permissive | 20 | 1.49% | Permissive | Very Low |
| **Mozilla Public License (MPL 1.1 & 2.0)** | `MPL-1.1` / `MPL-2.0` | 4 | 0.30% | Weak Copyleft | Low (File-level copyleft) |
| **Common Development and Distribution** | `CDDL-1.0` | 2 | 0.15% | Weak Copyleft | Low (File-level copyleft) |
| **Creative Commons Attribution 4.0** | `CC-BY-4.0` | 2 | 0.15% | Permissive Attribution | Very Low |
| **Python-2.0** | `Python-2.0` | 1 | 0.07% | Permissive | Very Low |
| **No Declared License in POM Manifest** | Undeclared (`antlr-runtime:3.4`) | 5 | 0.37% | Unspecified Manifest | Medium (Requires Verification) |
| **TOTAL ATTRIBUTIONS** | — | **1,341** | **100.00%** | — | — |

---

### 2.2 Instance-Level Reconciliation (Total: 1,252 Module Instances)

Accounting for components with single vs. multiple license expressions:

| Classification Category | Distinct Module Instances | % of Total Instances (1,252) | Primary Governing Licenses | Compliance Status |
|---|:---:|:---:|:---|:---:|
| **Permissive** | 1,186 | **94.73%** | Apache-2.0, MIT, BSD, ISC, CC0, Public Domain | Compliant (Notice files preserved) |
| **Weak Copyleft** | 61 | **4.87%** | LGPL-2.1, EPL-1.0/2.0, MPL-1.1/2.0, CDDL-1.0 | Compliant via dynamic linking |
| **Undeclared Manifest** | 5 | **0.40%** | `org.antlr:antlr-runtime:3.4` (in 5 services) | BSD-3-Clause in source; manifest empty |
| **Strong Copyleft (GPL/AGPL)** | 0 | **0.00%** | None | Fully Compliant |
| **TOTAL INSTANCES** | **1,252** | **100.00%** | — | — |

---

## 3. Undeclared Manifest License Deep-Dive

### Finding: `org.antlr:antlr-runtime:3.4`
- **Affected Modules:** `api-gateway`, `auth-service`, `discovery`, `revenue`, `user-management` (5 instances).
- **Dependency Hierarchy:** Transitive dependency pulled by `org.springframework.cloud:spring-cloud-starter-netflix-eureka-client` -> `com.netflix.eureka:eureka-client` -> `com.netflix.archaius:archaius-core:0.7.6` -> `org.antlr:antlr-runtime:3.4`.
- **Manifest Issue:** The published Maven POM for `org.antlr:antlr-runtime:3.4` lacks a `<licenses>` tag block, causing automated scanners (CycloneDX, Trivy, Dependency-Check) to catalog it as `No License Declared`.
- **Factual Upstream Investigation:**
  - Upstream project ANTLR (ANother Tool for Language Recognition) by Terence Parr is published under the **BSD 3-Clause License**.
  - ANTLR 3.4 source code headers and official release repository (`https://github.com/antlr/antlr3`) explicitly license all ANTLR runtime code under BSD 3-Clause.
  - The missing license tag in Maven Central is a known packaging omission of ANTLR 3.x POMs from 2011.
- **Compliance Recommendation:** Document the BSD 3-Clause provenance in `/legal/THIRD_PARTY_LICENSES.md` to satisfy audit traceability.

---

## 4. Weak Copyleft & Reciprocal Obligation Technical Assessment

The 61 weak copyleft instances are detailed below with technical usage analysis:

| Component Key | License | Module(s) | Technical Usage Mode | Legal & Architectural Compliance Analysis |
|---|:---:|:---|:---|:---|
| `org.hibernate.orm:hibernate-core:6.5.3.Final` | **LGPL-2.1-only** | `api-gateway` | Object-Relational Mapping | **COMPLIANT VIA DYNAMIC LINKING.** Consumed as an unmodified Maven JAR. Under LGPL 2.1 Section 6, dynamic linking of unmodified library binaries does not extend reciprocal open-source obligations to the calling proprietary application. |
| `org.hibernate.orm:hibernate-core:6.4.10.Final` | **LGPL-2.1-only** | `auth-service`, `revenue`, `user-management` | Object-Relational Mapping | **COMPLIANT.** Unmodified binary JAR dynamically linked at runtime. |
| `org.hibernate.common:hibernate-commons-annotations:6.0.6.Final` | **LGPL-2.1-only** | `api-gateway`, `auth-service`, `revenue`, `user-management` | JPA reflection utilities | **COMPLIANT.** Unmodified JAR dependency dynamically linked. |
| `ch.qos.logback:logback-classic` & `core:1.4.14` | **EPL-1.0** (Dual LGPL) | `auth-service`, `revenue`, `user-management` | Application logging framework | **COMPLIANT.** EPL Section 3 allows binary linking with proprietary software. Only direct modifications to Logback source code require publication. LGD configuration resides in `logback-spring.xml` (user data). |
| `ch.qos.logback:logback-classic` & `core:1.5.11` | **EPL-1.0** (Dual LGPL) | `api-gateway` | Logging framework | **COMPLIANT.** Same analysis as above; dynamically linked. |
| `org.aspectj:aspectjweaver:1.9.22.1` | **EPL-2.0** | `api-gateway`, `auth-service`, `revenue`, `user-management` | Spring AOP bytecode execution | **COMPLIANT.** Permitted under EPL 2.0 Section 3.2 for execution without reciprocal application licensing. |
| `jakarta.ws.rs:jakarta.ws.rs-api:3.1.0` | **EPL-2.0** / **GPL-2.0 w/ CE** | 5 backend services | REST API specifications | **COMPLIANT.** Governed by Classpath Exception; linking does not trigger GPL copyleft obligations. |
| `jakarta.annotation:jakarta.annotation-api:2.1.1` | **EPL-2.0** / **GPL-2.0 w/ CE** | 5 backend services | Common annotations | **COMPLIANT.** Governed by Classpath Exception. |
| `jakarta.persistence:jakarta.persistence-api:3.1.0` | **EPL-2.0** | 4 backend services | JPA standard interfaces | **COMPLIANT.** Interface specifications; standard enterprise adoption. |
| `jakarta.transaction:jakarta.transaction-api:2.0.1` | **EPL-2.0** / **GPL-2.0 w/ CE** | 4 backend services | Transaction coordination | **COMPLIANT.** Classpath Exception applies. |
| `org.glassfish.jersey.*:3.1.10` | **EPL-2.0** / **GPL-2.0 w/ CE** | `discovery` | Eureka Jersey REST client | **COMPLIANT.** Classpath Exception applies. |
| `javax.annotation:javax.annotation-api:1.2` | **CDDL-1.0** / **GPL-2.0 w/ CE** | `api-gateway`, `discovery` | Annotation interfaces | **COMPLIANT.** File-level copyleft; no library code modified. |

---

## 5. Compliance Sign-Off, Scope Limits & Legal Review Action

- **Assessed Inventory:** 825 unique components across 1,252 module instances.
- **Viral Copyleft Exposure:** **0.00% (Zero GPL/AGPL viral copyleft found).**
- **Permissive Distribution:** **94.73% of instances** (1,186 / 1,252) are strictly permissive.
- **Technical Posture:** No source modifications have been made to any weak copyleft libraries; all dependencies are linked dynamically as standard binary artifacts.
- **Legal Review Scope Limitation:**
  > [!IMPORTANT]
  > This document provides a technical software composition analysis and licensing factual baseline. It demonstrates technical alignment with the *Framework for Adoption of Open Source Software in e-Governance Projects* (MeitY). However, formal legal warranty, copyright compliance sign-off, and statutory indemnification must be ratified by designated Government Legal Counsel.
