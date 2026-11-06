# LGD 2.0 — Blocker BLK-02 / EXP-021: Revenue TestController Census & Exposure Assessment

| **Audit Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Phase** | Phase 2 SAST Review, Phase 3 DAST Exploitation & Gate B Technical Closure |
| **Blocker ID** | **`BLK-02`** |
| **Exploit Finding ID** | **`EXP-021`** / **`EV-008`** |
| **Related SAST Finding** | `SAST-021` (Exposed Debug TestController in Production Code / CWE-489) |
| **STRIDE Threat Mapping** | `THR-STRIDE-013` (Information Disclosure) / `THR-STRIDE-018` (Elevation of Privilege) |
| **Affected Component** | `revenue` (Internal Port `18062`, `TestController.java`) |
| **Evaluation Date** | November 3, 2026 (`2026-11-03T17:32:00+05:30`) |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Evaluation Roles** | Principal Application Security Architect, Senior Java 21 / Spring Boot Security Engineer, Penetration Testing Engineer |
| **Current Blocker Status** | **`OPEN / PARTIALLY_VERIFIED`** |
| **Gate B Impact** | **Holds Gate B in `HOLD` status** |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Executive Summary & Objective

The objective of this technical assessment is to conduct a complete, evidence-backed census of all controller endpoints within the `revenue` microservice, establish the exact classification and exposure of `TestController` (`EXP-021` / `SAST-021`), and evaluate whether any unintended test, diagnostic, or debug endpoint is reachable in the production execution scope.

During preliminary penetration testing, diagnostic endpoints mapped under `/revenue/test/api1` were evaluated. While source code remediation introduced Spring profile gating (`@Profile({"dev", "test"})`) to inhibit bean instantiation in the production profile, and edge probes via the API Gateway perimeter return `HTTP 403 Forbidden` (`{"error":"Access denied: insufficient privileges"}`), audit standards dictate that:

> *"A perimeter HTTP 403 alone is not sufficient to prove downstream security. Identify whether any downstream route is reachable without the expected gateway or authorization controls."*

Because the downstream `revenue` container is currently unable to achieve steady-state runtime execution due to host database unavailability (`BLK-03`), direct in-container handler mapping verification and live internal network probing cannot be completed. 

Consequently, this assessment provides a complete source-level census of all 15 controllers in `revenue`, maps gateway routing vs. downstream exposure, identifies security defects associated with debug controllers, and details the conditions required to close blocker `BLK-02`.

---

## 2. Revenue Application Architecture & Entry Points

The `revenue` microservice is an enterprise Spring Boot application managing state, district, sub-district, village, and draft gazette operations, as well as electronic signature (e-Hastakshar) integrations.

### Application Boundaries:
- **Project Module:** `revenue/`
- **Root Java Package:** `in.nic.lgd.revenue`
- **Application Entry Point:** [RevenueApplication.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/RevenueApplication.java)
- **Base Framework:** Spring Boot `3.2.12` on Java 21 (Eclipse Temurin)
- **Internal Service Port:** `18062` (Defined in `application.properties` and `docker-compose.yml`)
- **Docker Network Isolation:** Host port `18062` is **unmapped**; reachable only via internal bridge `lgd-network`.
- **Component Scanning Scope:** Scans `in.nic.lgd.revenue` recursively, including all submodule controllers, configurations, and exception handlers.

---

## 3. Comprehensive Controller Census (Source-Level Inventory)

An exhaustive search across `revenue/src/main/java` and `revenue/src/test/java` was executed for all `@RestController`, `@Controller`, and request mapping annotations. Exactly **15 controllers** and **1 global exception advice** were identified in production source, and **0 test controllers** were found in test source.

### 3.1 Complete Controller Inventory Table

