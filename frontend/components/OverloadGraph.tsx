"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import api from '@/app/services/api';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function OverloadGraph({ 
  doenca,
  filtroAno = null,
  filtroSexo = null
}: { 
  doenca: string;
  filtroAno?: number | null;
  filtroSexo?: string | null;
}) {
  const [dados, setDados] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [modoOrigem, setModoOrigem] = useState<"doenca" | "faixa_etaria">("doenca");
  const graphRef = useRef<any>();

  useEffect(() => {
    setLoading(true);
    api.get('/dashboard/grafo-sobrecarga', { 
      params: { 
        modo_origem: modoOrigem, 
        doenca, 
        ano: filtroAno, 
        sexo: filtroSexo 
      } 
    })
      .then(res => {
        setDados(res.data || { nodes: [], links: [] });
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados do grafo de sobrecarga:", error);
        setLoading(false);
      });
  }, [modoOrigem, doenca, filtroAno, filtroSexo]);

  // Posiciona os nós estaticamente para criar um Grafo Bipartido Perfeito
  const processedData = useMemo(() => {
    if (!dados || !dados.nodes || dados.nodes.length === 0) return { nodes: [], links: [] };

    // Função auxiliar para encurtar nomes de unidades longos
    const shortenName = (name: string) => {
      let s = name;
      s = s.replace(/UNIDADE DE PRONTO ATENDIMENTO/gi, 'UPA');
      s = s.replace(/HOSPITAL MUNICIPAL/gi, 'HOSP. MUN.');
      s = s.replace(/HOSPITAL E MATERNIDADE/gi, 'HOSP. E MAT.');
      s = s.replace(/HOSPITAL CLINICAS/gi, 'HC');
      s = s.replace(/UNIDADE BASICA DE SAUDE/gi, 'UBS');
      s = s.replace(/CENTRO DE SAUDE/gi, 'CS');
      s = s.replace(/CAMPINAS/gi, '');
      // Corta em 35 caracteres
      if (s.length > 35) s = s.substring(0, 32) + '...';
      return s.trim();
    };

    // Separamos as colunas e filtramos para não virar uma "parede de texto"
    let sourceNodes = dados.nodes.filter(n => n.group === 'source').sort((a, b) => b.val - a.val);
    let targetNodes = dados.nodes.filter(n => n.group === 'target').sort((a, b) => b.val - a.val);

    // CRÍTICO: Limitar a 15-20 hospitais para o texto não encavalar
    const maxTargets = 20;
    if (targetNodes.length > maxTargets) {
      targetNodes = targetNodes.slice(0, maxTargets);
    }
    
    // Filtrar os links e sources baseados nos targets que sobraram
    const validTargetIds = new Set(targetNodes.map(n => n.id));
    const links = dados.links.filter(l => validTargetIds.has(l.target));
    
    const validSourceIds = new Set(links.map(l => l.source));
    sourceNodes = sourceNodes.filter(n => validSourceIds.has(n.id));

    // Recalcular maxVal depois do filtro para manter proporção
    const maxVal = Math.max(...[...sourceNodes, ...targetNodes].map(n => n.val || 0), 1);

    // Ajuste dinâmico de espaçamento (com limite maior para evitar sobreposição)
    const espacamentoSource = Math.min(100, 500 / Math.max(sourceNodes.length, 1));
    const espacamentoTarget = Math.max(25, 600 / Math.max(targetNodes.length, 1)); // Mínimo 25px de respiro

    const finalNodes = [...sourceNodes, ...targetNodes].map(node => {
      let color = node.group === 'source' ? '#3b82f6' : '#ef4444'; 
      if (node.group === 'source' && modoOrigem === 'faixa_etaria') {
        color = '#10b981';
      }

      // Fixando posições (fx, fy)
      let fx, fy;
      if (node.group === 'source') {
        const idx = sourceNodes.findIndex(n => n.id === node.id);
        fx = -200; // Coluna da esquerda (mais próximo)
        fy = (idx - sourceNodes.length / 2) * espacamentoSource;
      } else {
        const idx = targetNodes.findIndex(n => n.id === node.id);
        fx = 200; // Coluna da direita
        fy = (idx - targetNodes.length / 2) * espacamentoTarget;
      }

      return {
        ...node,
        shortName: shortenName(node.id), // Nome encurtado para renderizar
        color,
        fx, 
        fy, 
        // Raio do nó suave
        size: Math.max(3, Math.min(18, (node.val / maxVal) * 18))
      };
    });

    return { nodes: finalNodes, links };
  }, [dados, modoOrigem]);

  const cardClass = "bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden w-full flex flex-col transition-all min-h-[650px]";

  return (
    <div className={cardClass}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10 gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Rede Neural de Sobrecarga (Top 20 Unidades)
          </h3>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Mapeia de forma orgânica quais {modoOrigem === 'doenca' ? 'doenças' : 'grupos demográficos'} estão congestionando as UPAs mais afetadas.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setModoOrigem("doenca")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              modoOrigem === "doenca" 
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
          >
            Visão Doença
          </button>
          <button
            onClick={() => setModoOrigem("faixa_etaria")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              modoOrigem === "faixa_etaria" 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
          >
            Visão Idade
          </button>
        </div>
      </div>

      <div className="flex-1 w-full relative z-10 rounded-2xl overflow-hidden border border-slate-800 bg-[#0b1121] shadow-inner">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : processedData.nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            Sem dados suficientes para gerar a rede.
          </div>
        ) : (
          <ForceGraph2D
            ref={graphRef}
            graphData={processedData}
            nodeColor="color"
            nodeRelSize={1}
            nodeVal="size"
            nodeLabel={(node: any) => `${node.id} (${node.val} casos)`}
            // Arestas curvas com mais concavidade para evitar atropelar os nomes longos
            linkCurvature={0.35}
            linkColor={() => "rgba(255, 255, 255, 0.08)"}
            linkWidth={(link: any) => Math.max(0.5, Math.min(3, link.value / 20))}
            // Partículas animadas viajando pela aresta
            linkDirectionalParticles={(link: any) => Math.max(1, Math.min(5, Math.floor(link.value / 10)))}
            linkDirectionalParticleSpeed={0.005}
            linkDirectionalParticleWidth={1.5}
            backgroundColor="transparent"
            onEngineStop={() => {
              if (graphRef.current) {
                graphRef.current.zoomToFit(200, 30);
              }
            }}
            // Custom render corrigido para não amassar os textos
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.shortName; // Usa o nome abreviado
              const fontSize = Math.max(8, 12 / globalScale); // Texto não diminui infinitamente
              ctx.font = `600 ${fontSize}px Inter, Sans-Serif`;
              const textWidth = ctx.measureText(label).width;

              ctx.beginPath();
              ctx.arc(node.x, node.y, node.size || 5, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.color;
              ctx.fill();
              ctx.lineWidth = 1 / globalScale;
              ctx.strokeStyle = '#0b1121'; // Borda escura para dar contraste
              ctx.stroke();

              ctx.textBaseline = 'middle';
              
              if (node.group === 'source') {
                ctx.textAlign = 'right';
                // Cria um fundo sutil escuro para dar leitura ao texto da origem se a aresta passar por trás
                ctx.fillStyle = 'rgba(11, 17, 33, 0.6)';
                ctx.fillRect(node.x - node.size - textWidth - 6, node.y - fontSize/2 - 2, textWidth + 4, fontSize + 4);
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillText(label, node.x - node.size - 4, node.y);
              } else {
                ctx.textAlign = 'left';
                // Cor do texto de destino um pouco menos brilhante para não ofuscar
                ctx.fillStyle = 'rgba(203, 213, 225, 0.8)';
                ctx.fillText(label, node.x + node.size + 4, node.y);
              }
            }}
          />
        )}
      </div>
      
      {!loading && processedData.nodes.length > 0 && (
        <div className="relative z-10 mt-4 text-xs text-slate-400 flex justify-between">
          <span>Dica: Use o scroll para dar zoom e navegue pela teia estruturada.</span>
        </div>
      )}
    </div>
  );
}
