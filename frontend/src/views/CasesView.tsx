import React, { useState, useEffect } from 'react';
import { FolderLock, Plus, Filter, Search, Shield, Clock, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Case, CaseStatus, Priority, IncidentType, Network } from '../types';
import { fetchCases, fetchCaseById, createCase, updateCaseStatus } from '../api';
import { StatusBadge } from '../components/StatusBadge';
import { DataTable, Column } from '../components/DataTable';

interface CasesViewProps {
  onSelectCase: (caseId: string) => void;
  onStartInvestigationForWallet: (wallet: string, network: Network, caseId: string, incidentType: IncidentType) => void;
}

export const CasesView: React.FC<CasesViewProps> = ({
  onSelectCase,
  onStartInvestigationForWallet
}) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Selected Case Drawer
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [caseAuditLogs, setCaseAuditLogs] = useState<any[]>([]);
  const [caseInvestigations, setCaseInvestigations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Case Modal State
  const [newCaseId, setNewCaseId] = useState(`I4C-2026-INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newTitle, setNewTitle] = useState('');
  const [newIncidentType, setNewIncidentType] = useState<IncidentType>('Investment Fraud');
  const [newPriority, setNewPriority] = useState<Priority>('CRITICAL');
  const [newInvestigator, setNewInvestigator] = useState('Cyber Forensic Officer (I4C CyTrain)');
  const [newComplaintRef, setNewComplaintRef] = useState('');
  const [newReportedWallet, setNewReportedWallet] = useState('');
  const [newNetwork, setNewNetwork] = useState<Network>('ETH');
  const [newNotes, setNewNotes] = useState('');

  const loadCases = async () => {
    setLoading(true);
    try {
      const data = await fetchCases({
        status: statusFilter,
        priority: priorityFilter,
        search
      });
      setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [statusFilter, priorityFilter, search]);

  const handleRowClick = async (c: Case) => {
    setSelectedCase(c);
    try {
      const details = await fetchCaseById(c.caseId);
      setCaseAuditLogs(details.auditLogs || []);
      setCaseInvestigations(details.investigations || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseId || !newTitle || !newReportedWallet) return;

    try {
      const created = await createCase({
        caseId: newCaseId,
        title: newTitle,
        incidentType: newIncidentType,
        priority: newPriority,
        assignedInvestigator: newInvestigator,
        complaintReference: newComplaintRef,
        reportedWallet: newReportedWallet,
        network: newNetwork,
        notes: newNotes
      });
      setIsModalOpen(false);
      loadCases();
      setSelectedCase(created);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (newStatus: CaseStatus) => {
    if (!selectedCase) return;
    try {
      await updateCaseStatus(selectedCase.caseId, newStatus, 'Investigator update');
      const details = await fetchCaseById(selectedCase.caseId);
      setSelectedCase(details.caseData);
      setCaseAuditLogs(details.auditLogs);
      loadCases();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<Case>[] = [
    {
      key: 'caseId',
      header: 'Case ID',
      sortable: true,
      render: (c) => <span className="font-mono font-bold text-blue-700">{c.caseId}</span>
    },
    {
      key: 'title',
      header: 'Dossier Title',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-semibold text-slate-900">{c.title}</div>
          <div className="text-[11px] font-mono text-slate-500">Ref: {c.complaintReference || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'incidentType',
      header: 'Incident Type',
      sortable: true,
      render: (c) => <span className="font-medium text-slate-800">{c.incidentType}</span>
    },
    {
      key: 'reportedWallet',
      header: 'Reported Wallet Address',
      render: (c) => (
        <span className="font-mono text-xs text-slate-700">
          {c.reportedWallet.slice(0, 8)}...{c.reportedWallet.slice(-6)} ({c.network})
        </span>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (c) => <StatusBadge type="priority" value={c.priority} />
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (c) => <StatusBadge type="status" value={c.status} />
    },
    {
      key: 'createdAt',
      header: 'Date Created',
      sortable: true,
      render: (c) => <span className="font-mono text-slate-600">{new Date(c.createdAt).toLocaleDateString()}</span>
    }
  ];

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">CASE REGISTRY & DOSSIERS</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Centralized National Cyber Crime Reporting Portal (NCRP) linked investigation dossiers
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition-all font-mono text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>NEW INVESTIGATION CASE</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search Case ID, title, complaint reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ACTION_REQUIRED">Action Required</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">P0 - Critical</option>
              <option value="HIGH">P1 - High</option>
              <option value="MEDIUM">P2 - Medium</option>
              <option value="LOW">P3 - Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Data Table */}
      <DataTable
        data={cases}
        columns={columns}
        onRowClick={handleRowClick}
        emptyMessage="No investigation cases found."
      />

      {/* Selected Case Detail Drawer */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-blue-700">{selectedCase.caseId}</span>
                  <StatusBadge type="status" value={selectedCase.status} />
                  <StatusBadge type="priority" value={selectedCase.priority} />
                </div>
                <h3 className="font-semibold text-sm text-slate-900 mt-1">{selectedCase.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-800">
              {/* Primary Suspect Details */}
              <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                  Reported Suspect Wallet
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white rounded border border-slate-200 font-mono text-xs">
                  <span className="font-semibold text-slate-900 break-all select-all">{selectedCase.reportedWallet}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 font-bold uppercase ml-2">
                    {selectedCase.network}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                  <div>Incident Type: <strong className="text-slate-900">{selectedCase.incidentType}</strong></div>
                  <div>Investigator: <strong className="text-slate-900">{selectedCase.assignedInvestigator}</strong></div>
                  <div>Complaint Ref: <strong className="text-slate-900">{selectedCase.complaintReference || 'N/A'}</strong></div>
                  <div>Created: <strong className="text-slate-900">{new Date(selectedCase.createdAt).toLocaleString()}</strong></div>
                </div>

                {selectedCase.notes && (
                  <div className="text-xs text-slate-700 pt-2 border-t border-slate-200 leading-relaxed">
                    <strong>Notes:</strong> {selectedCase.notes}
                  </div>
                )}
              </div>

              {/* Status Update Quick Action */}
              <div className="space-y-2">
                <label className="block font-mono text-[11px] text-slate-600 font-semibold uppercase">
                  Update Investigation Status
                </label>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {(['NEW', 'IN_PROGRESS', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'CLOSED'] as CaseStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-2.5 py-1 rounded border transition-colors ${
                        selectedCase.status === st
                          ? 'bg-blue-600 text-white font-semibold border-blue-700'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Linked Automated Investigations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-slate-900 uppercase font-mono">
                    Linked Forensics Analyses ({caseInvestigations.length})
                  </h4>
                  <button
                    onClick={() => {
                      onStartInvestigationForWallet(
                        selectedCase.reportedWallet,
                        selectedCase.network,
                        selectedCase.caseId,
                        selectedCase.incidentType
                      );
                      setSelectedCase(null);
                    }}
                    className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-800"
                  >
                    + Run New Analysis
                  </button>
                </div>

                {caseInvestigations.length === 0 ? (
                  <div className="p-4 text-center rounded bg-slate-50 border border-slate-200 text-slate-500 font-mono text-xs">
                    No active runs yet for this case. Click &ldquo;Run New Analysis&rdquo; to execute multi-hop trace.
                  </div>
                ) : (
                  caseInvestigations.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => {
                        onSelectCase(inv.id);
                        setSelectedCase(null);
                      }}
                      className="p-3 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-semibold text-slate-900">Run ID: {inv.id}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {inv.hop_depth} Hops &bull; Mode: {inv.data_mode} &bull; {new Date(inv.created_at).toLocaleString()}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {inv.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Immutable Audit Log */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <h4 className="font-semibold text-xs text-slate-900 uppercase font-mono">
                  Immutable Case Audit Trail ({caseAuditLogs.length})
                </h4>
                <div className="space-y-2">
                  {caseAuditLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-bold text-slate-800">{log.action}</span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-700 font-sans text-xs">{log.details}</div>
                      <div className="text-[10px] text-slate-400">Officer / Actor: {log.user}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  onStartInvestigationForWallet(
                    selectedCase.reportedWallet,
                    selectedCase.network,
                    selectedCase.caseId,
                    selectedCase.incidentType
                  );
                  setSelectedCase(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-mono font-semibold"
              >
                OPEN IN INVESTIGATION WORKSPACE
              </button>

              <button
                onClick={() => setSelectedCase(null)}
                className="px-3 py-2 border border-slate-300 rounded text-xs font-medium hover:bg-slate-100 text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 uppercase font-mono">
                CREATE NEW INVESTIGATION DOSSIER
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">Case ID *</label>
                  <input
                    type="text"
                    required
                    value={newCaseId}
                    onChange={(e) => setNewCaseId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">Complaint Ref</label>
                  <input
                    type="text"
                    value={newComplaintRef}
                    onChange={(e) => setNewComplaintRef(e.target.value)}
                    placeholder="NCRP-..."
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">Dossier Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Operation CryptoNet - Task Scam"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">Reported Wallet Address *</label>
                <input
                  type="text"
                  required
                  value={newReportedWallet}
                  onChange={(e) => setNewReportedWallet(e.target.value)}
                  placeholder="0x... / bc1..."
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">Network</label>
                  <select
                    value={newNetwork}
                    onChange={(e) => setNewNetwork(e.target.value as Network)}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-mono"
                  >
                    <option value="ETH">ETH</option>
                    <option value="POLYGON">POLYGON</option>
                    <option value="BSC">BSC</option>
                    <option value="BTC">BTC</option>
                    <option value="TRON">TRON</option>
                    <option value="ARBITRUM">ARBITRUM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">Incident Type</label>
                  <select
                    value={newIncidentType}
                    onChange={(e) => setNewIncidentType(e.target.value as IncidentType)}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs"
                  >
                    <option value="Investment Fraud">Investment Fraud</option>
                    <option value="Task Fraud">Task Fraud</option>
                    <option value="Phishing">Phishing</option>
                    <option value="Ransomware">Ransomware</option>
                    <option value="Sextortion">Sextortion</option>
                    <option value="Darknet-related Fraud">Darknet Fraud</option>
                    <option value="Organized Cyber Fraud">Organized Fraud</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-mono"
                  >
                    <option value="CRITICAL">P0 - Critical</option>
                    <option value="HIGH">P1 - High</option>
                    <option value="MEDIUM">P2 - Medium</option>
                    <option value="LOW">P3 - Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">Assigned Investigator</label>
                <input
                  type="text"
                  value={newInvestigator}
                  onChange={(e) => setNewInvestigator(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">Case Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold font-mono"
                >
                  CREATE CASE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
