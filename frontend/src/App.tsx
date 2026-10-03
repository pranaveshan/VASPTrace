import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { WorkspaceView } from './views/WorkspaceView';
import { CasesView } from './views/CasesView';
import { WalletIntelligenceView } from './views/WalletIntelligenceView';
import { TransactionsView } from './views/TransactionsView';
import { FundFlowView } from './views/FundFlowView';
import { EntityIntelligenceView } from './views/EntityIntelligenceView';
import { RiskAnalysisView } from './views/RiskAnalysisView';
import { AlertsView } from './views/AlertsView';
import { EvidenceVaultView } from './views/EvidenceVaultView';
import { ReportsView } from './views/ReportsView';
import { DataSourcesView } from './views/DataSourcesView';
import { SystemHealthView } from './views/SystemHealthView';
import { SettingsView } from './views/SettingsView';
import { Investigation, DataMode, Network, IncidentType } from './types';
import { fetchInvestigationById, fetchAlerts } from './api';

export function App() {
  // Navigation State with localStorage persistence
  const [currentView, setCurrentView] = useState<string>(() => {
    return localStorage.getItem('sih_forensics_view') || 'workspace';
  });

  // Active Investigation with persistence
  const [activeInvestigation, setActiveInvestigation] = useState<Investigation | null>(() => {
    const saved = localStorage.getItem('sih_active_investigation');
    return saved ? JSON.parse(saved) : null;
  });

  // Data Mode
  const [dataMode, setDataMode] = useState<DataMode>('DEMO');

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Unread Alerts Count
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);

  // Address Filter for Transaction View
  const [transactionFilterAddress, setTransactionFilterAddress] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('sih_forensics_view', currentView);
  }, [currentView]);

  useEffect(() => {
    if (activeInvestigation) {
      localStorage.setItem('sih_active_investigation', JSON.stringify(activeInvestigation));
    }
  }, [activeInvestigation]);

  useEffect(() => {
    // Load initial alert count
    const loadAlertCount = async () => {
      try {
        const alts = await fetchAlerts();
        const unread = alts.filter(a => a.status === 'NEW').length;
        setUnreadAlertsCount(unread);
      } catch (err) {
        // quiet
      }
    };
    loadAlertCount();
    const interval = setInterval(loadAlertCount, 15000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInvestigationComplete = (inv: Investigation) => {
    setActiveInvestigation(inv);
    setCurrentView('fundflow'); // Jump directly to fund flow graph on completion
  };

  const handleSelectCase = async (caseIdOrInvId: string) => {
    try {
      const inv = await fetchInvestigationById(caseIdOrInvId);
      setActiveInvestigation(inv);
      setCurrentView('fundflow');
    } catch (err) {
      setCurrentView('cases');
    }
  };

  const handleStartInvestigationForWallet = (
    wallet: string,
    network: Network,
    caseId: string,
    incidentType: IncidentType
  ) => {
    setCurrentView('workspace');
  };

  const handleFilterTransactions = (address: string) => {
    setTransactionFilterAddress(address);
    setCurrentView('transactions');
  };

  const handleSearchResult = (type: string, data: any) => {
    if (type === 'case') {
      handleSelectCase(data.case_id);
    } else if (type === 'wallet') {
      setTransactionFilterAddress(data.address);
      setCurrentView('transactions');
    } else if (type === 'entity') {
      setCurrentView('entities');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans text-slate-900 overflow-hidden antialiased select-none">
      {/* Top Navbar */}
      <Navbar
        activeInvestigation={activeInvestigation}
        dataMode={dataMode}
        setDataMode={setDataMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          hasActiveInvestigation={!!activeInvestigation}
          alertCount={unreadAlertsCount}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100 select-text">
          {currentView === 'workspace' && (
            <WorkspaceView
              onInvestigationComplete={handleInvestigationComplete}
              dataMode={dataMode}
              onSelectCase={handleSelectCase}
            />
          )}

          {currentView === 'cases' && (
            <CasesView
              onSelectCase={handleSelectCase}
              onStartInvestigationForWallet={handleStartInvestigationForWallet}
            />
          )}

          {currentView === 'wallet' && activeInvestigation && (
            <WalletIntelligenceView
              investigation={activeInvestigation}
              onNavigate={(v) => setCurrentView(v)}
              onSelectTransaction={() => setCurrentView('transactions')}
            />
          )}

          {currentView === 'transactions' && activeInvestigation && (
            <TransactionsView
              investigation={activeInvestigation}
              filterAddress={transactionFilterAddress}
            />
          )}

          {currentView === 'fundflow' && activeInvestigation && (
            <FundFlowView
              investigation={activeInvestigation}
              onFilterTransactions={handleFilterTransactions}
            />
          )}

          {currentView === 'entities' && <EntityIntelligenceView />}

          {currentView === 'risk' && activeInvestigation && (
            <RiskAnalysisView
              investigation={activeInvestigation}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'alerts' && (
            <AlertsView onOpenCase={handleSelectCase} />
          )}

          {currentView === 'evidence' && activeInvestigation && (
            <EvidenceVaultView investigation={activeInvestigation} />
          )}

          {currentView === 'reports' && activeInvestigation && (
            <ReportsView investigation={activeInvestigation} />
          )}

          {currentView === 'datasources' && <DataSourcesView />}

          {currentView === 'system' && <SystemHealthView />}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSearchResult}
      />
    </div>
  );
}

export default App;
