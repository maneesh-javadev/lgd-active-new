# LGD 2.0 — Phase 9.1.5: Revenue Complete 40-Route Census Final Review
## AST Mapping Verification, Spring Security Interception Dynamics & 8-Factor Runtime Acceptance

| **Review Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Document ID** | `LGD2-P9.1.5-REVENUE-40-ROUTE-CENSUS-REVIEW` |
| **Audit Phase** | Phase 9.1.5 Workstream B (DISC-P914-02, BLK-CANON-02, SAST-021, EXP-021) |
| **Controller Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new\SECURITY_AUDIT_CONTROLLER` |
| **Target Codebase** | `revenue` Microservice (`in.nic.lgd.revenue.controller.TestController`) |
| **Target Security Config**| `revenue/src/main/java/in/nic/lgd/revenue/user/security/SecurityConfig.java` |
| **Evaluators** | Senior AppSec Specialist, Lead Java Architect & Independent Security Auditor |
| **Evaluation Timestamp** | November 6, 2026 (`2026-11-06T12:45:00+05:30`) |
| **Controller Version** | 1.9.0 (Phase 9.1.5 Authoritative Baseline) |
| **Governing Blocker** | `BLK-CANON-02` (Downstream Revenue Container & TestController Reachability Census) |
| **Blocker Status** | **`DESIGN_VALIDATED / RUNTIME_VERIFICATION_PENDING`** |

---

## 1. Executive Summary & Defect Remediation Scope

In Phase 9.1.4 Step B6-01, the blueprint introduced an "Authenticated 40-Route Negative Census" to address `DISC-P913-05`. However, independent audit inspection revealed finding `DISC-P914-02`:
1. The verification rubric only specified testing the 10 primary paths (`/private/v1/test/api1`..`api5` and `/test/api1`..`api5`), erroneously claiming that testing 10 paths validated all 40 combinations.
2. The blueprint failed to provide an exhaustive, line-referenced inventory of all 40 individual route aliases.
3. The security model did not rigorously account for the filter execution order between Spring Security's `SecurityFilterChain` and Spring MVC's `DispatcherServlet`.
4. The actuator inspection versus reflection testing tradeoff was left unresolved.

This review delivers:
- An explicit, line-by-line 40-entry route inventory.
- Mathematical and architectural proof of Spring Security filter interception.
- An authoritative Actuator vs. ApplicationContext reflection decision.
- A comprehensive 8-factor runtime acceptance protocol.

---

## 2. Source-Level AST Mapping & Combinatorial Census

Inspection of `revenue/src/main/java/in/nic/lgd/revenue/controller/TestController.java`:
- **Class Annotations (Lines 11-14):**
  ```java
  @RestController
  @RequestMapping({ "/private/v1/test", "/test" })
  @Profile({"dev", "test"})
  @Slf4j
  public class TestController { ... }
  ```
- **Base Paths:** Exactly two base paths: $B_1 = \text{/private/v1/test}$, $B_2 = \text{/test}$.
- **Method-Level Endpoints:** Five controller methods ($M_1$ through $M_5$), each with four distinct URI aliases ($A_1, A_2, A_3, A_4$):
  - $M_1$: `getMessageOne()` (Lines 17-21) $\rightarrow$ `{"/api1", "/message1", "/one", "/first"}`
  - $M_2$: `getMessageTwo()` (Lines 23-27) $\rightarrow$ `{"/api2", "/message2", "/two", "/second"}`
  - $M_3$: `getMessageThree()` (Lines 29-33) $\rightarrow$ `{"/api3", "/message3", "/three", "/third"}`
  - $M_4$: `getMessageFour()` (Lines 35-39) $\rightarrow$ `{"/api4", "/message4", "/four", "/fourth"}`
  - $M_5$: `getMessageFive()` (Lines 41-45) $\rightarrow$ `{"/api5", "/message5", "/five", "/fifth"}`

Total Combinatorial Routes:
$$\text{Total Routes} = |B| \times \sum_{i=1}^{5} |A_{M_i}| = 2 \times (4 + 4 + 4 + 4 + 4) = 2 \times 20 = \mathbf{40\ Routes}$$

---

## 3. Exhaustive 40-Route Master Inventory

The table below catalogs every unique route registered in `TestController.java`:

| Route ID | Base Path | Method Mapping | Alias | Full Absolute URI | Method | Source Line | Profile Gating | Expected Authenticated Probe (JWT) | Expected Unauthenticated Probe |
|:---:|:---|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **R-01** | `/private/v1/test` | `getMessageOne` | `/api1` | `/private/v1/test/api1` | GET | L17-21 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-02** | `/private/v1/test` | `getMessageOne` | `/message1` | `/private/v1/test/message1` | GET | L17-21 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-03** | `/private/v1/test` | `getMessageOne` | `/one` | `/private/v1/test/one` | GET | L17-21 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-04** | `/private/v1/test` | `getMessageOne` | `/first` | `/private/v1/test/first` | GET | L17-21 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-05** | `/private/v1/test` | `getMessageTwo` | `/api2` | `/private/v1/test/api2` | GET | L23-27 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-06** | `/private/v1/test` | `getMessageTwo` | `/message2` | `/private/v1/test/message2` | GET | L23-27 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-07** | `/private/v1/test` | `getMessageTwo` | `/two` | `/private/v1/test/two` | GET | L23-27 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-08** | `/private/v1/test` | `getMessageTwo` | `/second` | `/private/v1/test/second` | GET | L23-27 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-09** | `/private/v1/test` | `getMessageThree` | `/api3` | `/private/v1/test/api3` | GET | L29-33 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-10** | `/private/v1/test` | `getMessageThree` | `/message3` | `/private/v1/test/message3` | GET | L29-33 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-11** | `/private/v1/test` | `getMessageThree` | `/three` | `/private/v1/test/three` | GET | L29-33 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-12** | `/private/v1/test` | `getMessageThree` | `/third` | `/private/v1/test/third` | GET | L29-33 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-13** | `/private/v1/test` | `getMessageFour` | `/api4` | `/private/v1/test/api4` | GET | L35-39 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-14** | `/private/v1/test` | `getMessageFour` | `/message4` | `/private/v1/test/message4` | GET | L35-39 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-15** | `/private/v1/test` | `getMessageFour` | `/four` | `/private/v1/test/four` | GET | L35-39 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-16** | `/private/v1/test` | `getMessageFour` | `/fourth` | `/private/v1/test/fourth` | GET | L35-39 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-17** | `/private/v1/test` | `getMessageFive` | `/api5` | `/private/v1/test/api5` | GET | L41-45 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-18** | `/private/v1/test` | `getMessageFive` | `/message5` | `/private/v1/test/message5` | GET | L41-45 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-19** | `/private/v1/test` | `getMessageFive` | `/five` | `/private/v1/test/five` | GET | L41-45 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-20** | `/private/v1/test` | `getMessageFive` | `/fifth` | `/private/v1/test/fifth` | GET | L41-45 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-21** | `/test` | `getMessageOne` | `/api1` | `/test/api1` | GET | L17-21 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-22** | `/test` | `getMessageOne` | `/message1` | `/test/message1` | GET | L17-21 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-23** | `/test` | `getMessageOne` | `/one` | `/test/one` | GET | L17-21 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-24** | `/test` | `getMessageOne` | `/first` | `/test/first` | GET | L17-21 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-25** | `/test` | `getMessageTwo` | `/api2` | `/test/api2` | GET | L23-27 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-26** | `/test` | `getMessageTwo` | `/message2` | `/test/message2` | GET | L23-27 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-27** | `/test` | `getMessageTwo` | `/two` | `/test/two` | GET | L23-27 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-28** | `/test` | `getMessageTwo` | `/second` | `/test/second` | GET | L23-27 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-29** | `/test` | `getMessageThree` | `/api3` | `/test/api3` | GET | L29-33 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-30** | `/test` | `getMessageThree` | `/message3` | `/test/message3` | GET | L29-33 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-31** | `/test` | `getMessageThree` | `/three` | `/test/three` | GET | L29-33 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-32** | `/test` | `getMessageThree` | `/third` | `/test/third` | GET | L29-33 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-33** | `/test` | `getMessageFour` | `/api4` | `/test/api4` | GET | L35-39 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-34** | `/test` | `getMessageFour` | `/message4` | `/test/message4` | GET | L35-39 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-35** | `/test` | `getMessageFour` | `/four` | `/test/four` | GET | L35-39 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-36** | `/test` | `getMessageFour` | `/fourth` | `/test/fourth` | GET | L35-39 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-37** | `/test` | `getMessageFive` | `/api5` | `/test/api5` | GET | L41-45 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-38** | `/test` | `getMessageFive` | `/message5` | `/test/message5` | GET | L41-45 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-39** | `/test` | `getMessageFive` | `/five` | `/test/five` | GET | L41-45 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |
| **R-40** | `/test` | `getMessageFive` | `/fifth` | `/test/fifth` | GET | L41-45 | OMITTED | **HTTP 404 Not Found** | **HTTP 401 Unauthorized** |

---

## 4. Spring Security Interception vs. DispatcherServlet Mechanics

```mermaid
flowchart LR
    Client["Client Probe"] --> SecFilter["SecurityFilterChain\n(JwtAuthenticationFilter)"]
    
    subgraph SpringSecurity["Spring Security Boundary"]
        SecFilter -->|Unauthenticated / No Token| EntryPoint["AuthenticationEntryPoint\n(Returns JSON HTTP 401)"]
        SecFilter -->|Valid JWT Bearer Token| Dispatcher["DispatcherServlet\n(Spring MVC Engine)"]
    end

    subgraph SpringMVC["Spring MVC Request Mapping Boundary"]
        Dispatcher --> HandlerMap["RequestMappingHandlerMapping"]
        HandlerMap -->|TestController Excluded via @Profile| NotFound["NoHandlerFoundException\n(Returns HTTP 404 Not Found)"]
        HandlerMap -->|TestController Loaded (DEFECT)| Controller["TestController.getMessage()\n(Returns HTTP 200 OK)"]
    end
