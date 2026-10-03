import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database.js';

const router = Router();

// GET /api/search?q=...
router.get('/', (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();
    if (!q || q.length < 2) {
      return res.json({ wallets: [], transactions: [], cases: [], entities: [] });
    }

    const db = getDatabase();
    const term = `%${q}%`;

    const wallets = db.prepare(`
      SELECT address, network, entity_name, attribution_confidence, risk_classification, provenance 
      FROM wallets 
      WHERE address LIKE ? OR entity_name LIKE ?
      LIMIT 10
    `).all(term, term);

    const transactions = db.prepare(`
      SELECT hash, from_addr, to_addr, asset, amount, timestamp, network, classification
      FROM transactions 
      WHERE hash LIKE ? OR from_addr LIKE ? OR to_addr LIKE ?
      LIMIT 10
    `).all(term, term, term);

    const cases = db.prepare(`
      SELECT case_id, title, incident_type, priority, status, reported_wallet, network
      FROM cases 
      WHERE case_id LIKE ? OR title LIKE ? OR complaint_reference LIKE ? OR reported_wallet LIKE ?
      LIMIT 10
    `).all(term, term, term, term);

    const entities = db.prepare(`
      SELECT entity_name, entity_type, wallet, network, label, confidence, fiu_registered
      FROM entities 
      WHERE entity_name LIKE ? OR label LIKE ? OR wallet LIKE ?
      LIMIT 10
    `).all(term, term, term);

    return res.json({
      query: q,
      wallets,
      transactions,
      cases,
      entities
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Search failed', message: err.message });
  }
});

export default router;
