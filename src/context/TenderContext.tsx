'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  Tender,
  MOCK_TENDERS_LIST,
  TenderRequirement,
  MOCK_REQUIREMENTS,
  GENERATE_DEFAULT_REQUIREMENTS,
  Bidder,
  MOCK_BIDDERS_LIST,
  BidderDocument,
  MOCK_BIDDER_DOCUMENTS,
  DocumentIntelligenceResult,
  MOCK_INTELLIGENCE_RESULTS,
  EvidenceMappingItem,
  MOCK_EVIDENCE_MAPPINGS,
  MappingStatus,
  ComplianceRule,
  MOCK_COMPLIANCE_RULES,
  RuleEvaluationRecord,
  OfficerDecisionRecord,
  OfficerDecisionState,
  FindingVerificationState,
  MOCK_OFFICER_DECISIONS,
  AuditEvent,
  MOCK_AUDIT_EVENTS,
} from '@/data/mockData';
import { evaluateComplianceRule } from '@/utils/rulesEngine';

interface TenderContextType {
  tenders: Tender[];
  addTender: (newTender: Tender) => void;
  getTenderById: (id: string) => Tender | undefined;
  requirements: TenderRequirement[];
  getRequirementsByTenderId: (tenderId: string) => TenderRequirement[];
  bidders: Bidder[];
  getBiddersByTenderId: (tenderId: string) => Bidder[];
  getBidderById: (bidderId: string) => Bidder | undefined;
  bidderDocuments: BidderDocument[];
  getDocumentsByBidderId: (bidderId: string) => BidderDocument[];
  addBidderDocument: (newDoc: BidderDocument) => void;
  removeBidderDocument: (docId: string) => void;
  getBidderDocumentById: (docId: string) => BidderDocument | undefined;
  intelligenceResults: Record<string, DocumentIntelligenceResult>;
  getIntelligenceResultByDocId: (docId: string) => DocumentIntelligenceResult | undefined;
  saveIntelligenceResult: (docId: string, result: DocumentIntelligenceResult) => void;
  evidenceMappings: EvidenceMappingItem[];
  getMappingsByRequirementId: (reqId: string, bidderId?: string) => EvidenceMappingItem[];
  mapDocumentToRequirement: (reqId: string, expectedLabel: string, docId: string, bidderId: string) => void;
  unmapDocumentFromRequirement: (mappingId: string) => void;
  getRequirementCoverage: (reqId: string, bidderId?: string) => { mapped: number; total: number; status: MappingStatus };
  rules: ComplianceRule[];
  getRuleByRequirementId: (reqId: string) => ComplianceRule | undefined;
  evaluateRuleForRequirement: (reqId: string, bidderId: string, tenderId: string) => RuleEvaluationRecord;
  evaluateAllRules: (bidderId: string, tenderId: string) => RuleEvaluationRecord[];
  officerDecisions: Record<string, OfficerDecisionRecord>;
  getOfficerDecision: (bidderId: string) => OfficerDecisionRecord | undefined;
  saveOfficerDecision: (bidderId: string, record: OfficerDecisionRecord) => void;
  findingVerifications: Record<string, FindingVerificationState>;
  getFindingVerification: (findingId: string) => FindingVerificationState;
  updateFindingVerification: (findingId: string, status: FindingVerificationState) => void;
  auditEvents: AuditEvent[];
  logAuditEvent: (event: AuditEvent) => void;
}

const TenderContext = createContext<TenderContextType | undefined>(undefined);

