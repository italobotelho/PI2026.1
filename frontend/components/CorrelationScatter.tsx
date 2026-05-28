"use client";

import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, ResponsiveContainer, Cell
} from 'recharts';
import { Play, Pause } from 'lucide-react';

export default function CorrelationScatter({ doenca }: { doenca: string }) {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesAtual, setMesAtual] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simular busca de dados por bairro. Em um cenário real, API retornaria dados demográficos cruzados com clima mensalmente.
    api.get('/dashboard/temporal', { params: { doenca } })
      .then(res => {
        // Como a API temporal traz geral, vamos mockar a quebra por "bairros" (Bolhas) para o scatter de correlação
        const meses = res.data;
        const bairrosMockados = meses.map((mes: any) => {
          // Para cada mês, geramos de 5 a 10 bairros com dados
          return Array.from({ length: 8 }).map((_, i) => ({
            nome_bairro: `Região ${i + 1}`,
            mes_id: `${String(mes.mes).padStart(2, '0')}/${mes.ano}`,
            precipitacao: Math.random() * 200 + 50 + (mes.mes === 1 || mes.mes === 2 ? 150 : 0), // Mais chuva no verão
            casos: Math.max(0, Math.random() * 50 + (mes.total_casos / 100)),
            populacao: Math.random() * 50000 + 10000,
            vulnerabilidade: Math.floor(Math.random() * 3) // 0: baixa, 1: media, 2: alta
          }));
        });
        
        setDados(bairrosMockados);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados para scatter:", error);
        setLoading(false);
      });
  }, [doenca]);

  // Efeito de Play/Pause animado
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && dados.length > 0) {
      interval = setInterval(() => {
        setMesAtual(prev => {
          if (prev >= dados.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, dados]);

  const togglePlay = () => {
    if (mesAtual >= dados.length - 1) setMesAtual(0);
    setIsPlaying(!isPlaying);
  };

  const coresVulnerabilidade = ['#10b981', '#f59e0b', '#e11d48']; // Verde (Baixa), Amarelo (Média), Vermelho (Alta)

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden";
  const tooltipStyle = { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', color: '#f8fafc', borderRadius: '12px', backdropFilter: 'blur(8px)' };

  const dadosExibidos = dados.length > 0 ? dados[mesAtual] : [];
  const rotuloMes = dadosExibidos.length > 0 ? dadosExibidos[0].mes_id : '';

  return (
    <div className={cardClass}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 opacity-50"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Evolução Sócio-Climática (Gapminder)</h3>
          <p className="text-sm text-slate-400">Relação entre Chuva (X) x Casos (Y) por bairro. Bolhas maiores = Maior População. <span className="text-rose-400 font-semibold">Cor = Vulnerabilidade</span>.</p>
        </div>
        <div className="text-4xl font-extrabold text-slate-700 opacity-50">{rotuloMes}</div>
      </div>

      <div className="mb-6 flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
        <button 
          onClick={togglePlay}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors shadow-lg shadow-indigo-500/30"
          disabled={loading || dados.length === 0}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>
        <div className="flex-1">
          <input 
            type="range" 
            min="0" 
            max={Math.max(0, dados.length - 1)} 
            value={mesAtual} 
            onChange={(e) => setMesAtual(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
            disabled={loading || dados.length === 0}
          />
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] w-full animate-pulse bg-slate-800/50 rounded-xl"></div>
      ) : (
        <div className="h-[400px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" dataKey="precipitacao" name="Chuva (mm)" stroke="#94a3b8" tick={{fontSize: 12}} domain={[0, 400]} />
              <YAxis type="number" dataKey="casos" name="Casos" stroke="#94a3b8" tick={{fontSize: 12}} domain={[0, 150]} />
              <ZAxis type="number" dataKey="populacao" range={[50, 1000]} name="População" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={tooltipStyle}
                formatter={(value, name) => [Math.round(Number(value)), name]}
                labelFormatter={() => ''}
              />
              <Scatter name="Bairros" data={dadosExibidos} animationDuration={800}>
                {dadosExibidos.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={coresVulnerabilidade[entry.vulnerabilidade]} opacity={0.8} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
