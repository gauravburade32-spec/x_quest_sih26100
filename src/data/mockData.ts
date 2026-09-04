/**
 * BIDSURE AI - ENTERPRISE PROCUREMENT DATA REPOSITORY
 * 
 * Verified baseline data model for tender requirements, bidder evidence submissions,
 * compliance rules, risk profiling, and decision traceability.
 */

export type TenderStatus = 
  | 'Draft' 
  | 'Uploaded' 
  | 'Processing' 
  | 'Ready for Review' 
  | 'Ready for Analysis' 
  | 'Active' 
  | 'Under Review' 
  | 'Completed' 
  | 'Pending';

export interface Tender {
  id: string;
  referenceNo: string;
  title: string;
  department: string;
  category: string;
  estimatedValue: string;
  publishingDate: string;
  closingDate: string;
  status: TenderStatus;
  primaryBidder: string;
  bidsCount: number;
  uploadedDocumentName?: string;
  uploadedDocumentSize?: string;
  uploadDate?: string;
}

export type RequirementCategory =
  | 'Eligibility'
  | 'Technical'
  | 'Financial'
  | 'Mandatory Documents'
  | 'Certifications / Standards'
  | 'Tender-Specific Conditions';

export type RequirementStatus =
  | 'Not Yet Verified'
  | 'Ready for Verification'
  | 'Needs Review';

export interface TenderRequirement {
  id: string;
  tenderId: string;
  category: RequirementCategory;
  title: string;
  description: string;
  isMandatory: boolean;
  evidenceExpected: string;
  sourceDocument: string;
  sourcePage: string;
  status: RequirementStatus;
}

export type BidderStatus = 'Documents Pending' | 'Ready for Verification' | 'Draft';

export interface Bidder {
  id: string;
  name: string;
  organizationType: string;
  registrationNo: string;
  contactPerson: string;
  contactEmail: string;
  tenderId: string;
  tenderRef: string;
  tenderTitle: string;
  status: BidderStatus;
  submittedCount: number;
  requiredCount: number;
  gstin?: string;
  pan?: string;
}

export type DocumentUploadStatus = 'Uploaded — Ready for Verification' | 'Not Uploaded' | 'Processed';

export interface BidderDocument {
  id: string;
  bidderId: string;
  tenderId: string;
  requirementId?: string;
  documentTitle: string;
  category: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: DocumentUploadStatus;
}

export type FieldConfidence = 'High' | 'Medium' | 'Low' | 'Not detected';

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: FieldConfidence;
  sourcePage: string;
  status: 'Detected' | 'Not detected' | 'Needs Review';
}

export interface DocumentIntelligenceResult {
  documentId: string;
  documentTitle: string;
  category: string;
  pagesCount: number;
  extractedTextStatus: 'Available' | 'Limited (OCR Required)' | 'Not Available';
  ocrStatus: 'Native PDF Text' | 'OCR Fallback Processed' | 'OCR Failed / Manual Review';
  classificationConfidence: 'High' | 'Medium' | 'Needs Review';
  classificationMethod: 'Text & Layout Analysis' | 'User-selected category classification';
  fields: ExtractedField[];
  rawTextPages: { pageNumber: number; text: string }[];
  processedAt: string;
  mappedRequirementId?: string;
}

export type MappingStatus = 'Mapped' | 'Partially Mapped' | 'Missing Evidence' | 'Needs Review' | 'Not Yet Mapped';

export interface EvidenceMappingItem {
  id: string;
  requirementId: string;
  tenderId: string;
  bidderId: string;
  expectedEvidenceLabel: string;
  mappedDocumentId?: string;
  mappedDocumentTitle?: string;
  mappedFileName?: string;
  extractedFieldsCount?: number;
  status: MappingStatus;
  suggestedMatch: boolean;
  suggestionReason?: string;
  sourcePage?: string;
  mappedAt?: string;
}

export type RuleType =
  | 'EXISTS'
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'GREATER_THAN'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN'
  | 'LESS_THAN_OR_EQUAL'
  | 'CONTAINS'
  | 'DATE_VALIDITY'
  | 'TEXT_MATCH'
  | 'TECHNICAL_THRESHOLD'
  | 'MULTI_EVIDENCE';

export type EvaluationResultState = 'COMPLIANT' | 'NON-COMPLIANT' | 'NEEDS REVIEW' | 'NOT EVALUATED';

export interface ComplianceRule {
  id: string;
  requirementId: string;
  ruleType: RuleType;
  fieldKey: string;
  fieldLabel: string;
  operator: string;
  expectedValue: string | number | boolean;
  expectedValueFormatted: string;
  unit?: string;
  mandatory: boolean;
  description: string;
  version: string;
  status: 'Active' | 'Inactive';
}

export interface RuleEvaluationRecord {
  id: string;
  requirementId: string;
  ruleId: string;
  ruleVersion: string;
  bidderId: string;
  tenderId: string;
  documentId?: string;
  sourcePage?: string;
  fieldKey: string;
  expectedValue: string;
  actualValue: string;
  confidence: FieldConfidence;
  result: EvaluationResultState;
  reason: string;
  evaluatedAt: string;
}

export type ConsistencyResultState = 'CONSISTENT' | 'INCONSISTENT' | 'NEEDS REVIEW' | 'NOT AVAILABLE';

export interface DocumentFieldSource {
  documentId: string;
  documentTitle: string;
  fileName: string;
  extractedValue: string;
  confidence: FieldConfidence;
  sourcePage: string;
}

export interface CrossDocumentFieldComparison {
  id: string;
  attributeKey: string;
  attributeLabel: string;
  sources: DocumentFieldSource[];
  result: ConsistencyResultState;
  confidence: FieldConfidence;
  comparisonLogic: string;
  explanation: string;
  evaluatedAt: string;
}

export interface ExplainableFinding {
  findingId: string;
  findingTitle: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  requirementId?: string;
  requirementTitle?: string;
  whyGenerated: string;
  expectedCondition: string;
  actualCondition: string;
  sourceDocumentName: string;
  sourcePage: string;
  extractionConfidence: FieldConfidence;
  ruleOrComparisonLogic: string;
  humanReadableExplanation: string;
  recommendedOfficerAction: string;
  traceability: string;
}

export type OfficerDecisionState = 'Qualified' | 'Disqualified' | 'Clarification Requested' | 'Under Review';
export type FindingVerificationState = 'Verified / Confirmed' | 'Needs Clarification' | 'Mark as Resolved' | 'Keep Pending';

export interface OfficerDecisionRecord {
  id: string;
  tenderId: string;
  bidderId: string;
  bidderName: string;
  tenderRef: string;
  decision: OfficerDecisionState;
  rationale: string;
  clarificationText?: string;
  scorePercentage: number;
  riskLevel: string;
  verifiedFindingsCount: number;
  totalFindingsCount: number;
  timestamp: string;
  officerName: string;
  traceabilitySummary: string;
}

// STEP 13: AUDIT EVENT DATA MODEL
export type AuditEventType =
  | 'Tender Upload'
  | 'Requirement Extraction'
  | 'Document Submission'
  | 'OCR Processing'
  | 'Evidence Mapping'
  | 'Rule Evaluation'
  | 'Consistency Check'
  | 'Risk Analysis'
  | 'AI Explanation'
  | 'Officer Verification'
  | 'Clarification Notice'
  | 'Human Decision'
  | 'Report Export';

