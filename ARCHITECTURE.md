# BidSure AI — System Architecture & Integration Guide
**Problem Statement:** SIH26100 – AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement  
**Team:** X-QUEST  
**Version:** Step 14 Production Integration & Service Architecture

---

## 1. System Overview & Core Philosophy

BidSure AI is an integrated bid compliance verification platform designed for Government e-Procurement (GeM). It ingests tender documents, extracts requirements, processes bidder evidence via document intelligence/OCR, maps evidence to requirements, evaluates compliance rules, performs cross-document consistency checks, generates 15-attribute explainable AI findings, and provides decision support to Procurement Officers.

### Human-in-the-Loop Authority Principle
> **CRITICAL RULE**: The AI system provides decision support, scoring, and risk analysis ONLY. **The system NEVER performs automatic bid qualification or rejection.** All final qualification and disqualification decisions are strictly controlled and executed by the Procurement Officer with recorded rationales and 2-step confirmation.

---

## 2. 14-Step Data Processing Pipeline Architecture

```
[Step 3] Tender Upload PDF
        ↓
[Step 4] Requirement Extraction Matrix (Eligibility, Technical, Financial, Mandatory Docs)
        ↓
[Step 5] Bidder Evidence Ingestion Portal
        ↓
[Step 6] Document Intelligence / OCR Parser (Field Extraction)
        ↓
[Step 7] Requirement → Evidence Mapping (Coverage & Line Traceability)
        ↓
[Step 8] Configurable Compliance Rules Engine (12 Rule Types, 4 Evaluation States)
        ↓
[Step 9] Cross-Document Consistency Engine (Normalization & Entity Conflict Detector)
        ↓
[Step 10] Compliance Score & Risk Profile Analyzer (Weighted Formula & Traceable Findings)
        ↓
[Step 11] Explainable AI Findings Layer (15-Attribute Structured 5-Question Answers)
        ↓
[Step 12] Officer Review & Human Decision Workspace (Verification Actions & Decision Confirmation)
        ↓
[Step 13] System Audit Trail (`/audit`) & Executive Reports Export (`/reports`)
        ↓
[Step 14] Centralized Service Layer (`src/services/`) & REST API Boundaries (`src/app/api/`)
```

---

## 3. Service & Repository Abstraction Layer (`src/services/`)

The application decouples UI components from data persistence via a clean service/repository layer in `src/services/`:

| Service File | Responsibilities | Key Methods |
| :--- | :--- | :--- |
| `tenderService.ts` | Centralized Tender entity management. | `getTenders()`, `getTenderById()`, `addTender()` |
| `bidderService.ts` | Bidder directory & submission tracking. | `getBidders()`, `getBiddersByTenderId()`, `updateSubmittedCount()` |
| `requirementService.ts` | Requirement extraction & matrix structuring. | `getRequirements()`, `getRequirementsByTenderId()`, `addRequirements()` |
| `documentService.ts` | Evidence documents & OCR intelligence records. | `getDocuments()`, `addDocument()`, `saveIntelligenceResult()` |
| `mappingService.ts` | Evidence coverage & requirement mapping. | `mapDocument()`, `unmapDocument()`, `getCoverage()` |
| `complianceService.ts` | Compliance rules, scoring, risk, & explainable AI. | `evaluateAllRules()`, `calculateScore()`, `analyzeRisk()`, `generateExplainableFindings()` |
| `decisionService.ts` | Officer decisions & item verification states. | `getOfficerDecision()`, `saveOfficerDecision()`, `updateFindingVerification()` |
| `auditService.ts` | System audit events logging & inspection. | `getAuditEvents()`, `logAuditEvent()`, `getAuditEventsByTenderId()` |
| `reportService.ts` | Executive report compilation & export data format. | `compileExecutiveReport()` |

---

## 4. REST API Endpoint Specification (`src/app/api/`)

BidSure AI exposes standard Next.js REST API route handlers to provide clean boundaries for future PostgreSQL / Prisma ORM and live GeM API integration:

| HTTP Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tenders` | List all active tenders. |
| `POST` | `/api/tenders` | Create/upload a new tender specification. |
| `GET` | `/api/bidders?tenderId=...` | List bidders (filterable by tender ID). |
| `GET` | `/api/requirements?tenderId=...` | Get structured requirements matrix for a tender. |
| `GET` | `/api/documents?bidderId=...` | Get bidder evidence documents. |
| `POST` | `/api/documents` | Upload a new bidder evidence document. |
| `GET` | `/api/compliance?tenderId=...&bidderId=...` | Get calculated compliance score, risk profile, & explainable findings. |
| `GET` | `/api/decisions?bidderId=...` | Get recorded officer evaluation decisions. |
| `POST` | `/api/decisions` | Save official officer qualification decision / clarification notice. |
| `GET` | `/api/audit?tenderId=...` | Query system audit events log. |
| `POST` | `/api/audit` | Log new system audit event. |

---

## 5. Mock vs Real Backend Integration Readiness

| Component | Current Prototype State | Real Production Integration Boundary |
| :--- | :--- | :--- |
| **Tender & Bidder Ingestion** | In-memory store initialized with prototype demo data (`mockData.ts`). | Replace `tendersStore` / `biddersStore` in `tenderService.ts` & `bidderService.ts` with Prisma ORM (`prisma.tender.findMany()`). |
| **Document OCR Processing** | Client-side fallback text extractor & regex NLP parser (`documentProcessor.ts`). | Connect `documentService.ts` to Tesseract OCR microservice or Google Cloud Vision API. |
| **GeM Portal Clarifications** | Formats official clarification notice text and logs audit record. | Connect `decisionService.ts` to GeM e-Procurement REST API webhook endpoint. |
| **PDF Report Generation** | Native browser print engine (`window.print()`) with print CSS. | Optionally connect `reportService.ts` to a Puppeteer PDF rendering service. |

---

## 6. Security, Validation & Error Handling Guidelines

1. **Input Validation**: All API routes (`/api/tenders`, `/api/documents`, `/api/decisions`, `/api/audit`) enforce mandatory parameter checks (returning `400 Bad Request` on missing parameters).
2. **Zero Credentials Exposure**: No API keys or database connection strings are exposed in client-side code.
3. **Traceability Guarantee**: Every finding, risk item, and decision preserves source line traceability (`Requirement ID -> Rule ID -> Document -> Page Number`).
