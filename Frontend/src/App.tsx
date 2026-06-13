import React from 'react';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-700/50 text-center">
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider rounded-full">
          Client Environment Online
        </span>
        <h1 className="text-3xl font-bold mt-4 tracking-tight">Pune Intern Network</h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
          The structural React template and Tailwind utility processing modules have successfully initialized.
        </p>
        <div className="mt-6 p-4 bg-slate-900/40 rounded-xl border border-slate-800 text-left text-xs font-mono text-emerald-400">
          ✓ Feature-Driven Architecture Ready
        </div>
      </div>
    </div>
  );
}