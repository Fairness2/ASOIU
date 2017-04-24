--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.1
-- Dumped by pg_dump version 9.5.1

-- Started on 2017-04-25 00:48:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12355)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2394 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 649 (class 1247 OID 39990)
-- Name: enum_Log_action; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "enum_Log_action" AS ENUM (
    'insert',
    'create',
    'update',
    'delete'
);


ALTER TYPE "enum_Log_action" OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 192 (class 1259 OID 39778)
-- Name: CostItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "CostItem" (
    id uuid NOT NULL,
    "parentId" uuid,
    "frcId" uuid NOT NULL,
    name character varying(60) NOT NULL
);


ALTER TABLE "CostItem" OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 39837)
-- Name: CurrentRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "CurrentRequest" (
    id uuid NOT NULL,
    number integer NOT NULL,
    "requestId" uuid NOT NULL,
    "periodId" uuid NOT NULL,
    year integer NOT NULL
);


ALTER TABLE "CurrentRequest" OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 39868)
-- Name: CurrentRequestItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "CurrentRequestItem" (
    "currentRequestId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE "CurrentRequestItem" OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 39835)
-- Name: CurrentRequest_number_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "CurrentRequest_number_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "CurrentRequest_number_seq" OWNER TO postgres;

--
-- TOC entry 2395 (class 0 OID 0)
-- Dependencies: 198
-- Name: CurrentRequest_number_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "CurrentRequest_number_seq" OWNED BY "CurrentRequest".number;


--
-- TOC entry 202 (class 1259 OID 39886)
-- Name: Department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Department" (
    id uuid NOT NULL,
    "fullName" character varying(200) NOT NULL,
    "shortName" character varying(50) NOT NULL
);


ALTER TABLE "Department" OWNER TO postgres;

--
-- TOC entry 193 (class 1259 OID 39796)
-- Name: Employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Employee" (
    id uuid NOT NULL,
    "fullName" character varying(300) NOT NULL,
    sex boolean NOT NULL,
    "birthDate" date NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE "Employee" OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 40046)
-- Name: EmployeeDepartment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "EmployeeDepartment" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "departmentId" uuid NOT NULL,
    "employeeId" uuid NOT NULL
);


ALTER TABLE "EmployeeDepartment" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 40170)
-- Name: Estimate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Estimate" (
    id uuid NOT NULL,
    number integer NOT NULL,
    name character varying(50) NOT NULL,
    "frcId" uuid,
    year integer NOT NULL,
    "approvalDate" date,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE "Estimate" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 40185)
-- Name: EstimateEstimate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "EstimateEstimate" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "companyEstimateId" uuid NOT NULL,
    "frcEstimateId" uuid NOT NULL
);


ALTER TABLE "EstimateEstimate" OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 39908)
-- Name: EstimateItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "EstimateItem" (
    id uuid NOT NULL,
    "estimateId" uuid,
    "costItemId" uuid
);


ALTER TABLE "EstimateItem" OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 39924)
-- Name: EstimateItemValue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "EstimateItemValue" (
    "estimateItemId" uuid NOT NULL,
    "periodId" uuid NOT NULL,
    value numeric(15,2) DEFAULT 0 NOT NULL
);


ALTER TABLE "EstimateItemValue" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 40168)
-- Name: Estimate_number_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "Estimate_number_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Estimate_number_seq" OWNER TO postgres;

--
-- TOC entry 2396 (class 0 OID 0)
-- Dependencies: 219
-- Name: Estimate_number_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "Estimate_number_seq" OWNED BY "Estimate".number;


--
-- TOC entry 205 (class 1259 OID 39941)
-- Name: Expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Expense" (
    id uuid NOT NULL,
    "costItemId" uuid NOT NULL,
    "periodId" uuid NOT NULL,
    date date NOT NULL,
    value numeric(15,2) NOT NULL
);


ALTER TABLE "Expense" OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 39773)
-- Name: FRC; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "FRC" (
    id uuid NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE "FRC" OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 39958)
-- Name: Limit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Limit" (
    "costItemId" uuid NOT NULL,
    "periodId" uuid NOT NULL,
    year integer NOT NULL,
    total numeric(15,2) NOT NULL,
    remain numeric(15,2) DEFAULT 0.01 NOT NULL
);


ALTER TABLE "Limit" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 40153)
-- Name: Log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Log" (
    id uuid NOT NULL,
    ts timestamp with time zone NOT NULL,
    "userId" uuid,
    model character varying(40) NOT NULL,
    "rowId" json NOT NULL,
    action "enum_Log_action" NOT NULL,
    diff json NOT NULL
);


ALTER TABLE "Log" OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 39823)
-- Name: Period; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Period" (
    id uuid NOT NULL,
    "typeId" uuid NOT NULL,
    name character varying(20) NOT NULL,
    number integer DEFAULT 0 NOT NULL
);


ALTER TABLE "Period" OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 39817)
-- Name: PeriodType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "PeriodType" (
    id uuid NOT NULL,
    name character varying(20) NOT NULL,
    length integer DEFAULT 0 NOT NULL
);


ALTER TABLE "PeriodType" OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 40010)
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Permission" (
    id uuid NOT NULL,
    name character varying(40) NOT NULL
);


ALTER TABLE "Permission" OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 39856)
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Product" (
    id uuid NOT NULL,
    "costItemId" uuid NOT NULL,
    name character varying(50) NOT NULL,
    price numeric(15,2) DEFAULT 0 NOT NULL
);


ALTER TABLE "Product" OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 39804)
-- Name: Request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Request" (
    id uuid NOT NULL,
    number integer NOT NULL,
    "requesterId" uuid NOT NULL,
    year integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE "Request" OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 40061)
-- Name: RequestEstimate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "RequestEstimate" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "estimateId" uuid NOT NULL,
    "requestId" uuid NOT NULL
);


ALTER TABLE "RequestEstimate" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 40250)
-- Name: RequestItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "RequestItem" (
    "requestId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    "periodId" uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE "RequestItem" OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 39802)
-- Name: Request_number_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "Request_number_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Request_number_seq" OWNER TO postgres;

--
-- TOC entry 2397 (class 0 OID 0)
-- Dependencies: 194
-- Name: Request_number_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "Request_number_seq" OWNED BY "Request".number;


--
-- TOC entry 209 (class 1259 OID 40039)
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Role" (
    id uuid NOT NULL,
    name character varying(40) NOT NULL
);


ALTER TABLE "Role" OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 40076)
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "RolePermission" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "permissionId" uuid NOT NULL,
    "roleId" uuid NOT NULL
);


ALTER TABLE "RolePermission" OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 39976)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "User" (
    id uuid NOT NULL,
    username character varying(50) NOT NULL,
    password character(60) NOT NULL,
    "employeeId" uuid NOT NULL
);


ALTER TABLE "User" OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 40091)
-- Name: UserRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "UserRole" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "roleId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE "UserRole" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 40125)
-- Name: revision-changes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "revision-changes" (
    id integer NOT NULL,
    path text NOT NULL,
    document json NOT NULL,
    diff json NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "revisionId" integer
);


ALTER TABLE "revision-changes" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 40123)
-- Name: revision-changes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "revision-changes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "revision-changes_id_seq" OWNER TO postgres;

--
-- TOC entry 2398 (class 0 OID 0)
-- Dependencies: 216
-- Name: revision-changes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "revision-changes_id_seq" OWNED BY "revision-changes".id;


--
-- TOC entry 215 (class 1259 OID 40114)
-- Name: revisions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE revisions (
    id integer NOT NULL,
    model text NOT NULL,
    "documentId" uuid NOT NULL,
    revision integer NOT NULL,
    document json NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE revisions OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 40112)
-- Name: revisions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE revisions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE revisions_id_seq OWNER TO postgres;

--
-- TOC entry 2399 (class 0 OID 0)
-- Dependencies: 214
-- Name: revisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE revisions_id_seq OWNED BY revisions.id;


--
-- TOC entry 2112 (class 2604 OID 39840)
-- Name: number; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CurrentRequest" ALTER COLUMN number SET DEFAULT nextval('"CurrentRequest_number_seq"'::regclass);


--
-- TOC entry 2119 (class 2604 OID 40173)
-- Name: number; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Estimate" ALTER COLUMN number SET DEFAULT nextval('"Estimate_number_seq"'::regclass);


--
-- TOC entry 2109 (class 2604 OID 39807)
-- Name: number; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Request" ALTER COLUMN number SET DEFAULT nextval('"Request_number_seq"'::regclass);


--
-- TOC entry 2118 (class 2604 OID 40128)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "revision-changes" ALTER COLUMN id SET DEFAULT nextval('"revision-changes_id_seq"'::regclass);


--
-- TOC entry 2117 (class 2604 OID 40117)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY revisions ALTER COLUMN id SET DEFAULT nextval('revisions_id_seq'::regclass);


--
-- TOC entry 2356 (class 0 OID 39778)
-- Dependencies: 192
-- Data for Name: CostItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "CostItem" (id, "parentId", "frcId", name) FROM stdin;
590eacc4-f741-4b14-91ed-5e6ef47a00d7	\N	e5259b55-87b3-4fe1-8e4b-be05eb3976a3	asbdafsdf
0226754a-252f-400f-8da0-6bb3b7bebc40	\N	e5259b55-87b3-4fe1-8e4b-be05eb3976a3	asbdafsdf
f97894a9-8d34-47bb-b7a0-484f7fdbcfd2	\N	e5259b55-87b3-4fe1-8e4b-be05eb3976a3	стройматериалы
1bba0c91-df19-4163-9391-6615752dec83	\N	e5259b55-87b3-4fe1-8e4b-be05eb3976a3	продукты питания
e673869f-f07d-4c6d-baab-b9ea50434df5	\N	3d07fca4-e7bd-4917-a47f-f8c0ce0e18d5	проги
11ed8a98-8167-4c28-8d6c-cec0056219fb	\N	3d07fca4-e7bd-4917-a47f-f8c0ce0e18d5	блаа
\.


--
-- TOC entry 2363 (class 0 OID 39837)
-- Dependencies: 199
-- Data for Name: CurrentRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "CurrentRequest" (id, number, "requestId", "periodId", year) FROM stdin;
\.


--
-- TOC entry 2365 (class 0 OID 39868)
-- Dependencies: 201
-- Data for Name: CurrentRequestItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "CurrentRequestItem" ("currentRequestId", "productId", quantity) FROM stdin;
\.


--
-- TOC entry 2400 (class 0 OID 0)
-- Dependencies: 198
-- Name: CurrentRequest_number_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"CurrentRequest_number_seq"', 1, false);


--
-- TOC entry 2366 (class 0 OID 39886)
-- Dependencies: 202
-- Data for Name: Department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Department" (id, "fullName", "shortName") FROM stdin;
6fb5ea44-f8d5-468f-87f7-4113c8e31b85	1 dep132	11вапав233
930d1463-92bb-4dae-817e-7ea7d8d2dd1f	1 dep	1
c1a1530c-b730-4bf6-9b59-1d45c056ce36	1 dep2	2
992d7707-dad4-4ada-87f4-399a1258f2e5	3 dep	3
04204429-3656-4a17-aa0e-22ff48a2c86e	Отдел 0	О0
\.


