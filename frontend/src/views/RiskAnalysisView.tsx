import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Scale, ShieldCheck, ArrowRight } from 'lucide-react';
import { Investigation } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { FindingPanel } from '../components/FindingPanel';

interface RiskAnalysisViewProps {
  investigation: Investigation;
  onNavigate: (view: string) => void;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  investigation,
  onNavigate
}) => {
  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              EXPLAINABLE RISK & LAYERING ANALYSIS
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Transparent behavioral heuristics without unexplainable black-box AI claims
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge type="risk" value={investigation.riskAssessment?.classification || 'UNKNOWN'} size="md" />
        </div>
      </div>

      {/* Main Finding & Risk Breakdown */}
      <FindingPanel
        riskAssessment={investigation.riskAssessment}
        recommendations={investigation.recommendations}
        onOpenEvidence={() => onNavigate('evidence')}
      />
    </div>
  );
};
