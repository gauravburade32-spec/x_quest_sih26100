import { Bidder, MOCK_BIDDERS_LIST } from '@/data/mockData';

let biddersStore: Bidder[] = [...MOCK_BIDDERS_LIST];

export const bidderService = {
  getBidders: (): Bidder[] => {
    return biddersStore;
  },

  getBiddersByTenderId: (tenderId: string): Bidder[] => {
    return biddersStore.filter((b) => b.tenderId === tenderId);
  },

  getBidderById: (bidderId: string): Bidder | undefined => {
    return biddersStore.find((b) => b.id === bidderId);
  },

  updateBidderSubmittedCount: (bidderId: string, increment: number): Bidder | undefined => {
    biddersStore = biddersStore.map((b) => {
      if (b.id === bidderId) {
        const newCount = Math.max(0, b.submittedCount + increment);
        return {
          ...b,
          submittedCount: newCount,
          status: newCount >= b.requiredCount ? 'Ready for Verification' : 'Documents Pending',
        };
      }
      return b;
    });

    return biddersStore.find((b) => b.id === bidderId);
  },
};