--
-- TOC entry 2357 (class 0 OID 39796)
-- Dependencies: 193
-- Data for Name: Employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Employee" (id, "fullName", sex, "birthDate", "createdAt", "updatedAt") FROM stdin;
6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7	admin2	t	2000-01-01	2017-04-21 11:11:14.206+05	2017-04-21 11:11:14.206+05
c1175b94-4c96-4537-9ebf-ef4e0c961f59	admin2	t	2000-01-01	2017-04-21 11:13:31.125+05	2017-04-21 11:13:31.125+05
9041fdc2-b21b-4415-8898-7a74be54c7b0	admin2	t	2000-01-01	2017-04-21 11:14:02.875+05	2017-04-21 11:14:02.875+05
9372dce0-1ee9-4ee8-988d-23f31020ab3b	admin2	t	2000-01-01	2017-04-21 11:14:40.834+05	2017-04-21 11:14:40.834+05
f1b94600-c28a-43bc-bb36-9bd952584237	admin2	t	2000-01-01	2017-04-21 11:17:35.597+05	2017-04-21 11:17:35.597+05
c4542c16-78c9-40b0-a15a-53faa6475357	admin2	t	2000-01-01	2017-04-21 11:18:43.127+05	2017-04-21 11:18:43.127+05
a3136831-be63-4feb-a014-a3aa392b3d9c	admin2	t	2000-01-01	2017-04-21 11:21:17.117+05	2017-04-21 11:21:17.117+05
209c2874-ad30-42bc-afbf-b4bcbc63fb2b	admin2	t	2000-01-01	2017-04-21 11:21:51.625+05	2017-04-21 11:21:51.625+05
1b4ea867-bf13-479d-9a92-8461ba34d97f	admin2	t	2000-01-01	2017-04-21 11:22:21.019+05	2017-04-21 11:22:21.019+05
c3523f28-0a47-404e-a98d-0a9460c7a75a	admin2	t	2000-01-01	2017-04-21 11:22:42.209+05	2017-04-21 11:22:42.209+05
d8314cf8-6b5b-43b0-9ad9-e312036d823c	admin2	t	2000-01-01	2017-04-21 11:26:10.169+05	2017-04-21 11:26:10.169+05
41b6a9e6-2fae-4da4-8794-c9e476b4d47e	admin2	t	2000-01-01	2017-04-21 11:31:29.632+05	2017-04-21 11:31:29.632+05
04f79b3a-66e8-4555-a9d3-3a2b3c863834	admin2	t	2000-01-01	2017-04-21 11:32:24.843+05	2017-04-21 11:32:24.843+05
9ac1d389-64fc-4c05-bb68-14c657d20e1f	admin2	t	2000-01-01	2017-04-21 12:47:49.019+05	2017-04-21 12:47:49.019+05
2e747f15-f21d-4277-9214-949c1f7c9734	admin2	t	2000-01-01	2017-04-21 12:50:34.396+05	2017-04-21 12:50:34.396+05
3dd76bb8-fbe6-4a80-95ea-4dac199c47bd	admin2	t	2000-01-01	2017-04-21 12:53:10.117+05	2017-04-21 12:53:10.117+05
21dd9f64-b340-45c0-9ddc-d00b691a5a51	admin2	t	2000-01-01	2017-04-21 12:56:15.673+05	2017-04-21 12:56:15.673+05
e9e4ba71-e5d5-4479-b6d4-f9d85c04e277	admin2	t	2000-01-01	2017-04-21 12:57:50.136+05	2017-04-21 12:57:50.136+05
a43d5637-ea3f-4955-ac0d-085342b4f2d8	admin2	t	2000-01-01	2017-04-21 12:58:17.162+05	2017-04-21 12:58:17.162+05
8b47db5d-b202-4217-b867-650fce2e063a	admsdfsdfin2	t	2000-01-01	2017-04-21 13:03:58.844+05	2017-04-21 13:03:58.844+05
faa905a5-65e5-4e54-914a-761cf4416a1a	admsdfsdfin2	t	2000-01-01	2017-04-21 12:59:22.859+05	2017-04-21 15:32:34.016+05
93707b45-e273-4e14-ac10-e30d5530758f	avsdsv	t	0199-12-31	2017-04-21 22:22:41.79+05	2017-04-21 22:22:41.79+05
bf240510-ae93-4412-b3fe-8738906eca35	avsdsv	t	0199-12-31	2017-04-21 22:26:08.092+05	2017-04-21 22:26:08.092+05
0a21fd29-2af7-4b06-8142-e7f087401200	avsdsv	t	0199-12-31	2017-04-21 22:27:39.376+05	2017-04-21 22:27:39.376+05
c647b4b0-1466-4b33-a102-cb0ef84ca33d	avsdsv	t	0199-12-31	2017-04-21 22:30:52.597+05	2017-04-21 22:30:52.597+05
bd955215-1cfa-4a6f-9b6c-643ddef56502	avsdsv	t	0199-12-31	2017-04-21 22:33:48.878+05	2017-04-21 22:33:48.878+05
c8f0bbd5-e219-4e89-990b-f4abdf68edd2	avsdsv	t	0199-12-31	2017-04-21 22:33:53.304+05	2017-04-21 22:33:53.304+05
41f82a75-9e7b-472a-a66c-260d47047dca	avsdsv	t	0199-12-31	2017-04-21 22:46:16.616+05	2017-04-21 22:46:16.616+05
260ce65a-84ab-47cd-b12e-523b0b6008f9	avsdsv	t	0199-12-31	2017-04-21 22:46:51.855+05	2017-04-21 22:46:51.855+05
9fd1ccaa-2d9f-4e4c-9394-201ea0972563	avsdsv	t	0199-12-31	2017-04-21 22:47:12.497+05	2017-04-21 22:47:12.497+05
d5529749-54f8-4d19-a599-61b977bc161d	avsdsv	t	0199-12-31	2017-04-21 23:11:32.92+05	2017-04-21 23:11:32.92+05
36fffcf8-d6ae-4e6c-852e-63020fb9597f	avsdsv	t	0199-12-31	2017-04-21 22:35:02.822+05	2017-04-21 23:18:39.716+05
37b1809e-468c-4d52-ac0f-78daf214ca07	avsdggsv	t	0199-12-31	2017-04-21 23:19:00.113+05	2017-04-21 23:19:00.113+05
a3f408f2-541c-4d6d-a00b-21497769bd3b	avsdggsv	t	0199-12-31	2017-04-21 23:24:58.778+05	2017-04-21 23:24:58.778+05
8f050cc5-ee2d-45dd-924e-24d535377f9c	avsdggsv	t	0199-12-31	2017-04-21 23:27:12.408+05	2017-04-21 23:27:12.408+05
d09d058a-4102-494d-8bcc-ad3f9d65f5c7	avsdggsv	t	0199-12-31	2017-04-21 23:31:45.829+05	2017-04-21 23:31:45.829+05
370b9748-4e32-4c27-931e-9a5d2947d6cb	Иванов Иван Иванович	t	2000-01-01	2017-04-22 01:13:14.412+05	2017-04-22 01:13:14.412+05
34180da2-32b7-4dae-ad92-11ac779bbae5	Иванов Иван Иванович	t	2000-01-01	2017-04-22 01:14:23.488+05	2017-04-22 01:14:23.488+05
ef425668-3e7d-422e-9142-b362560d4f10	Иванов Иван Иванович	t	2000-01-01	2017-04-22 01:16:50.005+05	2017-04-22 01:16:50.005+05
f452611f-9035-4e5d-a33a-a3b188d24318	Иванов Иван Иванович	t	2000-01-01	2017-04-22 01:19:20.605+05	2017-04-22 01:19:20.605+05
23a770d3-c211-4f40-a9fc-a0b0b9c891b0	Иванов Иван Иванович	t	2000-01-01	2017-04-22 01:19:37.296+05	2017-04-22 01:19:37.296+05
b3481740-7d1e-4d75-b74f-b96ccb0c0554	Иванов Иван Иванович	t	2000-01-01	2017-04-22 01:20:09.883+05	2017-04-22 01:20:09.883+05
cc4da243-d47e-4a67-a5dd-882a37cd220e	Вася	t	1999-12-31	2017-04-20 22:23:00.991+05	2017-04-24 10:14:35.164+05
428413f2-ced0-47cc-8867-d5d1752dd77a	Ащьф Шмфтщмшср	t	0199-12-31	2017-04-12 20:41:25.735+05	2017-04-24 10:15:29.765+05
\.


--
-- TOC entry 2374 (class 0 OID 40046)
-- Dependencies: 210
-- Data for Name: EmployeeDepartment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "EmployeeDepartment" ("createdAt", "updatedAt", "departmentId", "employeeId") FROM stdin;
2017-04-21 22:46:51.86+05	2017-04-21 22:46:51.86+05	6fb5ea44-f8d5-468f-87f7-4113c8e31b85	260ce65a-84ab-47cd-b12e-523b0b6008f9
2017-04-21 22:46:51.86+05	2017-04-21 22:46:51.86+05	930d1463-92bb-4dae-817e-7ea7d8d2dd1f	260ce65a-84ab-47cd-b12e-523b0b6008f9
2017-04-21 23:12:35.606+05	2017-04-21 23:18:39.71+05	6fb5ea44-f8d5-468f-87f7-4113c8e31b85	36fffcf8-d6ae-4e6c-852e-63020fb9597f
2017-04-21 23:12:35.606+05	2017-04-21 23:18:39.71+05	c1a1530c-b730-4bf6-9b59-1d45c056ce36	36fffcf8-d6ae-4e6c-852e-63020fb9597f
2017-04-21 23:24:58.789+05	2017-04-21 23:24:58.789+05	6fb5ea44-f8d5-468f-87f7-4113c8e31b85	a3f408f2-541c-4d6d-a00b-21497769bd3b
2017-04-21 23:24:58.789+05	2017-04-21 23:24:58.789+05	c1a1530c-b730-4bf6-9b59-1d45c056ce36	a3f408f2-541c-4d6d-a00b-21497769bd3b
2017-04-21 23:27:12.42+05	2017-04-21 23:27:12.42+05	6fb5ea44-f8d5-468f-87f7-4113c8e31b85	8f050cc5-ee2d-45dd-924e-24d535377f9c
2017-04-21 23:27:12.42+05	2017-04-21 23:27:12.42+05	c1a1530c-b730-4bf6-9b59-1d45c056ce36	8f050cc5-ee2d-45dd-924e-24d535377f9c
2017-04-21 23:31:45.84+05	2017-04-21 23:31:45.84+05	6fb5ea44-f8d5-468f-87f7-4113c8e31b85	d09d058a-4102-494d-8bcc-ad3f9d65f5c7
2017-04-21 23:31:45.84+05	2017-04-21 23:31:45.84+05	c1a1530c-b730-4bf6-9b59-1d45c056ce36	d09d058a-4102-494d-8bcc-ad3f9d65f5c7
\.


--
-- TOC entry 2384 (class 0 OID 40170)
-- Dependencies: 220
-- Data for Name: Estimate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Estimate" (id, number, name, "frcId", year, "approvalDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 2385 (class 0 OID 40185)
-- Dependencies: 221
-- Data for Name: EstimateEstimate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "EstimateEstimate" ("createdAt", "updatedAt", "companyEstimateId", "frcEstimateId") FROM stdin;
\.


--
-- TOC entry 2367 (class 0 OID 39908)
-- Dependencies: 203
-- Data for Name: EstimateItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "EstimateItem" (id, "estimateId", "costItemId") FROM stdin;
\.


--
-- TOC entry 2368 (class 0 OID 39924)
-- Dependencies: 204
-- Data for Name: EstimateItemValue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "EstimateItemValue" ("estimateItemId", "periodId", value) FROM stdin;
\.


--
-- TOC entry 2401 (class 0 OID 0)
-- Dependencies: 219
-- Name: Estimate_number_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"Estimate_number_seq"', 1, false);


