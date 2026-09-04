import {
  RuleEvaluationRecord,
  CrossDocumentFieldComparison,
  TenderRequirement,
  ExplainableFinding,
  FieldConfidence,
} from '@/data/mockData';

import { RiskAssessmentSummary } from '@/utils/riskEngine';

/**
 * Dynamically generates structured 15-attribute Explainable AI Findings
 * from Step 8 Rule Evaluations, Step 9 Cross-Document Comparisons, and Step 10 Risk Summary.
 */
export function generateExplainableFindings(
  evaluations: RuleEvaluationRecord[],
  comparisons: CrossDocumentFieldComparison[],
  requirements: TenderRequirement[],
  riskSummary: RiskAssessmentSummary
): ExplainableFinding[] {
  const explainableFindings: ExplainableFinding[] = [];
  const reqMap = new Map(requirements.map((r) => [r.id, r]));

  // 1. Transform Step 8 Rule Evaluations into Explainable Findings
  evaluations.forEach((evalRec, idx) => {
    const req = reqMap.get(evalRec.requirementId);
    const reqTitle = req?.title || evalRec.fieldKey;

    if (evalRec.result === 'NOT EVALUATED') {
      explainableFindings.push({
        findingId: `XAI-EVAL-${evalRec.ruleId}-01`,
        findingTitle: `Unmapped Evidence: ${reqTitle}`,
        severity: 'HIGH',
        category: 'Missing Evidence Risk',
        requirementId: evalRec.requirementId,
        requirementTitle: reqTitle,
        whyGenerated: `Mandatory requirement ${evalRec.requirementId} lacks mapped evidence in the bidder submission portal.`,
        expectedCondition: evalRec.expectedValue,
        actualCondition: 'Evidence Not Uploaded / Unmapped',
        sourceDocumentName: req?.sourceDocument || 'Tender_Document.pdf',
        sourcePage: req?.sourcePage || 'Page 1',
        extractionConfidence: 'Not detected',
        ruleOrComparisonLogic: `Rule ${evalRec.ruleId} (Type: EXISTS) requires mandatory document presence.`,
        humanReadableExplanation: `The tender requires mandatory submission of ${req?.evidenceExpected || evalRec.expectedValue}. No matching evidence document was uploaded or mapped for this requirement.`,
        recommendedOfficerAction: 'Issue a clarification notice to the bidder via the portal requesting submission of missing evidence document.',
        traceability: `${evalRec.requirementId} • Rule ${evalRec.ruleId} • Missing Evidence`,
      });
    } else if (evalRec.result === 'NEEDS REVIEW') {
      explainableFindings.push({
        findingId: `XAI-EVAL-${evalRec.ruleId}-02`,
        findingTitle: `Format Verification Flag: ${reqTitle}`,
        severity: 'MEDIUM',
        category: 'UDIN / Format Verification Risk',
        requirementId: evalRec.requirementId,
        requirementTitle: reqTitle,
        whyGenerated: `Extracted value meets numeric threshold, but CA UDIN reference requires officer format check.`,
        expectedCondition: evalRec.expectedValue,
        actualCondition: evalRec.actualValue,
        sourceDocumentName: evalRec.documentId || 'ABC_Tech_Audited_Turnover_FY22-25.pdf',
        sourcePage: evalRec.sourcePage || 'Page 4',
        extractionConfidence: evalRec.confidence,
        ruleOrComparisonLogic: `Rule ${evalRec.ruleId} (Type: GREATER_THAN_OR_EQUAL) checked turnover >= ${evalRec.expectedValue}.`,
        humanReadableExplanation: `Extracted financial turnover (${evalRec.actualValue}) satisfies minimum requirement (${evalRec.expectedValue}). However, the CA UDIN reference requires verification on the ICAI portal.`,
        recommendedOfficerAction: 'Verify CA UDIN reference number on the official ICAI portal before final signoff.',
        traceability: `${evalRec.requirementId} • Rule ${evalRec.ruleId} • Page 4`,
      });
    } else if (evalRec.result === 'NON-COMPLIANT') {
      explainableFindings.push({
        findingId: `XAI-EVAL-${evalRec.ruleId}-03`,
        findingTitle: `Threshold Non-Compliance: ${reqTitle}`,
        severity: 'HIGH',
        category: 'Technical / Threshold Risk',
        requirementId: evalRec.requirementId,
        requirementTitle: reqTitle,
        whyGenerated: `Extracted value (${evalRec.actualValue}) is strictly below tender threshold (${evalRec.expectedValue}).`,
        expectedCondition: evalRec.expectedValue,
        actualCondition: evalRec.actualValue,
        sourceDocumentName: evalRec.documentId || 'ABC_Tech_Server_Switch_Tech_Compliance.pdf',
        sourcePage: evalRec.sourcePage || 'Page 3',
        extractionConfidence: evalRec.confidence,
        ruleOrComparisonLogic: `Rule ${evalRec.ruleId} (Type: TECHNICAL_THRESHOLD) verified minimum port density >= ${evalRec.expectedValue}.`,
        humanReadableExplanation: `Extracted technical parameter (${evalRec.actualValue}) fails to meet tender-defined minimum specification (${evalRec.expectedValue}).`,
        recommendedOfficerAction: 'Review technical compliance statement and assess if technical waiver applies or if clarification is required.',
        traceability: `${evalRec.requirementId} • Rule ${evalRec.ruleId} • Page 3`,
      });
    }
  });

  // 2. Transform Step 9 Cross-Document Comparisons into Explainable Findings
  comparisons.forEach((comp) => {
    if (comp.result === 'INCONSISTENT') {
      const srcDoc1 = comp.sources[0];
      const srcDoc2 = comp.sources[comp.sources.length - 1];

      explainableFindings.push({
        findingId: `XAI-CROSS-${comp.id}`,
        findingTitle: `Cross-Document Entity Conflict: ${comp.attributeLabel}`,
        severity: 'HIGH',
        category: 'Cross-Document Discrepancy Risk',
        whyGenerated: `Extracted attributes differ across submitted records (${srcDoc1.documentTitle} vs ${srcDoc2.documentTitle}).`,
        expectedCondition: `Consistent value: "${srcDoc1.extractedValue}"`,
        actualCondition: `Conflict detected: "${srcDoc1.extractedValue}" vs "${srcDoc2.extractedValue}"`,
        sourceDocumentName: `${srcDoc1.fileName} & ${srcDoc2.fileName}`,
        sourcePage: `${srcDoc1.sourcePage} & ${srcDoc2.sourcePage}`,
        extractionConfidence: comp.confidence,
        ruleOrComparisonLogic: comp.comparisonLogic,
        humanReadableExplanation: comp.explanation,
        recommendedOfficerAction: 'Verify original incorporation and tax registration documents to confirm true legal entity constitution.',
        traceability: `Cross-Doc ${comp.id} • ${comp.attributeLabel} • ${srcDoc1.sourcePage}`,
      });
    } else if (comp.result === 'NEEDS REVIEW') {
      const srcDoc1 = comp.sources[0];

      explainableFindings.push({
        findingId: `XAI-CROSS-${comp.id}`,
        findingTitle: `Formatting Variance: ${comp.attributeLabel}`,
        severity: 'LOW',
        category: 'Address / Abbreviation Variance',
        whyGenerated: `Address or name abbreviation string variance detected across submitted records.`,
        expectedCondition: `Full string: "${srcDoc1?.extractedValue || 'N/A'}"`,
        actualCondition: `Abbreviated string across documents`,
        sourceDocumentName: srcDoc1?.fileName || 'Submitted_Document.pdf',
        sourcePage: srcDoc1?.sourcePage || 'Page 1',
        extractionConfidence: comp.confidence,
        ruleOrComparisonLogic: comp.comparisonLogic,
        humanReadableExplanation: comp.explanation,
        recommendedOfficerAction: 'Confirm address/name abbreviation refers to the same registered premises.',
        traceability: `Cross-Doc ${comp.id} • ${comp.attributeLabel} • Page 1`,
      });
    }
  });

  return explainableFindings;
}
