export type ChatCategory =
  | 'Getting Started'
  | 'Tender & Documents'
  | 'Compliance & Risk'
  | 'Officer Review'
  | 'Reports & Audit';

export interface PredefinedQA {
  id: string;
  category: ChatCategory;
  question: string;
  answer: string;
  keywords: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: ChatCategory;
  isFallback?: boolean;
}

export const CHAT_CATEGORIES: ChatCategory[] = [
  'Getting Started',
  'Tender & Documents',
  'Compliance & Risk',
  'Officer Review',
  'Reports & Audit',
];

export const FALLBACK_MESSAGE =
  "I’m currently limited to BidSure Assistant’s supported procurement topics. Please choose one of the suggested questions.";

export const PREDEFINED_QA: PredefinedQA[] = [
  // Getting Started
  {
    id: 'QA-GS-01',
    category: 'Getting Started',
    question: 'What is BidSure AI and how does it assist procurement officers?',
    answer:
      'BidSure AI is an evidence-driven procurement evaluation platform designed for public procurement officers. It automates tender requirement extraction, cross-document verification, rule-based compliance scoring, and audit trail compilation.',
    keywords: ['bidsure', 'what is', 'assist', 'platform', 'overview', 'purpose', 'about'],
  },
  {
    id: 'QA-GS-02',
    category: 'Getting Started',
    question: 'How do I evaluate a bidder\'s submission?',
    answer:
      'To evaluate a bidder, navigate to Tenders or Bidders, select a tender submission package, and view the automated Verification and Compliance & Risk evaluations. As an officer, you can review findings, add rationale, and submit your evaluation decision.',
    keywords: ['evaluate', 'bidder', 'submission', 'start', 'process', 'how to'],
  },
  {
    id: 'QA-GS-03',
    category: 'Getting Started',
    question: 'Does BidSure AI automatically award tenders or make final decisions?',
    answer:
      'No. BidSure AI is an automated decision-support system. It highlights compliance gaps, score percentages, and risk levels, but the official evaluation decision remains entirely with the Procurement Officer.',
    keywords: ['automatically', 'award', 'final decision', 'ai decision', 'authority', 'legal'],
  },
  {
    id: 'QA-GS-04',
    category: 'Getting Started',
    question: 'Where can I see an overview of active tenders and evaluation metrics?',
    answer:
      'The Dashboard provides real-time KPIs, active tender summary cards, recent evaluation activities, and compliance score distributions across all active procurement packages.',
    keywords: ['dashboard', 'overview', 'metrics', 'kpi', 'active tenders', 'summary'],
  },

  // Tender & Documents
  {
    id: 'QA-TD-01',
    category: 'Tender & Documents',
    question: 'What document types can be verified in BidSure AI?',
    answer:
      'BidSure AI verifies key procurement documents including Certificates of Incorporation, GST Registration Certificates, PAN Cards, Audited Financial Statements, OEM Manufacturer Authorization Forms (MAF), Past Performance Certificates, and Technical Compliance Sheets.',
    keywords: ['documents', 'types', 'verify', 'gst', 'pan', 'incorporation', 'maf', 'financials'],
  },
  {
    id: 'QA-TD-02',
    category: 'Tender & Documents',
    question: 'How does cross-document field consistency matching work?',
    answer:
      'The system extracts matching entities (e.g. Legal Business Name, GSTIN, PAN, Financial Turnover) across all uploaded documents and performs normalization to detect discrepancies or name variations between certificates.',
    keywords: ['cross-document', 'consistency', 'matching', 'normalization', 'discrepancy', 'conflict'],
  },
  {
    id: 'QA-TD-03',
    category: 'Tender & Documents',
    question: 'What should I do if a document has low extraction confidence?',
    answer:
      'Navigate to the Documents page, locate the document, and click "View Evidence". You can inspect the exact source page and manually confirm or correct the extracted values.',
    keywords: ['low confidence', 'extraction', 'evidence', 'page', 'verify document', 'manual'],
  },
  {
    id: 'QA-TD-04',
    category: 'Tender & Documents',
    question: 'How do I upload new tender documents or bidder packages?',
    answer:
      'Go to the Tenders page, click "Upload Tender / RFP", and follow the step-by-step wizard to upload tender requirements or bidder submission files.',
    keywords: ['upload', 'new tender', 'rfp', 'bidder package', 'wizard', 'add document'],
  },

  // Compliance & Risk
  {
    id: 'QA-CR-01',
    category: 'Compliance & Risk',
    question: 'How is the Compliance Score calculated?',
    answer:
      'The Compliance Score is calculated by evaluating mandatory and technical eligibility rules against extracted bidder evidence. Passed mandatory rules contribute to the total score percentage.',
    keywords: ['compliance score', 'calculate', 'score percentage', 'formula', 'rating', 'rules'],
  },
  {
    id: 'QA-CR-02',
    category: 'Compliance & Risk',
    question: 'What causes a bidder to be flagged as HIGH RISK?',
    answer:
      'A HIGH RISK rating is assigned when a bidder fails mandatory eligibility criteria (such as invalid GSTIN, turnover below threshold, missing OEM authorization, or severe cross-document inconsistencies).',
    keywords: ['high risk', 'flagged', 'risk level', 'failed mandatory', 'risk calculation', 'warning'],
  },
  {
    id: 'QA-CR-03',
    category: 'Compliance & Risk',
    question: 'What are Explainable AI Findings?',
    answer:
      'Explainable AI Findings provide plain-language explanations of rule evaluations. Each finding details why a result was flagged, what evidence was cited (document ID & page number), and recommended officer actions.',
    keywords: ['explainable', 'findings', 'xai', 'why generated', 'traceability', 'citation'],
  },
  {
    id: 'QA-CR-04',
    category: 'Compliance & Risk',
    question: 'How are financial turnover thresholds verified?',
    answer:
      'The system compares the mandatory turnover requirement in the tender RFP against audited annual financial statements, converting currency formats and calculating multi-year averages.',
    keywords: ['financial', 'turnover', 'threshold', 'audited', 'balance sheet', 'currency'],
  },

  // Officer Review
  {
    id: 'QA-OR-01',
    category: 'Officer Review',
    question: 'How do I record an Officer Review decision?',
    answer:
      'Navigate to Recommendations or Verification, select the bidder submission, review the automated findings, select a decision (Approve, Reject, or Request Clarification), enter your official rationale, and click "Submit Decision".',
    keywords: ['record decision', 'officer review', 'approve', 'reject', 'clarification', 'rationale'],
  },
  {
    id: 'QA-OR-02',
    category: 'Officer Review',
    question: 'How do I issue a GeM clarification notice to a bidder?',
    answer:
      'When recording your review decision, select "Clarification Requested". BidSure AI automatically generates a formatted GeM portal notice detailing the exact missing documents or requirement gaps.',
    keywords: ['gem', 'clarification notice', 'issue notice', 'portal', 'missing documents'],
  },
  {
    id: 'QA-OR-03',
    category: 'Officer Review',
    question: 'Can a Procurement Officer override an automated compliance flag?',
    answer:
      'Yes. Officers can override system recommendations by recording a clear justification and supporting rationale, which is permanently logged in the audit trail.',
    keywords: ['override', 'automated flag', 'justification', 'officer authority', 'change result'],
  },

  // Reports & Audit
  {
    id: 'QA-RA-01',
    category: 'Reports & Audit',
    question: 'How do I export an executive evaluation report?',
    answer:
      'Go to the Reports tab, select the target tender and bidder, and click "Download PDF Report" or "Export Summary" to generate a complete executive evaluation report suitable for official filing.',
    keywords: ['export report', 'download pdf', 'executive report', 'summary', 'print report'],
  },
  {
    id: 'QA-RA-02',
    category: 'Reports & Audit',
    question: 'What details are recorded in the Audit Trail?',
    answer:
      'The Audit Trail logs every system event, including tender creation, document extraction, rule evaluation, officer decision entries, rationale notes, and timestamped user actions.',
    keywords: ['audit trail', 'recorded', 'logs', 'history', 'timestamp', 'events', 'lineage'],
  },
  {
    id: 'QA-RA-03',
    category: 'Reports & Audit',
    question: 'Is BidSure AI compliant with public procurement audit standards?',
    answer:
      'Yes. All evaluations maintain complete data lineage, page-level evidence citations, immutable audit logs, and clear decision-support disclaimers compliant with public audit guidelines.',
    keywords: ['audit standards', 'cag', 'cvc', 'compliance', 'legal compliance', 'disclaimer'],
  },
];

