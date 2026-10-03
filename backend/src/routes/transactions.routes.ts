import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database.js';

const router = Router();

// GET /api/transactions (with search, pagination, and filters)
router.get('/', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { 
      investigationId, 
      direction, 
      asset, 
      hop, 
      search, 
      limit = '50', 
      offset = '0' 
    } = req.query;

    let query = 'SELECT * FROM transactions WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as count FROM transactions WHERE 1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (investigationId) {
      query += ' AND investigation_id = ?';
      countQuery += ' AND investigation_id = ?';
      params.push(investigationId);
      countParams.push(investigationId);
    }
    if (direction && direction !== 'ALL') {
      query += ' AND direction = ?';
      countQuery += ' AND direction = ?';
      params.push(direction);
      countParams.push(direction);
    }
    if (asset && asset !== 'ALL') {
      query += ' AND asset = ?';
      countQuery += ' AND asset = ?';
      params.push(asset);
      countParams.push(asset);
    }
    if (hop && hop !== 'ALL') {
      query += ' AND hop = ?';
      countQuery += ' AND hop = ?';
      params.push(Number(hop));
      countParams.push(Number(hop));
    }
    if (search) {
      const term = `%${search}%`;
      query += ' AND (hash LIKE ? OR from_addr LIKE ? OR to_addr LIKE ? OR classification LIKE ?)';
      countQuery += ' AND (hash LIKE ? OR from_addr LIKE ? OR to_addr LIKE ? OR classification LIKE ?)';
      params.push(term, term, term, term);
      countParams.push(term, term, term, term);
    }

    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = db.prepare(query).all(...params) as any[];
    const totalCount = (db.prepare(countQuery).get(...countParams) as any)?.count || 0;

    return res.json({
      total: totalCount,
      limit: Number(limit),
      offset: Number(offset),
      transactions: rows.map(t => ({
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
      }))
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch transactions', message: err.message });
  }
});

// GET /api/transactions/:hash
router.get('/:hash', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM transactions WHERE LOWER(hash) = LOWER(?)').get(req.params.hash) as any;
    if (!row) {
      return res.status(404).json({ error: `Transaction ${req.params.hash} not found.` });
    }

    return res.json({
      hash: row.hash,
      investigationId: row.investigation_id,
      from: row.from_addr,
      to: row.to_addr,
      asset: row.asset,
      amount: row.amount,
      usdValue: row.usd_value,
      timestamp: row.timestamp,
      blockNumber: row.block_number,
      network: row.network,
      status: row.status,
      hop: row.hop,
      direction: row.direction,
      classification: row.classification,
      gasUsed: row.gas_used,
      gasPriceGwei: row.gas_price_gwei,
      explorerUrl: row.explorer_url,
      provenance: row.provenance
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve transaction', message: err.message });
  }
});

export default router;
