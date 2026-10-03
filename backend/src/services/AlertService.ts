import { getDatabase } from '../db/database.js';
import { Alert, Priority } from '../types/index.js';

export class AlertService {
  getAllAlerts(caseId?: string): Alert[] {
    const db = getDatabase();
    let query = 'SELECT * FROM alerts';
    const params: any[] = [];

    if (caseId) {
      query += ' WHERE case_id = ?';
      params.push(caseId);
    }
    query += ' ORDER BY timestamp DESC';

    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      caseId: r.case_id,
      wallet: r.wallet,
      trigger: r.trigger_name,
      severity: r.severity,
      evidence: r.evidence,
      status: r.status,
      timestamp: r.timestamp
    }));
  }

  createAlert(params: {
    caseId: string;
    wallet: string;
    trigger: string;
    severity: Priority;
    evidence: string;
  }): Alert {
    const db = getDatabase();
    const id = `alt-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const nowIso = new Date().toISOString();

    db.prepare(`
      INSERT INTO alerts (id, case_id, wallet, trigger_name, severity, evidence, status, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, params.caseId, params.wallet, params.trigger, params.severity, params.evidence, 'NEW', nowIso);

    return {
      id,
      caseId: params.caseId,
      wallet: params.wallet,
      trigger: params.trigger,
      severity: params.severity,
      evidence: params.evidence,
      status: 'NEW',
      timestamp: nowIso
    };
  }

  updateAlertStatus(alertId: string, status: 'ACKNOWLEDGED' | 'DISMISSED'): boolean {
    const db = getDatabase();
    const res = db.prepare('UPDATE alerts SET status = ? WHERE id = ?').run(status, alertId);
    return res.changes > 0;
  }
}
