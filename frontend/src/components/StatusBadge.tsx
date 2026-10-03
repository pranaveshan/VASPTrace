import React from 'react';
import { Provenance, RiskLevel, AttributionState, Priority, CaseStatus } from '../types';

interface BadgeProps {
  type: 'provenance' | 'risk' | 'attribution' | 'priority' | 'status' | 'hop';
  value: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<BadgeProps> = ({ type, value, size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : 'px-2.5 py-1 text-xs font-semibold';

  if (type === 'provenance') {
    switch (value as Provenance) {
      case 'LIVE DATA':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 ${sizeClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE DATA
          </span>
        );
      case 'DEMO DATA':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-mono ${sizeClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            DEMO DATA
          </span>
        );
      case 'EXTERNAL LABEL':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded bg-sky-50 text-sky-700 border border-sky-300 ${sizeClass}`}>
            EXTERNAL LABEL
          </span>
        );
      case 'INFERRED':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClass}`}>
            INFERRED
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-slate-100 text-slate-700 border border-slate-300 ${sizeClass}`}>
            UNKNOWN
          </span>
        );
    }
  }

  if (type === 'risk') {
    switch (value as RiskLevel) {
      case 'CRITICAL':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-rose-100 text-rose-800 border border-rose-300 font-mono uppercase ${sizeClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            CRITICAL RISK
          </span>
        );
      case 'HIGH':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-amber-100 text-amber-800 border border-amber-300 font-mono uppercase ${sizeClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            HIGH RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-yellow-50 text-yellow-800 border border-yellow-300 font-mono uppercase ${sizeClass}`}>
            MEDIUM RISK
          </span>
        );
      case 'LOW':
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono uppercase ${sizeClass}`}>
            LOW RISK
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded bg-slate-100 text-slate-600 border border-slate-300 font-mono uppercase ${sizeClass}`}>
            UNKNOWN RISK
          </span>
        );
    }
  }

  if (type === 'attribution') {
    switch (value as AttributionState) {
      case 'CONFIRMED LABEL':
        return (
          <span className={`inline-flex items-center rounded bg-blue-50 text-blue-800 border border-blue-300 font-mono ${sizeClass}`}>
            CONFIRMED LABEL
          </span>
        );
      case 'HIGH CONFIDENCE':
        return (
          <span className={`inline-flex items-center rounded bg-teal-50 text-teal-800 border border-teal-300 font-mono ${sizeClass}`}>
            HIGH CONFIDENCE
          </span>
        );
      case 'PROBABLE':
        return (
          <span className={`inline-flex items-center rounded bg-slate-100 text-slate-800 border border-slate-300 font-mono ${sizeClass}`}>
            PROBABLE
          </span>
        );
      case 'POSSIBLE':
        return (
          <span className={`inline-flex items-center rounded bg-orange-50 text-orange-800 border border-orange-200 font-mono ${sizeClass}`}>
            POSSIBLE
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center rounded bg-slate-100 text-slate-500 border border-slate-200 font-mono ${sizeClass}`}>
            UNKNOWN
          </span>
        );
    }
  }

  if (type === 'priority') {
    switch (value as Priority) {
      case 'CRITICAL':
        return <span className={`inline-flex items-center rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold ${sizeClass}`}>P0 - CRITICAL</span>;
      case 'HIGH':
        return <span className={`inline-flex items-center rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold ${sizeClass}`}>P1 - HIGH</span>;
      case 'MEDIUM':
        return <span className={`inline-flex items-center rounded bg-slate-100 text-slate-700 border border-slate-300 ${sizeClass}`}>P2 - MEDIUM</span>;
      default:
        return <span className={`inline-flex items-center rounded bg-slate-100 text-slate-600 border border-slate-200 ${sizeClass}`}>P3 - LOW</span>;
    }
  }

  if (type === 'status') {
    switch (value as CaseStatus) {
      case 'NEW':
        return <span className={`inline-flex items-center rounded bg-sky-50 text-sky-800 border border-sky-200 font-medium ${sizeClass}`}>NEW</span>;
      case 'IN_PROGRESS':
        return <span className={`inline-flex items-center rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium ${sizeClass}`}>IN PROGRESS</span>;
      case 'UNDER_REVIEW':
        return <span className={`inline-flex items-center rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium ${sizeClass}`}>UNDER REVIEW</span>;
      case 'ACTION_REQUIRED':
        return <span className={`inline-flex items-center rounded bg-rose-50 text-rose-800 border border-rose-200 font-medium ${sizeClass}`}>ACTION REQUIRED</span>;
      case 'CLOSED':
        return <span className={`inline-flex items-center rounded bg-slate-100 text-slate-700 border border-slate-300 font-medium ${sizeClass}`}>CLOSED</span>;
      default:
        return <span className={`inline-flex items-center rounded bg-slate-100 text-slate-700 ${sizeClass}`}>{value}</span>;
    }
  }

  return <span className={`inline-flex items-center rounded bg-slate-100 text-slate-700 border border-slate-300 ${sizeClass}`}>{value}</span>;
};
