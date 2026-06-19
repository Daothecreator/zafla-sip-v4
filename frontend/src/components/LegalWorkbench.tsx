import React, { useState } from 'react';
import { Scale, Shield, Download } from 'lucide-react';

function LegalWorkbench() {
  const [actType, setActType] = useState('indictment');
  const [subject, setSubject] = useState('');
  const [jurisdiction, setJurisdiction] = useState('supranational');
  const [attestation, setAttestation] = useState<any>(null);

  const handleAttest = () => {
    setAttestation({
      composite_signature: 'eb2d1d3c86068c0c...',
      stark_proof: 'a1b2c3d4e5f6...',
      policy_hash: '7f8g9h0i1j2...',
      status: 'ATTESTED',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="zafla-card p-6 space-y-4">
        <h2 className="text-2xl font-bold text-[#1a2332] flex items-center gap-2">
          <Scale className="text-[#c9a84c]" />
          Legal Workbench
        </h2>
        
        <div>
          <label className="block text-[#1a1a1a] text-sm font-bold mb-1">Act Type</label>
          <select value={actType} onChange={(e) => setActType(e.target.value)} className="zafla-input w-full">
            <option value="indictment">Indictment</option>
            <option value="arrest_warrant">Arrest Warrant</option>
            <option value="declaratory_judgment">Declaratory Judgment</option>
          </select>
        </div>
        
        <div>
          <label className="block text-[#1a1a1a] text-sm font-bold mb-1">Subject Entity</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="zafla-input w-full text-[#1a1a1a]" placeholder="Entity name" />
        </div>
        
        <div>
          <label className="block text-[#1a1a1a] text-sm font-bold mb-1">Jurisdiction</label>
          <input type="text" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="zafla-input w-full text-[#1a1a1a]" />
        </div>
        
        <div className="flex gap-3">
          <button onClick={handleAttest} className="zafla-btn-primary flex items-center gap-2">
            <Shield size={18} />
            ATTEST
          </button>
          <button className="zafla-btn-primary flex items-center gap-2 bg-[#1a2332]">
            <Download size={18} />
            EXPORT DOCX
          </button>
        </div>
      </div>
      
      <div className="zafla-card p-6">
        <h3 className="text-lg font-bold text-[#1a2332] mb-4">Attestation Preview</h3>
        {attestation ? (
          <div className="space-y-2 font-mono text-xs text-[#1a1a1a]">
            <div className="p-2 bg-[#1a2332]/5 rounded">
              <span className="font-bold">Composite Signature:</span> {attestation.composite_signature}
            </div>
            <div className="p-2 bg-[#1a2332]/5 rounded">
              <span className="font-bold">STARK Proof:</span> {attestation.stark_proof}
            </div>
            <div className="p-2 bg-[#1a2332]/5 rounded">
              <span className="font-bold">Policy Hash:</span> {attestation.policy_hash}
            </div>
            <div className="p-2 bg-green-100 rounded text-green-800 font-bold">
              STATUS: {attestation.status}
            </div>
          </div>
        ) : (
          <p className="text-[#1a1a1a]/50 italic">Generate and attest a legal act to see cryptographic signatures.</p>
        )}
      </div>
    </div>
  );
}

export default LegalWorkbench;
