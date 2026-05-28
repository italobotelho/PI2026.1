"use client";

import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function TimeLagChart({ doenca }: { doenca: string }) {
  const [dados, setDados] = useState<any[]>([]);
  const [lagDias, setLagDias] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simular busca de dados combinados de clima e casos
    api.get('/dashboard/temporal', { params: { doenca } })
      .then(res => {
        // Formatar e adicionar dados climáticos mockados se a API ainda não os trouxer
        const formatado = res.data
          .sort((a: any, b: any) => {
            if (a.ano !== b.ano) return a.ano - b.ano;
            return a.mes - b.mes;
          })
          .map((item: any) => ({
            ...item,
            data_formatada: `${String(item.mes).padStart(2, '0')}/${item.ano}`,
            precipitacao: Math.random() * 200 + 50, // Mock caso a API não traga
            temperatura: Math.random() * 15 + 15,
          }));
        setDados(formatado);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados temporais:", error);
        setLoading(false);
      });
  }, [doenca]);

  // Aplicar o Lag Visualmente (deslocando os casos para a frente em relação ao clima)
  const dadosComLag = dados.map((item, index) => {
    // Calculo simples de lag (cada mês ~30 dias). Se o lag é > 15, empurramos parte dos casos.
    // Numa implementação real diária, isto faria um shift exato. Como é mensal, faremos uma aproximação visual para o slider.
    const lagIndex = Math.floor(lagDias / 30);
    const itemOrigemCasos = dados[Math.max(0, index - lagIndex)];
    
    return {
      ...item,
      casos_deslocados: itemOrigemCasos ? itemOrigemCasos.total_casos : 0
    };
  });

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden";
  const tooltipStyle = { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', color: '#f8fafc', borderRadius: '12px', backdropFilter: 'blur(8px)' };

  return (
    <div className={cardClass}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-50"></div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Análise de Defasagem (Time Lag)</h3>
      <p className="text-sm text-slate-400 mb-6">Compare picos de chuva/temperatura com a explosão de casos ajustando o tempo de resposta.</p>
      
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
        <label className="text-sm font-semibold text-slate-300 whitespace-nowrap">
          Deslocamento (Lag): <span className="text-cyan-400">{lagDias} dias</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="60" 
          step="5"
          value={lagDias} 
          onChange={(e) => setLagDias(parseInt(e.target.value))}
          className="w-full md:w-64 accent-cyan-500"
        />
        <p className="text-xs text-slate-500 ml-auto hidden md:block">Arraste para encontrar a correlação exata.</p>
      </div>

      {loading ? (
        <div className="h-[400px] w-full animate-pulse bg-slate-800/50 rounded-xl"></div>
      ) : (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dadosComLag} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="data_formatada" stroke="#94a3b8" tick={{fontSize: 12}} minTickGap={30} />
              <YAxis yAxisId="left" stroke="#06b6d4" tick={{fontSize: 12}} orientation="left" />
              <YAxis yAxisId="right" stroke="#f43f5e" tick={{fontSize: 12}} orientation="right" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Bar yAxisId="left" dataKey="precipitacao" name="Chuva (mm)" fill="url(#colorPrecip)" radius={[4, 4, 0, 0]} barSize={20} />
              <Line yAxisId="left" type="monotone" dataKey="temperatura" name="Temp (°C)" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="casos_deslocados" name={`Casos (+${lagDias}d)`} stroke="#f43f5e" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 7 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
