import React, { useState } from 'react';
import { 
  WalletCards, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Users, 
  Building2, 
  ShieldAlert, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Investigation } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { DataTable, Column } from '../components/DataTable';

interface WalletIntelligenceViewProps {
  investigation: Investigation;
  onNavigate: (view: string) => void;
  onSelectTransaction: (tx: any) => void;
}

export const WalletIntelligenceView: React.FC<WalletIntelligenceViewProps> = ({
  investigation,
  onNavigate,
  onSelectTransaction
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'counterparties' | 'labels' | 'notes'>('overview');

  const profile = investigation.walletProfile;
  if (!profile) {
    return (
      <div className="p-8 text-center bg-white rounded border border-slate-200 text-slate-500 font-mono text-xs">
        No wallet profile loaded for active investigation.
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract unique counterparties from transactions
  const counterpartiesMap = new Map<string, { address: string; direction: string; txCount: number; volume: number; asset: string }>();
  investigation.transactions.forEach(tx => {
    const peer = tx.direction === 'INCOMING' ? tx.from : tx.to;
    const existing = counterpartiesMap.get(peer) || { address: peer, direction: tx.direction, txCount: 0, volume: 0, asset: tx.asset };
    existing.txCount += 1;
    existing.volume += tx.amount;
    counterpartiesMap.set(peer, existing);
  });
  const counterpartiesList = Array.from(counterpartiesMap.values());

  const counterpartyCols: Column<any>[] = [
    {
      key: 'address',
      header: 'Counterparty Address',
      render: (item) => (
        <span className="font-mono text-xs text-slate-900 font-medium">
          {item.address}
        </span>
      )
    },
    {
      key: 'direction',
      header: 'Relationship',
      render: (item) => (
        <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
          item.direction === 'INCOMING' ? 'text-emerald-700' : 'text-rose-700'
        }`}>
          {item.direction === 'INCOMING' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
          {item.direction === 'INCOMING' ? 'Source Peer' : 'Destination Peer'}
        </span>
      )
    },
    {
      key: 'volume',
      header: 'Observed Transferred Volume',
      render: (item) => (
        <span className="font-mono font-bold text-slate-800">
          {item.volume.toFixed(4)} {item.asset}
        </span>
      )
    },
    {
      key: 'txCount',
      header: 'Transactions',
      render: (item) => <span className="font-mono text-slate-600">{item.txCount} txs</span>
    }
  ];

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header Profile Card */}
      <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
              <WalletCards className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 font-mono tracking-tight">
                  WALLET INTELLIGENCE PROFILE
                </h1>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 font-bold">
                  {profile.network}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                On-chain behavioral telemetry and attribution state
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge type="risk" value={profile.riskClassification} size="md" />
            <StatusBadge type="provenance" value={profile.provenance} size="md" />
          </div>
        </div>

        {/* Address Bar */}
        <div>
          <label className="block text-[11px] font-mono text-slate-500 uppercase font-semibold mb-1">
            Subject Wallet Address
          </label>
          <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded border border-slate-200 font-mono text-sm">
            <span className="break-all select-all font-semibold text-slate-900">{profile.address}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs text-slate-700 transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'COPY ADDRESS'}</span>
            </button>
          </div>
        </div>

        {/* High-Level Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Observable Balance</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {profile.currentBalance} {profile.asset}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Incoming Volume</div>
            <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
              +{profile.incomingVolume} {profile.asset}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Outgoing Volume</div>
            <div className="text-base font-bold font-mono text-rose-700 mt-0.5">
              -{profile.outgoingVolume} {profile.asset}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Total Transactions</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {profile.txCount} txs
            </div>
          </div>
        </div>

        {/* Activity Timestamps & Attribution */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200 pt-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">First Seen</div>
              <div className="text-slate-800">{new Date(profile.firstActivity).toUTCString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Latest Activity</div>
              <div className="text-slate-800">{new Date(profile.latestActivity).toUTCString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Attribution State</div>
              <div>
                <StatusBadge type="attribution" value={profile.attributionConfidence} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-t border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-3 border-b-2 font-mono text-xs font-semibold transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Intelligence Overview
        </button>
        <button
          onClick={() => setActiveTab('counterparties')}
          className={`py-3 px-3 border-b-2 font-mono text-xs font-semibold transition-colors ${
            activeTab === 'counterparties'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Counterparties ({counterpartiesList.length})
        </button>
        <button
          onClick={() => setActiveTab('labels')}
          className={`py-3 px-3 border-b-2 font-mono text-xs font-semibold transition-colors ${
            activeTab === 'labels'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Registry Tags ({profile.knownLabels.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-semibold text-xs text-slate-900 uppercase font-mono">
              Investigation Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Subject wallet <strong>{profile.address}</strong> received <strong>{profile.incomingVolume} {profile.asset}</strong> across {profile.txCount} initial transactions. Behavioral analytics flagged rapid onward dispersal ({((profile.outgoingVolume/profile.incomingVolume)*100).toFixed(1)}% sweep rate), directing funds across multi-hop intermediary mules towards verified VASP deposit addresses.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onNavigate('fundflow')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-mono rounded font-medium text-xs transition-colors"
              >
                <span>OPEN MULTI-HOP FUND FLOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('transactions')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono rounded font-medium text-xs transition-colors border border-slate-300"
              >
                <span>VIEW TRANSACTIONS LEDGER</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-semibold text-xs text-slate-900 uppercase font-mono">
              Observed Behavioral Clusters
            </h3>
            <div className="space-y-2">
              {profile.knownLabels.map((lbl, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="font-medium text-slate-800">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'counterparties' && (
        <DataTable
          data={counterpartiesList}
          columns={counterpartyCols}
          emptyMessage="No direct counterparties recorded."
        />
      )}

      {activeTab === 'labels' && (
        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-semibold text-xs text-slate-900 uppercase font-mono">
            Attributed Registry Tags & Source
          </h3>
          <div className="space-y-2">
            {profile.knownLabels.map((lbl, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{lbl}</div>
                  <div className="text-[11px] font-mono text-slate-500">Source: I4C National Mule Repository & On-Chain Heuristics</div>
                </div>
                <StatusBadge type="attribution" value={profile.attributionConfidence} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
