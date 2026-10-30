# LGD 2.0 - Dependency Security Report (SCA)

| **Document Version** | 1.0.0 |
| **Audit Date** | October 2026 |
| **Tooling Used** | Maven Dependency Plugin, NPM Audit, GitHub Advisory Database |

---

## 1. Executive Summary

A comprehensive Software Composition Analysis (SCA) was conducted across both backend (Java/Maven) and frontend (Node/NPM) modules. 
- In the frontend (`lgd_react`), 23 vulnerabilities were identified in the baseline; 21 were remediated via updates, reducing vulnerabilities by 91%.
- In the backend, dependency versions and cryptographic libraries were audited to identify outdated packages (`jbcrypt:0.4`) and version divergence.

---

## 2. Frontend Dependency Analysis (`lgd_react` & `lgd-um`)

### 2.1 Audit Results Summary

| Project | Total Dependencies | Direct Dependencies | Baseline Vulnerabilities | Post-Remediation Vulnerabilities |
|---|---|---|---|---|
| **lgd-um** | 148 | 18 | **0** | **0** (Clean) |
| **lgd_react** | 396 | 32 | **23** (1 Crit, 16 High, 5 Mod, 1 Low) | **2** (2 High) |

### 2.2 Resolved Frontend Vulnerabilities (21 Fixed)

1. **Vite WebSocket Arbitrary File Read & Server FS Deny Bypass**
   - **Advisories:** GHSA-p9ff-h696-f583, GHSA-v2wj-q39q-566r, GHSA-4w7w-66w2-5vf9
   - **Affected Range:** `vite@7.0.0 - 7.3.1`
   - **Status:** Upgraded to patched release via `npm update`.
2. **React Router Open Redirect**
   - **Advisories:** GHSA-4w7w-66w2-5vf9
   - **Status:** Upgraded to latest minor version.
3. **YAML Stack Overflow via Deeply Nested Collections**
   - **Advisories:** GHSA-48c2-rrv3-qjmp (CWE-674)
   - **Affected Range:** `yaml@1.0.0 - 1.10.2`
   - **Status:** Resolved in sub-dependency tree.

### 2.3 Residual Frontend Vulnerabilities & Action Plan

| Package | Severity | CVE / Advisory | Vulnerability Description | Remediation Plan |
|---|---|---|---|---|
| **xlsx** (0.18.5) | High | GHSA-4r6h-8v6p-xvw6, GHSA-5pgg-2g8v-p4x9 | Prototype Pollution & Regular Expression Denial of Service | Replace with actively maintained `exceljs` library. Code audit verified `xlsx` is only used for outgoing client export, not untrusted file parsing. |
| **zod** (<3.25.76) | High | GHSA-mrhx-c7xc-m3w5 | Memory exhaustion on oversized constrained collections | Upgrade to `zod@4.x` in next planned major sprint after verifying form resolver compatibility. |

---

## 3. Backend Java Dependency Analysis (Maven)

### 3.1 Audited Critical Dependencies

| Artifact Group & Name | Current Version | Usage / Service | Security Assessment | Recommendation |
|---|---|---|---|---|
| `org.mindrot:jbcrypt` | 0.4 | `user-management`, `auth-service` | Legacy implementation (released 2015). | Transition to Spring Security's native `BCryptPasswordEncoder` (`spring-security-crypto`). |
| `io.jsonwebtoken:jjwt-*` | 0.11.5 | `api-gateway`, `user-management`, `revenue` | Compliant with RFC 7519; secure HS256 HMAC implementation. | Keep aligned across modules; upgrade to `jjwt 0.12.x` when convenient. |
| `org.apache.tika:tika-core` | 2.9.2 | `revenue` | Secure document MIME type detection. | Secure; keeps content-type spoofing mitigated. |
| `org.apache.pdfbox:pdfbox` | 3.0.3 | `revenue` | PDF manipulation and signature embedding. | Secure 3.x release; ensure memory limit configurations are set. |
| `org.springdoc:springdoc-openapi-starter-webmvc-ui` | 2.6.0 | Microservices | API specification generation. | Restrict public exposure in production profiles (`springdoc.swagger-ui.enabled=false`). |

---

## 4. Remediation Recommendations for DevOps Pipeline

1. **Incorporate Dependency-Check in CI/CD:**
   Add OWASP Dependency-Check Maven plugin to root parent POM:
   ```xml
   <plugin>
       <groupId>org.owasp</groupId>
       <artifactId>dependency-check-maven</artifactId>
       <version>10.0.4</version>
       <configuration>
           <failBuildOnCVSS>7.0</failBuildOnCVSS>
       </configuration>
   </plugin>
   ```
2. **Automate NPM Auditing:**
   Integrate `npm audit --audit-level=high` into frontend build scripts.
3. **Migrate Client Export from `xlsx` to `exceljs`:**
   Eliminate residual prototype pollution advisories by swapping `xlsx` for `exceljs` in `NodalInfoCards.tsx` and `DepartmentAvailabilityModal.tsx`.