```

### 4.1 The HTTP 401 Ambiguity
In `revenue/src/main/java/in/nic/lgd/revenue/user/security/SecurityConfig.java`:
- Lines 36-39 declare:
  ```java
  .authorizeHttpRequests(auth -> auth
      .requestMatchers("/public/v1/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
      .anyRequest().authenticated()
  )
  ```
- Any unauthenticated request to `/private/v1/test/**` or `/test/**` matches `.anyRequest().authenticated()`.
- The request is intercepted by Spring Security at `FilterSecurityInterceptor` and routed to `AuthenticationEntryPoint`, returning:
  `{ "statusCode": 401, "message": "Authentication token is missing. Please log in to continue." }`
- **Critical Proof:** Because this occurs before `DispatcherServlet` is invoked, an HTTP 401 response is generated **EVEN IF** `TestController` is active and fully mapped! An unauthenticated 401 proves only that Spring Security is active; it provides **zero evidence** regarding whether `TestController` was omitted from the application runtime.

### 4.2 The HTTP 404 Ambiguity
Similarly, an HTTP 404 response on an unauthenticated path can occur due to perimeter routing drops, Nginx configuration, or incorrect path prefixes. 
Therefore, **neither 401 nor 404 alone constitutes definitive proof**.

---

## 5. Architectural Actuator vs. Reflection Decision

| Evaluation Dimension | Option A: Add `spring-boot-starter-actuator` to POM | Option B: Restricted Spring ApplicationContext Reflection Test |
|:---|:---|:---|
| **Repository Mutation** | Requires editing `revenue/pom.xml` (violates read-only policy) | **Zero POM modifications**; uses standard Spring test harness |
| **Production Attack Surface** | Introduces `/actuator/*` management endpoints in production | **Zero production footprint**; executes strictly in test lifecycle |
| **Inspection Mechanism** | Queries `/actuator/mappings` over HTTP | Inspects `ApplicationContext.containsBean("testController")` and `RequestMappingHandlerMapping` directly |
| **Failure Mode** | Misconfigured actuator could expose env secrets (`THR-STRIDE-011`) | Fails build if bean or mapping exists in production profile |
| **Governance Recommendation** | REJECTED | **APPROVED AS DEFINITIVE TECHNICAL ARTIFACT** |

**Ruling:** Do NOT add `spring-boot-starter-actuator` to `revenue/pom.xml`. Adopt the Restricted Spring ApplicationContext Reflection test for CI/CD gating and combine with live authenticated JWT probes during Stage B runtime.

---

## 6. The 8-Factor Definitive Runtime Acceptance Protocol

To close `BLK-CANON-02`, 100% of the following eight factors must be verified simultaneously:

1. **Factor 1 — Source-Level AST Profile Verification:** `TestController.java` is confirmed annotated with `@Profile({"dev", "test"})`.
2. **Factor 2 — Active Profile Log Attestation:** `docker logs revenue` contains `The following 1 profile is active: "prod"`.
3. **Factor 3 — Component-Scan Boundary Analysis:** Configuration confirms `TestController` is subject to standard `@ComponentScan` and not instantiated via unconditional `@Import`.
4. **Factor 4 — ApplicationContext Bean Omission:** Spring reflection test confirms `context.containsBean("testController") == false`.
5. **Factor 5 — Handler-Mapping Census:** `RequestMappingHandlerMapping.getHandlerMethods()` contains zero entries mapped to `in.nic.lgd.revenue.controller.TestController`.
6. **Factor 6 — Authenticated 40-Route Negative Probes:** Dispatching HTTP GET requests to **all 40 routes** (R-01 through R-40) with `Authorization: Bearer <VALID_JWT>` returns `HTTP 404 Not Found`.
7. **Factor 7 — Defense-in-Depth Filter Verification:** Dispatching unauthenticated probes to test routes returns `HTTP 401 Unauthorized` via Spring Security.
8. **Factor 8 — Immutable Image Digest Match:** The running `revenue` container image digest matches the certified release manifest.

---

## 7. Audit Disposition & Blocker State

- **Finding Identifier:** `DISC-P914-02`
- **Technical Disposition:** **`DESIGN_VALIDATED`**
  - Complete 40-route inventory specified with line references.
  - Spring Security 401 filter interception proven.
  - 8-factor acceptance protocol established.
- **Governing Blocker:** `BLK-CANON-02` remains **`RUNTIME_VERIFICATION_PENDING`**.
  - Runtime probes cannot be executed until PostgreSQL is started and `revenue` achieves steady-state uptime $> 5\text{ minutes}$.

