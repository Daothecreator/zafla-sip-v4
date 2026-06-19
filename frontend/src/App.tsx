import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import Terminal from './components/Terminal';
import LegalWorkbench from './components/LegalWorkbench';
import Archive from './components/Archive';
import { useZAFLAStore } from './store/useZAFLAStore';

function App() {
  const user = useZAFLAStore((s) => s.user);

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/legal" element={<LegalWorkbench />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </Layout>
  );
}

export default App;
