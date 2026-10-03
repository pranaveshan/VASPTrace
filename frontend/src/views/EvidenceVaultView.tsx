import React from 'react';
import { FileCheck2 } from 'lucide-react';
import { Investigation } from '../types';
import { EvidencePanel } from '../components/EvidencePanel';

interface EvidenceVaultViewProps {
  investigation: Investigation;
}

export const EvidenceVaultView: React.FC<EvidenceVaultViewProps> = ({ investigation }) => {
  return (
    <div className="space-y-6 text-xs text-slate-800">
      <EvidencePanel evidenceList={investigation.evidence} />
    </div>
  );
};
