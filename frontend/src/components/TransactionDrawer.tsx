import React from 'react';
import { X, ExternalLink, Copy, Check, ArrowRight, Shield, Clock, Hash, Layers } from 'lucide-react';
import { Transaction } from '../types';
import { StatusBadge } from './StatusBadge';

interface TransactionDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({ transaction, onClose }) => {
  const [copied, setCopied] = React.useState<string | null>(null);

  if (!transaction) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-sm text-slate-900">TRANSACTION FORENSIC DOSSIER</h3>
              <p className="text-[11px] font-mono text-slate-500">Hop Level: {transaction.hop} &bull; Network: {transaction.network}</p>
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
          {/* Provenance & Classification */}
          <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase">Forensic Classification</div>
              <div className="font-semibold text-slate-900 text-sm mt-0.5">{transaction.classification}</div>
            </div>
            <StatusBadge type="provenance" value={transaction.provenance} />
          </div>

          {/* Transaction Hash */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1">Transaction Hash (TxID)</label>
            <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded border border-slate-200 font-mono text-xs break-all">
              <span className="flex-1 select-all">{transaction.hash}</span>
              <button
                onClick={() => handleCopy(transaction.hash, 'hash')}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors flex-shrink-0"
                title="Copy Hash"
              >
                {copied === 'hash' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Movement Flow */}
          <div className="grid grid-cols-1 gap-3 p-3 bg-slate-50 rounded border border-slate-200">
            <div>
              <span className="text-[11px] font-mono text-slate-500">FROM ADDRESS:</span>
              <div className="flex items-center justify-between mt-1 font-mono text-xs">
                <span className="break-all select-all font-medium text-slate-900">{transaction.from}</span>
                <button
                  onClick={() => handleCopy(transaction.from, 'from')}
                  className="p-1 text-slate-500 hover:text-slate-900"
                >
                  {copied === 'from' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center my-1 text-slate-400">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-500">TO ADDRESS:</span>
              <div className="flex items-center justify-between mt-1 font-mono text-xs">
                <span className="break-all select-all font-medium text-slate-900">{transaction.to}</span>
                <button
                  onClick={() => handleCopy(transaction.to, 'to')}
                  className="p-1 text-slate-500 hover:text-slate-900"
                >
                  {copied === 'to' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Financials & Block Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Transfer Amount</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {transaction.amount} {transaction.asset}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                ≈ ${transaction.usdValue.toLocaleString()} USD
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-[11px] font-mono text-slate-500 uppercase">Block Height</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                #{transaction.blockNumber.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Status: {transaction.status}
              </div>
            </div>
          </div>

          {/* Timestamp & Gas */}
          <div className="space-y-2 border-t border-slate-200 pt-3">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-mono">Timestamp (UTC):</span>
              <span className="font-mono text-slate-800">{new Date(transaction.timestamp).toUTCString()}</span>
            </div>
            {transaction.gasUsed && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-mono">Gas Consumed:</span>
                <span className="font-mono text-slate-800">{transaction.gasUsed.toLocaleString()} units</span>
              </div>
            )}
            {transaction.gasPriceGwei && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-mono">Gas Price:</span>
                <span className="font-mono text-slate-800">{transaction.gasPriceGwei} Gwei</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-mono">Hop Index:</span>
              <span className="font-mono font-semibold text-blue-700">Hop {transaction.hop}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {transaction.explorerUrl ? (
            <a
              href={transaction.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
            >
              <span>View on Blockchain Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-slate-400 text-xs font-mono">Explorer URL unavailable</span>
          )}

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
