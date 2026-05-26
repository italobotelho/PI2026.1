"use client";

import { useState } from 'react';
import DashboardMetrics from '../components/DashboardMetrics';
import DashboardCharts from '../components/DashboardCharts';
import DashboardMap from '../components/DashboardMap';

const DOENCAS = [
  { id: '', nome: 'Geral (Todas)' },
  { id: 'DENGUE', nome: 'Dengue' },
  { id: 'ZIKA', nome: 'Zika' },
  { id: 'LEPTOSPIROSE', nome: 'Leptospirose' }
];

export default function Home() {
  const [doencaSelecionada, setDoencaSelecionada] = useState<string>('');

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-900 p-8 md:p-24 text-white font-sans">
      
      <div className="w-full max-w-6xl mb-6 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            SIEST
          </h1>
          <p className="text-lg text-slate-400 mt-1">
            Sistema de Inteligência Epidemiológica e Socio-Territorial
          </p>
        </div>

        <div className="mt-6 md:mt-0 flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {DOENCAS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDoencaSelecionada(d.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                doencaSelecionada === d.id 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {d.nome}
            </button>
          ))}
        </div>
      </div>

      <DashboardMetrics doenca={doencaSelecionada} />
      <DashboardCharts doenca={doencaSelecionada} />
      <DashboardMap />

    </main>
  );
}