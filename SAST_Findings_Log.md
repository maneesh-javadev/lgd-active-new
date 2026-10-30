# LGD 2.0 - Static Application Security Testing (SAST) & Deep Code Review Log

## Document Information
- **Project:** Local Government Directory 2.0 (LGD 2.0)
- **Phase:** Phase 2 - Static Application Security Testing (SAST) & Deep Code Review
- **Role:** Principal Application Security Engineer, Java Security Auditor & Senior Spring Boot Security Architect
- **Standards:** OWASP Top 10 (2021), OWASP API Security Top 10 (2023), CWE, CVSS v4.0, NIST SP 800-53
- **Classification:** Official Government Security Audit Log
- **Date:** October 2026
- **Status:** Complete (Audit Only - Zero Source Modifications)

---

## Section 1: Executive Summary

An exhaustive, evidence-based Static Application Security Testing (SAST) and manual Java source code security review was executed across all backend microservices of the **Local Government Directory 2.0 (LGD 2.0)** platform. 

The review analyzed **387 Java source files** and all supporting XML, properties, and build configurations across the 5 backend modules. Every finding reported in this document is backed by exact file paths, line numbers, and verbatim code evidence from the active repository.

### Key Audit Metrics
- **Total Source Files Inspected:** 405 (387 Java source files + 18 configuration/build files)
- **Total Modules Audited:** 5 backend modules (`api-gateway`, `auth-service`, `user-management`, `revenue`, `discovery`)
- **Automated SAST Tool Availability:** None pre-installed in the host environment (Semgrep, SonarQube, SpotBugs, PMD, and Checkstyle were absent). A complete, systematic manual static inspection protocol was executed in lieu of automated tooling.
- **Total Security Findings Identified:** **21 Findings** (`SAST-001` through `SAST-021`)
- **Severity Distribution:**
  - **Critical:** 7 findings (33.3%)
  - **High:** 7 findings (33.3%)
  - **Medium:** 6 findings (28.6%)
  - **Low / Informational:** 1 finding (4.8%)
- **Confirmed Secure Code Observations:** 5 critical security controls verified as properly implemented (including robust XXE parser hardening, Apache Tika magic-byte validation in government order uploads, parameterized native SQL queries, BCrypt password hashing, and gateway header redaction).

```
[Critical]     ███████ (7)
[High]         ███████ (7)
[Medium]       ██████ (6)
[Low]          █ (1)
Total Verified Findings: 21
```

---

## Section 2: Audit Scope

The static security audit comprehensively covered all production Java source code, annotations, framework configurations, and data persistence layers across the following modules:

| Module Name | Base Package | Java Source Files | Primary Role & Components Reviewed |
|:---|:---|:---:|:---|
| **api-gateway** | `in.gov.lgd.gateway` | 22 | Spring Cloud Gateway filters (`AuthenticationFilter`, `RouteValidator`, `ApiLoggingFilter`, `SecurityHeadersFilter`, `GatewayExceptionHandler`), Feign clients, and JWT token utilities. |
| **auth-service** | `in.nic.lgd.auth` | 51 | Spring Security 6 configurations, OAuth2 resource server decoders, `JwtUtil`, BCrypt password verification, login/logout controllers, and Redis token blacklist integration. |
| **user-management** | `in.nic.lgd.usermanagement` | 135 | User and role controllers, DTOs, WebDataBinder validators, Spring Data JPA repositories, native/JPQL queries, and method security configurations. |
| **revenue** | `in.nic.lgd.revenue` | 178 | Draft management, district/subdistrict/village boundary workflow controllers, file storage handlers, PDFBox processing, and CDAC e-Hastakshar XML digital signature utilities. |
| **discovery** | `in.nic.servicediscovery` | 1 | Netflix Eureka discovery server application entrypoint, registry configurations, and dependencies. |
| **Total** | — | **387** | **Complete Java backend attack surface** |

*Note: The React frontend applications (`lgd_react` and `lgd-um`) and container orchestration files (`docker-compose.yml`) were referenced solely for cross-boundary context and are formally outside the Java SAST scope.*

---

## Section 3: SAST Tool Execution

### Automated Tool Availability Check
Prior to manual code review, the host environment was interrogated for installed static analysis scanners:

```powershell
Get-Command semgrep, sonar-scanner, spotbugs, pmd, checkstyle -ErrorAction SilentlyContinue
# Result: Exit code 1 (None found in PATH)
```

- **Tool Execution Status:** Automated CLI scanners were **NOT EXECUTED** due to their absence from the host environment.
- **Rules Compliance:** In accordance with Section 11 of the audit mandate, no new external packages, dependencies, or scanning binaries were downloaded or installed. Source code was not uploaded to external cloud services.
- **Manual Static Analysis Protocol:** A rigorous, 6-point checklist-driven manual code audit was conducted covering:
  1. Input Validation & Bean Validation triggers (`@Valid`, `@Validated`)
  2. SQL/JPQL Construction & Parameterization
  3. XML Parsing & Digital Signature Verification Settings
  4. Exception Handling & Stack Trace Information Leakage
  5. Data Sanitization, DTO Mapping & Mass Assignment
  6. File Upload, MIME Verification & Path Traversal

---

## Section 4: Detailed Security Findings

---

### SAST-001: Hardcoded Static JWT HMAC Secret Key Across Microservices

