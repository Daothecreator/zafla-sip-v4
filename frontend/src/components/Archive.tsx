import React from 'react';

function Archive() {
  return (
    <div className="zafla-card p-6">
      <h2 className="text-2xl font-bold text-[#1a2332] mb-4">Archive</h2>
      <p className="text-[#1a1a1a]/70">Encrypted document archive. All files are AES-256-GCM encrypted and attested.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#c9a84c]/30">
              <th className="py-2 text-[#1a2332] font-bold">Document</th>
              <th className="py-2 text-[#1a2332] font-bold">Type</th>
              <th className="py-2 text-[#1a2332] font-bold">Date</th>
              <th className="py-2 text-[#1a2332] font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#c9a84c]/10">
              <td className="py-2 text-[#1a1a1a]">ZAFLA-INDICT-001.docx</td>
              <td className="py-2 text-[#1a1a1a]">Indictment</td>
              <td className="py-2 text-[#1a1a1a]">2026-06-13</td>
              <td className="py-2 text-green-600 font-bold">Attested</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Archive;
