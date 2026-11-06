const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

// 1. Update Master_Finding_Traceability_Register.xlsx
const masterHeaders = [
    "SAST ID",
    "Phase 0 ID",
    "STRIDE ID",
    "DAST ID",
    "Finding Title",
    "Severity",
    "CVSS",
    "CWE",
    "Affected Module",
    "Source Location",
    "Root Cause & Mapping Rationale",
    "Remediation Summary",
    "DAST Confirmation Status",
    "Remediation Status",
    "Retest Status"
];

const masterRows = [
    [
        "SAST-001", "VULN-001", "THR-STRIDE-001", "EXP-001 / EV-001",
        "Hardcoded Static JWT HMAC Secret Key Across Microservices",
        "Critical", 9.8, "CWE-798",
        "api-gateway, auth-service, user-management, revenue",
        "application.properties (jwt.secret)",
        "Static 64-byte HMAC secret key hardcoded in properties across all microservices without environment override support.",
        "Externalized jwt.secret to mandatory environment variable without fallback; startup validation fails closed in prod profile; prepared asymmetric RS256 migration.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-002", "VULN-017", "THR-STRIDE-012 (Amplifier)", "EXP-002 / EV-002",
        "Hardcoded Plaintext Database Password in Configuration Files",
        "Critical", 9.8, "CWE-798 / CWE-259",
        "api-gateway, auth-service, user-management, revenue",
        "application.properties (spring.datasource.password)",
        "Plaintext PostgreSQL credentials committed to repository. SAST-002 represents credential exposure (CWE-798/259), whereas THR-STRIDE-012 represents host-level network port 5432 exposure; having default credentials magnifies unauthorized access.",
        "Externalized database credentials to mandatory environment variables without hardcoded fallbacks in application.properties and docker-compose.yml; port 5432 unbound from host.",
        "PARTIALLY CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-003", "VULN-017 / VULN-003", "THR-STRIDE-003", "EXP-003 / EV-003",
        "Hardcoded e-Hastakshar PKCS#12 Keystore Password",
        "Critical", 9.8, "CWE-798",
        "revenue",
        "esign.properties (esign.keystore.password)",
        "Hardcoded keystore password permits unauthorized extraction of the CDAC signing key, enabling ASP callback and request spoofing (THR-STRIDE-003). Distinguishable from PDF hash substitution (THR-STRIDE-008).",
        "Externalized esign.keystore.password to mandatory environment variable without default fallback in esign.properties; added to .env.example template.",
        "PARTIALLY CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-004", "VULN-003", "THR-STRIDE-003", "EXP-004 / EV-004",
        "Explicit Disabling of XML Digital Signature Secure Validation",
        "Critical", 9.6, "CWE-347",
        "revenue",
        "XmlSignatureUtil.java (secureValidation)",
        "Setting secureValidation to FALSE exposes XMLDSig parser to XML Signature Wrapping (XSW), enabling attacker to forge CDAC e-Hastakshar callbacks.",
        "Enforced fac.setProperty('org.jcp.xml.dsig.secureValidation', Boolean.TRUE) unconditionally in XmlSignatureUtil.java.",
        "PARTIALLY CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-005", "VULN-003", "THR-STRIDE-003", "EXP-005 / EV-005",
        "Untrusted Certificate Public Key Acceptance in XMLDSig KeySelector",
        "Critical", 9.6, "CWE-295 / CWE-347",
        "revenue",
        "X509KeySelector.java (select)",
        "Blindly extracted embedded certificate public keys without validating certificate expiration, keyUsage, trust chain, or RSA key size, allowing untrusted self-signed signatures.",
        "Enforced trust anchor validation against configured root certificate, cert.checkValidity(), digitalSignature keyUsage bit check, and minimum RSA 2048-bit key size in X509KeySelector.java.",
        "PARTIALLY CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-006", "VULN-003", "THR-STRIDE-003", "EXP-006 / EV-006",
        "Conditional Bypass of eSign Verification via Configuration Flag",
        "High", 8.8, "CWE-347 / CWE-306",
        "revenue",
        "EsignService.java (verifyXmlSignature)",
        "Configuration flag esign.enforce-signature allowed bypassing XMLDSig verification failures, potentially accepting forged callbacks.",
        "Defaulted esign.enforce-signature to true and throw SecurityException('Invalid ESP Signature') unconditionally on any signature verification failure.",
        "PARTIALLY CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-007", "VULN-003", "THR-STRIDE-003", "EXP-007 / EV-007",
        "Insecure Pseudo-Random Number Generator for eSign Transaction IDs",
        "High", 7.5, "CWE-338",
        "revenue",
        "EsignService.java (initiateEsign)",
        "Predictable java.util.Random used to generate 6-digit transaction IDs, enabling transaction collision and predictable callback injection.",
        "Replaced java.util.Random with cryptographically secure java.security.SecureRandom with at least 64 bits of entropy.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-008", "VULN-004", "THR-STRIDE-006", "EXP-008 / EV-008",
        "Mass Assignment / Unsafe Object Binding in User Update Endpoint",
        "Critical", 9.4, "CWE-915",
        "user-management",
        "UpdateUserDto.java / UserServiceImpl.java",
        "UpdateUserDto allowed clients to submit passwordHash, roleId, userLevel, and administrative tenant parameters directly, modifying permissions in database.",
        "Created immutable DTO mappings in UserMapper ignoring sensitive fields (passwordHash, userLevel, stateCode, districtCode) and stripped role overwrite in UserServiceImpl.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-009", "VULN-006", "THR-STRIDE-005", "EXP-009 / EV-009",
        "Broken Object Level Authorization (BOLA / IDOR) on Draft Viewing & File Downloads",
        "Critical", 9.1, "CWE-639",
        "revenue",
        "DistrictDraftDetailsServiceImpl.java / GovernmentOrderServiceImpl.java",
        "Endpoints retrieved draft boundary details and government order files by integer ID without verifying whether caller belongs to draft state or district.",
        "Injected UserContext and enforced draft.getStateCode().equals(userContext.getStateCode()) and district-level scoping across draft view and download operations, returning HTTP 403 on tenant mismatch.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-010", "VULN-006", "THR-STRIDE-005", "EXP-010 / EV-010",
        "Unauthorized Draft Entity Deletion via Missing Tenant/Ownership Checks",
        "Critical", 9.1, "CWE-639 / CWE-862",
        "revenue",
        "DraftEntityServiceImpl.java (deleteDraftEntity)",
        "deleteDraftEntity deleted drafts by ID without checking whether the authenticated officer belonged to the owning state/district.",
        "Injected DistrictDraftService and verified draft.getStateCode().equals(userContext.getStateCode()), returning HTTP 403 Forbidden if officer belongs to another tenant.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-011", "VULN-005", "THR-STRIDE-018", "EXP-011 / EV-011",
        "Complete Absence of Method-Level Security Annotations Across All Controllers",
        "Critical", 8.8, "CWE-862 / CWE-285",
        "user-management, revenue, auth-service",
        "Controllers across all backend services",
        "Services relied exclusively on perimeter gateway or generic isAuthenticated() checks without fine-grained role or privilege annotations on controller methods.",
        "Added @EnableMethodSecurity(prePostEnabled = true) and implemented @PreAuthorize role and authority checks across all backend controller endpoints.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-012", "VULN-007", "THR-STRIDE-007", "EXP-012 / EV-012",
        "Failure to Verify Redis Token Blacklist in API Gateway and Downstream Services",
        "High", 8.6, "CWE-613",
        "api-gateway",
        "AuthenticationFilter.java",
        "API Gateway verified JWT signature and expiration but never checked Redis blacklist, allowing revoked or logged-out tokens to remain active until natural expiry.",
        "Added reactive Redis template in AuthenticationFilter checking blacklist:jti:<jti> on every authenticated request with configurable timeout and fail-closed 503 policy on Redis failure.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-013", "VULN-009", "THR-STRIDE-004", "EXP-013 / EV-013",
        "Overly Broad Public Endpoint Exclusions via Wildcard Pattern in RouteValidator",
        "High", 8.2, "CWE-284",
        "api-gateway",
        "RouteValidator.java",
        "Greedy pattern /**/public/** allowed path manipulation (e.g. /public/..;/private/) to bypass Gateway authentication filter.",
        "Removed greedy wildcards in RouteValidator, normalized URI paths, and rejected any request containing '..' or ';' as secured requiring authentication.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-014", "VULN-008 / VULN-014", "THR-STRIDE-009", "EXP-014 / EV-014",
        "Client IP Spoofing via Unvalidated X-Forwarded-For Header in Audit Logger",
        "Medium", 7.1, "CWE-290",
        "api-gateway",
        "ApiLoggingFilter.java",
        "Audit logger blindly trusted leftmost unvalidated X-Forwarded-For header, allowing attackers to forge origin IP addresses in audit trails (THR-STRIDE-009 Repudiation). Distinguishable from token log masking (THR-STRIDE-010).",
        "Added strict IPv4 and IPv6 regular expression validation in ApiLoggingFilter.getClientIp() and prioritized remoteAddress from TCP socket over unverified headers.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-015", "VULN-019", "THR-STRIDE-015", "EXP-015 / EV-015",
        "Unbounded Response Body Memory Buffering in Gateway Logging Filter",
        "Medium", 7.5, "CWE-400 / CWE-770",
        "api-gateway",
        "ApiLoggingFilter.java",
        "Gateway buffered complete HTTP response bodies in memory for audit logging without size limits, creating potential heap exhaustion (DoS).",
        "Implemented bounded memory buffer capped at 10 KB (10240 bytes) with [... TRUNCATED ...] marker in ApiLoggingFilter.",
        "PARTIALLY CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-016", "VULN-016", "THR-STRIDE-014", "EXP-016 / EV-016",
        "Missing Content-Security-Policy (CSP) and HSTS Headers in Gateway Filter",
        "Low", 6.8, "CWE-693",
        "api-gateway",
        "SecurityHeadersFilter.java",
        "Gateway omitted CSP, HSTS, X-Content-Type-Options, and X-Frame-Options headers, increasing risk of cross-site scripting and MIME sniffing.",
        "Added comprehensive security headers filter enforcing CSP, HSTS (includeSubDomains; preload), X-Content-Type-Options: nosniff, and X-Frame-Options: DENY.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-017", "VULN-010", "Input Validation / CWE-20", "EXP-017 / EV-017",
        "Missing Bean Validation Annotation (@Valid) on Login Request Controller",
        "Medium", 6.5, "CWE-20",
        "auth-service",
        "AuthSecondaryController.java",
        "Login request controller omitted @Valid annotation on LoginRequest body, permitting malformed input to reach service and database layers. Distinguishable from brute-force rate limiting (THR-STRIDE-016).",
        "Added @Valid annotation to @RequestBody LoginRequest loginRequest in AuthSecondaryController to enforce schema constraints before authentication processing.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-018", "VULN-018", "THR-STRIDE-015", "EXP-018 / EV-018",
        "Unvalidated File Upload in eSign Initiation Endpoint",
        "High", 7.8, "CWE-434",
        "revenue",
        "EsignPrimaryController.java",
        "eSign upload endpoint accepted arbitrary multipart files without size limits, MIME type verification, or magic byte checks, risking disk starvation and arbitrary file upload.",
        "Added multi-layer file upload validation: empty file check, 5MB file size limit, application/pdf MIME check, and %PDF (0x25 0x50 0x44 0x46) magic bytes validation.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-019", "VULN-013", "THR-STRIDE-013", "EXP-019 / EV-019",
        "Production Exposure of Swagger / OpenAPI Interactive Documentation",
        "Low", 5.3, "CWE-200",
        "user-management, revenue, auth-service",
        "SwaggerConfig.java",
        "Swagger UI and OpenAPI 3.0 API schema endpoints exposed in production builds, facilitating automated reconnaissance by adversaries.",
        "Added @Profile('!prod') to SwaggerConfig classes across all services, ensuring API documentation endpoints are disabled in production runtime.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-020", "VULN-021", "THR-STRIDE-002", "EXP-020 / EV-020",
        "Unauthenticated Service Discovery Operations on Netflix Eureka",
        "Critical", 9.8, "CWE-306",
        "discovery, docker-compose.yml",
        "WebSecurityConfig.java / docker-compose.yml",
        "Netflix Eureka discovery server on port 8761 allowed unauthenticated microservice registrations and queries, enabling rogue service injection.",
        "Enforced Spring Security HTTP Basic authentication on Eureka server, configured microservice Eureka client credentials, and bound port to 127.0.0.1.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ],
    [
        "SAST-021", "VULN-013", "Debug Code Exposure / CWE-489", "EXP-021 / EV-021",
        "Exposed Test Controller in Revenue Service Production Code",
        "Medium", 6.5, "CWE-489",
        "revenue",
        "TestController.java",
        "TestController.java included in production source code exposed 5 diagnostic endpoints without authentication. Distinguishable from Spring Boot Actuator secret harvesting (THR-STRIDE-011).",
        "Added @Profile({'dev', 'test'}) to TestController.java so that test endpoints are never instantiated in production environments.",
        "CONFIRMED", "VERIFIED_FIXED", "RETEST_PASSED"
    ]
];

const masterWb = XLSX.utils.book_new();
const masterWs = XLSX.utils.aoa_to_sheet([masterHeaders, ...masterRows]);
XLSX.utils.book_append_sheet(masterWb, masterWs, "Master Traceability");
XLSX.writeFile(masterWb, "Master_Finding_Traceability_Register.xlsx");
console.log("Successfully updated Master_Finding_Traceability_Register.xlsx (21 rows + headers)");

// 2. Redact secrets in DAST_Test_Case_Register.xlsx
const dastWb = XLSX.readFile("DAST_Test_Case_Register.xlsx");
const dastSheet = dastWb.Sheets[dastWb.SheetNames[0]];
const dastData = XLSX.utils.sheet_to_json(dastSheet, { header: 1 });

for (let r = 1; r < dastData.length; r++) {
    for (let c = 0; c < dastData[r].length; c++) {
        if (typeof dastData[r][c] === 'string') {
            dastData[r][c] = dastData[r][c]
                .replace(/postgres@206/g, '[REDACTED_DATABASE_PASSWORD]')
                .replace(/amITbPANCH@E/g, '[REDACTED_KEYSTORE_PASSWORD]')
                .replace(/[REDACTED_COMPROMISED_SECRET]/g, '[REDACTED_JWT_SECRET]');
        }
    }
}

const cleanDastWs = XLSX.utils.aoa_to_sheet(dastData);
dastWb.Sheets[dastWb.SheetNames[0]] = cleanDastWs;
XLSX.writeFile(dastWb, "DAST_Test_Case_Register.xlsx");
console.log(`Successfully redacted secrets in DAST_Test_Case_Register.xlsx (${dastData.length} rows)`);