--
-- TOC entry 2369 (class 0 OID 39941)
-- Dependencies: 205
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Expense" (id, "costItemId", "periodId", date, value) FROM stdin;
\.


--
-- TOC entry 2355 (class 0 OID 39773)
-- Dependencies: 191
-- Data for Name: FRC; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "FRC" (id, name) FROM stdin;
e5259b55-87b3-4fe1-8e4b-be05eb3976a3	Материальное
3d07fca4-e7bd-4917-a47f-f8c0ce0e18d5	Не очень материальное
\.


--
-- TOC entry 2370 (class 0 OID 39958)
-- Dependencies: 206
-- Data for Name: Limit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Limit" ("costItemId", "periodId", year, total, remain) FROM stdin;
\.


--
-- TOC entry 2382 (class 0 OID 40153)
-- Dependencies: 218
-- Data for Name: Log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Log" (id, ts, "userId", model, "rowId", action, diff) FROM stdin;
36510b19-1362-449c-895d-9244eb88c5fe	2017-04-21 13:09:51+05	360132a2-ac20-469f-930a-43df019cf9aa	Employee	{"id":"faa905a5-65e5-4e54-914a-761cf4416a1a"}	update	{"old":{"birthDate":"1999-12-31T19:00:00.000Z","updatedAt":"2017-04-21T08:09:23.563Z"},"new":["birthDate","updatedAt"]}
e7204250-bfa0-46ae-984d-d30a89bf7d7a	2017-04-21 22:20:24+05	\N	Department	{"id":"6fb5ea44-f8d5-468f-87f7-4113c8e31b85"}	create	{"new":{"id":"6fb5ea44-f8d5-468f-87f7-4113c8e31b85","fullName":"1 dep132","shortName":"11вапав233"}}
c7166c5a-4e36-4038-bef0-9b67c1db6912	2017-04-21 22:20:43+05	\N	Department	{"id":"930d1463-92bb-4dae-817e-7ea7d8d2dd1f"}	create	{"new":{"id":"930d1463-92bb-4dae-817e-7ea7d8d2dd1f","fullName":"1 dep","shortName":"1"}}
237de091-01b0-40a5-886c-4b41d40088ab	2017-04-21 22:20:49+05	\N	Department	{"id":"c1a1530c-b730-4bf6-9b59-1d45c056ce36"}	create	{"new":{"id":"c1a1530c-b730-4bf6-9b59-1d45c056ce36","fullName":"1 dep2","shortName":"2"}}
88a150fa-04b2-4d41-8a28-604609388955	2017-04-21 22:20:55+05	\N	Department	{"id":"992d7707-dad4-4ada-87f4-399a1258f2e5"}	create	{"new":{"id":"992d7707-dad4-4ada-87f4-399a1258f2e5","fullName":"3 dep","shortName":"3"}}
6d736306-6527-41d0-93b6-48b0d3cf51ed	2017-04-21 22:22:41+05	\N	Employee	{"id":"93707b45-e273-4e14-ac10-e30d5530758f"}	create	{"new":{"id":"93707b45-e273-4e14-ac10-e30d5530758f","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","departments":[{"id":"6fb5ea44-f8d5-468f-87f7-4113c8e31b85","fullName":"1 dep132","shortName":"11вапав233"},{"id":"930d1463-92bb-4dae-817e-7ea7d8d2dd1f","fullName":"1 dep","shortName":"1"},{"id":"c1a1530c-b730-4bf6-9b59-1d45c056ce36","fullName":"1 dep2","shortName":"2"}],"updatedAt":"2017-04-21T17:22:41.790Z","createdAt":"2017-04-21T17:22:41.790Z"}}
b6c292f0-e691-4cc6-99fd-bbca89e7b2db	2017-04-21 22:26:08+05	\N	Employee	{"id":"bf240510-ae93-4412-b3fe-8738906eca35"}	create	{"new":{"id":"bf240510-ae93-4412-b3fe-8738906eca35","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T17:26:08.092Z","createdAt":"2017-04-21T17:26:08.092Z"}}
2a043d7a-95b3-4add-b9fc-cce82485505e	2017-04-21 22:27:39+05	\N	Employee	{"id":"0a21fd29-2af7-4b06-8142-e7f087401200"}	create	{"new":{"id":"0a21fd29-2af7-4b06-8142-e7f087401200","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T17:27:39.376Z","createdAt":"2017-04-21T17:27:39.376Z"}}
8e4f68c9-020e-4732-9fe5-f5d90321a7f4	2017-04-21 22:30:52+05	\N	Employee	{"id":"c647b4b0-1466-4b33-a102-cb0ef84ca33d"}	create	{"new":{"id":"c647b4b0-1466-4b33-a102-cb0ef84ca33d","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","departments":[{"id":"6fb5ea44-f8d5-468f-87f7-4113c8e31b85","fullName":"1 dep132","shortName":"11вапав233"},{"id":"930d1463-92bb-4dae-817e-7ea7d8d2dd1f","fullName":"1 dep","shortName":"1"},{"id":"c1a1530c-b730-4bf6-9b59-1d45c056ce36","fullName":"1 dep2","shortName":"2"}],"updatedAt":"2017-04-21T17:30:52.597Z","createdAt":"2017-04-21T17:30:52.597Z"}}
50a8a488-853c-4dea-87f4-90d1fef91f6e	2017-04-21 22:33:48+05	\N	Employee	{"id":"bd955215-1cfa-4a6f-9b6c-643ddef56502"}	create	{"new":{"id":"bd955215-1cfa-4a6f-9b6c-643ddef56502","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","departments":[{"id":"6fb5ea44-f8d5-468f-87f7-4113c8e31b85","fullName":"1 dep132","shortName":"11вапав233"},{"id":"930d1463-92bb-4dae-817e-7ea7d8d2dd1f","fullName":"1 dep","shortName":"1"},{"id":"c1a1530c-b730-4bf6-9b59-1d45c056ce36","fullName":"1 dep2","shortName":"2"}],"updatedAt":"2017-04-21T17:33:48.878Z","createdAt":"2017-04-21T17:33:48.878Z"}}
767bb362-f21c-4ee2-a52e-80fd703d0dc5	2017-04-21 22:33:53+05	\N	Employee	{"id":"c8f0bbd5-e219-4e89-990b-f4abdf68edd2"}	create	{"new":{"id":"c8f0bbd5-e219-4e89-990b-f4abdf68edd2","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","departments":[{"id":"6fb5ea44-f8d5-468f-87f7-4113c8e31b85","fullName":"1 dep132","shortName":"11вапав233"},{"id":"930d1463-92bb-4dae-817e-7ea7d8d2dd1f","fullName":"1 dep","shortName":"1"},{"id":"c1a1530c-b730-4bf6-9b59-1d45c056ce36","fullName":"1 dep2","shortName":"2"}],"updatedAt":"2017-04-21T17:33:53.304Z","createdAt":"2017-04-21T17:33:53.304Z"}}
c9bcb744-bf2d-4452-b105-084843df932b	2017-04-21 22:35:02+05	\N	Employee	{"id":"36fffcf8-d6ae-4e6c-852e-63020fb9597f"}	create	{"new":{"id":"36fffcf8-d6ae-4e6c-852e-63020fb9597f","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T17:35:02.822Z","createdAt":"2017-04-21T17:35:02.822Z"}}
cd0874e6-113a-42b5-bbb2-9f5884ebed6b	2017-04-21 22:46:16+05	\N	Employee	{"id":"41f82a75-9e7b-472a-a66c-260d47047dca"}	create	{"new":{"id":"41f82a75-9e7b-472a-a66c-260d47047dca","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T17:46:16.616Z","createdAt":"2017-04-21T17:46:16.616Z"}}
b42786cd-05fe-405c-97ec-2ae074a8479e	2017-04-21 22:46:51+05	\N	Employee	{"id":"260ce65a-84ab-47cd-b12e-523b0b6008f9"}	create	{"new":{"id":"260ce65a-84ab-47cd-b12e-523b0b6008f9","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T17:46:51.855Z","createdAt":"2017-04-21T17:46:51.855Z"}}
33384c0a-0eb5-4a07-954a-6fdd1f83eb5c	2017-04-21 22:47:12+05	\N	Employee	{"id":"9fd1ccaa-2d9f-4e4c-9394-201ea0972563"}	create	{"new":{"id":"9fd1ccaa-2d9f-4e4c-9394-201ea0972563","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T17:47:12.497Z","createdAt":"2017-04-21T17:47:12.497Z"}}
796cce0b-f9f7-47c5-8b98-cb30e2ddee85	2017-04-21 23:11:32+05	\N	Employee	{"id":"d5529749-54f8-4d19-a599-61b977bc161d"}	create	{"new":{"id":"d5529749-54f8-4d19-a599-61b977bc161d","fullName":"avsdsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T18:11:32.920Z","createdAt":"2017-04-21T18:11:32.920Z"}}
0d68c5e2-a78b-47a6-888b-23d394514c96	2017-04-21 23:11:44+05	\N	Employee	{"id":"36fffcf8-d6ae-4e6c-852e-63020fb9597f"}	update	{"old":{"birthDate":"0199-12-30T19:00:00.000Z"},"new":["birthDate"]}
dce82449-7eae-4313-8a24-c12cd4fa741b	2017-04-21 23:12:35+05	\N	Employee	{"id":"36fffcf8-d6ae-4e6c-852e-63020fb9597f"}	update	{"old":{"birthDate":"0199-12-30T19:00:00.000Z"},"new":["birthDate"]}
22d270d7-a429-43b3-996c-5de7066785a3	2017-04-21 23:13:54+05	\N	Employee	{"id":"36fffcf8-d6ae-4e6c-852e-63020fb9597f"}	update	{"old":{"birthDate":"0199-12-30T19:00:00.000Z"},"new":["birthDate"]}
f7999e46-3e08-4817-ad16-ec69b7b14276	2017-04-21 23:18:39+05	\N	Employee	{"id":"36fffcf8-d6ae-4e6c-852e-63020fb9597f"}	update	{"old":{"birthDate":"0199-12-30T19:00:00.000Z"},"new":["birthDate"]}
c3aa9d48-70c8-4bd7-af0f-972483b06be9	2017-04-21 23:19:00+05	\N	Employee	{"id":"37b1809e-468c-4d52-ac0f-78daf214ca07"}	create	{"new":{"id":"37b1809e-468c-4d52-ac0f-78daf214ca07","fullName":"avsdggsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T18:19:00.113Z","createdAt":"2017-04-21T18:19:00.113Z"}}
0d0c9ffc-51fe-4d8b-b8ab-4660b1696520	2017-04-21 23:24:58+05	\N	Employee	{"id":"a3f408f2-541c-4d6d-a00b-21497769bd3b"}	create	{"new":{"id":"a3f408f2-541c-4d6d-a00b-21497769bd3b","fullName":"avsdggsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T18:24:58.778Z","createdAt":"2017-04-21T18:24:58.778Z"}}
d1932ec2-05d8-4c75-9aec-07216bbf351d	2017-04-21 23:27:12+05	\N	Employee	{"id":"8f050cc5-ee2d-45dd-924e-24d535377f9c"}	create	{"new":{"id":"8f050cc5-ee2d-45dd-924e-24d535377f9c","fullName":"avsdggsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T18:27:12.408Z","createdAt":"2017-04-21T18:27:12.408Z"}}
b4c6f9e0-5350-4f70-a5d5-468b670fbbad	2017-04-21 23:31:45+05	\N	Employee	{"id":"d09d058a-4102-494d-8bcc-ad3f9d65f5c7"}	create	{"new":{"id":"d09d058a-4102-494d-8bcc-ad3f9d65f5c7","fullName":"avsdggsv","sex":true,"birthDate":"0199-12-30T19:00:00.000Z","updatedAt":"2017-04-21T18:31:45.829Z","createdAt":"2017-04-21T18:31:45.829Z"}}
8412dc87-8794-41f5-af5a-20e6a84f705e	2017-04-22 00:02:40+05	\N	FRC	{"id":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3"}	create	{"new":{"id":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3","name":"ЦФО1"}}
3c808785-3b76-4ba6-922b-af3d135b1c49	2017-04-22 00:02:54+05	\N	CostItem	{"id":"e673869f-f07d-4c6d-baab-b9ea50434df5"}	create	{"new":{"id":"e673869f-f07d-4c6d-baab-b9ea50434df5","name":"asbdafsdf","parentId":null,"frcId":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3"}}
9129027d-f6e2-49e0-8a04-91ea30736fec	2017-04-22 00:05:44+05	\N	CostItem	{"id":"1bba0c91-df19-4163-9391-6615752dec83"}	create	{"new":{"id":"1bba0c91-df19-4163-9391-6615752dec83","name":"asbdafsdf","parentId":null,"frcId":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3"}}
d50c7516-8891-42fa-962e-74953711df9c	2017-04-22 00:07:51+05	\N	CostItem	{"id":"590eacc4-f741-4b14-91ed-5e6ef47a00d7"}	create	{"new":{"id":"590eacc4-f741-4b14-91ed-5e6ef47a00d7","name":"asbdafsdf","parentId":null,"frcId":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3"}}
ea198701-8d35-42de-8982-3b57b3eb01c9	2017-04-22 00:10:30+05	\N	CostItem	{"id":"0226754a-252f-400f-8da0-6bb3b7bebc40"}	create	{"new":{"id":"0226754a-252f-400f-8da0-6bb3b7bebc40","name":"asbdafsdf","parentId":null,"frcId":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3"}}
c249e53b-9791-40b0-9bb6-537a07d5d7af	2017-04-22 00:18:12+05	\N	CostItem	{"id":"11ed8a98-8167-4c28-8d6c-cec0056219fb"}	create	{"new":{"id":"11ed8a98-8167-4c28-8d6c-cec0056219fb","name":"asbdafsdf","parentId":null,"frcId":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3"}}
8bf984c3-b572-451f-ba4a-f7afdb5e2c62	2017-04-22 00:25:12+05	\N	CostItem	{"id":"f97894a9-8d34-47bb-b7a0-484f7fdbcfd2"}	create	{"new":{"id":"f97894a9-8d34-47bb-b7a0-484f7fdbcfd2","name":"апрар","parentId":null,"frcId":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3"}}
5d63c925-20b8-416e-90d8-8e1038a821c5	2017-04-22 01:16:50+05	\N	Employee	{"id":"ef425668-3e7d-422e-9142-b362560d4f10"}	create	{"new":{"id":"ef425668-3e7d-422e-9142-b362560d4f10","fullName":"Иванов Иван Иванович","sex":true,"birthDate":"1999-12-31T19:00:00.000Z","updatedAt":"2017-04-21T20:16:50.005Z","createdAt":"2017-04-21T20:16:50.005Z"}}
db6664c0-1a82-4ed9-9c67-66533505d844	2017-04-22 01:19:20+05	\N	Employee	{"id":"f452611f-9035-4e5d-a33a-a3b188d24318"}	create	{"new":{"id":"f452611f-9035-4e5d-a33a-a3b188d24318","fullName":"Иванов Иван Иванович","sex":true,"birthDate":"1999-12-31T19:00:00.000Z","updatedAt":"2017-04-21T20:19:20.605Z","createdAt":"2017-04-21T20:19:20.605Z"}}
1466bac9-14bd-4cec-863b-80d81b0f1962	2017-04-22 01:19:37+05	\N	Employee	{"id":"23a770d3-c211-4f40-a9fc-a0b0b9c891b0"}	create	{"new":{"id":"23a770d3-c211-4f40-a9fc-a0b0b9c891b0","fullName":"Иванов Иван Иванович","sex":true,"birthDate":"1999-12-31T19:00:00.000Z","updatedAt":"2017-04-21T20:19:37.296Z","createdAt":"2017-04-21T20:19:37.296Z"}}
7531e728-5935-4ac9-8e7d-417019a3f6a9	2017-04-22 01:20:10+05	\N	Employee	{"id":"b3481740-7d1e-4d75-b74f-b96ccb0c0554"}	create	{"new":{"id":"b3481740-7d1e-4d75-b74f-b96ccb0c0554","fullName":"Иванов Иван Иванович","sex":true,"birthDate":"1999-12-31T19:00:00.000Z","updatedAt":"2017-04-21T20:20:09.883Z","createdAt":"2017-04-21T20:20:09.883Z"}}
cd7ba8d7-466c-46bf-bf03-36d27ab94d18	2017-04-22 02:30:08+05	\N	Product	{"id":"afc19213-fb53-4604-a289-415bd6daafbf"}	create	{"new":{"id":"afc19213-fb53-4604-a289-415bd6daafbf","name":"самый лучший товар","costItemId":"f97894a9-8d34-47bb-b7a0-484f7fdbcfd2","price":"120.00"}}
8fd9cece-e4ee-4e2b-97cd-a055289a628f	2017-04-22 02:33:23+05	\N	PeriodType	{"id":"7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd"}	create	{"new":{"id":"7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd","name":"месяца","length":1}}
f50ab44c-6971-448e-98c0-849ccc3ae012	2017-04-22 02:33:59+05	\N	Period	{"id":"c138eef0-50c9-4d47-858a-e407937b3251"}	create	{"new":{"id":"c138eef0-50c9-4d47-858a-e407937b3251","name":"янв","typeId":"7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd","number":0}}
affb8c98-7ab6-4851-be00-8e424cd2acf3	2017-04-22 02:34:05+05	\N	Period	{"id":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"id":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","name":"фев","typeId":"7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd","number":1}}
934d1322-6d12-41c2-a86f-21eccc7fcc87	2017-04-22 02:34:11+05	\N	Period	{"id":"e54fce11-3d9d-4692-a922-080b20dd02f8"}	create	{"new":{"id":"e54fce11-3d9d-4692-a922-080b20dd02f8","name":"мар","typeId":"7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd","number":2}}
602c3ac6-98b9-425f-8b61-56329032d31f	2017-04-22 02:34:19+05	\N	Period	{"id":"202e9aaa-22a7-46b1-a874-3c0f121d80ca"}	create	{"new":{"id":"202e9aaa-22a7-46b1-a874-3c0f121d80ca","name":"апр","typeId":"7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd","number":3}}
5f6f7db7-a288-427b-bc6c-7ab9206e25a7	2017-04-22 02:34:24+05	\N	Period	{"id":"b002ead6-e68e-4e66-8ddd-2a1a237e5d58"}	create	{"new":{"id":"b002ead6-e68e-4e66-8ddd-2a1a237e5d58","name":"май","typeId":"7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd","number":4}}
6e962ad9-ef0d-4954-885b-9e17e046701c	2017-04-22 02:34:32+05	\N	Period	{"id":"1de7c4f8-95f2-4af6-ba79-d7445e2b8c74"}	create	{"new":{"id":"1de7c4f8-95f2-4af6-ba79-d7445e2b8c74","name":"июн","typeId":"7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd","number":5}}
be982a84-7b7b-4dca-aa72-56959225ca52	2017-04-22 02:47:10+05	\N	Request	{"id":"87d8755b-32b0-4f4b-830f-d4ac500c0aaf"}	create	{"new":{"id":"87d8755b-32b0-4f4b-830f-d4ac500c0aaf","year":2017,"requesterId":"cc4da243-d47e-4a67-a5dd-882a37cd220e","items":[{"requestId":null,"productId":"f97894a9-8d34-47bb-b7a0-484f7fdbcfd2","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":2},{"requestId":null,"productId":"f97894a9-8d34-47bb-b7a0-484f7fdbcfd2","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":2}],"updatedAt":"2017-04-21T21:47:10.407Z","createdAt":"2017-04-21T21:47:10.407Z","number":1}}
ebc5bfa8-9530-4886-9af4-dedb9b2753a7	2017-04-22 02:47:35+05	\N	Request	{"id":"35fbd258-b20f-47f2-9471-948f1565f256"}	create	{"new":{"id":"35fbd258-b20f-47f2-9471-948f1565f256","year":2017,"requesterId":"cc4da243-d47e-4a67-a5dd-882a37cd220e","items":[{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":2},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":2}],"updatedAt":"2017-04-21T21:47:35.885Z","createdAt":"2017-04-21T21:47:35.885Z","number":2}}
f0ce25b1-bb50-407e-8dee-567ae7c9d9fd	2017-04-22 02:47:35+05	\N	RequestItem	{"requestId":"35fbd258-b20f-47f2-9471-948f1565f256","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251"}	create	{"new":{"requestId":"35fbd258-b20f-47f2-9471-948f1565f256","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":2}}
2a3cdb12-c86d-4b1c-82a2-21204f8c6e16	2017-04-22 02:47:35+05	\N	RequestItem	{"requestId":"35fbd258-b20f-47f2-9471-948f1565f256","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8"}	create	{"new":{"requestId":"35fbd258-b20f-47f2-9471-948f1565f256","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":2}}
9511b7ea-abee-4078-8dce-17fda64e7bb9	2017-04-22 02:53:20+05	\N	Request	{"id":"89cc95f3-acda-43f4-a483-94285bc2aecf"}	create	{"new":{"id":"89cc95f3-acda-43f4-a483-94285bc2aecf","year":2017,"requesterId":"cc4da243-d47e-4a67-a5dd-882a37cd220e","items":[{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":2},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":2}],"updatedAt":"2017-04-21T21:53:20.197Z","createdAt":"2017-04-21T21:53:20.197Z","number":3}}
9c02bfcb-57d9-4fac-adf0-3bb8365d3230	2017-04-22 02:53:20+05	\N	RequestItem	{"requestId":"89cc95f3-acda-43f4-a483-94285bc2aecf","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251"}	create	{"new":{"requestId":"89cc95f3-acda-43f4-a483-94285bc2aecf","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":2}}
41209a42-9d47-4072-b346-e2dae6c99e5b	2017-04-22 02:53:20+05	\N	RequestItem	{"requestId":"89cc95f3-acda-43f4-a483-94285bc2aecf","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8"}	create	{"new":{"requestId":"89cc95f3-acda-43f4-a483-94285bc2aecf","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":2}}
5366abd0-05c5-4711-93ab-316e19d69f83	2017-04-24 10:08:05+05	\N	CostItem	{"id":"f97894a9-8d34-47bb-b7a0-484f7fdbcfd2"}	update	{"old":{"parentId":null,"name":"апрар"},"new":["parentId","name"]}
2282ffd8-b7bb-4634-a554-63e783527f58	2017-04-24 10:08:17+05	\N	CostItem	{"id":"1bba0c91-df19-4163-9391-6615752dec83"}	update	{"old":{"parentId":null,"name":"asbdafsdf"},"new":["parentId","name"]}
727e5723-6d1d-40c0-ae55-5a86c0013bba	2017-04-24 10:08:31+05	\N	CostItem	{"id":"e673869f-f07d-4c6d-baab-b9ea50434df5"}	update	{"old":{"parentId":null,"name":"asbdafsdf"},"new":["parentId","name"]}
1383bd69-23a3-4f13-b33e-f875ea35f0d3	2017-04-24 10:08:54+05	\N	FRC	{"id":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3"}	update	{"old":{"name":"ЦФО1"},"new":["name"]}
d4785fd7-32ff-44fd-b9e8-697b17e2a828	2017-04-24 10:09:03+05	\N	FRC	{"id":"3d07fca4-e7bd-4917-a47f-f8c0ce0e18d5"}	create	{"new":{"id":"3d07fca4-e7bd-4917-a47f-f8c0ce0e18d5","name":"Не очень материальное"}}
b4b2276e-4cd2-4833-a209-41a717d8c2b1	2017-04-24 10:09:29+05	\N	CostItem	{"id":"e673869f-f07d-4c6d-baab-b9ea50434df5"}	update	{"old":{"parentId":null,"frcId":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3"},"new":["parentId","frcId"]}
ba9a032a-4149-45f5-80e2-36820194a11a	2017-04-24 10:09:45+05	\N	CostItem	{"id":"11ed8a98-8167-4c28-8d6c-cec0056219fb"}	update	{"old":{"parentId":null,"frcId":"e5259b55-87b3-4fe1-8e4b-be05eb3976a3","name":"asbdafsdf"},"new":["parentId","frcId","name"]}
7da56c74-c649-442e-819b-6ab7a46ff615	2017-04-24 10:10:08+05	\N	Product	{"id":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f"}	create	{"new":{"id":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","name":"кирпич","costItemId":"f97894a9-8d34-47bb-b7a0-484f7fdbcfd2","price":"1234.00"}}
6a1c1c3f-3df8-4228-93c9-995dee3af19c	2017-04-24 10:10:23+05	\N	Product	{"id":"8b2805ab-0b38-4479-9c10-234059ce4b13"}	create	{"new":{"id":"8b2805ab-0b38-4479-9c10-234059ce4b13","name":"молочко","costItemId":"1bba0c91-df19-4163-9391-6615752dec83","price":"40.00"}}
6c6e63dd-216f-428e-b8ed-fb9a8512facc	2017-04-24 10:10:34+05	\N	Product	{"id":"65b854e3-b526-4052-8c79-d29d8f3f6f37"}	create	{"new":{"id":"65b854e3-b526-4052-8c79-d29d8f3f6f37","name":"сырок","costItemId":"1bba0c91-df19-4163-9391-6615752dec83","price":"12.00"}}
e2ceb190-8b6e-4efb-9b6f-ac03b845206d	2017-04-24 10:11:07+05	\N	Product	{"id":"245bcafb-cf6a-4df9-9d7c-3278c0afc609"}	create	{"new":{"id":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","name":"дипломчик","costItemId":"e673869f-f07d-4c6d-baab-b9ea50434df5","price":"2000.00"}}
1d01d968-f28a-4df4-8fc0-e48704d0f66b	2017-04-24 10:11:20+05	\N	Product	{"id":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6"}	create	{"new":{"id":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","name":"блокнотик","costItemId":"e673869f-f07d-4c6d-baab-b9ea50434df5","price":"1999.00"}}
89d75cab-c256-4c43-946c-45e579a835b2	2017-04-24 10:14:35+05	\N	Employee	{"id":"cc4da243-d47e-4a67-a5dd-882a37cd220e"}	update	{"old":{"fullName":"admin","birthDate":"1999-12-31T19:00:00.000Z"},"new":["fullName","birthDate"]}
5580e0c6-6658-4b25-9ab4-ee6951a7a3bc	2017-04-24 10:15:24+05	\N	Employee	{"id":"428413f2-ced0-47cc-8867-d5d1752dd77a"}	update	{"old":{"fullName":"avsdsv","birthDate":"0199-12-31T19:00:00.000Z"},"new":["fullName","birthDate"]}
679857fc-16a5-47ce-b70a-408e16567ba5	2017-04-24 10:15:29+05	\N	Employee	{"id":"428413f2-ced0-47cc-8867-d5d1752dd77a"}	update	{"old":{"birthDate":"0199-12-30T19:00:00.000Z"},"new":["birthDate"]}
445889ff-3f32-4b89-971f-2eb7902f4f58	2017-04-24 22:18:12+05	\N	Request	{"id":"2dca51d7-ecea-46d6-9bf7-c3d89a77b6ba"}	create	{"new":{"id":"2dca51d7-ecea-46d6-9bf7-c3d89a77b6ba","year":2018,"requesterId":"6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7","items":[],"updatedAt":"2017-04-24T17:18:12.092Z","createdAt":"2017-04-24T17:18:12.092Z","number":4}}
a03a24c3-1d30-4ec8-be3a-48ecae74e843	2017-04-24 22:22:03+05	\N	Request	{"id":"89a3a8cb-4229-4ab4-bbdc-e9757d548ab9"}	create	{"new":{"id":"89a3a8cb-4229-4ab4-bbdc-e9757d548ab9","year":2018,"requesterId":"6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7","items":[],"updatedAt":"2017-04-24T17:22:03.607Z","createdAt":"2017-04-24T17:22:03.607Z","number":5}}
d8cb56c6-7fc3-4ef5-8940-6260171f0455	2017-04-24 22:27:42+05	\N	Request	{"id":"db267a21-7879-4698-9693-200da664fbed"}	create	{"new":{"id":"db267a21-7879-4698-9693-200da664fbed","year":2018,"requesterId":"6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7","items":[{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":"12"},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":""},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":""},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"202e9aaa-22a7-46b1-a874-3c0f121d80ca","quantity":""},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"b002ead6-e68e-4e66-8ddd-2a1a237e5d58","quantity":""},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"1de7c4f8-95f2-4af6-ba79-d7445e2b8c74","quantity":""},{"requestId":null,"productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":""},{"requestId":null,"productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":"12"},{"requestId":null,"productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":""},{"requestId":null,"productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"202e9aaa-22a7-46b1-a874-3c0f121d80ca","quantity":""},{"requestId":null,"productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"b002ead6-e68e-4e66-8ddd-2a1a237e5d58","quantity":""},{"requestId":null,"productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"1de7c4f8-95f2-4af6-ba79-d7445e2b8c74","quantity":""},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":""},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":""},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":""},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"202e9aaa-22a7-46b1-a874-3c0f121d80ca","quantity":""},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"b002ead6-e68e-4e66-8ddd-2a1a237e5d58","quantity":""},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"1de7c4f8-95f2-4af6-ba79-d7445e2b8c74","quantity":""},{"requestId":null,"productId":"65b854e3-b526-4052-8c79-d29d8f3f6f37","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":""},{"requestId":null,"productId":"65b854e3-b526-4052-8c79-d29d8f3f6f37","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":""},{"requestId":null,"productId":"65b854e3-b526-4052-8c79-d29d8f3f6f37","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":""},{"requestId":null,"productId":"65b854e3-b526-4052-8c79-d29d8f3f6f37","periodId":"202e9aaa-22a7-46b1-a874-3c0f121d80ca","quantity":""},{"requestId":null,"productId":"65b854e3-b526-4052-8c79-d29d8f3f6f37","periodId":"b002ead6-e68e-4e66-8ddd-2a1a237e5d58","quantity":""},{"requestId":null,"productId":"65b854e3-b526-4052-8c79-d29d8f3f6f37","periodId":"1de7c4f8-95f2-4af6-ba79-d7445e2b8c74","quantity":""},{"requestId":null,"productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":""},{"requestId":null,"productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":""},{"requestId":null,"productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":""},{"requestId":null,"productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"202e9aaa-22a7-46b1-a874-3c0f121d80ca","quantity":""},{"requestId":null,"productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"b002ead6-e68e-4e66-8ddd-2a1a237e5d58","quantity":""},{"requestId":null,"productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"1de7c4f8-95f2-4af6-ba79-d7445e2b8c74","quantity":""},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":""},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":""},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":""},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"202e9aaa-22a7-46b1-a874-3c0f121d80ca","quantity":""},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"b002ead6-e68e-4e66-8ddd-2a1a237e5d58","quantity":""},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"1de7c4f8-95f2-4af6-ba79-d7445e2b8c74","quantity":""}],"updatedAt":"2017-04-24T17:27:42.820Z","createdAt":"2017-04-24T17:27:42.820Z","number":6}}
7c5a104b-0838-4937-8a01-39fb0c75af4a	2017-04-24 22:27:42+05	\N	RequestItem	{"requestId":"db267a21-7879-4698-9693-200da664fbed","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251"}	create	{"new":{"requestId":"db267a21-7879-4698-9693-200da664fbed","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":12}}
1a9a913b-fbbb-49fb-8476-f8dd244ffac7	2017-04-24 22:27:43+05	\N	RequestItem	{"requestId":"db267a21-7879-4698-9693-200da664fbed","productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"requestId":"db267a21-7879-4698-9693-200da664fbed","productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":12}}
a79b34c3-ee04-45a9-9947-3b657904446c	2017-04-25 00:08:17+05	\N	Request	{"id":"67bf58da-b97c-4992-8d4f-b32e02f187fd"}	create	{"new":{"id":"67bf58da-b97c-4992-8d4f-b32e02f187fd","year":2018,"requesterId":"6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7","items":[{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":"01"},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":"03"},{"requestId":null,"productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":"02"},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":"02"},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":"01"},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":"01"},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":"032"}],"updatedAt":"2017-04-24T19:08:17.484Z","createdAt":"2017-04-24T19:08:17.484Z","number":8}}
8b8e5a81-1b2c-4979-b582-cf25235c560a	2017-04-25 00:08:17+05	\N	RequestItem	{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251"}	create	{"new":{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":1}}
cc3613f3-cbad-48b5-b19b-70f4cba0a1b7	2017-04-24 22:42:19+05	\N	Request	{"id":"cfa007a4-d61b-4597-810e-84e2600961a6"}	create	{"new":{"id":"cfa007a4-d61b-4597-810e-84e2600961a6","year":2018,"requesterId":"6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7","items":[{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":"05"},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":"06"},{"requestId":null,"productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":"07"},{"requestId":null,"productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":"06"},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":"02"},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":"02"},{"requestId":null,"productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":"02"},{"requestId":null,"productId":"65b854e3-b526-4052-8c79-d29d8f3f6f37","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":"02"},{"requestId":null,"productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":"011"},{"requestId":null,"productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":"02"},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":"0123"},{"requestId":null,"productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":"02"}],"updatedAt":"2017-04-24T17:42:19.675Z","createdAt":"2017-04-24T17:42:19.675Z","number":7}}
9f958821-aed7-4013-bfbc-6febaf76a694	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":5}}
67be6232-ace3-4c44-a1c3-e7a6993210ec	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":6}}
d9df2df8-8333-43ff-9e7e-b00a3bde0cda	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":7}}
a7bb71be-00d8-46fe-bd03-d8f5fea9eae2	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":6}}
dbbc372b-8988-472f-99c4-c07a353d1bc6	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"c138eef0-50c9-4d47-858a-e407937b3251"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":2}}
01f97dea-e0b7-4e5f-a546-8196a0092f7d	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":2}}
4ff32535-0110-4c0b-9fc8-9ff1f42d0d71	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"c138eef0-50c9-4d47-858a-e407937b3251"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":11}}
a4f7c3ce-a128-4251-b719-1fad376fbcfa	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":2}}
e5aea783-32c8-42d2-8eae-81d2c53d35e0	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"245bcafb-cf6a-4df9-9d7c-3278c0afc609","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":2}}
603912b5-f6b4-4f76-bb7f-8e3d01abdc45	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":123}}
289fd222-500b-4ade-9bba-c650fbd9e652	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"65b854e3-b526-4052-8c79-d29d8f3f6f37","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"65b854e3-b526-4052-8c79-d29d8f3f6f37","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":2}}
5f7fe607-8659-466d-ab28-83116ada7c4e	2017-04-24 22:42:19+05	\N	RequestItem	{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8"}	create	{"new":{"requestId":"cfa007a4-d61b-4597-810e-84e2600961a6","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":2}}
d492427a-7108-4e9b-b174-ef8ced143f6d	2017-04-24 23:51:07+05	\N	Request	{"id":"cfa007a4-d61b-4597-810e-84e2600961a6"}	update	{"old":{"year":2018},"new":["year"]}
414f4e21-e590-4cd2-aae0-eb71cf9dc41c	2017-04-24 23:51:39+05	\N	Request	{"id":"cfa007a4-d61b-4597-810e-84e2600961a6"}	update	{"old":{"year":2018},"new":["year"]}
ca471324-1a17-48f6-8de4-c37bbda81c9f	2017-04-24 23:52:34+05	\N	Request	{"id":"cfa007a4-d61b-4597-810e-84e2600961a6"}	update	{"old":{"year":2018},"new":["year"]}
49b7eb0a-c272-417c-97da-4bcc403bc080	2017-04-24 23:56:44+05	\N	Request	{"id":"cfa007a4-d61b-4597-810e-84e2600961a6"}	update	{"old":{"year":2018},"new":["year"]}
4dd6b96d-64af-471e-a2a7-c08b719d5e08	2017-04-24 23:59:48+05	\N	Request	{"id":"cfa007a4-d61b-4597-810e-84e2600961a6"}	update	{"old":{"year":2018},"new":["year"]}
adcf993f-9391-4ef2-ad51-683b39b51bd7	2017-04-25 00:02:37+05	\N	Request	{"id":"cfa007a4-d61b-4597-810e-84e2600961a6"}	update	{"old":{"year":2018},"new":["year"]}
4cd0abe7-fe64-42a0-9f63-fc657bc3939e	2017-04-25 00:03:39+05	\N	Request	{"id":"cfa007a4-d61b-4597-810e-84e2600961a6"}	update	{"old":{"year":2018},"new":["year"]}
2ec8b0b2-336b-44c7-91ff-4361ab15f8d1	2017-04-25 00:04:54+05	\N	Request	{"id":"cfa007a4-d61b-4597-810e-84e2600961a6"}	update	{"old":{"year":2018},"new":["year"]}
e4dbc4d2-eda5-4347-9612-f18fe46be7b5	2017-04-25 00:08:17+05	\N	RequestItem	{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8"}	create	{"new":{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"afc19213-fb53-4604-a289-415bd6daafbf","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":3}}
fc34e2fc-86ea-4cc1-9d71-6ac003c0b4c9	2017-04-25 00:08:17+05	\N	RequestItem	{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":2}}
e8d0eb09-b993-46bc-b3b1-fef20231c063	2017-04-25 00:08:17+05	\N	RequestItem	{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"8b2805ab-0b38-4479-9c10-234059ce4b13","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":2}}
99258d24-1833-48c2-abe5-f6f220dd57e4	2017-04-25 00:08:17+05	\N	RequestItem	{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"c138eef0-50c9-4d47-858a-e407937b3251"}	create	{"new":{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"c138eef0-50c9-4d47-858a-e407937b3251","quantity":1}}
549969dc-86f3-42de-8033-2354cb9596fe	2017-04-25 00:08:17+05	\N	RequestItem	{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8"}	create	{"new":{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"e54fce11-3d9d-4692-a922-080b20dd02f8","quantity":32}}
c0e32601-0c6d-4e48-b0a9-f9f337dabb76	2017-04-25 00:08:17+05	\N	RequestItem	{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6"}	create	{"new":{"requestId":"67bf58da-b97c-4992-8d4f-b32e02f187fd","productId":"525e3b96-24c9-4e7c-8c20-b4ef1b9318d6","periodId":"2b6732c2-d3e7-4050-b849-9360c1e7b8d6","quantity":1}}
\.


--
-- TOC entry 2361 (class 0 OID 39823)
-- Dependencies: 197
-- Data for Name: Period; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Period" (id, "typeId", name, number) FROM stdin;
c138eef0-50c9-4d47-858a-e407937b3251	7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd	янв	0
2b6732c2-d3e7-4050-b849-9360c1e7b8d6	7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd	фев	1
e54fce11-3d9d-4692-a922-080b20dd02f8	7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd	мар	2
202e9aaa-22a7-46b1-a874-3c0f121d80ca	7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd	апр	3
b002ead6-e68e-4e66-8ddd-2a1a237e5d58	7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd	май	4
1de7c4f8-95f2-4af6-ba79-d7445e2b8c74	7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd	июн	5
\.


--
-- TOC entry 2360 (class 0 OID 39817)
-- Dependencies: 196
-- Data for Name: PeriodType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "PeriodType" (id, name, length) FROM stdin;
7653a98d-a2d0-40d4-95f5-d7b4d91b2bbd	месяца	1
\.


--
-- TOC entry 2372 (class 0 OID 40010)
-- Dependencies: 208
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Permission" (id, name) FROM stdin;
bdd3d96e-0d1e-4bc8-a168-a30fb09b63ad	user
05bc4208-f5db-4595-84af-73d9ed626ff4	user.list
26cc8222-cbd9-4e89-89ee-fc6cf564fce3	user.info
1195c705-9032-44ff-b898-61d143b43660	user.set-roles
f655a9f4-e519-45b7-8da9-bef8fa9c060e	role.create
bb2f196d-403c-4e61-a4de-c24027740d4c	role.list
8f79b803-865d-4608-892c-4fa55e39f015	user.update
58d4d99b-8157-4cb0-98e3-586bcdfaca6a	user.register
402cc043-bbeb-4532-a61c-007a08340b49	role.update
e2540226-519b-4fb1-b2ac-0bf4be192431	ci.list
44999719-12ae-4924-80da-4b4dfd42fa42	ci.create
c99a73c8-f745-449d-b254-b1d63a108da1	ci.update
7bb5c44a-6006-4c62-99c2-3b97b5a2232e	cur-req.list
d0acb895-5fbf-4aff-a777-f11d92620093	cur-req.create
95aaeb93-10fa-4dfe-98bf-68f85b260949	cur-req.update
a6d2fe5b-9193-4028-82d7-3eac764b64d2	dep.list
9a5eddb0-8617-4bfc-9eed-7dd5c8d67062	dep.create
ec9b2920-f030-4ec5-b11b-57124abeef01	dep.update
1d31ba2d-0c7b-4c58-ba0e-2de6416d2b46	empl.list
594b6a60-2b66-4a9d-8447-c93dd7ed4ec1	empl.create
5e6c6044-8180-4ddc-8bba-e6750a8e7441	empl.update
debe5ad6-b2fb-432d-9dbb-557b8624b4a2	est.list
b865d2b2-7a0c-4695-9e9a-a3317b19b5c2	est-comp.create
5387a2ee-b281-4d4d-969b-dd2179bd1136	est-comp.update
fab022c0-1908-4138-9a02-f6346fb8b543	est-frc.create
6a1e4716-e982-45b4-a61c-4086693cff8b	est-frc.update
a4e06de2-76e0-4d57-a570-5a744cfa7bab	exp.list
d57ced1c-5b61-4667-bd34-f1f476659796	exp.create
1ede7283-939a-4172-a0f4-8f044cd73dd6	lim.list
b6172bab-5d4f-4988-8e75-1d2640bccea7	lim.create
91023ab1-d797-4915-8003-03c78b9393d8	frc.list
6cb2d59d-612d-4d4d-ab99-5f5ef5722803	frc.create
45348a0d-841a-4e81-a264-58c952c86620	frc.update
89c82137-c338-438e-8d9d-00bfd5c0c78d	period.list
23db42cd-a99f-497a-8a59-a8a7bfa77835	period.create
6224e4ae-f921-4659-985a-b4435b98c0d6	period.update
903b9b2a-bf9c-4f8c-81af-02383f7961a3	ptype.list
e3f9f79e-9eae-4d65-b94a-ed8b9b1581d4	ptype.create
4e8eba9c-b14d-42c9-82fb-f7139337f8d4	ptype.update
8878a88a-f498-4618-95cc-2ae20d5311c0	prod.list
2b8c8693-3fb6-406f-b7a5-c4751805b127	prod.create
ca307bb1-4046-4c3e-bfeb-46f3a0997317	prod.update
9529dcb8-a0c7-417e-8ede-accb0df81779	req.list
1e103022-b395-4445-b320-b8c392d49067	req.create
5c4820c4-320e-40e0-9b99-ef6d4200709c	req.update
\.


--
-- TOC entry 2364 (class 0 OID 39856)
-- Dependencies: 200
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Product" (id, "costItemId", name, price) FROM stdin;
afc19213-fb53-4604-a289-415bd6daafbf	f97894a9-8d34-47bb-b7a0-484f7fdbcfd2	самый лучший товар	120.00
03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f	f97894a9-8d34-47bb-b7a0-484f7fdbcfd2	кирпич	1234.00
8b2805ab-0b38-4479-9c10-234059ce4b13	1bba0c91-df19-4163-9391-6615752dec83	молочко	40.00
65b854e3-b526-4052-8c79-d29d8f3f6f37	1bba0c91-df19-4163-9391-6615752dec83	сырок	12.00
245bcafb-cf6a-4df9-9d7c-3278c0afc609	e673869f-f07d-4c6d-baab-b9ea50434df5	дипломчик	2000.00
525e3b96-24c9-4e7c-8c20-b4ef1b9318d6	e673869f-f07d-4c6d-baab-b9ea50434df5	блокнотик	1999.00
\.


--
-- TOC entry 2359 (class 0 OID 39804)
-- Dependencies: 195
-- Data for Name: Request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Request" (id, number, "requesterId", year, "createdAt", "updatedAt") FROM stdin;
87d8755b-32b0-4f4b-830f-d4ac500c0aaf	1	cc4da243-d47e-4a67-a5dd-882a37cd220e	2017	2017-04-22 02:47:10.407+05	2017-04-22 02:47:10.407+05
35fbd258-b20f-47f2-9471-948f1565f256	2	cc4da243-d47e-4a67-a5dd-882a37cd220e	2017	2017-04-22 02:47:35.885+05	2017-04-22 02:47:35.885+05
89cc95f3-acda-43f4-a483-94285bc2aecf	3	cc4da243-d47e-4a67-a5dd-882a37cd220e	2017	2017-04-22 02:53:20.197+05	2017-04-22 02:53:20.197+05
2dca51d7-ecea-46d6-9bf7-c3d89a77b6ba	4	6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7	2018	2017-04-24 22:18:12.092+05	2017-04-24 22:18:12.092+05
89a3a8cb-4229-4ab4-bbdc-e9757d548ab9	5	6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7	2018	2017-04-24 22:22:03.607+05	2017-04-24 22:22:03.607+05
db267a21-7879-4698-9693-200da664fbed	6	6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7	2018	2017-04-24 22:27:42.82+05	2017-04-24 22:27:42.82+05
cfa007a4-d61b-4597-810e-84e2600961a6	7	6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7	2018	2017-04-24 22:42:19.675+05	2017-04-25 00:04:54.831+05
67bf58da-b97c-4992-8d4f-b32e02f187fd	8	6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7	2018	2017-04-25 00:08:17.484+05	2017-04-25 00:08:17.484+05
\.


--
-- TOC entry 2375 (class 0 OID 40061)
-- Dependencies: 211
-- Data for Name: RequestEstimate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "RequestEstimate" ("createdAt", "updatedAt", "estimateId", "requestId") FROM stdin;
\.


--
-- TOC entry 2386 (class 0 OID 40250)
-- Dependencies: 222
-- Data for Name: RequestItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "RequestItem" ("requestId", "productId", "periodId", quantity) FROM stdin;
67bf58da-b97c-4992-8d4f-b32e02f187fd	afc19213-fb53-4604-a289-415bd6daafbf	c138eef0-50c9-4d47-858a-e407937b3251	1
67bf58da-b97c-4992-8d4f-b32e02f187fd	afc19213-fb53-4604-a289-415bd6daafbf	e54fce11-3d9d-4692-a922-080b20dd02f8	3
67bf58da-b97c-4992-8d4f-b32e02f187fd	03223b55-2a4e-4b3e-9c4f-6d32e66b9f2f	2b6732c2-d3e7-4050-b849-9360c1e7b8d6	2
67bf58da-b97c-4992-8d4f-b32e02f187fd	8b2805ab-0b38-4479-9c10-234059ce4b13	2b6732c2-d3e7-4050-b849-9360c1e7b8d6	2
67bf58da-b97c-4992-8d4f-b32e02f187fd	525e3b96-24c9-4e7c-8c20-b4ef1b9318d6	c138eef0-50c9-4d47-858a-e407937b3251	1
67bf58da-b97c-4992-8d4f-b32e02f187fd	525e3b96-24c9-4e7c-8c20-b4ef1b9318d6	2b6732c2-d3e7-4050-b849-9360c1e7b8d6	1
67bf58da-b97c-4992-8d4f-b32e02f187fd	525e3b96-24c9-4e7c-8c20-b4ef1b9318d6	e54fce11-3d9d-4692-a922-080b20dd02f8	32
\.


--
-- TOC entry 2402 (class 0 OID 0)
-- Dependencies: 194
-- Name: Request_number_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"Request_number_seq"', 8, true);


--
-- TOC entry 2373 (class 0 OID 40039)
-- Dependencies: 209
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "Role" (id, name) FROM stdin;
4109e98e-5b6e-426e-8f0a-0fddabc05ba2	Администратор
\.


--
-- TOC entry 2376 (class 0 OID 40076)
-- Dependencies: 212
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "RolePermission" ("createdAt", "updatedAt", "permissionId", "roleId") FROM stdin;
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	bdd3d96e-0d1e-4bc8-a168-a30fb09b63ad	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	05bc4208-f5db-4595-84af-73d9ed626ff4	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	26cc8222-cbd9-4e89-89ee-fc6cf564fce3	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	1195c705-9032-44ff-b898-61d143b43660	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	8f79b803-865d-4608-892c-4fa55e39f015	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	58d4d99b-8157-4cb0-98e3-586bcdfaca6a	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	bb2f196d-403c-4e61-a4de-c24027740d4c	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	f655a9f4-e519-45b7-8da9-bef8fa9c060e	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	402cc043-bbeb-4532-a61c-007a08340b49	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	e2540226-519b-4fb1-b2ac-0bf4be192431	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	44999719-12ae-4924-80da-4b4dfd42fa42	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	c99a73c8-f745-449d-b254-b1d63a108da1	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	7bb5c44a-6006-4c62-99c2-3b97b5a2232e	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	d0acb895-5fbf-4aff-a777-f11d92620093	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	95aaeb93-10fa-4dfe-98bf-68f85b260949	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	a6d2fe5b-9193-4028-82d7-3eac764b64d2	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	9a5eddb0-8617-4bfc-9eed-7dd5c8d67062	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	ec9b2920-f030-4ec5-b11b-57124abeef01	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	1d31ba2d-0c7b-4c58-ba0e-2de6416d2b46	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	594b6a60-2b66-4a9d-8447-c93dd7ed4ec1	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	5e6c6044-8180-4ddc-8bba-e6750a8e7441	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	debe5ad6-b2fb-432d-9dbb-557b8624b4a2	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	b865d2b2-7a0c-4695-9e9a-a3317b19b5c2	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	5387a2ee-b281-4d4d-969b-dd2179bd1136	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	fab022c0-1908-4138-9a02-f6346fb8b543	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	6a1e4716-e982-45b4-a61c-4086693cff8b	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	a4e06de2-76e0-4d57-a570-5a744cfa7bab	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	d57ced1c-5b61-4667-bd34-f1f476659796	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	1ede7283-939a-4172-a0f4-8f044cd73dd6	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	b6172bab-5d4f-4988-8e75-1d2640bccea7	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	91023ab1-d797-4915-8003-03c78b9393d8	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	6cb2d59d-612d-4d4d-ab99-5f5ef5722803	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	45348a0d-841a-4e81-a264-58c952c86620	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	89c82137-c338-438e-8d9d-00bfd5c0c78d	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	23db42cd-a99f-497a-8a59-a8a7bfa77835	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	6224e4ae-f921-4659-985a-b4435b98c0d6	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	903b9b2a-bf9c-4f8c-81af-02383f7961a3	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	e3f9f79e-9eae-4d65-b94a-ed8b9b1581d4	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	4e8eba9c-b14d-42c9-82fb-f7139337f8d4	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	8878a88a-f498-4618-95cc-2ae20d5311c0	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	2b8c8693-3fb6-406f-b7a5-c4751805b127	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	ca307bb1-4046-4c3e-bfeb-46f3a0997317	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	9529dcb8-a0c7-417e-8ede-accb0df81779	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	1e103022-b395-4445-b320-b8c392d49067	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
2017-04-22 01:16:50.183+05	2017-04-22 01:16:50.183+05	5c4820c4-320e-40e0-9b99-ef6d4200709c	4109e98e-5b6e-426e-8f0a-0fddabc05ba2
\.


--
-- TOC entry 2371 (class 0 OID 39976)
-- Dependencies: 207
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "User" (id, username, password, "employeeId") FROM stdin;
1277db3c-f84e-412f-bbb7-d8c5838e51db	admin	$2a$10$bGUOS1i/BVXYOs.AIOej3eQV8ZTxHUalNCM6VURSrM2Gkuskk9nc6	428413f2-ced0-47cc-8867-d5d1752dd77a
360132a2-ac20-469f-930a-43df019cf9aa	adminka	$2a$10$5hr/5x67zvo5xJ2tz4uIkObjHX4lnYcEjYRU.PfPgKq.W3MUmy2PS	cc4da243-d47e-4a67-a5dd-882a37cd220e
75bf4040-a72c-47e2-acd1-324d4cc67eb5	fairness	$2a$10$YFED4P6u56lDqN6WHV5BJ.QJTsvj02IGWbuJ19nfVyJKjLPR/dF0.	6a9dfd5a-dd5e-45e4-acb7-a739c360cbe7
\.


--
-- TOC entry 2377 (class 0 OID 40091)
-- Dependencies: 213
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "UserRole" ("createdAt", "updatedAt", "roleId", "userId") FROM stdin;
2017-04-20 23:41:50.054+05	2017-04-20 23:41:50.054+05	4109e98e-5b6e-426e-8f0a-0fddabc05ba2	360132a2-ac20-469f-930a-43df019cf9aa
2017-04-22 01:16:50.185+05	2017-04-22 01:16:50.185+05	4109e98e-5b6e-426e-8f0a-0fddabc05ba2	1277db3c-f84e-412f-bbb7-d8c5838e51db
\.


--
-- TOC entry 2381 (class 0 OID 40125)
-- Dependencies: 217
-- Data for Name: revision-changes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "revision-changes" (id, path, document, diff, "createdAt", "updatedAt", "revisionId") FROM stdin;
\.


--
-- TOC entry 2403 (class 0 OID 0)
-- Dependencies: 216
-- Name: revision-changes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"revision-changes_id_seq"', 1, false);


--
-- TOC entry 2379 (class 0 OID 40114)
-- Dependencies: 215
-- Data for Name: revisions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY revisions (id, model, "documentId", revision, document, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 2404 (class 0 OID 0)
-- Dependencies: 214
-- Name: revisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('revisions_id_seq', 1, false);


--
-- TOC entry 2124 (class 2606 OID 39783)
-- Name: CostItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CostItem"
    ADD CONSTRAINT "CostItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 2150 (class 2606 OID 39873)
-- Name: CurrentRequestItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CurrentRequestItem"
    ADD CONSTRAINT "CurrentRequestItem_pkey" PRIMARY KEY ("currentRequestId", "productId");


--
-- TOC entry 2142 (class 2606 OID 39842)
-- Name: CurrentRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CurrentRequest"
    ADD CONSTRAINT "CurrentRequest_pkey" PRIMARY KEY (id);


--
-- TOC entry 2154 (class 2606 OID 39892)
-- Name: Department_fullName_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Department"
    ADD CONSTRAINT "Department_fullName_key" UNIQUE ("fullName");


--
-- TOC entry 2156 (class 2606 OID 39890)
-- Name: Department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Department"
    ADD CONSTRAINT "Department_pkey" PRIMARY KEY (id);


--
-- TOC entry 2185 (class 2606 OID 40050)
-- Name: EmployeeDepartment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EmployeeDepartment"
    ADD CONSTRAINT "EmployeeDepartment_pkey" PRIMARY KEY ("departmentId", "employeeId");


--
-- TOC entry 2129 (class 2606 OID 39800)
-- Name: Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY (id);


--
-- TOC entry 2205 (class 2606 OID 40189)
-- Name: EstimateEstimate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EstimateEstimate"
    ADD CONSTRAINT "EstimateEstimate_pkey" PRIMARY KEY ("companyEstimateId", "frcEstimateId");


--
-- TOC entry 2161 (class 2606 OID 39929)
-- Name: EstimateItemValue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EstimateItemValue"
    ADD CONSTRAINT "EstimateItemValue_pkey" PRIMARY KEY ("estimateItemId", "periodId");


--
-- TOC entry 2158 (class 2606 OID 39912)
-- Name: EstimateItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EstimateItem"
    ADD CONSTRAINT "EstimateItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 2199 (class 2606 OID 40175)
-- Name: Estimate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Estimate"
    ADD CONSTRAINT "Estimate_pkey" PRIMARY KEY (id);


--
-- TOC entry 2164 (class 2606 OID 39945)
-- Name: Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- TOC entry 2122 (class 2606 OID 39777)
-- Name: FRC_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "FRC"
    ADD CONSTRAINT "FRC_pkey" PRIMARY KEY (id);


--
-- TOC entry 2168 (class 2606 OID 39963)
-- Name: Limit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Limit"
    ADD CONSTRAINT "Limit_pkey" PRIMARY KEY ("costItemId", "periodId", year);


--
-- TOC entry 2197 (class 2606 OID 40160)
-- Name: Log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Log"
    ADD CONSTRAINT "Log_pkey" PRIMARY KEY (id);


--
-- TOC entry 2136 (class 2606 OID 39822)
-- Name: PeriodType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "PeriodType"
    ADD CONSTRAINT "PeriodType_pkey" PRIMARY KEY (id);


--
-- TOC entry 2138 (class 2606 OID 39828)
-- Name: Period_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Period"
    ADD CONSTRAINT "Period_pkey" PRIMARY KEY (id);


--
-- TOC entry 2177 (class 2606 OID 40016)
-- Name: Permission_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Permission"
    ADD CONSTRAINT "Permission_name_key" UNIQUE (name);


--
-- TOC entry 2179 (class 2606 OID 40014)
-- Name: Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- TOC entry 2147 (class 2606 OID 39861)
-- Name: Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- TOC entry 2187 (class 2606 OID 40065)
-- Name: RequestEstimate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "RequestEstimate"
    ADD CONSTRAINT "RequestEstimate_pkey" PRIMARY KEY ("estimateId", "requestId");


--
-- TOC entry 2207 (class 2606 OID 40255)
-- Name: RequestItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "RequestItem"
    ADD CONSTRAINT "RequestItem_pkey" PRIMARY KEY ("requestId", "productId", "periodId");


--
-- TOC entry 2132 (class 2606 OID 39809)
-- Name: Request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Request"
    ADD CONSTRAINT "Request_pkey" PRIMARY KEY (id);


--
-- TOC entry 2189 (class 2606 OID 40080)
-- Name: RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("permissionId", "roleId");


--
-- TOC entry 2181 (class 2606 OID 40045)
-- Name: Role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Role"
    ADD CONSTRAINT "Role_name_key" UNIQUE (name);


--
-- TOC entry 2183 (class 2606 OID 40043)
-- Name: Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- TOC entry 2191 (class 2606 OID 40095)
-- Name: UserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "UserRole"
    ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("roleId", "userId");


--
-- TOC entry 2173 (class 2606 OID 39980)
-- Name: User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 2175 (class 2606 OID 39982)
-- Name: User_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "User"
    ADD CONSTRAINT "User_username_key" UNIQUE (username);


--
-- TOC entry 2195 (class 2606 OID 40133)
-- Name: revision-changes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "revision-changes"
    ADD CONSTRAINT "revision-changes_pkey" PRIMARY KEY (id);


--
-- TOC entry 2193 (class 2606 OID 40122)
-- Name: revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY revisions
    ADD CONSTRAINT revisions_pkey PRIMARY KEY (id);


--
-- TOC entry 2127 (class 1259 OID 39801)
-- Name: Employee_createdAt; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Employee_createdAt" ON "Employee" USING btree ("createdAt");


--
-- TOC entry 2171 (class 1259 OID 39988)
-- Name: User_employeeId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_employeeId" ON "User" USING btree ("employeeId");


--
-- TOC entry 2125 (class 1259 OID 39795)
-- Name: cost_item_frc_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cost_item_frc_id ON "CostItem" USING btree ("frcId");


--
-- TOC entry 2126 (class 1259 OID 39794)
-- Name: cost_item_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cost_item_parent_id ON "CostItem" USING btree ("parentId");


--
-- TOC entry 2151 (class 1259 OID 39884)
-- Name: current_request_item_current_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX current_request_item_current_request_id ON "CurrentRequestItem" USING btree ("currentRequestId");


--
-- TOC entry 2152 (class 1259 OID 39885)
-- Name: current_request_item_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX current_request_item_product_id ON "CurrentRequestItem" USING btree ("productId");


--
-- TOC entry 2143 (class 1259 OID 39855)
-- Name: current_request_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX current_request_number ON "CurrentRequest" USING btree (number);


--
-- TOC entry 2144 (class 1259 OID 39854)
-- Name: current_request_period_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX current_request_period_id ON "CurrentRequest" USING btree ("periodId");


--
-- TOC entry 2145 (class 1259 OID 39853)
-- Name: current_request_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX current_request_request_id ON "CurrentRequest" USING btree ("requestId");


--
-- TOC entry 2130 (class 1259 OID 40167)
-- Name: employee_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_created_at ON "Employee" USING btree ("createdAt");


--
-- TOC entry 2200 (class 1259 OID 40181)
-- Name: estimate_frc_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX estimate_frc_id ON "Estimate" USING btree ("frcId");


--
-- TOC entry 2201 (class 1259 OID 40182)
-- Name: estimate_frc_id_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX estimate_frc_id_year ON "Estimate" USING btree ("frcId", year) WHERE ("approvalDate" IS NOT NULL);


--
-- TOC entry 2159 (class 1259 OID 39923)
-- Name: estimate_item_estimate_id_cost_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX estimate_item_estimate_id_cost_item_id ON "EstimateItem" USING btree ("estimateId", "costItemId");


--
-- TOC entry 2162 (class 1259 OID 39940)
-- Name: estimate_item_value_estimate_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX estimate_item_value_estimate_item_id ON "EstimateItemValue" USING btree ("estimateItemId");


--
-- TOC entry 2202 (class 1259 OID 40184)
-- Name: estimate_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX estimate_number ON "Estimate" USING btree (number);


--
-- TOC entry 2203 (class 1259 OID 40183)
-- Name: estimate_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX estimate_year ON "Estimate" USING btree (year) WHERE (("approvalDate" IS NOT NULL) AND ("frcId" IS NULL));


--
-- TOC entry 2165 (class 1259 OID 39956)
-- Name: expense_cost_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX expense_cost_item_id ON "Expense" USING btree ("costItemId");


--
-- TOC entry 2166 (class 1259 OID 39957)
-- Name: expense_period_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX expense_period_id ON "Expense" USING btree ("periodId");


--
-- TOC entry 2169 (class 1259 OID 39974)
-- Name: limit_cost_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX limit_cost_item_id ON "Limit" USING btree ("costItemId");


--
-- TOC entry 2170 (class 1259 OID 39975)
-- Name: limit_period_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX limit_period_id ON "Limit" USING btree ("periodId");


--
-- TOC entry 2139 (class 1259 OID 39834)
-- Name: period_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX period_type_id ON "Period" USING btree ("typeId");


--
-- TOC entry 2140 (class 1259 OID 40166)
-- Name: period_type_id_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX period_type_id_number ON "Period" USING btree ("typeId", number);


--
-- TOC entry 2148 (class 1259 OID 39867)
-- Name: product_cost_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_cost_item_id ON "Product" USING btree ("costItemId");


--
-- TOC entry 2208 (class 1259 OID 40271)
-- Name: request_item_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX request_item_request_id ON "RequestItem" USING btree ("requestId");


--
-- TOC entry 2133 (class 1259 OID 39816)
-- Name: request_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX request_number ON "Request" USING btree (number);


--
-- TOC entry 2134 (class 1259 OID 39815)
-- Name: request_requester_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX request_requester_id ON "Request" USING btree ("requesterId");


--
-- TOC entry 2210 (class 2606 OID 39789)
-- Name: CostItem_frcId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CostItem"
    ADD CONSTRAINT "CostItem_frcId_fkey" FOREIGN KEY ("frcId") REFERENCES "FRC"(id) ON UPDATE CASCADE;


--
-- TOC entry 2209 (class 2606 OID 39784)
-- Name: CostItem_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CostItem"
    ADD CONSTRAINT "CostItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CostItem"(id) ON UPDATE CASCADE;


--
-- TOC entry 2216 (class 2606 OID 39874)
-- Name: CurrentRequestItem_currentRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CurrentRequestItem"
    ADD CONSTRAINT "CurrentRequestItem_currentRequestId_fkey" FOREIGN KEY ("currentRequestId") REFERENCES "CurrentRequest"(id) ON UPDATE CASCADE;


--
-- TOC entry 2217 (class 2606 OID 39879)
-- Name: CurrentRequestItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CurrentRequestItem"
    ADD CONSTRAINT "CurrentRequestItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON UPDATE CASCADE;


--
-- TOC entry 2214 (class 2606 OID 39848)
-- Name: CurrentRequest_periodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CurrentRequest"
    ADD CONSTRAINT "CurrentRequest_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"(id) ON UPDATE CASCADE;


--
-- TOC entry 2213 (class 2606 OID 39843)
-- Name: CurrentRequest_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "CurrentRequest"
    ADD CONSTRAINT "CurrentRequest_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"(id) ON UPDATE CASCADE;


--
-- TOC entry 2226 (class 2606 OID 40051)
-- Name: EmployeeDepartment_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EmployeeDepartment"
    ADD CONSTRAINT "EmployeeDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2227 (class 2606 OID 40056)
-- Name: EmployeeDepartment_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EmployeeDepartment"
    ADD CONSTRAINT "EmployeeDepartment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2236 (class 2606 OID 40190)
-- Name: EstimateEstimate_companyEstimateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EstimateEstimate"
    ADD CONSTRAINT "EstimateEstimate_companyEstimateId_fkey" FOREIGN KEY ("companyEstimateId") REFERENCES "Estimate"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2237 (class 2606 OID 40195)
-- Name: EstimateEstimate_frcEstimateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EstimateEstimate"
    ADD CONSTRAINT "EstimateEstimate_frcEstimateId_fkey" FOREIGN KEY ("frcEstimateId") REFERENCES "Estimate"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2219 (class 2606 OID 39930)
-- Name: EstimateItemValue_estimateItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EstimateItemValue"
    ADD CONSTRAINT "EstimateItemValue_estimateItemId_fkey" FOREIGN KEY ("estimateItemId") REFERENCES "EstimateItem"(id) ON UPDATE CASCADE;


--
-- TOC entry 2220 (class 2606 OID 39935)
-- Name: EstimateItemValue_periodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EstimateItemValue"
    ADD CONSTRAINT "EstimateItemValue_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"(id) ON UPDATE CASCADE;


--
-- TOC entry 2218 (class 2606 OID 39918)
-- Name: EstimateItem_costItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "EstimateItem"
    ADD CONSTRAINT "EstimateItem_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "CostItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2235 (class 2606 OID 40176)
-- Name: Estimate_frcId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Estimate"
    ADD CONSTRAINT "Estimate_frcId_fkey" FOREIGN KEY ("frcId") REFERENCES "FRC"(id) ON UPDATE CASCADE;


--
-- TOC entry 2221 (class 2606 OID 39946)
-- Name: Expense_costItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Expense"
    ADD CONSTRAINT "Expense_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "CostItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2222 (class 2606 OID 39951)
-- Name: Expense_periodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Expense"
    ADD CONSTRAINT "Expense_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"(id) ON UPDATE CASCADE;


--
-- TOC entry 2223 (class 2606 OID 39964)
-- Name: Limit_costItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Limit"
    ADD CONSTRAINT "Limit_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "CostItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2224 (class 2606 OID 39969)
-- Name: Limit_periodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Limit"
    ADD CONSTRAINT "Limit_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"(id) ON UPDATE CASCADE;


--
-- TOC entry 2234 (class 2606 OID 40161)
-- Name: Log_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Log"
    ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE;


--
-- TOC entry 2212 (class 2606 OID 39829)
-- Name: Period_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Period"
    ADD CONSTRAINT "Period_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PeriodType"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2215 (class 2606 OID 39862)
-- Name: Product_costItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Product"
    ADD CONSTRAINT "Product_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "CostItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2228 (class 2606 OID 40071)
-- Name: RequestEstimate_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "RequestEstimate"
    ADD CONSTRAINT "RequestEstimate_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2240 (class 2606 OID 40266)
-- Name: RequestItem_periodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "RequestItem"
    ADD CONSTRAINT "RequestItem_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2239 (class 2606 OID 40261)
-- Name: RequestItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "RequestItem"
    ADD CONSTRAINT "RequestItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2238 (class 2606 OID 40256)
-- Name: RequestItem_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "RequestItem"
    ADD CONSTRAINT "RequestItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2211 (class 2606 OID 39810)
-- Name: Request_requesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Request"
    ADD CONSTRAINT "Request_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2229 (class 2606 OID 40081)
-- Name: RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2230 (class 2606 OID 40086)
-- Name: RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2231 (class 2606 OID 40096)
-- Name: UserRole_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "UserRole"
    ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2232 (class 2606 OID 40101)
-- Name: UserRole_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "UserRole"
    ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2225 (class 2606 OID 39983)
-- Name: User_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "User"
    ADD CONSTRAINT "User_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2233 (class 2606 OID 40134)
-- Name: revision-changes_revisionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "revision-changes"
    ADD CONSTRAINT "revision-changes_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES revisions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2393 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-04-25 00:48:32

--
-- PostgreSQL database dump complete
--

