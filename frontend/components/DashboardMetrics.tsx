"use client";

import { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { Activity, Thermometer, Users, PlusCircle } from 'lucide-react';

interface ResumoData {
  casos: {
    total_casos: number;
    media_idade: number | string; // Agora aceita string ("Var.")
    total_hospitalizados: number | string; // Agora aceita string ("N/A")
    total_unidades: number | string;
  };
  clima: {
    media_temperatura: number;
    total_precipitacao: number;
  };
}

export default function DashboardMetrics({ doenca }: { doenca: string }) {
  const [dados, setDados] = useState<ResumoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/dashboard/resumo', { params: { doenca } })
      .then(response => {
        setDados(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar resumo:", error);
        setLoading(false);
      });
  }, [doenca]);

  if (loading) return <div className="text-emerald-400 animate-pulse text-center p-10">A atualizar métricas...</div>;
  if (!dados || !dados.casos) return <div className="text-slate-500 text-center p-10">Sem dados gerais para este filtro.</div>;

  // Função auxiliar para evitar erro de formatação se o dado for texto ("N/A")
  const formatarNumero = (valor: number | string) => {
    return typeof valor === 'number' ? valor.toLocaleString('pt-BR') : valor;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
        <div className="p-3 bg-red-500/20 text-red-400 rounded-lg"><Activity size={28} /></div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Total de Casos</p>
          <h3 className="text-2xl font-bold text-white">{formatarNumero(dados.casos.total_casos)}</h3>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
        <div className="p-3 bg-orange-500/20 text-orange-400 rounded-lg"><PlusCircle size={28} /></div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Hospitalizações</p>
          <h3 className="text-2xl font-bold text-white">{formatarNumero(dados.casos.total_hospitalizados)}</h3>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Users size={28} /></div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Média de Idade</p>
          <h3 className="text-2xl font-bold text-white">
            {dados.casos.media_idade} {typeof dados.casos.media_idade === 'number' && 'anos'}
          </h3>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
        <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-lg"><Thermometer size={28} /></div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Temp. Média Geral</p>
          <h3 className="text-2xl font-bold text-white">{dados.clima.media_temperatura} °C</h3>
        </div>
      </div>
    </div>
  );
}