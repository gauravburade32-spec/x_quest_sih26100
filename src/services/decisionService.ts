import {
  OfficerDecisionRecord,
  FindingVerificationState,
  MOCK_OFFICER_DECISIONS,
} from '@/data/mockData';

let officerDecisionsStore: Record<string, OfficerDecisionRecord> = { ...MOCK_OFFICER_DECISIONS };
let findingVerificationsStore: Record<string, FindingVerificationState> = {};

export const decisionService = {
  getOfficerDecisions: (): Record<string, OfficerDecisionRecord> => {
    return officerDecisionsStore;
  },

  getOfficerDecisionByBidderId: (bidderId: string): OfficerDecisionRecord | undefined => {
    return officerDecisionsStore[bidderId];
  },

  saveOfficerDecision: (bidderId: string, record: OfficerDecisionRecord): OfficerDecisionRecord => {
    officerDecisionsStore = {
      ...officerDecisionsStore,
      [bidderId]: record,
    };
    return record;
  },

  getFindingVerification: (findingId: string): FindingVerificationState => {
    return findingVerificationsStore[findingId] || 'Keep Pending';
  },

  updateFindingVerification: (findingId: string, status: FindingVerificationState): FindingVerificationState => {
    findingVerificationsStore = {
      ...findingVerificationsStore,
      [findingId]: status,
    };
    return status;
  },
};
