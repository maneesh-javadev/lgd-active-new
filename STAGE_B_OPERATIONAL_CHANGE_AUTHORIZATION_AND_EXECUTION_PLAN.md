# LGD 2.0 — Stage B Operational Change Authorization and Execution Plan

**Document Status:** DRAFT — FOR FORMAL REVIEW AND APPROVAL  
**Audit Controller Version:** 1.9.0  
**Scope:** Stage B0 through Stage B7  
**Environment:** LGD 2.0 Infrastructure and Microservices  
**Production Authorization:** NOT GRANTED  
**Gate B Status:** HOLD

---

## 1. Executive Objective

This document establishes the operational change-control framework for implementing the security-hardening activities defined in the Phase 9.1.5 corrected Stage B blueprint.

The objective is to implement, verify and document the infrastructure security controls required to resolve:

- BLK-CANON-01 — Perimeter TLS ingress and HTTP port exposure.
- BLK-CANON-02 — Revenue TestController runtime endpoint census.
- BLK-CANON-03 — PostgreSQL 14 availability and security hardening.

All activities must be performed within an approved maintenance window, with documented authorization, backup evidence, rollback procedures and independent verification.

**This document is an authorization request and execution plan. It does not itself authorize operational changes.**

## 2. Current Governance Baseline

| Control | Authoritative status |
|---|---|
| Gate A | QUALIFIED_PASS (PRESERVED) |
| Gate B | HOLD |
| Gate C | PENDING_FORMAL_ACCEPTANCE |
| Stage B blueprint | APPROVED FOR SEPARATE AUTHORIZATION |
| Stage B implementation | LOCKED |
| Production deployment | NOT APPROVED |

Phase 9.1.5 design corrections must not be represented as implemented or runtime-verified controls.

## 3. Operational Change Approval Requirements

The following approvals must be obtained before execution.

| Approval authority | Responsibility | Approval |
|---|---|---|
| Enterprise Architecture Review Board | Architecture and design authorization | PENDING |
| Change Advisory Board | Operational change approval | PENDING |
| Principal Infrastructure Architect | Infrastructure and network changes | PENDING |
| Lead DBA | PostgreSQL changes and recovery | PENDING |
| DevSecOps Lead | Docker, Redis and container changes | PENDING |
| Application Technical Lead | Java, Spring Boot and application changes | PENDING |
| Security Auditor | Independent verification and evidence review | PENDING |
| CISO / DAA | Formal residual-risk acceptance under Gate C | PENDING |

No individual approval should be inferred from the Phase 9.1.5 blueprint certification.

## 4. Stage B Execution Plan

### Stage B0 — Internal PKI Provisioning

**Objective:** Prepare the internal CA and required certificates.

Activities:
- Generate or provision the approved internal CA.
- Generate PostgreSQL server certificate and private key.
- Generate Redis and Sentinel certificates.
- Validate certificate chains, SANs, expiration and key permissions.
- Verify certificate fingerprints.
- Securely store private keys and restrict access.

Acceptance criteria:
- Certificate chain validates.
- Required DNS names and IP addresses match the deployment architecture.
- Private keys have restricted access.
- Certificate inventory and SHA-256 manifest are recorded.

Rollback: Revoke or quarantine newly issued certificates as appropriate and restore the previous approved certificate state.

### Stage B1 — PostgreSQL 14 Hardening

**Objective:** Secure the Windows PostgreSQL 14 service.

Activities:
- Capture backups of PostgreSQL configuration, certificates and NTFS ACLs.
- Discover the current WSL2 network address using the approved fail-closed procedure.
- Configure restricted PostgreSQL listener addresses.
- Implement dual-stack IPv4 and IPv6 HBA policies.
- Enforce SCRAM-SHA-256 for all login-enabled roles.
- Configure PostgreSQL TLS.
- Verify the active connection through `pg_stat_ssl`.
- Validate client-side `sslmode=verify-full`.

Acceptance criteria:
- PostgreSQL starts successfully.
- No unintended physical LAN listener is exposed.
- All login-enabled roles meet the SCRAM requirement.
- TLS verification passes.
- Backup and restoration evidence is recorded.

Rollback trigger:
- Service startup failure.
- Authentication failure affecting required services.
- Unexpected network exposure.
- Certificate or private-key permission failure.

### Stage B2 — Redis Sentinel Infrastructure

**Objective:** Deploy the secured Redis and Sentinel topology.

