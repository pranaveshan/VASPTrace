import { getDatabase } from '../db/database.js';
import { DemoDataProvider } from '../providers/DemoDataProvider.js';
import { LiveBlockchainProvider } from '../providers/LiveBlockchainProvider.js';
import { 
  Network, 
  IncidentType, 
  Priority, 
  Investigation,
  DataMode
} from '../types/index.js';
import { EVMAdapter } from '../adapters/EVMAdapter.js';
import { BitcoinAdapter } from '../adapters/BitcoinAdapter.js';
import { TronAdapter } from '../adapters/TronAdapter.js';

export class InvestigationService {
  private demoProvider: DemoDataProvider;
  private liveProvider: LiveBlockchainProvider;

  constructor() {
    this.demoProvider = new DemoDataProvider();
    this.liveProvider = new LiveBlockchainProvider();
  }

  validateWallet(address: string, network: Network) {
    let adapter;
    if (network === 'BTC') {
      adapter = new BitcoinAdapter();
    } else if (network === 'TRON') {
      adapter = new TronAdapter();
    } else {
      adapter = new EVMAdapter(network);
    }
    return adapter.validateAddress(address);
  }

  async runInvestigation(params: {
    caseId: string;
    walletAddress: string;
    network: Network;
    incidentType: IncidentType;
    priority: Priority;
    hopDepth?: number;
    dataMode?: DataMode;
    complaintReference?: string;
    notes?: string;
  }): Promise<Investigation> {
    const db = getDatabase();
    const investigationId = `inv-${Date.now()}`;
    const mode = params.dataMode || 'DEMO';
    const hopDepth = params.hopDepth || 3;
    const nowIso = new Date().toISOString();

    // Step 1 & 2: Validate wallet & network
    const validation = this.validateWallet(params.walletAddress, params.network);
    if (!validation.isValid) {
      throw new Error(`Invalid wallet address: ${validation.error}`);
    }

    // Check or create case in database
    const existingCase = db.prepare('SELECT * FROM cases WHERE case_id = ?').get(params.caseId);
    if (!existingCase) {
      const insertCase = db.prepare(`
        INSERT INTO cases (
          id, case_id, title, incident_type, priority, status, 
          assigned_investigator, complaint_reference, reported_wallet, 
          network, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertCase.run(
        `case-${Date.now()}`,
        params.caseId,
        `Investigation: ${params.walletAddress.slice(0, 8)}... (${params.incidentType})`,
        params.incidentType,
        params.priority,
        'IN_PROGRESS',
        'Lead Forensic Investigator (I4C)',
        params.complaintReference || null,
        validation.formattedAddress,
        params.network,
        params.notes || null,
        nowIso,
        nowIso
      );
    }

    // Step 3-9: Fetch analysis from active Provider
    const provider = mode === 'LIVE' ? this.liveProvider : this.demoProvider;
    const result = await provider.fetchInvestigationData(
      validation.formattedAddress,
      params.network,
      hopDepth,
      params.caseId,
      investigationId,
      params.incidentType
    );

    // Save investigation record
    const insertInv = db.prepare(`
      INSERT INTO investigations (
        id, case_id, wallet_address, network, incident_type, priority, 
        status, current_stage, hop_depth, data_mode, created_at, completed_at, summary_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const summaryPayload = {
      walletProfile: result.walletProfile,
      riskClassification: result.riskAssessment.classification,
      txCount: result.transactions.length,
      nodeCount: result.graphNodes.length,
      edgeCount: result.graphEdges.length,
      traceInterrupted: result.traceInterrupted,
      crossChainMovement: result.crossChainMovement
    };

    insertInv.run(
      investigationId,
      params.caseId,
      validation.formattedAddress,
      params.network,
      params.incidentType,
      params.priority,
      'COMPLETED',
      'Analysis Completed & Evidence Sealed',
      hopDepth,
      mode,
      nowIso,
      new Date().toISOString(),
      JSON.stringify(summaryPayload)
    );

    // Persist Wallet Profile
    if (result.walletProfile) {
      const upsertWallet = db.prepare(`
        INSERT OR REPLACE INTO wallets (
          address, network, first_activity, latest_activity, tx_count,
          incoming_volume, outgoing_volume, current_balance, asset,
          unique_counterparties, known_labels_json, entity_name, entity_type,
          attribution_confidence, risk_classification, provenance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      upsertWallet.run(
        result.walletProfile.address,
        result.walletProfile.network,
        result.walletProfile.firstActivity,
        result.walletProfile.latestActivity,
        result.walletProfile.txCount,
        result.walletProfile.incomingVolume,
        result.walletProfile.outgoingVolume,
        result.walletProfile.currentBalance,
        result.walletProfile.asset,
        result.walletProfile.uniqueCounterparties,
        JSON.stringify(result.walletProfile.knownLabels),
        result.walletProfile.entityName || null,
        result.walletProfile.entityType || null,
        result.walletProfile.attributionConfidence,
        result.walletProfile.riskClassification,
        result.walletProfile.provenance
      );
    }

    // Persist Transactions
    const insertTx = db.prepare(`
      INSERT OR REPLACE INTO transactions (
        hash, investigation_id, from_addr, to_addr, asset, amount, usd_value,
        timestamp, block_number, network, status, hop, direction, classification,
        gas_used, gas_price_gwei, explorer_url, provenance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const tx of result.transactions) {
      insertTx.run(
        tx.hash,
        investigationId,
        tx.from,
        tx.to,
        tx.asset,
        tx.amount,
        tx.usdValue,
        tx.timestamp,
        tx.blockNumber,
        tx.network,
        tx.status,
        tx.hop,
        tx.direction,
        tx.classification,
        tx.gasUsed || null,
        tx.gasPriceGwei || null,
        tx.explorerUrl || null,
        tx.provenance
      );
    }

    // Persist Edges
    const insertEdge = db.prepare(`
      INSERT OR REPLACE INTO transaction_edges (
        id, investigation_id, source_addr, target_addr, amount, asset, usd_value,
        timestamp, tx_hash, hop, classification, provenance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const edge of result.graphEdges) {
      insertEdge.run(
        edge.id,
        investigationId,
        edge.source,
        edge.target,
        edge.amount,
        edge.asset,
        edge.usdValue,
        edge.timestamp,
        edge.txHash,
        edge.hop,
        edge.classification || null,
        edge.provenance
      );
    }

    // Persist Risk Signals
    const insertSignal = db.prepare(`
      INSERT OR REPLACE INTO risk_signals (
        id, investigation_id, name, observed_behaviour, evidence_json, severity,
        confidence, timestamp, related_txs_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const sig of result.riskAssessment.signals) {
      insertSignal.run(
        sig.id,
        investigationId,
        sig.name,
        sig.observedBehaviour,
        JSON.stringify(sig.evidence),
        sig.severity,
        sig.confidence,
        sig.timestamp,
        JSON.stringify(sig.relatedTransactions)
      );
    }

    // Persist Evidence
    const insertEv = db.prepare(`
      INSERT OR REPLACE INTO evidence (
        id, investigation_id, case_id, type, title, identifier, description,
        network, timestamp, provenance, verified, chain_of_custody
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const ev of result.evidence) {
      insertEv.run(
        ev.id,
        investigationId,
        params.caseId,
        ev.type,
        ev.title,
        ev.identifier,
        ev.description,
        ev.network,
        ev.timestamp,
        ev.provenance,
        ev.verified ? 1 : 0,
        ev.chainOfCustody
      );
    }

    // Persist Recommendations
    const insertRec = db.prepare(`
      INSERT OR REPLACE INTO recommendations (
        id, investigation_id, case_id, title, reason, evidence_json, priority,
        suggested_action, target_entity, legal_process
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const rec of result.recommendations) {
      insertRec.run(
        rec.id,
        investigationId,
        params.caseId,
        rec.title,
        rec.reason,
        JSON.stringify(rec.evidence),
        rec.priority,
        rec.suggestedAction,
        rec.targetEntity || null,
        rec.legalProcess || null
      );
    }

    // Log to Audit trail
    const insertAudit = db.prepare(`
      INSERT INTO audit_logs (id, case_id, user_name, action, timestamp, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertAudit.run(
      `aud-${Date.now()}`,
      params.caseId,
      'Forensic Engine',
      'INVESTIGATION_COMPLETED',
      nowIso,
      `Completed ${hopDepth}-hop analysis for wallet ${validation.formattedAddress} on ${params.network} (${mode} mode). Generated ${result.evidence.length} evidence items and ${result.recommendations.length} actionable LEA recommendations.`
    );

    return {
      id: investigationId,
      caseId: params.caseId,
      walletAddress: validation.formattedAddress,
      network: params.network,
      incidentType: params.incidentType,
      priority: params.priority,
      status: 'COMPLETED',
      currentStage: 'Analysis Completed & Evidence Sealed',
      hopDepth,
      dataMode: mode,
      createdAt: nowIso,
      completedAt: new Date().toISOString(),
      walletProfile: result.walletProfile,
      transactions: result.transactions,
      graphNodes: result.graphNodes,
      graphEdges: result.graphEdges,
      entities: result.entities,
      riskAssessment: result.riskAssessment,
      evidence: result.evidence,
      recommendations: result.recommendations,
      traceInterrupted: result.traceInterrupted,
      crossChainMovement: result.crossChainMovement
    };
  }

  getInvestigationById(id: string): Investigation | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM investigations WHERE id = ?').get(id) as any;
    if (!row) return null;

    const txRows = db.prepare('SELECT * FROM transactions WHERE investigation_id = ? ORDER BY timestamp DESC').all(id) as any[];
    const edgeRows = db.prepare('SELECT * FROM transaction_edges WHERE investigation_id = ?').all(id) as any[];
    const signalRows = db.prepare('SELECT * FROM risk_signals WHERE investigation_id = ?').all(id) as any[];
    const evidenceRows = db.prepare('SELECT * FROM evidence WHERE investigation_id = ?').all(id) as any[];
    const recRows = db.prepare('SELECT * FROM recommendations WHERE investigation_id = ?').all(id) as any[];
    const walletRow = db.prepare('SELECT * FROM wallets WHERE address = ? AND network = ?').get(row.wallet_address, row.network) as any;
    const entityRows = db.prepare('SELECT * FROM entities WHERE network = ?').all(row.network) as any[];

    const summary = row.summary_json ? JSON.parse(row.summary_json) : {};

    const transactions = txRows.map(t => ({
      hash: t.hash,
      from: t.from_addr,
      to: t.to_addr,
      asset: t.asset,
      amount: t.amount,
      usdValue: t.usd_value,
      timestamp: t.timestamp,
      blockNumber: t.block_number,
      network: t.network,
      status: t.status,
      hop: t.hop,
      direction: t.direction,
      classification: t.classification,
      gasUsed: t.gas_used,
      gasPriceGwei: t.gas_price_gwei,
      explorerUrl: t.explorer_url,
      provenance: t.provenance
    }));

    const graphEdges = edgeRows.map(e => ({
      id: e.id,
      source: e.source_addr,
      target: e.target_addr,
      amount: e.amount,
      asset: e.asset,
      usdValue: e.usd_value,
      timestamp: e.timestamp,
      txHash: e.tx_hash,
      hop: e.hop,
      classification: e.classification,
      provenance: e.provenance
    }));

    // Reconstruct Graph Nodes from unique endpoints
    const nodeMap = new Map<string, any>();
    if (walletRow) {
      nodeMap.set(walletRow.address, {
        id: walletRow.address,
        label: `${walletRow.address.slice(0, 6)}...${walletRow.address.slice(-4)}`,
        type: 'REPORTED WALLET',
        network: walletRow.network,
        balance: walletRow.current_balance,
        asset: walletRow.asset,
        risk: walletRow.risk_classification,
        attribution: walletRow.attribution_confidence,
        entityName: walletRow.entity_name || 'Suspect Collector Wallet',
        hop: 0,
        isReported: true,
        provenance: walletRow.provenance
      });
    }

    for (const e of graphEdges) {
      if (!nodeMap.has(e.source)) {
        nodeMap.set(e.source, {
          id: e.source,
          label: `${e.source.slice(0, 6)}...${e.source.slice(-4)}`,
          type: 'INTERMEDIARY',
          network: row.network,
          risk: 'HIGH',
          attribution: 'PROBABLE',
          hop: e.hop - 1,
          provenance: e.provenance
        });
      }
      if (!nodeMap.has(e.target)) {
        nodeMap.set(e.target, {
          id: e.target,
          label: `${e.target.slice(0, 6)}...${e.target.slice(-4)}`,
          type: e.hop >= 3 ? 'EXCHANGE / VASP' : 'INTERMEDIARY',
          network: row.network,
          risk: e.hop >= 3 ? 'LOW' : 'HIGH',
          attribution: e.hop >= 3 ? 'CONFIRMED LABEL' : 'PROBABLE',
          hop: e.hop,
          provenance: e.provenance
        });
      }
    }

    const signals = signalRows.map(s => ({
      id: s.id,
      name: s.name,
      observedBehaviour: s.observed_behaviour,
      evidence: JSON.parse(s.evidence_json || '[]'),
      severity: s.severity,
      confidence: s.confidence,
      timestamp: s.timestamp,
      relatedTransactions: JSON.parse(s.related_txs_json || '[]')
    }));

    const evidence = evidenceRows.map(ev => ({
      id: ev.id,
      investigationId: ev.investigation_id,
      type: ev.type,
      title: ev.title,
      identifier: ev.identifier,
      description: ev.description,
      network: ev.network,
      timestamp: ev.timestamp,
      provenance: ev.provenance,
      verified: ev.verified === 1,
      chainOfCustody: ev.chain_of_custody
    }));

    const recommendations = recRows.map(r => ({
      id: r.id,
      title: r.title,
      reason: r.reason,
      evidence: JSON.parse(r.evidence_json || '[]'),
      priority: r.priority,
      suggestedAction: r.suggested_action,
      targetEntity: r.target_entity,
      legalProcess: r.legal_process
    }));

    const entities = entityRows.map(ent => ({
      entityName: ent.entity_name,
      entityType: ent.entity_type,
      wallet: ent.wallet,
      network: ent.network,
      source: ent.source,
      label: ent.label,
      confidence: ent.confidence,
      lastVerified: ent.last_verified,
      evidence: JSON.parse(ent.evidence_json || '[]'),
      whyExplanation: ent.why_explanation,
      jurisdiction: ent.jurisdiction,
      leaContactProcedure: ent.lea_contact_procedure,
      fiuRegistered: ent.fiu_registered === 1
    }));

    return {
      id: row.id,
      caseId: row.case_id,
      walletAddress: row.wallet_address,
      network: row.network,
      incidentType: row.incident_type,
      priority: row.priority,
      status: row.status,
      currentStage: row.current_stage,
      hopDepth: row.hop_depth,
      dataMode: row.data_mode,
      createdAt: row.created_at,
      completedAt: row.completed_at,
      walletProfile: walletRow ? {
        address: walletRow.address,
        network: walletRow.network,
        firstActivity: walletRow.first_activity,
        latestActivity: walletRow.latest_activity,
        txCount: walletRow.tx_count,
        incomingVolume: walletRow.incoming_volume,
        outgoingVolume: walletRow.outgoing_volume,
        currentBalance: walletRow.current_balance,
        asset: walletRow.asset,
        uniqueCounterparties: walletRow.unique_counterparties,
        knownLabels: JSON.parse(walletRow.known_labels_json || '[]'),
        entityName: walletRow.entity_name,
        entityType: walletRow.entity_type,
        attributionConfidence: walletRow.attribution_confidence,
        riskClassification: walletRow.risk_classification,
        provenance: walletRow.provenance
      } : undefined,
      transactions,
      graphNodes: Array.from(nodeMap.values()),
      graphEdges,
      entities,
      riskAssessment: {
        classification: summary.riskClassification || 'CRITICAL',
        confidence: 'HIGH',
        scoreBasis: 'Multi-hop transaction traversal with explainable behavioral signals.',
        signals,
        supportingEvidence: evidence.map(e => `${e.type}: ${e.identifier}`),
        limitations: [
          'Tracing is constrained to configured hop depth.',
          'Interrupted privacy pool branches require zero-knowledge heuristic clustering.'
        ],
        disclaimer: 'This assessment is an investigative prioritization signal, not proof of criminal activity.'
      },
      evidence,
      recommendations,
      traceInterrupted: summary.traceInterrupted,
      crossChainMovement: summary.crossChainMovement
    };
  }

  getRecentInvestigations() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM investigations ORDER BY created_at DESC LIMIT 20').all();
  }
}
