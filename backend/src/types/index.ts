export type Network = 'ETH' | 'POLYGON' | 'BSC' | 'BTC' | 'TRON' | 'ARBITRUM';

export type IncidentType = 
  | 'Investment Fraud'
  | 'Task Fraud'
  | 'Phishing'
  | 'Ransomware'
  | 'Sextortion'
  | 'Darknet-related Fraud'
  | 'Organized Cyber Fraud'
  | 'Other';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CaseStatus = 'NEW' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'CLOSED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export type AttributionState = 
  | 'CONFIRMED LABEL'
  | 'HIGH CONFIDENCE'
  | 'PROBABLE'
  | 'POSSIBLE'
  | 'UNKNOWN';

export type Provenance = 
  | 'DEMO DATA'
  | 'LIVE DATA'
  | 'INFERRED'
  | 'EXTERNAL LABEL'
  | 'UNKNOWN';

export type DataMode = 'DEMO' | 'LIVE';

export type NodeType = 
  | 'REPORTED WALLET'
  | 'INTERMEDIARY'
  | 'UNKNOWN WALLET'
  | 'CONTRACT'
  | 'EXCHANGE / VASP'
  | 'BRIDGE'
  | 'MIXER / TUMBLER'
  | 'OTHER SERVICE';

export type EntityType = 
  | 'Exchange'
  | 'VASP'
  | 'Bridge'
  | 'Mixer'
  | 'DeFi Protocol'
  | 'Payment Processor'
  | 'Unknown Service';

export type EvidenceType = 
  | 'Transaction Hash'
  | 'Wallet'
  | 'Block'
  | 'Timestamp'
  | 'External Label'
  | 'Observed Relationship'
  | 'Analytical Signal';

export interface Wallet {
  address: string;
  network: Network;
  firstActivity: string;
  latestActivity: string;
  txCount: number;
  incomingVolume: number;
  outgoingVolume: number;
  currentBalance: number;
  asset: string;
  uniqueCounterparties: number;
  knownLabels: string[];
  entityName?: string;
  entityType?: EntityType;
  attributionConfidence: AttributionState;
  riskClassification: RiskLevel;
  provenance: Provenance;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  asset: string;
  amount: number;
  usdValue: number;
  timestamp: string;
  blockNumber: number;
  network: Network;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  hop: number;
  direction: 'INCOMING' | 'OUTGOING';
  classification: string;
  gasUsed?: number;
  gasPriceGwei?: number;
  explorerUrl?: string;
  provenance: Provenance;
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  network: Network;
  balance?: number;
  asset?: string;
  risk: RiskLevel;
  attribution: AttributionState;
  entityName?: string;
  hop: number;
  isReported?: boolean;
  provenance: Provenance;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  asset: string;
  usdValue: number;
  timestamp: string;
  txHash: string;
  hop: number;
  classification?: string;
  provenance: Provenance;
}

export interface RiskSignal {
  id: string;
  name: string;
  observedBehaviour: string;
  evidence: string[];
  severity: RiskLevel;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
  relatedTransactions: string[];
}

export interface RiskAssessment {
  classification: RiskLevel;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  scoreBasis: string;
  signals: RiskSignal[];
  supportingEvidence: string[];
  limitations: string[];
  disclaimer: string;
}

export interface EntityIntelligence {
  entityName: string;
  entityType: EntityType;
  wallet: string;
  network: Network;
  source: string;
  label: string;
  confidence: AttributionState;
  lastVerified: string;
  evidence: string[];
  whyExplanation: string;
  jurisdiction?: string;
  leaContactProcedure?: string;
  fiuRegistered?: boolean;
}

export interface EvidenceItem {
  id: string;
  investigationId: string;
  type: EvidenceType;
  title: string;
  identifier: string;
  description: string;
  network: Network;
  timestamp: string;
  provenance: Provenance;
  verified: boolean;
  chainOfCustody: string;
}

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  evidence: string[];
  priority: Priority;
  suggestedAction: string;
  targetEntity?: string;
  legalProcess?: string;
}

export interface Alert {
  id: string;
  caseId: string;
  wallet: string;
  trigger: string;
  severity: Priority;
  evidence: string;
  status: 'NEW' | 'ACKNOWLEDGED' | 'DISMISSED';
  timestamp: string;
}

export interface AuditLog {
  id: string;
  caseId: string;
  user: string;
  action: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
  details?: string;
}

export interface Case {
  id: string;
  caseId: string;
  title: string;
  incidentType: IncidentType;
  priority: Priority;
  status: CaseStatus;
  assignedInvestigator: string;
  complaintReference?: string;
  reportedWallet: string;
  network: Network;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Investigation {
  id: string;
  caseId: string;
  walletAddress: string;
  network: Network;
  incidentType: IncidentType;
  priority: Priority;
  status: 'INITIALIZING' | 'VALIDATING' | 'INGESTING' | 'TRACING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  currentStage: string;
  hopDepth: number;
  dataMode: DataMode;
  createdAt: string;
  completedAt?: string;
  walletProfile?: Wallet;
  transactions: Transaction[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  entities: EntityIntelligence[];
  riskAssessment?: RiskAssessment;
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
