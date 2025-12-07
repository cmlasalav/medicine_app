"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pill } from "lucide-react";
import { LoginUser } from "@/api/Auth";
import { AuthContext } from "../../context/authContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(async () => {
      try {
        const userData = {
          email,
          password,
        };
        const response = await LoginUser(userData);
        console.log(response);
        if (response.error) {
          setError(response.error);
          setIsLoading(false);
          return;
        }
        setIsAuthenticated(true);
        router.push("/dashboard");
      } catch (err) {
        setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl">
              <Pill className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Pastillero Virtual
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-foreground mt-6">
            Iniciar Sesión
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Bienvenido de vuelta
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive text-destructive px-6 py-4 rounded-lg text-lg">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label
                htmlFor="email"
                className="block text-xl font-medium text-foreground"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 text-lg px-4 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="password"
                className="block text-xl font-medium text-foreground"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 text-lg px-4 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* <div className="flex items-center justify-between text-base">
              <Link
                href="/recuperar"
                className="text-primary hover:underline transition-all duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-xl font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-lg text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline transition-all duration-200"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
