import Link from "next/link";
import { Pill } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 md:mb-20">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl">
              <Pill className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Pastillero Virtual
            </h1>
          </div>
          <Link href="/login">
            <button className="text-lg px-6 py-3 bg-transparent border-2 border-input rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 font-medium">
              Iniciar Sesión
            </button>
          </Link>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Gestiona tus Medicamentos de Forma Simple
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty">
            Una aplicación diseñada para personas mayores y sus cuidadores.
            Nunca olvides tomar tus medicamentos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="text-xl px-10 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-semibold w-full sm:w-auto shadow-md hover:shadow-lg">
                Comenzar Ahora
              </button>
            </Link>
            <Link href="/login">
              <button className="text-xl px-10 py-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all duration-200 font-semibold w-full sm:w-auto shadow-md hover:shadow-lg">
                Ya tengo cuenta
              </button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          <div className="bg-card text-card-foreground p-8 rounded-xl border border-border shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="bg-primary/10 text-primary p-4 rounded-xl w-fit mb-6">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Recordatorios
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Recibe alertas cuando sea hora de tomar tus medicamentos
            </p>
          </div>

          <div className="bg-card text-card-foreground p-8 rounded-xl border border-border shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="bg-secondary/10 text-secondary p-4 rounded-xl w-fit mb-6">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Historial
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Lleva un registro completo de todos tus medicamentos
            </p>
          </div>

          <div className="bg-card text-card-foreground p-8 rounded-xl border border-border shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="bg-accent/10 text-accent p-4 rounded-xl w-fit mb-6">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Para Cuidadores
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Los cuidadores pueden monitorear y ayudar fácilmente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
