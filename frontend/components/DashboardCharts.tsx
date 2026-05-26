"use client";

import { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const CORES_SEXO = ['#06b6d4', '#f43f5e', '#8b5cf6'];
const COR_BARRAS = '#10b981';
const COR_LINHA = '#3b82f6';

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
      
      const temporalFormatado = resTemporal.data.map((item: any) => ({
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

  if (loading) return <div className="text-slate-500 text-center p-10 animate-pulse mt-8">A atualizar gráficos...</div>;
  if (dadosTemporais.length === 0) return <div className="text-slate-500 text-center p-10 mt-8">Sem dados para este filtro.</div>;

  const tooltipStyle = { backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' };

  return (
    <div className="w-full max-w-6xl mt-8 space-y-8">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-200 mb-6">Evolução Temporal de Casos</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosTemporais} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="data_formatada" stroke="#94a3b8" tick={{fontSize: 12}} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="total_casos" name="Total de Notificações" stroke={COR_LINHA} strokeWidth={3} dot={{ r: 3, fill: COR_LINHA }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Casos por Faixa Etária</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosDemograficos?.faixa_etaria} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="faixa_etaria" type="category" stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total_casos" name="Casos" fill={COR_BARRAS} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Distribuição por Sexo</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dadosDemograficos?.sexo} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="total_casos" nameKey="sexo" label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}