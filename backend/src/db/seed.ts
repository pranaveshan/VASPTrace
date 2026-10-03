import { DatabaseSync } from 'node:sqlite';
import { getDatabase } from './database.js';

export function seedDatabase(db?: DatabaseSync) {
  const database = db || getDatabase();

  const caseCount = database.prepare('SELECT COUNT(*) as count FROM cases').get() as { count: number };
  if (caseCount.count > 0) {
    return; // already seeded
  }

  // Insert Cases
  const insertCase = database.prepare(`
    INSERT INTO cases (
      id, case_id, title, incident_type, priority, status, 
      assigned_investigator, complaint_reference, reported_wallet, 
      network, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCase.run(
    'case-1',
    'I4C-2026-INV-8492',
    'Operation CyberSutra - Multi-Victim Investment Scam',
    'Investment Fraud',
    'CRITICAL',
    'IN_PROGRESS',
    'Insp. Rajesh Sharma (I4C CyTrain Unit)',
    'NCRP-2026-092834-DEL',
    '0x71C2a3628F5c36C059B880bF202bE6325Fe8912e',
    'ETH',
    'Victim lured via Telegram/WhatsApp VIP crypto yield syndicate. 8 victims reported transferring funds into suspect collector wallet.',
    '2026-09-28T10:14:22Z',
    '2026-10-02T16:45:10Z'
  );

  insertCase.run(
    'case-2',
    'I4C-2026-INV-7104',
    'Darknet Extortion & Fake Law Enforcement Phishing',
    'Phishing',
    'HIGH',
    'ACTION_REQUIRED',
    'SI Ananya Sen (Cyber Crime Division)',
    'NCRP-2026-081192-MUM',
    'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    'BTC',
    'Impersonation of customs/police officers demanding crypto settlements to unblock overseas parcel.',
    '2026-09-15T08:30:00Z',
    '2026-09-30T11:20:00Z'
  );

  insertCase.run(
    'case-3',
    'I4C-2026-INV-9921',
    'Industrial Enterprise Ransomware - Data Locker Decryption',
    'Ransomware',
    'CRITICAL',
    'UNDER_REVIEW',
    'DSP Vikramaditya Rathore (CERT-In / I4C)',
    'NCRP-2026-100412-BLR',
    'TYDzsYUE22Dcf3nu7B7H8KvZ9B8qF1yU5C',
    'TRON',
    'Ransomware payload targeting manufacturing ERP systems demanding 150,000 USDT TRC20.',
    '2026-10-01T04:15:00Z',
    '2026-10-03T02:00:00Z'
  );

  // Insert Entities & VASP Intelligence Registry
  const insertEntity = database.prepare(`
    INSERT INTO entities (
      id, entity_name, entity_type, wallet, network, source, label, confidence, 
      last_verified, evidence_json, why_explanation, jurisdiction, lea_contact_procedure, fiu_registered
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEntity.run(
    'ent-1',
    'Binance Global',
    'Exchange',
    '0x28C6c06298d514Db089934071355E5743bf21d60',
    'ETH',
    'Etherscan Verified Contract & Chainalysis Clustering',
    'Binance 14 Hot Wallet / Deposit Aggregator',
    'CONFIRMED LABEL',
    '2026-09-30T12:00:00Z',
    JSON.stringify(['0x8f3c819a02...', '0x992b410c...']),
    'Wallet is an on-chain designated hot wallet and deposit sweeper for Binance exchange, verified across public chain registries and cluster heuristics.',
    'Global / Seychelles',
    'Submit Law Enforcement Request via Kodak / Binance LER Portal with Court Order or Section 91 CrPC notice.',
    0
  );

  insertEntity.run(
    'ent-2',
    'WazirX (Zanmai Labs)',
    'Exchange',
    '0x5Bdf6476b71f92eD8d85f8670494A1A1Fa1e68Fe',
    'ETH',
    'FIU-IND Reporting Entity Registry & Public On-Chain Proof of Reserves',
    'WazirX Deposit Sweeper Pool',
    'HIGH CONFIDENCE',
    '2026-09-29T15:30:00Z',
    JSON.stringify(['0x410aa829...']),
    'Clustered with known WazirX deposit consolidation sweeps and verified against registered FIU-IND reporting addresses.',
    'India (FIU-IND Reg: RE00002819)',
    'Direct nodal officer intimation: legal@wazirx.com / emergency LEA portal under PMLA & Section 91 CrPC.',
    1
  );

  insertEntity.run(
    'ent-3',
    'HTX (Huobi Global)',
    'Exchange',
    '0x1062a747393198f70F71ec65A582423DB7E5ab36',
    'ETH',
    'Nansen & Arkham Verified Entity Tag',
    'HTX Deposit Gateway',
    'CONFIRMED LABEL',
    '2026-09-25T09:00:00Z',
    JSON.stringify(['0x771ac902...']),
    'Directly sweeps funds into Huobi Hot Wallet 6 with signature pattern matching exchange ingestion batching.',
    'Seychelles / St. Vincent',
    'Submit formal request via lawenforcement@htx-inc.com with MLAT / Interpol Red Notice reference.',
    0
  );

  insertEntity.run(
    'ent-4',
    'Tornado Cash 0.1 ETH Router',
    'Mixer',
    '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
    'ETH',
    'OFAC Sanctions & Ethereum Contract Code',
    'Tornado.Cash: Router',
    'CONFIRMED LABEL',
    '2026-09-20T00:00:00Z',
    JSON.stringify(['0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b']),
    'Smart contract bytecode implements zk-SNARK zero-knowledge deposit and withdrawal pools sanctioned under international AML guidelines.',
    'Decentralized / Sanctioned',
    'On-chain attribution interrupted; forward cryptographic commitments to CERT-In / specialized analytics team.',
    0
  );

  insertEntity.run(
    'ent-5',
    'Hop Protocol Bridge',
    'Bridge',
    '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
    'ETH',
    'Hop Protocol Core Deployment Verification',
    'Hop: Bridge L1 L2',
    'CONFIRMED LABEL',
    '2026-09-28T00:00:00Z',
    JSON.stringify(['0x1231DEB6...']),
    'Canonical cross-chain liquidity bridge router for locking L1 assets and minting L2 rollups.',
    'Decentralized Protocol',
    'Query bridge node relayers for destination EVM address signature and relayer fee receipts.',
    0
  );

  // Insert Data Sources Status
  const insertDataSource = database.prepare(`
    INSERT INTO data_sources (
      id, name, type, endpoint, network, status, latency_ms, last_sync, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertDataSource.run('ds-1', 'Ethereum Mainnet RPC (Infura/Alchemy/Local)', 'RPC_NODE', 'https://eth-mainnet.alchemyapi.io/v2/***', 'ETH', 'ONLINE', 42, new Date().toISOString(), 1);
  insertDataSource.run('ds-2', 'Polygon PoS Full Node', 'RPC_NODE', 'https://polygon-mainnet.g.alchemy.com/v2/***', 'POLYGON', 'ONLINE', 38, new Date().toISOString(), 1);
  insertDataSource.run('ds-3', 'BNB Smart Chain Node', 'RPC_NODE', 'https://bsc-dataseed.binance.org', 'BSC', 'ONLINE', 65, new Date().toISOString(), 1);
  insertDataSource.run('ds-4', 'Bitcoin Core Full Node (Electrum/RPC)', 'RPC_NODE', 'http://127.0.0.1:8332', 'BTC', 'ONLINE', 18, new Date().toISOString(), 1);
  insertDataSource.run('ds-5', 'I4C Known Mule Registry & FIU-IND VASP DB', 'REGISTRY', 'local://database/fiu_ind_vasp_registry.db', 'ALL', 'ONLINE', 4, new Date().toISOString(), 1);
  insertDataSource.run('ds-6', 'OFAC / UN Sanctions List Index', 'REGISTRY', 'https://sanctionssearch.ofac.treas.gov', 'ALL', 'ONLINE', 110, new Date().toISOString(), 1);

  // Insert initial audit logs
  const insertAudit = database.prepare(`
    INSERT INTO audit_logs (id, case_id, user_name, action, timestamp, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run('aud-1', 'I4C-2026-INV-8492', 'System / NCRP Gateway', 'CASE_CREATED', '2026-09-28T10:14:22Z', 'Ingested suspect wallet address from NCRP victim complaint reference NCRP-2026-092834-DEL');
  insertAudit.run('aud-2', 'I4C-2026-INV-8492', 'Insp. Rajesh Sharma', 'INVESTIGATION_STARTED', '2026-09-28T10:15:00Z', 'Initiated automated 3-hop forensic trace on Ethereum mainnet');
}