| # | Controller Class | Package Location | Class-Level `@RequestMapping` | Classification | Active Profile Constraint | Endpoint Count |
|:---:|:---|:---|:---|:---|:---:|:---:|
| 1 | `DistrictPrimaryController` | `in.nic.lgd.revenue.modules.district.controller` | `/private/v1/district` | Production Business | None (Active in All) | 7 |
| 2 | `DistrictSecondaryController` | `in.nic.lgd.revenue.modules.district.controller` | `/private/v1/district` | Production Business | None (Active in All) | 3 |
| 3 | `SubDistrictPrimaryController` | `in.nic.lgd.revenue.modules.subdistrict.controller` | `/private/v1/subdistrict` | Production Business | None (Active in All) | 6 |
| 4 | `SubDistrictSecondaryController` | `in.nic.lgd.revenue.modules.subdistrict.controller` | `/private/v1/subdistrict` | Production Business | None (Active in All) | 2 |
| 5 | `VillagePrimaryController` | `in.nic.lgd.revenue.modules.village.controller` | `/private/v1/village` | Production Business | None (Active in All) | 8 |
| 6 | `VillageSecondaryController` | `in.nic.lgd.revenue.modules.village.controller` | `/private/v1/village` | Production Business | None (Active in All) | 4 |
| 7 | `StateSecondaryController` | `in.nic.lgd.revenue.modules.state.controller` | `/private/v1/state` | Production Business | None (Active in All) | 2 |
| 8 | `DraftPrimaryController` | `in.nic.lgd.revenue.modules.draft.controller` | `/private/v1/draft` | Production Business | None (Active in All) | 5 |
| 9 | `DraftSecondaryController` | `in.nic.lgd.revenue.modules.draft.controller` | `/private/v1/draft` | Production Business | None (Active in All) | 2 |
| 10 | `EntityPublishController` | `in.nic.lgd.revenue.modules.publish.controller` | `/private/v1/publish` | Production Business | None (Active in All) | 2 |
| 11 | `GovernmentorderSecondaryController` | `in.nic.lgd.revenue.modules.governmentorder.controller` | `/private/v1/governmentorder` | Production Business | None (Active in All) | 1 |
| 12 | `LanguageController` | `in.nic.lgd.revenue.modules.common.language.controller` | `/private/v1/language` | Production Business | None (Active in All) | 1 |
| 13 | `EsignPrimaryController` | `in.nic.lgd.revenue.modules.ehastakshar.controller` | `/private/v1/ehastakshar` | Production Business / Integration | None (Active in All) | 2 |
| 14 | `EsignSecondaryController` | `in.nic.lgd.revenue.modules.ehastakshar.controller` | `/private/v1/ehastakshar` | Production Business / Integration | None (Active in All) | 1 |
| 15 | **`TestController`** | `in.nic.lgd.revenue.controller` | `{"/private/v1/test", "/test"}` | **Diagnostic / Test Only** | **`@Profile({"dev", "test"})`** | **5 (20 Aliases)** |
| — | `GlobalExceptionHandler` | `in.nic.lgd.revenue.config` | `@RestControllerAdvice` | Infrastructure / Error Handler | None (Active in All) | — |

---

## 4. In-Depth Analysis of `TestController` (`EXP-021` / `SAST-021`)

### 4.1 Source Code Structure
[TestController.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/controller/TestController.java) is located in the root controller directory of the `revenue` module:

```java
package in.nic.lgd.revenue.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.context.annotation.Profile;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping({ "/private/v1/test", "/test" })
@Profile({"dev", "test"})
@Slf4j
public class TestController {

    @GetMapping({ "/api1", "/message1", "/one", "/first" })
    public ResponseEntity<String> getMessageOne() {
        log.info("TestController: API 1 called");
        return ResponseEntity.ok("Response from API 1: Revenue service is running successfully.");
    }

    @GetMapping({ "/api2", "/message2", "/two", "/second" })
    public ResponseEntity<String> getMessageTwo() {
        log.info("TestController: API 2 called");
        return ResponseEntity.ok("Response from API 2: Revenue module status is healthy and active.");
    }

    @GetMapping({ "/api3", "/message3", "/three", "/third" })
    public ResponseEntity<String> getMessageThree() {
        log.info("TestController: API 3 called");
        return ResponseEntity.ok("Response from API 3: Welcome to Revenue management system.");
    }

    @GetMapping({ "/api4", "/message4", "/four", "/fourth" })
    public ResponseEntity<String> getMessageFour() {
        log.info("TestController: API 4 called");
        return ResponseEntity.ok("Response from API 4: Pong! Server connection established.");
    }

    @GetMapping({ "/api5", "/message5", "/five", "/fifth" })
    public ResponseEntity<String> getMessageFive() {
        log.info("TestController: API 5 called");
        return ResponseEntity.ok("Response from API 5: Verification completed successfully.");
    }
}
```

