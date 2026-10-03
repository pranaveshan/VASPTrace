import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  Layers, 
  Network as NetworkIcon, 
  FileText, 
  Hash, 
  ArrowRight,
  Database,
  Search,
  Clock
} from 'lucide-react';
import { Network, IncidentType, Priority, DataMode, Investigation } from '../types';
import { validateAddress, startInvestigation } from '../api';
import { StatusBadge } from '../components/StatusBadge';

interface WorkspaceViewProps {
  onInvestigationComplete: (inv: Investigation) => void;
  dataMode: DataMode;
  onSelectCase: (caseId: string) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  onInvestigationComplete,
  dataMode,
  onSelectCase
}) => {
  // Form State
  const [caseId, setCaseId] = useState('I4C-2026-INV-8492');
  const [walletAddress, setWalletAddress] = useState('0x71C2a3628F5c36C059B880bF202bE6325Fe8912e');
  const [network, setNetwork] = useState<Network>('ETH');
  const [incidentType, setIncidentType] = useState<IncidentType>('Investment Fraud');
  const [priority, setPriority] = useState<Priority>('CRITICAL');
  const [hopDepth, setHopDepth] = useState<number>(3);
  const [complaintReference, setComplaintReference] = useState('NCRP-2026-092834-DEL');
  const [notes, setNotes] = useState('Victim reported transferring crypto savings into fraudulent yield farming pool via Telegram group.');

  // Validation & Execution State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const stagesList = [
    'Step 1: Validating Wallet Format & Checksum',
    'Step 2: Identifying Blockchain Network & RPC Node',
    'Step 3: Ingesting On-Chain Transactions & Balances',
    'Step 4: Constructing Transaction Graph Relationships',
    'Step 5: Executing Multi-Hop Traversal (Configured Depth)',
    'Step 6: Analyzing Fund Velocity & Layering Patterns',
    'Step 7: Querying VASP & Exchange Attribution Databases',
    'Step 8: Generating Explainable Risk Assessment Signals',
    'Step 9: Sealing Cryptographic Evidence & Chain of Custody',
    'Step 10: Generating Actionable LEA Recommendations'
  ];

  const handleLoadDemoCase = (preset: 'investment' | 'phishing' | 'ransomware') => {
    if (preset === 'investment') {
      setCaseId('I4C-2026-INV-8492');
      setWalletAddress('0x71C2a3628F5c36C059B880bF202bE6325Fe8912e');
      setNetwork('ETH');
      setIncidentType('Investment Fraud');
      setPriority('CRITICAL');
      setHopDepth(3);
      setComplaintReference('NCRP-2026-092834-DEL');
      setNotes('High-yield Telegram task/investment fraud syndicating deposits into WazirX and Binance deposit gateways.');
    } else if (preset === 'phishing') {
      setCaseId('I4C-2026-INV-7104');
      setWalletAddress('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
      setNetwork('BTC');
      setIncidentType('Phishing');
      setPriority('HIGH');
      setHopDepth(2);
      setComplaintReference('NCRP-2026-081192-MUM');
      setNotes('Customs / Police impersonation extortion scheme requesting Bitcoin settlements.');
    } else {
      setCaseId('I4C-2026-INV-9921');
      setWalletAddress('TYDzsYUE22Dcf3nu7B7H8KvZ9B8qF1yU5C');
      setNetwork('TRON');
      setIncidentType('Ransomware');
      setPriority('CRITICAL');
      setHopDepth(2);
      setComplaintReference('NCRP-2026-100412-BLR');
      setNotes('Ransomware payload encrypting manufacturing enterprise requesting USDT TRC20.');
    }
    setValidationError(null);
  };

  const handleStartAnalysis = async () => {
    setValidationError(null);

    // Validate wallet format first
    const val = await validateAddress(walletAddress, network);
    if (!val.isValid) {
      setValidationError(val.error || 'Invalid address for selected network.');
      return;
    }

    setIsAnalyzing(true);
    setCompletedSteps([]);

    // Progress through deterministic steps smoothly
    for (let i = 0; i < stagesList.length; i++) {
      setCurrentStage(stagesList[i]);
      await new Promise((r) => setTimeout(r, 220));
      setCompletedSteps((prev) => [...prev, stagesList[i]]);
    }

    try {
      const inv = await startInvestigation({
        caseId,
        walletAddress,
        network,
        incidentType,
        priority,
        hopDepth,
        dataMode,
        complaintReference,
        notes
      });

      setIsAnalyzing(false);
      onInvestigationComplete(inv);
    } catch (err: any) {
      setIsAnalyzing(false);
      setValidationError(err.message || 'Investigation execution failed.');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">INVESTIGATION WORKSPACE</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Automated Blockchain Analytics for Fraud-Linked Cryptocurrency Exchanges Identification
          </p>
        </div>

        {/* Demo Preset Quick Loader */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono text-[11px]">Load Preset Case:</span>
          <button
            onClick={() => handleLoadDemoCase('investment')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-300 rounded font-mono text-[11px] font-semibold text-slate-700 transition-colors"
          >
            Investment Fraud (ETH)
          </button>
          <button
            onClick={() => handleLoadDemoCase('phishing')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-300 rounded font-mono text-[11px] font-semibold text-slate-700 transition-colors"
          >
            Extortion (BTC)
          </button>
          <button
            onClick={() => handleLoadDemoCase('ransomware')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-300 rounded font-mono text-[11px] font-semibold text-slate-700 transition-colors"
          >
            Ransomware (TRC20)
          </button>
        </div>
      </div>

      {/* Main Intake Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Parameters */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-semibold text-xs text-slate-900 uppercase tracking-wide font-mono">
              Suspect Wallet & Case Ingestion
            </h2>
            <StatusBadge type="provenance" value={dataMode === 'LIVE' ? 'LIVE DATA' : 'DEMO DATA'} />
          </div>

          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded flex items-start gap-2.5 text-rose-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>
                <span className="font-semibold font-mono text-xs">Validation Error:</span>
                <p className="text-xs mt-0.5">{validationError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Case ID */}
            <div>
              <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
                CASE IDENTIFIER <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="e.g. I4C-2026-INV-8492"
                className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-xs text-slate-900"
              />
            </div>

            {/* Complaint Reference */}
            <div>
              <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
                NCRP / LEA COMPLAINT REF
              </label>
              <input
                type="text"
                value={complaintReference}
                onChange={(e) => setComplaintReference(e.target.value)}
                placeholder="e.g. NCRP-2026-092834-DEL"
                className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Suspect Wallet Address */}
          <div>
            <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
              REPORTED SUSPECT WALLET ADDRESS <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => {
                setWalletAddress(e.target.value);
                setValidationError(null);
              }}
              placeholder="0x... or bc1... or T..."
              className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-xs text-slate-900"
            />
          </div>

          {/* Network, Incident, Priority, Hop Depth */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
                BLOCKCHAIN <span className="text-rose-500">*</span>
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as Network)}
                className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-xs text-slate-900"
              >
                <option value="ETH">Ethereum (ETH)</option>
                <option value="POLYGON">Polygon (POL)</option>
                <option value="BSC">BNB Smart Chain</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="TRON">Tron (TRC20)</option>
                <option value="ARBITRUM">Arbitrum One</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
                INCIDENT TYPE <span className="text-rose-500">*</span>
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-xs text-slate-900"
              >
                <option value="Investment Fraud">Investment Fraud</option>
                <option value="Task Fraud">Task Fraud</option>
                <option value="Phishing">Phishing</option>
                <option value="Ransomware">Ransomware</option>
                <option value="Sextortion">Sextortion</option>
                <option value="Darknet-related Fraud">Darknet Fraud</option>
                <option value="Organized Cyber Fraud">Organized Fraud</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
                PRIORITY <span className="text-rose-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-xs text-slate-900"
              >
                <option value="CRITICAL">P0 - CRITICAL</option>
                <option value="HIGH">P1 - HIGH</option>
                <option value="MEDIUM">P2 - MEDIUM</option>
                <option value="LOW">P3 - LOW</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
                HOP DEPTH <span className="text-rose-500">*</span>
              </label>
              <select
                value={hopDepth}
                onChange={(e) => setHopDepth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-xs text-slate-900 font-bold"
              >
                <option value={1}>1 Hop (Immediate Peers)</option>
                <option value={2}>2 Hops (Layer 1 Mule)</option>
                <option value={3}>3 Hops (VASP Ingestion)</option>
                <option value={4}>4 Hops (Deep Trace)</option>
                <option value={5}>5 Hops (Max Traversal)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
              INVESTIGATOR DOSSIER NOTES
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Case background, victim statements, bank freeze notices..."
              className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-xs text-slate-900"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-[11px] font-mono text-slate-500">
              Ready to execute automated {hopDepth}-hop forensic traversal
            </div>

            <button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold rounded shadow transition-all font-mono text-xs uppercase tracking-wide"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>EXECUTING FORENSIC PIPELINE...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>START INVESTIGATION</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Live Operation Progress Pipeline */}
        <div className="bg-slate-900 text-slate-100 rounded border border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-xs font-semibold text-slate-300 uppercase">
                Forensics Pipeline Stage
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                {isAnalyzing ? 'ACTIVE' : 'READY'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {stagesList.map((stg, i) => {
                const isDone = completedSteps.includes(stg);
                const isCurrent = currentStage === stg;

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 p-1.5 rounded transition-colors ${
                      isCurrent
                        ? 'bg-blue-900/50 text-blue-300 font-semibold border border-blue-700/50'
                        : isDone
                        ? 'text-emerald-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></span>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0"></div>
                    )}
                    <span className="truncate text-[11px]">{stg}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Adapter:</span>
              <span className="text-slate-200">{network}Adapter</span>
            </div>
            <div className="flex justify-between">
              <span>VASP DB Matcher:</span>
              <span className="text-slate-200">FIU-IND + Global Cluster</span>
            </div>
            <div className="flex justify-between">
              <span>Max Hop Constraint:</span>
              <span className="text-slate-200">{hopDepth} Hops</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
