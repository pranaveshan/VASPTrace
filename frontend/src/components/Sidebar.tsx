import React from 'react';
import { 
  Compass, 
  FolderLock, 
  WalletCards, 
  ArrowLeftRight, 
  GitFork, 
  Building2, 
  ShieldAlert, 
  BellRing, 
  FileCheck2, 
  FileText, 
  Server, 
  Activity, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  hasActiveInvestigation: boolean;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  hasActiveInvestigation,
  alertCount
}) => {
  const navItems = [
    {
      id: 'workspace',
      label: 'Investigation Workspace',
      icon: Compass,
      description: 'Intake & Automated Traversal',
      badge: null
    },
    {
      id: 'cases',
      label: 'Cases & Dossiers',
      icon: FolderLock,
      description: 'Case Registry & Audit Trail',
      badge: null
    },
    {
      id: 'wallet',
      label: 'Wallet Intelligence',
      icon: WalletCards,
      description: 'Profile, Balance, Volumes',
      requiresInv: true
    },
    {
      id: 'transactions',
      label: 'Transactions Ledger',
      icon: ArrowLeftRight,
      description: 'Tabular Ledger & Gas Proof',
      requiresInv: true
    },
    {
      id: 'fundflow',
      label: 'Fund Flow & Multi-Hop',
      icon: GitFork,
      description: 'Interactive Graph & Hop Trace',
      requiresInv: true
    },
    {
      id: 'entities',
      label: 'Entity / VASP Registry',
      icon: Building2,
      description: 'Exchanges, FIU-IND, Mixers',
      badge: null
    },
    {
      id: 'risk',
      label: 'Risk & Layering Analysis',
      icon: ShieldAlert,
      description: 'Explainable Signal Engine',
      requiresInv: true
    },
    {
      id: 'alerts',
      label: 'Alerts & Surveillance',
      icon: BellRing,
      description: 'Real-time Fund Triggers',
      badge: alertCount > 0 ? alertCount : null
    },
    {
      id: 'evidence',
      label: 'Evidence Vault',
      icon: FileCheck2,
      description: 'Cryptographic Chain of Custody',
      requiresInv: true
    },
    {
      id: 'reports',
      label: 'Investigation Reports',
      icon: FileText,
      description: 'Standardized LEA Dossier Export',
      requiresInv: true
    },
    {
      id: 'datasources',
      label: 'Data Sources & Nodes',
      icon: Server,
      description: 'RPC Status & Registry Health',
      badge: null
    },
    {
      id: 'system',
      label: 'System Health',
      icon: Activity,
      description: 'Latency, Queues, Memory',
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings & Architecture',
      icon: Settings,
      description: 'NCRP/SAHYOG Integrations',
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 select-none">
      <div className="p-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
        Investigation Suite
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isDisabled = item.requiresInv && !hasActiveInvestigation;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onNavigate(item.id)}
              disabled={isDisabled}
              className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors text-left ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold border-l-2 border-blue-500'
                  : isDisabled
                  ? 'text-slate-600 cursor-not-allowed opacity-60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <div className="truncate">
                  <div className="truncate font-medium">{item.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{item.description}</div>
                </div>
              </div>

              {item.badge !== null && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer system information */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-[11px] text-slate-400">
        <div className="flex items-center justify-between font-mono">
          <span>STATUS:</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            OPERATIONAL
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1 font-mono">
          Engine: I4C-Forensics-v1.0.4
        </div>
      </div>
    </aside>
  );
};
