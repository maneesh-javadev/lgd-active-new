# LGD 2.0 - Technology Stack & Runtime Inventory

| **Document Version** | 1.0.0 |
| **Audit Phase** | Phase 0: Project Discovery & Security Baseline |
| **Audited Workstation Tools** | Java 21.0.9 LTS, Maven 3.9.12, Node v24.18.0, Docker 29.7.2 |

---

## 1. System Technology Overview

| Layer | Primary Technology | Version | Purpose |
|---|---|---|---|
| **JVM Runtime** | Java Development Kit (Eclipse Temurin) | **Java 21 LTS** | Core backend language & runtime |
| **Backend Framework** | Spring Boot | **3.3.1 - 3.4.1** | Microservice application framework |
| **Cloud Infrastructure** | Spring Cloud | **2023.0.x** | Service discovery, routing, gateway, and Feign |
| **Security Framework** | Spring Security & Nimbus OAuth2 | **6.3.x / 9.x** | Authentication, authorization, JWT decode |
| **Frontend Framework (1)**| React & TypeScript | **React 19.2.0, TS 5.9.3** | Nodal Officer Dashboard (`lgd_react`) |
| **Frontend Framework (2)**| React & Tailwind CSS | **React 18.x / Vite** | User Management Administration (`lgd-um`) |
| **Frontend Build Tool** | Vite | **7.2.4 (React) / 5.x (UM)** | Fast module bundling and dev server |
| **Database Engine** | PostgreSQL | **14+ (`lgd_new`)** | Enterprise Relational Persistence Store |
| **Caching Engine** | Redis | **6.x / 7.x** | In-memory token revocation & master data cache |
| **Document Processing**| Apache PDFBox & Apache Tika | **3.0.3 & 2.9.2** | Electronic document signature & MIME validation |
| **Virtualization** | Docker & Docker Compose | **29.7.2 / Compose v2** | Multi-container microservice orchestration |

---

## 2. Microservice Module Technology Matrix

| Module | Core Framework | Key Dependencies | Build Tool | Target Artifact |
|---|---|---|---|---|
| **`discovery`** | Spring Boot, Spring Cloud Netflix Eureka Server | `spring-cloud-starter-netflix-eureka-server` | Maven 3.9 | `discovery-0.0.1-SNAPSHOT.jar` |
| **`api-gateway`** | Spring Boot, Spring Cloud Gateway (WebFlux / Netty) | `spring-cloud-starter-gateway`, `jjwt-api 0.11.5`, `spring-boot-starter-data-jpa` | Maven 3.9 | `api-gateway-1.0.0.jar` |
| **`auth-service`** | Spring Boot 3.3.1, Spring Security 6 | `spring-boot-starter-oauth2-resource-server`, `spring-boot-starter-data-redis`, `openfeign` | Maven 3.9 | `auth-service-0.0.1-SNAPSHOT.jar` |
| **`user-management`**| Spring Boot, Spring Security, Hibernate | `spring-boot-starter-data-jpa`, `postgresql`, `mapstruct 1.5.5`, `jbcrypt 0.4` | Maven 3.9 | `user-management-0.0.1-SNAPSHOT.jar` |
| **`revenue`** | Spring Boot, Spring Security, Hibernate | `openhtmltopdf 1.1.24`, `pdfbox 3.0.3`, `tika-core 2.9.2`, `jjwt-api 0.11.5` | Maven 3.9 | `revenue-0.0.1-SNAPSHOT.jar` |
| **`lgd-um`** | React, Vite | `tailwindcss`, `axios`, `lucide-react`, `react-router-dom` | NPM (Node 24) | Vite static distribution |
| **`lgd_react`** | React 19, Vite 7 | `@reduxjs/toolkit`, `axios`, `react-router-dom 7.15`, `jspdf`, `xlsx 0.18.5` | NPM (Node 24) | Vite static distribution |

---

## 3. Cryptographic & Security Libraries Inventory

| Library | Version | Usage | Security Assessment |
|---|---|---|---|
| **Nimbus JOSE + JWT** | Built-in Spring Security | `auth-service` token parsing & decoding | Standards-compliant OAuth2 / JWT resource server. |
| **JJWT (Java JWT)** | `0.11.5` | `api-gateway`, `revenue`, `user-management` | Compliant RFC 7519 HMAC-SHA256 token validator. |
| **Spring Security Crypto** | `6.3.x` | `auth-service` | Industry standard BCrypt key derivation. |
| **jBCrypt** | `0.4` | `user-management` | Legacy library (2015); transition recommended to Spring Security Crypto. |
| **Java XML-DSig** | Java 21 Built-in (`javax.xml.crypto.dsig`) | `revenue` e-Hastakshar | W3C XML Digital Signature compliant with secure validation enabled. |
| **Apache Tika** | `2.9.2` | `revenue` | Content-based file format and MIME-type detection. |

---

## 4. Container & Operating System Stack

- **Base Container Images:**
  - `FROM eclipse-temurin:21-jdk` (Debian-based official Temurin Java 21 container).
- **Container Network Driver:**
  - Docker Bridge Network (`lgd-network`).
- **Orchestration:**
  - Single-node Docker Compose with service health-check dependencies (`depends_on: service_healthy`).
- **Host OS Testing Environment:**
  - Windows 11 Enterprise (Workstation), PowerShell 7 / Windows Terminal.
