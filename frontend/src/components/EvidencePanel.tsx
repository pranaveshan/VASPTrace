import React, { useState } from 'react';
import { FileCheck2, Copy, Check, ShieldCheck, Download, Plus, Search } from 'lucide-react';
import { EvidenceItem } from '../types';
import { StatusBadge } from './StatusBadge';

interface EvidencePanelProps {
  evidenceList: EvidenceItem[];
  onAddEvidence?: (item: any) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidenceList, onAddEvidence }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(evidenceList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Evidence_Vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = evidenceList.filter(ev => {
    if (filterType !== 'ALL' && ev.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return ev.title.toLowerCase().includes(q) || ev.identifier.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-sm text-slate-900">EVIDENCE REPOSITORY & CHAIN OF CUSTODY</h3>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Cryptographically sealed artifacts, block headers, and verified attribution registries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-mono font-medium transition-colors border border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT EVIDENCE JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search evidence identifier or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono">
          <span className="text-slate-500 text-[11px]">Type:</span>
          {['ALL', 'Transaction Hash', 'Wallet', 'External Label', 'Observed Relationship'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                filterType === t ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All' : t.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            No evidence records match the selected filter.
          </div>
        ) : (
          filtered.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-200 font-bold text-slate-800">
                    {ev.type}
                  </span>
                  <h4 className="font-semibold text-xs text-slate-900">{ev.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge type="provenance" value={ev.provenance} />
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Identifier */}
              <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 font-mono text-xs">
                <span className="break-all select-all font-medium text-slate-900">{ev.identifier}</span>
                <button
                  onClick={() => handleCopy(ev.identifier, ev.id)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 flex-shrink-0 ml-2"
                  title="Copy identifier"
                >
                  {copiedId === ev.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 leading-relaxed">
                {ev.description}
              </p>

              {/* Chain of Custody */}
              <div className="text-[11px] font-mono text-slate-500 border-t border-slate-200/80 pt-2 flex items-center justify-between">
                <span>Chain of Custody: <strong className="text-slate-700 font-normal">{ev.chainOfCustody}</strong></span>
                <span>{new Date(ev.timestamp).toUTCString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
