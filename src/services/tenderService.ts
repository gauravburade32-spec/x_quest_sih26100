import { Tender, MOCK_TENDERS_LIST } from '@/data/mockData';

let tendersStore: Tender[] = [...MOCK_TENDERS_LIST];

export const tenderService = {
  getTenders: (): Tender[] => {
    return tendersStore;
  },

  getTenderById: (id: string): Tender | undefined => {
    return tendersStore.find((t) => t.id === id);
  },

  addTender: (newTender: Tender): Tender => {
    tendersStore = [newTender, ...tendersStore];
    return newTender;
  },
};
