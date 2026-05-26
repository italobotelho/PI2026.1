import DashboardMetrics from '../components/DashboardMetrics';
import DashboardCharts from '../components/DashboardCharts';
import DashboardMap from '../components/DashboardMap';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-900 p-8 md:p-24 text-white font-sans">
      
      {/* Cabeçalho */}
      <div className="w-full max-w-6xl mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          SIEST
        </h1>
        <p className="text-lg text-slate-400 mt-2">
          Sistema de Inteligência Epidemiológica e Socio-Territorial
        </p>
      </div>

      {/* Aqui entram os cartões interativos */}
      <DashboardMetrics />
      <DashboardCharts />
      <DashboardMap />
    </main>
  );
}