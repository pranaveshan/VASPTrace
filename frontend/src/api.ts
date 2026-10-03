import { 
  Investigation, 
  Case, 
  Wallet, 
  Transaction, 
  EntityIntelligence, 
  EvidenceItem, 
  Alert, 
  Network, 
  IncidentType, 
  Priority,
  DataMode
} from './types';

const API_BASE = '/api';

export async function fetchInvestigations(): Promise<Investigation[]> {
  const res = await fetch(`${API_BASE}/investigations`);
  if (!res.ok) throw new Error('Failed to fetch investigations list');
  return res.json();
}

export async function fetchInvestigationById(id: string): Promise<Investigation> {
  const res = await fetch(`${API_BASE}/investigations/${id}`);
  if (!res.ok) throw new Error(`Investigation ${id} not found`);
  return res.json();
}

export async function startInvestigation(payload: {
  caseId: string;
  walletAddress: string;
  network: Network;
  incidentType: IncidentType;
  priority: Priority;
  hopDepth: number;
  dataMode: DataMode;
  complaintReference?: string;
  notes?: string;
}): Promise<Investigation> {
  const res = await fetch(`${API_BASE}/investigations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Investigation analysis failed');
  }
  return res.json();
}

export async function validateAddress(address: string, network: Network): Promise<{ isValid: boolean; formattedAddress?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/investigations/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, network })
  });
  return res.json();
}

export async function fetchCases(filter?: { status?: string; priority?: string; incidentType?: string; search?: string }): Promise<Case[]> {
  const params = new URLSearchParams();
  if (filter?.status) params.append('status', filter.status);
  if (filter?.priority) params.append('priority', filter.priority);
  if (filter?.incidentType) params.append('incidentType', filter.incidentType);
  if (filter?.search) params.append('search', filter.search);

  const res = await fetch(`${API_BASE}/cases?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch cases');
  return res.json();
}

export async function fetchCaseById(id: string): Promise<{ caseData: Case; auditLogs: any[]; investigations: any[] }> {
  const res = await fetch(`${API_BASE}/cases/${id}`);
  if (!res.ok) throw new Error(`Case ${id} not found`);
  return res.json();
}

export async function createCase(payload: {
  caseId: string;
  title: string;
  incidentType: IncidentType;
  priority: Priority;
  assignedInvestigator: string;
  complaintReference?: string;
  reportedWallet: string;
  network: Network;
  notes?: string;
}): Promise<Case> {
  const res = await fetch(`${API_BASE}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create case');
  return res.json();
}

export async function updateCaseStatus(caseId: string, status: string, notes?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/cases/${caseId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes, user: 'Investigator' })
  });
  if (!res.ok) throw new Error('Failed to update case status');
}

export async function fetchWallet(address: string, network?: string): Promise<Wallet> {
  const res = await fetch(`${API_BASE}/wallets/${address}${network ? `?network=${network}` : ''}`);
  if (!res.ok) throw new Error('Wallet not found');
  return res.json();
}

export async function fetchTransactions(params?: {
  investigationId?: string;
  direction?: string;
  asset?: string;
  hop?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ total: number; limit: number; offset: number; transactions: Transaction[] }> {
  const q = new URLSearchParams();
  if (params?.investigationId) q.append('investigationId', params.investigationId);
  if (params?.direction) q.append('direction', params.direction);
  if (params?.asset) q.append('asset', params.asset);
  if (params?.hop) q.append('hop', params.hop);
  if (params?.search) q.append('search', params.search);
  if (params?.limit) q.append('limit', params.limit.toString());
  if (params?.offset) q.append('offset', params.offset.toString());

  const res = await fetch(`${API_BASE}/transactions?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function fetchEntities(network?: string): Promise<EntityIntelligence[]> {
  const res = await fetch(`${API_BASE}/entities${network ? `?network=${network}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch entities');
  return res.json();
}

export async function fetchEvidence(investigationId?: string, caseId?: string): Promise<EvidenceItem[]> {
  const q = new URLSearchParams();
  if (investigationId) q.append('investigationId', investigationId);
  if (caseId) q.append('caseId', caseId);

  const res = await fetch(`${API_BASE}/evidence?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch evidence');
  return res.json();
}

export async function createEvidence(payload: any): Promise<EvidenceItem> {
  const res = await fetch(`${API_BASE}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to add evidence record');
  return res.json();
}

export async function fetchAlerts(caseId?: string): Promise<Alert[]> {
  const res = await fetch(`${API_BASE}/alerts${caseId ? `?caseId=${caseId}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function updateAlertStatus(alertId: string, status: 'ACKNOWLEDGED' | 'DISMISSED'): Promise<void> {
  const res = await fetch(`${API_BASE}/alerts/${alertId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update alert');
}

export async function fetchReport(investigationId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/reports/${investigationId}`);
  if (!res.ok) throw new Error('Failed to generate report');
  return res.json();
}

export async function fetchSystemHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/system/health`);
  if (!res.ok) throw new Error('Failed to fetch system health');
  return res.json();
}

export async function fetchDataSources(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/system/data-sources`);
  if (!res.ok) throw new Error('Failed to fetch data sources');
  return res.json();
}

export async function globalSearch(q: string): Promise<any> {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}
