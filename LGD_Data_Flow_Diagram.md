# LGD 2.0 - Data Flow Diagrams (DFD) & Architecture Maps

| **Document Version** | 1.0.0 |
| **Audit Phase** | Phase 1: Threat Modeling & Trust Boundary Analysis |
| **System** | Local Government Directory (LGD 2.0) |
| **Notation Standard** | Yourdon / DeMarco & Gane-Sarson DFD Mappings in Mermaid |

---

## 1. DFD Level 0: Global Context Diagram

The Level 0 Context Diagram establishes the global perimeter of the LGD 2.0 System, its external entities, and high-level data exchanges across the environment boundary.

```mermaid
graph LR
    subgraph ExternalEntities ["External Entities"]
        Officer["Government Nodal Officer<br/>(State / District Level)"]
        Citizen["Public User / Citizen"]
        CDAC_ESP["CDAC e-Hastakshar ESP<br/>(Electronic Signature Provider)"]
    end

    subgraph LGDSystemBoundary ["LGD 2.0 System Boundary"]
        LGD["Local Government Directory (LGD 2.0)<br/>Microservices Platform"]
    end

    Officer -->|1. Credentials, Draft Orders, Attachments| LGD
    LGD -->|2. JWT Bearer Tokens, Menus, Verification Status| Officer

    Citizen -->|3. Public Directory Queries (State, District, Village)| LGD
    LGD -->|4. Master Data Directory Responses| Citizen

    LGD -->|5. SHA-256 Pre-hashed PDF Byte Range, Signed XML| CDAC_ESP
    CDAC_ESP -->|6. XML-DSig Callback with PKCS#7 Signature| LGD
```

---

## 2. DFD Level 1: System Decomposition & Subsystems

The Level 1 DFD decomposes the LGD 2.0 system into its constituent microservices, persistence engines, cache layers, and demarcated trust boundaries.

```mermaid
graph TB
    subgraph Clients ["Client Entity Layer"]
        User["User Browser / Client Dashboard"]
    end

    subgraph EdgeBoundary ["Edge Ingress Boundary (TB-01)"]
        P1["Process 1.0: Edge Ingress & Routing<br/>(api-gateway:8092)<br/>- SecurityHeadersFilter<br/>- AuthenticationFilter<br/>- ApiLoggingFilter"]
    end

    subgraph MicroserviceProcesses ["Internal Microservice Processes (TB-02)"]
        P2["Process 2.0: Identity & Authentication<br/>(auth-service:18090)"]
        P3["Process 3.0: User & Access Administration<br/>(user-management:18089)"]
        P4["Process 4.0: Land Revenue & Unit Operations<br/>(revenue:18062)"]
        P5["Process 5.0: Service Registry<br/>(discovery:8761)"]
    end

    subgraph StorageLayer ["Persistence & Revocation Layer (TB-04 & TB-05)"]
        D1[("Data Store D1: PostgreSQL<br/>Database: lgd_new")]
        D2[("Data Store D2: Redis Cache<br/>Token Blacklist & Master Cache")]
        D3[("Data Store D3: Local Filesystem<br/>File Storage /tmp/uploadFile")]
    end

    subgraph ExternalServices ["External Partner Layer (TB-07)"]
        ESP["CDAC e-Hastakshar Provider"]
    end

    User -->|HTTP Requests with Token| P1
    P1 -->|Auth Verification| P2
    P1 -->|Route User Admin Requests| P3
    P1 -->|Route Revenue & Draft Requests| P4
    P2 -.->|Register Instance| P5
    P3 -.->|Register Instance| P5
    P4 -.->|Register Instance| P5
    P1 -.->|Query Registry| P5

    P2 -->|Verify Credentials / Read Profile| D1
    P2 -->|Record Revoked Token JTI| D2
    P3 -->|User & Role CRUD / History| D1
    P4 -->|Read/Write Administrative Entities & Drafts| D1
    P4 -->|Read Cached Master Lists| D2
    P4 -->|Store Government Order Attachments| D3
    P4 <-->|Initiate eSign & Ingest Callback| ESP
    P1 -->|Log Request/Response Audit| D1
```

---

## 3. DFD Level 2: Critical Business Flows

### 3.1 Flow 1: Authentication & Token Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Officer as Nodal Officer
    participant GW as API Gateway (8092)
    participant Auth as Auth Service (18090)
    participant DB as PostgreSQL (lgd_new)
    participant Redis as Redis (6379)

    Officer->>GW: POST /audit/auth/public/v1/auth/login (username, password)
    GW->>Auth: Forward to /public/v1/auth/login
    Auth->>DB: Query User by user_login_id, isActive=true, isDeleted=false
    DB-->>Auth: Return User entity & password_hash
    Auth->>Auth: BCrypt verify password against hash
    alt Invalid Credentials
        Auth-->>GW: Return 401 "Invalid username or password"
        GW-->>Officer: Return 401 "Invalid username or password"
    else Valid Credentials
        Auth->>DB: Query active role mappings & privileges
        DB-->>Auth: Return Role & Privilege list
        Auth->>Auth: Generate Nimbus JWT (HS256) with userId, stateCode, roleId, privileges
        Auth-->>GW: Return LoginResponse (JWT token, state/district names, TTL)
        GW-->>Officer: Return LoginResponse
    end

    Note over Officer, Redis: Subsequent Token Revocation (Logout)
    Officer->>GW: POST /audit/auth/private/v1/auth/logout (Authorization: Bearer JWT)
    GW->>Auth: Forward authenticated logout request
    Auth->>Auth: Extract JTI claim & expiration date from JWT
    Auth->>Redis: SET blacklist:<jti> "revoked" EX <remaining_seconds>
    Redis-->>Auth: OK
    Auth-->>GW: 200 OK
    GW-->>Officer: 200 OK (Logged Out)
