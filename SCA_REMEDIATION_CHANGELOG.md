# LGD 2.0 — SCA Remediation Changelog & Code Diffs
## Verifiable Technical Modifications for Dependency Hardening

| **Project Information** | |
|---|---|
| **Target Platform** | Local Government Directory 2.0 (LGD 2.0) |
| **Repository Root** | `e:\System\Projects\dockerProject\Source code\lgd-active-new` |
| **Assessment Scope** | Phase 4: Software Composition Analysis (SCA) & Dependency Remediation |
| **Date** | October 30, 2026 |
| **Status** | **APPROVED TECHNICAL CHANGELOG — RECONCILED WITH INDEPENDENT REVIEW** |

---

## 1. Executive Summary of Changes

To mitigate the critical and high-severity vulnerabilities identified during the Phase 4 SCA assessment and independent review, targeted modifications were applied to four Maven `pom.xml` manifests. Zero breaking changes were introduced; existing application source code, API signatures, and configurations remain 100% untouched.

### Summary of Manifest Changes:
1. `revenue/pom.xml`: Upgraded Spring Boot parent from `3.2.2` to `3.2.12`; added explicit `<tomcat.version>10.1.34</tomcat.version>` and `<spring-security.version>6.3.8</spring-security.version>` properties.
2. `auth-service/pom.xml`: Added explicit `<tomcat.version>10.1.34</tomcat.version>` and `<spring-security.version>6.3.8</spring-security.version>` properties.
3. `user-management/pom.xml`: Added explicit `<tomcat.version>10.1.34</tomcat.version>` and `<spring-security.version>6.3.8</spring-security.version>` properties.
4. `api-gateway/pom.xml`: Added explicit `<tomcat.version>10.1.34</tomcat.version>` and `<spring-security.version>6.3.8</spring-security.version>` properties.

---

## 2. Before vs. After Dependency Version Mapping Table

| Service Module | Component | Before Remediation | After Remediation | Security Vulnerabilities Resolved |
|---|---|:---:|:---:|---|
| **`revenue`** | `spring-boot-starter-parent` | `3.2.2` | **`3.2.12`** | Aligns 10 patch releases; resolves framework divergence (`SCA-011`) |
| **`revenue`** | `org.postgresql:postgresql` | `42.6.0` | **`42.6.2`** | **CVE-2024-1597** (CVSS 10.0 Critical SQL Injection) (`SCA-001`) |
| **`revenue`** | `org.springframework:spring-web` | `6.1.3` | **`6.1.15`** | **CVE-2024-22243**, **CVE-2024-22259**, **CVE-2024-22262** (CVSS 8.1 High SSRF/Redirect), **CVE-2024-38807** (ReDoS), **CVE-2024-38816** (Path Traversal) (`SCA-003`, `SCA-004`) |
| **`revenue`**, **`auth`**, **`um`**, **`gateway`** | `org.springframework.security:*` | `6.2.1` / `6.2.8` / `6.3.5` | **`6.3.8`** | **CVE-2024-22234**, **CVE-2024-22257**, **CVE-2024-38821**, **CVE-2025-22228** (CVSS 7.5 High Auth Bypass) (`SCA-005`). CVE-2024-38828 dispositioned as Spring Framework 5.3.x DoS false positive. |
| **`revenue`** | `io.netty:netty-*` | `4.1.105.Final` | **`4.1.115.Final`** | **CVE-2024-29025**, **CVE-2024-47535** (CVSS 7.5 High Memory Exhaustion) (`SCA-006`) |
| **`revenue`**, **`auth`**, **`um`**, **`gateway`** | `org.apache.tomcat.embed:tomcat-embed-core` / `el` | `10.1.18` / `10.1.31` / `10.1.33` | **`10.1.34`** | **CVE-2024-50379**, **CVE-2024-56337** (CVSS 9.8 Critical RCE), **CVE-2024-23672**, **CVE-2024-24549**, **CVE-2024-38286** (`SCA-002`) |

---

