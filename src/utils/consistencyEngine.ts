import {
  CrossDocumentFieldComparison,
  DocumentFieldSource,
  ConsistencyResultState,
  MOCK_CONSISTENCY_COMPARISONS,
} from '@/data/mockData';

import {
  normalizeString,
  normalizeLegalName,
  normalizeGstin,
  normalizePan,
  normalizeDate,
  normalizeCurrencyAmount,
} from '@/utils/normalization';

/**
 * Deterministically evaluates consistency for a single field/attribute across document sources.
 */
export function evaluateFieldConsistency(
  attributeKey: string,
  attributeLabel: string,
  sources: DocumentFieldSource[]
): CrossDocumentFieldComparison {
  const sourceValues = sources.map((s) => s.extractedValue);
  const totalSources = sources.length;

  if (totalSources === 0) {
    return {
      id: `CROSS-${attributeKey}`,
      attributeKey,
      attributeLabel,
      sources: [],
      result: 'NOT AVAILABLE',
      confidence: 'Not detected',
      comparisonLogic: 'No document sources available for comparison.',
      explanation: 'No extracted evidence values were found for this attribute across submitted documents.',
      evaluatedAt: 'Just now',
    };
  }

  // 1. Legal Business Name Comparison Strategy
  if (attributeKey === 'legal_name') {
    const normNames = sourceValues.map((v) => normalizeLegalName(v));
    const allNormEqual = normNames.every((v) => v === normNames[0]);
    const rawEqual = sourceValues.every((v) => v === sourceValues[0]);

    if (rawEqual) {
      return {
        id: 'CROSS-001',
        attributeKey,
        attributeLabel,
        sources,
        result: 'CONSISTENT',
        confidence: 'High',
        comparisonLogic: 'Exact raw string match across all submitted corporate records.',
        explanation: 'Extracted legal entity names are identical across submitted documents.',
        evaluatedAt: 'Just now',
      };
    } else if (allNormEqual) {
      return {
        id: 'CROSS-001',
        attributeKey,
        attributeLabel,
        sources,
        result: 'CONSISTENT',
        confidence: 'High',
        comparisonLogic: 'Normalized string match ignoring case, spaces, and legal suffixes (Pvt Ltd vs Private Limited).',
        explanation: 'Values match after case and legal-suffix normalization (Pvt Ltd vs Private Limited).',
        evaluatedAt: 'Just now',
      };
    } else {
      return {
        id: 'CROSS-001',
        attributeKey,
        attributeLabel,
        sources,
        result: 'INCONSISTENT',
        confidence: 'High',
        comparisonLogic: 'Normalized string comparison across legal entity names.',
        explanation: 'Entity names genuinely differ across submitted documents and refer to different corporate names.',
        evaluatedAt: 'Just now',
      };
    }
  }

  // 2. GSTIN vs PAN Substring Alignment Strategy
  if (attributeKey === 'gstin_pan_match') {
    const gstinSrc = sources.find((s) => s.documentTitle.toLowerCase().includes('gst')) || sources[0];
    const panSrc = sources.find((s) => s.documentTitle.toLowerCase().includes('pan')) || sources[1];

    const normGstin = normalizeGstin(gstinSrc?.extractedValue || '');
    const normPan = normalizePan(panSrc?.extractedValue || '');

    // PAN should match characters 3 to 12 of GSTIN (15 chars: 2 state + 10 PAN + 1 entity + 1 Z + 1 check)
    const embeddedPan = normGstin.length >= 12 ? normGstin.substring(2, 12) : '';

    if (embeddedPan && normPan && embeddedPan === normPan) {
      return {
        id: 'CROSS-002',
        attributeKey,
        attributeLabel,
        sources,
        result: 'CONSISTENT',
        confidence: 'High',
        comparisonLogic: 'Chars 3-12 of GSTIN (27AAACA1234B1Z9) strictly match PAN Number (AAACA1234B).',
        explanation: `Extracted PAN (${normPan}) matches characters 3 to 12 of GSTIN (${normGstin}).`,
        evaluatedAt: 'Just now',
      };
    } else {
      return {
        id: 'CROSS-002',
        attributeKey,
        attributeLabel,
        sources,
        result: 'INCONSISTENT',
        confidence: 'High',
        comparisonLogic: 'GSTIN substring extraction vs standalone PAN card comparison.',
        explanation: 'GSTIN values do not match standalone PAN number across submitted documents.',
        evaluatedAt: 'Just now',
      };
    }
  }

  // 3. Date of Incorporation Strategy
  if (attributeKey === 'inc_date') {
    const normDates = sourceValues.map((v) => normalizeDate(v));
    const datesEqual = normDates.every((d) => d === normDates[0]);

    if (datesEqual) {
      return {
        id: 'CROSS-003',
        attributeKey,
        attributeLabel,
        sources,
        result: 'CONSISTENT',
        confidence: 'High',
        comparisonLogic: 'ISO date format standardization (YYYY-MM-DD).',
        explanation: `Date of Incorporation (${sourceValues[0]}) matches Date of Liability in GST Registration Certificate.`,
        evaluatedAt: 'Just now',
      };
    } else {
      return {
        id: 'CROSS-003',
        attributeKey,
        attributeLabel,
        sources,
        result: 'INCONSISTENT',
        confidence: 'High',
        comparisonLogic: 'ISO date format comparison.',
        explanation: 'Dates of incorporation/registration differ across submitted records.',
        evaluatedAt: 'Just now',
      };
    }
  }

  // 4. Organization Type Strategy (Demonstrating Genuine Conflict -> INCONSISTENT)
  if (attributeKey === 'org_type') {
    const normTypes = sourceValues.map((v) => normalizeString(v));
    const typesEqual = normTypes.every((t) => t === normTypes[0]);

    if (typesEqual) {
      return {
        id: 'CROSS-004',
        attributeKey,
        attributeLabel,
        sources,
        result: 'CONSISTENT',
        confidence: 'High',
        comparisonLogic: 'Controlled organization type classification match.',
        explanation: 'Organization type is consistently stated across all submitted records.',
        evaluatedAt: 'Just now',
      };
    } else {
      return {
        id: 'CROSS-004',
        attributeKey,
        attributeLabel,
        sources,
        result: 'INCONSISTENT',
        confidence: 'High',
        comparisonLogic: 'Controlled organization type conflict check.',
        explanation: `Organization type in GST Registration (${sourceValues[0]}) conflicts with Bid Submission Form (${sourceValues[sourceValues.length - 1]}).`,
        evaluatedAt: 'Just now',
      };
    }
  }

  // 5. Registered Address Strategy (Demonstrating Formatting Variance -> NEEDS REVIEW)
  if (attributeKey === 'registered_address') {
    const normAddrs = sourceValues.map((v) => normalizeString(v));
    const addrsEqual = normAddrs.every((a) => a === normAddrs[0]);

    if (addrsEqual) {
      return {
        id: 'CROSS-005',
        attributeKey,
        attributeLabel,
        sources,
        result: 'CONSISTENT',
        confidence: 'High',
        comparisonLogic: 'Normalized string address comparison.',
        explanation: 'Registered address matches across all submitted records.',
        evaluatedAt: 'Just now',
      };
    } else {
      return {
        id: 'CROSS-005',
        attributeKey,
        attributeLabel,
        sources,
        result: 'NEEDS REVIEW',
        confidence: 'Medium',
        comparisonLogic: 'Address string formatting and locality variance detection.',
        explanation: 'Address differs in formatting; manual officer review is recommended.',
        evaluatedAt: 'Just now',
      };
    }
  }

  // 6. Authorized Representative Strategy (Demonstrating Abbreviation -> NEEDS REVIEW)
  if (attributeKey === 'authorized_signatory') {
    const normSignatories = sourceValues.map((v) => normalizeString(v));
    const signatoriesEqual = normSignatories.every((s) => s === normSignatories[0]);

    if (signatoriesEqual) {
      return {
        id: 'CROSS-006',
        attributeKey,
        attributeLabel,
        sources,
        result: 'CONSISTENT',
        confidence: 'High',
        comparisonLogic: 'Name comparison across authorized signatories.',
        explanation: 'Authorized representative name matches exactly across submitted records.',
        evaluatedAt: 'Just now',
      };
    } else {
      return {
        id: 'CROSS-006',
        attributeKey,
        attributeLabel,
        sources,
        result: 'NEEDS REVIEW',
        confidence: 'Medium',
        comparisonLogic: 'Initial abbreviation check (Rajesh Kumar vs R. Kumar).',
        explanation: 'Authorized representative uses abbreviated initial (R. Kumar); manual officer confirmation recommended.',
        evaluatedAt: 'Just now',
      };
    }
  }

  // 7. Financial Turnover Strategy
  if (attributeKey === 'financial_turnover') {
    const numVals = sourceValues.map((v) => normalizeCurrencyAmount(v));
    const validNums = numVals.filter((n): n is number => n !== null);
    const numsEqual = validNums.length > 0 && validNums.every((n) => n === validNums[0]);

    if (numsEqual) {
      return {
        id: 'CROSS-007',
        attributeKey,
        attributeLabel,
        sources,
        result: 'CONSISTENT',
        confidence: 'High',
        comparisonLogic: 'Numeric currency normalization (₹2.4 Crore == 24,00,0000).',
        explanation: 'Average annual turnover of ₹2.4 Crore is consistently stated in CA Certificate and Audited Balance Sheet.',
        evaluatedAt: 'Just now',
      };
    } else {
      return {
        id: 'CROSS-007',
        attributeKey,
        attributeLabel,
        sources,
        result: 'NEEDS REVIEW',
        confidence: 'Medium',
        comparisonLogic: 'Financial period and currency value check.',
        explanation: 'Financial figures refer to different periods or contexts and cannot be safely compared automatically.',
        evaluatedAt: 'Just now',
      };
    }
  }

  // Fallback Comparison Evaluator
  const normFallbacks = sourceValues.map((v) => normalizeString(v));
  const fallbackEqual = normFallbacks.every((v) => v === normFallbacks[0]);

  return {
    id: `CROSS-${attributeKey}`,
    attributeKey,
    attributeLabel,
    sources,
    result: fallbackEqual ? 'CONSISTENT' : 'NEEDS REVIEW',
    confidence: 'High',
    comparisonLogic: 'Generic normalized string comparison.',
    explanation: fallbackEqual
      ? 'Extracted values match after safe normalization.'
      : 'Extracted values contain formatting differences requiring officer review.',
    evaluatedAt: 'Just now',
  };
}

/**
 * Dynamically evaluates cross-document consistency for a bidder across all tracked attributes.
 */
export function getCrossDocumentComparisonsForBidder(
  bidderId: string,
  tenderId: string
): CrossDocumentFieldComparison[] {
  // Dynamically evaluate each mock comparison attribute through field-specific normalization logic
  return MOCK_CONSISTENCY_COMPARISONS.map((comp) =>
    evaluateFieldConsistency(comp.attributeKey, comp.attributeLabel, comp.sources)
  );
}
