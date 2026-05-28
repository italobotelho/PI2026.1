"use client";

import { useState } from 'react';
import DashboardMetrics from '../components/DashboardMetrics';
import DashboardCharts from '../components/DashboardCharts';
import DashboardMap from '../components/DashboardMap';

const DOENCAS = [
  { id: '', nome: 'Geral (Todas)', colorInfo: 'from-indigo-500 to-purple-500', activeClass: 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border-indigo-500' },
  { id: 'DENGUE', nome: 'Dengue', colorInfo: 'from-rose-500 to-red-500', activeClass: 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] border-rose-500' },
  { id: 'ZIKA', nome: 'Zika', colorInfo: 'from-amber-400 to-orange-500', activeClass: 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-500' },
  { id: 'LEPTOSPIROSE', nome: 'Leptospirose', colorInfo: 'from-teal-400 to-cyan-500', activeClass: 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)] border-teal-500' }
];

export default function Home() {
  const [doencaSelecionada, setDoencaSelecionada] = useState<string>('');

  const activeDoenca = DOENCAS.find(d => d.id === doencaSelecionada) || DOENCAS[0];

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 text-slate-100 font-sans relative overflow-hidden bg-slate-950">
      
      {/* Background base para garantir o modo escuro */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>

      {/* Elemento decorativo de fundo (Glow) dinâmico com a doença */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r ${activeDoenca.colorInfo} opacity-[0.15] blur-[120px] rounded-full pointer-events-none transition-all duration-1000 z-0`}></div>

      <div className="w-full max-w-7xl mb-8 relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
          <div>
            <h1 className={`text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${activeDoenca.colorInfo} transition-all duration-500 tracking-tight`}>
              SIEST
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-2 font-medium">
              Sistema de Inteligência Epidemiológica e Socio-Territorial
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {DOENCAS.map((d) => {
              const isActive = doencaSelecionada === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDoencaSelecionada(d.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                    isActive 
                      ? d.activeClass 
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white hover:-translate-y-0.5'
                  }`}
                >
                  {d.nome}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl relative z-10 space-y-8">
        <DashboardMetrics doenca={doencaSelecionada} />
        <DashboardCharts doenca={doencaSelecionada} />
        <DashboardMap />
      </div>

    </main>
  );
}