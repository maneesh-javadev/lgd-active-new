--
-- PostgreSQL database dump
--

\restrict 2NvhT2nUX6SRP7YoDbm9FzzGfZSweCKMXZKT5zWNnqTchZFUAZO8eGDzStOiI9U

-- Dumped from database version 14.20
-- Dumped by pg_dump version 14.20

-- Started on 2026-10-27 11:03:03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 838619)
-- Name: um; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA um;


ALTER SCHEMA um OWNER TO postgres;

--
-- TOC entry 1796 (class 1255 OID 838934)
-- Name: reset_all_sequences(text); Type: FUNCTION; Schema: um; Owner: postgres
--

CREATE FUNCTION um.reset_all_sequences(p_schema text DEFAULT 'um'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    seq_record RECORD;
    max_id BIGINT;
    reset_count INTEGER := 0;
BEGIN
    FOR seq_record IN
        SELECT
            seq_ns.nspname AS sequence_schema,
            seq.relname AS sequence_name,
            tbl_ns.nspname AS table_schema,
            tbl.relname AS table_name,
            col.attname AS column_name
        FROM pg_class seq
        JOIN pg_namespace seq_ns
            ON seq_ns.oid = seq.relnamespace
        JOIN pg_depend dep
            ON dep.objid = seq.oid
           AND dep.classid = 'pg_class'::regclass
           AND dep.refclassid = 'pg_class'::regclass
           AND dep.deptype IN ('a', 'i')
        JOIN pg_class tbl
            ON tbl.oid = dep.refobjid
        JOIN pg_namespace tbl_ns
            ON tbl_ns.oid = tbl.relnamespace
        JOIN pg_attribute col
            ON col.attrelid = tbl.oid
           AND col.attnum = dep.refobjsubid
        WHERE seq.relkind = 'S'
          AND tbl_ns.nspname = p_schema
          AND tbl.relkind IN ('r', 'p')
          AND col.attnum > 0
          AND NOT col.attisdropped
        ORDER BY tbl.relname, col.attname
    LOOP
        EXECUTE format(
            'SELECT MAX(%I)::BIGINT FROM %I.%I',
            seq_record.column_name,
            seq_record.table_schema,
            seq_record.table_name
        )
        INTO max_id;

        IF max_id IS NULL THEN
            -- Empty table: next generated ID will be 1.
            PERFORM setval(
                format(
                    '%I.%I',
                    seq_record.sequence_schema,
                    seq_record.sequence_name
                )::regclass,
                1,
                FALSE
            );
        ELSE
            -- Existing data: next generated ID will be MAX(id) + 1.
            PERFORM setval(
                format(
                    '%I.%I',
                    seq_record.sequence_schema,
                    seq_record.sequence_name
                )::regclass,
                max_id,
                TRUE
            );
        END IF;

        reset_count := reset_count + 1;

        RAISE NOTICE
            'Reset sequence %.% for table %.%, column %, max ID = %',
            seq_record.sequence_schema,
            seq_record.sequence_name,
            seq_record.table_schema,
            seq_record.table_name,
            seq_record.column_name,
            COALESCE(max_id::TEXT, 'EMPTY');
    END LOOP;

    RAISE NOTICE 'Total sequences reset: %', reset_count;
END;
$$;


ALTER FUNCTION um.reset_all_sequences(p_schema text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 752 (class 1259 OID 838621)
-- Name: privilege; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.privilege (
    privilege_id bigint NOT NULL,
    privilege_code character varying(150) NOT NULL,
    privilege_name character varying(200) NOT NULL,
    action character varying(50) NOT NULL,
    description character varying(500),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint,
    updated_at timestamp without time zone,
    updated_by bigint,
    is_system boolean DEFAULT false NOT NULL
);


ALTER TABLE um.privilege OWNER TO postgres;

--
-- TOC entry 751 (class 1259 OID 838620)
-- Name: privilege_privilege_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.privilege_privilege_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.privilege_privilege_id_seq OWNER TO postgres;

--
-- TOC entry 5790 (class 0 OID 0)
-- Dependencies: 751
-- Name: privilege_privilege_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.privilege_privilege_id_seq OWNED BY um.privilege.privilege_id;


--
-- TOC entry 771 (class 1259 OID 838841)
-- Name: privilege_resource; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.privilege_resource (
    privilege_id bigint NOT NULL,
    resource_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint
);


ALTER TABLE um.privilege_resource OWNER TO postgres;

--
-- TOC entry 762 (class 1259 OID 838714)
-- Name: resource; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.resource (
    resource_id bigint NOT NULL,
    resource_code character varying(150) NOT NULL,
    resource_name character varying(200) NOT NULL,
    resource_type character varying(20) NOT NULL,
    service_name character varying(150),
    api_path character varying(500),
    http_method character varying(20),
    frontend_route character varying(500),
    parent_resource_id bigint,
    description character varying(500),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint,
    updated_at timestamp without time zone,
    updated_by bigint,
    display_order integer DEFAULT 0,
    icon character varying(100),
    is_system boolean DEFAULT false NOT NULL,
    CONSTRAINT chk_resource_api_details CHECK ((((resource_type)::text <> 'API'::text) OR ((service_name IS NOT NULL) AND (api_path IS NOT NULL) AND (http_method IS NOT NULL)))),
    CONSTRAINT chk_resource_frontend_details CHECK ((((resource_type)::text = 'API'::text) OR (frontend_route IS NOT NULL))),
    CONSTRAINT chk_resource_type CHECK (((resource_type)::text = ANY (ARRAY[('API'::character varying)::text, ('ROUTE'::character varying)::text, ('MENU'::character varying)::text])))
);


ALTER TABLE um.resource OWNER TO postgres;

--
-- TOC entry 761 (class 1259 OID 838713)
-- Name: resource_resource_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.resource_resource_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.resource_resource_id_seq OWNER TO postgres;

--
-- TOC entry 5791 (class 0 OID 0)
-- Dependencies: 761
-- Name: resource_resource_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.resource_resource_id_seq OWNED BY um.resource.resource_id;


--
-- TOC entry 764 (class 1259 OID 838738)
-- Name: role; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.role (
    role_id bigint NOT NULL,
    role_code character varying(100) NOT NULL,
    role_name character varying(200) NOT NULL,
    description character varying(500),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint,
    updated_at timestamp without time zone,
    updated_by bigint,
    role_level_code character varying(10),
    role_type_code character varying(10),
    created_ip inet,
    updated_ip inet,
    is_system boolean DEFAULT false NOT NULL
);


ALTER TABLE um.role OWNER TO postgres;

--
-- TOC entry 766 (class 1259 OID 838764)
-- Name: role_history; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.role_history (
    role_history_id bigint NOT NULL,
    role_id bigint NOT NULL,
    version_no integer NOT NULL,
    role_code character varying(100) NOT NULL,
    role_name character varying(200) NOT NULL,
    description character varying(500),
    role_level_code character varying(10) NOT NULL,
    role_type_code character varying(10) NOT NULL,
    is_active boolean NOT NULL,
    action character varying(20) NOT NULL,
    changed_by bigint,
    changed_ip inet,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    change_reason character varying(1000),
    CONSTRAINT chk_role_history_action CHECK (((action)::text = ANY (ARRAY[('CREATE'::character varying)::text, ('UPDATE'::character varying)::text, ('ACTIVATE'::character varying)::text, ('DEACTIVATE'::character varying)::text]))),
    CONSTRAINT chk_role_history_version CHECK ((version_no > 0))
);


ALTER TABLE um.role_history OWNER TO postgres;

--
-- TOC entry 765 (class 1259 OID 838763)
-- Name: role_history_role_history_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.role_history_role_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.role_history_role_history_id_seq OWNER TO postgres;

--
-- TOC entry 5792 (class 0 OID 0)
-- Dependencies: 765
-- Name: role_history_role_history_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.role_history_role_history_id_seq OWNED BY um.role_history.role_history_id;


--
-- TOC entry 753 (class 1259 OID 838634)
-- Name: role_level_master; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.role_level_master (
    role_level_code character varying(10) NOT NULL,
    role_level_name character varying(100) NOT NULL,
    description character varying(500),
    display_order integer,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint,
    updated_at timestamp without time zone,
    updated_by bigint,
    created_ip inet,
    updated_ip inet,
    CONSTRAINT chk_role_level_code_not_blank CHECK ((btrim((role_level_code)::text) <> ''::text)),
    CONSTRAINT chk_role_level_name_not_blank CHECK ((btrim((role_level_name)::text) <> ''::text))
);


ALTER TABLE um.role_level_master OWNER TO postgres;

--
-- TOC entry 768 (class 1259 OID 838793)
-- Name: role_privilege; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.role_privilege (
    role_privilege_id bigint NOT NULL,
    role_id bigint NOT NULL,
    privilege_id bigint NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint,
    updated_at timestamp without time zone,
    updated_by bigint,
    created_ip inet,
    updated_ip inet
);


ALTER TABLE um.role_privilege OWNER TO postgres;

--
-- TOC entry 767 (class 1259 OID 838792)
-- Name: role_privilege_role_privilege_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.role_privilege_role_privilege_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.role_privilege_role_privilege_id_seq OWNER TO postgres;

--
-- TOC entry 5793 (class 0 OID 0)
-- Dependencies: 767
-- Name: role_privilege_role_privilege_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.role_privilege_role_privilege_id_seq OWNED BY um.role_privilege.role_privilege_id;


--
-- TOC entry 763 (class 1259 OID 838737)
-- Name: role_role_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.role_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.role_role_id_seq OWNER TO postgres;

--
-- TOC entry 5794 (class 0 OID 0)
-- Dependencies: 763
-- Name: role_role_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.role_role_id_seq OWNED BY um.role.role_id;


--
-- TOC entry 754 (class 1259 OID 838647)
-- Name: role_type_master; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.role_type_master (
    role_type_code character varying(10) NOT NULL,
    role_type_name character varying(100) NOT NULL,
    description character varying(500),
    display_order integer,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint,
    updated_at timestamp without time zone,
    updated_by bigint,
    created_ip inet,
    updated_ip inet,
    CONSTRAINT chk_role_type_code_not_blank CHECK ((btrim((role_type_code)::text) <> ''::text)),
    CONSTRAINT chk_role_type_name_not_blank CHECK ((btrim((role_type_name)::text) <> ''::text))
);


ALTER TABLE um.role_type_master OWNER TO postgres;

--
-- TOC entry 756 (class 1259 OID 838661)
-- Name: user_profile; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.user_profile (
    user_profile_id integer NOT NULL,
    user_profile_name character varying(100) NOT NULL,
    designation character varying(100),
    mobile_no character varying(10) NOT NULL,
    email_id character varying(100) NOT NULL,
    state_code integer NOT NULL,
    created_by integer,
    created_on timestamp without time zone,
    modified_by integer,
    modified_on timestamp without time zone,
    user_id bigint NOT NULL,
    is_email_verified boolean,
    is_mobile_no_verified boolean,
    maker_checker_status character(1),
    login_time timestamp without time zone,
    ip_address character varying,
    user_type character(1),
    level character(1),
    district_code integer,
    nodal_officer_id integer
);


ALTER TABLE um.user_profile OWNER TO postgres;

--
-- TOC entry 755 (class 1259 OID 838660)
-- Name: user_profile_user_profile_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.user_profile_user_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.user_profile_user_profile_id_seq OWNER TO postgres;

--
-- TOC entry 5795 (class 0 OID 0)
-- Dependencies: 755
-- Name: user_profile_user_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.user_profile_user_profile_id_seq OWNED BY um.user_profile.user_profile_id;


--
-- TOC entry 770 (class 1259 OID 838816)
-- Name: user_role_mapping; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.user_role_mapping (
    user_role_mapping_id bigint NOT NULL,
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint,
    last_updated_on timestamp without time zone,
    last_updated_by bigint,
    ip_created inet,
    ip_updated inet
);


ALTER TABLE um.user_role_mapping OWNER TO postgres;

--
-- TOC entry 773 (class 1259 OID 839313)
-- Name: user_role_mapping_history; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.user_role_mapping_history (
    user_role_mapping_history_id bigint NOT NULL,
    user_role_mapping_id bigint NOT NULL,
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_on timestamp without time zone,
    created_by bigint,
    last_updated_on timestamp without time zone,
    last_updated_by bigint,
    ip_created inet,
    ip_updated inet,
    operation_type character varying(20) NOT NULL,
    operation_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    operation_by bigint,
    operation_ip character varying(45),
    change_reason character varying(500)
);


ALTER TABLE um.user_role_mapping_history OWNER TO postgres;

--
-- TOC entry 772 (class 1259 OID 839312)
-- Name: user_role_mapping_history_user_role_mapping_history_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.user_role_mapping_history_user_role_mapping_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.user_role_mapping_history_user_role_mapping_history_id_seq OWNER TO postgres;

--
-- TOC entry 5796 (class 0 OID 0)
-- Dependencies: 772
-- Name: user_role_mapping_history_user_role_mapping_history_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.user_role_mapping_history_user_role_mapping_history_id_seq OWNED BY um.user_role_mapping_history.user_role_mapping_history_id;


--
-- TOC entry 769 (class 1259 OID 838815)
-- Name: user_role_mapping_user_role_mapping_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.user_role_mapping_user_role_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.user_role_mapping_user_role_mapping_id_seq OWNER TO postgres;

--
-- TOC entry 5797 (class 0 OID 0)
-- Dependencies: 769
-- Name: user_role_mapping_user_role_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.user_role_mapping_user_role_mapping_id_seq OWNED BY um.user_role_mapping.user_role_mapping_id;


--
-- TOC entry 758 (class 1259 OID 838670)
-- Name: users; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.users (
    user_id bigint NOT NULL,
    user_login_id character varying(100) NOT NULL,
    password_hash character varying(500) NOT NULL,
    state_code integer,
    district_code integer,
    specific_role_id bigint,
    specific_org_unit_code integer,
    specific_admin_unit_entity_code integer,
    user_level character varying(50),
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by bigint,
    last_updated_on timestamp without time zone,
    last_updated_by bigint,
    ip_created character varying(45),
    ip_updated character varying(45),
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    CONSTRAINT chk_users_ip_created CHECK (((ip_created IS NULL) OR (length(TRIM(BOTH FROM ip_created)) > 0))),
    CONSTRAINT chk_users_ip_updated CHECK (((ip_updated IS NULL) OR (length(TRIM(BOTH FROM ip_updated)) > 0)))
);


ALTER TABLE um.users OWNER TO postgres;

--
-- TOC entry 760 (class 1259 OID 838694)
-- Name: users_history; Type: TABLE; Schema: um; Owner: postgres
--

CREATE TABLE um.users_history (
    user_history_id bigint NOT NULL,
    user_id bigint NOT NULL,
    user_login_id character varying(100) NOT NULL,
    password_hash character varying(500),
    state_code integer,
    district_code integer,
    specific_role_id bigint,
    specific_org_unit_code integer,
    specific_admin_unit_entity_code integer,
    user_level character varying(50),
    is_active boolean NOT NULL,
    is_deleted boolean NOT NULL,
    user_created_on timestamp without time zone,
    user_created_by bigint,
    user_last_updated_on timestamp without time zone,
    user_last_updated_by bigint,
    operation_type character varying(20) NOT NULL,
    operation_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    operation_by bigint,
    operation_ip character varying(45),
    change_reason character varying(500),
    CONSTRAINT chk_users_history_operation_ip CHECK (((operation_ip IS NULL) OR (length(TRIM(BOTH FROM operation_ip)) > 0))),
    CONSTRAINT chk_users_history_operation_type CHECK (((operation_type)::text = ANY (ARRAY[('INSERT'::character varying)::text, ('UPDATE'::character varying)::text, ('DELETE'::character varying)::text, ('ACTIVATE'::character varying)::text, ('DEACTIVATE'::character varying)::text])))
);


ALTER TABLE um.users_history OWNER TO postgres;

--
-- TOC entry 759 (class 1259 OID 838693)
-- Name: users_history_user_history_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.users_history_user_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.users_history_user_history_id_seq OWNER TO postgres;

--
-- TOC entry 5798 (class 0 OID 0)
-- Dependencies: 759
-- Name: users_history_user_history_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.users_history_user_history_id_seq OWNED BY um.users_history.user_history_id;


--
-- TOC entry 757 (class 1259 OID 838669)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: um; Owner: postgres
--

CREATE SEQUENCE um.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE um.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5799 (class 0 OID 0)
-- Dependencies: 757
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: um; Owner: postgres
--

ALTER SEQUENCE um.users_user_id_seq OWNED BY um.users.user_id;


--
-- TOC entry 5493 (class 2604 OID 838624)
-- Name: privilege privilege_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.privilege ALTER COLUMN privilege_id SET DEFAULT nextval('um.privilege_privilege_id_seq'::regclass);


--
-- TOC entry 5518 (class 2604 OID 838717)
-- Name: resource resource_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.resource ALTER COLUMN resource_id SET DEFAULT nextval('um.resource_resource_id_seq'::regclass);


--
-- TOC entry 5525 (class 2604 OID 838741)
-- Name: role role_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role ALTER COLUMN role_id SET DEFAULT nextval('um.role_role_id_seq'::regclass);


--
-- TOC entry 5529 (class 2604 OID 838767)
-- Name: role_history role_history_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_history ALTER COLUMN role_history_id SET DEFAULT nextval('um.role_history_role_history_id_seq'::regclass);


--
-- TOC entry 5533 (class 2604 OID 838796)
-- Name: role_privilege role_privilege_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_privilege ALTER COLUMN role_privilege_id SET DEFAULT nextval('um.role_privilege_role_privilege_id_seq'::regclass);


--
-- TOC entry 5505 (class 2604 OID 838664)
-- Name: user_profile user_profile_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.user_profile ALTER COLUMN user_profile_id SET DEFAULT nextval('um.user_profile_user_profile_id_seq'::regclass);


--
-- TOC entry 5536 (class 2604 OID 838819)
-- Name: user_role_mapping user_role_mapping_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.user_role_mapping ALTER COLUMN user_role_mapping_id SET DEFAULT nextval('um.user_role_mapping_user_role_mapping_id_seq'::regclass);


--
-- TOC entry 5540 (class 2604 OID 839316)
-- Name: user_role_mapping_history user_role_mapping_history_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.user_role_mapping_history ALTER COLUMN user_role_mapping_history_id SET DEFAULT nextval('um.user_role_mapping_history_user_role_mapping_history_id_seq'::regclass);


--
-- TOC entry 5506 (class 2604 OID 838673)
-- Name: users user_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.users ALTER COLUMN user_id SET DEFAULT nextval('um.users_user_id_seq'::regclass);


--
-- TOC entry 5513 (class 2604 OID 838697)
-- Name: users_history user_history_id; Type: DEFAULT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.users_history ALTER COLUMN user_history_id SET DEFAULT nextval('um.users_history_user_history_id_seq'::regclass);


--
-- TOC entry 5763 (class 0 OID 838621)
-- Dependencies: 752
-- Data for Name: privilege; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.privilege (privilege_id, privilege_code, privilege_name, action, description, is_active, created_at, created_by, updated_at, updated_by, is_system) FROM stdin;
1	RESOURCE_PRIVILEGE	RESOURCE PRIVILEGE	CREATE		t	2026-09-23 21:31:52.745	\N	\N	\N	t
2	DASHBOARD_PRIVILEGE	DASHBOARD PRIVILEGE	VIEW		t	2026-09-24 06:13:34.379	\N	\N	\N	t
3	USER_MANAGEMENT	USER MANAGEMENT PRIVILEGE	VIEW		t	2026-09-24 06:14:22.69	\N	2026-09-24 06:15:16.116	\N	t
4	PRIVILEGE_PRIVILEGE	PRIVILEGE PRIVILEGE	CREATE		t	2026-09-24 06:16:10.072	\N	\N	\N	t
5	ROLE_PRIVILEGE	ROLE PRIVILEGE	CREATE		t	2026-09-24 06:17:17.086	\N	\N	\N	t
6	USER_PRIVILEGE	USER PRIVILEGE	CREATE		t	2026-09-24 06:18:10.869	\N	\N	\N	t
7	CHANGE_PASSWORD_PRIVILEGE	CHANGE PASSWORD PRIVILEGE	CREATE		t	2026-09-24 20:55:53.264	\N	\N	\N	t
\.


--
-- TOC entry 5782 (class 0 OID 838841)
-- Dependencies: 771
-- Data for Name: privilege_resource; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.privilege_resource (privilege_id, resource_id, created_at, created_by) FROM stdin;
2	1	2026-10-22 09:50:36.142848	\N
3	2	2026-10-22 09:50:36.146764	\N
1	3	2026-10-22 09:50:36.148012	\N
1	6	2026-10-22 09:50:36.148525	\N
1	7	2026-10-22 09:50:36.149416	\N
1	8	2026-10-22 09:50:36.149808	\N
1	9	2026-10-22 09:50:36.151174	\N
1	10	2026-10-22 09:50:36.151547	\N
4	31	2026-10-22 09:50:36.15184	\N
4	33	2026-10-22 09:50:36.152245	\N
4	34	2026-10-22 09:50:36.15256	\N
4	35	2026-10-22 09:50:36.152838	\N
4	36	2026-10-22 09:50:36.153122	\N
4	37	2026-10-22 09:50:36.153426	\N
5	4	2026-10-22 09:50:36.153732	\N
5	11	2026-10-22 09:50:36.154042	\N
5	12	2026-10-22 09:50:36.154341	\N
5	13	2026-10-22 09:50:36.15463	\N
5	14	2026-10-22 09:51:16.620151	\N
5	15	2026-10-22 09:51:16.624761	\N
5	16	2026-10-22 09:51:16.625518	\N
5	17	2026-10-22 09:51:16.625948	\N
5	18	2026-10-22 09:51:16.626306	\N
5	19	2026-10-22 09:51:16.626655	\N
5	20	2026-10-22 09:51:16.626952	\N
5	21	2026-10-22 09:51:16.62725	\N
5	22	2026-10-22 09:51:16.627536	\N
6	31	2026-10-22 09:51:16.627812	\N
6	33	2026-10-22 09:51:16.628154	\N
6	34	2026-10-22 09:51:27.725905	\N
6	35	2026-10-22 09:51:27.727626	\N
6	36	2026-10-22 09:51:27.728264	\N
6	37	2026-10-22 09:51:27.729101	\N
7	32	2026-10-22 09:52:34.179072	\N
6	5	2026-10-22 10:06:06.729444	\N
6	23	2026-10-22 10:58:03.505732	\N
6	24	2026-10-22 11:02:54.138759	\N
6	29	2026-10-22 11:04:11.574757	\N
6	30	2026-10-22 11:04:49.228757	\N
6	26	2026-10-22 11:57:42.086833	\N
6	27	2026-10-22 11:58:56.117673	\N
5	50	2026-10-26 16:50:42.789166	\N
\.


--
-- TOC entry 5773 (class 0 OID 838714)
-- Dependencies: 762
-- Data for Name: resource; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.resource (resource_id, resource_code, resource_name, resource_type, service_name, api_path, http_method, frontend_route, parent_resource_id, description, is_active, created_at, created_by, updated_at, updated_by, display_order, icon, is_system) FROM stdin;
50	USER_ROLE_API	User wise Role API	API	user-management	/private/v1/user-roles	GET	\N	\N	Retrieves user role Mapping	t	2026-10-26 16:42:50.154026	\N	\N	\N	0	\N	t
1	DASHBOARD_MENU	Dashboard	MENU	\N	\N	\N	/dashboard	\N		t	2026-09-22 19:23:23.421	0	2026-09-22 13:53:22.646	0	1	dashboard	t
2	USER_MENAGEMENT_MENU	User Management	MENU	\N	\N	\N	/user-management	\N		t	2026-09-22 19:24:58.992	0	2026-09-22 13:54:58.948	0	2	manage_accounts	t
3	RESOURCE_MENU	Resource	MENU	\N	\N	\N	/user-management/resource	2		t	2026-09-22 19:26:41.726	0	2026-09-22 13:56:41.697	0	3	account_tree	t
4	ROLE_MENU	Role	MENU	\N	\N	\N	/user-management/role	2		t	2026-09-22 19:28:04.673	0	2026-09-22 13:58:04.644	0	5	badge	t
5	USERS_MENU	Users	MENU	\N	\N	\N	/user-management/users	2		t	2026-09-22 19:30:24.023	0	2026-09-22 14:00:23.991	0	6	person	t
6	SVAE_RESOURCE_API	Save Resource API	API	user-management	/private/v1/resources	POST	\N	\N		t	2026-09-22 19:54:39.046	0	2026-09-22 14:24:38.797	0	0	\N	t
7	MANAGE_RESOURCE_API	Manage Resource API	API	user-management	/private/v1/resources	GET	\N	\N		t	2026-09-22 19:58:49.933	0	2026-09-22 14:28:49.908	0	0	\N	t
11	ROLE_CREATE_API	ROLE CREATE API	API	user-management	/private/v1/roles	POST	\N	\N		t	2026-09-22 20:11:08.299	0	2026-09-22 14:41:08.27	0	0	\N	t
12	ROLE_LIST_API	ROLE LIST API	API	user-management	/private/v1/roles	GET	\N	\N		t	2026-09-22 20:12:30.495	0	2026-09-22 14:42:30.466	0	0	\N	t
14	ROLE_GET_BY_CODE_API	ROLE GET BY CODE API	API	user-management	/private/v1/roles/code/**	GET	\N	\N		t	2026-09-22 20:15:35.115	0	2026-09-22 14:45:35.094	0	0	\N	t
17	ROLE_TOGGLE_STATUS_API	ROLE TOGGLE STATUS API	API	user-management	/private/v1/roles/*/togglestatus	GET	\N	\N		t	2026-09-22 20:20:55.218	0	2026-09-22 14:50:55.193	0	0	\N	t
18	ROLE_ACTIVE_LIST_API	ROLE ACTIVE LIST API	API	user-management	/private/v1/roles/active	GET	\N	\N		t	2026-09-22 20:21:57.596	0	2026-09-22 14:51:57.566	0	0	\N	t
19	ROLE_BY_LEVEL_API	ROLE BY LEVEL API	API	user-management	/private/v1/roles/level/**	GET	\N	\N		t	2026-09-22 20:23:29.544	0	2026-09-22 14:53:29.514	0	0	\N	t
20	ROLE_BY_TYPE_API	ROLE BY TYPE API	API	user-management	/private/v1/roles/type/**	GET	\N	\N		t	2026-09-22 20:25:21.383	0	2026-09-22 14:55:21.364	0	0	\N	t
21	ROLE_HISTORY_API	ROLE HISTORY API	API	user-management	/private/v1/roles/*/history	GET	\N	\N		t	2026-09-22 20:26:32.291	0	2026-09-22 14:56:32.275	0	0	\N	t
22	ROLE_HISTORY_VERSION_API	ROLE HISTORY VERSION API	API	user-management	/private/v1/roles/*/history/version/**	GET	\N	\N		t	2026-09-22 20:27:50.873	0	2026-09-22 14:57:50.843	0	0	\N	t
23	USER_CREATE_API	Create User API	API	user-management	/private/v1/users	POST	\N	\N	Creates a new user	t	2026-09-22 21:11:52.592	\N	\N	\N	0	\N	t
28	USER_GET_BY_LOGIN_ID_API	Get User By Login ID API	API	user-management	/private/v1/users/loginid/**	GET	\N	\N	Retrieves a user by login ID	t	2026-09-22 21:11:52.592	0	2026-09-22 21:29:33.125	0	0	\N	t
29	ROLE_LEVEL_LIST_API	List Role Levels API	API	user-management	/private/v1/role-levels	GET	\N	\N	Retrieves all role levels	t	2026-09-22 21:33:47.8	\N	\N	\N	0	\N	t
25	USER_GET_API	Get User API	API	user-management	/private/v1/users/{id}	GET	\N	\N	Retrieves a user by user ID	t	2026-09-22 21:11:52.592	0	2026-09-22 21:28:34.13	0	0	\N	t
26	USER_UPDATE_API	Update User API	API	user-management	/private/v1/users/update	POST	\N	\N	Updates an existing user	t	2026-09-22 21:11:52.592	0	2026-09-22 21:28:53.446	0	0	\N	t
27	USER_DELETE_API	Delete User API	API	user-management	/private/v1/users/delete/{id}	POST	\N	\N	Deletes a user	t	2026-09-22 21:11:52.592	0	2026-09-22 21:29:13.044	0	0	\N	t
9	DELETE_RESOURCE_API	Delete Resource API	API	user-management	/private/v1/resources/delete/{id}	POST	\N	\N		t	2026-09-22 20:03:33.697	0	2026-09-22 14:33:33.675	0	0	\N	t
10	FETCH_RESOURCE_API	Fetch Resource API	API	user-management	/private/v1/resources/{id}	GET	\N	\N		t	2026-09-22 20:07:18.834	0	2026-09-22 14:37:18.811	0	0	\N	t
13	ROLE_GET_API	ROLE GET API	API	user-management	/private/v1/roles/{id}	GET	\N	\N		t	2026-09-22 20:13:35.897	0	2026-09-22 14:43:35.859	0	0	\N	t
15	ROLE_UPDATE_API	ROLE UPDATE API	API	user-management	/private/v1/roles/update	POST	\N	\N		t	2026-09-22 20:17:02.038	0	2026-09-22 14:47:02.014	0	0	\N	t
16	ROLE_DELETE_API	ROLE DELETE API	API	user-management	/private/v1/roles/delete/{id}	POST	\N	\N		t	2026-09-22 20:18:42.435	0	2026-09-22 14:48:42.408	0	0	\N	t
8	UPDATE_RESOURCE_API	Update Resource API	API	user-management	/private/v1/resources/update/*	POST	\N	\N		t	2026-09-22 20:01:49.398	0	2026-09-22 20:02:14.331	0	0	\N	t
30	ROLE_TYPE_LIST_API	List Role Types API	API	user-management	/private/v1/role-types	GET	\N	\N	Retrieves all role types	t	2026-09-22 21:35:14.982	\N	\N	\N	0	\N	t
31	PRIVILEGE_MENU	Privilege 	MENU	\N	\N	\N	/user-management/privilege	2	\N	t	2026-09-23 19:51:40.164	0	2026-09-22 14:00:23.991	0	4	lock_person	t
32	CHANGE_PASSWORD	CHANGE PASSWORD	MENU	\N	\N	\N	/user-management/change-password	2		t	2026-09-24 20:19:02.504	0	2026-09-24 14:49:02.477	0	7	password	t
33	UM_PRIVILEGE_CREATE	Create Privilege	API	user-management-service	/private/v1/privileges	POST	\N	\N	Create a new privilege	t	2026-10-21 10:52:32.162	\N	\N	\N	1	\N	t
34	UM_PRIVILEGE_UPDATE	Update Privilege	API	user-management-service	/private/v1/privileges/update	POST	\N	\N	Update an existing privilege	t	2026-10-21 10:52:32.162	\N	\N	\N	2	\N	t
35	UM_PRIVILEGE_GET_BY_ID	Get Privilege By ID	API	user-management-service	/private/v1/privileges/{id}	GET	\N	\N	Retrieve privilege details by ID	t	2026-10-21 10:52:32.162	\N	\N	\N	3	\N	t
36	UM_PRIVILEGE_GET_ALL	Get All Privileges	API	user-management-service	/private/v1/privileges	GET	\N	\N	Retrieve all privileges	t	2026-10-21 10:52:32.162	\N	\N	\N	4	\N	t
37	UM_PRIVILEGE_DELETE	Delete Privilege	API	user-management-service	/private/v1/privileges/delete/{id}	POST	\N	\N	Delete a privilege if it is not assigned to a role	t	2026-10-21 10:52:32.162	\N	\N	\N	5	\N	t
24	USER_LIST_API	List Users API	API	user-management	/private/v1/users	GET	\N	\N	Retrieves all users	t	2026-09-22 21:11:52.592	\N	\N	\N	0	\N	t
\.


--
-- TOC entry 5775 (class 0 OID 838738)
-- Dependencies: 764
-- Data for Name: role; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.role (role_id, role_code, role_name, description, is_active, created_at, created_by, updated_at, updated_by, role_level_code, role_type_code, created_ip, updated_ip, is_system) FROM stdin;
1	user-admin	user admin		t	2026-09-23 22:36:07.317	\N	2026-09-24 21:01:07.291	\N	C	N	\N	::1	t
\.


--
-- TOC entry 5777 (class 0 OID 838764)
-- Dependencies: 766
-- Data for Name: role_history; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.role_history (role_history_id, role_id, version_no, role_code, role_name, description, role_level_code, role_type_code, is_active, action, changed_by, changed_ip, changed_at, change_reason) FROM stdin;
\.


--
-- TOC entry 5764 (class 0 OID 838634)
-- Dependencies: 753
-- Data for Name: role_level_master; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.role_level_master (role_level_code, role_level_name, description, display_order, is_active, created_at, created_by, updated_at, updated_by, created_ip, updated_ip) FROM stdin;
R	Revenue	Revenue level	1	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
P	PRI	Panchayati Raj Institution	2	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
U	ULB	Urban Local Body	3	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
T	Tehsil	Tehsil level	4	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
B	Block	Block level	5	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
S	SIO	SIO level	6	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
A	System Admin	System Administrator level	7	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
C	Center	Center level	8	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
E	Constitution	Constitution level	9	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
M	Super Admin	Super Administrator level	10	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
D	Department	Department level	11	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
X	DCO	DCO level	12	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
Y	RCI	RCI level	13	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
Z	Postal Division	Postal Division level	14	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
O	Other	Other role level	15	t	2026-09-19 05:55:27.736	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5779 (class 0 OID 838793)
-- Dependencies: 768
-- Data for Name: role_privilege; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.role_privilege (role_privilege_id, role_id, privilege_id, is_active, created_at, created_by, updated_at, updated_by, created_ip, updated_ip) FROM stdin;
1	1	1	t	2026-10-22 09:56:35.44929	\N	\N	\N	\N	\N
2	1	2	t	2026-10-22 09:56:35.452904	\N	\N	\N	\N	\N
3	1	3	t	2026-10-22 09:56:35.453799	\N	\N	\N	\N	\N
4	1	4	t	2026-10-22 09:56:35.455167	\N	\N	\N	\N	\N
5	1	5	t	2026-10-22 09:56:35.456147	\N	\N	\N	\N	\N
6	1	6	t	2026-10-22 09:56:35.457264	\N	\N	\N	\N	\N
7	1	7	t	2026-10-22 09:56:35.458039	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5765 (class 0 OID 838647)
-- Dependencies: 754
-- Data for Name: role_type_master; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.role_type_master (role_type_code, role_type_name, description, display_order, is_active, created_at, created_by, updated_at, updated_by, created_ip, updated_ip) FROM stdin;
C	Checker	Role responsible for checking/verification	1	t	2026-09-19 05:56:16.687	\N	\N	\N	\N	\N
M	Maker	Role responsible for creating/processing	2	t	2026-09-19 05:56:16.687	\N	\N	\N	\N	\N
N	None	Role without Maker/Checker classification	3	t	2026-09-19 05:56:16.687	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5767 (class 0 OID 838661)
-- Dependencies: 756
-- Data for Name: user_profile; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.user_profile (user_profile_id, user_profile_name, designation, mobile_no, email_id, state_code, created_by, created_on, modified_by, modified_on, user_id, is_email_verified, is_mobile_no_verified, maker_checker_status, login_time, ip_address, user_type, level, district_code, nodal_officer_id) FROM stdin;
\.


--
-- TOC entry 5781 (class 0 OID 838816)
-- Dependencies: 770
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.user_role_mapping (user_role_mapping_id, user_id, role_id, is_active, created_on, created_by, last_updated_on, last_updated_by, ip_created, ip_updated) FROM stdin;
1	1	1	t	2026-10-22 10:00:26.256474	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5784 (class 0 OID 839313)
-- Dependencies: 773
-- Data for Name: user_role_mapping_history; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.user_role_mapping_history (user_role_mapping_history_id, user_role_mapping_id, user_id, role_id, is_active, created_on, created_by, last_updated_on, last_updated_by, ip_created, ip_updated, operation_type, operation_on, operation_by, operation_ip, change_reason) FROM stdin;
\.


--
-- TOC entry 5769 (class 0 OID 838670)
-- Dependencies: 758
-- Data for Name: users; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.users (user_id, user_login_id, password_hash, state_code, district_code, specific_role_id, specific_org_unit_code, specific_admin_unit_entity_code, user_level, created_on, created_by, last_updated_on, last_updated_by, ip_created, ip_updated, is_active, is_deleted, is_system) FROM stdin;
1	CG-USER-ADMIN	$2a$10$YgI2BNHyaAJJAGQDORKJs.ydPuJobXMc5MdE8OlkFbg13.Nog9piq	\N	\N	1	\N	\N	Center	2026-09-23 22:48:53.145	\N	\N	\N	\N	\N	t	f	t
\.


--
-- TOC entry 5771 (class 0 OID 838694)
-- Dependencies: 760
-- Data for Name: users_history; Type: TABLE DATA; Schema: um; Owner: postgres
--

COPY um.users_history (user_history_id, user_id, user_login_id, password_hash, state_code, district_code, specific_role_id, specific_org_unit_code, specific_admin_unit_entity_code, user_level, is_active, is_deleted, user_created_on, user_created_by, user_last_updated_on, user_last_updated_by, operation_type, operation_on, operation_by, operation_ip, change_reason) FROM stdin;
\.


--
-- TOC entry 5800 (class 0 OID 0)
-- Dependencies: 751
-- Name: privilege_privilege_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.privilege_privilege_id_seq', 7, true);


--
-- TOC entry 5801 (class 0 OID 0)
-- Dependencies: 761
-- Name: resource_resource_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.resource_resource_id_seq', 50, true);


--
-- TOC entry 5802 (class 0 OID 0)
-- Dependencies: 765
-- Name: role_history_role_history_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.role_history_role_history_id_seq', 1, false);


--
-- TOC entry 5803 (class 0 OID 0)
-- Dependencies: 767
-- Name: role_privilege_role_privilege_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.role_privilege_role_privilege_id_seq', 7, true);


--
-- TOC entry 5804 (class 0 OID 0)
-- Dependencies: 763
-- Name: role_role_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.role_role_id_seq', 1, true);


--
-- TOC entry 5805 (class 0 OID 0)
-- Dependencies: 755
-- Name: user_profile_user_profile_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.user_profile_user_profile_id_seq', 1, false);


--
-- TOC entry 5806 (class 0 OID 0)
-- Dependencies: 772
-- Name: user_role_mapping_history_user_role_mapping_history_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.user_role_mapping_history_user_role_mapping_history_id_seq', 1, false);


--
-- TOC entry 5807 (class 0 OID 0)
-- Dependencies: 769
-- Name: user_role_mapping_user_role_mapping_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.user_role_mapping_user_role_mapping_id_seq', 1, true);


--
-- TOC entry 5808 (class 0 OID 0)
-- Dependencies: 759
-- Name: users_history_user_history_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.users_history_user_history_id_seq', 1, false);


--
-- TOC entry 5809 (class 0 OID 0)
-- Dependencies: 757
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: um; Owner: postgres
--

SELECT pg_catalog.setval('um.users_user_id_seq', 1, true);


--
-- TOC entry 5605 (class 2606 OID 838846)
-- Name: privilege_resource pk_privilege_resource; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.privilege_resource
    ADD CONSTRAINT pk_privilege_resource PRIMARY KEY (privilege_id, resource_id);


--
-- TOC entry 5544 (class 2606 OID 838631)
-- Name: privilege privilege_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.privilege
    ADD CONSTRAINT privilege_pkey PRIMARY KEY (privilege_id);


--
-- TOC entry 5580 (class 2606 OID 838728)
-- Name: resource resource_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.resource
    ADD CONSTRAINT resource_pkey PRIMARY KEY (resource_id);


--
-- TOC entry 5590 (class 2606 OID 838774)
-- Name: role_history role_history_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_history
    ADD CONSTRAINT role_history_pkey PRIMARY KEY (role_history_id);


--
-- TOC entry 5548 (class 2606 OID 838644)
-- Name: role_level_master role_level_master_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_level_master
    ADD CONSTRAINT role_level_master_pkey PRIMARY KEY (role_level_code);


--
-- TOC entry 5584 (class 2606 OID 838748)
-- Name: role role_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);


--
-- TOC entry 5594 (class 2606 OID 838802)
-- Name: role_privilege role_privilege_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_privilege
    ADD CONSTRAINT role_privilege_pkey PRIMARY KEY (role_privilege_id);


--
-- TOC entry 5552 (class 2606 OID 838657)
-- Name: role_type_master role_type_master_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_type_master
    ADD CONSTRAINT role_type_master_pkey PRIMARY KEY (role_type_code);


--
-- TOC entry 5546 (class 2606 OID 838633)
-- Name: privilege uk_privilege_code; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.privilege
    ADD CONSTRAINT uk_privilege_code UNIQUE (privilege_code);


--
-- TOC entry 5582 (class 2606 OID 838730)
-- Name: resource uk_resource_code; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.resource
    ADD CONSTRAINT uk_resource_code UNIQUE (resource_code);


--
-- TOC entry 5586 (class 2606 OID 838750)
-- Name: role uk_role_code; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role
    ADD CONSTRAINT uk_role_code UNIQUE (role_code);


--
-- TOC entry 5592 (class 2606 OID 838776)
-- Name: role_history uk_role_history_version; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_history
    ADD CONSTRAINT uk_role_history_version UNIQUE (role_id, version_no);


--
-- TOC entry 5550 (class 2606 OID 838646)
-- Name: role_level_master uk_role_level_name; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_level_master
    ADD CONSTRAINT uk_role_level_name UNIQUE (role_level_name);


--
-- TOC entry 5588 (class 2606 OID 838752)
-- Name: role uk_role_name; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role
    ADD CONSTRAINT uk_role_name UNIQUE (role_name);


--
-- TOC entry 5554 (class 2606 OID 838659)
-- Name: role_type_master uk_role_type_name; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_type_master
    ADD CONSTRAINT uk_role_type_name UNIQUE (role_type_name);


--
-- TOC entry 5601 (class 2606 OID 838827)
-- Name: user_role_mapping uk_user_role; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.user_role_mapping
    ADD CONSTRAINT uk_user_role UNIQUE (user_id, role_id);


--
-- TOC entry 5565 (class 2606 OID 838685)
-- Name: users uk_users_login_id; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.users
    ADD CONSTRAINT uk_users_login_id UNIQUE (user_login_id);


--
-- TOC entry 5596 (class 2606 OID 838804)
-- Name: role_privilege uq_role_privilege; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_privilege
    ADD CONSTRAINT uq_role_privilege UNIQUE (role_id, privilege_id);


--
-- TOC entry 5556 (class 2606 OID 838668)
-- Name: user_profile user_profile_pk; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.user_profile
    ADD CONSTRAINT user_profile_pk PRIMARY KEY (user_profile_id);


--
-- TOC entry 5610 (class 2606 OID 839322)
-- Name: user_role_mapping_history user_role_mapping_history_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.user_role_mapping_history
    ADD CONSTRAINT user_role_mapping_history_pkey PRIMARY KEY (user_role_mapping_history_id);


--
-- TOC entry 5603 (class 2606 OID 838825)
-- Name: user_role_mapping user_role_mapping_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.user_role_mapping
    ADD CONSTRAINT user_role_mapping_pkey PRIMARY KEY (user_role_mapping_id);


--
-- TOC entry 5577 (class 2606 OID 838704)
-- Name: users_history users_history_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.users_history
    ADD CONSTRAINT users_history_pkey PRIMARY KEY (user_history_id);


--
-- TOC entry 5567 (class 2606 OID 838683)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5578 (class 1259 OID 838736)
-- Name: idx_resource_parent_order; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_resource_parent_order ON um.resource USING btree (parent_resource_id, display_order);


--
-- TOC entry 5606 (class 1259 OID 839325)
-- Name: idx_urm_hist_mapping_id; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_urm_hist_mapping_id ON um.user_role_mapping_history USING btree (user_role_mapping_id);


--
-- TOC entry 5607 (class 1259 OID 839324)
-- Name: idx_urm_hist_role_id; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_urm_hist_role_id ON um.user_role_mapping_history USING btree (role_id);


--
-- TOC entry 5608 (class 1259 OID 839323)
-- Name: idx_urm_hist_user_id; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_urm_hist_user_id ON um.user_role_mapping_history USING btree (user_id);


--
-- TOC entry 5597 (class 1259 OID 838838)
-- Name: idx_user_role_mapping_active; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_user_role_mapping_active ON um.user_role_mapping USING btree (is_active) WHERE (is_active = true);


--
-- TOC entry 5598 (class 1259 OID 838839)
-- Name: idx_user_role_mapping_role; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_user_role_mapping_role ON um.user_role_mapping USING btree (role_id);


--
-- TOC entry 5599 (class 1259 OID 838840)
-- Name: idx_user_role_mapping_user; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_user_role_mapping_user ON um.user_role_mapping USING btree (user_id);


--
-- TOC entry 5557 (class 1259 OID 838686)
-- Name: idx_users_active; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_active ON um.users USING btree (is_active) WHERE (is_active = true);


--
-- TOC entry 5558 (class 1259 OID 838687)
-- Name: idx_users_active_not_deleted; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_active_not_deleted ON um.users USING btree (user_login_id) WHERE ((is_active = true) AND (is_deleted = false));


--
-- TOC entry 5559 (class 1259 OID 838688)
-- Name: idx_users_admin_unit_entity; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_admin_unit_entity ON um.users USING btree (specific_admin_unit_entity_code);


--
-- TOC entry 5560 (class 1259 OID 838689)
-- Name: idx_users_district_code; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_district_code ON um.users USING btree (district_code);


--
-- TOC entry 5568 (class 1259 OID 838705)
-- Name: idx_users_history_district_code; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_history_district_code ON um.users_history USING btree (district_code);


--
-- TOC entry 5569 (class 1259 OID 838706)
-- Name: idx_users_history_login_id; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_history_login_id ON um.users_history USING btree (user_login_id);


--
-- TOC entry 5570 (class 1259 OID 838707)
-- Name: idx_users_history_operation_by; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_history_operation_by ON um.users_history USING btree (operation_by);


--
-- TOC entry 5571 (class 1259 OID 838708)
-- Name: idx_users_history_operation_on; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_history_operation_on ON um.users_history USING btree (operation_on);


--
-- TOC entry 5572 (class 1259 OID 838709)
-- Name: idx_users_history_operation_type; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_history_operation_type ON um.users_history USING btree (operation_type);


--
-- TOC entry 5573 (class 1259 OID 838710)
-- Name: idx_users_history_role; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_history_role ON um.users_history USING btree (specific_role_id);


--
-- TOC entry 5574 (class 1259 OID 838711)
-- Name: idx_users_history_state_code; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_history_state_code ON um.users_history USING btree (state_code);


--
-- TOC entry 5575 (class 1259 OID 838712)
-- Name: idx_users_history_user_id; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_history_user_id ON um.users_history USING btree (user_id);


--
-- TOC entry 5561 (class 1259 OID 838690)
-- Name: idx_users_org_unit; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_org_unit ON um.users USING btree (specific_org_unit_code);


--
-- TOC entry 5562 (class 1259 OID 838691)
-- Name: idx_users_specific_role; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_specific_role ON um.users USING btree (specific_role_id);


--
-- TOC entry 5563 (class 1259 OID 838692)
-- Name: idx_users_state_code; Type: INDEX; Schema: um; Owner: postgres
--

CREATE INDEX idx_users_state_code ON um.users USING btree (state_code);


--
-- TOC entry 5621 (class 2606 OID 838847)
-- Name: privilege_resource fk_pr_resource_privilege; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.privilege_resource
    ADD CONSTRAINT fk_pr_resource_privilege FOREIGN KEY (privilege_id) REFERENCES um.privilege(privilege_id) ON DELETE CASCADE;


--
-- TOC entry 5622 (class 2606 OID 838852)
-- Name: privilege_resource fk_pr_resource_resource; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.privilege_resource
    ADD CONSTRAINT fk_pr_resource_resource FOREIGN KEY (resource_id) REFERENCES um.resource(resource_id) ON DELETE CASCADE;


--
-- TOC entry 5611 (class 2606 OID 838731)
-- Name: resource fk_resource_parent; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.resource
    ADD CONSTRAINT fk_resource_parent FOREIGN KEY (parent_resource_id) REFERENCES um.resource(resource_id);


--
-- TOC entry 5614 (class 2606 OID 838777)
-- Name: role_history fk_role_history_level; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_history
    ADD CONSTRAINT fk_role_history_level FOREIGN KEY (role_level_code) REFERENCES um.role_level_master(role_level_code);


--
-- TOC entry 5615 (class 2606 OID 838782)
-- Name: role_history fk_role_history_role; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_history
    ADD CONSTRAINT fk_role_history_role FOREIGN KEY (role_id) REFERENCES um.role(role_id);


--
-- TOC entry 5616 (class 2606 OID 838787)
-- Name: role_history fk_role_history_type; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_history
    ADD CONSTRAINT fk_role_history_type FOREIGN KEY (role_type_code) REFERENCES um.role_type_master(role_type_code);


--
-- TOC entry 5612 (class 2606 OID 838753)
-- Name: role fk_role_level; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role
    ADD CONSTRAINT fk_role_level FOREIGN KEY (role_level_code) REFERENCES um.role_level_master(role_level_code);


--
-- TOC entry 5617 (class 2606 OID 838805)
-- Name: role_privilege fk_role_privilege_privilege; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_privilege
    ADD CONSTRAINT fk_role_privilege_privilege FOREIGN KEY (privilege_id) REFERENCES um.privilege(privilege_id);


--
-- TOC entry 5618 (class 2606 OID 838810)
-- Name: role_privilege fk_role_privilege_role; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role_privilege
    ADD CONSTRAINT fk_role_privilege_role FOREIGN KEY (role_id) REFERENCES um.role(role_id);


--
-- TOC entry 5613 (class 2606 OID 838758)
-- Name: role fk_role_type; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.role
    ADD CONSTRAINT fk_role_type FOREIGN KEY (role_type_code) REFERENCES um.role_type_master(role_type_code);


--
-- TOC entry 5619 (class 2606 OID 838828)
-- Name: user_role_mapping fk_user_role_mapping_role; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.user_role_mapping
    ADD CONSTRAINT fk_user_role_mapping_role FOREIGN KEY (role_id) REFERENCES um.role(role_id);


--
-- TOC entry 5620 (class 2606 OID 838833)
-- Name: user_role_mapping fk_user_role_mapping_user; Type: FK CONSTRAINT; Schema: um; Owner: postgres
--

ALTER TABLE ONLY um.user_role_mapping
    ADD CONSTRAINT fk_user_role_mapping_user FOREIGN KEY (user_id) REFERENCES um.users(user_id);


-- Completed on 2026-10-27 11:03:04

--
-- PostgreSQL database dump complete
--

\unrestrict 2NvhT2nUX6SRP7YoDbm9FzzGfZSweCKMXZKT5zWNnqTchZFUAZO8eGDzStOiI9U