/**
 * Gets predefined questions filtered by category.
 */
export function getQuestionsByCategory(category?: ChatCategory): PredefinedQA[] {
  if (!category) return PREDEFINED_QA;
  return PREDEFINED_QA.filter((qa) => qa.category === category);
}

/**
 * Normalizes text for matching by removing special characters, spaces, and converting to lowercase.
 */
function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Finds a matching answer for a user query.
 * First checks for exact match, then substring/includes match, then keyword matching score.
 */
export function findMatchingAnswer(userQuery: string): PredefinedQA | null {
  const normQuery = normalizeQuery(userQuery);
  if (!normQuery) return null;

  // 1. Exact match or includes match on full question
  for (const qa of PREDEFINED_QA) {
    const normQuestion = normalizeQuery(qa.question);
    if (normQuestion === normQuery || normQuestion.includes(normQuery) || normQuery.includes(normQuestion)) {
      return qa;
    }
  }

  // 2. Keyword match scoring
  const queryTokens = normQuery.split(/\s+/).filter((t) => t.length > 2);
  let bestMatch: PredefinedQA | null = null;
  let maxScore = 0;

  for (const qa of PREDEFINED_QA) {
    let score = 0;
    const normQuestion = normalizeQuery(qa.question);

    for (const token of queryTokens) {
      if (normQuestion.includes(token)) {
        score += 2;
      }
      for (const kw of qa.keywords) {
        if (kw.toLowerCase().includes(token) || token.includes(kw.toLowerCase())) {
          score += 3;
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = qa;
    }
  }

  // Require a minimum threshold score for keyword matches
  if (maxScore >= 4) {
    return bestMatch;
  }

  return null;
}
