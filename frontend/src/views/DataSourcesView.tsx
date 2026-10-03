import React, { useState, useEffect } from 'react';
import { Server, Activity, CheckCircle2, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { fetchDataSources } from '../api';

export const DataSourcesView: React.FC = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchDataSources();
      setSources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">BLOCKCHAIN DATA SOURCES & NODE SYNC</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Full Archive Node connectivity, Mempool listeners, and Sanctions registry synchronizers
          </p>
        </div>

        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-mono text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH HEALTH</span>
        </button>
      </div>

      {/* Grid of Data Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src) => (
          <div key={src.id} className="p-4 bg-white rounded border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{src.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 font-bold uppercase">
                  {src.network}
                </span>
              </div>
              <span className="flex items-center gap-1 text-emerald-700 font-mono text-[11px] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{src.status}</span>
              </span>
            </div>

            <div className="space-y-1 font-mono text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-semibold text-slate-900">{src.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Endpoint:</span>
                <span className="truncate max-w-[240px] text-slate-700" title={src.endpoint}>{src.endpoint}</span>
              </div>
              <div className="flex justify-between">
                <span>Round-Trip Latency:</span>
                <span className="text-emerald-700 font-bold">{src.latency_ms} ms</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync Check:</span>
                <span>{new Date(src.last_sync).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
