import { getDatabase } from '../db/database.js';
import { EntityIntelligence } from '../types/index.js';

export class EntityAttributionService {
  getAllEntities(networkFilter?: string): EntityIntelligence[] {
    const db = getDatabase();
    let query = 'SELECT * FROM entities';
    const params: any[] = [];
    if (networkFilter && networkFilter !== 'ALL') {
      query += ' WHERE network = ? OR network = "ALL"';
      params.push(networkFilter);
    }
    query += ' ORDER BY entity_name ASC';

    const rows = db.prepare(query).all(...params) as any[];
    return rows.map(ent => ({
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
  }

  lookupWallet(walletAddress: string, network: string): EntityIntelligence | null {
    const db = getDatabase();
    const ent = db.prepare('SELECT * FROM entities WHERE LOWER(wallet) = LOWER(?) AND (network = ? OR network = "ALL")').get(walletAddress, network) as any;
    if (!ent) return null;

    return {
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
    };
  }
}
