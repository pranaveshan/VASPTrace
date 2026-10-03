import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, CheckCircle2, Server, ShieldCheck, RefreshCw } from 'lucide-react';
import { fetchSystemHealth } from '../api';

export const SystemHealthView: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSystemHealth();
      setHealth(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <div className="p-8 text-center bg-white rounded border border-slate-200 font-mono text-xs text-slate-500">Loading system metrics...</div>;
  }

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">SYSTEM HEALTH & ARCHITECTURAL METRICS</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Engine throughput, memory RSS, background queue depths, and LEA gateway status
          </p>
        </div>

        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-mono text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH METRICS</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase">Engine Status</div>
          <div className="text-base font-bold font-mono text-emerald-700 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {health?.status || 'ONLINE'}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Uptime: {health?.uptimeSeconds}s</div>
        </div>

        <div className="p-4 bg-white rounded border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase">Memory RSS</div>
          <div className="text-base font-bold font-mono text-slate-900 mt-1">
            {health?.systemMetrics?.memoryRssMb} MB
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Heap: {health?.systemMetrics?.heapUsedMb} MB</div>
        </div>

        <div className="p-4 bg-white rounded border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase">Worker Threads</div>
          <div className="text-base font-bold font-mono text-slate-900 mt-1">
            {health?.systemMetrics?.activeWorkers} Active
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Parallel Graph Traversal</div>
        </div>

        <div className="p-4 bg-white rounded border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase">Database Engine</div>
          <div className="text-base font-bold font-mono text-slate-900 mt-1">
            {health?.database?.status || 'HEALTHY'}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">{health?.database?.engine}</div>
        </div>
      </div>

      {/* External LEA Gateway Integration Status */}
      <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-900 border-b border-slate-200 pb-2">
          Law Enforcement Gateway & Interoperability Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {health?.integrations && Object.entries(health.integrations).map(([key, info]: [string, any]) => (
            <div key={key} className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  info.status === 'IMPLEMENTED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  {info.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>Protocol: <strong className="text-slate-800">{info.protocol}</strong></div>
                {info.endpoint && <div>Endpoint: <strong className="text-slate-800">{info.endpoint}</strong></div>}
                {info.records && <div>Registry Entries: <strong className="text-slate-800">{info.records}</strong></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