### 4.2 Endpoint Mapping Register for `TestController`
Each method defines multiple path aliases, resulting in **20 total URI paths** mapped across 2 base prefixes:

| Method | Canonical Route | Alternative Path Aliases | HTTP Method | Response Body | Method-Level Security |
|:---|:---|:---|:---:|:---|:---:|
| `getMessageOne()` | `/test/api1` | `/test/message1`, `/test/one`, `/test/first`<br/>`/private/v1/test/api1`, `/private/v1/test/message1`, etc. | `GET` | String ("Response from API 1...") | None (`@PreAuthorize` absent) |
| `getMessageTwo()` | `/test/api2` | `/test/message2`, `/test/two`, `/test/second`<br/>`/private/v1/test/api2`, `/private/v1/test/message2`, etc. | `GET` | String ("Response from API 2...") | None (`@PreAuthorize` absent) |
| `getMessageThree()` | `/test/api3` | `/test/message3`, `/test/three`, `/test/third`<br/>`/private/v1/test/api3`, `/private/v1/test/message3`, etc. | `GET` | String ("Response from API 3...") | None (`@PreAuthorize` absent) |
| `getMessageFour()` | `/test/api4` | `/test/message4`, `/test/four`, `/test/fourth`<br/>`/private/v1/test/api4`, `/private/v1/test/message4`, etc. | `GET` | String ("Response from API 4...") | None (`@PreAuthorize` absent) |
| `getMessageFive()` | `/test/api5` | `/test/message5`, `/test/five`, `/test/fifth`<br/>`/private/v1/test/api5`, `/private/v1/test/message5`, etc. | `GET` | String ("Response from API 5...") | None (`@PreAuthorize` absent) |

### 4.3 Security Defects Identified (If Instantiated)
1. **CWE-489: Active Debug Code in Production:** Diagnostic code deployed in production artifacts increases the attack surface and can reveal internal component health and operational state.
2. **Absence of Authentication / Authorization Annotations:** None of the 5 handler methods define `@PreAuthorize` or require role validation.
3. **Redundant Path Aliases:** Permissive multi-path bindings (`/first`, `/one`, `/message1`) indicate ad-hoc developer testing rather than formal API contracts.

---

## 5. Gateway Perimeter vs. Downstream Exposure Analysis

