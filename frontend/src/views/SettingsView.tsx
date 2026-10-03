import React, { useState } from 'react';
import { Settings, Shield, Key, Sliders, CheckCircle2, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [officerName, setOfficerName] = useState('Inspector Rajesh Sharma');
  const [unitCode, setUnitCode] = useState('I4C-CYTRAIN-DELHI-04');
  const [sahyogEndpoint, setSahyogEndpoint] = useState('https://sahyog.i4c.mha.gov.in/api/v2');
  const [ncrpWebhook, setNcrpWebhook] = useState('https://cybercrime.gov.in/webhook/ncrp-events');
  const [maxHopLimit, setMaxHopLimit] = useState(5);
  const [rapidVelocityThresholdMins, setRapidVelocityThresholdMins] = useState(15);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">SETTINGS & LEA INTEGRATION CONFIGURATION</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Officer credentials, national cyber portals linkage, and algorithmic risk weights
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 text-emerald-700 font-mono font-bold bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded">
            <CheckCircle2 className="w-4 h-4" />
            <span>CONFIGURATIONS SAVED</span>
          </span>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Officer Profile */}
        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-wide font-mono text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Investigating Officer & CyTrain Unit Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
                Designated Officer Name / Rank
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-sans text-slate-900 bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate-600 font-semibold mb-1">
                I4C / State Unit Identification Code
              </label>
              <input
                type="text"
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Portals Integration */}
        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-wide font-mono text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span>SAHYOG & NCRP Interoperability Endpoints</span>
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                SAHYOG Nodal LEA Gateway REST Endpoint
              </label>
              <input
                type="text"
                value={sahyogEndpoint}
                onChange={(e) => setSahyogEndpoint(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                National Cyber Crime Reporting Portal (NCRP) Ingestion Webhook
              </label>
              <input
                type="text"
                value={ncrpWebhook}
                onChange={(e) => setNcrpWebhook(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Algorithmic Engine Parameters */}
        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-wide font-mono text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Forensics Engine Thresholds & Traversal Constraints</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                Maximum Graph Hop Traversal Depth
              </label>
              <select
                value={maxHopLimit}
                onChange={(e) => setMaxHopLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50"
              >
                <option value={3}>3 Hops (Standard)</option>
                <option value={5}>5 Hops (Deep Trace)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                Rapid Fund Velocity Threshold Window (Minutes)
              </label>
              <input
                type="number"
                value={rapidVelocityThresholdMins}
                onChange={(e) => setRapidVelocityThresholdMins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold rounded shadow transition-all text-xs"
          >
            <Save className="w-4 h-4" />
            <span>SAVE SETTINGS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
