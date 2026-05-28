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

export default function DashboardCharts({ doenca }: { doenca: string }) {
  const [dadosTemporais, setDadosTemporais] = useState<any[]>([]);
  const [dadosDemograficos, setDadosDemograficos] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/dashboard/temporal', { params: { doenca } }),
      api.get('/dashboard/demografia', { params: { doenca } })
    ]).then(([resTemporal, resDemografia]) => {
      
      const temporalFormatado = resTemporal.data
        .sort((a: any, b: any) => {
          if (a.ano !== b.ano) return a.ano - b.ano;
          return a.mes - b.mes;
        })
        .map((item: any) => ({
          ...item,
          data_formatada: `${String(item.mes).padStart(2, '0')}/${item.ano}`,
        }));

      const sexoFormatado = resDemografia.data?.sexo?.map((item: any, index: number) => ({
        ...item,
        fill: CORES_SEXO[index % CORES_SEXO.length]
      })) || [];

      setDadosTemporais(temporalFormatado);
      setDadosDemograficos({
        ...resDemografia.data,
        sexo: sexoFormatado
      });
      setLoading(false);
    }).catch(error => {
      console.error("Erro ao carregar gráficos:", error);
      setLoading(false);
    });
  }, [doenca]);

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
  
  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden";

  return (
    <div className="w-full space-y-8">
      <div className={cardClass}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>
        <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Evolução Temporal de Casos</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={cardClass}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Casos por Faixa Etária</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosDemograficos?.faixa_etaria} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#94a3b8" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="faixa_etaria" type="category" stroke="#94a3b8" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="total_casos" name="Casos" fill="url(#colorBar)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardClass}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Distribuição por Sexo</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dadosDemograficos?.sexo} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="total_casos" nameKey="sexo" label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`} stroke="none">
                  {dadosDemograficos?.sexo?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} style={{ filter: `drop-shadow(0px 0px 8px ${entry.fill}60)` }} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}