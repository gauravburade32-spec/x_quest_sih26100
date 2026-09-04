import {
  BidderDocument,
  MOCK_BIDDER_DOCUMENTS,
  DocumentIntelligenceResult,
  MOCK_INTELLIGENCE_RESULTS,
} from '@/data/mockData';

let documentsStore: BidderDocument[] = [...MOCK_BIDDER_DOCUMENTS];
let intelligenceResultsStore: Record<string, DocumentIntelligenceResult> = { ...MOCK_INTELLIGENCE_RESULTS };

export const documentService = {
  getDocuments: (): BidderDocument[] => {
    return documentsStore;
  },

  getDocumentsByBidderId: (bidderId: string): BidderDocument[] => {
    return documentsStore.filter((d) => d.bidderId === bidderId);
  },

  getDocumentById: (docId: string): BidderDocument | undefined => {
    return documentsStore.find((d) => d.id === docId);
  },

  addDocument: (newDoc: BidderDocument): BidderDocument => {
    documentsStore = [newDoc, ...documentsStore];
    return newDoc;
  },

  removeDocument: (docId: string): void => {
    documentsStore = documentsStore.filter((d) => d.id !== docId);
  },

  getIntelligenceResult: (docId: string): DocumentIntelligenceResult | undefined => {
    return intelligenceResultsStore[docId];
  },

  saveIntelligenceResult: (docId: string, result: DocumentIntelligenceResult): DocumentIntelligenceResult => {
    intelligenceResultsStore = {
      ...intelligenceResultsStore,
      [docId]: result,
    };
    return result;
  },
};
