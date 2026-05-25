import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-24 text-white">
      <h1 className="text-5xl font-bold mb-4">
        SIEST Dashboard
      </h1>
      <p className="text-xl text-slate-400">
        Monitoramento Epidemiológico e Climático de Campinas
      </p>
      
      <div className="mt-10 p-6 bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl text-center">
        <p className="text-lg text-emerald-400 font-mono">
          🚀 Frontend (Next.js) inicializado com sucesso!
        </p>
      </div>
    </main>
  );
}