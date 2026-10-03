import React from 'react';
import { X, Copy, Check, Shield, Building2, AlertTriangle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { GraphNode, EntityIntelligence } from '../types';
import { StatusBadge } from './StatusBadge';

interface NodeDrawerProps {
  node: GraphNode | null;
  entity?: EntityIntelligence | null;
  onClose: () => void;
  onFilterTransactions: (address: string) => void;
}

export const NodeDrawer: React.FC<NodeDrawerProps> = ({
  node,
  entity,
  onClose,
  onFilterTransactions
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  if (!node) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(node.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-sm text-slate-900">NODE INTELLIGENCE DOSSIER</h3>
              <p className="text-[11px] font-mono text-slate-500">Hop: {node.hop} &bull; Type: {node.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-800">
          {/* Node Identity Card */}
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-slate-900">{node.entityName || node.type}</span>
              <StatusBadge type="risk" value={node.risk} />
            </div>

            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase">Wallet Address</div>
              <div className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-slate-200 mt-1 font-mono text-xs">
                <span className="break-all select-all font-medium text-slate-900">{node.id}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 text-slate-500 hover:text-slate-900 flex-shrink-0"
                  title="Copy address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-slate-500 font-mono text-[11px]">Attribution:</span>{' '}
                <StatusBadge type="attribution" value={node.attribution} />
              </div>
              <StatusBadge type="provenance" value={node.provenance} />
            </div>
          </div>

          {/* Observed Balance */}
          {node.balance !== undefined && (
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Observable On-Chain Balance</div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                {node.balance} {node.asset || 'ETH'}
              </div>
            </div>
          )}

          {/* VASP / Entity Details if present */}
          {entity && (
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-700" />
                <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-wide">
                  VASP / Registered Entity Profile
                </h4>
              </div>

              <div className="p-3 bg-blue-50/50 rounded border border-blue-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-mono">Entity Name:</span>
                  <span className="font-semibold text-slate-900">{entity.entityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-mono">Jurisdiction:</span>
                  <span className="font-mono text-slate-800">{entity.jurisdiction || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-mono">FIU-IND Registered:</span>
                  <span className={`font-semibold font-mono ${entity.fiuRegistered ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {entity.fiuRegistered ? 'YES (Registered Reporting Entity)' : 'NO / Overseas'}
                  </span>
                </div>
              </div>

              {/* Attribution Explainability "WHY?" */}
              <div className="p-3 bg-slate-100 rounded border border-slate-200 space-y-1">
                <div className="font-semibold text-[11px] font-mono text-slate-700 uppercase flex items-center gap-1">
                  <span>Attribution Basis (Why?):</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {entity.whyExplanation}
                </p>
              </div>

              {/* LEA Procedure */}
              {entity.leaContactProcedure && (
                <div className="p-3 bg-amber-50/70 rounded border border-amber-200 space-y-1">
                  <div className="font-semibold text-[11px] font-mono text-amber-900 uppercase">
                    Law Enforcement Contact & Preservation Procedure
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    {entity.leaContactProcedure}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onFilterTransactions(node.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-medium transition-colors"
          >
            <span>Filter Transactions for this Wallet</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2 border border-slate-300 rounded text-xs font-medium hover:bg-slate-100 text-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