export const TenderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenders, setTenders] = useState<Tender[]>(MOCK_TENDERS_LIST);
  const [requirements, setRequirements] = useState<TenderRequirement[]>(MOCK_REQUIREMENTS);
  const [bidders, setBidders] = useState<Bidder[]>(MOCK_BIDDERS_LIST);
  const [bidderDocuments, setBidderDocuments] = useState<BidderDocument[]>(MOCK_BIDDER_DOCUMENTS);
  const [intelligenceResults, setIntelligenceResults] = useState<Record<string, DocumentIntelligenceResult>>(
    MOCK_INTELLIGENCE_RESULTS
  );
  const [evidenceMappings, setEvidenceMappings] = useState<EvidenceMappingItem[]>(MOCK_EVIDENCE_MAPPINGS);
  const [rules, setRules] = useState<ComplianceRule[]>(MOCK_COMPLIANCE_RULES);

  // Step 12 Officer Decisions & Finding Verification States
  const [officerDecisions, setOfficerDecisions] = useState<Record<string, OfficerDecisionRecord>>(
    MOCK_OFFICER_DECISIONS
  );
  const [findingVerifications, setFindingVerifications] = useState<Record<string, FindingVerificationState>>({});

  // Step 13 Audit Trail Events
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS);

  const addTender = (newTender: Tender) => {
    setTenders((prev) => [newTender, ...prev]);

    const defaultReqs = GENERATE_DEFAULT_REQUIREMENTS(
      newTender.id,
      newTender.title,
      newTender.uploadedDocumentName || 'Tender_Document.pdf'
    );

    setRequirements((prev) => [...defaultReqs, ...prev]);

    // Log Step 13 Audit Event
    logAuditEvent({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action: 'Uploaded Tender Specification PDF',
      eventType: 'Tender Upload',
      user: 'Procurement Officer',
      userRole: 'Procurement Officer',
      tenderId: newTender.id,
      tenderRef: newTender.referenceNo,
      documentName: newTender.uploadedDocumentName || 'Tender_Document.pdf',
      details: `Uploaded new tender specification document for ${newTender.title}.`,
      timestamp: 'Just now',
      traceabilityLine: `${newTender.referenceNo} • ${newTender.uploadedDocumentName || 'Tender_Document.pdf'}`,
    });
  };

  const getTenderById = (id: string) => {
    return tenders.find((t) => t.id === id);
  };

  const getRequirementsByTenderId = (tenderId: string) => {
    const matched = requirements.filter((r) => r.tenderId === tenderId);
    if (matched.length > 0) return matched;

    const targetTender = getTenderById(tenderId);
    return GENERATE_DEFAULT_REQUIREMENTS(
      tenderId,
      targetTender?.title || 'Tender Document',
      targetTender?.uploadedDocumentName || 'Tender_Document.pdf'
    );
  };

  const getBiddersByTenderId = (tenderId: string) => {
    return bidders.filter((b) => b.tenderId === tenderId);
  };

  const getBidderById = (bidderId: string) => {
    return bidders.find((b) => b.id === bidderId);
  };

  const getDocumentsByBidderId = (bidderId: string) => {
    return bidderDocuments.filter((d) => d.bidderId === bidderId);
  };

  const getBidderDocumentById = (docId: string) => {
    return bidderDocuments.find((d) => d.id === docId);
  };

  const addBidderDocument = (newDoc: BidderDocument) => {
    setBidderDocuments((prev) => [newDoc, ...prev]);

    setBidders((prev) =>
      prev.map((b) => {
        if (b.id === newDoc.bidderId) {
          const newCount = b.submittedCount + 1;
          return {
            ...b,
            submittedCount: newCount,
            status: newCount >= b.requiredCount ? 'Ready for Verification' : 'Documents Pending',
          };
        }
        return b;
      })
    );

    // Log Step 13 Audit Event
    logAuditEvent({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action: 'Submitted Bidder Evidence Document',
      eventType: 'Document Submission',
      user: 'Bid Portal Sync',
      userRole: 'GeM Ingestion System',
      tenderId: newDoc.tenderId,
      tenderRef: newDoc.tenderId,
      bidderId: newDoc.bidderId,
      documentName: newDoc.fileName,
      details: `Submitted evidence file: ${newDoc.documentTitle} (${newDoc.fileName}).`,
      timestamp: 'Just now',
      traceabilityLine: `${newDoc.tenderId} • ${newDoc.fileName}`,
    });
  };

  const removeBidderDocument = (docId: string) => {
    const targetDoc = bidderDocuments.find((d) => d.id === docId);
    if (!targetDoc) return;

    setBidderDocuments((prev) => prev.filter((d) => d.id !== docId));

    setBidders((prev) =>
      prev.map((b) => {
        if (b.id === targetDoc.bidderId) {
          const newCount = Math.max(0, b.submittedCount - 1);
          return {
            ...b,
            submittedCount: newCount,
            status: newCount >= b.requiredCount ? 'Ready for Verification' : 'Documents Pending',
          };
        }
        return b;
      })
    );
  };

  const getIntelligenceResultByDocId = (docId: string) => {
    return intelligenceResults[docId];
  };

  const saveIntelligenceResult = (docId: string, result: DocumentIntelligenceResult) => {
    setIntelligenceResults((prev) => ({
      ...prev,
      [docId]: result,
    }));

    // Log Step 13 Audit Event
    logAuditEvent({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action: 'Completed OCR & Intelligence Extraction',
      eventType: 'OCR Processing',
      user: 'Tesseract OCR Service',
      userRole: 'OCR Engine',
      tenderId: 'TND-2026-GEM-8921',
      tenderRef: 'GEM/2026/B/492104',
      documentName: result.documentTitle,
      details: `Processed OCR and extracted ${result.fields.length} NLP fields with ${result.classificationConfidence} confidence.`,
      timestamp: 'Just now',
      traceabilityLine: `${docId} • ${result.documentTitle} • ${result.classificationConfidence}`,
    });
  };

  const getMappingsByRequirementId = (reqId: string, bidderId?: string) => {
    return evidenceMappings.filter((m) => {
      const matchReq = m.requirementId === reqId;
      const matchBidder = !bidderId || m.bidderId === bidderId;
      return matchReq && matchBidder;
    });
  };

  const mapDocumentToRequirement = (
    reqId: string,
    expectedLabel: string,
    docId: string,
    bidderId: string
  ) => {
    const targetDoc = getBidderDocumentById(docId);
    if (!targetDoc) return;

    const intelResult = intelligenceResults[docId];
    const fieldsCount = intelResult?.fields.filter((f) => f.status === 'Detected').length || 2;

    const newMapping: EvidenceMappingItem = {
      id: `MAP-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-3)}`,
      requirementId: reqId,
      tenderId: targetDoc.tenderId,
      bidderId,
      expectedEvidenceLabel: expectedLabel,
      mappedDocumentId: docId,
      mappedDocumentTitle: targetDoc.documentTitle,
      mappedFileName: targetDoc.fileName,
      extractedFieldsCount: fieldsCount,
      status: 'Mapped',
      suggestedMatch: targetDoc.category.toLowerCase().includes(expectedLabel.toLowerCase().split(' ')[0]),
      suggestionReason: 'Document category matches expected evidence item.',
      sourcePage: 'Page 1',
      mappedAt: 'Just now',
    };

    setEvidenceMappings((prev) => {
      const filtered = prev.filter(
        (m) => !(m.requirementId === reqId && m.bidderId === bidderId && m.expectedEvidenceLabel === expectedLabel)
      );
      return [newMapping, ...filtered];
    });

    // Log Step 13 Audit Event
    logAuditEvent({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action: 'Mapped Evidence Document to Requirement',
      eventType: 'Evidence Mapping',
      user: 'Procurement Officer',
      userRole: 'Procurement Officer',
      tenderId: targetDoc.tenderId,
      tenderRef: targetDoc.tenderId,
      bidderId,
      requirementId: reqId,
      documentName: targetDoc.fileName,
      previousStatus: 'Not Yet Mapped',
      newStatus: 'Mapped',
      details: `Mapped evidence document ${targetDoc.fileName} to requirement ${reqId}.`,
      timestamp: 'Just now',
      traceabilityLine: `${targetDoc.tenderId} • ${reqId} • ${targetDoc.fileName}`,
    });
  };

  const unmapDocumentFromRequirement = (mappingId: string) => {
    setEvidenceMappings((prev) =>
      prev.map((m) => {
        if (m.id === mappingId) {
          return {
            ...m,
            mappedDocumentId: undefined,
            mappedDocumentTitle: undefined,
            mappedFileName: undefined,
            extractedFieldsCount: 0,
            status: 'Not Yet Mapped',
            suggestedMatch: false,
          };
        }
        return m;
      })
    );
  };

  const getRequirementCoverage = (reqId: string, bidderId: string = 'BID-2026-901') => {
    const mappings = getMappingsByRequirementId(reqId, bidderId);

    if (mappings.length === 0) {
      const targetReq = requirements.find((r) => r.id === reqId);
      const expectedItems = targetReq?.evidenceExpected.split(/[,&]/) || [targetReq?.evidenceExpected || 'Evidence Document'];
      return {
        mapped: 0,
        total: expectedItems.length,
        status: 'Not Yet Mapped' as MappingStatus,
      };
    }

    const total = mappings.length;
    const mapped = mappings.filter((m) => m.status === 'Mapped').length;
    const needsReview = mappings.filter((m) => m.status === 'Needs Review').length;
    const missing = mappings.filter((m) => m.status === 'Missing Evidence').length;

    let status: MappingStatus = 'Not Yet Mapped';
    if (needsReview > 0) {
      status = 'Needs Review';
    } else if (missing > 0 || (mapped < total && mapped > 0)) {
      status = mapped === 0 ? 'Missing Evidence' : 'Partially Mapped';
    } else if (mapped === total && total > 0) {
      status = 'Mapped';
    }

    return { mapped, total, status };
  };

  const getRuleByRequirementId = (reqId: string) => {
    return rules.find((r) => r.requirementId === reqId);
  };

  const evaluateRuleForRequirement = (reqId: string, bidderId: string, tenderId: string) => {
    const targetRule = getRuleByRequirementId(reqId);
    if (!targetRule) {
      const defaultRule: ComplianceRule = {
        id: `RULE-${reqId}`,
        requirementId: reqId,
        ruleType: 'EXISTS',
        fieldKey: 'evidence_document',
        fieldLabel: 'Requirement Evidence Document',
        operator: 'EXISTS',
        expectedValue: 'Submitted Evidence',
        expectedValueFormatted: 'Submitted Evidence Document',
        mandatory: true,
        description: 'Tender-defined mandatory evidence submission.',
        version: '1.0',
        status: 'Active',
      };
      return evaluateComplianceRule(defaultRule, evidenceMappings, intelligenceResults, tenderId, bidderId);
    }

    return evaluateComplianceRule(targetRule, evidenceMappings, intelligenceResults, tenderId, bidderId);
  };

  const evaluateAllRules = (bidderId: string, tenderId: string) => {
    const tenderReqs = getRequirementsByTenderId(tenderId);
    return tenderReqs.map((req) => evaluateRuleForRequirement(req.id, bidderId, tenderId));
  };

  const getOfficerDecision = (bidderId: string) => {
    return officerDecisions[bidderId];
  };

  const saveOfficerDecision = (bidderId: string, record: OfficerDecisionRecord) => {
    setOfficerDecisions((prev) => ({
      ...prev,
      [bidderId]: record,
    }));

    // Log Step 13 Audit Event for Human Decision / Clarification Notice
    logAuditEvent({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action: `Recorded Human Decision: ${record.decision}`,
      eventType: record.decision === 'Clarification Requested' ? 'Clarification Notice' : 'Human Decision',
      user: record.officerName,
      userRole: 'Procurement Officer',
      tenderId: record.tenderId,
      tenderRef: record.tenderRef,
      bidderId: record.bidderId,
      bidderName: record.bidderName,
      previousStatus: 'Under Review',
      newStatus: record.decision,
      details: record.rationale + (record.clarificationText ? ` (Notice: ${record.clarificationText})` : ''),
      timestamp: 'Just now',
      traceabilityLine: `${record.tenderRef} • ${record.bidderName} • ${record.decision}`,
    });
  };

  const getFindingVerification = (findingId: string) => {
    return findingVerifications[findingId] || 'Keep Pending';
  };

  const updateFindingVerification = (findingId: string, status: FindingVerificationState) => {
    setFindingVerifications((prev) => ({
      ...prev,
      [findingId]: status,
    }));

    // Log Step 13 Audit Event
    logAuditEvent({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action: 'Updated Item Verification Status',
      eventType: 'Officer Verification',
      user: 'Rajesh V.',
      userRole: 'Procurement Officer',
      tenderId: 'TND-2026-GEM-8921',
      tenderRef: 'GEM/2026/B/492104',
      bidderId: 'BID-2026-901',
      bidderName: 'ABC Technologies Pvt. Ltd.',
      findingId,
      newStatus: status,
      details: `Officer updated verification status on finding ${findingId} to "${status}".`,
      timestamp: 'Just now',
      traceabilityLine: `GEM/2026/B/492104 • ${findingId} • ${status}`,
    });
  };

  const logAuditEvent = (event: AuditEvent) => {
    setAuditEvents((prev) => [event, ...prev]);
  };

  return (
    <TenderContext.Provider
      value={{
        tenders,
        addTender,
        getTenderById,
        requirements,
        getRequirementsByTenderId,
        bidders,
        getBiddersByTenderId,
        getBidderById,
        bidderDocuments,
        getDocumentsByBidderId,
        getBidderDocumentById,
        addBidderDocument,
        removeBidderDocument,
        intelligenceResults,
        getIntelligenceResultByDocId,
        saveIntelligenceResult,
        evidenceMappings,
        getMappingsByRequirementId,
        mapDocumentToRequirement,
        unmapDocumentFromRequirement,
        getRequirementCoverage,
        rules,
        getRuleByRequirementId,
        evaluateRuleForRequirement,
        evaluateAllRules,
        officerDecisions,
        getOfficerDecision,
        saveOfficerDecision,
        findingVerifications,
        getFindingVerification,
        updateFindingVerification,
        auditEvents,
        logAuditEvent,
      }}
    >
      {children}
    </TenderContext.Provider>
  );
};

export const useTenders = (): TenderContextType => {
  const context = useContext(TenderContext);
  if (!context) {
    throw new Error('useTenders must be used within a TenderProvider');
  }
  return context;
};
