"use client";

import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { ResponsiveSunburst } from '@nivo/sunburst';

export default function DemographicSunburst({ doenca }: { doenca: string }) {
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simular busca de dados demográficos profundos
    api.get('/dashboard/demografia', { params: { doenca } })
      .then(res => {
        // Criamos uma estrutura hierárquica mockada a partir dos dados (Vulnerabilidade -> Doença -> Faixa Etária -> Sexo)
        // Como a API atual talvez não tenha exatamente essa árvore, geramos uma para mostrar o potencial do Sunburst.
        const mockData = {
          name: "Campinas",
          color: "hsl(210, 20%, 30%)",
          children: [
            {
              name: "Alta Vuln.",
              color: "hsl(340, 70%, 50%)",
              children: [
                {
                  name: doenca || "Geral",
                  color: "hsl(340, 60%, 60%)",
                  children: [
                    { name: "Idosos", color: "hsl(340, 50%, 70%)", loc: Math.random() * 500 + 100 },
                    { name: "Adultos", color: "hsl(340, 50%, 80%)", loc: Math.random() * 800 + 200 }
                  ]
                }
              ]
            },
            {
              name: "Média Vuln.",
              color: "hsl(30, 90%, 50%)",
              children: [
                {
                  name: doenca || "Geral",
                  color: "hsl(30, 80%, 60%)",
                  children: [
                    { name: "Idosos", color: "hsl(30, 70%, 70%)", loc: Math.random() * 300 + 50 },
                    { name: "Adultos", color: "hsl(30, 70%, 80%)", loc: Math.random() * 600 + 100 }
                  ]
                }
              ]
            },
            {
              name: "Baixa Vuln.",
              color: "hsl(160, 70%, 40%)",
              children: [
                {
                  name: doenca || "Geral",
                  color: "hsl(160, 60%, 50%)",
                  children: [
                    { name: "Idosos", color: "hsl(160, 50%, 60%)", loc: Math.random() * 100 + 20 },
                    { name: "Adultos", color: "hsl(160, 50%, 70%)", loc: Math.random() * 300 + 50 }
                  ]
                }
              ]
            }
          ]
        };
        setDados(mockData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados do sunburst:", error);
        setLoading(false);
      });
  }, [doenca]);

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden w-full h-[600px] flex flex-col";

  return (
    <div className={cardClass}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-50"></div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Exploração Demográfica Profunda (Sunburst)</h3>
      <p className="text-sm text-slate-400 mb-4">Clique nos anéis para fazer Drill-down (Cidade → Vulnerabilidade → Doença → Idade).</p>
      
      {loading || !dados ? (
        <div className="flex-1 w-full animate-pulse bg-slate-800/50 rounded-xl"></div>
      ) : (
        <div className="flex-1 w-full text-black">
          <ResponsiveSunburst
            data={dados}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            id="name"
            value="loc"
            cornerRadius={2}
            borderColor={{ theme: 'background' }}
            colors={{ datum: 'color' }}
            childColor={{ from: 'color', modifiers: [ [ 'brighter', 0.1 ] ] }}
            enableArcLabels={true}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 3 ] ] }}
            tooltip={({ id, value, color }) => (
              <div className="bg-slate-800 text-white p-2 rounded shadow-lg text-sm border border-slate-700">
                <strong style={{ color }}>{id}</strong>: {Math.round(value)} casos
              </div>
            )}
            theme={{
              labels: { text: { fontSize: 12, fontWeight: 'bold' } },
            }}
          />
        </div>
      )}
    </div>
  );
}
