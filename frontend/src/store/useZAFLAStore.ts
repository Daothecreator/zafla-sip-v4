import { create } from 'zustand';

interface User {
  protocol: string;
  role: string;
  token: string;
}

interface BICAState {
  activated: boolean;
  quantumState: string;
  coherence: number;
}

interface LegalAct {
  id: string;
  type: string;
  subject: string;
  status: string;
}

interface IntelRecord {
  id: string;
  source: string;
  timestamp: string;
}

interface ZAFLAState {
  user: User | null;
  bicaState: BICAState;
  legalActs: LegalAct[];
  intelligence: IntelRecord[];
  auditLog: any[];
  
  login: (protocol: string, role: string) => void;
  logout: () => void;
  addIntel: (record: IntelRecord) => void;
  addLegalAct: (act: LegalAct) => void;
  updateBicaState: (state: Partial<BICAState>) => void;
}

export const useZAFLAStore = create<ZAFLAState>((set) => ({
  user: null,
  bicaState: { activated: false, quantumState: 'STANDBY', coherence: 1.0 },
  legalActs: [],
  intelligence: [],
  auditLog: [],
  
  login: (protocol, role) => set({ user: { protocol, role, token: 'mock-jwt' } }),
  logout: () => set({ user: null }),
  addIntel: (record) => set((state) => ({ intelligence: [record, ...state.intelligence] })),
  addLegalAct: (act) => set((state) => ({ legalActs: [act, ...state.legalActs] })),
  updateBicaState: (state) => set((s) => ({ bicaState: { ...s.bicaState, ...state } })),
}));
