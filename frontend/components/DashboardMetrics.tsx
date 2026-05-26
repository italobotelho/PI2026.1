"use client"; // Diz ao Next.js que este componente roda no navegador do utilizador

import { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { Activity, Thermometer, Users, PlusCircle } from 'lucide-react';

// Aqui definimos o formato dos dados que esperamos da nossa API
interface ResumoData {
  casos: {
    total_casos: number;
    media_idade: number;
    total_hospitalizados: number;
    total_unidades: number;
  };
  clima: {
    media_temperatura: number;
    total_precipitacao: number;
  };
}

export default function DashboardMetrics() {
  const [dados, setDados] = useState<ResumoData | null>(null);
  const [loading, setLoading] = useState(true);

  // Assim que o componente aparece no ecrã, ele chama a API
  useEffect(() => {
    api.get('/dashboard/resumo')
      .then(response => {
        setDados(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar resumo:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-emerald-400 animate-pulse text-center p-10">A carregar os dados epidemiológicos...</div>;
  }

  if (!dados || !dados.casos) {
    return <div className="text-red-400 text-center p-10">Não foi possível carregar os dados.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-8">
      
      {/* Card 1: Total de Casos */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
        <div className="p-3 bg-red-500/20 text-red-400 rounded-lg">
          <Activity size={28} />
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Total de Casos</p>
          <h3 className="text-2xl font-bold text-white">
            {dados.casos.total_casos.toLocaleString('pt-BR')}
          </h3>
        </div>
      </div>

      {/* Card 2: Hospitalizados */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
        <div className="p-3 bg-orange-500/20 text-orange-400 rounded-lg">
          <PlusCircle size={28} />
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Hospitalizações</p>
          <h3 className="text-2xl font-bold text-white">
            {dados.casos.total_hospitalizados.toLocaleString('pt-BR')}
          </h3>
        </div>
      </div>

      {/* Card 3: Média de Idade */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
          <Users size={28} />
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Média de Idade</p>
          <h3 className="text-2xl font-bold text-white">
            {dados.casos.media_idade} anos
          </h3>
        </div>
      </div>

      {/* Card 4: Temperatura Média */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
        <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-lg">
          <Thermometer size={28} />
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Temp. Média Geral</p>
          <h3 className="text-2xl font-bold text-white">
            {dados.clima.media_temperatura} °C
          </h3>
        </div>
      </div>

    </div>
  );
}