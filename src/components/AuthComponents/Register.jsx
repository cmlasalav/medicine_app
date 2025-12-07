"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pill } from "lucide-react";
import { RegisterUser } from "@/api/Auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [phoneValue, setPhoneValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (formData, setError) => {
    // Validar campos vacíos
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Por favor completa todos los campos");
      return false;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un correo electrónico válido");
      return false;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    // Validar coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!validateForm(formData, setError)) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Preparar datos con teléfono limpio (sin guiones, espacios, ni caracteres especiales)
      const cleanPhone = phoneValue.replace(/[^0-9]/g, "");
      const dataToSend = {
        ...formData,
        phone: `+${cleanPhone}`,
      };
      console.log(dataToSend);
      const response = await RegisterUser(dataToSend);
      if (response.error) {
        setError("Este correo ya está registrado.");
        setIsLoading(false);
        return;
      }
      // Redirect to login
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setError("Error al registrar el usuario");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Registro Exitoso!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu cuenta ha sido creada correctamente. Serás redirigido al login
              en unos segundos.
            </p>
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-green-600">Redirigiendo...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl">
              <Pill className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Pastillero Virtual
            </h1>
          </Link>
          <h2 className="text-xl font-semibold text-foreground mt-0">
            Crear Cuenta
          </h2>
          <p className="text-base text-muted-foreground mt-1">
            Comienza a gestionar tus medicamentos
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-base">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-base font-medium text-foreground"
              >
                Nombre Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-11 text-base px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-base font-medium text-foreground"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-11 text-base px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="block text-base font-medium text-foreground"
              >
                Número de Teléfono
              </label>
              <PhoneInput
                country={"cr"}
                value={phoneValue}
                onChange={(phone) => {
                  setPhoneValue(phone);
                  setFormData((prev) => ({
                    ...prev,
                    phone: phone,
                  }));
                }}
                inputProps={{
                  name: "phone",
                  required: true,
                  id: "phone",
                }}
                containerClass="phone-input-container"
                inputClass="w-full h-11 text-base px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                buttonClass="bg-muted border-input hover:bg-muted/80"
                dropdownClass="bg-card border-border text-foreground"
                searchClass="bg-background text-foreground border-input"
                enableSearch
                searchPlaceholder="Buscar país..."
                countryCodeEditable={false}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-base font-medium text-foreground"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-11 text-base px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-base font-medium text-foreground"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-11 text-base px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-base text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline transition-all duration-200"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