- **Finding ID:** `SAST-001`
- **Title:** Hardcoded Static JWT HMAC Secret Key Across Microservices
- **Severity:** **Critical** (CVSS v4.0: 9.8 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H`)
- **Confidence:** **High**
- **Affected Module:** `api-gateway`, `auth-service`, `user-management`, `revenue`
- **Source File Path & Lines:**
  - [api-gateway/src/main/resources/application.properties#L151](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/resources/application.properties#L151)
  - [auth-service/src/main/resources/application.properties#L52](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/resources/application.properties#L52)
  - [user-management/src/main/resources/application.properties#L74](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/resources/application.properties#L74)
  - [revenue/src/main/resources/application.properties#L61](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/resources/application.properties#L61)
- **Vulnerable Method/Class:** Spring Boot property `jwt.secret` loaded by `JwtUtil.java`
- **Security Category:** Cryptographic Security / Hardcoded Secrets
- **CWE Identifier:** `CWE-798: Use of Hard-coded Credentials`
- **Description:** A static 64-byte hexadecimal string is committed directly to the configuration properties files across all four backend microservices. The same key is used to sign and verify HMAC-SHA256 JWT tokens throughout the entire ecosystem.
- **Actual Code Evidence:**
  ```properties
  # api-gateway/src/main/resources/application.properties:151
  jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
  
  # auth-service/src/main/resources/application.properties:52
  jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
  ```
- **Exploitability Explanation:** Because the secret is static and present in source control, any attacker with access to repository history, container images, or environment dumps can generate cryptographically valid JWT tokens offline with arbitrary `userId`, `roles` (`ROLE_SUPER_ADMIN`), and `privileges`, granting full administrative access to all backend APIs without authentication.
- **Potential Business Impact:** Complete platform compromise, arbitrary directory data tampering, unauthorized gazette publication, and total identity spoofing.
- **Recommended Remediation:** Migrate to asymmetric cryptography (RS256/Ed25519) where Auth Service signs tokens with a private key stored in HashiCorp Vault, and downstream services verify using only the public key.
- **Traceability:** Phase 0: `VULN-001` | Phase 1: `THR-STRIDE-001`
- **Verification Approach:** Craft an offline JWT signed with this secret and assert that API Gateway accepts the token as valid.
- **False-Positive Assessment:** Confirmed vulnerability; the secret is present in active configuration and used directly by `JwtUtil.java`.

---

### SAST-002: Hardcoded Plaintext Database Password in Configuration Files

- **Finding ID:** `SAST-002`
- **Title:** Hardcoded Plaintext Database Password in Configuration Files
- **Severity:** **Critical** (CVSS v4.0: 9.8 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H`)
- **Confidence:** **High**
- **Affected Module:** `api-gateway`, `auth-service`, `user-management`, `revenue`
- **Source File Path & Lines:**
  - [api-gateway/src/main/resources/application.properties#L7-L9](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/resources/application.properties#L7-L9)
  - [auth-service/src/main/resources/application.properties#L11-L13](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/resources/application.properties#L11-L13)
  - [user-management/src/main/resources/application.properties#L26-L28](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/resources/application.properties#L26-L28)
  - [revenue/src/main/resources/application.properties#L11-L13](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/resources/application.properties#L11-L13)
- **Vulnerable Method/Class:** Spring DataSource property `spring.datasource.password`
- **Security Category:** Hardcoded Credentials
- **CWE Identifier:** `CWE-798: Use of Hard-coded Credentials` / `CWE-259: Use of Hard-coded Password`
- **Description:** Plaintext staging/production database credentials (`postgres@206`) and internal IP addresses (`10.248.213.206:5432/lgd_new`) are committed directly to version-controlled `application.properties` files.
- **Actual Code Evidence:**
  ```properties
  ##Staging
  spring.datasource.url=jdbc:postgresql://10.248.213.206:5432/lgd_new
  spring.datasource.username=postgres
  spring.datasource.password=postgres@206
  ```
- **Exploitability Explanation:** Combined with the direct host port mapping of port 5432 in `docker-compose.yml`, an attacker on the same network or with network visibility can establish a direct `psql` connection as superuser `postgres`.
- **Potential Business Impact:** Direct exfiltration or drop of all directory tables, census records, user credentials, and gazette orders.
- **Recommended Remediation:** Inject database credentials exclusively via container environment variables (`SPRING_DATASOURCE_PASSWORD`) sourced from a secure secrets vault; never commit credentials to properties files.
- **Traceability:** Phase 0: `VULN-017` | Phase 1: `THR-STRIDE-012`
- **Verification Approach:** Attempt connection to database using the extracted credentials.
- **False-Positive Assessment:** Confirmed vulnerability.

---

### SAST-003: Hardcoded e-Hastakshar PKCS#12 Keystore Password

- **Finding ID:** `SAST-003`
- **Title:** Hardcoded e-Hastakshar PKCS#12 Keystore Password
- **Severity:** **Critical** (CVSS v4.0: 9.4 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:N/SC:H/SI:H/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `revenue`
- **Source File Path & Lines:**
  - [revenue/src/main/resources/esign.properties#L2-L3](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/resources/esign.properties#L2-L3)
- **Vulnerable Method/Class:** `revenue/src/main/resources/esign.properties`
- **Security Category:** Cryptographic Key Management / Hardcoded Credentials
- **CWE Identifier:** `CWE-798: Use of Hard-coded Credentials`
- **Description:** The PKCS#12 keystore password (`amITbPANCH@E`) used to sign outgoing government digital signature requests to CDAC is committed in plaintext in `esign.properties`.
- **Actual Code Evidence:**
  ```properties
  # eSign Configuration
  esign.keystore.path=classpath:esigncert.p12
  esign.keystore.password=amITbPANCH@E
  esign.alias=1
  ```
- **Exploitability Explanation:** If an adversary extracts `esigncert.p12` from the application JAR or container, the hardcoded password allows immediate extraction of the organization's private signing key.
- **Potential Business Impact:** Attackers can forge official e-Hastakshar digital signature requests appearing to originate from the Ministry of Panchayati Raj / LGD ASP node.
- **Recommended Remediation:** Remove password from source control; pass via environment variable or reference a hardware security module (HSM) / cloud keystore.
- **Traceability:** Phase 0: `VULN-017` | Phase 1: `THR-STRIDE-003`
- **Verification Approach:** Load `esigncert.p12` using the password in keytool.
- **False-Positive Assessment:** Confirmed vulnerability.

---

### SAST-004: Explicit Disabling of XML Digital Signature Secure Validation (`secureValidation: FALSE`)

- **Finding ID:** `SAST-004`
- **Title:** Explicit Disabling of XML Digital Signature Secure Validation (`secureValidation: FALSE`)
- **Severity:** **Critical** (CVSS v4.0: 9.6 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `revenue`
- **Source File Path & Lines:**
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/XmlSignatureUtil.java#L146-L148](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/XmlSignatureUtil.java#L146-L148)
- **Vulnerable Method/Class:** `XmlSignatureUtil.verifyXmlSignature(String signedXml)`
- **Security Category:** Cryptographic Verification Bypass / XML Security
- **CWE Identifier:** `CWE-347: Improper Verification of Cryptographic Signature`
- **Description:** `DOMValidateContext` explicitly sets the `org.jcp.xml.dsig.secureValidation` property to `Boolean.FALSE`. This disables critical Java XMLDSig protections against XML Signature Wrapping (XSW) attacks, permits obsolete/broken digest algorithms (such as MD5 or SHA-1), and allows unbounded transform chains.
- **Actual Code Evidence:**
  ```java
  // Disable secure validation to allow rsa-sha1 algorithm
  valContext.setProperty("org.jcp.xml.dsig.secureValidation", Boolean.FALSE);
  ```
- **Exploitability Explanation:** With secure validation disabled, an attacker submitting a forged callback to `/public/v1/ehastakshar/response` can alter XML payload elements while reusing a legitimate signature from a previously signed document using XML Signature Wrapping (XSW).
- **Potential Business Impact:** Fraudulent transition of unapproved boundary proposals into legally binding published government orders.
- **Recommended Remediation:** Remove the `Boolean.FALSE` override. Mandate `Boolean.TRUE` and require SHA-256 or SHA-512 algorithms.
- **Traceability:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003`
- **Verification Approach:** Inspect DOMValidateContext properties; submit wrapped XML signature to test rejection.
- **False-Positive Assessment:** Confirmed vulnerability with explicit code evidence.

---

### SAST-005: Untrusted Certificate Public Key Acceptance in XML Digital Signature KeySelector

- **Finding ID:** `SAST-005`
- **Title:** Untrusted Certificate Public Key Acceptance in XML Digital Signature KeySelector
- **Severity:** **Critical** (CVSS v4.0: 9.6 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:N/SC:H/SI:H/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `revenue`
- **Source File Path & Lines:**
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/X509KeySelector.java#L60-L76](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/X509KeySelector.java#L60-L76)
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/XmlSignatureUtil.java#L141-L144](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/XmlSignatureUtil.java#L141-L144)
- **Vulnerable Method/Class:** `X509KeySelector.select()`
- **Security Category:** Broken Certificate Validation / Impersonation
- **CWE Identifier:** `CWE-295: Improper Certificate Validation`
- **Description:** When `espCertPath` is not explicitly set, `XmlSignatureUtil` falls back to `X509KeySelector`. `X509KeySelector` extracts the certificate directly from the untrusted incoming XML `<KeyInfo>` element and blindly trusts its public key without verifying the certificate trust chain, expiry, or revocation against CCA India root trust anchors. Furthermore, `algEquals()` unconditionally returns `true`.
- **Actual Code Evidence:**
  ```java
  // In XmlSignatureUtil.java:
  } else {
      // Fallback to checking the XML for the certificate using the KeySelector
      valContext = new DOMValidateContext(new X509KeySelector(), nl.item(0));
  }

  // In X509KeySelector.java:
  // If we found a public key, return it. We relax the algEquals check to avoid false negatives.
  if (pk != null) {
      final PublicKey finalPk = pk;
      return new KeySelectorResult() {
          public Key getKey() {
              return finalPk;
          }
      };
  }
  static boolean algEquals(String algURI, String algName) {
      return true;
  }
  ```
- **Exploitability Explanation:** An attacker can generate a self-signed RSA key pair, create a synthetic eSign response XML with `status="1"`, sign it with their self-signed private key, embed their certificate in `<KeyInfo>`, and the validator will accept it as 100% valid.
- **Potential Business Impact:** Total bypass of digital signature authentication on legal gazette publication.
- **Recommended Remediation:** Enforce strict validation against pre-loaded CDAC / CCA India truststore certificates; reject untrusted embedded certificates in callbacks.
- **Traceability:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003`
- **Verification Approach:** Provide XML with a self-signed certificate and assert that `verifyXmlSignature` accepts it.
- **False-Positive Assessment:** Confirmed vulnerability.

---

### SAST-006: Conditional Bypass of eSign Verification via Configuration Flag

- **Finding ID:** `SAST-006`
- **Title:** Conditional Bypass of eSign Verification via Configuration Flag
- **Severity:** **High** (CVSS v4.0: 8.8 | Vector: `CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:N/VC:H/VI:H/VA:N/SC:H/SI:H/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `revenue`
- **Source File Path & Lines:**
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/service/EsignService.java#L58-L59, L159-L166](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/service/EsignService.java#L58-L59)
- **Vulnerable Method/Class:** `EsignService.processEsignResponse(String esignRespXml)`
- **Security Category:** Security Control Bypass / Insecure Fallback
- **CWE Identifier:** `CWE-347: Improper Verification of Cryptographic Signature`
- **Description:** `EsignService` contains logic that checks the boolean property `esign.enforce-signature`. When set to `false`, signature verification failures are merely logged as warnings, allowing unsigned and unverified responses to proceed through the entire signing pipeline.
- **Actual Code Evidence:**
  ```java
  @Value("${esign.enforce-signature:true}")
  private boolean enforceSignature;
  ...
  if (!isValid) {
      if (enforceSignature) {
          log.error("ESP Signature validation failed. Rejecting untrusted eSign response.");
          throw new SecurityException("Invalid ESP Signature");
      } else {
          log.warn("ESP Signature validation failed, proceeding only because signature enforcement is disabled for testing.");
      }
  }
  ```
- **Exploitability Explanation:** If a staging, QA, or misconfigured production environment has `esign.enforce-signature=false`, any caller can publish draft orders without any signature whatsoever.
- **Potential Business Impact:** Unauthorized legal gazette generation without verified electronic signature.
- **Recommended Remediation:** Completely remove the `enforceSignature` bypass flag from production builds; signature validation must be non-optional.
- **Traceability:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003`
- **Verification Approach:** Set property to false and verify unsigned response completes successfully.
- **False-Positive Assessment:** Confirmed code weakness; code demonstrates conditional security control bypass.

---

### SAST-007: Insecure Pseudo-Random Number Generator for eSign Transaction IDs

- **Finding ID:** `SAST-007`
- **Title:** Insecure Pseudo-Random Number Generator for eSign Transaction IDs
- **Severity:** **Medium** (CVSS v4.0: 6.8 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:H/VA:N/SC:L/SI:H/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `revenue`
- **Source File Path & Lines:**
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/service/EsignService.java#L93-L96](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/service/EsignService.java#L93-L96)
- **Vulnerable Method/Class:** `EsignService.initiateEsign(EsignRequestDto requestDto)`
- **Security Category:** Cryptographic Weakness / Predictable Token
- **CWE Identifier:** `CWE-338: Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG)`
- **Description:** Transaction IDs (`txnId`) are constructed using predictable timestamps concatenated with a 6-digit number generated via `java.util.Random`. `java.util.Random` is not cryptographically secure and can be predicted.
- **Actual Code Evidence:**
  ```java
  Random random = new Random();
  int randomNumber = random.nextInt(max + 1 - min) + min;
  String randomNumbers = String.valueOf(randomNumber);
  txnId = txnId + randomNumbers;
  ```
- **Exploitability Explanation:** Because the transaction ID is based on a formatted second timestamp (`yyyyMMdd-HHmmss-`) plus a linear congruential PRNG output, an attacker observing one transaction can easily predict subsequent transaction IDs, enabling callback injection attacks before legitimate ESP responses arrive.
- **Potential Business Impact:** Front-running legitimate eSign completions and injecting fraudulent responses.
- **Recommended Remediation:** Replace `java.util.Random` with `java.security.SecureRandom` or generate high-entropy UUIDv4 / 128-bit cryptographic nonces.
- **Traceability:** Phase 0: `VULN-003` | Phase 1: `THR-STRIDE-003`
- **Verification Approach:** Observe sequential `txnId` values and compute seed correlation.
- **False-Positive Assessment:** Confirmed code weakness.

---

### SAST-008: Mass Assignment / Unsafe Object Binding in User Update Endpoint

- **Finding ID:** `SAST-008`
- **Title:** Mass Assignment / Unsafe Object Binding in User Update Endpoint
- **Severity:** **Critical** (CVSS v4.0: 9.4 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H`)
- **Confidence:** **High**
- **Affected Module:** `user-management`
- **Source File Path & Lines:**
  - [user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/dto/UpdateUserDto.java#L15-L42](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/dto/UpdateUserDto.java#L15-L42)
  - [user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImpl.java#L105-L144](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImpl.java#L105-L144)
  - [user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/controller/UserController.java#L74-L83](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/controller/UserController.java#L74-L83)
- **Vulnerable Method/Class:** `UserController.updateUser()` and `UserServiceImpl.updateUser()`
- **Security Category:** Mass Assignment / Privilege Escalation
- **CWE Identifier:** `CWE-915: Improperly Controlled Modification of Dynamically-Determined Object Attributes`
- **Description:** The `UpdateUserDto` accepted by `POST /private/v1/users/update` includes sensitive administrative fields: `userId`, `passwordHash`, `specificRoleId`, `userLevel`, `isActive`, and `updatedBy`. In `UserServiceImpl`, the method updates the `User` entity directly and re-hashes and persists whatever `passwordHash` or `specificRoleId` is provided by the client.
- **Actual Code Evidence:**
  ```java
  // In UpdateUserDto.java:
  private Long userId;
  private String passwordHash;
  private Long specificRoleId;
  private String userLevel;
  private Boolean isActive;

  // In UserServiceImpl.java:
  userMapper.updateEntityFromUpdateDto(updateUserDto, user);
  if (updateUserDto.getPasswordHash() != null && !updateUserDto.getPasswordHash().trim().isEmpty()) {
      user.setPasswordHash(BCrypt.hashpw(updateUserDto.getPasswordHash(), BCrypt.gensalt()));
  }
  if (updateUserDto.getSpecificRoleId() != null) {
      // Re-assigns role in user_role_mapping table
      userRoleMappingService.createMapping(mappingDto);
  }
  ```
- **Exploitability Explanation:** Any authenticated user can issue a request to `/private/v1/users/update` containing `{"userId": 1, "specificRoleId": <SUPER_ADMIN_ROLE_ID>}` to instantly elevate their own account or take over the Superadmin account without authorization checks.
- **Potential Business Impact:** Full unauthorized administrative account takeover.
- **Recommended Remediation:** Separate user profile updates from administrative role assignment. Prohibit `passwordHash`, `roleId`, and `userLevel` in `UpdateUserDto`.
- **Traceability:** Phase 0: Conceptual gap | Phase 1: `THR-STRIDE-006`
- **Verification Approach:** Send JSON with `specificRoleId` to `/private/v1/users/update` and verify DB record changes.
- **False-Positive Assessment:** Confirmed vulnerability with direct code implementation evidence.

---

### SAST-009: Broken Object Level Authorization (BOLA / IDOR) on Draft Viewing & File Downloads

- **Finding ID:** `SAST-009`
- **Title:** Broken Object Level Authorization (BOLA / IDOR) on Draft Viewing & File Downloads
- **Severity:** **High** (CVSS v4.0: 8.6 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:H/VI:N/VA:N/SC:H/SI:N/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `revenue`
- **Source File Path & Lines:**
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/draft/controller/DraftPrimaryController.java#L49-L81](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/draft/controller/DraftPrimaryController.java#L49-L81)
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/draft/service/DistrictDraftDetailsServiceImpl.java#L21-L55](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/draft/service/DistrictDraftDetailsServiceImpl.java#L21-L55)
- **Vulnerable Method/Class:** `DraftPrimaryController.getDistrictDraftDetails()` and `downloadDraftGovtOrder()`
- **Security Category:** Authorization Bypass / BOLA / IDOR
- **CWE Identifier:** `CWE-639: Authorization Bypass Through User-Controlled Key`
- **Description:** The endpoints `/private/v1/draft/district/view/{draftCode}`, `/private/v1/draft/subdistrict/view/{draftCode}`, and `/private/v1/draft/download/{draftCode}/{entityType}` look up records purely by the integer `draftCode` supplied in the URL. There is no verification that the draft belongs to the caller's state (`userContext.getStateCode()`) or district.
- **Actual Code Evidence:**
  ```java
  @GetMapping("/district/view/{draftCode}")
  public ResponseEntity<DistrictOperationResponse> getDistrictDraftDetails(
          @PathVariable("draftCode") Integer draftCode) {
      log.info("REST request to get district draft details for draftCode: {}", draftCode);
      DistrictOperationResponse result = districtDraftDetailsService.getDistrictDraftDetails(draftCode);
      return ResponseEntity.ok(result);
  }
  ```
- **Exploitability Explanation:** A district or state officer from State 19 can increment `draftCode` to view confidential boundary proposals, officer PII (mobile numbers, designations), and download pre-publication draft gazette orders of State 27.
- **Potential Business Impact:** Unauthorized disclosure of confidential pre-gazette embargoed government orders and officer PII.
- **Recommended Remediation:** Verify that `draft.getStateCode() == userContext.getStateCode()` before returning draft details or downloadable attachments.
- **Traceability:** Phase 0: `VULN-006` | Phase 1: `THR-STRIDE-005`
- **Verification Approach:** Call endpoint using a token from State A with a `draftCode` from State B.
- **False-Positive Assessment:** Confirmed vulnerability.

---

### SAST-010: Unauthorized Draft Entity Deletion via Missing Tenant/Ownership Checks

- **Finding ID:** `SAST-010`
- **Title:** Unauthorized Draft Entity Deletion via Missing Tenant/Ownership Checks
- **Severity:** **High** (CVSS v4.0: 8.6 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:N/VI:H/VA:H/SC:N/SI:H/SA:H`)
- **Confidence:** **High**
- **Affected Module:** `revenue`
- **Source File Path & Lines:**
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/draft/controller/DraftPrimaryController.java#L95-L100](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/draft/controller/DraftPrimaryController.java#L95-L100)
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/draft/service/DraftEntityServiceImpl.java#L40-L43](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/draft/service/DraftEntityServiceImpl.java#L40-L43)
- **Vulnerable Method/Class:** `DraftPrimaryController.deleteDraftEntity()` and `DraftEntityServiceImpl.deleteDraftEntity()`
- **Security Category:** Broken Access Control / Unauthorized Deletion
- **CWE Identifier:** `CWE-284: Improper Access Control` / `CWE-639`
- **Description:** The endpoint `POST /private/v1/draft/delete/{draftCode}/{entityType}` invokes `repository.deleteDraftEntity(entityType, entityCode)`. Unlike the listing method (`getDraftEntityList`) which filters by state, the delete method passes only the `entityCode` without checking the caller's state, district, or user identity.
- **Actual Code Evidence:**
  ```java
  // DraftPrimaryController.java:95
  @PostMapping("/delete/{draftCode}/{entityType}")
  public ResponseEntity<String> deleteDraftEntity(@PathVariable("draftCode") Integer draftCode,
          @PathVariable("entityType") Character entityType) {
      log.info("REST request to delete draft entity with type: {} and code: {}", entityType, draftCode);
      return ResponseEntity.ok(draftEntityListService.deleteDraftEntity(entityType, draftCode));
  }

  // DraftEntityServiceImpl.java:40
  @Override
  public String deleteDraftEntity(Character entityType, Integer entityCode) {
      log.info("Deleting draft entity with type: {} and code: {}", entityType, entityCode);
      return repository.deleteDraftEntity(entityType, entityCode);
  }
  ```
- **Exploitability Explanation:** Any authenticated operator or nodal officer from any state can issue a POST request to delete active draft boundary proposals in any other state by enumerating integer codes.
- **Potential Business Impact:** Malicious or accidental destruction of pending government directory reorganizations across states.
- **Recommended Remediation:** Ensure `delete_draft_entity` function validates tenant context and user permissions, or query ownership in the service layer prior to invocation.
- **Traceability:** Phase 0: `VULN-006` | Phase 1: `THR-STRIDE-005`
- **Verification Approach:** Send delete request with low-privilege token for a draft owned by another state.
- **False-Positive Assessment:** Confirmed vulnerability.

---

### SAST-011: Complete Absence of Method-Level Security Annotations Across All Controllers

- **Finding ID:** `SAST-011`
- **Title:** Complete Absence of Method-Level Security Annotations Across All Controllers
- **Severity:** **Critical** (CVSS v4.0: 8.8 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H`)
- **Confidence:** **High**
- **Affected Module:** `user-management`, `revenue`, `auth-service`
- **Source File Path & Lines:**
  - [user-management/src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java#L16](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java#L16)
  - [revenue/src/main/java/in/nic/lgd/revenue/user/security/SecurityConfig.java#L16](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/user/security/SecurityConfig.java#L16)
  - Across all 8 controllers in `user-management` and 15 controllers in `revenue`
- **Vulnerable Method/Class:** Entire controller tier in both modules
- **Security Category:** Missing Authorization / Broken Access Control
- **CWE Identifier:** `CWE-862: Missing Authorization`
- **Description:** Although `@EnableMethodSecurity` is declared on `SecurityConfig` in both `user-management` and `revenue`, not a single controller method, class, or service method contains `@PreAuthorize`, `@Secured`, or `@RolesAllowed` annotations. Both security configs declare `.anyRequest().authenticated()`.
- **Actual Code Evidence:**
  A grep for `@PreAuthorize`, `@Secured`, and `@RolesAllowed` across the entire codebase returns zero matches in `user-management` and `revenue`.
- **Exploitability Explanation:** Any valid JWT token (regardless of role: operator, reader, nodal officer, or superadmin) is granted unrestricted execution rights on all administrative endpoints (e.g., publishing districts, modifying user roles, deleting drafts).
- **Potential Business Impact:** Complete collapse of the Role-Based Access Control (RBAC) hierarchy.
- **Recommended Remediation:** Annotate all administrative methods with explicit `@PreAuthorize("hasRole('ADMIN')")` or granular `@PreAuthorize("hasAuthority('PRIVILEGE_...')")` expressions.
- **Traceability:** Phase 0: `VULN-005` | Phase 1: `THR-STRIDE-018`
- **Verification Approach:** Call `/private/v1/users` or `/private/v1/publish` using a low-privilege operator token; verify HTTP 200 is returned instead of 403 Forbidden.
- **False-Positive Assessment:** Confirmed vulnerability across all 23 controllers.

---

### SAST-012: Failure to Verify Redis Token Blacklist in API Gateway and Downstream Services

- **Finding ID:** `SAST-012`
- **Title:** Failure to Verify Redis Token Blacklist in API Gateway and Downstream Services
- **Severity:** **High** (CVSS v4.0: 8.2 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:H/VI:H/VA:N/SC:H/SI:H/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `api-gateway`, `user-management`, `revenue`
- **Source File Path & Lines:**
  - [api-gateway/src/main/java/in/gov/lgd/gateway/filter/AuthenticationFilter.java#L82-L96](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/AuthenticationFilter.java#L82-L96)
  - [api-gateway/src/main/java/in/gov/lgd/gateway/util/JwtUtil.java#L31-L39](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/util/JwtUtil.java#L31-L39)
  - [user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java#L50-L52](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java#L50-L52)
- **Vulnerable Method/Class:** `AuthenticationFilter.apply()` & `JwtAuthenticationFilter.doFilterInternal()`
- **Security Category:** Broken Authentication / Session Revocation Failure
- **CWE Identifier:** `CWE-613: Insufficient Session Expiration`
- **Description:** When an officer logs out, `auth-service` stores the token's `jti` in Redis. However, neither `api-gateway` nor `user-management` nor `revenue` queries Redis during token validation. They only check HMAC signature and the expiration timestamp (valid for 24 hours).
- **Actual Code Evidence:**
  ```java
  // In api-gateway JwtUtil.java:
  public void validateToken(String token) {
      try {
          getClaims(token);
      } catch (JwtException e) {
          System.out.println("Invalid JWT: " + e.getMessage());
          throw new RuntimeException("Invalid Jwt");
      }
  }
  // Zero Redis blacklist check exists in Gateway AuthenticationFilter or downstream filters.
  ```
- **Exploitability Explanation:** A stolen or discarded token remains fully operational for up to 24 hours, even after the legitimate user clicks "Logout".
- **Potential Business Impact:** Unauthorized access via hijacked or stale sessions.
- **Recommended Remediation:** Implement a reactive Redis blacklist check in `AuthenticationFilter` at the Gateway and in microservice filters.
- **Traceability:** Phase 0: `VULN-007` | Phase 1: `THR-STRIDE-007`
- **Verification Approach:** Log out to trigger token blacklist; then use that same token to make an API call to the Gateway or Revenue service.
- **False-Positive Assessment:** Confirmed vulnerability.

---

### SAST-013: Overly Broad Public Endpoint Exclusions via Wildcard Pattern in RouteValidator

- **Finding ID:** `SAST-013`
- **Title:** Overly Broad Public Endpoint Exclusions via Wildcard Pattern in RouteValidator
- **Severity:** **High** (CVSS v4.0: 8.2 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:L/VA:N/SC:H/SI:L/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `api-gateway`
- **Source File Path & Lines:**
  - [api-gateway/src/main/java/in/gov/lgd/gateway/filter/RouteValidator.java#L49-L50](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/RouteValidator.java#L49-L50)
- **Vulnerable Method/Class:** `RouteValidator.openApiEndPoints`
- **Security Category:** Authentication Bypass / Insecure Route Matching
- **CWE Identifier:** `CWE-287: Improper Authentication`
- **Description:** `RouteValidator` defines public endpoints using greedy AntPathMatcher wildcards: `"/**/public/**"` and `"/audit/**/public/**"`. Any URI path that contains the substring `/public/` anywhere in its hierarchy is treated as unsecured and allowed through without an Authorization header.
- **Actual Code Evidence:**
  ```java
  // Public endpoints across services
  "/**/public/**",
  "/audit/**/public/**"
  ```
- **Exploitability Explanation:** If a downstream service exposes an endpoint or sub-resource containing `/public/` (or if path traversal `/audit/revenue/draft/..;/public/..` matches), the Gateway bypasses token validation entirely.
- **Potential Business Impact:** Unauthenticated access to sensitive business endpoints.
- **Recommended Remediation:** Replace greedy wildcard patterns with an explicit, exact whitelist of public URIs (e.g., `/audit/auth/public/v1/auth/login`).
- **Traceability:** Phase 0: `VULN-015` | Phase 1: `THR-STRIDE-004`
- **Verification Approach:** Test requests with `/public/` in intermediate path segments against secured routes.
- **False-Positive Assessment:** Confirmed architectural route matching weakness.

---

### SAST-014: Client IP Spoofing via Unvalidated `X-Forwarded-For` Header in Audit Logger

- **Finding ID:** `SAST-014`
- **Title:** Client IP Spoofing via Unvalidated `X-Forwarded-For` Header in Audit Logger
- **Severity:** **Medium** (CVSS v4.0: 6.8 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:H/VA:N/SC:N/SI:H/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `api-gateway`
- **Source File Path & Lines:**
  - [api-gateway/src/main/java/in/gov/lgd/gateway/filter/ApiLoggingFilter.java#L220-L227](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/ApiLoggingFilter.java#L220-L227)
- **Vulnerable Method/Class:** `ApiLoggingFilter.getClientIp(ServerHttpRequest request)`
- **Security Category:** Log Integrity / Header Manipulation
- **CWE Identifier:** `CWE-345: Insufficient Verification of Data Authenticity`
- **Description:** `ApiLoggingFilter` blindly trusts the first entry of the incoming `X-Forwarded-For` header without validating that the request arrived from a trusted reverse proxy. The extracted IP is saved directly into the audit table `ApiAccessLog` in PostgreSQL.
- **Actual Code Evidence:**
  ```java
  private String getClientIp(ServerHttpRequest request) {
      String forwarded = request.getHeaders().getFirst("X-Forwarded-For");
      if (forwarded != null && !forwarded.isBlank()) {
          return forwarded.split(",")[0].trim();
      }
      InetSocketAddress remote = request.getRemoteAddress();
      ...
  }
  ```
- **Exploitability Explanation:** An attacker can inject `X-Forwarded-For: 127.0.0.1` or arbitrary government internal IPs in every HTTP request. Forensic investigation of the audit log will attribute malicious modifications to innocent or internal IP addresses.
- **Potential Business Impact:** Falsification of statutory government audit trails; denial of repudiation.
- **Recommended Remediation:** Configure a trusted proxy count/filter or resolve the client IP from the actual TCP socket connection (`getRemoteAddress()`).
- **Traceability:** Phase 0: `VULN-008` | Phase 1: `THR-STRIDE-010`
- **Verification Approach:** Send request with forged `X-Forwarded-For` header and inspect database `client_address` column.
- **False-Positive Assessment:** Confirmed vulnerability.

---

### SAST-015: Unbounded Response Body Memory Buffering in Gateway Logging Filter

- **Finding ID:** `SAST-015`
- **Title:** Unbounded Response Body Memory Buffering in Gateway Logging Filter
- **Severity:** **High** (CVSS v4.0: 7.5 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:H/SC:N/SI:N/SA:H`)
- **Confidence:** **High**
- **Affected Module:** `api-gateway`
- **Source File Path & Lines:**
  - [api-gateway/src/main/java/in/gov/lgd/gateway/filter/ApiLoggingFilter.java#L64-L81](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/ApiLoggingFilter.java#L64-L81)
- **Vulnerable Method/Class:** `ApiLoggingFilter.filter()`
- **Security Category:** Denial of Service / Uncontrolled Memory Consumption
- **CWE Identifier:** `CWE-400: Uncontrolled Resource Consumption`
- **Description:** For every HTTP response flowing through the Gateway, `ServerHttpResponseDecorator` reads all chunks of the response stream into a `byte[]` in memory and converts it into a `String` stored in exchange attributes to log 5xx errors.
- **Actual Code Evidence:**
  ```java
  return super.writeWith(
          flux.map(dataBuffer -> {
              byte[] content = new byte[dataBuffer.readableByteCount()];
              dataBuffer.read(content);
              String responseBody = new String(content, StandardCharsets.UTF_8);
              exchange.getAttributes().put("responseBody", responseBody);
              return bufferFactory().wrap(content);
          }));
  ```
- **Exploitability Explanation:** When large files, draft reports, or large JSON responses are served downstream, the Gateway consumes heap memory proportional to the payload for every concurrent request, inducing `OutOfMemoryError` and JVM crashes.
- **Potential Business Impact:** Server crash; complete outage of Gateway for all users.
- **Recommended Remediation:** Cap buffer reading at 4KB or avoid buffering response bodies entirely in Gateway memory.
- **Traceability:** Phase 0: `VULN-018` | Phase 1: `THR-STRIDE-015`
- **Verification Approach:** Download a large file through the Gateway under high concurrency and observe JVM heap growth.
- **False-Positive Assessment:** Confirmed resource management flaw.

---

### SAST-016: Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter

- **Finding ID:** `SAST-016`
- **Title:** Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter
- **Severity:** **Medium** (CVSS v4.0: 5.3 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:L/VA:N/SC:L/SI:L/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `api-gateway`
- **Source File Path & Lines:**
  - [api-gateway/src/main/java/in/gov/lgd/gateway/filter/SecurityHeadersFilter.java#L16-L33](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/SecurityHeadersFilter.java#L16-L33)
- **Vulnerable Method/Class:** `SecurityHeadersFilter.filter()`
- **Security Category:** Missing Security Headers
- **CWE Identifier:** `CWE-693: Protection Mechanism Failure`
- **Description:** `SecurityHeadersFilter` injects `X-Content-Type-Options`, `X-Frame-Options`, and `Permissions-Policy`, but completely omits `Content-Security-Policy` (CSP) and `Strict-Transport-Security` (HSTS).
- **Actual Code Evidence:**
  ```java
  HttpHeaders headers = exchange.getResponse().getHeaders();
  if (!headers.containsKey("X-Content-Type-Options")) {
      headers.add("X-Content-Type-Options", "nosniff");
  }
  if (!headers.containsKey("X-Frame-Options")) {
      headers.add("X-Frame-Options", "DENY");
  }
  // CSP and HSTS are nowhere to be found in SecurityHeadersFilter.java
  ```
- **Exploitability Explanation:** Without HSTS, clients are vulnerable to SSL-stripping MITM attacks. Without CSP, stored or reflected XSS vulnerabilities in the frontend cannot be mitigated by the browser.
- **Potential Business Impact:** Increased susceptibility to session theft via XSS and protocol downgrade attacks.
- **Recommended Remediation:** Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` and a restrictive `Content-Security-Policy`.
- **Traceability:** Phase 0: `VULN-016` | Phase 1: `THR-STRIDE-014`
- **Verification Approach:** Inspect response headers of Gateway endpoints using `curl -I`.
- **False-Positive Assessment:** Confirmed finding.

---

### SAST-017: Missing Bean Validation Annotation (`@Valid`) on Login Request Controller

- **Finding ID:** `SAST-017`
- **Title:** Missing Bean Validation Annotation (`@Valid`) on Login Request Controller
- **Severity:** **Medium** (CVSS v4.0: 5.3 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:L/SC:N/SI:N/SA:L`)
- **Confidence:** **High**
- **Affected Module:** `auth-service`
- **Source File Path & Lines:**
  - [auth-service/src/main/java/in/nic/lgd/auth/controller/AuthSecondaryController.java#L23](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/controller/AuthSecondaryController.java#L23)
  - [auth-service/src/main/java/in/nic/lgd/auth/dto/LoginRequest.java#L8-L12](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/dto/LoginRequest.java#L8-L12)
- **Vulnerable Method/Class:** `AuthSecondaryController.login(@RequestBody LoginRequest loginRequest)`
- **Security Category:** Input Validation / Missing Validation Trigger
- **CWE Identifier:** `CWE-20: Improper Input Validation`
- **Description:** Although `LoginRequest` specifies `@NotBlank` on `username` and `password`, the controller method parameter in `AuthSecondaryController` lacks the `@Valid` or `@Validated` annotation. As a result, Spring never executes the Bean Validation annotations.
- **Actual Code Evidence:**
  ```java
  // In AuthSecondaryController.java:23
  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
      return ResponseEntity.ok(authService.login(loginRequest));
  }
  ```
- **Exploitability Explanation:** Sending empty or malformed JSON payloads (e.g., `{}`) reaches `AuthServiceImpl` without pre-validation, triggering unnecessary database calls and unhandled runtime exceptions.
- **Potential Business Impact:** Waste of database connections; vulnerability to empty credential fuzzing.
- **Recommended Remediation:** Add `@Valid` annotation to `@RequestBody LoginRequest loginRequest`.
- **Traceability:** Phase 0: `VULN-010` | Phase 1: `THR-STRIDE-016`
- **Verification Approach:** Send `{}` to `/public/v1/auth/login` and verify that Spring does not return 400 Bad Request prior to executing the service.
- **False-Positive Assessment:** Confirmed vulnerability.

---

### SAST-018: Unvalidated File Upload in eSign Initiation Endpoint

- **Finding ID:** `SAST-018`
- **Title:** Unvalidated File Upload in eSign Initiation Endpoint
- **Severity:** **High** (CVSS v4.0: 7.8 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:L/VI:H/VA:H/SC:L/SI:H/SA:H`)
- **Confidence:** **High**
- **Affected Module:** `revenue`
- **Source File Path & Lines:**
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/controller/EsignPrimaryController.java#L31-L43](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/controller/EsignPrimaryController.java#L31-L43)
  - [revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/service/EsignService.java#L69-L81](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/service/EsignService.java#L69-L81)
- **Vulnerable Method/Class:** `EsignPrimaryController.initiateEsign()` / `EsignService.initiateEsign()`
- **Security Category:** Unrestricted File Upload
- **CWE Identifier:** `CWE-434: Unrestricted Upload of File with Dangerous Type`
- **Description:** Unlike `CommonOrderValidationService`, `EsignPrimaryController` processes file uploads via `requestDto.getFile().getBytes()` without validating file size, file extension, or MIME type magic bytes before preparing the file and writing it to disk.
- **Actual Code Evidence:**
  ```java
  // In EsignService.java:
  byte[] pdfBytes = requestDto.getFile().getBytes();
  PdfSignUtil.PrepareResult prepareResult = pdfSignUtil.preparePdfForExternalSigning(pdfBytes, signerName);
  String tempPath = outputFilePath + File.separator + baseOutputFileName + dtFormat + ".pdf";
  Files.write(Paths.get(tempPath), prepareResult.preparedPdf);
  ```
- **Exploitability Explanation:** An attacker with officer credentials can upload arbitrarily large non-PDF files or malicious files, consuming disk space and CPU during PDF preparation.
- **Potential Business Impact:** Disk exhaustion and PDF processing crashes on the Revenue service host.
- **Recommended Remediation:** Route `EsignRequestDto.getFile()` through `CommonOrderValidationService` to enforce the 5MB limit and verify PDF magic bytes before processing.
- **Traceability:** Phase 0: `VULN-018` | Phase 1: `THR-STRIDE-015`
- **Verification Approach:** Upload a 20MB non-PDF file to `/private/v1/ehastakshar/initiate`.
- **False-Positive Assessment:** Confirmed finding.

---

### SAST-019: Production Exposure of Swagger / OpenAPI Interactive Documentation

- **Finding ID:** `SAST-019`
- **Title:** Production Exposure of Swagger / OpenAPI Interactive Documentation
- **Severity:** **Medium** (CVSS v4.0: 5.3 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:N/VA:N/SC:L/SI:N/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `api-gateway`, `auth-service`, `user-management`, `revenue`
- **Source File Path & Lines:**
  - [api-gateway/src/main/resources/application.properties#L51-L72](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/resources/application.properties#L51-L72)
  - [auth-service/src/main/java/in/nic/lgd/auth/security/SecurityConfig.java#L48-L50](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/security/SecurityConfig.java#L48-L50)
  - [user-management/src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java#L40](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/user/security/SecurityConfig.java#L40)
  - [revenue/src/main/java/in/nic/lgd/revenue/user/security/SecurityConfig.java#L37](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/user/security/SecurityConfig.java#L37)
- **Vulnerable Method/Class:** Springdoc configuration & SecurityConfig `permitAll()`
- **Security Category:** Information Disclosure / Reconnaissance
- **CWE Identifier:** `CWE-200: Exposure of Sensitive Information to an Unauthorized Actor`
- **Description:** Swagger UI and OpenAPI documentation endpoints (`/v3/api-docs/**`, `/swagger-ui/**`, `/audit/docs/**`) are enabled in default properties and configured with `permitAll()` across all microservices without environment or profile gating.
- **Actual Code Evidence:**
  ```properties
  springdoc.api-docs.enabled=true
  springdoc.swagger-ui.enabled=true
  springdoc.swagger-ui.path=/audit/docs
  ```
- **Exploitability Explanation:** External unauthenticated attackers can view all internal API schemas, parameter types, error formats, and endpoint inventories.
- **Potential Business Impact:** Accelerated vulnerability discovery and automated attack surface mapping.
- **Recommended Remediation:** Restrict Swagger/OpenAPI exposure to development profiles using `@Profile("!prod")` or enforce role-based access.
- **Traceability:** Phase 0: `VULN-013` | Phase 1: `THR-STRIDE-013`
- **Verification Approach:** Access `http://<host>:8092/audit/docs` in a web browser without authentication.
- **False-Positive Assessment:** Confirmed finding.

---

### SAST-020: Unauthenticated Service Discovery Operations on Netflix Eureka

- **Finding ID:** `SAST-020`
- **Title:** Unauthenticated Service Discovery Operations on Netflix Eureka
- **Severity:** **Critical** (CVSS v4.0: 9.8 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H`)
- **Confidence:** **High**
- **Affected Module:** `discovery`
- **Source File Path & Lines:**
  - [discovery/src/main/resources/application.properties#L1-L5](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/discovery/src/main/resources/application.properties#L1-L5)
  - [discovery/pom.xml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/discovery/pom.xml)
- **Vulnerable Method/Class:** `ServiceDiscoveryApplication`
- **Security Category:** Missing Authentication / Infrastructure Security
- **CWE Identifier:** `CWE-306: Missing Authentication for Critical Function`
- **Description:** The Eureka Discovery Server has no Spring Security dependency in its `pom.xml`, no security configuration class, and no authentication properties. Port 8761 accepts unauthenticated registrations and queries.
- **Actual Code Evidence:**
  ```properties
  spring.application.name=service-discovery
  server.port=8761
  eureka.client.register-with-eureka=false
  eureka.client.fetch-registry=false
  # Zero security configurations or authentication filters exist.
  ```
- **Exploitability Explanation:** Any network-adjacent attacker or container on the network can register a rogue service instance as `AUTH-SERVICE`, poisoning the Gateway's routing table to intercept user credentials.
- **Potential Business Impact:** Man-in-the-middle credential harvesting, service impersonation, and total infrastructure compromise.
- **Recommended Remediation:** Add `spring-boot-starter-security` to Eureka; enforce HTTP Basic authentication on all registry endpoints.
- **Traceability:** Phase 0: `VULN-009` / `VULN-021` | Phase 1: `THR-STRIDE-002`
- **Verification Approach:** Execute `curl -X POST http://localhost:8761/eureka/apps/ROGUE-SERVICE` and verify acceptance.
- **False-Positive Assessment:** Confirmed vulnerability.

---

### SAST-021: Exposed Test Controller in Revenue Service Production Code

- **Finding ID:** `SAST-021`
- **Title:** Exposed Test Controller in Revenue Service Production Code
- **Severity:** **Low** (CVSS v4.0: 3.5 | Vector: `CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:L/VI:N/VA:N/SC:N/SI:N/SA:N`)
- **Confidence:** **High**
- **Affected Module:** `revenue`
- **Source File Path & Lines:**
  - [revenue/src/main/java/in/nic/lgd/revenue/controller/TestController.java#L10-L44](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/controller/TestController.java#L10-L44)
- **Vulnerable Method/Class:** `TestController`
- **Security Category:** Active Debug / Dead Code
- **CWE Identifier:** `CWE-489: Active Debug Code`
- **Description:** `TestController.java` is packaged in production source code under `in.nic.lgd.revenue.controller`, exposing 5 dummy endpoints (`/api1` through `/api5`) under `/test` and `/private/v1/test`.
- **Actual Code Evidence:**
  ```java
  @RestController
  @RequestMapping({ "/private/v1/test", "/test" })
  @Slf4j
  public class TestController {
      @GetMapping({ "/api1", "/message1", "/one", "/first" })
      public ResponseEntity<String> getMessageOne() { ... }
  ```
- **Exploitability Explanation:** While the endpoints only return diagnostic status strings, dead/test code increases the attack surface and indicates a lack of build hygiene.
- **Potential Business Impact:** Information leakage regarding module names and runtime status.
- **Recommended Remediation:** Delete `TestController.java` or relocate it to `src/test/java`.
- **Traceability:** New finding in Phase 2 SAST
- **Verification Approach:** Access `GET /private/v1/test/api1`.
- **False-Positive Assessment:** Confirmed dead debug code.

---

## Section 5: Secure Code Observations

During the line-by-line review, several critical security controls were inspected and found to be **correctly implemented**, providing positive defense-in-depth:

1. **XXE Injection Protection in `EsignService` and `XmlSignatureUtil`:**
   Both [EsignService.java#L169-L177](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/service/EsignService.java#L169-L177) and [XmlSignatureUtil.java#L66-L74](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/ehastakshar/util/XmlSignatureUtil.java#L66-L74) properly harden `DocumentBuilderFactory` against XML External Entity attacks:
   ```java
   dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
   dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
   dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
   dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
   dbf.setXIncludeAware(false);
   dbf.setExpandEntityReferences(false);
   ```
   *Conclusion:* Classic XML External Entity (XXE) attacks (`CWE-611`) are effectively mitigated in both document signing and callback parsing.

2. **Multi-Layer File Validation in `CommonOrderValidationService`:**
   In [CommonOrderValidationService.java#L34-L96](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/src/main/java/in/nic/lgd/revenue/modules/governmentorder/service/CommonOrderValidationService.java#L34-L96), uploaded government order files are validated across four distinct layers:
   - File size ceiling: 5 MB (`orderFile.getSize() > 5 * 1024 * 1024`)
   - Extension whitelist: `.pdf`, `.png`, `.jpg`, `.jpeg`
   - Magic-byte inspection: Apache Tika (`tika.detect(orderFile.getInputStream())`)
   - Syntax parsing: Apache PDFBox (`Loader.loadPDF(file.getBytes()).close()`)
   *Conclusion:* Uploaded government order attachments are robustly validated against malicious file extensions and corrupted payloads.

3. **Sensitive Header Redaction in `ApiLoggingFilter`:**
   In [ApiLoggingFilter.java#L242-L257](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/src/main/java/in/gov/lgd/gateway/filter/ApiLoggingFilter.java#L242-L257), `sanitizeHeaders()` intercepts request and response headers:
   ```java
   if (lower.contains("authorization") || lower.contains("cookie") || lower.contains("token")
           || lower.contains("secret") || lower.contains("password")) {
       sanitized.add(headerName, "[REDACTED]");
   }
   ```
   *Conclusion:* Authorization headers and credentials are masked as `[REDACTED]` prior to persistence in the database access log.

4. **Parameterized Native SQL and JPQL Queries:**
   All inspected JPA repositories across `user-management` and `revenue` (e.g., `CreateDistrictRepositoryImpl`, `CreateSubdistrictRepositoryImpl`, `ChangeNameSubdistrictRepositoryImpl`, `UserRoleMappingRepository`) strictly use named parameter binding (`:p_state_code`, etc.) with `query.setParameter(...)`.
   *Conclusion:* No SQL string concatenation was discovered in JPA repositories.

5. **Strong Password Hashing with BCrypt Salt:**
   In [AuthServiceImpl.java#L59](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java#L59) and [UserServiceImpl.java#L62](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/src/main/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImpl.java#L62), passwords are verified and hashed using `org.mindrot.jbcrypt.BCrypt` with individual salt generation.

---

## Section 6: Phase 0 and Phase 1 Traceability

The table below maps each Phase 2 SAST finding to the baseline Phase 0 Vulnerability ID and Phase 1 STRIDE Threat ID:

| SAST Finding ID | Finding Title | Severity | CWE | Phase 0 Vuln Ref | Phase 1 Threat Ref | Primary Trust Boundary |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| `SAST-001` | Hardcoded Static JWT HMAC Secret Key | **Critical** | CWE-798 | `VULN-001` | `THR-STRIDE-001` | `TB-01`, `TB-02` |
| `SAST-002` | Hardcoded Database Password in Properties | **Critical** | CWE-798 | `VULN-017` | `THR-STRIDE-012` | `TB-04` |
| `SAST-003` | Hardcoded eSign PKCS#12 Keystore Password | **Critical** | CWE-798 | `VULN-017` | `THR-STRIDE-003` | `TB-07` |
| `SAST-004` | Disabled XML Signature Secure Validation | **Critical** | CWE-347 | `VULN-003` | `THR-STRIDE-003` | `TB-07` |
| `SAST-005` | Untrusted Certificate Public Key Acceptance | **Critical** | CWE-295 | `VULN-003` | `THR-STRIDE-003` | `TB-07` |
| `SAST-006` | Conditional eSign Bypass Flag | **High** | CWE-347 | `VULN-003` | `THR-STRIDE-003` | `TB-07` |
| `SAST-007` | Insecure PRNG for Transaction IDs | **Medium** | CWE-338 | `VULN-003` | `THR-STRIDE-003` | `TB-07` |
| `SAST-008` | Mass Assignment in User Update DTO | **Critical** | CWE-915 | `VULN-004` | `THR-STRIDE-006` | `TB-03` |
| `SAST-009` | BOLA / IDOR on Draft View & Download | **High** | CWE-639 | `VULN-006` | `THR-STRIDE-005` | `TB-03` |
| `SAST-010` | Unauthorized Draft Deletion via Missing Checks | **High** | CWE-284 | `VULN-006` | `THR-STRIDE-005` | `TB-03` |
| `SAST-011` | Absence of Method-Level `@PreAuthorize` Security | **Critical** | CWE-862 | `VULN-005` | `THR-STRIDE-018` | `TB-03` |
| `SAST-012` | Failure to Verify Redis Blacklist in Gateway | **High** | CWE-613 | `VULN-007` | `THR-STRIDE-007` | `TB-02`, `TB-05` |
| `SAST-013` | Overly Broad Route Wildcard Exclusions | **High** | CWE-287 | `VULN-015` | `THR-STRIDE-004` | `TB-01` |
| `SAST-014` | Client IP Spoofing via `X-Forwarded-For` | **Medium** | CWE-345 | `VULN-008` | `THR-STRIDE-010` | `TB-01` |
| `SAST-015` | Unbounded Response Body Memory Buffering | **High** | CWE-400 | `VULN-018` | `THR-STRIDE-015` | `TB-01`, `TB-02` |
| `SAST-016` | Missing CSP and HSTS Security Headers | **Medium** | CWE-693 | `VULN-016` | `THR-STRIDE-014` | `TB-01` |
| `SAST-017` | Missing `@Valid` on Login Controller | **Medium** | CWE-20 | `VULN-010` | `THR-STRIDE-016` | `TB-01` |
| `SAST-018` | Unvalidated File Upload in eSign Initiate | **High** | CWE-434 | `VULN-018` | `THR-STRIDE-015` | `TB-01`, `TB-07` |
| `SAST-019` | Swagger / OpenAPI Exposed in Production | **Medium** | CWE-200 | `VULN-013` | `THR-STRIDE-013` | `TB-01` |
| `SAST-020` | Unauthenticated Eureka Discovery Service | **Critical** | CWE-306 | `VULN-009` | `THR-STRIDE-002` | `TB-06` |
| `SAST-021` | Exposed Test Controller in Production Code | **Low** | CWE-489 | New | New | `TB-01` |

---

## Section 7: Vulnerability Mapping Discrepancies

During reconciliation between the Phase 0 baseline (`Vulnerability_Master_Register.md`) and the Phase 1 STRIDE register (`STRIDE_Threat_Register.xlsx` / `STRIDE_Threat_Register.md`), **mapping discrepancies** were discovered. To maintain audit integrity without renumbering existing artifacts, the discrepancies are documented below:

| Threat / Topic | Phase 0 Baseline ID | Phase 1 Mapped ID | Reconciliation Analysis | Correct Baseline Mapping |
|:---|:---:|:---:|:---|:---:|
| **eSign Signature Verification Bypass** | `VULN-003` | `VULN-006` | Phase 1 associated eSign callback spoofing with `VULN-006`. In Phase 0, `VULN-003` was explicitly allocated to Electronic Signature Verification Bypass. | **`VULN-003`** |
| **BOLA / IDOR on Draft Records** | `VULN-006` | `VULN-003` | Phase 1 associated BOLA with `VULN-003`. In Phase 0, `VULN-006` specifically addresses State & District Tenant Boundary Bypass (BOLA / IDOR). | **`VULN-006`** |
| **Role & Privilege Mass Assignment** | None (Conceptual gap) | `VULN-004` | Phase 1 assigned Mass Assignment to `VULN-004`. In Phase 0, `VULN-004` was Permissive CORS. Mass Assignment is a distinct finding (`SAST-008`). | **New Finding / `SAST-008`** |
| **Missing Method-Level Security** | `VULN-005` | `VULN-012` | Phase 1 associated missing `@PreAuthorize` with `VULN-012` (which in Phase 0 was Frontend Dependencies). In Phase 0, `VULN-005` is Method-Level Authorization. | **`VULN-005`** |
| **Direct Port Exposure vs Eureka** | `VULN-009` / `VULN-021` | `VULN-007` / `VULN-008` | Phase 0 combined container ports and Eureka under `VULN-009` and `VULN-021`, while Phase 1 split them into `VULN-007` (Ports) and `VULN-008` (Eureka). | **Retained as `SAST-020`** |

*Audit Direction: For Phase 2 and subsequent phases, the Phase 0 baseline assignments remain the primary historical reference. Phase 2 findings (`SAST-001` through `SAST-021`) provide unambiguous unique identifiers.*

---

## Section 8: Potential Risks Requiring Dynamic Validation (Phase 3 Inputs)

The following security hypotheses and edge cases could not be conclusively determined through static code review alone and are flagged for authorized dynamic verification in Phase 3:

1. **Authorization Cache Latency & Cascading DoS:**
   `AuthorizationServiceImpl` invokes `userManagementClient.getResourcesByPrivilegeCodes()` synchronously over HTTP for every incoming request. Dynamic load testing is required to determine whether high request rates saturate Gateway connection pools.
2. **Timing Side-Channel on User Authentication:**
   `AuthServiceImpl.login()` checks BCrypt password hash only after a user lookup succeeds. High-precision timing analysis during dynamic testing should determine whether username enumeration is practically exploitable over the network.
3. **Database Connection Starvation under Multipart Uploads:**
   Dynamic penetration tests must evaluate whether concurrent 10MB multipart uploads to `POST /private/v1/ehastakshar/initiate` exhaust Tomcat thread pools and HikariCP database connections.
4. **Network Path Traversal in File Attachment Resolution:**
   `FileStorageUtil.saveFile()` resolves file names using `fileTimeStamp`. Dynamic payload testing should attempt sending traversal sequences in multipart headers to confirm whether path escape is prevented by the underlying OS or Java NIO.

---

## Section 9: Remediation Recommendations

All remediations are documented for planning and Phase 10 execution; **zero code changes were applied in this audit phase**:

### Priority 1: Critical Cryptographic & Access Control Fixes
1. **Asymmetric JWT Migration (`SAST-001`, `SAST-012`):**
   Replace symmetric HMAC signing with RS256 asymmetric keys. Auth Service retains the private key; API Gateway and downstream services verify using public keys and check Redis blacklist entries.
2. **Enforce Method-Level RBAC Annotations (`SAST-011`):**
   Add `@PreAuthorize("hasRole('ADMIN')")` or `@PreAuthorize("hasAuthority('...')")` on all 23 controllers in `user-management` and `revenue`.
3. **Eliminate DTO Mass Assignment (`SAST-008`):**
   Remove `passwordHash`, `specificRoleId`, and `userLevel` from `UpdateUserDto`. Create a separate, superadmin-only role assignment endpoint.
4. **Hardened XML Digital Signature Verification (`SAST-004`, `SAST-005`, `SAST-006`):**
   Enable `secureValidation = Boolean.TRUE`, remove the `enforceSignature` bypass flag, and validate X.509 certificate chains against the official CCA India root truststore.

### Priority 2: Infrastructure & Perimeter Hardening
5. **Secure Service Discovery (`SAST-020`):**
   Add Spring Security to the Eureka server and configure HTTP Basic authentication credentials across all Eureka clients.
6. **Externalize All Passwords & Secrets (`SAST-002`, `SAST-003`):**
   Remove database passwords and keystore credentials from `application.properties` and `esign.properties`; inject them at container runtime via encrypted environment variables.
7. **Restrict Public Route Matching (`SAST-013`):**
   Replace greedy `"/**/public/**"` AntPath patterns in `RouteValidator` with explicit route mappings.

### Priority 3: Defense-in-Depth & Data Hygiene
8. **Tenant Isolation Scoping (`SAST-009`, `SAST-010`):**
   Enforce database-level tenant checks (`WHERE state_code = :stateCode`) on all draft view, download, and delete queries.
9. **Security Headers (`SAST-016`):**
   Add HSTS (`Strict-Transport-Security: max-age=31536000`) and Content-Security-Policy headers in `SecurityHeadersFilter`.
10. **Dead Code Removal (`SAST-021`):**
    Remove `TestController.java` from production revenue sources.

---

## Section 10: Phase 2 Conclusion

Phase 2 Static Application Security Testing (SAST) and manual Java security review has been successfully completed in full compliance with the audit charter:
- **Zero code or configuration modifications were executed.**
- **All 387 Java source files across 5 backend modules were inventoried and audited.**
- **21 actionable, evidence-based security findings were registered with verbatim line references.**
- **Phase 0 and Phase 1 traceability discrepancies were reconciled and documented.**
- **Secure coding patterns were identified and preserved.**

Execution is halted. Awaiting formal user approval before advancing to Phase 3.