Activities:
- Configure Redis and Sentinel authentication.
- Validate all five authentication directions.
- Deploy TLS listeners.
- Apply the approved immutable Redis image digest.
- Configure Sentinel hostname announcement and resolution.
- Deploy three Redis data nodes and three Sentinel nodes.
- Verify quorum and master discovery.

Acceptance criteria:
- Sentinel quorum is established.
- Master and replica discovery succeeds.
- No unexpected NOAUTH errors occur.
- TLS hostname verification succeeds.
- Image identity is recorded.

### Stage B3 — Application Redis Resilience

**Objective:** Implement compatible Lettuce configuration.

Activities:
- Review and remove obsolete Lettuce configuration beans where approved.
- Introduce the compatible `LettuceClientConfigurationBuilderCustomizer`.
- Preserve Spring Boot SSL auto-configuration.
- Enable automatic reconnection.
- Configure approved timeouts.
- Verify Sentinel connection properties.
- Run Maven compilation and automated tests.

Acceptance criteria:
- All affected services compile successfully.
- Relevant unit and integration tests pass.
- Redis connections use the approved TLS configuration.
- Failover reconnection is verified.

### Stage B4 — Container Hardening

**Objective:** Build and validate hardened application images.

Activities:
- Correct Docker Compose repository-root build contexts.
- Import the internal CA into the Java truststore.
- Configure non-root UID/GID 10001.
- Apply read-only filesystem restrictions where supported.
- Drop unnecessary Linux capabilities.
- Enable `no-new-privileges`.
- Validate required temporary filesystem access.

Acceptance criteria:
- All intended images build successfully.
- Internal CA is present in the Java truststore.
- Containers run under the approved non-root identity.
- Application startup and health checks pass.

### Stage B5 — Nginx TLS Ingress

**Objective:** Secure the application perimeter.

Activities:
- Deploy the approved Nginx reverse proxy.
- Configure TLS 1.3.
- Configure approved HTTP-to-HTTPS redirection.
- Apply HSTS after validating the complete subdomain impact.
- Remove public exposure of port 8092.
- Configure the default virtual host to reject unrecognized hosts.
- Verify gateway routing and application accessibility.

Acceptance criteria:
- HTTPS access succeeds with the approved certificate.
- HTTP redirects as specified.
- HSTS is returned correctly.
- Public access to port 8092 is unavailable.
- Unknown Host headers are rejected.
- No unintended public cleartext access remains.

**Rollback restriction:** Port 8092 must never be re-exposed publicly. Any emergency diagnostic binding must be restricted to loopback and separately approved.

### Stage B6 — Runtime Verification and Resilience Testing

**Objective:** Produce empirical evidence for infrastructure and application security controls.

Verification workstreams:

1. Revenue TestController — all 40 routes, authenticated JWT testing.
2. PostgreSQL — availability, listener, IPv4/IPv6, SCRAM and TLS.
3. Redis Sentinel — quorum, authentication, TLS and failover.
4. Container security — image identity, non-root execution and runtime restrictions.
5. Nginx — TLS, HSTS, redirects and port exposure.
6. Resilience — RES-01 through RES-17.

Fault injection, container termination, network partitioning, load testing and other disruptive scenarios require explicit authorization for an isolated test environment.

Acceptance criteria:
- Every applicable test has a recorded result.
- Failed tests have linked findings.
- Evidence includes timestamps and environment identification.
- No test is marked PASS without actual execution evidence.
- Rollback and recovery are tested where approved.

### Stage B7 — Final Gate B Assessment

**Objective:** Conduct independent review of all Stage B implementation evidence.

Activities:
- Reconcile all three environmental blockers.
- Review the complete evidence register.
- Verify that critical findings are resolved.
- Review failed and partially passed tests.
- Review rollback execution evidence.
- Conduct independent security assessment.
- Submit the Gate B clearance recommendation.

Gate B can only be recommended for clearance when all required implementation and runtime acceptance criteria are demonstrably satisfied.

## 5. Maintenance Window and Execution Scheduling

Exact maintenance dates and durations must be agreed by the operational owners.

| Stage | Planned window | Responsible owner | Status |
|---|---|---|---|
| B0 | To be approved | PKI / Security Team | Pending |
| B1 | To be approved | Lead DBA | Pending |
| B2 | To be approved | Infrastructure / DevSecOps | Pending |
| B3 | To be approved | Java Technical Lead | Pending |
| B4 | To be approved | DevSecOps | Pending |
| B5 | To be approved | Network / Perimeter Security | Pending |
| B6 | To be approved | QA / Security / Infrastructure | Pending |
| B7 | To be approved | Independent Audit Authority | Pending |

