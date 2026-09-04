import {
  RuleEvaluationRecord,
  CrossDocumentFieldComparison,
  TenderRequirement,
} from '@/data/mockData';

export type RiskSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export type RiskCategory =
  | 'Missing Evidence Risk'
  | 'Technical / Threshold Risk'
  | 'Cross-Document Discrepancy Risk'
  | 'UDIN / Format Verification Risk'
  | 'Address / Abbreviation Variance'
  | 'Financial / Eligibility Risk';

export interface RiskFindingItem {
  id: string;
  category: RiskCategory;
  severity: RiskSeverity;
  title: string;
  description: string;
  requirementId?: string;
  documentTitle?: string;
  sourcePage?: string;
  traceability: string;
  explanation: string;
}

export interface RiskAssessmentSummary {
  overallLevel: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK';
  highSeverityCount: number;
  mediumSeverityCount: number;
  lowSeverityCount: number;
  totalRisks: number;
  findings: RiskFindingItem[];
}

/**
 * Dynamically derives risk findings from Step 8 rule evaluation results and Step 9 cross-document comparisons.
 */
export function analyzeRiskProfile(
  evaluations: RuleEvaluationRecord[],
  comparisons: CrossDocumentFieldComparison[],
  requirements: TenderRequirement[]
): RiskAssessmentSummary {
  const findings: RiskFindingItem[] = [];
  const reqMap = new Map(requirements.map((r) => [r.id, r]));

  // 1. Analyze Step 8 Rule Evaluation Results
  evaluations.forEach((evalRec) => {
    const req = reqMap.get(evalRec.requirementId);
    const reqTitle = req?.title || evalRec.fieldKey;

    if (evalRec.result === 'NON-COMPLIANT') {
      findings.push({
        id: `RISK-EVAL-NC-${evalRec.id}`,
        category: 'Technical / Threshold Risk',
        severity: 'HIGH',
        title: `Threshold Non-Compliance: ${reqTitle}`,
        description: `Extracted value (${evalRec.actualValue}) fails to meet tender requirement (${evalRec.expectedValue}).`,
        requirementId: evalRec.requirementId,
        documentTitle: 'Submitted Evidence Document',
        sourcePage: evalRec.sourcePage || 'Page 1',
        traceability: `${evalRec.requirementId} • Rule ${evalRec.ruleId} • ${evalRec.sourcePage || 'Page 1'}`,
        explanation: evalRec.reason,
      });
    } else if (evalRec.result === 'NOT EVALUATED') {
      findings.push({
        id: `RISK-EVAL-NE-${evalRec.id}`,
        category: 'Missing Evidence Risk',
        severity: 'HIGH',
        title: `Unmapped / Missing Mandatory Evidence: ${reqTitle}`,
        description: `Required evidence document for mandatory requirement (${evalRec.requirementId}) has not been uploaded.`,
        requirementId: evalRec.requirementId,
        sourcePage: 'N/A',
        traceability: `${evalRec.requirementId} • Missing Evidence`,
        explanation: evalRec.reason,
      });
    } else if (evalRec.result === 'NEEDS REVIEW') {
      findings.push({
        id: `RISK-EVAL-NR-${evalRec.id}`,
        category: 'UDIN / Format Verification Risk',
        severity: 'MEDIUM',
        title: `Format Verification Required: ${reqTitle}`,
        description: `Extracted value (${evalRec.actualValue}) requires officer verification or format check.`,
        requirementId: evalRec.requirementId,
        documentTitle: 'Submitted Evidence Document',
        sourcePage: evalRec.sourcePage || 'Page 1',
        traceability: `${evalRec.requirementId} • Rule ${evalRec.ruleId} • ${evalRec.sourcePage || 'Page 1'}`,
        explanation: evalRec.reason,
      });
    }
  });

  // 2. Analyze Step 9 Cross-Document Comparisons
  comparisons.forEach((comp) => {
    if (comp.result === 'INCONSISTENT') {
      const srcDocs = comp.sources.map((s) => s.documentTitle).join(', ');
      findings.push({
        id: `RISK-CROSS-INC-${comp.id}`,
        category: 'Cross-Document Discrepancy Risk',
        severity: 'HIGH',
        title: `Cross-Document Conflict: ${comp.attributeLabel}`,
        description: `Conflicting values extracted across ${srcDocs}.`,
        sourcePage: comp.sources[0]?.sourcePage || 'Page 1',
        traceability: `Cross-Doc ${comp.id} • ${comp.attributeLabel}`,
        explanation: comp.explanation,
      });
    } else if (comp.result === 'NEEDS REVIEW') {
      findings.push({
        id: `RISK-CROSS-NR-${comp.id}`,
        category: 'Address / Abbreviation Variance',
        severity: 'LOW',
        title: `Cross-Document Format Variance: ${comp.attributeLabel}`,
        description: `Formatting or abbreviation variance detected across submitted records.`,
        sourcePage: comp.sources[0]?.sourcePage || 'Page 1',
        traceability: `Cross-Doc ${comp.id} • ${comp.attributeLabel}`,
        explanation: comp.explanation,
      });
    }
  });

  const highSeverityCount = findings.filter((f) => f.severity === 'HIGH').length;
  const mediumSeverityCount = findings.filter((f) => f.severity === 'MEDIUM').length;
  const lowSeverityCount = findings.filter((f) => f.severity === 'LOW').length;
  const totalRisks = findings.length;

  let overallLevel: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK' = 'LOW RISK';
  if (highSeverityCount > 0) {
    overallLevel = 'HIGH RISK';
  } else if (mediumSeverityCount > 0) {
    overallLevel = 'MEDIUM RISK';
  }

  return {
    overallLevel,
    highSeverityCount,
    mediumSeverityCount,
    lowSeverityCount,
    totalRisks,
    findings,
  };
}
