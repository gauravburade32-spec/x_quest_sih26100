import { tenderService } from './tenderService';
import { bidderService } from './bidderService';
import { requirementService } from './requirementService';
import { documentService } from './documentService';
import { complianceService } from './complianceService';
import { decisionService } from './decisionService';

export const reportService = {
  compileExecutiveReport: (tenderId: string, bidderId: string) => {
    const tender = tenderService.getTenderById(tenderId);
    const bidder = bidderService.getBidderById(bidderId);
    const requirements = requirementService.getRequirementsByTenderId(tenderId);
    const documents = documentService.getDocumentsByBidderId(bidderId);
    const evaluations = complianceService.evaluateAllRules(
      bidderId,
      tenderId,
      requirements,
      [],
      {}
    );

    const scoreSummary = complianceService.calculateComplianceScoreSummary(evaluations, requirements);
    const comparisons = complianceService.getCrossDocumentComparisons(bidderId, tenderId);
    const riskSummary = complianceService.analyzeRiskProfileSummary(evaluations, comparisons, requirements);
    const explainableFindings = complianceService.generateExplainableFindingsList(
      evaluations,
      comparisons,
      requirements,
      riskSummary
    );
    const officerDecision = decisionService.getOfficerDecisionByBidderId(bidderId);

    return {
      compiledAt: new Date().toISOString(),
      tender,
      bidder,
      requirementsCount: requirements.length,
      documentsCount: documents.length,
      scoreSummary,
      riskSummary,
      explainableFindings,
      officerDecision: officerDecision || 'Under Review',
      authorityDisclosure:
        'AI analysis provides decision support only. Final procurement qualification or disqualification remains strictly with the Procurement Officer.',
    };
  },
};
