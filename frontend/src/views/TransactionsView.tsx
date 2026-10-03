import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Search, Filter, Download, ExternalLink, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction, Investigation } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { DataTable, Column } from '../components/DataTable';
import { TransactionDrawer } from '../components/TransactionDrawer';

interface TransactionsViewProps {
  investigation: Investigation;
  filterAddress?: string | null;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  investigation,
  filterAddress
}) => {
  const [search, setSearch] = useState<string>(filterAddress || '');
  const [directionFilter, setDirectionFilter] = useState<string>('ALL');
  const [hopFilter, setHopFilter] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    if (filterAddress) {
      setSearch(filterAddress);
    }
  }, [filterAddress]);

  const filteredTransactions = investigation.transactions.filter((tx) => {
    if (directionFilter !== 'ALL' && tx.direction !== directionFilter) return false;
    if (hopFilter !== 'ALL' && tx.hop !== Number(hopFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        tx.hash.toLowerCase().includes(q) ||
        tx.from.toLowerCase().includes(q) ||
        tx.to.toLowerCase().includes(q) ||
        tx.classification.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'TxHash', 'Direction', 'From', 'To', 'Amount', 'Asset', 'USD_Value', 'Hop', 'Classification', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.timestamp,
      t.hash,
      t.direction,
      t.from,
      t.to,
      t.amount,
      t.asset,
      t.usdValue,
      t.hop,
      `"${t.classification}"`,
      t.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Transactions_Ledger_${investigation.caseId}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp (UTC)',
      sortable: true,
      render: (t) => (
        <span className="font-mono text-xs text-slate-700">
          {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} &bull; {new Date(t.timestamp).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'hash',
      header: 'Transaction Hash',
      render: (t) => (
        <span className="font-mono text-xs font-medium text-blue-700 select-all" title={t.hash}>
          {t.hash.slice(0, 10)}...{t.hash.slice(-8)}
        </span>
      )
    },
    {
      key: 'direction',
      header: 'Direction',
      sortable: true,
      render: (t) => (
        <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
          t.direction === 'INCOMING' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {t.direction === 'INCOMING' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
          {t.direction}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Amount (USD Value)',
      sortable: true,
      render: (t) => (
        <div>
          <div className="font-mono font-bold text-slate-900 text-xs">
            {t.amount} {t.asset}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            ≈ ${t.usdValue.toLocaleString()}
          </div>
        </div>
      )
    },
    {
      key: 'hop',
      header: 'Hop Index',
      sortable: true,
      render: (t) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
          Hop {t.hop}
        </span>
      )
    },
    {
      key: 'classification',
      header: 'Forensic Classification',
      render: (t) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs">{t.classification}</div>
          <div className="text-[10px] font-mono text-slate-400">Block #{t.blockNumber}</div>
        </div>
      )
    },
    {
      key: 'provenance',
      header: 'Provenance',
      render: (t) => <StatusBadge type="provenance" value={t.provenance} />
    }
  ];

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">TRANSACTIONS FORENSIC LEDGER</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Cryptographic ledger entries, gas consumption, and Hop relationships ({investigation.transactions.length} total entries)
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded font-mono font-medium text-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search tx hash, address, classification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Direction:</span>
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value="ALL">All Directions</option>
              <option value="INCOMING">Incoming</option>
              <option value="OUTGOING">Outgoing</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Hop:</span>
            <select
              value={hopFilter}
              onChange={(e) => setHopFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value="ALL">All Hops</option>
              <option value="0">Hop 0 (Reported Inflows)</option>
              <option value="1">Hop 1 (Mule Layer)</option>
              <option value="2">Hop 2 (Consolidation/Bridge)</option>
              <option value="3">Hop 3 (VASP/Mixer)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <DataTable
        data={filteredTransactions}
        columns={columns}
        onRowClick={(tx) => setSelectedTx(tx)}
        emptyMessage="No transactions matching filter criteria."
      />

      {/* Drawer */}
      <TransactionDrawer
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
