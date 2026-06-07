import { Info, Database, Code, Users } from 'lucide-react';

export default function SobrePage() {
  return (
    <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Sobre o <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Projeto</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          Entenda a metodologia, as fontes de dados e os objetivos por trás do Sistema de Inteligência Epidemiológica e Socio-Territorial.
        </p>
      </div>

      <div className="space-y-12">
        {/* Contexto */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              <Info className="h-6 w-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Contexto e Objetivo</h2>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              O SIEST foi desenvolvido como parte do Projeto Integrador (PI2026.1) da PUC. O objetivo central é fornecer uma ferramenta de <strong>Apoio à Decisão Médica e Gestão Pública</strong> capaz de analisar o impacto socioespacial e climático no espalhamento de doenças infectocontagiosas.
            </p>
            <p>
              Em cenários de surtos (como Dengue e Zika), a sobrecarga do sistema de saúde é frequentemente assimétrica — bairros e Unidades de Pronto Atendimento (UPAs) específicos colapsam antes de outros. O SIEST mapeia essas vulnerabilidades.
            </p>
          </div>
        </section>

        {/* Fontes de Dados */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-rose-500/20 p-3 rounded-xl">
              <Database className="h-6 w-6 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Fontes de Dados e Imputação</h2>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Os dados epidemiológicos são baseados no <strong>SINAN (Sistema de Informação de Agravos de Notificação)</strong>, anonimizados para proteção da privacidade dos pacientes.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl my-4">
              <h3 className="text-amber-400 font-bold mb-2">Desafios de Qualidade (Data Quality)</h3>
              <p className="text-sm text-amber-200/90">
                Diversas fichas do SINAN chegam incompletas. Para viabilizar as análises matemáticas (como o grafo de sobrecarga e mapas de calor), algoritmos de <em>Imputação Estatística</em> foram aplicados. Por exemplo: fichas sem registro da Unidade de Saúde foram alocadas para a unidade central mais provável, gerando visualizações que explicitam essa falha de notificação.
              </p>
            </div>
          </div>
        </section>

        {/* Tecnologia */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-500/20 p-3 rounded-xl">
              <Code className="h-6 w-6 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Arquitetura Tecnológica</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li><strong>Frontend:</strong> Next.js (React), Tailwind CSS, Nivo Charts e Leaflet para renderização geoespacial avançada.</li>
            <li><strong>Backend:</strong> FastAPI (Python) com integração robusta de manipulação geométrica via Shapely.</li>
            <li><strong>Banco de Dados:</strong> MongoDB via driver Motor para consultas assíncronas de alto desempenho.</li>
          </ul>
        </section>

      </div>
    </main>
  );
}
