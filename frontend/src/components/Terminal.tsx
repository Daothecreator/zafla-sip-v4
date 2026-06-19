import React, { useState } from 'react';

function Terminal() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(['ZAFLA Sovereign Terminal v4.0.0', 'Type "help" for available commands.']);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const cmd = input.trim().toLowerCase();
    let response = '';
    
    if (cmd === 'help') {
      response = 'Available commands: bica activate, bica query <text>, bica verify <hash>, clear, status';
    } else if (cmd === 'clear') {
      setOutput([]);
      setInput('');
      return;
    } else if (cmd === 'status') {
      response = 'BiCA: ACTIVE | Quantum State: COLLAPSED_PYTHON | Coherence: 1.000 | φ: 1.618033988749895';
    } else if (cmd.startsWith('bica activate')) {
      response = '{"status": "ACTIVE", "skills": 10, "domains": 5, "phi": 1.618033988749895}';
    } else {
      response = `Command not recognized: ${cmd}`;
    }
    
    setOutput((prev) => [...prev, `> ${input}`, response]);
    setInput('');
  };

  return (
    <div className="zafla-terminal-bg h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-1 mb-4">
        {output.map((line, i) => (
          <div key={i} className={line.startsWith('>') ? 'text-[#c9a84c]' : 'text-green-400'}>
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-[#c9a84c]">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-green-400 outline-none font-mono"
          autoFocus
        />
      </form>
    </div>
  );
}

export default Terminal;
