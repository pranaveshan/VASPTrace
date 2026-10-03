import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowUpRight, CheckCircle, Scale, ShieldCheck } from 'lucide-react';
import { RiskAssessment, Recommendation } from '../types';
import { StatusBadge } from './StatusBadge';

interface FindingPanelProps {
  riskAssessment?: RiskAssessment;
  recommendations?: Recommendation[];
  onOpenEvidence: () => void;
}

export const FindingPanel: React.FC<FindingPanelProps> = ({
  riskAssessment,
  recommendations,
  onOpenEvidence
}) => {
  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Risk Engine Header Card */}
      {riskAssessment && (
        <div className="p-5 rounded bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-sm text-slate-900">EXPLAINABLE RISK EVALUATION</h3>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Rule-based behavioral signals with transparent evidentiary backing
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500">Classification:</span>
              <StatusBadge type="risk" value={riskAssessment.classification} size="md" />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Evaluation Basis</div>
            <p className="text-xs text-slate-800 mt-1 leading-relaxed">{riskAssessment.scoreBasis}</p>
          </div>

          {/* Observed Signals */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-wide font-mono">
              Detected Behavioral Signals ({riskAssessment.signals.length})
            </h4>

            <div className="space-y-2.5">
              {riskAssessment.signals.map((sig) => (
                <div
                  key={sig.id}
                  className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>{sig.name}</span>
                    </div>
                    <StatusBadge type="risk" value={sig.severity} size="sm" />
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pl-4">
                    {sig.observedBehaviour}
                  </p>

                  <div className="pl-4 pt-1 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500">
                    <span>Evidence Links:</span>
                    {sig.evidence.map((ev, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px]">
                        {ev.length > 20 ? `${ev.slice(0, 10)}...${ev.slice(-8)}` : ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trace Limitations */}
          {riskAssessment.limitations.length > 0 && (
            <div className="p-3 bg-amber-50/60 rounded border border-amber-200 space-y-1">
              <div className="font-semibold text-[11px] font-mono text-amber-900 uppercase">
                Known Trace Boundaries & Forensic Limitations
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-amber-950">
                {riskAssessment.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Mandatory Investigative Disclaimer */}
          <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-[11px] text-slate-600 font-mono italic text-center">
            &ldquo;{riskAssessment.disclaimer}&rdquo;
          </div>
        </div>
      )}

      {/* Investigative Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="p-5 rounded bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-sm text-slate-900">ACTIONABLE INVESTIGATIVE RECOMMENDATIONS</h3>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              {recommendations.length} Steps
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>{rec.title}</span>
                  </h4>
                  <StatusBadge type="priority" value={rec.priority} size="sm" />
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {rec.reason}
                </p>

                {/* Suggested Action Pill */}
                <div className="p-2.5 bg-blue-50 rounded border border-blue-200 text-xs text-blue-950 font-medium">
                  <strong>Suggested Action:</strong> {rec.suggestedAction}
                </div>

                {rec.legalProcess && (
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                    <span>Applicable Legal Process: <strong className="text-slate-800 font-semibold">{rec.legalProcess}</strong></span>
                    {rec.targetEntity && <span>Target: <strong className="text-slate-800 font-semibold">{rec.targetEntity}</strong></span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