```

---

### 3.2 Flow 2: Government Directory Draft Creation & Attachment Storage

```mermaid
sequenceDiagram
    autonumber
    actor Officer as State Officer (State 10)
    participant GW as API Gateway (8092)
    participant Rev as Revenue Service (18062)
    participant Tika as Apache Tika & PDFBox
    participant FS as File Storage Engine
    participant DB as PostgreSQL (lgd_new)

    Officer->>GW: POST /audit/revenue/private/v1/district (Multipart: Form + PDF Order File)
    GW->>GW: AuthenticationFilter validates JWT signature & stateCode=10
    GW->>Rev: Forward request with UserContext
    Rev->>Tika: Inspect uploaded file InputStream
    Tika-->>Rev: Validate detected MIME type (application/pdf) & structural integrity
    alt Invalid MIME / Corrupted File
        Rev-->>GW: Return 400 "Invalid file format or corrupted PDF"
        GW-->>Officer: Return 400 Bad Request
    else Valid PDF
        Rev->>FS: Save file with sanitized timestamp filename
        FS-->>Rev: Return physical file storage path
        Rev->>DB: INSERT into attachment table (file_location, size, mime)
        DB-->>Rev: Return attachment_id
        Rev->>DB: INSERT into district_draft (district_name, state_code=10, attachment_id, status='DRAFT')
        DB-->>Rev: Return district_draft_code
        Rev-->>GW: Return 200 OK (Draft Created)
        GW-->>Officer: Return 200 OK
    end
```

---

### 3.3 Flow 3: e-Hastakshar Pre-Signing & External Callback Ingestion

```mermaid
sequenceDiagram
    autonumber
    actor Officer as Nodal Officer
    participant Rev as Revenue Service (18062)
    participant SignUtil as XmlSignatureUtil
    participant ESP as CDAC e-Hastakshar ESP
    participant DB as PostgreSQL (lgd_new)

    Officer->>Rev: POST /private/v1/ehastakshar/initiate (Multipart PDF)
    Rev->>Rev: Calculate PDF byte range & compute SHA-256 pre-hash
    Rev->>SignUtil: Construct XML request & sign using server PKCS#12 keystore
    SignUtil-->>Rev: Return XML-DSig signed XML payload
    Rev->>DB: INSERT into esign_transaction (txn_id, status='INITIATED')
    Rev-->>Officer: Return EsignInitiateResponse (espUrl, signedXml, txnId)
    
    Officer->>ESP: Browser redirected with signed XML request
    Note over Officer, ESP: Officer completes Aadhaar OTP / Biometric authentication
    
    ESP->>Rev: POST /public/v1/ehastakshar/response (respon=XML_DSig_Payload)
    Note over Rev: XXE Hardened DocumentBuilderFactory parses XML
    Rev->>SignUtil: verifyXmlSignature(esignRespXml)
    alt Invalid or Forged ESP Signature
        SignUtil-->>Rev: Signature verification failed (false)
        Rev-->>ESP: Throw SecurityException("Invalid ESP Signature") -> 400 Bad Request
    else Valid Cryptographic Signature
        Rev->>DB: Query esign_transaction by txnId
        Rev->>Rev: Extract PKCS#7 signature block and inject into reserved PDF byte range
        Rev->>DB: UPDATE esign_transaction SET status='COMPLETED'
        Rev->>DB: UPDATE government_order SET is_signed=true, signed_file_path=...
        Rev-->>ESP: Return 200 OK (txnId)
    end
```

---

### 3.4 Flow 4: Gazette Publication & Multi-Tenant State Boundary Enforcement

```mermaid
sequenceDiagram
    autonumber
    actor Officer as Officer (StateCode: 10)
    participant GW as API Gateway (8092)
    participant Rev as Revenue Service (18062)
    participant DB as PostgreSQL (lgd_new)

    Officer->>GW: POST /audit/revenue/private/v1/district/publish/create (draftCode=502)
    GW->>GW: Validate JWT; extract UserContext (stateCode=10)
    GW->>Rev: Forward publish request
    Rev->>DB: SELECT * FROM district_draft WHERE district_code = 502
    DB-->>Rev: Return DistrictDraft (stateCode=20)
    
    Note over Rev: Tenant Boundary Enforcement Check
    Rev->>Rev: Compare districtDraft.getStateCode() [20] vs userContext.getStateCode() [10]
    alt State Boundary Mismatch (BOLA Detected)
        Rev-->>GW: Throw SecurityException ("Tenant boundary violation: State 10 cannot publish draft of State 20")
        GW-->>Officer: Return 403 Forbidden / 400 Bad Request
    else State Boundary Matches
        Rev->>DB: Call stored procedure create_district_fn(...)
        DB-->>Rev: Return new active district code & order code
        Rev->>DB: UPDATE district SET is_active=true
        Rev-->>GW: Return PublishDistrictResponse (Success)
        GW-->>Officer: Return 200 OK
    end
```
