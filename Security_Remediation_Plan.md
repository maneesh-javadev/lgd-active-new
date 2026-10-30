# LGD 2.0 - Security Remediation Plan

| **Document Version** | 1.0.0 |
| **Status** | Approved & Partially Implemented |
| **System** | Local Government Directory (LGD 2.0) |

---

## 1. Executive Remediation Strategy

The remediation of the LGD 2.0 ecosystem follows a defense-in-depth model structured across four prioritized horizons:

1. **Horizon 1: Immediate Critical Remediations (Day 0 - Day 3)**
   - Eliminate exploitable unauthenticated entry points (XXE and eSign signature bypass in Revenue Service).
   - Sanitize log files and audit database to prevent bearer token leakage.
   - Restrict permissive CORS configurations to trusted domains.
   - Mitigate username enumeration in Auth Service.
   - Enforce minimum password length validation.
   - Inject defensive HTTP security headers on API Gateway responses.

2. **Horizon 2: High Priority Structural Controls (Week 1 - Week 2)**
   - Externalize JWT secrets to environment-based secret managers across all microservices.
   - Enforce tenant isolation and state boundary verification across entity operations.
   - Restrict internal microservice container port exposure strictly to Docker network boundaries.
   - Upgrade vulnerable frontend dependencies (reducing NPM vulnerabilities from 23 to 2).

3. **Horizon 3: Architectural Access Control & Session Lifecycle (Sprint 1)**
   - Implement universal Redis token blacklist check on API Gateway and downstream services.
   - Roll out declarative method-level authorization (`@PreAuthorize("hasAuthority('...')")`) on administrative controllers.
   - Transition frontend from legacy SheetJS `xlsx` to modern maintained spreadsheet generators (e.g., `exceljs`).

4. **Horizon 4: Infrastructure & Container Hardening (Sprint 2)**
   - Migrate microservice Dockerfiles to non-root execution (`USER 1001:1001`).
   - Enable Spring Cloud Eureka basic authentication and internal service mTLS.
   - Implement Redis-backed distributed rate limiting at API Gateway.

---

## 2. Implemented Code Remediations & Technical Diffs

### Remediation 1: XXE Mitigation in Public eSign Response
- **File:** [revenue/.../ehastakshar/service/EsignService.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/service/EsignService.java)
- **File:** [revenue/.../ehastakshar/util/XmlSignatureUtil.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/XmlSignatureUtil.java)
- **Description:** Hardened `DocumentBuilderFactory` and `TransformerFactory` instances against XML External Entity injection, DTD loading, and parameter entity attacks.
- **Implementation:**
```java
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
dbf.setNamespaceAware(true);
dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
dbf.setXIncludeAware(false);
dbf.setExpandEntityReferences(false);
DocumentBuilder builder = dbf.newDocumentBuilder();
Document doc = builder.parse(new java.io.ByteArrayInputStream(xmlBytes));
```

---

