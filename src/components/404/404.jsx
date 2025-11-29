import Link from "next/link";
import { Pill } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8 flex justify-center">
          <div className="bg-muted p-8 rounded-3xl">
            <Pill className="w-32 h-32 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Página No Encontrada
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="text-xl px-10 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-200 w-full sm:w-auto">
              Volver al Inicio
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="text-xl px-10 py-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-all duration-200 w-full sm:w-auto">
              Ir al Dashboard
            </button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-card rounded-2xl border-2 border-border">
          <p className="text-lg text-muted-foreground">
            ¿Necesitas ayuda? Contacta con soporte o regresa a la página
            principal.
          </p>
        </div>
      </div>
    </div>
  );
}
