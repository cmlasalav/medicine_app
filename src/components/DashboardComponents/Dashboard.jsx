"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Pill, Bell, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { AuthContext } from "../../context/authContext";
import { LogoutUser, UserType } from "@/api/Auth";
import { GetUserData } from "@/api/User";
import ProductionInfoModal from "../Modals/ProductionInfoModal";
import {
  formattedDate,
  getMedicationName,
  getPriorityString,
  formatDateForInput,
  formatForInput,
} from "@/components/utils/utils";

const diasSemana = [
  { id: "lun", nombre: "Lun" },
  { id: "mar", nombre: "Mar" },
  { id: "mie", nombre: "Mié" },
  { id: "jue", nombre: "Jue" },
  { id: "vie", nombre: "Vie" },
  { id: "sab", nombre: "Sáb" },
  { id: "dom", nombre: "Dom" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [userName, setUserName] = useState("Usuario");
  const [isAdmin, setIsAdmin] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [showProductionInfo, setShowProductionInfo] = useState(false);

  //Admin check
  const checkUser = async () => {
    const user = await UserType();
    if (user.ok) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    getUserData();
  };

  //Get User Data
  const getUserData = async () => {
    const data = await GetUserData();
    if (data) {
      setUserName(data.userName);
      setMedicamentos(data.medicines);
      setReminders(data.reminders);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    checkUser();
  }, [isAuthenticated]);

  const handleAdminAccess = () => {
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/404");
    }
  };

  const handleAddMedicine = () => {
    router.push("/medicine");
  };

  const handleGoToReminders = () => {
    router.push("/reminders");
  };

  const handleToggleMedicamento = (id) => {
    setMedicamentos(
      medicamentos.map((med) =>
        med.id === id ? { ...med, tomado: !med.tomado } : med
      )
    );
  };

  const handleLogout = async () => {
    await LogoutUser();
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <header className="bg-card border-b-2 border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <Pill className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                Pastillero Virtual
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {isAuthenticated ? (
                <>
                  <span className="hidden sm:block text-gray-700">
                    Bienvenido
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    {isAdmin && (
                      <button
                        onClick={handleAdminAccess}
                        className="bg-blue-600 text-white px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Panel Admin
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="bg-gray-600 text-white px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 sm:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Hola, {userName || "Carlos"}
          </h2>
          <p className="text-xl text-muted-foreground">
            Aquí está tu pastillero de hoy
          </p>
        </div>

        {/* Banner Informativo de Producción */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500 p-2 rounded-lg flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-bold text-amber-900 mb-1">
                🚀 Prototipo Educativo
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 mb-2">
                Esta aplicación tiene limitaciones en producción. Las notificaciones por WhatsApp y correo tienen restricciones técnicas.
              </p>
              <button
                onClick={() => setShowProductionInfo(true)}
                className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors"
              >
                Leer información importante →
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary p-4 rounded-xl">
                <Pill className="w-10 h-10" />
              </div>
              <div>
                <p className="text-base text-muted-foreground">
                  Total Medicamentos
                </p>
                <p className="text-4xl font-bold text-foreground">
                  {medicamentos.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 text-secondary p-4 rounded-xl">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-base text-muted-foreground">Tomados Hoy</p>
                <p className="text-4xl font-bold text-foreground">
                  {reminders.length - reminders.filter((r) => r.tomado).length}
                  {/* Check */}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 text-accent p-4 rounded-xl">
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
              <div>
                <p className="text-base text-muted-foreground">Pendientes</p>
                <p className="text-4xl font-bold text-foreground">
                  {reminders.length - reminders.filter((r) => r.tomado).length}
                  {/* Check */}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Mis Medicamentos
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground">
                Marca cuando tomes cada medicamento
              </p>
            </div>
            <button
              className="text-sm sm:text-base lg:text-lg px-4 py-2 sm:px-6 sm:py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-200 whitespace-nowrap"
              onClick={handleAddMedicine}
            >
              Agregar Medicamento
            </button>
          </div>

          <div className="space-y-4">
            {medicamentos.map((medicamento) => (
              <div
                key={medicamento._id}
                className={`bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                      <Pill className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-semibold text-foreground">
                        {medicamento.name}
                      </h4>
                      <p className="text-lg text-muted-foreground">
                        Fecha de Vencimiento:{" "}
                        {formattedDate(medicamento.expiration_date)}
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-4">
                    {medicamento.tomado && (
                      <span className="text-lg font-medium text-secondary flex items-center gap-2">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Tomado
                      </span>
                    )}
                    <button
                      onClick={() => handleToggleMedicamento(medicamento.id)}
                      className={`text-lg px-8 py-3 rounded-md transition-all duration-200 ${
                        medicamento.tomado
                          ? "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {medicamento.tomado ? "Desmarcar" : "Marcar como Tomado"}
                    </button> 
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Recordatorios */}
        <div className="mt-8 bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Mis Recordatorios
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground">
                Recordatorios activos de medicamentos
              </p>
            </div>
            <button
              className="text-sm sm:text-base lg:text-lg px-4 py-2 sm:px-6 sm:py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
              onClick={handleGoToReminders}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Gestionar</span> Recordatorios
            </button>
          </div>

          <div className="space-y-4">
            {reminders && reminders.length > 0 ? (
              reminders.map((recordatorio) => (
                <div
                  key={recordatorio._id}
                  className={`bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-md`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-accent/20 p-3 rounded-xl">
                        <Bell className="w-8 h-8 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-foreground">
                          {getMedicationName(
                            recordatorio.medicationId,
                            medicamentos
                          )}
                        </h4>
                        <div className="flex items-center gap-2 text-lg text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {recordatorio.startHour}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4" />
                          {recordatorio.startDate && (
                            <span>
                              Desde: {formattedDate(recordatorio.startDate)}
                            </span>
                          )}
                          {recordatorio.endDate && (
                            <span className="ml-2">
                              Hasta: {formattedDate(recordatorio.endDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-wrap gap-2">
                        {recordatorio.day_week &&
                          recordatorio.day_week.map((diaId) => {
                            const dia = diasSemana.find((d) => d.id === diaId);
                            return (
                              <span
                                key={diaId}
                                className="px-2 py-1 bg-accent/10 text-accent rounded-lg text-xs font-semibold"
                              >
                                {dia?.nombre}
                              </span>
                            );
                          })}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            recordatorio.priority === 1 ||
                            recordatorio.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : recordatorio.priority === 2 ||
                                recordatorio.priority === "mid"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {recordatorio.priority === 1 ||
                          recordatorio.priority === "high"
                            ? "Alta"
                            : recordatorio.priority === 2 ||
                              recordatorio.priority === "mid"
                            ? "Media"
                            : "Baja"}
                        </span>
                        {recordatorio.quantity_per_dose && (
                          <span className="text-sm text-muted-foreground">
                            {recordatorio.quantity_per_dose} pastilla
                            {recordatorio.quantity_per_dose > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">
                  No hay recordatorios configurados
                </p>
                <p className="text-lg text-muted-foreground mt-2">
                  Haz clic en "Gestionar Recordatorios" para crear uno
                </p>
              </div>
            )}
          </div>
        </div>

        {reminders > 0 && (
          <div className="mt-8 p-8 bg-accent/10 border-2 border-accent rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-accent text-accent-foreground p-4 rounded-xl">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-foreground mb-1">
                  Recordatorio
                </h4>
                <p className="text-xl text-muted-foreground">
                  Tienes {reminders} medicamento
                  {reminders > 1 ? "s" : ""} pendiente
                  {reminders > 1 ? "s" : ""} por tomar hoy
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Production Information Modal */}
        <ProductionInfoModal
          isOpen={showProductionInfo}
          onClose={() => setShowProductionInfo(false)}
        />
      </div>
    </div>
  );
}