export type UserRole =
  | 'GeM Ingestion System'
  | 'OCR Engine'
  | 'Verification Engine'
  | 'Procurement Officer';

export interface AuditEvent {
  id: string;
  action: string;
  eventType: AuditEventType;
  user: string;
  userRole: UserRole;
  tenderId: string;
  tenderRef: string;
  bidderId?: string;
  bidderName?: string;
  requirementId?: string;
  findingId?: string;
  documentName?: string;
  sourcePage?: string;
  previousStatus?: string;
  newStatus?: string;
  details: string;
  timestamp: string;
  traceabilityLine: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  user: string;
  type: 'info' | 'warning' | 'success' | 'alert';
}

export interface AiAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  tenderRef: string;
  bidderName: string;
  timestamp: string;
}

export interface CompliancePercentage {
  label: string;
  percentage: number;
  count: number;
  statusType: 'compliant' | 'needs_review' | 'non_compliant';
  color: string;
}

export interface RiskSummaryItem {
  level: 'low' | 'medium' | 'high';
  label: string;
  count: number;
  description: string;
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  variant: 'primary' | 'secondary' | 'outline';
}

// Initial chronological audit log records covering all 14 procurement event types
export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "AUD-014",
    action: "Recorded GeM Clarification Request",
    eventType: "Clarification Notice",
    user: "Rajesh V.",
    userRole: "Procurement Officer",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    requirementId: "REQ-DOC-001",
    findingId: "XAI-EVAL-RULE-DOC-001-01",
    documentName: "OEM_MAF_Authorization_Letter_ABC.pdf",
    sourcePage: "Page 1",
    previousStatus: "Under Review",
    newStatus: "Clarification Requested",
    details: "Issued official GeM portal clarification notice requesting signed OEM MAF authorization letter.",
    timestamp: "Today, 11:45 AM",
    traceabilityLine: "GEM/2026/B/492104 • REQ-DOC-001 • OEM_MAF_Authorization_Letter_ABC.pdf",
  },
  {
    id: "AUD-013",
    action: "Item Verification Status Updated",
    eventType: "Officer Verification",
    user: "Rajesh V.",
    userRole: "Procurement Officer",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    findingId: "XAI-EVAL-RULE-FIN-001-02",
    documentName: "ABC_Tech_Audited_Turnover_FY22-25.pdf",
    sourcePage: "Page 4",
    previousStatus: "Keep Pending",
    newStatus: "Needs Clarification",
    details: "Marked CA UDIN format verification for ICAI portal checking.",
    timestamp: "Today, 11:40 AM",
    traceabilityLine: "GEM/2026/B/492104 • REQ-FIN-001 • Page 4",
  },
  {
    id: "AUD-012",
    action: "Generated Explainable AI Findings",
    eventType: "AI Explanation",
    user: "AI Explanation Engine",
    userRole: "Verification Engine",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    details: "Transformed rule evaluations and consistency conflicts into 15-attribute structured explainable findings.",
    timestamp: "Today, 11:35 AM",
    traceabilityLine: "GEM/2026/B/492104 • BID-2026-901 • 5 Explainable Findings",
  },
  {
    id: "AUD-011",
    action: "Evaluated Risk Assessment Profile",
    eventType: "Risk Analysis",
    user: "Risk Engine",
    userRole: "Verification Engine",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    previousStatus: "Unassessed",
    newStatus: "HIGH RISK",
    details: "Assigned HIGH RISK level due to unmapped mandatory OEM MAF evidence and switch port specification check.",
    timestamp: "Today, 11:32 AM",
    traceabilityLine: "GEM/2026/B/492104 • Risk Profile • High Severity Findings",
  },
  {
    id: "AUD-010",
    action: "Executed Cross-Document Consistency Check",
    eventType: "Consistency Check",
    user: "Consistency Engine",
    userRole: "Verification Engine",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    details: "Analyzed 7 cross-document attributes across Incorporation, GST, and PAN records; flagged 1 entity type conflict.",
    timestamp: "Today, 11:30 AM",
    traceabilityLine: "GEM/2026/B/492104 • CROSS-004 • Org Type Conflict",
  },
  {
    id: "AUD-009",
    action: "Executed Compliance Rules Engine",
    eventType: "Rule Evaluation",
    user: "Rules Evaluator",
    userRole: "Verification Engine",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    details: "Evaluated 6 compliance rules against mapped evidence documents; calculated 31.3% compliance score.",
    timestamp: "Today, 11:25 AM",
    traceabilityLine: "GEM/2026/B/492104 • 6 Rules Executed • 31.3% Score",
  },
  {
    id: "AUD-008",
    action: "Mapped Requirement to Evidence Document",
    eventType: "Evidence Mapping",
    user: "Rajesh V.",
    userRole: "Procurement Officer",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    requirementId: "REQ-FIN-001",
    documentName: "ABC_Tech_Audited_Turnover_FY22-25.pdf",
    sourcePage: "Page 4",
    previousStatus: "Not Yet Mapped",
    newStatus: "Needs Review",
    details: "Mapped Audited Balance Sheet & CA Certificate to Financial Turnover requirement.",
    timestamp: "Today, 10:45 AM",
    traceabilityLine: "GEM/2026/B/492104 • REQ-FIN-001 • Page 4",
  },
  {
    id: "AUD-007",
    action: "Processed Document Intelligence & OCR",
    eventType: "OCR Processing",
    user: "Tesseract OCR Service",
    userRole: "OCR Engine",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    documentName: "ABC_Tech_GSTIN_Certificate_2026.pdf",
    sourcePage: "Page 1",
    details: "Extracted legal entity name, GSTIN (27AAACA1234B1Z9), trade name, and registration date with High confidence.",
    timestamp: "Today, 09:32 AM",
    traceabilityLine: "GEM/2026/B/492104 • DOC-901-02 • Page 1",
  },
  {
    id: "AUD-006",
    action: "Received Bidder Evidence Documents",
    eventType: "Document Submission",
    user: "GeM Bid Portal Sync",
    userRole: "GeM Ingestion System",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    details: "Ingested 6 evidence document files submitted by ABC Technologies Pvt. Ltd.",
    timestamp: "Today, 09:30 AM",
    traceabilityLine: "GEM/2026/B/492104 • BID-2026-901 • 6 PDF Files",
  },
  {
    id: "AUD-005",
    action: "Structured Requirement Matrix Extraction",
    eventType: "Requirement Extraction",
    user: "NLP Requirement Parser",
    userRole: "GeM Ingestion System",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    details: "Parsed tender PDF and extracted 8 structured requirements categorized into Eligibility, Technical, Financial, and Mandatory Documents.",
    timestamp: "14 Feb 2026, 02:15 PM",
    traceabilityLine: "GEM/2026/B/492104 • 8 Requirements Structured",
  },
  {
    id: "AUD-004",
    action: "Uploaded Tender Document PDF",
    eventType: "Tender Upload",
    user: "GeM Procurement Ingestion",
    userRole: "GeM Ingestion System",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    documentName: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    details: "Uploaded tender specification document (4.8 MB) for Supply of Enterprise Computing & Networking Equipment.",
    timestamp: "14 Feb 2026, 02:00 PM",
    traceabilityLine: "GEM/2026/B/492104 • Tender_Doc_Enterprise_Computing_GEM492104.pdf",
  },
];

