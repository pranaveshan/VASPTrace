import React, { useState, useEffect } from 'react';
import { Search, X, Wallet, ArrowLeftRight, FolderLock, Building2, ExternalLink } from 'lucide-react';
import { globalSearch } from '../api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (type: string, data: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({ wallets: [], transactions: [], cases: [], entities: [] });

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ wallets: [], transactions: [], cases: [], entities: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await globalSearch(query.trim());
        setResults(res);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    (results.wallets?.length || 0) +
    (results.transactions?.length || 0) +
    (results.cases?.length || 0) +
    (results.entities?.length || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search suspect wallet address, transaction hash, case ID, or entity..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {loading && (
            <div className="text-center py-8 text-slate-500 font-mono">
              Searching forensics database...
            </div>
          )}

          {!loading && query.length >= 2 && totalResults === 0 && (
            <div className="text-center py-8 text-slate-500 font-mono">
              No matching wallets, transactions, cases, or entities found.
            </div>
          )}

          {/* Cases Results */}
          {results.cases?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-500 uppercase mb-2">
                <FolderLock className="w-3.5 h-3.5 text-blue-600" />
                <span>Cases ({results.cases.length})</span>
              </div>
              <div className="space-y-1">
                {results.cases.map((c: any) => (
                  <div
                    key={c.case_id}
                    onClick={() => {
                      onSelectResult('case', c);
                      onClose();
                    }}
                    className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-700">{c.case_id}</span>
                      <span className="mx-2 text-slate-400">&bull;</span>
                      <span className="font-medium text-slate-900">{c.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallets Results */}
          {results.wallets?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-500 uppercase mb-2">
                <Wallet className="w-3.5 h-3.5 text-blue-600" />
                <span>Wallets ({results.wallets.length})</span>
              </div>
              <div className="space-y-1">
                {results.wallets.map((w: any) => (
                  <div
                    key={w.address}
                    onClick={() => {
                      onSelectResult('wallet', w);
                      onClose();
                    }}
                    className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 cursor-pointer flex items-center justify-between font-mono"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{w.address}</span>
                      {w.entity_name && (
                        <span className="ml-2 text-slate-500 font-sans">({w.entity_name})</span>
                      )}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                      {w.network}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entities Results */}
          {results.entities?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-500 uppercase mb-2">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>VASP / Entities ({results.entities.length})</span>
              </div>
              <div className="space-y-1">
                {results.entities.map((ent: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => {
                      onSelectResult('entity', ent);
                      onClose();
                    }}
                    className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{ent.entity_name}</span>
                      <span className="mx-2 text-slate-400">&bull;</span>
                      <span className="text-slate-600 text-xs">{ent.label}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {ent.confidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>Press ESC to dismiss</span>
          <span>SIH26183 Global Registry Search</span>
        </div>
      </div>
    </div>
  );
};