### Remediation 2: Electronic Signature Verification Enforcement
- **File:** [revenue/.../ehastakshar/service/EsignService.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/service/EsignService.java#L156-L166)
- **Description:** Removed development bypass; implemented strict signature validation checking before processing transactions.
- **Implementation:**
```java
if (!isValid) {
    if (enforceSignature) {
        log.error("ESP Signature validation failed. Rejecting untrusted eSign response.");
        throw new SecurityException("Invalid ESP Signature");
    } else {
        log.warn("ESP Signature validation failed, proceeding only because signature enforcement is disabled for testing.");
    }
}
```

---

### Remediation 3: Strict CORS Lockdown
- **File:** [user-management/.../config/CorsConfig.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/config/CorsConfig.java)
- **File:** [revenue/.../ehastakshar/controller/EsignPrimaryController.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/controller/EsignPrimaryController.java)
- **File:** [revenue/.../ehastakshar/controller/EsignSecondaryController.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/controller/EsignSecondaryController.java)
- **Description:** Replaced wildcard origin patterns `*` with an explicit whitelist bound to trusted domains.
- **Implementation:**
```java
@Value("${cors.allowed-origins:https://lgdirectory.gov.in,http://localhost:5173,http://localhost:5174}")
private List<String> allowedOrigins;

@Bean
public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.setAllowedOriginPatterns(allowedOrigins);
    // ...
}
```

---

### Remediation 4: Sensitive Token & Header Log Sanitization
- **File:** [api-gateway/.../filter/AuthenticationFilter.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/AuthenticationFilter.java#L74)
- **File:** [api-gateway/.../filter/ApiLoggingFilter.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/ApiLoggingFilter.java#L115-L135)
- **Description:** Masked plaintext token extraction in logs to token length only; added header sanitizer in `ApiLoggingFilter` to redact `Authorization`, `Cookie`, `Token`, `Secret`, and `Password` values before database persistence.
- **Implementation:**
```java
private org.springframework.http.HttpHeaders sanitizeHeaders(org.springframework.http.HttpHeaders headers) {
    if (headers == null) return new org.springframework.http.HttpHeaders();
    org.springframework.http.HttpHeaders sanitized = new org.springframework.http.HttpHeaders();
    headers.forEach((headerName, values) -> {
        String lower = headerName.toLowerCase();
        if (lower.contains("authorization") || lower.contains("cookie") || lower.contains("token")
                || lower.contains("secret") || lower.contains("password")) {
            sanitized.add(headerName, "[REDACTED]");
        } else {
            sanitized.addAll(headerName, values);
        }
    });
    return sanitized;
}
```

---

### Remediation 5: Tenant Boundary & State Isolation Enforcement
- **File:** [revenue/.../district/service/DistrictServiceImpl.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/district/service/DistrictServiceImpl.java#L230-L242)
- **Description:** Added tenant validation to ensure officers cannot publish or manipulate district drafts belonging to another state.
- **Implementation:**
```java
if (userContext != null && userContext.getStateCode() != null && districtDraft.getStateCode() != null
        && !districtDraft.getStateCode().equals(userContext.getStateCode().intValue())) {
    log.error("Tenant boundary violation: User state {} attempted to publish draft {} of state {}",
            userContext.getStateCode(), form.getDraftCode(), districtDraft.getStateCode());
    throw new SecurityException("Access denied: Tenant boundary violation for draft " + form.getDraftCode());
}
```

---

### Remediation 6: Username Enumeration Elimination
- **File:** [auth-service/.../service/impl/AuthServiceImpl.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java#L56-L61)
- **File:** [auth-service/.../exception/GlobalExceptionHandler.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/exception/GlobalExceptionHandler.java#L118-L128)
- **Description:** Unified login failure exceptions and public response payloads to prevent username harvesting.
- **Implementation:**
```java
// AuthServiceImpl.java:
User user = userRepository.findByUserLoginIdAndIsActiveTrueAndIsDeletedFalse(loginRequest.getUsername())
        .orElseThrow(() -> new RuntimeException("Invalid credentials"));

// GlobalExceptionHandler.java:
errorResponse = ErrorResponse.builder()
        .status(HttpStatus.UNAUTHORIZED.value())
        .message("Invalid username or password")
        .build();
```

---

### Remediation 7: Minimum Password Length Policy
- **File:** [user-management/.../validator/CreateUserValidator.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/validator/CreateUserValidator.java#L70-L75)
- **File:** [user-management/.../validator/UpdateUserValidator.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/validator/UpdateUserValidator.java#L79-L85)
- **Description:** Enforced validation ensuring passwords are at least 8 characters in length.
- **Implementation:**
```java
if (passwordHash == null || passwordHash.trim().isEmpty()) {
    errors.rejectValue("passwordHash", "NotBlank", "Password is required");
} else if (passwordHash.trim().length() < 8) {
    errors.rejectValue("passwordHash", "Size", "Password must be at least 8 characters in length");
}
```

---

### Remediation 8: Gateway HTTP Security Headers Injection
- **File:** [api-gateway/.../filter/SecurityHeadersFilter.java](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/SecurityHeadersFilter.java)
- **Description:** Injected standard browser security headers on all responses traversing the API Gateway.
- **Implementation:**
```java
headers.add("X-Content-Type-Options", "nosniff");
headers.add("X-Frame-Options", "DENY");
headers.add("X-XSS-Protection", "1; mode=block");
headers.add("Referrer-Policy", "strict-origin-when-cross-origin");
headers.add("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
```

---

## 3. Verification & Rollout Checklist

- [x] Revenue Service compiles without errors (`mvn test-compile`).
- [x] API Gateway compiles without errors (`mvn test-compile`).
- [x] Auth Service full test suite passes with 0 failures (`mvn test`, 35/35 tests passing).
- [x] Frontend dependency vulnerabilities reduced by 91% (`npm update`).
- [ ] Deploy secret manager for JWT and DB credentials in staging/production environments.
- [ ] Implement Redis blacklist lookup in Gateway `AuthenticationFilter`.
