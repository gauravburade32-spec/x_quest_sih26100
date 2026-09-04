import { RuleEvaluationRecord, TenderRequirement } from '@/data/mockData';

export interface ComplianceScoreSummary {
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  needsReviewCount: number;
  notEvaluatedCount: number;
  mandatoryTotal: number;
  mandatoryCompliant: number;
  mandatoryNonCompliant: number;
  scorePercentage: number;
  methodologyExplanation: string;
}

/**
 * Calculates compliance score and requirement metrics for a bidder and tender.
 * Uses transparent weighted formula:
 * Score % = ((Compliant Count + (0.5 * Needs Review Count)) / Total Evaluated) * 100
 */
export function calculateComplianceScore(
  evaluations: RuleEvaluationRecord[],
  requirements: TenderRequirement[]
): ComplianceScoreSummary {
  const totalRequirements = evaluations.length;

  if (totalRequirements === 0) {
    return {
      totalRequirements: 0,
      compliantCount: 0,
      nonCompliantCount: 0,
      needsReviewCount: 0,
      notEvaluatedCount: 0,
      mandatoryTotal: 0,
      mandatoryCompliant: 0,
      mandatoryNonCompliant: 0,
      scorePercentage: 0,
      methodologyExplanation: 'No evaluations executed for the selected bidder/tender.',
    };
  }

  const compliantCount = evaluations.filter((e) => e.result === 'COMPLIANT').length;
  const nonCompliantCount = evaluations.filter((e) => e.result === 'NON-COMPLIANT').length;
  const needsReviewCount = evaluations.filter((e) => e.result === 'NEEDS REVIEW').length;
  const notEvaluatedCount = evaluations.filter((e) => e.result === 'NOT EVALUATED').length;

  const reqMap = new Map(requirements.map((r) => [r.id, r]));

  let mandatoryTotal = 0;
  let mandatoryCompliant = 0;
  let mandatoryNonCompliant = 0;

  evaluations.forEach((e) => {
    const req = reqMap.get(e.requirementId);
    if (req?.isMandatory) {
      mandatoryTotal++;
      if (e.result === 'COMPLIANT') mandatoryCompliant++;
      if (e.result === 'NON-COMPLIANT') mandatoryNonCompliant++;
    }
  });

  // Calculate weighted percentage score:
  // Compliant = 1.0, Needs Review = 0.5 (partial credit pending officer check), Non-Compliant/Not Evaluated = 0.0
  const weightedPoints = compliantCount * 1.0 + needsReviewCount * 0.5;
  const rawPercentage = (weightedPoints / totalRequirements) * 100;
  const scorePercentage = Math.round(rawPercentage * 10) / 10; // Round to 1 decimal place

  const methodologyExplanation = `Score calculated using transparent weighted formula: 100% weight for Compliant items (${compliantCount}), 50% partial weight for Needs Review items (${needsReviewCount}), and 0% for Non-Compliant (${nonCompliantCount}) / Not Evaluated (${notEvaluatedCount}) across ${totalRequirements} total requirements.`;

  return {
    totalRequirements,
    compliantCount,
    nonCompliantCount,
    needsReviewCount,
    notEvaluatedCount,
    mandatoryTotal,
    mandatoryCompliant,
    mandatoryNonCompliant,
    scorePercentage,
    methodologyExplanation,
  };
}
