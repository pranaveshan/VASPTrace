import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database.js';

const router = Router();

// GET /api/wallets/:address
router.get('/:address', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { network } = req.query;
    let query = 'SELECT * FROM wallets WHERE LOWER(address) = LOWER(?)';
    const params: any[] = [req.params.address];

    if (network) {
      query += ' AND network = ?';
      params.push(network);
    }

    const row = db.prepare(query).get(...params) as any;
    if (!row) {
      return res.status(404).json({ error: `Wallet ${req.params.address} not found in database registry.` });
    }

    return res.json({
      address: row.address,
      network: row.network,
      firstActivity: row.first_activity,
      latestActivity: row.latest_activity,
      txCount: row.tx_count,
      incomingVolume: row.incoming_volume,
      outgoingVolume: row.outgoing_volume,
      currentBalance: row.current_balance,
      asset: row.asset,
      uniqueCounterparties: row.unique_counterparties,
      knownLabels: JSON.parse(row.known_labels_json || '[]'),
      entityName: row.entity_name,
      entityType: row.entity_type,
      attributionConfidence: row.attribution_confidence,
      riskClassification: row.risk_classification,
      provenance: row.provenance
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve wallet profile', message: err.message });
  }
});

// GET /api/wallets/:address/transactions
router.get('/:address/transactions', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const rows = db.prepare(`
      SELECT * FROM transactions 
      WHERE LOWER(from_addr) = LOWER(?) OR LOWER(to_addr) = LOWER(?)
      ORDER BY timestamp DESC
    `).all(req.params.address, req.params.address) as any[];

    return res.json(rows.map(t => ({
      hash: t.hash,
      investigationId: t.investigation_id,
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
    })));
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve wallet transactions', message: err.message });
  }
});

export default router;
