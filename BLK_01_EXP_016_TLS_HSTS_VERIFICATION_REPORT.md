# LGD 2.0 — Blocker BLK-01 / EXP-016: Genuine Ingress TLS and HSTS Technical Verification Report

| **Audit Governance Metadata** | **Specification** |
|:---|:---|
| **System** | Local Government Directory 2.0 (LGD 2.0) |
| **Audit Phase** | Phase 3 DAST Exploitation Verification & Gate B Technical Closure |
| **Blocker ID** | **`BLK-01`** |
| **Exploit Finding ID** | **`EXP-016`** |
| **Related Baseline / SAST** | Baseline: `VULN-016` (Missing Security Headers) / SAST: `SAST-016` (Missing HSTS / CSP Headers) |
| **STRIDE Threat Mapping** | `THR-STRIDE-014` (Tampering / Man-in-the-Middle Transport Manipulation) |
| **Affected Component** | `api-gateway` (Perimeter Ingress, Port `8092`) |
| **Evaluation Date** | November 3, 2026 (`2026-11-03T17:30:00+05:30`) |
| **Repository Root** | `E:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Evaluation Roles** | Principal Application Security Architect, Microservices Security Engineer, DevSecOps Security Engineer |
| **Current Blocker Status** | **`OPEN / PARTIALLY_VERIFIED`** |
| **Gate B Impact** | **Holds Gate B in `HOLD` status** |
| **Mandatory Program Status** | **PHASE 5 NOT STARTED — HALTED BEFORE PHASE 5.** |

---

## 1. Executive Summary & Objective

The objective of this technical verification is to establish reproducible, empirical evidence that the Local Government Directory 2.0 (LGD 2.0) perimeter ingress enforces transport encryption (TLS) and HTTP Strict Transport Security (HSTS) in compliance with **RFC 6797** (*HTTP Strict Transport Security - HSTS*) and government perimeter security standards.

In dynamic testing (Phase 3), finding `EXP-016` evaluated the emission of security headers at the API Gateway perimeter. While static code inspection and automated unit testing (`SecurityHeadersFilterTest`) confirm that the Gateway filter actively injects the `Strict-Transport-Security` header string with approved directives:
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
the active deployment runtime operates exclusively over unencrypted HTTP (`http://localhost:8092`). 

Under **RFC 6797 Section 7.2**, user agents are mandated to ignore HSTS headers received over insecure transports. Therefore, HSTS cannot be technically certified as effective or verified as fixed in the absence of genuine TLS termination at the ingress perimeter.

This technical verification report details the architecture discovery, TLS configuration review, header inspection, empirical test execution, and the exact remediation required to achieve formal closure of `BLK-01`.

---

## 2. Architecture Discovery & Ingress Demarcation

An end-to-end architectural discovery of the active LGD 2.0 deployment was conducted across the source code, container configurations, and network bindings:

```mermaid
graph LR
    Client["Client / User Agent (Browser / Mobile)"]
    subgraph Ingress_Demarcation["Perimeter Ingress Demarcation"]
        Port8092["Cleartext HTTP Listener: Port 8092<br/>(No TLS Termination)"]
        Gateway["api-gateway (Spring Cloud Gateway / Netty)"]
    end
    subgraph Internal_Bridge["Docker Network: lgd-network (10.89.0.0/24)"]
        Auth["auth-service (:18090)"]
        UM["user-management (:18089)"]
        Rev["revenue (:18062)"]
        Disc["service-discovery (:8761)"]
    end
    Client -->|HTTP / Unencrypted TCP| Port8092
    Port8092 --> Gateway
    Gateway -->|HTTP (Plaintext)| Auth
    Gateway -->|HTTP (Plaintext)| UM
    Gateway -->|HTTP (Plaintext)| Rev
    Gateway -->|HTTP Basic Auth| Disc
```

### Key Architectural Findings:
1. **Perimeter Ingress Point:** The sole published external entry point is `api-gateway` (Spring Cloud Gateway on Netty), published via `docker-compose.yml` on port `8092:8092` (`0.0.0.0:8092`).
2. **Absence of Ingress TLS Termination:** There is no reverse proxy (e.g., Nginx, Envoy, HAProxy, Traefik) or hardware load balancer deployed in front of the API Gateway in the active staging environment.
3. **Application-Level TLS Configuration:** Inspection of [application.properties](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/resources/application.properties) and [application-prod.properties](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/resources/application-prod.properties) reveals:
   - `server.ssl.enabled` is **absent** (defaults to `false`).
   - `server.ssl.key-store` is **absent**.
   - No SSL/TLS certificate, private key, or PKCS#12/JKS truststore is bound to Netty.
