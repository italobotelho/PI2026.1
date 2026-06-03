"use client";

import { useState, useEffect } from 'react';
import api from '@/app/services/api';

export default function BairrosRanking({ 
  doenca,
  filtroAno = null,
  filtroSexo = null
}: { 
  doenca: string;
  filtroAno?: number | null;
  filtroSexo?: string | null;
}) {
  const [locais, setLocais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/dashboard/bairros', { params: { doenca, ano: filtroAno, sexo: filtroSexo } })
      .then(res => {
        setLocais(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar ranking de locais:", error);
        setLoading(false);
      });
  }, [doenca, filtroAno, filtroSexo]);

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden w-full flex flex-col transition-all mb-16";

  if (loading) {
    return (
      <div className={cardClass} style={{ minHeight: '400px' }}>
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-500 to-slate-700 opacity-50"></div>
         <div className="flex-1 w-full flex items-center justify-center">
            <div className="animate-pulse text-slate-400">Calculando ranking de locais...</div>
         </div>
      </div>
    );
  }

  const maxCasos = Math.max(...locais.map(b => b.total_casos || 0), 1);

  return (
    <div className={cardClass}>
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-80"></div>
      
      {/* Header */}
      <div className="flex flex-col mb-8 relative z-10">
        <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
          Centros de Atendimento Mais Afetados
        </h3>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Top 10 locais/hospitais com maior volume de casos registrados
        </p>
      </div>
      
      <div className="w-full relative z-10">
        {locais.length === 0 ? (
          <div className="text-slate-500 text-sm py-4">Sem dados disponíveis.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {locais.map((b: any, idx: number) => {
              const pct = Math.round(((b.total_casos || 0) / maxCasos) * 100);
              const isNaoInformada = b.local === "UNIDADE NÃO INFORMADA";
              
              return (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-8 text-right text-sm font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                    #{idx + 1}
                  </div>
                  <div 
                    className={`w-48 text-left text-[11px] md:text-xs font-semibold leading-tight line-clamp-2 transition-colors ${isNaoInformada ? 'text-slate-500 italic' : 'text-slate-300 group-hover:text-white'}`}
                    title={b.local}
                  >
                    {b.local}
                  </div>
                  <div className="flex-1 h-6 md:h-7 bg-slate-900/80 rounded-full overflow-hidden relative shadow-inner">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${isNaoInformada ? 'bg-slate-700/50' : 'bg-gradient-to-r from-blue-600 to-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:brightness-110'}`}
                      style={{ width: `${pct}%` }}
                    >
                      {!isNaoInformada && (
                        <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                      )}
                    </div>
                  </div>
                  <div className={`w-16 text-right text-sm md:text-base font-black transition-colors ${isNaoInformada ? 'text-slate-500' : 'text-slate-200 group-hover:text-white'}`}>
                    {b.total_casos.toLocaleString('pt-BR')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%) skewX(-12deg); }
          0% { transform: translateX(-150%) skewX(-12deg); }
        }
      `}} />
    </div>
  );
}
