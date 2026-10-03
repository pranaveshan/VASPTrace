import React, { useState, useEffect } from 'react';
import { BellRing, Check, X, ShieldAlert, Clock, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, Priority } from '../types';
import { fetchAlerts, updateAlertStatus } from '../api';
import { StatusBadge } from '../components/StatusBadge';

interface AlertsViewProps {
  onOpenCase: (caseId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onOpenCase }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await fetchAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleUpdate = async (id: string, status: 'ACKNOWLEDGED' | 'DISMISSED') => {
    try {
      await updateAlertStatus(id, status);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = alerts.filter(a => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">REAL-TIME ALERTS & SURVEILLANCE</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Automated event triggers on rapid fund sweeps, VASP deposit routing, and mixer interactions
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500">Filter Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                filterSeverity === s ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded border border-slate-200 text-slate-500 font-mono text-xs">
            No active alerts matching criteria.
          </div>
        ) : (
          filtered.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 rounded border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alt.status === 'NEW'
                  ? 'bg-white border-blue-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-700">{alt.caseId}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="font-bold text-slate-900 text-xs">{alt.trigger}</span>
                  <StatusBadge type="priority" value={alt.severity} />
                  {alt.status === 'NEW' && (
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-mono font-bold text-[10px]">
                      NEW TRIGGER
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-700 font-sans">
                  <strong>Evidence:</strong> {alt.evidence}
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                  <span>Subject: <strong>{alt.wallet.slice(0, 10)}...{alt.wallet.slice(-8)}</strong></span>
                  <span>&bull;</span>
                  <span>{new Date(alt.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 font-mono flex-shrink-0">
                <button
                  onClick={() => onOpenCase(alt.caseId)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 font-semibold"
                >
                  <span>Open Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {alt.status === 'NEW' && (
                  <>
                    <button
                      onClick={() => handleUpdate(alt.id, 'ACKNOWLEDGED')}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 font-medium"
                      title="Acknowledge Alert"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => handleUpdate(alt.id, 'DISMISSED')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
                      title="Dismiss Alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
