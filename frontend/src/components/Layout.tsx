import React from 'react';
import { LayoutDashboard, Terminal, Scale, Archive, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useZAFLAStore } from '../store/useZAFLAStore';
import ZAFLABadge from './ZAFLABadge';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/terminal', label: 'Terminal', icon: Terminal },
  { path: '/legal', label: 'Legal Workbench', icon: Scale },
  { path: '/archive', label: 'Archive', icon: Archive },
];

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const user = useZAFLAStore((s) => s.user);
  const logout = useZAFLAStore((s) => s.logout);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a2332] border-r border-[#c9a84c]/30 flex flex-col">
        <div className="p-6 border-b border-[#c9a84c]/30">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Caladea', serif" }}>
            ZERO AZIMUTH
          </h1>
          <p className="text-[#c9a84c] text-sm">Sovereign Intelligence</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#c9a84c]/30">
          <div className="flex items-center gap-3">
            <ZAFLABadge variant="compact" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{user?.protocol}</p>
              <p className="text-[#c9a84c] text-xs uppercase">{user?.role}</p>
            </div>
            <button onClick={logout} className="text-white/50 hover:text-white">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-[#1a2332] border-b border-[#c9a84c]/30 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500 text-sm">BiCA Active</span>
          </div>
          <div className="text-white/50 text-sm">
            {new Date().toISOString()}
          </div>
        </header>
        
        <main className="flex-1 p-6 bg-[#0a0f18]">
          {children}
        </main>
        
        <footer className="h-10 bg-[#1a2332] border-t border-[#c9a84c]/30 flex items-center justify-center text-white/40 text-xs">
          ZAFLA International Authority | Cryptographically Secured
        </footer>
      </div>
    </div>
  );
}

export default Layout;