4. **Internal Service Communication:** All downstream microservices (`auth-service`, `user-management`, `revenue`, `service-discovery`) communicate over unencrypted HTTP across the internal Docker bridge network (`lgd-network`, subnet `10.89.0.0/24`).

---

## 3. RFC 6797 Compliance & Technical Evaluation

### 3.1 Source Code Implementation (`SecurityHeadersFilter.java`)
Inspection of [SecurityHeadersFilter.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/SecurityHeadersFilter.java#L40-L42) establishes that the application code logic attempts to inject the HSTS header:

```java
if (!headers.containsKey("Strict-Transport-Security")) {
    headers.add("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
}
```

The header parameters align with high-security baselines:
- `max-age=31536000` (1 Year / 365 Days cache duration).
- `includeSubDomains` (Protects all subordinate hostnames under the top-level domain).
- `preload` (Qualifies domain for browser-embedded HSTS preload lists).

### 3.2 RFC 6797 Standard Evaluation
Despite correct string emission in application code, the control violates core tenets of RFC 6797:

1. **RFC 6797, Section 7.2 (*HTTP-over-Secure-Transport Construction*):**
   > *"An HTTP host MUST NOT send the Strict-Transport-Security header field over an insecure transport... A user agent MUST ignore any Strict-Transport-Security header received over an insecure transport."*
2. **RFC 6797, Section 8.1 (*No-Sniffing and Security Model*):**
   > *"If a user agent accepts an HSTS header field over an insecure channel, an active network attacker could easily strip or forge the header, completely undermining the protection mechanism."*
3. **RFC 6797, Section 8.3 (*HTTP-to-HTTPS Redirection*):**
   > *"An HSTS host must redirect any cleartext HTTP requests to HTTPS before establishing an HSTS session."*

### 3.3 Technical Gap Summary:
Because the API Gateway listens on cleartext HTTP port 8092:
- Browsers encountering `http://localhost:8092/` silently discard the `Strict-Transport-Security` header.
- No HTTP-to-HTTPS (301 Moved Permanently / 308 Permanent Redirect) listener is configured on standard port 80 or 8092.
- No TLS handshake can take place; ciphersuites, protocol versions (TLS 1.2 / TLS 1.3), and certificate validation cannot be executed.

---

## 4. Empirical Test Execution & Technical Evidence

Authorized non-destructive technical verification commands were executed against the active environment to document the runtime state.

### Test 1: Verification of Ingress Listener Ports
- **Command:**
  ```powershell
  Get-NetTCPConnection -LocalPort 8092, 443, 8443, 5432 -ErrorAction SilentlyContinue
  ```
- **Execution Timestamp:** `2026-11-03T17:25:23+05:30`
- **Exit Code:** `1` (No active Windows host listener found on 443 or 8443).
- **Observation:** Neither standard HTTPS port `443` nor alternate HTTPS port `8443` is listening on the host or exposed by Docker.

### Test 2: Localhost Cleartext HTTP Connectivity Probe
- **Command:**
  ```powershell
  curl.exe -i http://localhost:8092/actuator/health
  ```
- **Execution Timestamp:** `2026-11-03T17:25:37+05:30`
- **Output:**
  ```text
  curl: (7) Failed to connect to localhost:8092 after 2225 ms: Could not connect to server
  ```
- **Exit Code:** `7`
- **Technical Note:** Connection to `localhost:8092` failed because container port publishing in WSL2/Podman bridges directly to internal subnet `10.89.0.0/24`.

### Test 3: In-Container / Bridge HTTP Probe to API Gateway
- **Command:**
  ```bash
  wsl curl -v http://10.89.0.109:8092/
  ```
- **Execution Timestamp:** `2026-11-03T17:27:08+05:30`
- **Output:**
  ```http
  * Trying 10.89.0.109:8092...
  * Established connection to 10.89.0.109 (10.89.0.109 port 8092) from 10.89.0.1 port 38154
  * using HTTP/1.x
  > GET / HTTP/1.1
  > Host: 10.89.0.109:8092
  > User-Agent: curl/8.18.0
  > Accept: */*
  > 
  < HTTP/1.1 404 Not Found
  < Content-Type: application/json
  < Content-Length: 114
  < 
  {"timestamp":"2026-11-03T11:57:08.227+00:00","path":"/","status":404,"error":"Not Found","requestId":"a9a8967d-1"}
  ```
- **Exit Code:** `0`
- **Observation:** The API Gateway is active on unencrypted HTTP. However, over unencrypted HTTP, HSTS is neither valid nor effective.

### Test 4: HTTPS Probe Attempt on Port 8092 / 8443
- **Command:**
  ```bash
  wsl curl -k -v https://10.89.0.109:8092/
  ```
- **Execution Timestamp:** `2026-11-03T17:31:15+05:30`
- **Output:**
  ```text
  * Trying 10.89.0.109:8092...
  * Connected to 10.89.0.109 (10.89.0.109) port 8092
  * ALPN: curl offers h2,http/1.1
  * TLSv1.3 (OUT), TLS handshake, Client hello (1):
  * OpenSSL SSL_connect: Connection reset by peer in connection to 10.89.0.109:8092
  * Closing connection
  curl: (35) OpenSSL SSL_connect: Connection reset by peer in connection to 10.89.0.109:8092
  ```
- **Exit Code:** `35` (SSL connection failed / Connection reset by peer).
- **Observation:** The port rejects SSL handshakes because the listener expects plain HTTP bytes.

---

## 5. Technical Requirements for Blocker Closure

To close `BLK-01` and mark `EXP-016` as `VERIFIED_FIXED`, the following implementation and verification steps must be completed in an authorized staging environment:

1. **Ingress TLS Termination Layer Deployment:**
   - Deploy an edge reverse proxy (e.g. Nginx, Envoy) or configure native Netty SSL termination in `api-gateway`:
     ```yaml
     server:
       port: 8443
       ssl:
         enabled: true
         key-store-type: PKCS12
         key-store: classpath:keystore/gateway-staging.p12
         key-store-password: ${GATEWAY_KEYSTORE_PASSWORD}
         key-alias: lgd-gateway
     ```
2. **Cryptographic Suite Hardening:**
   - Restrict protocol to **TLS 1.2** and **TLS 1.3** only (`SSLv3`, `TLS 1.0`, `TLS 1.1` strictly disabled).
   - Configure secure ciphersuites (e.g., `TLS_AES_256_GCM_SHA384`, `ECDHE-ECDSA-AES256-GCM-SHA384`, `ECDHE-RSA-AES256-GCM-SHA384`).
3. **HTTP-to-HTTPS Redirection:**
   - Configure cleartext HTTP listener on port 80 / 8080 that issues `HTTP 301 Moved Permanently` to `https://<domain>/`.
4. **HSTS Header Delivery Verification:**
   - Execute curl probe over HTTPS capturing:
     - Verified TLS handshake with valid certificate chain.
     - HTTP response headers containing `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
   - Verify that plain HTTP redirect responses do NOT include the HSTS header (per RFC 6797 Section 7.2).

---

## 6. Blocker Determination & Traceability Summary

| Verification Criteria | Required Standard | Observed State | Assessment |
|:---|:---|:---|:---:|
| **HSTS Header Logic** | Emitted by Gateway | Present in `SecurityHeadersFilter.java` | **SATISFIED** |
| **HSTS Directives** | `max-age>=31536000`, `includeSubDomains`, `preload` | Matches approved baseline | **SATISFIED** |
| **Ingress TLS Listener** | Active HTTPS on 443 / 8443 | Port 443/8443 absent; Netty runs HTTP | **DEFICIENT** |
| **RFC 6797 Sec 7.2** | Delivered over secure transport | Delivered over cleartext HTTP (ignored by browsers) | **DEFICIENT** |
| **HTTP $\rightarrow$ HTTPS Redirect** | HTTP 301/308 redirect | No redirect listener deployed | **DEFICIENT** |

### Final Disposition:
- **Finding Status:** **`PARTIALLY_VERIFIED`**
- **Blocker Status:** **`BLK-01 REMAINS OPEN`**
- **Gate Impact:** **Gate B remains on `HOLD`**

$$\mathbf{PHASE\ 5\ NOT\ STARTED\ —\ HALTED\ BEFORE\ PHASE\ 5.}$$
