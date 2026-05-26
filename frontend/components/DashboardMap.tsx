"use client";

import dynamic from 'next/dynamic';

// Dizemos ao Next.js para não usar SSR (Server-Side Rendering) para o mapa
const MapaDinamico = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-emerald-400 animate-pulse bg-slate-900 rounded-xl">
      A carregar dados socio-territoriais e georreferenciamento...
    </div>
  )
});

export default function DashboardMap() {
  return (
    <div className="w-full max-w-6xl mt-8 mb-16">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-200 mb-6">Mapeamento de Risco e Vulnerabilidade</h3>
        {/* O z-0 é importante para o mapa não sobrepor outras coisas no ecrã */}
        <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-600 relative z-0">
          <MapaDinamico />
        </div>
      </div>
    </div>
  );
}