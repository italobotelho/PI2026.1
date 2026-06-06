"use client";

import { useState, useEffect } from 'react';
import api from '@/app/services/api';

export default function DemographicHeatmap({ 
  doenca,
  filtroAno = null,
  filtroSexo = null
}: { 
  doenca: string;
  filtroAno?: number | null;
  filtroSexo?: string | null;
}) {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxCasos, setMaxCasos] = useState(0);

  const mesesNomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  useEffect(() => {
    setLoading(true);
    api.get('/dashboard/demografia-sazonal', { params: { doenca, ano: filtroAno, sexo: filtroSexo } })
      .then(res => {
        setDados(res.data);
        
        // Encontrar o maior valor para calcular a opacidade/escala de cor
        let max = 0;
        res.data.forEach((row: any) => {
          mesesNomes.forEach(m => {
            if (row[m] > max) max = row[m];
          });
        });
        setMaxCasos(max);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados do heatmap:", error);
        setLoading(false);
      });
  }, [doenca, filtroAno, filtroSexo]);

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col w-full";

  // Função para calcular a cor com base na intensidade (0 a 1)
  const getCellColor = (valor: number) => {
    if (!valor || valor === 0) return 'bg-slate-800/30';
    
    const intensity = Math.min(1, Math.max(0.1, valor / maxCasos));
    
    // Gradiente térmico: do azul (frio/baixo) ao vermelho (quente/alto)
    // Para design premium, usaremos tons de roxo para rosa/vermelho
    if (intensity < 0.2) return 'bg-indigo-500/30 text-indigo-200';
    if (intensity < 0.4) return 'bg-purple-500/50 text-purple-100';
    if (intensity < 0.6) return 'bg-fuchsia-500/70 text-white font-medium';
    if (intensity < 0.8) return 'bg-rose-500/80 text-white font-bold';
    return 'bg-red-500 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className={cardClass}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-50"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Sazonalidade vs Demografia</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Mapa de calor cruzando a época do ano com o grupo demográfico mais afetado.
            Cores mais intensas indicam os picos de contaminação para aquela faixa etária.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">
          <span className="font-medium mr-1">Intensidade:</span>
          <span className="w-4 h-4 rounded bg-slate-800/30 border border-slate-600"></span>
          <span className="w-4 h-4 rounded bg-indigo-500/30"></span>
          <span className="w-4 h-4 rounded bg-purple-500/50"></span>
          <span className="w-4 h-4 rounded bg-rose-500/80"></span>
          <span className="w-4 h-4 rounded bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
          <span className="ml-1">Máx: {maxCasos}</span>
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] w-full animate-pulse bg-slate-800/50 rounded-xl"></div>
      ) : dados.length === 0 ? (
        <div className="h-[400px] flex items-center justify-center text-slate-500 italic bg-slate-800/20 rounded-xl border border-slate-700/30">
          Nenhum dado disponível para este filtro
        </div>
      ) : (
        <div className="w-full overflow-x-auto hide-scrollbar pb-2">
          <div className="min-w-[700px]">
            {/* Header: Meses */}
            <div className="flex mb-2 ml-[120px]">
              {mesesNomes.map(mes => (
                <div key={mes} className="flex-1 text-center text-xs font-bold text-slate-400 tracking-wider uppercase">
                  {mes}
                </div>
              ))}
            </div>
            
            {/* Grid Body */}
            <div className="space-y-1.5">
              {dados.map((row, idx) => (
                <div key={idx} className="flex items-stretch group hover:bg-slate-800/40 rounded-lg transition-colors p-1 -mx-1">
                  {/* Faixa Etária Label */}
                  <div className="w-[120px] shrink-0 flex items-center justify-end pr-4 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {row.faixa_etaria}
                  </div>
                  
                  {/* Cells */}
                  <div className="flex flex-1 gap-1.5">
                    {mesesNomes.map(mes => {
                      const valor = row[mes] || 0;
                      return (
                        <div 
                          key={`${row.faixa_etaria}-${mes}`}
                          className={`flex-1 min-h-[36px] flex items-center justify-center rounded-md text-xs transition-all duration-300 hover:scale-110 hover:z-10 cursor-pointer border border-transparent hover:border-white/20 ${getCellColor(valor)}`}
                          title={`${row.faixa_etaria} em ${mes}: ${valor} casos`}
                        >
                          {valor > 0 ? (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {valor > 999 ? `${(valor/1000).toFixed(1)}k` : valor}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
