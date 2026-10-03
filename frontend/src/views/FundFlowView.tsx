import React, { useState } from 'react';
import { 
  GitFork, 
  Layers, 
  Clock, 
  Table as TableIcon, 
  AlertTriangle, 
  Building2, 
  ArrowRight,
  Shuffle,
  ShieldAlert,
  Download
} from 'lucide-react';
import { Investigation, GraphNode, GraphEdge, Transaction } from '../types';
import { ForensicsGraph } from '../components/ForensicsGraph';
import { FundFlowTimeline } from '../components/FundFlowTimeline';
import { NodeDrawer } from '../components/NodeDrawer';
import { TransactionDrawer } from '../components/TransactionDrawer';
import { DataTable, Column } from '../components/DataTable';

interface FundFlowViewProps {
  investigation: Investigation;
  onFilterTransactions: (address: string) => void;
}

export const FundFlowView: React.FC<FundFlowViewProps> = ({
  investigation,
  onFilterTransactions
}) => {
  const [activeView, setActiveView] = useState<'graph' | 'timeline' | 'table'>('graph');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const matchedEntity = selectedNode
    ? investigation.entities.find(e => e.wallet.toLowerCase() === selectedNode.id.toLowerCase())
    : null;

  const handleSelectEdge = (edge: GraphEdge) => {
    const tx = investigation.transactions.find(t => t.hash === edge.txHash);
    if (tx) {
      setSelectedTx(tx);
    }
  };

  const hopTableCols: Column<GraphEdge>[] = [
    {
      key: 'hop',
      header: 'Hop Index',
      sortable: true,
      render: (e) => <span className="font-mono font-bold text-blue-700">Hop {e.hop}</span>
    },
    {
      key: 'source',
      header: 'Source Origin Wallet',
      render: (e) => (
        <span className="font-mono text-xs text-slate-800 font-medium select-all" title={e.source}>
          {e.source.slice(0, 10)}...{e.source.slice(-8)}
        </span>
      )
    },
    {
      key: 'target',
      header: 'Destination Target Wallet',
      render: (e) => (
        <span className="font-mono text-xs text-slate-900 font-bold select-all" title={e.target}>
          {e.target.slice(0, 10)}...{e.target.slice(-8)}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Amount (USD)',
      sortable: true,
      render: (e) => (
        <div>
          <div className="font-mono font-bold text-slate-900">{e.amount} {e.asset}</div>
          <div className="text-[10px] font-mono text-slate-500">${e.usdValue.toLocaleString()}</div>
        </div>
      )
    },
    {
      key: 'classification',
      header: 'Hop Classification',
      render: (e) => <span className="font-semibold text-slate-800">{e.classification || 'Layering Transfer'}</span>
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: (e) => <span className="font-mono text-slate-600">{new Date(e.timestamp).toUTCString()}</span>
    }
  ];

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">MULTI-HOP FUND FLOW ANALYSIS</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Interactive multi-layered traversal ({investigation.hopDepth} hops configured &bull; {investigation.graphNodes.length} nodes &bull; {investigation.graphEdges.length} edges)
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 rounded border border-slate-300 p-0.5 font-mono text-xs">
          <button
            onClick={() => setActiveView('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-semibold ${
              activeView === 'graph' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>GRAPH VIEW</span>
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-semibold ${
              activeView === 'timeline' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>TIMELINE VIEW</span>
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-semibold ${
              activeView === 'table' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>HOP TABLE</span>
          </button>
        </div>
      </div>

      {/* Main View Mode Panels */}
      {activeView === 'graph' && (
        <ForensicsGraph
          nodes={investigation.graphNodes}
          edges={investigation.graphEdges}
          onSelectNode={(n) => setSelectedNode(n)}
          onSelectEdge={handleSelectEdge}
          traceInterrupted={investigation.traceInterrupted}
          crossChainMovement={investigation.crossChainMovement}
        />
      )}

      {activeView === 'timeline' && (
        <FundFlowTimeline
          transactions={investigation.transactions}
          nodes={investigation.graphNodes}
          onSelectTransaction={(t) => setSelectedTx(t)}
        />
      )}

      {activeView === 'table' && (
        <DataTable
          data={investigation.graphEdges}
          columns={hopTableCols}
          emptyMessage="No hop records found."
        />
      )}

      {/* Special Forensic Callout Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cross-Chain Movement Callout */}
        {investigation.crossChainMovement && (
          <div className="p-4 rounded bg-teal-50/70 border border-teal-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-teal-700" />
                <h4 className="font-semibold text-xs text-teal-950 uppercase font-mono">
                  CROSS-CHAIN LIQUIDITY BRIDGE MOVEMENT
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded border border-teal-300">
                {investigation.crossChainMovement.confidence}
              </span>
            </div>

            <div className="text-xs text-teal-900 space-y-1 leading-relaxed">
              <div>
                <strong>Bridge Router:</strong> {investigation.crossChainMovement.bridge}
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="px-1.5 py-0.5 bg-teal-100 rounded text-teal-900 font-bold">
                  {investigation.crossChainMovement.sourceChain}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="px-1.5 py-0.5 bg-teal-100 rounded text-teal-900 font-bold">
                  {investigation.crossChainMovement.destinationChain}
                </span>
                <span>({investigation.crossChainMovement.amount} {investigation.crossChainMovement.asset})</span>
              </div>
              <div className="text-[11px] font-mono text-teal-800 pt-1">
                Source TX: {investigation.crossChainMovement.sourceTx.slice(0, 16)}...
              </div>
            </div>
          </div>
        )}

        {/* Trace Interruption Callout */}
        {investigation.traceInterrupted && (
          <div className="p-4 rounded bg-rose-50/70 border border-rose-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                <h4 className="font-semibold text-xs text-rose-950 uppercase font-mono">
                  TRACE INTERRUPTION NOTICE (PRIVACY POOL)
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-300">
                ATTRIBUTION UNKNOWN
              </span>
            </div>

            <p className="text-xs text-rose-900 leading-relaxed">
              {investigation.traceInterrupted.reason}
            </p>

            <div className="text-[11px] font-mono text-rose-800 pt-1 space-y-0.5">
              <div>Last Observable Wallet: <span className="font-bold">{investigation.traceInterrupted.lastObservableWallet}</span></div>
              <div>Interruption TX: <span className="font-bold">{investigation.traceInterrupted.txHash.slice(0, 16)}...</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Drawers */}
      <NodeDrawer
        node={selectedNode}
        entity={matchedEntity}
        onClose={() => setSelectedNode(null)}
        onFilterTransactions={onFilterTransactions}
      />

      <TransactionDrawer
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
