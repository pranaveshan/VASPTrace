import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Shield, CheckCircle2, Scale, Lock, RefreshCw } from 'lucide-react';
import { Investigation } from '../types';
import { fetchReport } from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsViewProps {
  investigation: Investigation;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ investigation }) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await fetchReport(investigation.id);
      setReportData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [investigation.id]);

  const handleExportJSON = () => {
    if (!reportData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Investigation_Report_${investigation.caseId}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Clean professional header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('FORENSIC BLOCKCHAIN INVESTIGATION DOSSIER', 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Organization: Ministry of Home Affairs / Indian Cybercrime Coordination Centre (I4C)`, 14, 24);
    doc.text(`Report Ref: ${reportData.metadata.reportId} | Generated: ${new Date(reportData.metadata.generatedAt).toUTCString()}`, 14, 29);
    doc.text(`Classification: ${reportData.metadata.classificationLevel}`, 14, 34);

    // Section line
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 38, 196, 38);

    // Case Overview Table
    autoTable(doc, {
      startY: 42,
      head: [['CASE PARAMETER', 'INVESTIGATION VALUE']],
      body: [
        ['Case ID / Reference', `${reportData.caseOverview.caseId} (NCRP Ref: ${reportData.caseOverview.complaintReference})`],
        ['Dossier Title', reportData.caseOverview.title],
        ['Incident Category', reportData.caseOverview.incidentType],
        ['Reported Suspect Wallet', `${reportData.caseOverview.reportedWallet} (${reportData.caseOverview.network})`],
        ['Priority / Risk Level', `${reportData.caseOverview.priority} / ${reportData.riskAssessment?.classification || 'UNKNOWN'}`],
        ['Investigating Officer', reportData.caseOverview.assignedInvestigator]
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8.5, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
      styles: { cellPadding: 2 }
    });

    // Executive Summary
    const finalY1 = (doc as any).lastAutoTable.finalY || 80;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('1. EXECUTIVE SUMMARY & FORENSIC FINDINGS', 14, finalY1 + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(reportData.executiveSummary, 182);
    doc.text(splitSummary, 14, finalY1 + 14);

    // Identified VASPs & Exchanges
    const finalY2 = finalY1 + 16 + (splitSummary.length * 4);
    const exchangeRows = reportData.fundFlowAnalysis.identifiedExchanges.map((e: any) => [
      e.name,
      e.type,
      e.wallet,
      e.confidence,
      e.fiuRegistered ? 'YES (FIU-IND)' : 'OVERSEAS'
    ]);

    autoTable(doc, {
      startY: finalY2,
      head: [['IDENTIFIED VASP / EXCHANGE', 'ENTITY TYPE', 'DEPOSIT WALLET ADDRESS', 'CONFIDENCE', 'FIU REGISTRATION']],
      body: exchangeRows.length > 0 ? exchangeRows : [['No direct exchange deposits identified in current hop depth', '-', '-', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
      styles: { cellPadding: 2 }
    });

    // Actionable Recommendations
    const finalY3 = (doc as any).lastAutoTable.finalY || finalY2 + 30;
    const recRows = reportData.investigativeRecommendations.map((r: any) => [
      r.title,
      r.priority,
      r.suggestedAction,
      r.legalProcess || 'Section 91 CrPC'
    ]);

    autoTable(doc, {
      startY: finalY3 + 6,
      head: [['RECOMMENDATION', 'PRIORITY', 'SUGGESTED ACTION', 'LEGAL PROCESS']],
      body: recRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
      styles: { cellPadding: 2.5 }
    });

    // Trace Limitations & Legal Disclaimer
    const finalY4 = (doc as any).lastAutoTable.finalY || finalY3 + 40;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Disclaimer: This standardized dossier is generated through automated blockchain analytics for investigative prioritization leads and evidence preservation.',
      14,
      finalY4 + 8
    );
    doc.text(`Digital Integrity Hash: ${reportData.metadata.verificationHash}`, 14, finalY4 + 12);

    doc.save(`Investigation_Dossier_${investigation.caseId}.pdf`);
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded border border-slate-200 font-mono text-xs text-slate-500">
        Compiling standardized investigation report dossier...
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded border border-slate-200 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">STANDARDIZED INVESTIGATION REPORT</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Report Reference: <strong>{reportData.metadata.reportId}</strong> &bull; Chain of Custody Sealed
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs shadow transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT PDF DOSSIER</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-medium text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT JSON</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-medium text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT</span>
          </button>
        </div>
      </div>

      {/* Report Paper Preview Container */}
      <div className="bg-white border border-slate-300 rounded shadow-md p-8 max-w-4xl mx-auto space-y-6 text-slate-900 font-sans">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-slate-500 uppercase">
              {reportData.metadata.organization}
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              FORENSIC BLOCKCHAIN INVESTIGATION DOSSIER
            </h2>
            <p className="text-xs text-slate-600 font-mono">
              Software: {reportData.metadata.softwareSuite}
            </p>
          </div>

          <div className="text-right font-mono text-[11px] text-slate-600 space-y-0.5">
            <div><strong>Report Ref:</strong> {reportData.metadata.reportId}</div>
            <div><strong>Date:</strong> {new Date(reportData.metadata.generatedAt).toUTCString()}</div>
            <div className="text-rose-700 font-bold uppercase">{reportData.metadata.classificationLevel}</div>
          </div>
        </div>

        {/* Case Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded border border-slate-200 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase">Case Identifier</span>
            <div className="font-bold text-blue-700">{reportData.caseOverview.caseId}</div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase">NCRP Reference</span>
            <div className="font-semibold">{reportData.caseOverview.complaintReference || 'N/A'}</div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase">Incident Category</span>
            <div className="font-semibold">{reportData.caseOverview.incidentType}</div>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-500 text-[10px] uppercase">Subject Wallet Address</span>
            <div className="font-semibold break-all">{reportData.caseOverview.reportedWallet} ({reportData.caseOverview.network})</div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase">Investigating Officer</span>
            <div className="font-semibold">{reportData.caseOverview.assignedInvestigator}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-900 border-b border-slate-200 pb-1">
            1. Executive Analytical Summary
          </h3>
          <p className="text-xs leading-relaxed text-slate-800">
            {reportData.executiveSummary}
          </p>
        </div>

        {/* Fund Flow & Identified Exchanges */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-900 border-b border-slate-200 pb-1">
            2. Identified VASP & Exchange Deposit Nodes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 font-mono text-[11px] text-slate-700">
                  <th className="p-2 border border-slate-200">Entity Name</th>
                  <th className="p-2 border border-slate-200">Type</th>
                  <th className="p-2 border border-slate-200">Deposit Wallet</th>
                  <th className="p-2 border border-slate-200">Attribution</th>
                  <th className="p-2 border border-slate-200">FIU Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.fundFlowAnalysis.identifiedExchanges.map((ex: any, idx: number) => (
                  <tr key={idx} className="border border-slate-200">
                    <td className="p-2 font-bold text-slate-900">{ex.name}</td>
                    <td className="p-2">{ex.type}</td>
                    <td className="p-2 font-mono text-xs">{ex.wallet}</td>
                    <td className="p-2 font-mono">{ex.confidence}</td>
                    <td className="p-2 font-mono font-semibold text-emerald-700">{ex.fiuRegistered ? 'REGISTERED' : 'OVERSEAS'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-900 border-b border-slate-200 pb-1">
            3. Actionable Law Enforcement Recommendations
          </h3>
          <div className="space-y-2.5">
            {reportData.investigativeRecommendations.map((rec: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-900 text-xs">{rec.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{rec.reason}</p>
                <div className="text-xs text-blue-950 font-medium bg-blue-50/70 p-2 rounded">
                  <strong>Action:</strong> {rec.suggestedAction}
                </div>
                {rec.legalProcess && (
                  <div className="text-[10px] font-mono text-slate-500">
                    Legal Process: <strong>{rec.legalProcess}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trace Limitations & Disclaimer */}
        <div className="pt-4 border-t border-slate-200 space-y-2 text-[11px] font-mono text-slate-500">
          <div>
            <strong>Forensic Trace Boundaries:</strong>
            <ul className="list-disc list-inside mt-0.5 space-y-0.5">
              {reportData.traceLimitationsAndDisclaimer.limitations.map((lim: string, i: number) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>

          <div className="p-2 bg-slate-50 rounded border border-slate-200 italic text-slate-600 text-center mt-3">
            {reportData.traceLimitationsAndDisclaimer.legalDisclaimer}
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2">
            Verification Hash: {reportData.metadata.verificationHash}
          </div>
        </div>
      </div>
    </div>
  );
};