// Default initial officer decision records for prototype demonstration
export const MOCK_OFFICER_DECISIONS: Record<string, OfficerDecisionRecord> = {
  "BID-2026-901": {
    id: "DEC-901-2026",
    tenderId: "TND-2026-GEM-8921",
    bidderId: "BID-2026-901",
    bidderName: "ABC Technologies Pvt. Ltd.",
    tenderRef: "GEM/2026/B/492104",
    decision: "Clarification Requested",
    rationale: "Officer requested clarification regarding unmapped OEM MAF authorization letter and CA UDIN portal format verification.",
    clarificationText: "Please upload official OEM Manufacturer Authorization Form on letterhead signed by India Country Head within 3 business days.",
    scorePercentage: 31.3,
    riskLevel: "HIGH RISK",
    verifiedFindingsCount: 2,
    totalFindingsCount: 5,
    timestamp: "Today, 11:45 AM",
    officerName: "Rajesh V. (Senior Procurement Officer)",
    traceabilitySummary: "GEM/2026/B/492104 • REQ-DOC-001 • REQ-FIN-001",
  },
};

// ==========================================
// 1. KPI OVERVIEW (SYNTHETIC DEMO DATA)
// ==========================================
export const KPI_METRICS = [
  {
    title: "Active Tenders",
    value: "12",
    subtitle: "Currently open for bidding",
    trend: "+2 this week",
    trendType: "neutral" as const,
    icon: "FileText",
  },
  {
    title: "Bids Under Review",
    value: "37",
    subtitle: "Awaiting compliance check",
    trend: "5 processed today",
    trendType: "neutral" as const,
    icon: "FileSearch",
  },
  {
    title: "Needs Review",
    value: "8",
    subtitle: "Minor discrepancies flagged",
    trend: "Requires officer review",
    trendType: "warning" as const,
    icon: "AlertTriangle",
  },
  {
    title: "Critical Flags",
    value: "3",
    subtitle: "High priority eligibility issues",
    trend: "Immediate action required",
    trendType: "danger" as const,
    icon: "ShieldAlert",
  },
];

// ==========================================
// 2. ACTIVE TENDERS (SYNTHETIC DEMO DATA)
// ==========================================
export const MOCK_TENDERS_LIST: Tender[] = [
  {
    id: "TND-2026-GEM-8921",
    referenceNo: "GEM/2026/B/492104",
    title: "Supply of Enterprise Computing & Networking Equipment",
    department: "Ministry of Electronics & IT (MeitY)",
    category: "Information Technology Infrastructure",
    estimatedValue: "₹4,85,00,000",
    publishingDate: "14 Feb 2026",
    closingDate: "15 Mar 2026",
    status: "Under Review",
    primaryBidder: "ABC Technologies Pvt. Ltd.",
    bidsCount: 5,
    uploadedDocumentName: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    uploadedDocumentSize: "4.8 MB",
    uploadDate: "14 Feb 2026",
  },
  {
    id: "TND-2026-GEM-7410",
    referenceNo: "GEM/2026/B/4741029",
    title: "Annual Maintenance Contract for Data Center & HVAC Systems",
    department: "Department of Telecommunications (DoT)",
    category: "Electrical & Facilities Management",
    estimatedValue: "₹1,20,00,000",
    publishingDate: "10 Feb 2026",
    closingDate: "02 Mar 2026",
    status: "Active",
    primaryBidder: "Apex Infra Solutions LLP",
    bidsCount: 3,
    uploadedDocumentName: "AMC_DataCenter_HVAC_GEM4741029.pdf",
    uploadedDocumentSize: "3.2 MB",
    uploadDate: "10 Feb 2026",
  },
  {
    id: "TND-2026-GEM-6632",
    referenceNo: "GEM/2026/B/4663211",
    title: "Procurement of High-Resolution Surveillance Cameras & NVR Hardware",
    department: "Ministry of Home Affairs (MHA)",
    category: "Security & Surveillance Systems",
    estimatedValue: "₹2,75,00,000",
    publishingDate: "01 Feb 2026",
    closingDate: "28 Feb 2026",
    status: "Ready for Review",
    primaryBidder: "Vanguard Tech Supplies",
    bidsCount: 4,
    uploadedDocumentName: "CCTV_Surveillance_NVR_GEM4663211.pdf",
    uploadedDocumentSize: "6.1 MB",
    uploadDate: "01 Feb 2026",
  },
  {
    id: "TND-2026-GEM-5520",
    referenceNo: "GEM/2026/B/4552090",
    title: "Supply of Network Security Appliances",
    department: "National Informatics Centre (NIC)",
    category: "Cybersecurity Infrastructure",
    estimatedValue: "₹3,10,00,000",
    publishingDate: "18 Feb 2026",
    closingDate: "10 Mar 2026",
    status: "Active",
    primaryBidder: "CipherSec Systems India",
    bidsCount: 6,
    uploadedDocumentName: "Network_Security_Appliances_GEM4552090.pdf",
    uploadedDocumentSize: "5.4 MB",
    uploadDate: "18 Feb 2026",
  },
  {
    id: "TND-2026-GEM-4331",
    referenceNo: "GEM/2026/B/4331088",
    title: "Enterprise Software Licensing & Support",
    department: "Centre for Development of Advanced Computing (C-DAC)",
    category: "Software & Cloud Services",
    estimatedValue: "₹95,00,000",
    publishingDate: "20 Feb 2026",
    closingDate: "18 Mar 2026",
    status: "Draft",
    primaryBidder: "CloudMatrix Solutions Pvt. Ltd.",
    bidsCount: 2,
    uploadedDocumentName: "Software_Licensing_GEM4331088.pdf",
    uploadedDocumentSize: "2.9 MB",
    uploadDate: "20 Feb 2026",
  },
];

