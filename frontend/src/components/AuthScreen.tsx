import React from 'react';
import { useZAFLAStore } from '../store/useZAFLAStore';
import ZAFLABadge from './ZAFLABadge';

function AuthScreen() {
  const login = useZAFLAStore((s) => s.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('a8f3c9d2e1b40571', 'omega');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2332]">
      <div className="w-full max-w-md p-8 border-2 border-[#c9a84c] rounded-lg relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#c9a84c] text-2xl">◆</div>
        
        <h1 className="text-4xl font-bold text-white text-center mt-6" style={{ fontFamily: "'Caladea', serif" }}>
          ZERO AZIMUTH
        </h1>
        <h2 className="text-xl text-[#c9a84c] text-center mt-2" style={{ fontFamily: "'Caladea', serif" }}>
          FULL LIABILITY AUTHORITY
        </h2>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input type="text" placeholder="BiCA Protocol" className="zafla-input w-full" />
          <input type="text" placeholder="BiCA Nonce" className="zafla-input w-full" />
          <input type="text" placeholder="Proof" className="zafla-input w-full" />
          <button type="submit" className="zafla-btn-primary w-full">
            ATTEST & LOGIN
          </button>
        </form>
        
        <p className="text-center text-[#c9a84c]/60 mt-6 italic text-sm">
          Justice returns to its true meridian.
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;
