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
    api.get('/dashboard/hospitais', { params: { doenca } })
      .then(res => {
        const hospitais = res.data;
        
        // Hub and Spoke model: Central Node (Disease/Campinas) -> Hospitals
        const centralNodeId = doenca || 'Campinas (Geral)';
        const nodes: any[] = [{ id: centralNodeId, group: 0, val: 30 }]; // Root node
        const links: any[] = [];
        
        hospitais.forEach((h: any, index: number) => {
          // Apenas hospitais com nome definido e mais de 1 caso para não poluir
          if (h.hospital && h.total_casos > 0) {
            // Group 1 para hospitais com internações, Group 2 sem internações
            const group = h.hospitalizacoes > 0 ? 1 : 2;
            nodes.push({ 
              id: h.hospital, 
              group: group, 
              val: Math.max(2, Math.min(20, h.total_casos / 10)), // Size scaling
              casos: h.total_casos,
              internacoes: h.hospitalizacoes
            });
            
            links.push({
              source: h.hospital,
              target: centralNodeId,
              value: Math.max(1, Math.min(10, h.total_casos / 50)) // Link width scaling
            });
          }
        });

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
            nodeLabel={(node: any) => {
              if (node.group === 0) return node.id;
              return `${node.id} - Casos: ${node.casos} | Internações: ${node.internacoes}`;
            }}
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
