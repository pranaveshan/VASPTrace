import { getDatabase } from '../db/database.js';
import { Case, CaseStatus, Priority, IncidentType, Network, AuditLog } from '../types/index.js';

export class CaseService {
  getAllCases(filter?: {
    status?: string;
    priority?: string;
    incidentType?: string;
    search?: string;
  }): Case[] {
    const db = getDatabase();
    let query = 'SELECT * FROM cases WHERE 1=1';
    const params: any[] = [];

    if (filter?.status && filter.status !== 'ALL') {
      query += ' AND status = ?';
      params.push(filter.status);
    }
    if (filter?.priority && filter.priority !== 'ALL') {
      query += ' AND priority = ?';
      params.push(filter.priority);
    }
    if (filter?.incidentType && filter.incidentType !== 'ALL') {
      query += ' AND incident_type = ?';
      params.push(filter.incidentType);
    }
    if (filter?.search) {
      query += ' AND (case_id LIKE ? OR title LIKE ? OR reported_wallet LIKE ? OR complaint_reference LIKE ?)';
      const term = `%${filter.search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      caseId: r.case_id,
      title: r.title,
      incidentType: r.incident_type,
      priority: r.priority,
      status: r.status,
      assignedInvestigator: r.assigned_investigator,
      complaintReference: r.complaint_reference,
      reportedWallet: r.reported_wallet,
      network: r.network,
      notes: r.notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  }

  getCaseById(caseId: string): { caseData: Case | null; auditLogs: AuditLog[]; investigations: any[] } {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM cases WHERE case_id = ? OR id = ?').get(caseId, caseId) as any;
    if (!row) {
      return { caseData: null, auditLogs: [], investigations: [] };
    }

    const auditRows = db.prepare('SELECT * FROM audit_logs WHERE case_id = ? ORDER BY timestamp DESC').all(row.case_id) as any[];
    const invRows = db.prepare('SELECT id, wallet_address, network, incident_type, priority, status, hop_depth, data_mode, created_at FROM investigations WHERE case_id = ? ORDER BY created_at DESC').all(row.case_id) as any[];

    const caseData: Case = {
      id: row.id,
      caseId: row.case_id,
      title: row.title,
      incidentType: row.incident_type,
      priority: row.priority,
      status: row.status,
      assignedInvestigator: row.assigned_investigator,
      complaintReference: row.complaint_reference,
      reportedWallet: row.reported_wallet,
      network: row.network,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    const auditLogs: AuditLog[] = auditRows.map(a => ({
      id: a.id,
      caseId: a.case_id,
      user: a.user_name,
      action: a.action,
      timestamp: a.timestamp,
      previousValue: a.previous_value,
      newValue: a.new_value,
      details: a.details
    }));

    return { caseData, auditLogs, investigations: invRows };
  }

  createCase(params: {
    caseId: string;
    title: string;
    incidentType: IncidentType;
    priority: Priority;
    assignedInvestigator: string;
    complaintReference?: string;
    reportedWallet: string;
    network: Network;
    notes?: string;
  }): Case {
    const db = getDatabase();
    const nowIso = new Date().toISOString();
    const id = `case-${Date.now()}`;

    const stmt = db.prepare(`
      INSERT INTO cases (
        id, case_id, title, incident_type, priority, status,
        assigned_investigator, complaint_reference, reported_wallet,
        network, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      params.caseId,
      params.title,
      params.incidentType,
      params.priority,
      'NEW',
      params.assignedInvestigator,
      params.complaintReference || null,
      params.reportedWallet,
      params.network,
      params.notes || null,
      nowIso,
      nowIso
    );

    // Audit log
    const auditStmt = db.prepare(`
      INSERT INTO audit_logs (id, case_id, user_name, action, timestamp, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    auditStmt.run(
      `aud-${Date.now()}`,
      params.caseId,
      params.assignedInvestigator || 'System',
      'CASE_CREATED',
      nowIso,
      `Case initiated for suspect wallet ${params.reportedWallet} (${params.network}) under ${params.incidentType}`
    );

    return {
      id,
      caseId: params.caseId,
      title: params.title,
      incidentType: params.incidentType,
      priority: params.priority,
      status: 'NEW',
      assignedInvestigator: params.assignedInvestigator,
      complaintReference: params.complaintReference,
      reportedWallet: params.reportedWallet,
      network: params.network,
      notes: params.notes,
      createdAt: nowIso,
      updatedAt: nowIso
    };
  }

  updateCaseStatus(caseId: string, status: CaseStatus, user: string, notes?: string): boolean {
    const db = getDatabase();
    const current = db.prepare('SELECT status FROM cases WHERE case_id = ?').get(caseId) as any;
    if (!current) return false;

    const nowIso = new Date().toISOString();
    db.prepare('UPDATE cases SET status = ?, updated_at = ?, notes = COALESCE(?, notes) WHERE case_id = ?')
      .run(status, nowIso, notes || null, caseId);

    db.prepare(`
      INSERT INTO audit_logs (id, case_id, user_name, action, timestamp, previous_value, new_value, details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `aud-${Date.now()}`,
      caseId,
      user,
      'STATUS_CHANGED',
      nowIso,
      current.status,
      status,
      notes || `Status updated from ${current.status} to ${status}`
    );

    return true;
  }
}
