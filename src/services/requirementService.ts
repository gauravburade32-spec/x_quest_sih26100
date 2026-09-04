import { TenderRequirement, MOCK_REQUIREMENTS, GENERATE_DEFAULT_REQUIREMENTS } from '@/data/mockData';
import { tenderService } from './tenderService';

let requirementsStore: TenderRequirement[] = [...MOCK_REQUIREMENTS];

export const requirementService = {
  getRequirements: (): TenderRequirement[] => {
    return requirementsStore;
  },

  getRequirementsByTenderId: (tenderId: string): TenderRequirement[] => {
    const matched = requirementsStore.filter((r) => r.tenderId === tenderId);
    if (matched.length > 0) return matched;

    const targetTender = tenderService.getTenderById(tenderId);
    return GENERATE_DEFAULT_REQUIREMENTS(
      tenderId,
      targetTender?.title || 'Tender Document',
      targetTender?.uploadedDocumentName || 'Tender_Document.pdf'
    );
  },

  addRequirements: (newReqs: TenderRequirement[]): void => {
    requirementsStore = [...newReqs, ...requirementsStore];
  },
};
