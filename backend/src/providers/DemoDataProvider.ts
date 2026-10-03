import { DataProvider, InvestigationDataResult } from './DataProvider.js';
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

export class DemoDataProvider implements DataProvider {
  mode: DataMode = 'DEMO';

  async fetchInvestigationData(
    walletAddress: string,
    network: Network,
    hopDepth: number = 3,
    caseId: string,
    investigationId: string,
    incidentType: string
  ): Promise<InvestigationDataResult> {
    // Normalizing address
    const reportedAddr = walletAddress.trim();
    
    // Hop 0 - Reported Wallet
    const reportedProfile: Wallet = {
      address: reportedAddr,
      network: network,
      firstActivity: '2026-09-28T04:12:00Z',
      latestActivity: '2026-09-28T10:14:22Z',
      txCount: 14,
      incomingVolume: 12.5,
      outgoingVolume: 12.45,
      currentBalance: 0.05,
      asset: network === 'BTC' ? 'BTC' : network === 'TRON' ? 'USDT' : 'ETH',
      uniqueCounterparties: 11,
      knownLabels: ['Victim Fund Ingestion Point', 'Mule Collector Node'],
      attributionConfidence: 'HIGH CONFIDENCE',
      riskClassification: 'CRITICAL',
      provenance: 'DEMO DATA'
    };

    // Addresses in the multi-hop chain
    const hop1MuleA = '0x3A94b1C89F82cD412e091219Af62Dbc099187321';
    const hop1MuleB = '0x9E71cA4012F439D9B231F0a93108c47E991A843b';
    
    const hop2Consolidation = '0x55B8109F21aC389E8203b8E1c324890A931E2c30';
    const hop2Bridge = '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE';
    const hop2MixerIntermediary = '0x08304033B44F8c4d1f2bC9c6d3A76B8e0409A8e9';

    const hop3BinanceVasp = '0x28C6c06298d514Db089934071355E5743bf21d60';
    const hop3WazirXVasp = '0x5Bdf6476b71f92eD8d85f8670494A1A1Fa1e68Fe';
    const hop3HuobiVasp = '0x1062a747393198f70F71ec65A582423DB7E5ab36';
    const hop3TornadoCash = '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b';

    // Transactions list
    const transactions: Transaction[] = [
      // Victim Inflows to Reported Wallet
      {
        hash: '0x9a81c0029bfa8192a01982347102938471928471928347192834719283471928',
        from: '0x1111a49f81928491823948192849182934819283',
        to: reportedAddr,
        asset: 'ETH',
        amount: 4.5,
        usdValue: 12150,
        timestamp: '2026-09-28T04:15:00Z',
        blockNumber: 20845100,
        network: network,
        status: 'SUCCESS',
        hop: 0,
        direction: 'INCOMING',
        classification: 'Victim Inflow (Deposit 1)',
        gasUsed: 21000,
        gasPriceGwei: 28,
        explorerUrl: `https://etherscan.io/tx/0x9a81c0029bfa8192a01982347102938471928471928347192834719283471928`,
        provenance: 'DEMO DATA'
      },
      {
        hash: '0x8b72d11394819283471928471928347192834719284719283471928347192834',
        from: '0x2222b98471928347192834719283471928471928',
        to: reportedAddr,
        asset: 'ETH',
        amount: 8.0,
        usdValue: 21600,
        timestamp: '2026-09-28T04:22:30Z',
        blockNumber: 20845135,
        network: network,
        status: 'SUCCESS',
        hop: 0,
        direction: 'INCOMING',
        classification: 'Victim Inflow (Deposit 2)',
        gasUsed: 21000,
        gasPriceGwei: 29,
        explorerUrl: `https://etherscan.io/tx/0x8b72d11394819283471928471928347192834719284719283471928347192834`,
        provenance: 'DEMO DATA'
      },
      // Hop 1 - Rapid Fan-out Layering
      {
        hash: '0x7c63e22419283471928347192847192834719283471928347192834719283471',
        from: reportedAddr,
        to: hop1MuleA,
        asset: 'ETH',
        amount: 6.2,
        usdValue: 16740,
        timestamp: '2026-09-28T04:28:10Z',
        blockNumber: 20845160,
        network: network,
        status: 'SUCCESS',
        hop: 1,
        direction: 'OUTGOING',
        classification: 'Layering Fan-Out (Tranche 1)',
        gasUsed: 21000,
        gasPriceGwei: 31,
        explorerUrl: `https://etherscan.io/tx/0x7c63e22419283471928347192847192834719283471928347192834719283471`,
        provenance: 'DEMO DATA'
      },
      {
        hash: '0x6d54f33519283471928347192847192834719283471928347192834719283471',
        from: reportedAddr,
        to: hop1MuleB,
        asset: 'ETH',
        amount: 6.25,
        usdValue: 16875,
        timestamp: '2026-09-28T04:30:00Z',
        blockNumber: 20845168,
        network: network,
        status: 'SUCCESS',
        hop: 1,
        direction: 'OUTGOING',
        classification: 'Layering Fan-Out (Tranche 2)',
        gasUsed: 21000,
        gasPriceGwei: 32,
        explorerUrl: `https://etherscan.io/tx/0x6d54f335192834719283471928347192834719283471928347192834719283471`,
        provenance: 'DEMO DATA'
      },
      // Hop 2 Transfers
      {
        hash: '0x5e45a44619283471928347192847192834719283471928347192834719283471',
        from: hop1MuleA,
        to: hop2Consolidation,
        asset: 'ETH',
        amount: 6.18,
        usdValue: 16686,
        timestamp: '2026-09-28T04:45:15Z',
        blockNumber: 20845240,
        network: network,
        status: 'SUCCESS',
        hop: 2,
        direction: 'OUTGOING',
        classification: 'Consolidation Routing',
        gasUsed: 21000,
        gasPriceGwei: 30,
        provenance: 'DEMO DATA'
      },
      {
        hash: '0x4f36b55719283471928347192847192834719283471928347192834719283471',
        from: hop1MuleB,
        to: hop2Bridge,
        asset: 'USDT',
        amount: 15000,
        usdValue: 15000,
        timestamp: '2026-09-28T04:52:00Z',
        blockNumber: 20845270,
        network: network,
        status: 'SUCCESS',
        hop: 2,
        direction: 'OUTGOING',
        classification: 'Cross-Chain Bridge Lock',
        gasUsed: 65000,
        gasPriceGwei: 35,
        provenance: 'DEMO DATA'
      },
      {
        hash: '0x3a27c66819283471928347192847192834719283471928347192834719283471',
        from: hop1MuleB,
        to: hop2MixerIntermediary,
        asset: 'ETH',
        amount: 2.1,
        usdValue: 5670,
        timestamp: '2026-09-28T05:05:00Z',
        blockNumber: 20845330,
        network: network,
        status: 'SUCCESS',
        hop: 2,
        direction: 'OUTGOING',
        classification: 'Pre-Mixer Staging Transfer',
        gasUsed: 21000,
        gasPriceGwei: 27,
        provenance: 'DEMO DATA'
      },
      // Hop 3 Transfers to VASPs & Mixer
      {
        hash: '0x2b18d77919283471928347192847192834719283471928347192834719283471',
        from: hop2Consolidation,
        to: hop3BinanceVasp,
        asset: 'ETH',
        amount: 4.15,
        usdValue: 11205,
        timestamp: '2026-09-28T05:22:10Z',
        blockNumber: 20845410,
        network: network,
        status: 'SUCCESS',
        hop: 3,
        direction: 'OUTGOING',
        classification: 'VASP Ingestion (Binance Hot Wallet)',
        gasUsed: 21000,
        gasPriceGwei: 29,
        provenance: 'DEMO DATA'
      },
      {
        hash: '0x1c09e88019283471928347192847192834719283471928347192834719283471',
        from: hop2Consolidation,
        to: hop3WazirXVasp,
        asset: 'ETH',
        amount: 1.95,
        usdValue: 5265,
        timestamp: '2026-09-28T05:30:40Z',
        blockNumber: 20845450,
        network: network,
        status: 'SUCCESS',
        hop: 3,
        direction: 'OUTGOING',
        classification: 'VASP Ingestion (WazirX Indian Exchange)',
        gasUsed: 21000,
        gasPriceGwei: 28,
        provenance: 'DEMO DATA'
      },
      {
        hash: '0x0d90f99119283471928347192847192834719283471928347192834719283471',
        from: hop2MixerIntermediary,
        to: hop3TornadoCash,
        asset: 'ETH',
        amount: 2.0,
        usdValue: 5400,
        timestamp: '2026-09-28T05:42:00Z',
        blockNumber: 20845500,
        network: network,
        status: 'SUCCESS',
        hop: 3,
        direction: 'OUTGOING',
        classification: 'Privacy Pool Deposit (Trace Interrupted)',
        gasUsed: 94000,
        gasPriceGwei: 38,
        provenance: 'DEMO DATA'
      }
    ];

    // Filter by requested hop depth
    const activeTransactions = transactions.filter(tx => tx.hop <= hopDepth);

    // Graph Nodes
    const graphNodes: GraphNode[] = [
      {
        id: reportedAddr,
        label: `${reportedAddr.slice(0, 6)}...${reportedAddr.slice(-4)}`,
        type: 'REPORTED WALLET',
        network: network,
        balance: 0.05,
        asset: 'ETH',
        risk: 'CRITICAL',
        attribution: 'HIGH CONFIDENCE',
        entityName: 'Suspect Collector Wallet',
        hop: 0,
        isReported: true,
        provenance: 'DEMO DATA'
      },
      {
        id: hop1MuleA,
        label: `Mule A (${hop1MuleA.slice(0, 4)}...${hop1MuleA.slice(-4)})`,
        type: 'INTERMEDIARY',
        network: network,
        balance: 0.02,
        asset: 'ETH',
        risk: 'HIGH',
        attribution: 'PROBABLE',
        entityName: 'Intermediary Mule Layer 1',
        hop: 1,
        provenance: 'DEMO DATA'
      },
      {
        id: hop1MuleB,
        label: `Mule B (${hop1MuleB.slice(0, 4)}...${hop1MuleB.slice(-4)})`,
        type: 'INTERMEDIARY',
        network: network,
        balance: 0.03,
        asset: 'ETH',
        risk: 'HIGH',
        attribution: 'PROBABLE',
        entityName: 'Intermediary Mule Layer 1',
        hop: 1,
        provenance: 'DEMO DATA'
      }
    ];

    if (hopDepth >= 2) {
      graphNodes.push(
        {
          id: hop2Consolidation,
          label: `Consolidation (${hop2Consolidation.slice(0, 4)}...${hop2Consolidation.slice(-4)})`,
          type: 'INTERMEDIARY',
          network: network,
          balance: 0.08,
          asset: 'ETH',
          risk: 'HIGH',
          attribution: 'PROBABLE',
          entityName: 'Layering Consolidation Node',
          hop: 2,
          provenance: 'DEMO DATA'
        },
        {
          id: hop2Bridge,
          label: 'Hop Protocol Bridge',
          type: 'BRIDGE',
          network: network,
          balance: 450.2,
          asset: 'ETH',
          risk: 'MEDIUM',
          attribution: 'CONFIRMED LABEL',
          entityName: 'Hop Cross-Chain Router',
          hop: 2,
          provenance: 'EXTERNAL LABEL'
        },
        {
          id: hop2MixerIntermediary,
          label: `Staging (${hop2MixerIntermediary.slice(0, 4)}...${hop2MixerIntermediary.slice(-4)})`,
          type: 'INTERMEDIARY',
          network: network,
          balance: 0.1,
          asset: 'ETH',
          risk: 'CRITICAL',
          attribution: 'PROBABLE',
          entityName: 'Privacy Pool Feeder Wallet',
          hop: 2,
          provenance: 'DEMO DATA'
        }
      );
    }

    if (hopDepth >= 3) {
      graphNodes.push(
        {
          id: hop3BinanceVasp,
          label: 'Binance Global Hot Wallet',
          type: 'EXCHANGE / VASP',
          network: network,
          balance: 14500.0,
          asset: 'ETH',
          risk: 'LOW',
          attribution: 'CONFIRMED LABEL',
          entityName: 'Binance Global (Binance 14)',
          hop: 3,
          provenance: 'EXTERNAL LABEL'
        },
        {
          id: hop3WazirXVasp,
          label: 'WazirX Deposit Sweeper',
          type: 'EXCHANGE / VASP',
          network: network,
          balance: 850.5,
          asset: 'ETH',
          risk: 'LOW',
          attribution: 'HIGH CONFIDENCE',
          entityName: 'WazirX (FIU-IND Reg)',
          hop: 3,
          provenance: 'EXTERNAL LABEL'
        },
        {
          id: hop3TornadoCash,
          label: 'Tornado Cash Pool [Interrupted]',
          type: 'MIXER / TUMBLER',
          network: network,
          balance: 12000.0,
          asset: 'ETH',
          risk: 'CRITICAL',
          attribution: 'CONFIRMED LABEL',
          entityName: 'Tornado Cash 0.1 ETH Pool',
          hop: 3,
          provenance: 'EXTERNAL LABEL'
        }
      );
    }

    // Graph Edges
    const graphEdges: GraphEdge[] = [
      {
        id: 'edge-1',
        source: reportedAddr,
        target: hop1MuleA,
        amount: 6.2,
        asset: 'ETH',
        usdValue: 16740,
        timestamp: '2026-09-28T04:28:10Z',
        txHash: '0x7c63e22419283471928347192847192834719283471928347192834719283471',
        hop: 1,
        classification: 'Fan-Out Transfer',
        provenance: 'DEMO DATA'
      },
      {
        id: 'edge-2',
        source: reportedAddr,
        target: hop1MuleB,
        amount: 6.25,
        asset: 'ETH',
        usdValue: 16875,
        timestamp: '2026-09-28T04:30:00Z',
        txHash: '0x6d54f335192834719283471928347192834719283471928347192834719283471',
        hop: 1,
        classification: 'Fan-Out Transfer',
        provenance: 'DEMO DATA'
      }
    ];

    if (hopDepth >= 2) {
      graphEdges.push(
        {
          id: 'edge-3',
          source: hop1MuleA,
          target: hop2Consolidation,
          amount: 6.18,
          asset: 'ETH',
          usdValue: 16686,
          timestamp: '2026-09-28T04:45:15Z',
          txHash: '0x5e45a44619283471928347192847192834719283471928347192834719283471',
          hop: 2,
          classification: 'Consolidation Hop',
          provenance: 'DEMO DATA'
        },
        {
          id: 'edge-4',
          source: hop1MuleB,
          target: hop2Bridge,
          amount: 15000,
          asset: 'USDT',
          usdValue: 15000,
          timestamp: '2026-09-28T04:52:00Z',
          txHash: '0x4f36b55719283471928347192847192834719283471928347192834719283471',
          hop: 2,
          classification: 'Bridge Lock',
          provenance: 'DEMO DATA'
        },
        {
          id: 'edge-5',
          source: hop1MuleB,
          target: hop2MixerIntermediary,
          amount: 2.1,
          asset: 'ETH',
          usdValue: 5670,
          timestamp: '2026-09-28T05:05:00Z',
          txHash: '0x3a27c66819283471928347192847192834719283471928347192834719283471',
          hop: 2,
          classification: 'Staging Hop',
          provenance: 'DEMO DATA'
        }
      );
    }

    if (hopDepth >= 3) {
      graphEdges.push(
        {
          id: 'edge-6',
          source: hop2Consolidation,
          target: hop3BinanceVasp,
          amount: 4.15,
          asset: 'ETH',
          usdValue: 11205,
          timestamp: '2026-09-28T05:22:10Z',
          txHash: '0x2b18d77919283471928347192847192834719283471928347192834719283471',
          hop: 3,
          classification: 'VASP Inflow',
          provenance: 'DEMO DATA'
        },
        {
          id: 'edge-7',
          source: hop2Consolidation,
          target: hop3WazirXVasp,
          amount: 1.95,
          asset: 'ETH',
          usdValue: 5265,
          timestamp: '2026-09-28T05:30:40Z',
          txHash: '0x1c09e88019283471928347192847192834719283471928347192834719283471',
          hop: 3,
          classification: 'VASP Inflow',
          provenance: 'DEMO DATA'
        },
        {
          id: 'edge-8',
          source: hop2MixerIntermediary,
          target: hop3TornadoCash,
          amount: 2.0,
          asset: 'ETH',
          usdValue: 5400,
          timestamp: '2026-09-28T05:42:00Z',
          txHash: '0x0d90f99119283471928347192847192834719283471928347192834719283471',
          hop: 3,
          classification: 'Mixer Deposit (Interrupted)',
          provenance: 'DEMO DATA'
        }
      );
    }

    // Entity Intelligence
    const entities: EntityIntelligence[] = [
      {
        entityName: 'Binance Global',
        entityType: 'Exchange',
        wallet: hop3BinanceVasp,
        network: network,
        source: 'Public Etherscan Verified Contract & Chain Clustering',
        label: 'Binance 14 (Deposit Sweeper Pool)',
        confidence: 'CONFIRMED LABEL',
        lastVerified: '2026-09-30T12:00:00Z',
        evidence: ['0x2b18d77919283471928347192847192834719283471928347192834719283471'],
        whyExplanation: 'Target wallet is a verified public deposit consolidation node belonging to Binance Global exchange cluster with over 5M on-chain operations.',
        jurisdiction: 'Global / Seychelles',
        leaContactProcedure: 'Serve formal Section 91 CrPC notice / LER portal request referencing deposit TX 0x2b18d779... to retrieve recipient UID, KYC, IP login logs, and linked bank accounts.',
        fiuRegistered: false
      },
      {
        entityName: 'WazirX (Zanmai Labs Pvt Ltd)',
        entityType: 'Exchange',
        wallet: hop3WazirXVasp,
        network: network,
        source: 'FIU-IND Reporting Entity Registry & Proof of Reserves',
        label: 'WazirX Deposit Sweeper Pool',
        confidence: 'HIGH CONFIDENCE',
        lastVerified: '2026-09-29T15:30:00Z',
        evidence: ['0x1c09e88019283471928347192847192834719283471928347192834719283471'],
        whyExplanation: 'Wallet exhibits direct programmatic sweeping behavior into WazirX primary reserve cold/hot storage addresses registered with FIU-India.',
        jurisdiction: 'India (FIU-IND Registration: RE00002819)',
        leaContactProcedure: 'Direct nodal officer intimation under PMLA 2002 via legal@wazirx.com. Request immediate freeze on associated account ID and INR withdrawal bank details.',
        fiuRegistered: true
      },
      {
        entityName: 'Hop Protocol Bridge',
        entityType: 'Bridge',
        wallet: hop2Bridge,
        network: network,
        source: 'DeFi Llama & Hop Protocol Canonical Deployment',
        label: 'Hop L1-L2 Bridge Router',
        confidence: 'CONFIRMED LABEL',
        lastVerified: '2026-09-28T00:00:00Z',
        evidence: ['0x4f36b55719283471928347192847192834719283471928347192834719283471'],
        whyExplanation: 'Contract is the verified canonical lockbox for Hop Protocol cross-chain asset bridging.',
        jurisdiction: 'Decentralized Smart Contract',
        leaContactProcedure: 'Analyze destination chain relayer events to isolate recipient EVM account on target network (Polygon).',
        fiuRegistered: false
      },
      {
        entityName: 'Tornado Cash Mixer',
        entityType: 'Mixer',
        wallet: hop3TornadoCash,
        network: network,
        source: 'OFAC Sanctions List & Ethereum Contract Bytecode',
        label: 'Tornado.Cash 0.1 ETH Pool',
        confidence: 'CONFIRMED LABEL',
        lastVerified: '2026-09-20T00:00:00Z',
        evidence: ['0x0d90f99119283471928347192847192834719283471928347192834719283471'],
        whyExplanation: 'Smart contract uses zk-SNARK cryptographic proofs to sever on-chain transaction linkage between depositors and withdrawers.',
        jurisdiction: 'Sanctioned / Decentralized Protocol',
        leaContactProcedure: 'Forward deposit commitment and relayer gas fee telemetry to CERT-In specialized forensic team for time-correlation heuristic analysis.',
        fiuRegistered: false
      }
    ];

    // Risk Assessment
    const riskAssessment: RiskAssessment = {
      classification: 'CRITICAL',
      confidence: 'HIGH',
      scoreBasis: 'Multi-hop fan-out layering within 15 minutes of victim receipt, rapid exit into multiple exchange deposit gateways, and interaction with a sanctioned privacy mixer.',
      signals: [
        {
          id: 'sig-1',
          name: 'RAPID FUND MOVEMENT',
          observedBehaviour: 'Victim funds were moved to secondary intermediary wallets within 5 minutes 40 seconds of receipt.',
          evidence: ['0x7c63e22419...', '0x6d54f335...'],
          severity: 'HIGH',
          confidence: 'HIGH',
          timestamp: '2026-09-28T04:30:00Z',
          relatedTransactions: ['0x7c63e22419283471928347192847192834719283471928347192834719283471']
        },
        {
          id: 'sig-2',
          name: 'FAN-OUT LAYERING PATTERN',
          observedBehaviour: 'Suspect wallet split 12.5 ETH balance into two equal tranches across distinct intermediary addresses (Mule A and Mule B) to fragment the audit trail.',
          evidence: [hop1MuleA, hop1MuleB],
          severity: 'HIGH',
          confidence: 'HIGH',
          timestamp: '2026-09-28T04:30:00Z',
          relatedTransactions: ['0x7c63e22419...', '0x6d54f335...']
        },
        {
          id: 'sig-3',
          name: 'EXCHANGE DEPOSIT EXIT IDENTIFIED',
          observedBehaviour: 'Trace directly terminates at verified deposit sweepers for Binance Global (4.15 ETH) and WazirX (1.95 ETH).',
          evidence: [hop3BinanceVasp, hop3WazirXVasp],
          severity: 'CRITICAL',
          confidence: 'HIGH',
          timestamp: '2026-09-28T05:30:40Z',
          relatedTransactions: ['0x2b18d779...', '0x1c09e880...']
        },
        {
          id: 'sig-4',
          name: 'CROSS-CHAIN LIQUIDITY BRIDGE LOCK',
          observedBehaviour: '15,000 USDT routed through Hop Protocol bridge router to obscure layer 1 trace onto Polygon network.',
          evidence: [hop2Bridge],
          severity: 'MEDIUM',
          confidence: 'HIGH',
          timestamp: '2026-09-28T04:52:00Z',
          relatedTransactions: ['0x4f36b557...']
        },
        {
          id: 'sig-5',
          name: 'MIXER / TUMBLER INTERACTION',
          observedBehaviour: '2.0 ETH deposited into Tornado Cash zero-knowledge privacy pool, interrupting linear deterministic on-chain trace.',
          evidence: [hop3TornadoCash],
          severity: 'CRITICAL',
          confidence: 'HIGH',
          timestamp: '2026-09-28T05:42:00Z',
          relatedTransactions: ['0x0d90f991...']
        }
      ],
      supportingEvidence: [
        '10 On-chain confirmed transactions with block confirmations > 100',
        'Verified VASP registry match with FIU-India reporting entity database',
        'Direct cryptographic deposit receipt on Binance Global hot wallet 14'
      ],
      limitations: [
        'Branch 3 trace is interrupted at Tornado Cash mixer due to zero-knowledge cryptographic masking',
        'Destination address on Polygon chain requires relayer event parsing',
        'Internal exchange off-chain ledger transfers cannot be observed on public blockchain'
      ],
      disclaimer: 'This assessment is an investigative prioritization signal, not proof of criminal activity.'
    };

    // Evidence Items
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-1',
        investigationId,
        type: 'Wallet',
        title: 'Suspect Collector Wallet',
        identifier: reportedAddr,
        description: 'Reported wallet receiving initial victim proceeds of 12.5 ETH.',
        network: network,
        timestamp: '2026-09-28T04:12:00Z',
        provenance: 'DEMO DATA',
        verified: true,
        chainOfCustody: 'Ingested from NCRP victim complaint reference NCRP-2026-092834-DEL'
      },
      {
        id: 'ev-2',
        investigationId,
        type: 'Transaction Hash',
        title: 'Victim Inflow TX 1 (4.5 ETH)',
        identifier: '0x9a81c0029bfa8192a019823471029384719283471928347192834719283471928',
        description: 'First reported victim fund transfer on Ethereum block 20845100.',
        network: network,
        timestamp: '2026-09-28T04:15:00Z',
        provenance: 'DEMO DATA',
        verified: true,
        chainOfCustody: 'Recorded in block 20845100; verified with SHA-256 state tree'
      },
      {
        id: 'ev-3',
        investigationId,
        type: 'Transaction Hash',
        title: 'Victim Inflow TX 2 (8.0 ETH)',
        identifier: '0x8b72d1139481928347192834719283471928347192834719283471928347192834',
        description: 'Second victim tranche transferred on Ethereum block 20845135.',
        network: network,
        timestamp: '2026-09-28T04:22:30Z',
        provenance: 'DEMO DATA',
        verified: true,
        chainOfCustody: 'Recorded in block 20845135; verified with SHA-256 state tree'
      },
      {
        id: 'ev-4',
        investigationId,
        type: 'Transaction Hash',
        title: 'Hop 1 Layering Outflow A (6.2 ETH)',
        identifier: '0x7c63e22419283471928347192847192834719283471928347192834719283471',
        description: 'Rapid onward fan-out movement to Intermediary Mule Wallet A.',
        network: network,
        timestamp: '2026-09-28T04:28:10Z',
        provenance: 'DEMO DATA',
        verified: true,
        chainOfCustody: 'Recorded in block 20845160'
      },
      {
        id: 'ev-5',
        investigationId,
        type: 'Transaction Hash',
        title: 'Hop 1 Layering Outflow B (6.25 ETH)',
        identifier: '0x6d54f335192834719283471928347192834719283471928347192834719283471',
        description: 'Rapid onward fan-out movement to Intermediary Mule Wallet B.',
        network: network,
        timestamp: '2026-09-28T04:30:00Z',
        provenance: 'DEMO DATA',
        verified: true,
        chainOfCustody: 'Recorded in block 20845168'
      },
      {
        id: 'ev-6',
        investigationId,
        type: 'External Label',
        title: 'Binance Global Deposit Sweeper Registry Match',
        identifier: hop3BinanceVasp,
        description: 'Attribution of target wallet 0x28C6...1d60 to Binance Global Hot Wallet 14.',
        network: network,
        timestamp: '2026-09-30T12:00:00Z',
        provenance: 'EXTERNAL LABEL',
        verified: true,
        chainOfCustody: 'Validated against Etherscan verified smart contract label and exchange cluster taxonomy'
      },
      {
        id: 'ev-7',
        investigationId,
        type: 'External Label',
        title: 'WazirX India FIU Registered Exchange Ingestion',
        identifier: hop3WazirXVasp,
        description: 'Attribution of target wallet 0x5Bdf...68Fe to registered Indian VASP WazirX (Zanmai Labs).',
        network: network,
        timestamp: '2026-09-29T15:30:00Z',
        provenance: 'EXTERNAL LABEL',
        verified: true,
        chainOfCustody: 'Matched with FIU-IND compliance reporting entity directory'
      },
      {
        id: 'ev-8',
        investigationId,
        type: 'Observed Relationship',
        title: 'Privacy Pool Mixer Interruption Record',
        identifier: hop3TornadoCash,
        description: 'Cryptographic trace interrupted at Tornado Cash 0.1 ETH contract pool.',
        network: network,
        timestamp: '2026-09-28T05:42:00Z',
        provenance: 'EXTERNAL LABEL',
        verified: true,
        chainOfCustody: 'Recorded on Ethereum mainnet contract 0xd90e...F31b'
      }
    ];

    // Investigative Recommendations
    const recommendations: Recommendation[] = [
      {
        id: 'rec-1',
        title: 'Emergency Section 91 CrPC Notice to WazirX Compliance',
        reason: 'Hop 3 analysis identified an immediate direct deposit of 1.95 ETH (~INR 5.26 Lakhs) into WazirX deposit gateway (0x5Bdf6476b71f92eD8d85f8670494A1A1Fa1e68Fe). WazirX is an FIU-IND registered reporting entity subject to domestic PMLA jurisdiction.',
        evidence: [
          'TX Hash: 0x1c09e880192834719283471928347192834719283471928347192834719283471',
          'Target Wallet: 0x5Bdf6476b71f92eD8d85f8670494A1A1Fa1e68Fe'
        ],
        priority: 'CRITICAL',
        suggestedAction: 'Serve emergency Section 91 CrPC notice via Nodal LEA email (legal@wazirx.com) requesting KYC documents, linked bank account (IFSC/Account No), login IP addresses, and an immediate lien/freeze on the associated internal account.',
        targetEntity: 'WazirX (Zanmai Labs Pvt Ltd)',
        legalProcess: 'Section 91 Cr.P.C. / PMLA Section 12'
      },
      {
        id: 'rec-2',
        title: 'Serve LEA Law Enforcement Request to Binance Global',
        reason: 'Hop 3 analysis identified 4.15 ETH deposit routed into Binance Hot Wallet 14 (0x28C6c06298d514Db089934071355E5743bf21d60).',
        evidence: [
          'TX Hash: 0x2b18d779192834719283471928347192834719283471928347192834719283471',
          'Target Wallet: 0x28C6c06298d514Db089934071355E5743bf21d60'
        ],
        priority: 'HIGH',
        suggestedAction: 'Submit request through the Binance Law Enforcement Portal (Kodak system) with official police FIR / GD entry reference to retrieve recipient User ID (UID), registered email, IP telemetry, and internal withdrawal trails.',
        targetEntity: 'Binance Global Holdings Ltd',
        legalProcess: 'International Law Enforcement Request / MLAT'
      },
      {
        id: 'rec-3',
        title: 'Cross-Reference Intermediary Mule A on NCRP Portal',
        reason: 'Intermediary Mule Wallet A (0x3A94b1C89F82cD412e091219Af62Dbc099187321) participated in rapid fund fragmentation and may be reused across other victim investment fraud syndicates.',
        evidence: [
          'Wallet: 0x3A94b1C89F82cD412e091219Af62Dbc099187321',
          'Outgoing Volume: 6.18 ETH'
        ],
        priority: 'HIGH',
        suggestedAction: 'Run automated lookup against I4C / NCRP central cybercrime database to check if this address is named in complaints filed across other state police jurisdictions.',
        targetEntity: 'I4C / National Cyber Crime Reporting Portal',
        legalProcess: 'Internal LEA Intelligence Sharing'
      },
      {
        id: 'rec-4',
        title: 'Trace Interruption Protocol & CERT-In Referral for Mixer Deposit',
        reason: '2.0 ETH was routed into Tornado Cash mixer pool on block 20845500. Deterministic on-chain tracing is interrupted.',
        evidence: [
          'TX Hash: 0x0d90f991192834719283471928347192834719283471928347192834719283471',
          'Tornado Cash Contract: 0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b'
        ],
        priority: 'MEDIUM',
        suggestedAction: 'Log cryptographic commitment and timestamp into I4C mixer observation queue. Refer transaction to specialized analytics unit for withdrawal time-correlation clustering.',
        targetEntity: 'CERT-In / Forensic Analytics Unit',
        legalProcess: 'Specialized Cyber Forensics Referral'
      }
    ];

    return {
      walletProfile: reportedProfile,
      transactions: activeTransactions,
      graphNodes,
      graphEdges,
      entities,
      riskAssessment,
      evidence,
      recommendations,
      traceInterrupted: hopDepth >= 3 ? {
        reason: 'Trace interrupted at Tornado Cash 0.1 ETH mixer contract pool. Further deterministic attribution unavailable from currently available on-chain evidence.',
        lastObservableWallet: hop2MixerIntermediary,
        txHash: '0x0d90f991192834719283471928347192834719283471928347192834719283471',
        amount: 2.0,
        asset: 'ETH',
        timestamp: '2026-09-28T05:42:00Z',
        attributionStatus: 'UNKNOWN'
      } : undefined,
      crossChainMovement: hopDepth >= 2 ? {
        sourceChain: 'ETH',
        destinationChain: 'POLYGON',
        bridge: 'Hop Protocol L1-L2 Bridge Router',
        sourceTx: '0x4f36b55719283471928347192847192834719283471928347192834719283471',
        destinationTx: '0x8831a9b201948192834719283471928347192834719283471928347192834719',
        amount: 15000,
        asset: 'USDT',
        timestamp: '2026-09-28T04:52:00Z',
        confidence: 'HIGH CONFIDENCE',
        destinationAttributed: true
      } : undefined
    };
  }
}
