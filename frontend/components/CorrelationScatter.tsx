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
  const [maximos, setMaximos] = useState({ casos: 150, precip: 400 });

  useEffect(() => {
    setLoading(true);
    // Simular busca de dados por bairro. Em um cenário real, API retornaria dados demográficos cruzados com clima mensalmente.
    api.get('/dashboard/temporal', { params: { doenca } })
      .then(res => {
        // Como a API temporal traz geral, vamos mockar a quebra por "bairros" (Bolhas) para o scatter de correlação
        const meses = res.data.sort((a: any, b: any) => {
          if (a.ano !== b.ano) return a.ano - b.ano;
          return a.mes - b.mes;
        });

        let globalMaxCasos = 0;
        let globalMaxPrecip = 0;

        const bairrosMockados = meses.map((mes: any) => {
          return Array.from({ length: 8 }).map((_, i) => {
            const precipitacao = (mes.precipitacao_total || 0) * (Math.random() * 0.4 + 0.8);
            const casos = Math.max(0, (mes.total_casos / 8) * (Math.random() * 0.5 + 0.75));
            
            if (casos > globalMaxCasos) globalMaxCasos = casos;
            if (precipitacao > globalMaxPrecip) globalMaxPrecip = precipitacao;

            return {
              nome_bairro: `Região ${i + 1}`,
              mes_id: `${String(mes.mes).padStart(2, '0')}/${mes.ano}`,
              precipitacao,
              casos,
              populacao: Math.random() * 50000 + 10000,
              vulnerabilidade: Math.floor(Math.random() * 3)
            };
          });
        });
        
        setMaximos({ casos: globalMaxCasos, precip: globalMaxPrecip });
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const vulLabel = data.vulnerabilidade === 0 ? 'Baixa' : data.vulnerabilidade === 1 ? 'Média' : 'Alta';
      const vulColor = coresVulnerabilidade[data.vulnerabilidade];

      return (
        <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-white font-bold text-lg mb-1 border-b border-slate-700 pb-1">{data.nome_bairro}</p>
          <div className="space-y-1 mt-2">
            <p className="text-rose-400 text-sm font-semibold">Casos: <span className="text-slate-200 font-normal">{Math.round(data.casos)}</span></p>
            <p className="text-sky-400 text-sm font-semibold">Chuva: <span className="text-slate-200 font-normal">{Math.round(data.precipitacao)} mm</span></p>
            <p className="text-emerald-400 text-sm font-semibold">População: <span className="text-slate-200 font-normal">{Math.round(data.populacao).toLocaleString('pt-BR')}</span></p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: vulColor }}></span>
              <span className="text-xs text-slate-300">Vulnerabilidade {vulLabel}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

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
              <XAxis type="number" dataKey="precipitacao" name="Chuva (mm)" stroke="#94a3b8" tick={{fontSize: 12}} domain={[0, maximos.precip > 0 ? maximos.precip : 400]} />
              <YAxis type="number" dataKey="casos" name="Casos" stroke="#94a3b8" tick={{fontSize: 12}} domain={[0, maximos.casos > 0 ? maximos.casos : 150]} />
              <ZAxis type="number" dataKey="populacao" range={[100, 3000]} name="População" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={<CustomTooltip />}
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
