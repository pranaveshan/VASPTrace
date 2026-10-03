import React from 'react';
import { Clock, ArrowRight, ShieldAlert, Building2, Shuffle, CheckCircle2 } from 'lucide-react';
import { Transaction, GraphNode } from '../types';
import { StatusBadge } from './StatusBadge';

interface FundFlowTimelineProps {
  transactions: Transaction[];
  nodes: GraphNode[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const FundFlowTimeline: React.FC<FundFlowTimelineProps> = ({
  transactions,
  nodes,
  onSelectTransaction
}) => {
  // Sort chronologically
  const sorted = [...transactions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-semibold text-sm text-slate-900">CHRONOLOGICAL FUND DISPERSION TIMELINE</h3>
          <p className="text-xs text-slate-500 font-mono">Sequential order of observed fund movements across hops</p>
        </div>
        <span className="text-xs font-mono font-medium px-2.5 py-1 bg-slate-100 rounded text-slate-700">
          {sorted.length} Tracked Movements
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {sorted.map((tx, idx) => {
          const isVasp = tx.hop >= 3;
          const isMixer = tx.classification.toLowerCase().includes('mixer') || tx.classification.toLowerCase().includes('privacy');

          return (
            <div
              key={tx.hash}
              onClick={() => onSelectTransaction(tx)}
              className="relative group cursor-pointer"
            >
              {/* Timeline Bullet */}
              <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                isMixer 
                  ? 'border-rose-500 text-rose-600' 
                  : isVasp 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-slate-400 text-slate-600'
              }`}>
                <span className="text-[10px] font-bold font-mono">{tx.hop}</span>
              </div>

              {/* Event Card */}
              <div className="p-3.5 rounded bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {tx.classification}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      Hop {tx.hop}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(tx.timestamp).toUTCString()}</span>
                  </div>
                </div>

                {/* Sender -> Receiver */}
                <div className="flex items-center justify-between text-xs font-mono bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-600 truncate max-w-[200px]" title={tx.from}>
                    {tx.from.slice(0, 8)}...{tx.from.slice(-6)}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-900 font-medium truncate max-w-[200px]" title={tx.to}>
                    {tx.to.slice(0, 8)}...{tx.to.slice(-6)}
                  </span>
                </div>

                {/* Amount & TxID */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {tx.amount} {tx.asset} <span className="text-xs text-slate-500 font-normal">(${tx.usdValue.toLocaleString()})</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 truncate max-w-[240px]">
                    TX: {tx.hash.slice(0, 16)}...
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
