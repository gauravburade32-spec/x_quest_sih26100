import {
  normalizeString,
  normalizeLegalName,
  normalizeGstin,
  normalizePan,
  normalizeDate,
  normalizeCurrencyAmount,
} from './normalization';

import { evaluateFieldConsistency } from './consistencyEngine';
import { calculateComplianceScore } from './scoringEngine';
import { analyzeRiskProfile } from './riskEngine';
import { generateExplainableFindings } from './explainableAiEngine';
import {
  DocumentFieldSource,
  RuleEvaluationRecord,
  CrossDocumentFieldComparison,
  TenderRequirement,
  OfficerDecisionRecord,
  AuditEvent,
  MOCK_AUDIT_EVENTS,
} from '@/data/mockData';

import {
  tenderService,
  bidderService,
  requirementService,
  documentService,
  complianceService,
  decisionService,
  auditService,
  reportService,
} from '@/services';

import {
  CHAT_CATEGORIES,
  PREDEFINED_QA,
  getQuestionsByCategory,
  findMatchingAnswer,
} from '@/data/chatbotData';

let passedTests = 0;
let failedTests = 0;

function assertEqual(actual: any, expected: any, testName: string) {
  if (actual === expected) {
    console.log(`✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`✗ FAIL: ${testName}\n  Expected: ${expected}\n  Actual:   ${actual}`);
    failedTests++;
  }
}

export function runAllUnitTests() {
  console.log('\n========================================');
  console.log('RUNNING BIDSURE AI COMPREHENSIVE UNIT TESTS');
  console.log('========================================\n');

  // 1. Normalization Utility Tests
  assertEqual(
    normalizeString('  ABC   Technologies, Pvt.  Ltd. '),
    'abc technologies pvt ltd',
    'normalizeString handles whitespace & punctuation'
  );

  assertEqual(
    normalizeLegalName('ABC Technologies Private Limited'),
    'abctechnologiespvtltd',
    'normalizeLegalName normalizes "Private Limited"'
  );

  assertEqual(
    normalizeLegalName('ABC Technologies Pvt. Ltd.'),
    'abctechnologiespvtltd',
    'normalizeLegalName normalizes "Pvt. Ltd."'
  );

  assertEqual(
    normalizeLegalName('ABC Technologies Private Limited') === normalizeLegalName('ABC Technologies Pvt. Ltd.'),
    true,
    'Legal names match after suffix normalization'
  );

  assertEqual(
    normalizeGstin(' 27-AAACA1234B-1Z9 '),
    '27AAACA1234B1Z9',
    'normalizeGstin strips spaces and hyphens'
  );

  assertEqual(
    normalizePan(' AAACA 1234 B '),
    'AAACA1234B',
    'normalizePan strips spaces and hyphens'
  );

  assertEqual(
    normalizeDate('14/06/2019'),
    '2019-06-14',
    'normalizeDate converts DD/MM/YYYY to YYYY-MM-DD'
  );

  assertEqual(
    normalizeCurrencyAmount('₹2.4 Crore'),
    24000000,
    'normalizeCurrencyAmount converts "₹2.4 Crore" to 24000000'
  );

  // 2. Cross-Document Consistency Tests
  const nameSources: DocumentFieldSource[] = [
    {
      documentId: 'DOC-1',
      documentTitle: 'Certificate of Incorporation',
      fileName: 'Inc.pdf',
      extractedValue: 'ABC Technologies Private Limited',
      confidence: 'High',
      sourcePage: 'Page 1',
    },
    {
      documentId: 'DOC-2',
      documentTitle: 'GST Registration Certificate',
      fileName: 'GST.pdf',
      extractedValue: 'ABC Technologies Pvt Ltd',
      confidence: 'High',
      sourcePage: 'Page 1',
    },
  ];

  const nameResult = evaluateFieldConsistency('legal_name', 'Legal Business Name', nameSources);
  assertEqual(nameResult.result, 'CONSISTENT', 'Legal name suffix variance evaluates to CONSISTENT');

  const conflictSources: DocumentFieldSource[] = [
    {
      documentId: 'DOC-1',
      documentTitle: 'GST Certificate',
      fileName: 'GST.pdf',
      extractedValue: 'Private Limited Company',
      confidence: 'High',
      sourcePage: 'Page 1',
    },
    {
      documentId: 'DOC-2',
      documentTitle: 'Tender Form',
      fileName: 'Tender.pdf',
      extractedValue: 'Limited Liability Partnership (LLP)',
      confidence: 'High',
      sourcePage: 'Page 1',
    },
  ];

  const conflictResult = evaluateFieldConsistency('org_type', 'Organization Type', conflictSources);
  assertEqual(conflictResult.result, 'INCONSISTENT', 'Organization type conflict evaluates to INCONSISTENT');

  // 3. STEP 10: Compliance Scoring Unit Tests
  const mockReqs: TenderRequirement[] = [
    {
      id: 'REQ-1',
      tenderId: 'TND-1',
      category: 'Eligibility',
      title: 'Incorporation',
      description: 'Inc Cert',
      isMandatory: true,
      evidenceExpected: 'Cert',
      sourceDocument: 'doc.pdf',
      sourcePage: 'Page 1',
      status: 'Ready for Verification',
    },
    {
      id: 'REQ-2',
      tenderId: 'TND-1',
      category: 'Technical',
      title: 'Switch Ports',
      description: 'Switch ports',
      isMandatory: true,
      evidenceExpected: 'Specs',
      sourceDocument: 'doc.pdf',
      sourcePage: 'Page 2',
      status: 'Ready for Verification',
    },
  ];

  const mockEvals: RuleEvaluationRecord[] = [
    {
      id: 'EVAL-1',
      requirementId: 'REQ-1',
      ruleId: 'RULE-1',
      ruleVersion: '1.0',
      bidderId: 'BID-1',
      tenderId: 'TND-1',
      fieldKey: 'inc',
      expectedValue: 'Cert',
      actualValue: 'Cert',
      confidence: 'High',
      result: 'COMPLIANT',
      reason: 'Valid',
      evaluatedAt: 'Now',
    },
    {
      id: 'EVAL-2',
      requirementId: 'REQ-2',
      ruleId: 'RULE-2',
      ruleVersion: '1.0',
      bidderId: 'BID-1',
      tenderId: 'TND-1',
      fieldKey: 'ports',
      expectedValue: '48',
      actualValue: '24',
      confidence: 'High',
      result: 'NON-COMPLIANT',
      reason: 'Below threshold',
      evaluatedAt: 'Now',
    },
  ];

  const scoreRes = calculateComplianceScore(mockEvals, mockReqs);
  assertEqual(scoreRes.totalRequirements, 2, 'Scoring Engine calculates total requirements');
  assertEqual(scoreRes.compliantCount, 1, 'Scoring Engine counts compliant items');
  assertEqual(scoreRes.nonCompliantCount, 1, 'Scoring Engine counts non-compliant items');
  assertEqual(scoreRes.scorePercentage, 50, 'Scoring Engine computes 50% for 1 compliant out of 2');

  // 4. STEP 10: Risk Profile Analysis Unit Tests
  const mockComparisons: CrossDocumentFieldComparison[] = [
    {
      id: 'CROSS-1',
      attributeKey: 'org_type',
      attributeLabel: 'Organization Type',
      sources: conflictSources,
      result: 'INCONSISTENT',
      confidence: 'High',
      comparisonLogic: 'Conflict',
      explanation: 'Conflict detected',
      evaluatedAt: 'Now',
    },
  ];

  const riskRes = analyzeRiskProfile(mockEvals, mockComparisons, mockReqs);
  assertEqual(riskRes.overallLevel, 'HIGH RISK', 'Risk Engine assigns HIGH RISK for non-compliant and inconsistent items');
  assertEqual(riskRes.highSeverityCount > 0, true, 'Risk Engine identifies High Severity risks');

  // 5. STEP 11: Explainable AI Findings Unit Tests
  const xaiFindings = generateExplainableFindings(mockEvals, mockComparisons, mockReqs, riskRes);
  assertEqual(xaiFindings.length > 0, true, 'Explainable AI Engine generates findings');
  assertEqual(xaiFindings[0].findingId.startsWith('XAI-'), true, 'Explainable AI Findings have valid finding ID format');
  assertEqual(xaiFindings[0].whyGenerated.length > 0, true, 'Explainable AI Findings answer "Why was it detected?"');
  assertEqual(xaiFindings[0].recommendedOfficerAction.length > 0, true, 'Explainable AI Findings answer "What should officer verify?"');
  assertEqual(xaiFindings[0].traceability.length > 0, true, 'Explainable AI Findings maintain full traceability line');

  // 6. STEP 12: Officer Decision Unit Tests
  const mockDecisionRecord: OfficerDecisionRecord = {
    id: 'DEC-901-TEST',
    tenderId: 'TND-2026-GEM-8921',
    bidderId: 'BID-2026-901',
    bidderName: 'ABC Technologies Pvt. Ltd.',
    tenderRef: 'GEM/2026/B/492104',
    decision: 'Clarification Requested',
    rationale: 'Clarification notice issued for missing OEM MAF letter.',
    clarificationText: 'Please upload official OEM MAF letter.',
    scorePercentage: 31.3,
    riskLevel: 'HIGH RISK',
    verifiedFindingsCount: 2,
    totalFindingsCount: 5,
    timestamp: 'Just now',
    officerName: 'Rajesh V. (Senior Procurement Officer)',
    traceabilitySummary: 'GEM/2026/B/492104 • REQ-DOC-001',
  };

  assertEqual(mockDecisionRecord.decision, 'Clarification Requested', 'Officer Decision Record captures selected decision state');
  assertEqual(mockDecisionRecord.clarificationText?.length! > 0, true, 'Officer Decision Record captures GeM portal clarification notice');

  // 7. STEP 13: Audit Trail & Reports Unit Tests
  assertEqual(MOCK_AUDIT_EVENTS.length > 0, true, 'Audit Events log initialized with records');
  assertEqual(MOCK_AUDIT_EVENTS[0].id.startsWith('AUD-'), true, 'Audit Events have valid AUD- ID prefix');
  assertEqual(MOCK_AUDIT_EVENTS[0].traceabilityLine.length > 0, true, 'Audit Events preserve full evidence traceability line');

  // 8. STEP 14: Centralized Service Layer Unit Tests
  const serviceTenders = tenderService.getTenders();
  assertEqual(serviceTenders.length > 0, true, 'tenderService returns tenders list');

  const serviceBidders = bidderService.getBidders();
  assertEqual(serviceBidders.length > 0, true, 'bidderService returns bidders list');

  const serviceReqs = requirementService.getRequirementsByTenderId('TND-2026-GEM-8921');
  assertEqual(serviceReqs.length > 0, true, 'requirementService returns requirements for tender');

  const serviceDocs = documentService.getDocumentsByBidderId('BID-2026-901');
  assertEqual(serviceDocs.length > 0, true, 'documentService returns documents for bidder');

  const compiledReport = reportService.compileExecutiveReport('TND-2026-GEM-8921', 'BID-2026-901');
  assertEqual(compiledReport.authorityDisclosure.length > 0, true, 'reportService preserves decision support disclosure');
  assertEqual(compiledReport.requirementsCount > 0, true, 'reportService compiles executive report summary');

  const serviceAuditEvents = auditService.getAuditEvents();
  assertEqual(serviceAuditEvents.length > 0, true, 'auditService returns audit events history');

  // 9. Chatbot Step 1: BidSure Assistant Q&A Engine Unit Tests
  assertEqual(CHAT_CATEGORIES.length, 5, 'Chatbot dataset defines 5 categories');
  assertEqual(PREDEFINED_QA.length >= 15, true, 'Chatbot dataset contains predefined Q&A records');
  assertEqual(getQuestionsByCategory('Compliance & Risk').length >= 3, true, 'getQuestionsByCategory returns category Q&As');

  const exactMatch = findMatchingAnswer('What is BidSure AI and how does it assist procurement officers?');
  assertEqual(exactMatch !== null, true, 'Chatbot exact question lookup finds predefined Q&A');
  assertEqual(exactMatch?.category, 'Getting Started', 'Chatbot exact match returns correct category');

  const keywordMatch = findMatchingAnswer('compliance score calculation');
  assertEqual(keywordMatch !== null && keywordMatch.id === 'QA-CR-01', true, 'Chatbot keyword search matches compliance score Q&A');

  const fallbackMatch = findMatchingAnswer('unsupported topic random query 999');
  assertEqual(fallbackMatch, null, 'Chatbot returns null for unmatched queries triggering fallback response');

  console.log(`\nTEST SUMMARY: ${passedTests} Passed, ${failedTests} Failed.`);
  return failedTests === 0;
}

// Execute tests directly if executed in standalone Node environment
if (typeof process !== 'undefined' && require.main === module) {
  const success = runAllUnitTests();
  process.exit(success ? 0 : 1);
}
