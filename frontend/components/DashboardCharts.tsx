"use client";

import { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { 
  AreaChart, Area, Brush, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// New health-related color palette
const CORES_SEXO = ['#06b6d4', '#e11d48', '#8b5cf6']; // Cyan, Rose, Violet
const COR_BARRAS = '#f59e0b'; // Amber
const COR_LINHA = '#e11d48'; // Rose for alerts

export default function DashboardCharts({ 
  doenca, 
  filtroAno, 
  filtroSexo, 
  setFiltroSexo 
}: { 
  doenca: string,
  filtroAno: number | null,
  filtroSexo: string | null,
  setFiltroSexo: (sex: string | null) => void
}) {
  const [dadosTemporais, setDadosTemporais] = useState<any[]>([]);
  const [dadosDemograficos, setDadosDemograficos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filtroIdades, setFiltroIdades] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const params: any = { doenca };
    if (filtroAno) params.ano = filtroAno;
    if (filtroSexo) params.sexo = filtroSexo;

    api.get('/dashboard/dinamico', { params })
      .then(res => {
        const data = res.data;
        
        const temporalFormatado = (data.tempo || [])
          .map((item: any) => ({
            ...item,
            data_formatada: `${String(item.mes).padStart(2, '0')}/${item.ano}`,
          }));

        const SEXO_MAP: Record<string, string> = { 'M': 'Masculino', 'F': 'Feminino', 'I': 'Indeterminado' };
        const SEXO_COLOR_MAP: Record<string, string> = { 'M': '#06b6d4', 'F': '#8b5cf6', 'I': '#e11d48' };

        const sexoFormatado = (data.sexo || []).map((item: any) => ({
          ...item,
          sexo_nome: SEXO_MAP[item.sexo] || item.sexo,
          fill: SEXO_COLOR_MAP[item.sexo] || '#94a3b8'
        }));

        setDadosTemporais(temporalFormatado);
        setDadosDemograficos({
          faixa_etaria: data.faixa_etaria || [],
          idade_exata: data.idade_exata || [],
          sexo: sexoFormatado,
          letalidade: data.letalidade || []
        });
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar gráficos:", error);
        setLoading(false);
      });
  }, [doenca, filtroAno, filtroSexo]);

  if (loading) return (
    <div className="w-full space-y-8 mt-8">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl h-[380px] animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl h-[380px] animate-pulse"></div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl h-[380px] animate-pulse"></div>
      </div>
    </div>
  );
  
  if (dadosTemporais.length === 0) return <div className="text-slate-500 text-center p-10 mt-8 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl">Sem dados para este filtro.</div>;

  const tooltipStyle = { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', color: '#f8fafc', borderRadius: '12px', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' };
  
  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col";

  let dadosIdadeParaExibir = dadosDemograficos?.faixa_etaria;
  if (filtroIdades.trim() !== '') {
    const segments = filtroIdades.split(',').map(v => v.trim()).filter(v => v !== '');
    if (segments.length > 0 && dadosDemograficos?.idade_exata) {
      dadosIdadeParaExibir = [];
      segments.forEach(segment => {
        if (segment.includes('-')) {
          const parts = segment.split('-');
          const start = parseInt(parts[0].replace(/\D/g, ''), 10);
          const end = parseInt(parts[1].replace(/\D/g, ''), 10);
          if (!isNaN(start) && !isNaN(end) && start <= end) {
            let totalCasos = 0;
            dadosDemograficos.idade_exata.forEach((item: any) => {
              const idade = parseInt(item.idade, 10);
              if (idade >= start && idade <= end) {
                totalCasos += item.total_casos;
              }
            });
            if (totalCasos > 0) {
              dadosIdadeParaExibir.push({
                faixa_etaria: `${start} a ${end} anos`,
                total_casos: totalCasos
              });
            }
          }
        } else {
          const idadeBuscada = parseInt(segment.replace(/\D/g, ''), 10);
          if (!isNaN(idadeBuscada)) {
            let totalCasos = 0;
            dadosDemograficos.idade_exata.forEach((item: any) => {
              if (parseInt(item.idade, 10) === idadeBuscada) totalCasos += item.total_casos;
            });
            if (totalCasos > 0) {
              dadosIdadeParaExibir.push({
                faixa_etaria: `${idadeBuscada} anos`,
                total_casos: totalCasos
              });
            }
          }
        }
      });
    } else {
      dadosIdadeParaExibir = [];
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className={cardClass}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Evolução Temporal de Casos</h3>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosTemporais} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
              <XAxis dataKey="data_formatada" stroke="#94a3b8" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} minTickGap={30} />
              <YAxis stroke="#94a3b8" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
              <Legend verticalAlign="top" height={36} />
              <Area 
                type="monotone" 
                dataKey="total_casos" 
                name="Total de Notificações" 
                stroke="#f43f5e" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorArea)" 
                activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                dot={false}
                filter="url(#glow)"
              />
              <Brush 
                dataKey="data_formatada" 
                height={30} 
                stroke="#475569" 
                fill="#0f172a"
                tickFormatter={() => ''}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}