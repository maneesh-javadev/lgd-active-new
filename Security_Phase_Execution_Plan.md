# LGD 2.0 - Security Assessment Phase Execution Plan

| **Document Version** | 1.0.0 |
| **Audit Phase** | Phase 0: Project Discovery & Security Baseline |
| **Target System** | Local Government Directory (LGD 2.0) |
| **Execution Authority** | Senior Application Security Architect & DevSecOps Auditor |

---

## 1. Multi-Phase Assessment Framework

To execute a rigorous, auditable, and non-destructive cybersecurity evaluation of the LGD 2.0 software platform, the assessment is organized across 14 systematic phases:

```
[Phase 0: Discovery & Baseline]  --> (COMPLETED - AWAITING APPROVAL)
       │
[Phase 1: Threat Modeling & Trust Boundaries]
       │
[Phase 2: Deep Static Analysis & Code Review]
       │
[Phase 3: Dynamic Security & API Vulnerability Assessment]
       │
[Phase 4: Software Composition Analysis & Dependency Remediation]
       │
[Phase 5: Authentication & Session Security Audit]
       │
[Phase 6: Authorization, RBAC & Multi-Tenancy Boundary Audit]
       │
[Phase 7: Cryptography & Secrets Management Hardening]
       │
[Phase 8: Business Logic & eSign Workflow Security]
       │
[Phase 9: Infrastructure, Container & Network Hardening]
       │
[Phase 10: Remediation Implementation & Defensive Diffs]
       │
[Phase 11: Security Regression Testing & Metric Validation]
       │
[Phase 12: Comprehensive Audit Deliverables Finalization]
       │
[Phase 13: DevSecOps CI/CD Integration & Roadmap Sign-Off]
```

---

## 2. Phase-by-Phase Execution Details

### Phase 0: Discovery & Baseline
- **Status:** **COMPLETED** (Artifacts Generated; Awaiting Formal Approval).
- **Core Activities:** Scan repository, map module architecture, catalog 46 REST endpoints, inspect 8 configuration domains, establish baseline inventory across 23 vulnerability categories.
- **Deliverables:**
  1. `Security_Architecture_Inventory.md`
  2. `API_Endpoint_Inventory.xlsx` & `API_Endpoint_Inventory.md`
  3. `Security_Configuration_Inventory.md`
  4. `Technology_Stack_Inventory.md`
  5. `Security_Assessment_Baseline.md`
  6. `Security_Phase_Execution_Plan.md`

---

### Phase 1: Threat Modeling & Trust Boundary Analysis
- **Objectives:** Map threat actors (unauthenticated external attackers, rogue state officers, compromised internal microservices), identify attack vectors using STRIDE / DREAD methodologies.
- **Focus Areas:** Edge perimeter, e-Hastakshar external callback, multi-tenant state isolation boundaries.
- **Deliverable:** `Threat_Model_Report.md`.

---

### Phase 2: Static Application Security Testing (SAST) & Code Review
- **Objectives:** Automated and manual code inspection of all Java 21 controllers, services, repositories, validators, and filters.
- **Focus Areas:** Input validation, SQL injection / JPA parameters, XML parsing, exception handling, data sanitization.
- **Deliverable:** `SAST_Findings_Log.md`.

---

### Phase 3: Dynamic Security & API Vulnerability Assessment
- **Objectives:** Validate API endpoints against OWASP API Security Top 10 (2023) in authorized staging environment.
- **Focus Areas:** BOLA/IDOR on entity drafts, mass assignment, CORS preflight reflections, rate limiting.
- **Deliverable:** `API_Security_Assessment.md`.

---

### Phase 4: Software Composition Analysis (SCA) & Dependency Remediation
- **Objectives:** Audit Maven pom.xml and NPM package.json manifests against National Vulnerability Database (NVD) and GitHub Advisories.
- **Focus Areas:** `xlsx` prototype pollution, `vite` dev server advisories, `jbcrypt:0.4` legacy implementation.
- **Deliverable:** `Dependency_Security_Report.md`.

---

### Phase 5: Authentication & Session Security Audit
- **Objectives:** Verify JWT token lifecycle, signature strength, claims validation, revocation checks, and login protections.
- **Focus Areas:** `jwt.secret` management, Redis blacklist lookup across Gateway and downstream services, username enumeration elimination.
- **Deliverable:** `Authentication_Security_Audit.md`.

---

### Phase 6: Authorization, RBAC & Multi-Tenancy Boundary Audit
- **Objectives:** Verify role-to-privilege mapping, hierarchical state/district permission enforcement, and method-level access controls.
- **Focus Areas:** Deployment of `@PreAuthorize` on administrative endpoints, verification of `userContext.getStateCode()` ownership checks.
- **Deliverable:** `Authorization_RBAC_Report.md`.

---

### Phase 7: Cryptography & Secrets Management Hardening
- **Objectives:** Eliminate committed plaintext passwords, enforce database TLS connections, validate digital certificate keystores for eSign.
- **Focus Areas:** Externalization to environment variables / secret vaults, PKCS#12 keystore storage security.
- **Deliverable:** `Secrets_Management_Plan.md`.

---

### Phase 8: Business Logic & eSign Workflow Security
- **Objectives:** Audit multi-step revenue operations: draft creation -> attachment storage -> e-Hastakshar initiate -> ESP callback -> PDF PKCS#7 signing -> gazette publication.
- **Focus Areas:** Non-repudiation, strict cryptographic signature verification, preventing state transition tampering.
- **Deliverable:** `Business_Logic_Security_Review.md`.

---

### Phase 9: Infrastructure, Container & Network Hardening
- **Objectives:** Hardening Docker virtualization layer and container isolation.
- **Focus Areas:** Unprivileged container users (`USER spring:spring`), internal port closure on host network, Eureka authentication.
- **Deliverable:** `Infrastructure_Security_Report.md`.

---

### Phase 10: Remediation Implementation & Defensive Diffs
- **Objectives:** Execute precise, defensive code fixes across modules without breaking business logic or public API contracts.
- **Deliverable:** `Security_Remediation_Plan.md` and committed source diffs.

---

### Phase 11: Security Regression Testing & Metric Validation
- **Objectives:** Execute `mvn test` and `npm test` across all modules to verify 100% test pass rate and absence of regressions.
- **Deliverable:** `Security_Regression_Test_Report.md`.

---

### Phase 12: Comprehensive Audit Deliverables Finalization
- **Objectives:** Compile master audit report and vulnerability registers for client delivery.
- **Deliverables:** `Security_Audit_Report.md`, `Vulnerability_Master_Register.md`, `Executive_Security_Summary.md`.

---

### Phase 13: DevSecOps CI/CD Integration & Roadmap Sign-Off
- **Objectives:** Integrate automated security quality gates into future CI/CD pipelines (SAST, SCA, container scanning).
- **Deliverable:** `DevSecOps_Integration_Guide.md`.

---

## 3. Phase 0 Completion & Sign-off Checkpoint

Per assessment rules:
- **No production database records or live configurations have been damaged.**
- **Phase 0 project discovery and baseline analysis are complete.**
- **All 6 Phase 0 deliverables have been generated in the workspace root.**
- **Execution is halted pending user review and formal approval to proceed to Phase 1.**
