import { 
  Network, 
  Wallet, 
  Transaction, 
  GraphNode, 
  GraphEdge, 
  EntityIntelligence, 
  RiskAssessment, 
  EvidenceItem, 
  Recommendation,
  DataMode
} from '../types/index.js';

export interface InvestigationDataResult {
  walletProfile: Wallet;
  transactions: Transaction[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  entities: EntityIntelligence[];
  riskAssessment: RiskAssessment;
  evidence: EvidenceItem[];
  recommendations: Recommendation[];
  traceInterrupted?: {
    reason: string;
    lastObservableWallet: string;
    txHash: string;
    amount: number;
    asset: string;
    timestamp: string;
    attributionStatus: string;
  };
  crossChainMovement?: {
    sourceChain: Network;
    destinationChain: Network;
    bridge: string;
    sourceTx: string;
    destinationTx?: string;
    amount: number;
    asset: string;
    timestamp: string;
    confidence: string;
    destinationAttributed: boolean;
  };
}

export interface DataProvider {
  mode: DataMode;
  fetchInvestigationData(
    walletAddress: string, 
    network: Network, 
    hopDepth: number,
    caseId: string,
    investigationId: string,
    incidentType: string
  ): Promise<InvestigationDataResult>;
}