Do not treat planning estimates as measured downtime. Actual duration must be recorded during authorized execution.

## 6. Mandatory Pre-Execution Checklist

- [ ] Approved change request and change identifier available.
- [ ] CAB authorization obtained.
- [ ] Required technical owners assigned.
- [ ] Maintenance window confirmed.
- [ ] Environment and target hosts identified.
- [ ] Current Git working tree and existing modifications preserved.
- [ ] Configuration and database backups verified.
- [ ] Backup restoration feasibility reviewed.
- [ ] Certificates and private keys validated.
- [ ] Network and firewall impact reviewed.
- [ ] Service dependencies documented.
- [ ] Rollback owner identified.
- [ ] Monitoring and incident escalation arranged.
- [ ] Test accounts and valid JWT testing arrangements prepared.
- [ ] Security and operational acceptance criteria approved.

## 7. Mandatory Stop Conditions

Immediately stop the relevant change activity and invoke the approved incident or rollback procedure if:

1. A required backup is missing or cannot be verified.
2. A private key or credential is exposed.
3. PostgreSQL fails to start or binds to an unauthorized interface.
4. Redis Sentinel fails to achieve quorum.
5. TLS certificate or hostname validation fails.
6. Required application services become unavailable beyond the approved threshold.
7. Public cleartext access is detected.
8. Unplanned data loss or corruption occurs.
9. The change exceeds its authorized scope.
10. An unexpected security exposure is discovered.

The change owner must document the event, affected components, decision and recovery outcome.

## 8. Rollback and Recovery Governance

Each stage must have:
- A pre-change backup manifest.
- A list of affected files, services and configurations.
- A defined rollback trigger.
- A named rollback owner.
- A documented recovery procedure.
- Post-rollback verification criteria.
- Evidence of successful restoration.

Particular care is required for PostgreSQL role restoration, NTFS ACL preservation, Redis asynchronous replication and Nginx ingress rollback.

A rollback procedure that exists only in documentation must be labelled `ROLLBACK_DESIGN_ONLY`.

## 9. Evidence and Audit Requirements

All Stage B evidence must be stored under the approved audit-controller evidence structure.

Recommended structure:

`SECURITY_AUDIT_CONTROLLER/evidence/stage_b/`

Required records:
- Change authorization and approvals.
- Pre-change system inventory.
- Backup and checksum manifests.
- Certificate validation records.
- PostgreSQL hardening results.
- Redis Sentinel deployment and authentication results.
- Maven build and test results.
- Docker image and container security results.
- Nginx ingress verification.
- Revenue 40-route runtime census.
- RES-01 through RES-17 results, where authorized.
- Rollback and recovery evidence.
- Independent verification report.
- Final Gate B assessment.

Never store plaintext passwords, password hashes, private keys, access tokens or other secrets in audit evidence.

## 10. Final Gate Decision Rules

| Gate | Clearance condition |
|---|---|
| Gate A | Preserve the existing qualified pass unless new evidence requires reassessment. |
| Gate B | All mandatory infrastructure controls implemented and runtime-verified; canonical blockers resolved. |
| Gate C | Formal DAA/CISO acceptance of RR-01 through RR-11. |
| Production | Separate production deployment authorization and release approval. |

Passing Gate B does not automatically pass Gate C or authorize production deployment.

## 11. Formal Approval Record

**Change Request ID:** To be assigned  
**Planned Start:** To be approved  
**Planned End:** To be approved  
**Environment:** To be specified  
**Change Owner:** To be assigned  
**Rollback Owner:** To be assigned

| Authority | Name | Decision | Date | Signature |
|---|---|---|---|---|
| Enterprise Architecture Review Board | Pending | Pending | Pending | Pending |
| Change Advisory Board | Pending | Pending | Pending | Pending |
| Principal Infrastructure Architect | Pending | Pending | Pending | Pending |
| Lead DBA | Pending | Pending | Pending | Pending |
| DevSecOps Lead | Pending | Pending | Pending | Pending |
| Security Auditor | Pending | Pending | Pending | Pending |
| CISO / DAA | Pending | Pending | Pending | Pending |

---

## 12. Final Governance Declaration

The Phase 9.1.5 Stage B blueprint certification establishes design readiness for a separate operational authorization process.

It does not establish implementation completion, runtime verification, Gate B clearance, Gate C acceptance or production deployment approval.

**Until the required approvals are recorded, all Stage B implementation activities remain LOCKED.**

