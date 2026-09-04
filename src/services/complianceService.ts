import {
  ComplianceRule,
  MOCK_COMPLIANCE_RULES,
  RuleEvaluationRecord,
  EvidenceMappingItem,
  DocumentIntelligenceResult,
  CrossDocumentFieldComparison,
  TenderRequirement,
} from '@/data/mockData';

import { evaluateComplianceRule } from '@/utils/rulesEngine';
import { getCrossDocumentComparisonsForBidder } from '@/utils/consistencyEngine';
import { calculateComplianceScore, ComplianceScoreSummary } from '@/utils/scoringEngine';
import { analyzeRiskProfile, RiskAssessmentSummary } from '@/utils/riskEngine';
import { generateExplainableFindings } from '@/utils/explainableAiEngine';

let rulesStore: ComplianceRule[] = [...MOCK_COMPLIANCE_RULES];

export const complianceService = {
  getRules: (): ComplianceRule[] => {
    return rulesStore;
  },

  getRuleByRequirementId: (reqId: string): ComplianceRule | undefined => {
    return rulesStore.find((r) => r.requirementId === reqId);
  },

  evaluateRuleForRequirement: (
    reqId: string,
    bidderId: string,
    tenderId: string,
    mappings: EvidenceMappingItem[],
    intelligenceResults: Record<string, DocumentIntelligenceResult>
  ): RuleEvaluationRecord => {
    const targetRule = rulesStore.find((r) => r.requirementId === reqId);
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
      return evaluateComplianceRule(defaultRule, mappings, intelligenceResults, tenderId, bidderId);
    }

    return evaluateComplianceRule(targetRule, mappings, intelligenceResults, tenderId, bidderId);
  },

  evaluateAllRules: (
    bidderId: string,
    tenderId: string,
    requirements: TenderRequirement[],
    mappings: EvidenceMappingItem[],
    intelligenceResults: Record<string, DocumentIntelligenceResult>
  ): RuleEvaluationRecord[] => {
    return requirements.map((req) =>
      complianceService.evaluateRuleForRequirement(req.id, bidderId, tenderId, mappings, intelligenceResults)
    );
  },

  getCrossDocumentComparisons: (bidderId: string, tenderId: string): CrossDocumentFieldComparison[] => {
    return getCrossDocumentComparisonsForBidder(bidderId, tenderId);
  },

  calculateComplianceScoreSummary: (
    evaluations: RuleEvaluationRecord[],
    requirements: TenderRequirement[]
  ): ComplianceScoreSummary => {
    return calculateComplianceScore(evaluations, requirements);
  },

  analyzeRiskProfileSummary: (
    evaluations: RuleEvaluationRecord[],
    comparisons: CrossDocumentFieldComparison[],
    requirements: TenderRequirement[]
  ): RiskAssessmentSummary => {
    return analyzeRiskProfile(evaluations, comparisons, requirements);
  },

  generateExplainableFindingsList: (
    evaluations: RuleEvaluationRecord[],
    comparisons: CrossDocumentFieldComparison[],
    requirements: TenderRequirement[],
    riskSummary: RiskAssessmentSummary
  ) => {
    return generateExplainableFindings(evaluations, comparisons, requirements, riskSummary);
  },
};