// ==========================================
// 3. TENDER REQUIREMENTS (SYNTHETIC PROTOTYPE DATA)
// ==========================================
export const MOCK_REQUIREMENTS: TenderRequirement[] = [
  {
    id: "REQ-ELIG-001",
    tenderId: "TND-2026-GEM-8921",
    category: "Eligibility",
    title: "Legal Entity Registration & Incorporation",
    description: "Bidder must satisfy the eligibility criteria specified in the tender and be registered under the Companies Act 2013 or LLP Act in India for at least 5 years.",
    isMandatory: true,
    evidenceExpected: "Certificate of Incorporation, GST Registration & PAN Card",
    sourceDocument: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    sourcePage: "Tender Document — Page 4",
    status: "Ready for Verification",
  },
  {
    id: "REQ-TECH-001",
    tenderId: "TND-2026-GEM-8921",
    category: "Technical",
    title: "Enterprise Server Processing & RAM Specification",
    description: "Enterprise Rack Server processor must be latest generation Intel Xeon / AMD EPYC with minimum 64 Cores and RAM must be at least 128 GB DDR5 expandable to 512 GB.",
    isMandatory: true,
    evidenceExpected: "Technical specification data sheet & OEM product document",
    sourceDocument: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    sourcePage: "Tender Document — Page 12",
    status: "Ready for Verification",
  },
  {
    id: "REQ-TECH-002",
    tenderId: "TND-2026-GEM-8921",
    category: "Technical",
    title: "Managed Core Switch Port Density & Switching Fabric",
    description: "Layer-3 Managed Network Switch with minimum 48x 10GbE SFP+ ports and dual redundant hot-swappable power supply units.",
    isMandatory: true,
    evidenceExpected: "Technical Compliance Statement & Lab Test Certificate",
    sourceDocument: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    sourcePage: "Tender Document — Page 14",
    status: "Not Yet Verified",
  },
  {
    id: "REQ-FIN-001",
    tenderId: "TND-2026-GEM-8921",
    category: "Financial",
    title: "Minimum Average Annual Financial Turnover (₹2.0 Crore)",
    description: "Average annual turnover of the bidder during the last 3 financial years (FY 2022-23, 2023-24, 2024-25) must be at least ₹2.0 Crore.",
    isMandatory: true,
    evidenceExpected: "Audited Balance Sheets & CA Turnover Certificate with UDIN",
    sourceDocument: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    sourcePage: "Tender Document — Page 8",
    status: "Needs Review",
  },
  {
    id: "REQ-FIN-002",
    tenderId: "TND-2026-GEM-8921",
    category: "Financial",
    title: "Earnest Money Deposit (EMD) / Bid Security Declaration",
    description: "Bidder must submit EMD instrument of ₹9,70,000 or valid Micro & Small Enterprises (MSE) registration certificate for EMD exemption.",
    isMandatory: true,
    evidenceExpected: "Bank Guarantee / Demand Draft / MSE Certificate",
    sourceDocument: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    sourcePage: "Tender Document — Page 9",
    status: "Ready for Verification",
  },
  {
    id: "REQ-DOC-001",
    tenderId: "TND-2026-GEM-8921",
    category: "Mandatory Documents",
    title: "OEM Manufacturer Authorization Form (MAF)",
    description: "Bidder must submit specific Manufacturer Authorization Form (MAF) from the server & networking OEMs authorizing bidder to supply and service equipment.",
    isMandatory: true,
    evidenceExpected: "Official OEM MAF on Original Letterhead signed by India Head",
    sourceDocument: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    sourcePage: "Tender Document — Page 18",
    status: "Needs Review",
  },
  {
    id: "REQ-CERT-001",
    tenderId: "TND-2026-GEM-8921",
    category: "Certifications / Standards",
    title: "ISO 9001:2015 & ISO 27001 Security Certification",
    description: "Bidder must hold valid ISO 9001:2015 Quality Management System and ISO 27001 Information Security Management System certifications.",
    isMandatory: false,
    evidenceExpected: "Valid ISO Quality & Information Security Certificates",
    sourceDocument: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    sourcePage: "Tender Document — Page 22",
    status: "Not Yet Verified",
  },
  {
    id: "REQ-SPEC-001",
    tenderId: "TND-2026-GEM-8921",
    category: "Tender-Specific Conditions",
    title: "On-Site 3-Year 24/7 Comprehensive OEM Warranty",
    description: "All hardware supplied must carry 3 years 24x7 4-hour response time on-site comprehensive OEM warranty support.",
    isMandatory: true,
    evidenceExpected: "Undertaking for 3-Year On-Site Support signed by OEM",
    sourceDocument: "Tender_Doc_Enterprise_Computing_GEM492104.pdf",
    sourcePage: "Tender Document — Page 26",
    status: "Not Yet Verified",
  },
];

// Default synthetic requirements generator for newly uploaded tenders
export const GENERATE_DEFAULT_REQUIREMENTS = (tenderId: string, tenderTitle: string, docName: string): TenderRequirement[] => [
  {
    id: `REQ-ELIG-101`,
    tenderId,
    category: "Eligibility",
    title: "Legal Entity Registration & Incorporation",
    description: `Bidder must be a registered entity in India with valid GST and PAN registrations for ${tenderTitle}.`,
    isMandatory: true,
    evidenceExpected: "Certificate of Incorporation, GST & PAN Certificates",
    sourceDocument: docName || "Tender_Document.pdf",
    sourcePage: "Tender Document — Page 3",
    status: "Ready for Verification",
  },
  {
    id: `REQ-TECH-101`,
    tenderId,
    category: "Technical",
    title: "Technical Specification Conformance",
    description: "Equipment offered must strictly meet all technical specifications outlined in Section-IV of the tender document.",
    isMandatory: true,
    evidenceExpected: "Technical Compliance Matrix & Product Data Sheets",
    sourceDocument: docName || "Tender_Document.pdf",
    sourcePage: "Tender Document — Page 10",
    status: "Not Yet Verified",
  },
  {
    id: `REQ-FIN-101`,
    tenderId,
    category: "Financial",
    title: "Past Financial Turnover Threshold",
    description: "Average annual turnover of the bidder during the last 3 financial years must meet minimum tender requirements.",
    isMandatory: true,
    evidenceExpected: "Audited Financial Statements & CA Certificate",
    sourceDocument: docName || "Tender_Document.pdf",
    sourcePage: "Tender Document — Page 6",
    status: "Not Yet Verified",
  },
  {
    id: `REQ-DOC-101`,
    tenderId,
    category: "Mandatory Documents",
    title: "Signed Tender Acceptability Undertaking",
    description: "Undertaking accepting all tender terms, non-blacklisting declaration, and integrity pact.",
    isMandatory: true,
    evidenceExpected: "Signed & Stamped Annexure-I Declaration",
    sourceDocument: docName || "Tender_Document.pdf",
    sourcePage: "Tender Document — Page 15",
    status: "Ready for Verification",
  },
];

