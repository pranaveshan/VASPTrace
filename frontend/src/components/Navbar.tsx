import React from 'react';
import { Shield, Search, Database, RefreshCw, AlertCircle, FileText, Bell } from 'lucide-react';
import { Investigation, DataMode } from '../types';
import { StatusBadge } from './StatusBadge';

interface NavbarProps {
  activeInvestigation: Investigation | null;
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
  onOpenSearch: () => void;
  unreadAlertsCount: number;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeInvestigation,
  dataMode,
  setDataMode,
  onOpenSearch,
  unreadAlertsCount,
  onNavigate
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 select-none">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-800 border border-slate-700 text-slate-200">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">I4C BLOCKCHAIN FORENSICS WORKSTATION</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                SIH26183
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Ministry of Home Affairs &bull; Indian Cybercrime Coordination Centre
            </p>
          </div>
        </div>

        {/* Central Active Context */}
        {activeInvestigation && (
          <div className="hidden lg:flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded px-3 py-1">
            <div className="text-xs">
              <span className="text-slate-400 font-mono">CASE:</span>{' '}
              <span className="font-mono font-medium text-blue-300">{activeInvestigation.caseId}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="text-xs flex items-center gap-1.5 font-mono">
              <span className="text-slate-400">WALLET:</span>
              <span className="text-slate-200" title={activeInvestigation.walletAddress}>
                {activeInvestigation.walletAddress.slice(0, 6)}...{activeInvestigation.walletAddress.slice(-4)}
              </span>
              <span className="text-[10px] px-1 rounded bg-slate-700 text-slate-300 uppercase">
                {activeInvestigation.network}
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <StatusBadge type="risk" value={activeInvestigation.riskAssessment?.classification || 'UNKNOWN'} size="sm" />
          </div>
        )}

        {/* Actions & Status */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search wallet, hash, case...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-400 rounded border border-slate-700">
              Ctrl+K
            </kbd>
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5 text-xs">
            <button
              onClick={() => setDataMode('DEMO')}
              className={`px-2.5 py-1 rounded transition-all font-mono text-[11px] font-medium ${
                dataMode === 'DEMO'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Deterministic SIH evaluation dataset (no external API keys required)"
            >
              DEMO DATA
            </button>
            <button
              onClick={() => setDataMode('LIVE')}
              className={`px-2.5 py-1 rounded transition-all font-mono text-[11px] font-medium ${
                dataMode === 'LIVE'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Live queries against public RPC blockchain nodes"
            >
              LIVE DATA
            </button>
          </div>

          {/* Alerts Notification button */}
          <button
            onClick={() => onNavigate('alerts')}
            className="relative p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="System & Case Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-rose-600 text-white rounded-full">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
