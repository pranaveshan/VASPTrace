import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database.js';

const router = Router();

// GET /api/evidence
router.get('/', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { investigationId, caseId, type } = req.query;

    let query = 'SELECT * FROM evidence WHERE 1=1';
    const params: any[] = [];

    if (investigationId) {
      query += ' AND investigation_id = ?';
      params.push(investigationId);
    }
    if (caseId) {
      query += ' AND case_id = ?';
      params.push(caseId);
    }
    if (type && type !== 'ALL') {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY timestamp DESC';

    const rows = db.prepare(query).all(...params) as any[];
    return res.json(rows.map(ev => ({
      id: ev.id,
      investigationId: ev.investigation_id,
      caseId: ev.case_id,
      type: ev.type,
      title: ev.title,
      identifier: ev.identifier,
      description: ev.description,
      network: ev.network,
      timestamp: ev.timestamp,
      provenance: ev.provenance,
      verified: ev.verified === 1,
      chainOfCustody: ev.chain_of_custody
    })));
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve evidence items', message: err.message });
  }
});

// POST /api/evidence
router.post('/', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { investigationId, caseId, type, title, identifier, description, network, provenance, chainOfCustody } = req.body;

    if (!caseId || !type || !identifier) {
      return res.status(400).json({ error: 'caseId, type, and identifier are required' });
    }

    const id = `ev-${Date.now()}`;
    const timestamp = new Date().toISOString();

    db.prepare(`
      INSERT INTO evidence (
        id, investigation_id, case_id, type, title, identifier, description,
        network, timestamp, provenance, verified, chain_of_custody
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      investigationId || 'MANUAL',
      caseId,
      type,
      title || `${type} Record`,
      identifier,
      description || '',
      network || 'ETH',
      timestamp,
      provenance || 'INVESTIGATOR ANNOTATION',
      1,
      chainOfCustody || 'Manually entered by investigating officer'
    );

    return res.status(201).json({
      id,
      investigationId: investigationId || 'MANUAL',
      caseId,
      type,
      title: title || `${type} Record`,
      identifier,
      description: description || '',
      network: network || 'ETH',
      timestamp,
      provenance: provenance || 'INVESTIGATOR ANNOTATION',
      verified: true,
      chainOfCustody: chainOfCustody || 'Manually entered by investigating officer'
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create evidence record', message: err.message });
  }
});

export default router;