// ==========================================
// 4. BIDDERS DIRECTORY (SYNTHETIC PROTOTYPE DATA)
// ==========================================
export const MOCK_BIDDERS_LIST: Bidder[] = [
  {
    id: "BID-2026-901",
    name: "ABC Technologies Pvt. Ltd.",
    organizationType: "Private Limited Company",
    registrationNo: "CIN-U72900MH2019PTC321456",
    contactPerson: "Rajesh Kumar (Director)",
    contactEmail: "r.kumar@abctechnologies.co.in",
    tenderId: "TND-2026-GEM-8921",
    tenderRef: "GEM/2026/B/492104",
    tenderTitle: "Supply of Enterprise Computing & Networking Equipment",
    status: "Ready for Verification",
    submittedCount: 6,
    requiredCount: 9,
    gstin: "27AAACA1234B1Z9",
    pan: "AAACA1234B",
  },
  {
    id: "BID-2026-902",
    name: "Apex Infra Solutions LLP",
    organizationType: "Limited Liability Partnership",
    registrationNo: "LLPIN-AAB-1234",
    contactPerson: "Sunil Mehta (Designated Partner)",
    contactEmail: "s.mehta@apexinfra.in",
    tenderId: "TND-2026-GEM-7410",
    tenderRef: "GEM/2026/B/4741029",
    tenderTitle: "Annual Maintenance Contract for Data Center & HVAC Systems",
    status: "Documents Pending",
    submittedCount: 4,
    requiredCount: 9,
    gstin: "27AABFA4567C1Z2",
    pan: "AABFA4567C",
  },
  {
    id: "BID-2026-903",
    name: "Vanguard Tech Supplies",
    organizationType: "Sole Proprietorship",
    registrationNo: "GSTIN-27AAACV1234F1Z5",
    contactPerson: "Vikram Singh (Proprietor)",
    contactEmail: "v.singh@vanguardtech.com",
    tenderId: "TND-2026-GEM-6632",
    tenderRef: "GEM/2026/B/4663211",
    tenderTitle: "Procurement of High-Resolution Surveillance Cameras & NVR Hardware",
    status: "Ready for Verification",
    submittedCount: 8,
    requiredCount: 9,
    gstin: "27AAACV1234F1Z5",
    pan: "AAACV1234F",
  },
  {
    id: "BID-2026-904",
    name: "CipherSec Systems India",
    organizationType: "Private Limited Company",
    registrationNo: "CIN-U72200DL2020PTC456789",
    contactPerson: "Ananya Roy (Head Government Sales)",
    contactEmail: "a.roy@ciphersec.in",
    tenderId: "TND-2026-GEM-5520",
    tenderRef: "GEM/2026/B/4552090",
    tenderTitle: "Supply of Network Security Appliances",
    status: "Documents Pending",
    submittedCount: 5,
    requiredCount: 9,
    gstin: "07AACCC9876D1Z1",
    pan: "AACCC9876D",
  },
  {
    id: "BID-2026-905",
    name: "CloudMatrix Solutions Pvt. Ltd.",
    organizationType: "Private Limited Company",
    registrationNo: "CIN-U72300KA2021PTC567890",
    contactPerson: "Siddharth Rao (Managing Director)",
    contactEmail: "s.rao@cloudmatrix.io",
    tenderId: "TND-2026-GEM-4331",
    tenderRef: "GEM/2026/B/4331088",
    tenderTitle: "Enterprise Software Licensing & Support",
    status: "Draft",
    submittedCount: 2,
    requiredCount: 9,
    gstin: "29AACCM3456E1Z3",
    pan: "AACCM3456E",
  },
];

// ==========================================
// 5. BIDDER EVIDENCE DOCUMENTS (SYNTHETIC PROTOTYPE DATA)
// ==========================================
export const MOCK_BIDDER_DOCUMENTS: BidderDocument[] = [
  {
    id: "DOC-901-01",
    bidderId: "BID-2026-901",
    tenderId: "TND-2026-GEM-8921",
    requirementId: "REQ-ELIG-001",
    documentTitle: "Certificate of Incorporation",
    category: "Certificate of Incorporation",
    fileName: "ABC_Tech_Certificate_of_Incorporation.pdf",
    fileSize: "2.4 MB",
    uploadedAt: "Today, 09:30 AM",
    status: "Uploaded — Ready for Verification",
  },
  {
    id: "DOC-901-02",
    bidderId: "BID-2026-901",
    tenderId: "TND-2026-GEM-8921",
    requirementId: "REQ-ELIG-001",
    documentTitle: "GST Registration Certificate",
    category: "GST Registration",
    fileName: "ABC_Tech_GSTIN_Certificate_2026.pdf",
    fileSize: "1.1 MB",
    uploadedAt: "Today, 09:32 AM",
    status: "Uploaded — Ready for Verification",
  },
  {
    id: "DOC-901-03",
    bidderId: "BID-2026-901",
    tenderId: "TND-2026-GEM-8921",
    requirementId: "REQ-ELIG-001",
    documentTitle: "PAN Card Copy",
    category: "PAN Card",
    fileName: "ABC_Tech_PAN_Card_Copy.pdf",
    fileSize: "0.8 MB",
    uploadedAt: "Today, 09:33 AM",
    status: "Uploaded — Ready for Verification",
  },
  {
    id: "DOC-901-04",
    bidderId: "BID-2026-901",
    tenderId: "TND-2026-GEM-8921",
    requirementId: "REQ-TECH-001",
    documentTitle: "Technical Specification Conformance Statement",
    category: "Technical Specification Conformance",
    fileName: "ABC_Tech_Server_Switch_Tech_Compliance.pdf",
    fileSize: "5.8 MB",
    uploadedAt: "Today, 10:15 AM",
    status: "Uploaded — Ready for Verification",
  },
  {
    id: "DOC-901-05",
    bidderId: "BID-2026-901",
    tenderId: "TND-2026-GEM-8921",
    requirementId: "REQ-FIN-001",
    documentTitle: "Audited Balance Sheet & CA Turnover Certificate",
    category: "Financial Evidence (Audited Balance Sheet)",
    fileName: "ABC_Tech_Audited_Turnover_FY22-25.pdf",
    fileSize: "3.9 MB",
    uploadedAt: "Today, 10:40 AM",
    status: "Uploaded — Ready for Verification",
  },
  {
    id: "DOC-901-06",
    bidderId: "BID-2026-901",
    tenderId: "TND-2026-GEM-8921",
    requirementId: "REQ-DOC-001",
    documentTitle: "OEM Manufacturer Authorization Form (MAF)",
    category: "OEM Authorization Form (MAF)",
    fileName: "OEM_MAF_Authorization_Letter_ABC.pdf",
    fileSize: "1.7 MB",
    uploadedAt: "Today, 11:10 AM",
    status: "Uploaded — Ready for Verification",
  },
];

// Pre-configured synthetic extraction results for default mock documents
export const MOCK_INTELLIGENCE_RESULTS: Record<string, DocumentIntelligenceResult> = {
  "DOC-901-02": {
    documentId: "DOC-901-02",
    documentTitle: "GST Registration Certificate",
    category: "GST Registration",
    pagesCount: 1,
    extractedTextStatus: "Available",
    ocrStatus: "Native PDF Text",
    classificationConfidence: "High",
    classificationMethod: "Text & Layout Analysis",
    mappedRequirementId: "REQ-ELIG-001",
    processedAt: "Today, 09:32 AM",
    fields: [
      {
        key: "legal_name",
        label: "Legal Business Name",
        value: "ABC Technologies Private Limited",
        confidence: "High",
        sourcePage: "Page 1",
        status: "Detected",
      },
      {
        key: "gstin",
        label: "GSTIN / Registration Number",
        value: "27AAACA1234B1Z9",
        confidence: "High",
        sourcePage: "Page 1",
        status: "Detected",
      },
      {
        key: "trade_name",
        label: "Trade Name",
        value: "ABC Technologies",
        confidence: "High",
        sourcePage: "Page 1",
        status: "Detected",
      },
      {
        key: "reg_date",
        label: "Registration Date",
        value: "14/06/2019",
        confidence: "High",
        sourcePage: "Page 1",
        status: "Detected",
      },
    ],
    rawTextPages: [
      {
        pageNumber: 1,
        text: `GOVERNMENT OF INDIA / STATE TAX DEPARTMENT\nREGISTRATION CERTIFICATE\nGSTIN: 27AAACA1234B1Z9\nLegal Name: ABC Technologies Private Limited`,
      },
    ],
  },
  "DOC-901-03": {
    documentId: "DOC-901-03",
    documentTitle: "PAN Card Copy",
    category: "PAN Card",
    pagesCount: 1,
    extractedTextStatus: "Available",
    ocrStatus: "Native PDF Text",
    classificationConfidence: "High",
    classificationMethod: "Text & Layout Analysis",
    mappedRequirementId: "REQ-ELIG-001",
    processedAt: "Today, 09:33 AM",
    fields: [
      {
        key: "entity_name",
        label: "Entity Name",
        value: "ABC TECHNOLOGIES PVT LTD",
        confidence: "High",
        sourcePage: "Page 1",
        status: "Detected",
      },
      {
        key: "pan_number",
        label: "PAN Number",
        value: "AAACA1234B",
        confidence: "High",
        sourcePage: "Page 1",
        status: "Detected",
      },
    ],
    rawTextPages: [
      {
        pageNumber: 1,
        text: `INCOME TAX DEPARTMENT\nPAN: AAACA1234B\nName: ABC TECHNOLOGIES PVT LTD`,
      },
    ],
  },
  "DOC-901-05": {
    documentId: "DOC-901-05",
    documentTitle: "Audited Balance Sheet & CA Turnover Certificate",
    category: "Financial Evidence (Audited Balance Sheet)",
    pagesCount: 4,
    extractedTextStatus: "Available",
    ocrStatus: "Native PDF Text",
    classificationConfidence: "High",
    classificationMethod: "Text & Layout Analysis",
    mappedRequirementId: "REQ-FIN-001",
    processedAt: "Today, 10:40 AM",
    fields: [
      {
        key: "turnover",
        label: "Average Annual Turnover",
        value: "₹2.4 Crore",
        confidence: "High",
        sourcePage: "Page 4",
        status: "Detected",
      },
      {
        key: "udin",
        label: "CA UDIN Reference",
        value: "24019283ABCF9283",
        confidence: "Medium",
        sourcePage: "Page 4",
        status: "Needs Review",
      },
    ],
    rawTextPages: [
      {
        pageNumber: 4,
        text: `CHARTERED ACCOUNTANTS TURNOVER CERTIFICATE\nAverage Annual Financial Turnover: ₹2.4 Crore\nUDIN: 24019283ABCF9283`,
      },
    ],
  },
};

