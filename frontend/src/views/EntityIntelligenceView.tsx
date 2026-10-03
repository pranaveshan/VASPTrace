import React, { useState, useEffect } from 'react';
import { Building2, Shield, Search, CheckCircle2, AlertTriangle, ExternalLink, Scale, Copy, Check } from 'lucide-react';
import { EntityIntelligence, Network } from '../types';
import { fetchEntities } from '../api';
import { StatusBadge } from '../components/StatusBadge';

export const EntityIntelligenceView: React.FC = () => {
  const [entities, setEntities] = useState<EntityIntelligence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [networkFilter, setNetworkFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchEntities(networkFilter === 'ALL' ? undefined : networkFilter);
        setEntities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [networkFilter]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = entities.filter(ent => {
    if (typeFilter !== 'ALL' && ent.entityType !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        ent.entityName.toLowerCase().includes(q) ||
        ent.label.toLowerCase().includes(q) ||
        ent.wallet.toLowerCase().includes(q) ||
        (ent.jurisdiction && ent.jurisdiction.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">ENTITY & VASP INTELLIGENCE REGISTRY</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Verified Exchange deposit gateways, FIU-IND registered entities, and LEA subpoena procedures
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200 font-bold">
            FIU-IND COMPLIANCE ACTIVE
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search exchange name, label, deposit address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="Exchange">Exchange</option>
              <option value="Bridge">Bridge</option>
              <option value="Mixer">Mixer</option>
              <option value="DeFi Protocol">DeFi Protocol</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Network:</span>
            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value="ALL">All Networks</option>
              <option value="ETH">ETH</option>
              <option value="POLYGON">POLYGON</option>
              <option value="BSC">BSC</option>
              <option value="BTC">BTC</option>
              <option value="TRON">TRON</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ent, i) => (
          <div
            key={i}
            className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-4 hover:border-blue-300 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{ent.entityName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 font-bold uppercase">
                      {ent.entityType}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{ent.label}</div>
                </div>

                <StatusBadge type="attribution" value={ent.confidence} />
              </div>

              {/* Wallet Address */}
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">On-Chain Designated Wallet</span>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200 font-mono text-xs mt-1">
                  <span className="truncate select-all text-slate-900 font-medium">{ent.wallet}</span>
                  <button
                    onClick={() => handleCopy(ent.wallet, `wallet-${i}`)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 ml-2 flex-shrink-0"
                    title="Copy address"
                  >
                    {copiedId === `wallet-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Jurisdiction & FIU */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px]">Jurisdiction:</span>
                  <div className="font-semibold text-slate-900">{ent.jurisdiction || 'International'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">FIU-IND Status:</span>
                  <div className={`font-bold ${ent.fiuRegistered ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {ent.fiuRegistered ? 'REGISTERED' : 'OVERSEAS'}
                  </div>
                </div>
              </div>

              {/* Attribution Explainability (Why?) */}
              <div className="p-3 bg-slate-100/70 rounded border border-slate-200 space-y-1">
                <div className="font-bold text-[10px] font-mono text-slate-700 uppercase">
                  Attribution Basis & Evidentiary Rationale:
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {ent.whyExplanation}
                </p>
              </div>
            </div>

            {/* LEA Procedure */}
            {ent.leaContactProcedure && (
              <div className="p-3 bg-blue-50/60 rounded border border-blue-200 space-y-1 mt-3">
                <div className="font-bold text-[10px] font-mono text-blue-900 uppercase">
                  Law Enforcement Subpoena & Freeze Protocol
                </div>
                <p className="text-xs text-blue-950 leading-relaxed">
                  {ent.leaContactProcedure}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
