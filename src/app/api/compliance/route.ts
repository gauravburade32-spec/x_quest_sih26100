import { NextResponse } from 'next/server';
import { complianceService, requirementService } from '@/services';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenderId = searchParams.get('tenderId') || 'TND-2026-GEM-8921';
  const bidderId = searchParams.get('bidderId') || 'BID-2026-901';

  const requirements = requirementService.getRequirementsByTenderId(tenderId);
  const evaluations = complianceService.evaluateAllRules(bidderId, tenderId, requirements, [], {});
  const comparisons = complianceService.getCrossDocumentComparisons(bidderId, tenderId);

  const scoreSummary = complianceService.calculateComplianceScoreSummary(evaluations, requirements);
  const riskSummary = complianceService.analyzeRiskProfileSummary(evaluations, comparisons, requirements);
  const explainableFindings = complianceService.generateExplainableFindingsList(
    evaluations,
    comparisons,
    requirements,
    riskSummary
  );

  return NextResponse.json({
    success: true,
    tenderId,
    bidderId,
    scoreSummary,
    riskSummary,
    explainableFindings,
    authorityDisclosure:
      'AI analysis provides decision support only. Final procurement qualification or disqualification remains strictly with the Procurement Officer.',
  });
}