// ==========================================
// 6. REQUIREMENT → EVIDENCE MAPPINGS (SYNTHETIC PROTOTYPE DATA)
// ==========================================
export const MOCK_EVIDENCE_MAPPINGS: EvidenceMappingItem[] = [
  {
    id: "MAP-901-01",
    requirementId: "REQ-ELIG-001",
    tenderId: "TND-2026-GEM-8921",
    bidderId: "BID-2026-901",
    expectedEvidenceLabel: "Certificate of Incorporation",
    mappedDocumentId: "DOC-901-01",
    mappedDocumentTitle: "Certificate of Incorporation",
    mappedFileName: "ABC_Tech_Certificate_of_Incorporation.pdf",
    extractedFieldsCount: 2,
    status: "Mapped",
    suggestedMatch: true,
    suggestionReason: "Document category matches expected Incorporation evidence.",
    sourcePage: "Page 1",
    mappedAt: "Today, 09:35 AM",
  },
  {
    id: "MAP-901-02",
    requirementId: "REQ-ELIG-001",
    tenderId: "TND-2026-GEM-8921",
    bidderId: "BID-2026-901",
    expectedEvidenceLabel: "GST Registration Certificate",
    mappedDocumentId: "DOC-901-02",
    mappedDocumentTitle: "GST Registration Certificate",
    mappedFileName: "ABC_Tech_GSTIN_Certificate_2026.pdf",
    extractedFieldsCount: 4,
    status: "Mapped",
    suggestedMatch: true,
    suggestionReason: "Document category matches expected GST Registration evidence.",
    sourcePage: "Page 1",
    mappedAt: "Today, 09:35 AM",
  },
  {
    id: "MAP-901-03",
    requirementId: "REQ-ELIG-001",
    tenderId: "TND-2026-GEM-8921",
    bidderId: "BID-2026-901",
    expectedEvidenceLabel: "PAN Card Copy",
    mappedDocumentId: "DOC-901-03",
    mappedDocumentTitle: "PAN Card Copy",
    mappedFileName: "ABC_Tech_PAN_Card_Copy.pdf",
    extractedFieldsCount: 2,
    status: "Mapped",
    suggestedMatch: true,
    suggestionReason: "Document category matches expected PAN Card evidence.",
    sourcePage: "Page 1",
    mappedAt: "Today, 09:35 AM",
  },
  {
    id: "MAP-901-04",
    requirementId: "REQ-TECH-001",
    tenderId: "TND-2026-GEM-8921",
    bidderId: "BID-2026-901",
    expectedEvidenceLabel: "Technical Specification Data Sheet",
    mappedDocumentId: "DOC-901-04",
    mappedDocumentTitle: "Technical Specification Conformance Statement",
    mappedFileName: "ABC_Tech_Server_Switch_Tech_Compliance.pdf",
    extractedFieldsCount: 3,
    status: "Mapped",
    suggestedMatch: true,
    suggestionReason: "Technical Specification keyword match.",
    sourcePage: "Page 2",
    mappedAt: "Today, 10:20 AM",
  },
  {
    id: "MAP-901-06",
    requirementId: "REQ-FIN-001",
    tenderId: "TND-2026-GEM-8921",
    bidderId: "BID-2026-901",
    expectedEvidenceLabel: "Audited Balance Sheets & CA Turnover Certificate",
    mappedDocumentId: "DOC-901-05",
    mappedDocumentTitle: "Audited Balance Sheet & CA Turnover Certificate",
    mappedFileName: "ABC_Tech_Audited_Turnover_FY22-25.pdf",
    extractedFieldsCount: 2,
    status: "Needs Review",
    suggestedMatch: true,
    suggestionReason: "UDIN verification flag requiring officer check.",
    sourcePage: "Page 4",
    mappedAt: "Today, 10:45 AM",
  },
  {
    id: "MAP-901-07",
    requirementId: "REQ-DOC-001",
    tenderId: "TND-2026-GEM-8921",
    bidderId: "BID-2026-901",
    expectedEvidenceLabel: "Official OEM Manufacturer Authorization Form (MAF)",
    status: "Missing Evidence",
    suggestedMatch: false,
  },
];

