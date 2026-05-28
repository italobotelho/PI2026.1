"use client";

import { useState, useEffect, useRef } from 'react';
import api from '@/app/services/api';
import dynamic from 'next/dynamic';

// O ForceGraph2D precisa ser importado dinamicamente com SSR desligado, pois usa canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function NetworkGraph({ doenca }: { doenca: string }) {
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const graphRef = useRef<any>();

  useEffect(() => {
    setLoading(true);
    // Simular busca de dados de rede
    api.get('/dashboard/resumo', { params: { doenca } })
      .then(res => {
        // Mock de rede (Bairros -> Hospitais)
        const nodes = [
          { id: 'Hospital das Clínicas', group: 1, val: 20 },
          { id: 'UPA Campo Grande', group: 1, val: 15 },
          { id: 'Hospital PUC-Campinas', group: 1, val: 25 },
          { id: 'Bairro Alto Vulnerabilidade A', group: 2, val: 5 },
          { id: 'Bairro Alto Vulnerabilidade B', group: 2, val: 8 },
          { id: 'Bairro Média Vulnerabilidade C', group: 3, val: 4 },
          { id: 'Bairro Baixa Vulnerabilidade D', group: 4, val: 2 },
        ];
        
        const links = [
          { source: 'Bairro Alto Vulnerabilidade A', target: 'Hospital das Clínicas', value: 10 },
          { source: 'Bairro Alto Vulnerabilidade B', target: 'Hospital PUC-Campinas', value: 15 },
          { source: 'Bairro Média Vulnerabilidade C', target: 'UPA Campo Grande', value: 5 },
          { source: 'Bairro Alto Vulnerabilidade A', target: 'UPA Campo Grande', value: 8 },
          { source: 'Bairro Baixa Vulnerabilidade D', target: 'Hospital das Clínicas', value: 2 },
        ];

        setDados({ nodes, links });
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados da rede:", error);
        setLoading(false);
      });
  }, [doenca]);

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden w-full h-[600px] flex flex-col";

  return (
    <div className={cardClass}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50"></div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Rede de Mobilidade em Saúde e Sobrecarga</h3>
      <p className="text-sm text-slate-400 mb-4">Mapeamento de deslocação de pacientes (Bairros → Hospitais). Arraste os nós para explorar.</p>
      
      {loading || !dados ? (
        <div className="flex-1 w-full animate-pulse bg-slate-800/50 rounded-xl"></div>
      ) : (
        <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-700/50 relative bg-[#0b1120]">
          <ForceGraph2D
            ref={graphRef}
            graphData={dados}
            nodeLabel="id"
            nodeColor={(node: any) => {
              if (node.group === 1) return '#3b82f6'; // Hospitais = Azul
              if (node.group === 2) return '#e11d48'; // Bairro Alto = Vermelho
              if (node.group === 3) return '#f59e0b'; // Bairro Médio = Amarelo
              return '#10b981'; // Bairro Baixo = Verde
            }}
            nodeVal={(node: any) => node.val}
            linkColor={() => 'rgba(148, 163, 184, 0.4)'} // Slate 400 translucido
            linkWidth={(link: any) => link.value / 2}
            linkDirectionalParticles={(link: any) => link.value / 2}
            linkDirectionalParticleSpeed={0.01}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
          />
        </div>
      )}
    </div>
  );
}
