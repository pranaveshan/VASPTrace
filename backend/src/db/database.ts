import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.resolve(process.cwd(), 'forensics.sqlite');

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    const isNew = !fs.existsSync(DB_PATH);
    dbInstance = new DatabaseSync(DB_PATH);
    
    // Enable WAL mode & foreign keys
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      case_id TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      incident_type TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      assigned_investigator TEXT NOT NULL,
      complaint_reference TEXT,
      reported_wallet TEXT NOT NULL,
      network TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS investigations (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      wallet_address TEXT NOT NULL,
      network TEXT NOT NULL,
      incident_type TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      current_stage TEXT NOT NULL,
      hop_depth INTEGER NOT NULL,
      data_mode TEXT NOT NULL,
      created_at TEXT NOT NULL,
      completed_at TEXT,
      summary_json TEXT,
      FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wallets (
      address TEXT NOT NULL,
      network TEXT NOT NULL,
      first_activity TEXT NOT NULL,
      latest_activity TEXT NOT NULL,
      tx_count INTEGER NOT NULL,
      incoming_volume REAL NOT NULL,
      outgoing_volume REAL NOT NULL,
      current_balance REAL NOT NULL,
      asset TEXT NOT NULL,
      unique_counterparties INTEGER NOT NULL,
      known_labels_json TEXT NOT NULL,
      entity_name TEXT,
      entity_type TEXT,
      attribution_confidence TEXT NOT NULL,
      risk_classification TEXT NOT NULL,
      provenance TEXT NOT NULL,
      PRIMARY KEY (address, network)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      hash TEXT NOT NULL,
      investigation_id TEXT NOT NULL,
      from_addr TEXT NOT NULL,
      to_addr TEXT NOT NULL,
      asset TEXT NOT NULL,
      amount REAL NOT NULL,
      usd_value REAL NOT NULL,
      timestamp TEXT NOT NULL,
      block_number INTEGER NOT NULL,
      network TEXT NOT NULL,
      status TEXT NOT NULL,
      hop INTEGER NOT NULL,
      direction TEXT NOT NULL,
      classification TEXT NOT NULL,
      gas_used REAL,
      gas_price_gwei REAL,
      explorer_url TEXT,
      provenance TEXT NOT NULL,
      PRIMARY KEY (hash, investigation_id)
    );

    CREATE TABLE IF NOT EXISTS transaction_edges (
      id TEXT PRIMARY KEY,
      investigation_id TEXT NOT NULL,
      source_addr TEXT NOT NULL,
      target_addr TEXT NOT NULL,
      amount REAL NOT NULL,
      asset TEXT NOT NULL,
      usd_value REAL NOT NULL,
      timestamp TEXT NOT NULL,
      tx_hash TEXT NOT NULL,
      hop INTEGER NOT NULL,
      classification TEXT,
      provenance TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entities (
      id TEXT PRIMARY KEY,
      entity_name TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      wallet TEXT NOT NULL,
      network TEXT NOT NULL,
      source TEXT NOT NULL,
      label TEXT NOT NULL,
      confidence TEXT NOT NULL,
      last_verified TEXT NOT NULL,
      evidence_json TEXT NOT NULL,
      why_explanation TEXT NOT NULL,
      jurisdiction TEXT,
      lea_contact_procedure TEXT,
      fiu_registered INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS risk_signals (
      id TEXT PRIMARY KEY,
      investigation_id TEXT NOT NULL,
      name TEXT NOT NULL,
      observed_behaviour TEXT NOT NULL,
      evidence_json TEXT NOT NULL,
      severity TEXT NOT NULL,
      confidence TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      related_txs_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      investigation_id TEXT NOT NULL,
      case_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      identifier TEXT NOT NULL,
      description TEXT NOT NULL,
      network TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      provenance TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 1,
      chain_of_custody TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      wallet TEXT NOT NULL,
      trigger_name TEXT NOT NULL,
      severity TEXT NOT NULL,
      evidence TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      investigation_id TEXT NOT NULL,
      case_id TEXT NOT NULL,
      title TEXT NOT NULL,
      reason TEXT NOT NULL,
      evidence_json TEXT NOT NULL,
      priority TEXT NOT NULL,
      suggested_action TEXT NOT NULL,
      target_entity TEXT,
      legal_process TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      previous_value TEXT,
      new_value TEXT,
      details TEXT
    );

    CREATE TABLE IF NOT EXISTS data_sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      network TEXT NOT NULL,
      status TEXT NOT NULL,
      latency_ms INTEGER NOT NULL,
      last_sync TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_investigations_case ON investigations(case_id);
    CREATE INDEX IF NOT EXISTS idx_tx_investigation ON transactions(investigation_id);
    CREATE INDEX IF NOT EXISTS idx_edges_investigation ON transaction_edges(investigation_id);
    CREATE INDEX IF NOT EXISTS idx_evidence_investigation ON evidence(investigation_id);
    CREATE INDEX IF NOT EXISTS idx_entities_wallet ON entities(wallet, network);
    CREATE INDEX IF NOT EXISTS idx_alerts_case ON alerts(case_id);
    CREATE INDEX IF NOT EXISTS idx_audit_case ON audit_logs(case_id);
  `);
}