## 3. Verifiable Code Diffs by Module

### 3.1 `revenue/pom.xml`

**File:** [revenue/pom.xml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/revenue/pom.xml)  
**Description:** Upgraded Spring Boot parent version to 3.2.12, pinned embedded Tomcat version to 10.1.34, and upgraded Spring Security to 6.3.8.

```diff
--- a/revenue/pom.xml
+++ b/revenue/pom.xml
@@ -8,7 +8,7 @@
 	<parent>
 		<groupId>org.springframework.boot</groupId>
 		<artifactId>spring-boot-starter-parent</artifactId>
-		<version>3.2.2</version>
+		<version>3.2.12</version>
 		<relativePath />
 	</parent>
 
@@ -25,6 +25,8 @@
 		<spring-cloud.version>2023.0.1</spring-cloud.version>
 		<pdfbox.version>3.0.5</pdfbox.version>
 		<tika.version>3.2.3</tika.version>
+		<tomcat.version>10.1.34</tomcat.version>
+		<spring-security.version>6.3.8</spring-security.version>
 	</properties>
```

---

### 3.2 `auth-service/pom.xml`

**File:** [auth-service/pom.xml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/auth-service/pom.xml)  
**Description:** Added `<tomcat.version>10.1.34</tomcat.version>` and `<spring-security.version>6.3.8</spring-security.version>` properties.

```diff
--- a/auth-service/pom.xml
+++ b/auth-service/pom.xml
@@ -26,6 +26,8 @@
         <spring-cloud.version>2023.0.1</spring-cloud.version>
         <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
         <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
+        <tomcat.version>10.1.34</tomcat.version>
+        <spring-security.version>6.3.8</spring-security.version>
     </properties>
 
     <dependencies>
```

---

### 3.3 `user-management/pom.xml`

**File:** [user-management/pom.xml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/user-management/pom.xml)  
**Description:** Added `<tomcat.version>10.1.34</tomcat.version>` and `<spring-security.version>6.3.8</spring-security.version>` properties.

```diff
--- a/user-management/pom.xml
+++ b/user-management/pom.xml
@@ -55,6 +55,10 @@
         <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
         <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
 
+        <!-- Patched Tomcat for CVE-2024-50379 / CVE-2024-56337 -->
+        <tomcat.version>10.1.34</tomcat.version>
+        <spring-security.version>6.3.8</spring-security.version>
+
     </properties>
```

---

### 3.4 `api-gateway/pom.xml`

**File:** [api-gateway/pom.xml](file:///e:/System/Projects/dockerProject/Source%20code/lgd-active-new/api-gateway/pom.xml)  
**Description:** Added `<tomcat.version>10.1.34</tomcat.version>` and `<spring-security.version>6.3.8</spring-security.version>` properties.

```diff
--- a/api-gateway/pom.xml
+++ b/api-gateway/pom.xml
@@ -19,6 +19,8 @@
         <spring-cloud.version>2023.0.3</spring-cloud.version>
         <resilience4j.version>2.2.0</resilience4j.version>
         <mapstruct.version>1.5.5.Final</mapstruct.version>
+        <tomcat.version>10.1.34</tomcat.version>
+        <spring-security.version>6.3.8</spring-security.version>
     </properties>
 
     <dependencies>
```

---

## 4. Verification Evidence & Confirmation

All four updated modules were rebuilt and tested:
1. `mvn test` in `revenue`: **22 tests executed, 22 passed, 0 failures, 0 errors**.
2. `mvn test` in `auth-service`: **40 tests executed, 40 passed, 0 failures, 0 errors**.
3. `mvn test` in `user-management`: **211 tests executed, 211 passed, 0 failures, 0 errors**.
4. `mvn test` in `api-gateway`: **14 tests executed, 14 passed, 0 failures, 0 errors**.
5. `discovery` service: **2 tests executed, 2 passed, 0 failures, 0 errors**.
6. Total backend regression suite: **289 tests executed, 289 passed, 0 failures, 0 errors (100% pass rate)**.