// ==========================================
// 7. STEP 8: CONFIGURABLE COMPLIANCE RULES (SYNTHETIC PROTOTYPE RULES)
// ==========================================
export const MOCK_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: "RULE-ELIG-001",
    requirementId: "REQ-ELIG-001",
    ruleType: "MULTI_EVIDENCE",
    fieldKey: "legal_entity",
    fieldLabel: "Incorporation, GST & PAN Evidence",
    operator: "EXISTS",
    expectedValue: "Complete",
    expectedValueFormatted: "Certificate of Incorporation + GST + PAN Card",
    mandatory: true,
    description: "Tender-defined mandatory legal entity registration checklist.",
    version: "1.0",
    status: "Active",
  },
  {
    id: "RULE-FIN-001",
    requirementId: "REQ-FIN-001",
    ruleType: "GREATER_THAN_OR_EQUAL",
    fieldKey: "turnover",
    fieldLabel: "Average Annual Turnover Threshold",
    operator: ">=",
    expectedValue: 20000000,
    expectedValueFormatted: "₹2.0 Crore",
    unit: "INR",
    mandatory: true,
    description: "Tender-defined minimum average annual turnover requirement.",
    version: "1.0",
    status: "Active",
  },
  {
    id: "RULE-TECH-001",
    requirementId: "REQ-TECH-001",
    ruleType: "TECHNICAL_THRESHOLD",
    fieldKey: "ram_cores",
    fieldLabel: "Server RAM & Processor Core Capacity",
    operator: ">=",
    expectedValue: "128 GB DDR5 & 64 Cores",
    expectedValueFormatted: "128 GB RAM & 64 Cores",
    mandatory: true,
    description: "Minimum server processing and memory capacity threshold.",
    version: "1.0",
    status: "Active",
  },
  {
    id: "RULE-TECH-002",
    requirementId: "REQ-TECH-002",
    ruleType: "TECHNICAL_THRESHOLD",
    fieldKey: "switch_ports",
    fieldLabel: "Managed Core Switch Port Density",
    operator: ">=",
    expectedValue: "48x 10GbE SFP+ Ports",
    expectedValueFormatted: "48x 10GbE SFP+ Ports",
    mandatory: true,
    description: "Layer-3 Managed Switch minimum port density specification.",
    version: "1.0",
    status: "Active",
  },
  {
    id: "RULE-DOC-001",
    requirementId: "REQ-DOC-001",
    ruleType: "EXISTS",
    fieldKey: "oem_maf",
    fieldLabel: "OEM Manufacturer Authorization Form",
    operator: "EXISTS",
    expectedValue: "Original MAF Letter",
    expectedValueFormatted: "Official OEM MAF on Letterhead",
    mandatory: true,
    description: "Specific OEM authorization authorizing bidder for hardware supply.",
    version: "1.0",
    status: "Active",
  },
  {
    id: "RULE-SPEC-001",
    requirementId: "REQ-SPEC-001",
    ruleType: "TECHNICAL_THRESHOLD",
    fieldKey: "warranty",
    fieldLabel: "On-Site Comprehensive Warranty",
    operator: ">=",
    expectedValue: "3 Years",
    expectedValueFormatted: "3 Years 24x7 Support",
    unit: "Years",
    mandatory: true,
    description: "Tender-defined mandatory 3-year on-site comprehensive OEM support.",
    version: "1.0",
    status: "Active",
  },
];

// ==========================================
// 8. STEP 9.1: CROSS-DOCUMENT CONSISTENCY (SYNTHETIC PROTOTYPE COMPARISONS)
// ==========================================
export const MOCK_CONSISTENCY_COMPARISONS: CrossDocumentFieldComparison[] = [
  {
    id: "CROSS-001",
    attributeKey: "legal_name",
    attributeLabel: "Legal Business Name",
    result: "CONSISTENT",
    confidence: "High",
    comparisonLogic: "Exact string match & character normalization across corporate records.",
    explanation: "Extracted legal entity names refer to the same bidder across Certificate of Incorporation, GST Certificate, and PAN Card.",
    evaluatedAt: "Today, 11:30 AM",
    sources: [
      {
        documentId: "DOC-901-01",
        documentTitle: "Certificate of Incorporation",
        fileName: "ABC_Tech_Certificate_of_Incorporation.pdf",
        extractedValue: "ABC Technologies Private Limited",
        confidence: "High",
        sourcePage: "Page 1",
      },
      {
        documentId: "DOC-901-02",
        documentTitle: "GST Registration Certificate",
        fileName: "ABC_Tech_GSTIN_Certificate_2026.pdf",
        extractedValue: "ABC Technologies Private Limited",
        confidence: "High",
        sourcePage: "Page 1",
      },
      {
        documentId: "DOC-901-03",
        documentTitle: "PAN Card Copy",
        fileName: "ABC_Tech_PAN_Card_Copy.pdf",
        extractedValue: "ABC TECHNOLOGIES PVT LTD",
        confidence: "High",
        sourcePage: "Page 1",
      },
    ],
  },
  {
    id: "CROSS-002",
    attributeKey: "gstin_pan_match",
    attributeLabel: "GSTIN vs PAN Substring Alignment",
    result: "CONSISTENT",
    confidence: "High",
    comparisonLogic: "Chars 3-12 of GSTIN (27AAACA1234B1Z9) strictly match PAN Number (AAACA1234B).",
    explanation: "Extracted PAN Number is embedded correctly within the 15-digit GSTIN structure.",
    evaluatedAt: "Today, 11:30 AM",
    sources: [
      {
        documentId: "DOC-901-02",
        documentTitle: "GST Registration Certificate",
        fileName: "ABC_Tech_GSTIN_Certificate_2026.pdf",
        extractedValue: "GSTIN: 27AAACA1234B1Z9",
        confidence: "High",
        sourcePage: "Page 1",
      },
      {
        documentId: "DOC-901-03",
        documentTitle: "PAN Card Copy",
        fileName: "ABC_Tech_PAN_Card_Copy.pdf",
        extractedValue: "PAN: AAACA1234B",
        confidence: "High",
        sourcePage: "Page 1",
      },
    ],
  },
  {
    id: "CROSS-003",
    attributeKey: "inc_date",
    attributeLabel: "Date of Incorporation / Registration",
    result: "CONSISTENT",
    confidence: "High",
    comparisonLogic: "Exact date match across corporate and tax records.",
    explanation: "Date of Incorporation (14/06/2019) matches Date of Liability in GST Registration Certificate.",
    evaluatedAt: "Today, 11:30 AM",
    sources: [
      {
        documentId: "DOC-901-01",
        documentTitle: "Certificate of Incorporation",
        fileName: "ABC_Tech_Certificate_of_Incorporation.pdf",
        extractedValue: "14/06/2019",
        confidence: "High",
        sourcePage: "Page 1",
      },
      {
        documentId: "DOC-901-02",
        documentTitle: "GST Registration Certificate",
        fileName: "ABC_Tech_GSTIN_Certificate_2026.pdf",
        extractedValue: "14/06/2019",
        confidence: "High",
        sourcePage: "Page 1",
      },
    ],
  },
  {
    id: "CROSS-004",
    attributeKey: "org_type",
    attributeLabel: "Organization Type / Business Constitution",
    result: "INCONSISTENT",
    confidence: "High",
    comparisonLogic: "Entity constitution conflict between GST Certificate and Tender Form.",
    explanation: "GST Certificate lists entity as 'Private Limited Company', whereas Tender Form Cover lists 'Limited Liability Partnership'.",
    evaluatedAt: "Today, 11:30 AM",
    sources: [
      {
        documentId: "DOC-901-01",
        documentTitle: "Certificate of Incorporation",
        fileName: "ABC_Tech_Certificate_of_Incorporation.pdf",
        extractedValue: "Private Limited Company",
        confidence: "High",
        sourcePage: "Page 1",
      },
      {
        documentId: "DOC-901-02",
        documentTitle: "GST Registration Certificate",
        fileName: "ABC_Tech_GSTIN_Certificate_2026.pdf",
        extractedValue: "Private Limited Company",
        confidence: "High",
        sourcePage: "Page 1",
      },
      {
        documentId: "DOC-901-04",
        documentTitle: "Tender Bid Submission Form",
        fileName: "ABC_Tech_Bid_Submission_Form.pdf",
        extractedValue: "Limited Liability Partnership (LLP)",
        confidence: "High",
        sourcePage: "Page 1",
      },
    ],
  },
  {
    id: "CROSS-005",
    attributeKey: "registered_address",
    attributeLabel: "Registered Business Address",
    result: "NEEDS REVIEW",
    confidence: "Medium",
    comparisonLogic: "Address formatting and locality string variance.",
    explanation: "GST Certificate uses abbreviated address ('MIDC Mumbai') compared to Incorporation Certificate ('MIDC Andheri East, Mumbai 400093').",
    evaluatedAt: "Today, 11:30 AM",
    sources: [
      {
        documentId: "DOC-901-01",
        documentTitle: "Certificate of Incorporation",
        fileName: "ABC_Tech_Certificate_of_Incorporation.pdf",
        extractedValue: "Plot 42, Technology Park, MIDC Andheri East, Mumbai 400093",
        confidence: "High",
        sourcePage: "Page 1",
      },
      {
        documentId: "DOC-901-02",
        documentTitle: "GST Registration Certificate",
        fileName: "ABC_Tech_GSTIN_Certificate_2026.pdf",
        extractedValue: "Plot 42, Tech Park, MIDC Mumbai",
        confidence: "Medium",
        sourcePage: "Page 1",
      },
    ],
  },
  {
    id: "CROSS-006",
    attributeKey: "authorized_signatory",
    attributeLabel: "Authorized Representative Name",
    result: "NEEDS REVIEW",
    confidence: "Medium",
    comparisonLogic: "Name abbreviation check (Rajesh Kumar vs R. Kumar).",
    explanation: "Tender Bid Form lists 'Rajesh Kumar', while OEM Authorization Form lists 'R. Kumar'. Requires officer confirmation.",
    evaluatedAt: "Today, 11:30 AM",
    sources: [
      {
        documentId: "DOC-901-04",
        documentTitle: "Technical Compliance Statement",
        fileName: "ABC_Tech_Server_Switch_Tech_Compliance.pdf",
        extractedValue: "Rajesh Kumar (Director)",
        confidence: "High",
        sourcePage: "Page 5",
      },
      {
        documentId: "DOC-901-06",
        documentTitle: "OEM Manufacturer Authorization Form",
        fileName: "OEM_MAF_Authorization_Letter_ABC.pdf",
        extractedValue: "R. Kumar",
        confidence: "Medium",
        sourcePage: "Page 1",
      },
    ],
  },
  {
    id: "CROSS-007",
    attributeKey: "financial_turnover",
    attributeLabel: "Financial Turnover Reference",
    result: "CONSISTENT",
    confidence: "High",
    comparisonLogic: "Turnover figure alignment across CA Certificate and Financial Summary.",
    explanation: "Average annual turnover of ₹2.4 Crore is consistently stated in CA Certificate and Audited Balance Sheet.",
    evaluatedAt: "Today, 11:30 AM",
    sources: [
      {
        documentId: "DOC-901-05",
        documentTitle: "Audited Balance Sheet & CA Certificate",
        fileName: "ABC_Tech_Audited_Turnover_FY22-25.pdf",
        extractedValue: "₹2.4 Crore",
        confidence: "High",
        sourcePage: "Page 4",
      },
    ],
  },
];