### 5.1 API Gateway Perimeter Route Configuration
In [application.properties](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/resources/application.properties#L119-L123), the API Gateway defines:

```properties
spring.cloud.gateway.routes[0].id=revenue
spring.cloud.gateway.routes[0].uri=lb://REVENUE
spring.cloud.gateway.routes[0].predicates[0]=Path=/revenue/**
spring.cloud.gateway.routes[0].filters[0]=RewritePath=/revenue/(?<segment>.*), /${segment}
```

The gateway also applies `AuthenticationFilter` as a default filter across all routes (`spring.cloud.gateway.default-filters[0]=AuthenticationFilter`).

### 5.2 Observed Perimeter Probe Results
Perimeter probes executed against the API Gateway (`http://10.89.0.109:8092/revenue/test/api1`) yielded:
1. **Unauthenticated Request:**
   - **Status:** `HTTP 401 Unauthorized`
   - **Response Payload:** `{"error":"Missing or invalid Authorization header"}`
2. **Authenticated Request (Non-Admin / Officer Token):**
   - **Status:** `HTTP 403 Forbidden`
   - **Response Payload:** `{"error":"Access denied: insufficient privileges"}`

The Gateway successfully prevents unauthorized external requests from reaching downstream routes because `/revenue/test/api1` is not in the whitelist of public paths, and no officer privilege maps to `/test/**`.

### 5.3 Downstream Container Reachability Gap
Under defense-in-depth principles:
- If an internal attacker compromises another container on `lgd-network` (e.g. `discovery` or `auth-service`), or if a gateway routing misconfiguration occurs, direct HTTP requests could be routed directly to `http://revenue:18062/test/api1`.
- In [docker-compose.yml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/docker-compose.yml#L136), `revenue` is configured with:
  ```yaml
  environment:
    SPRING_PROFILES_ACTIVE: prod
  ```
- Because `TestController.java` is annotated with `@Profile({"dev", "test"})`, Spring's condition evaluator should exclude the `testController` bean from the ApplicationContext when `prod` is active.
- When excluded, any direct HTTP probe to `http://revenue:18062/test/api1` must return **`HTTP 404 Not Found`**, proving bean non-instantiation.

---

## 6. Verification Limitation & Dependency on BLK-03

### Current Runtime Limitation:
Direct in-container testing and Spring Boot Actuator handler census (`/actuator/mappings`) could **not** be executed because:
1. The host PostgreSQL 14 service is stopped on the Windows host (`BLK-03`).
2. When the `revenue` container starts up, the Spring Boot DataSource initialization (`HikariPool`) attempts to connect to `jdbc:postgresql://host.docker.internal:5432/lgd`.
3. Connection is refused, triggering an unhandled `HikariPool-1 - Exception during pool initialization`, causing the JVM to exit with code 1.
4. Container `revenue` (`d9f41a9feba0`) is trapped in a continuous crash/restart cycle (uptime < 10 seconds).

Because the container cannot achieve steady state, neither direct HTTP curl requests on port 18062 nor live ApplicationContext handler inspections can be performed.

---

## 7. Technical Verification Requirements for Closure

To achieve full verification and close blocker `BLK-02`:

1. **Prerequisite:** Close Blocker `BLK-03` by establishing host PostgreSQL 14 connectivity so that `revenue` achieves steady-state health under `SPRING_PROFILES_ACTIVE=prod`.
2. **Downstream Direct HTTP Probe:**
   - From an adjacent container on `lgd-network` or via `docker exec`, issue a direct HTTP GET request to the Revenue service:
     ```bash
     curl -s -i http://revenue:18062/test/api1
     curl -s -i http://revenue:18062/private/v1/test/api1
     ```
   - Verify that the response returns **`HTTP 404 Not Found`** (demonstrating that no handler is registered).
3. **ApplicationContext Handler Census:**
   - Execute an authorized test or inspection verifying that `TestController` is absent from `RequestMappingHandlerMapping`:
     ```text
     Mapped URL count for TestController: 0
     Bean 'testController' present in context: false
     ```
4. **Evidence Archival:** Capture raw request/response transcripts and context mapping dumps under `EVD-REV-TESTCTRL-01`.

---

## 8. Blocker Determination & Traceability Summary

| Verification Dimension | Standard / Expectation | Observed Finding | Assessment |
|:---|:---|:---|:---:|
| **Source Census** | Complete inventory of all controllers | 15 `@RestController` classes identified and classified | **COMPLETE** |
| **TestController Gating** | `@Profile({"dev", "test"})` applied | Verified on `TestController.java:13` | **VERIFIED** |
| **Gateway Perimeter Protection** | Route blocked at perimeter | Returns HTTP 401 (no auth) / HTTP 403 (insufficient priv) | **VERIFIED** |
| **Downstream Direct Probe** | HTTP 404 on `http://revenue:18062/test/api1` | Blocked: Container crash-looping due to stopped DB | **BLOCKED** |
| **Runtime Handler Census** | Bean `testController` absent in prod | Blocked: Cannot inspect context while DB stopped | **BLOCKED** |

### Final Disposition:
- **Finding Status:** **`PARTIALLY_VERIFIED`**
- **Blocker Status:** **`BLK-02 REMAINS OPEN`**
- **Gate Impact:** **Gate B remains on `HOLD`**

$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$