// ==========================================
// 9. COMPLIANCE OVERVIEW (SYNTHETIC DEMO DATA)
// ==========================================
export const MOCK_COMPLIANCE_BREAKDOWN: CompliancePercentage[] = [
  {
    label: "Compliant",
    percentage: 68,
    count: 25,
    statusType: "compliant",
    color: "bg-emerald-500",
  },
  {
    label: "Needs Review",
    percentage: 22,
    count: 8,
    statusType: "needs_review",
    color: "bg-amber-500",
  },
  {
    label: "Non-Compliant",
    percentage: 10,
    count: 4,
    statusType: "non_compliant",
    color: "bg-rose-500",
  },
];

// ==========================================
// 10. RISK OVERVIEW (SYNTHETIC DEMO DATA)
// ==========================================
export const MOCK_RISK_SUMMARY: RiskSummaryItem[] = [
  {
    level: "low",
    label: "Low Risk",
    count: 24,
    description: "Standard compliance with no major anomalies detected.",
  },
  {
    level: "medium",
    label: "Medium Risk",
    count: 9,
    description: "Minor documentation or format variances needing officer check.",
  },
  {
    level: "high",
    label: "High Risk",
    count: 4,
    description: "Critical threshold mismatches or eligibility discrepancies.",
  },
];

// ==========================================
// 11. PROTOTYPE AI ALERTS (SYNTHETIC DEMO DATA)
// ==========================================
export const MOCK_PROTOTYPE_ALERTS: AiAlert[] = [
  {
    id: "alt-1",
    severity: "high",
    title: "Past Experience Certificate Value Variance",
    description: "Submitted value appears below the tender-defined requirement.",
    tenderRef: "GEM/2026/B/492104",
    bidderName: "ABC Technologies Pvt. Ltd.",
    timestamp: "Today, 11:20 AM",
  },
  {
    id: "alt-2",
    severity: "medium",
    title: "OEM Authorization Format Check",
    description: "Submitted authorization requires officer verification.",
    tenderRef: "GEM/2026/B/492104",
    bidderName: "ABC Technologies Pvt. Ltd.",
    timestamp: "Today, 10:45 AM",
  },
  {
    id: "alt-3",
    severity: "high",
    title: "PAN / GST Entity Name Mismatch",
    description: "Entity names differ across submitted records.",
    tenderRef: "GEM/2026/B/4552090",
    bidderName: "CipherSec Systems India",
    timestamp: "Yesterday, 04:15 PM",
  },
];

// ==========================================
// 12. RECENT ACTIVITY (SYNTHETIC DEMO DATA)
// ==========================================
export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "act-1",
    timestamp: "15 minutes ago",
    action: "Tender uploaded",
    target: "Supply of Network Security Appliances (GEM/2026/B/4552090)",
    user: "GeM Ingestion System",
    type: "info",
  },
  {
    id: "act-2",
    timestamp: "45 minutes ago",
    action: "Bid documents received",
    target: "ABC Technologies Pvt. Ltd. (5 PDF files)",
    user: "Bid Portal Sync",
    type: "success",
  },
  {
    id: "act-3",
    timestamp: "2 hours ago",
    action: "Verification initiated",
    target: "Annual Maintenance Contract for Data Center & HVAC Systems",
    user: "Procurement Officer",
    type: "info",
  },
  {
    id: "act-4",
    timestamp: "4 hours ago",
    action: "Officer review requested",
    target: "OEM Authorization Format Check (GEM/2026/B/492104)",
    user: "AI Verification Engine",
    type: "warning",
  },
];

// ==========================================
// 13. QUICK ACTIONS METADATA
// ==========================================
export const QUICK_ACTIONS_LIST: QuickActionItem[] = [
  {
    id: "act-new-tender",
    label: "+ New Tender",
    icon: "PlusCircle",
    route: "/tenders",
    variant: "primary",
  },
  {
    id: "act-view-bids",
    label: "View Bids",
    icon: "Users",
    route: "/bidders",
    variant: "outline",
  },
  {
    id: "act-review-findings",
    label: "Review Findings",
    icon: "FileCheck",
    route: "/verification",
    variant: "outline",
  },
  {
    id: "act-generate-report",
    label: "Generate Report",
    icon: "FilePieChart",
    route: "/reports",
    variant: "outline",
  },
];
