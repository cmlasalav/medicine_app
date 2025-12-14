"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { showToast } from "../Extra/ToastMessage";
import {
  Bell,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  Clock,
  Settings,
} from "lucide-react";
import { GetMedicines } from "../../api/Medicine";
import { GetUserData } from "../../api/User";
import {
  formattedDate,
  getMedicationName,
  getPriorityString,
  formatDateForInput,
  formatForInput,
} from "@/components/utils/utils";
import {
  GetTreatments,
  PostTreatment,
  PatchTreatment,
  DeleteTreatment,
} from "../../api/Treatment";
import DeleteConfirmationModal from "../Modals/ConfirmationModal";
import NotificationsPreferenceModal from "../Modals/NotificationsPreferenceModal";

const diasSemana = [
  { id: "lun", nombre: "Lun" },
  { id: "mar", nombre: "Mar" },
  { id: "mie", nombre: "Mié" },
  { id: "jue", nombre: "Jue" },
  { id: "vie", nombre: "Vie" },
  { id: "sab", nombre: "Sáb" },
  { id: "dom", nombre: "Dom" },
];

export default function RecordatoriosPage() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [medicamentos, setMedicamentos] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);
  const [deletingReminder, setDeletingReminder] = useState(false);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formulario, setFormulario] = useState({
    medicationId: "",
    type_dose: "",
    startHour: "",
    day_week: [],
    startDate: "",
    endDate: "",
    priority: "",
    quantity_per_dose: "",
    interval_hour: "",
    dose_quantity: "",
    treatment_status: true,
  });

  useEffect(() => {
    getMedicineData();
    getRemindersData();
    getUserInfo();
  }, [isAuthenticated]);

  // Efecto para detectar medicineId en la URL y abrir formulario
  useEffect(() => {
    const medicineId = searchParams.get("medicineId");
    if (medicineId && medicamentos.length > 0) {
      // Verificar que la medicina existe
      const medicineExists = medicamentos.find((m) => m._id === medicineId);
      if (medicineExists) {
        setFormulario((prev) => ({
          ...prev,
          medicationId: medicineId,
        }));
        setMostrarFormulario(true);
        showToast(
          `Creando recordatorio para ${medicineExists.name}`,
          "success"
        );
      }
    }
  }, [searchParams, medicamentos]);

  //#region API Calls
  const getMedicineData = async () => {
    if (isAuthenticated) {
      try {
        const response = await GetMedicines();
        if (response) {
          setMedicamentos(response);
        } else {
          showToast(
            response.message ||
              "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
        }
      } catch (error) {
        showToast(
          error.message ||
            "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
          "error"
        );
      }
    } else {
      router.push("/login");
    }
  };

  const getRemindersData = async () => {
    if (isAuthenticated) {
      try {
        const response = await GetTreatments();
        if (response) {
          setRecordatorios(response);
        } else {
          showToast(
            response.message ||
              "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
        }
      } catch (error) {
        showToast(
          error.message ||
            "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
          "error"
        );
      }
    } else {
      router.push("/login");
    }
  };
  //#endregion

  //#region API Actions
  const editReminder = async (editando) => {
    try {
      const response = await PatchTreatment(formulario, editando);
      if (response.error) {
        if (response.status === 401) {
          showToast(
            response.error ||
              "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
          setIsAuthenticated(false);
          router.push("/login");
        } else {
          showToast(
            "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
        }
      } else {
        showToast("El recordatorio fue actualizado con éxito", "success");
        setRecordatorios(
          recordatorios.map((rec) => (rec._id === editando ? response : rec))
        );
        setEditando(null);
      }
    } catch (error) {
      showToast(
        response.message ||
          "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
        "error"
      );
    }
  };

  const postReminder = async () => {
    try {
      const response = await PostTreatment(formulario);
      if (response.error) {
        if (response.status === 401) {
          showToast(
            response.error ||
              "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
          setIsAuthenticated(false);
          router.push("/login");
        } else {
          showToast(
            "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
        }
      } else if (response.status === 201) {
        const newReminder = { ...formulario, _id: response.data._id }; // usa el id del backend
        setRecordatorios((prev) => [...prev, newReminder]);
        showToast("El recordatorio fue agregado con éxito", "success");
      }
    } catch (error) {
      console.error("Error al crear medicamento:", error);
    } finally {
      setLoading(false);
    }
  };
  //#endregion

  //#region Form Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de fechas
    if (
      formulario.endDate &&
      formulario.startDate &&
      formulario.endDate < formulario.startDate
    ) {
      showToast(
        "La fecha de fin no puede ser anterior a la fecha de inicio",
        "error"
      );
      setLoading(false);
      return;
    }

    const medicamento = medicamentos.find(
      (m) => m._id === formulario.medicationId
    );
    if (!medicamento) {
      showToast("Por favor selecciona un medicamento", "error");
      setLoading(false);
      return;
    }

    // Validación de medicamento vencido
    const medicationExpirationDate = new Date(medicamento.expiration_date);
    const startDate = new Date(formulario.startDate);
    const endDate = formulario.endDate ? new Date(formulario.endDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    if (medicationExpirationDate < startDate) {
      showToast(
        "No puedes crear un recordatorio para un medicamento que estará vencido en la fecha de inicio",
        "error"
      );
      setLoading(false);
      return;
    }

    if (endDate && medicationExpirationDate < endDate) {
      showToast(
        "No puedes crear un recordatorio para un medicamento que estará vencido antes de la fecha de fin",
        "error"
      );
      setLoading(false);
      return;
    }

    if (medicationExpirationDate < today) {
      showToast(
        "Este medicamento ya está vencido. No puedes crear recordatorios para medicamentos vencidos",
        "error"
      );
      setLoading(false);
      return;
    }

    // Validación específica para dosis cada X horas
    if (formulario.type_dose === "every_x_hours" && !formulario.interval_hour) {
      showToast(
        "Debes especificar cada cuántas horas para la dosis cada X horas",
        "error"
      );
      setLoading(false);
      return;
    }

    if (editando) {
      await editReminder(editando);
    } else {
      await postReminder();
    }

    setFormulario({
      medicationId: "",
      type_dose: "",
      startHour: "",
      day_week: [],
      startDate: "",
      endDate: "",
      priority: "",
      quantity_per_dose: "",
      interval_hour: "",
    });
    setMostrarFormulario(false);
    setLoading(false);
  };

  const handleEditar = (recordatorio) => {
    setFormulario({
      medicationId: recordatorio.medicationId,
      type_dose: recordatorio.type_dose || "",
      startHour: recordatorio.startHour,
      day_week: recordatorio.day_week,
      startDate: formatDateForInput(recordatorio.startDate),
      endDate: formatDateForInput(recordatorio.endDate),
      priority: getPriorityString(recordatorio.priority),
      quantity_per_dose: recordatorio.quantity_per_dose || "",
      interval_hour: recordatorio.interval_hour || "",
    });
    setEditando(recordatorio._id);
    setMostrarFormulario(true);
  };
  //#endregion

  const handleDeleteClick = (recordatorio) => {
    setReminderToDelete(recordatorio);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!reminderToDelete) return;
    setDeletingReminder(true);
    try {
      const response = await DeleteTreatment(reminderToDelete._id);
      if (response.error) {
        if (response.status === 401) {
          showToast(
            response.error ||
              "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
          setIsAuthenticated(false);
          router.push("/login");
        } else {
          showToast(
            "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
        }
      } else {
        setRecordatorios(
          recordatorios.filter((rec) => rec._id !== reminderToDelete._id)
        );
        showToast("Recordatorio eliminado con éxito", "success");
      }
    } catch (error) {
      showToast("Error al eliminar el recordatorio", "error");
    } finally {
      setDeletingReminder(false);
      setShowDeleteModal(false);
      setReminderToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReminderToDelete(null);
  };

  const getUserInfo = async () => {
    if (isAuthenticated) {
      try {
        const response = await GetUserData();
        if (response && !response.error) {
          setUserData(response);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    }
  };

  const handleOpenPreferenceModal = () => {
    if (userData) {
      setShowPreferenceModal(true);
    }
  };

  const handlePreferenceUpdated = (newPreference) => {
    setUserData((prev) => ({
      ...prev,
      notificationPreference: newPreference,
    }));
  };

  const handleClosePreferenceModal = () => {
    setShowPreferenceModal(false);
  };

  const toggleActivo = (id) => {
    setRecordatorios(
      recordatorios.map((rec) =>
        rec._id === id
          ? { ...rec, treatment_status: !rec.treatment_status }
          : rec
      )
    );
  };

  const toggleDia = (dia) => {
    if (formulario.type_dose === "weekly") {
      // For weekly dose, only allow selecting one day
      setFormulario({
        ...formulario,
        day_week: [dia], // Replace the array with only the selected day
      });
    } else {
      // For other dose types, allow multiple selection (though they're auto-managed)
      setFormulario({
        ...formulario,
        day_week: formulario.day_week.includes(dia)
          ? formulario.day_week.filter((d) => d !== dia)
          : [...formulario.day_week, dia],
      });
    }
  };

  const handleNuevo = () => {
    setFormulario({
      medicationId: "",
      type_dose: "",
      startHour: "",
      day_week: [],
      startDate: "",
      endDate: "",
      priority: "",
      quantity_per_dose: "",
      interval_hour: "",
    });
    setEditando(null);
    setMostrarFormulario(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/10">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/medicine"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 text-base sm:text-lg"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            Volver a Mis Medicamentos
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-accent/20 p-3 sm:p-4 rounded-2xl">
                <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  Mis Recordatorios
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-1">
                  Configura tus alarmas de medicamentos
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenPreferenceModal}
                className="w-full sm:w-auto bg-secondary text-secondary-foreground px-4 py-3 sm:py-4 rounded-xl text-base font-semibold hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                title="Cambiar preferencia de notificación"
              >
                <Settings className="w-5 h-5" />
                Preferencias
              </button>

              {!mostrarFormulario && (
                <button
                  onClick={handleNuevo}
                  className="w-full sm:w-auto bg-accent text-accent-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-accent/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  Nuevo Recordatorio
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
              {editando ? "Editar Recordatorio" : "Nuevo Recordatorio"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Indicador cuando viene desde drag and drop */}
              {searchParams.get("medicineId") && formulario.medicationId && (
                <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 flex items-center gap-3">
                  <Bell className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Medicamento preseleccionado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {
                        medicamentos.find(
                          (m) => m._id === formulario.medicationId
                        )?.name
                      }
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="medicamento"
                  className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                >
                  Medicamento *
                </label>
                <select
                  id="medicamento"
                  required
                  value={formulario.medicationId}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      medicationId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background text-foreground"
                >
                  <option value="">Seleccionar medicamento</option>
                  {medicamentos.map((med) => (
                    <option key={med._id} value={med._id}>
                      {med.name} - Fecha de vencimiento:{" "}
                      {formattedDate(med.expiration_date)}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground mt-2">
                  ¿No encuentras tu medicamento?{" "}
                  <Link
                    href="/medicine"
                    className="text-primary hover:underline"
                  >
                    Agrégalo aquí
                  </Link>
                </p>
                {/* Dose Type */}
                <div className="mt-4">
                  <label
                    htmlFor="dose"
                    className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                  >
                    Tipo de Dosis *
                  </label>
                  <select
                    id="dose"
                    required
                    value={formulario.type_dose}
                    onChange={(e) => {
                      const newtype_dose = e.target.value;
                      setFormulario({
                        ...formulario,
                        type_dose: newtype_dose,
                        // Auto-select all days for daily and every_x_hours
                        day_week:
                          newtype_dose === "diary" ||
                          newtype_dose === "every_x_hours"
                            ? ["lun", "mar", "mie", "jue", "vie", "sab", "dom"]
                            : newtype_dose === "weekly"
                            ? []
                            : formulario.day_week,
                        // Reset interval hour when changing dose type
                        interval_hour:
                          newtype_dose === "every_x_hours" ? "" : "",
                      });
                    }}
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background text-foreground"
                  >
                    <option value="">Seleccionar el tipo de dosis</option>
                    <option value="diary">Dosis Diaria</option>
                    <option value="weekly">Dosis Semanal</option>
                    <option value="every_x_hours">Dosis Cada X horas</option>
                  </select>
                </div>
              </div>
              {/* Prioridad */}
              <div className="mt-4">
                <label
                  htmlFor="priority"
                  className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                >
                  Tipo de Prioridad *
                </label>
                <select
                  id="priority"
                  required
                  value={formulario.priority}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      priority: e.target.value,
                    })
                  }
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background text-foreground"
                >
                  <option value="">Seleccionar el tipo de prioridad</option>
                  <option value="high">Prioridad Alta</option>
                  <option value="mid">Prioridad Media</option>
                  <option value="low">Prioridad Baja</option>
                </select>
              </div>

              {/* Cantidad de pastillas */}
              <div className="mt-4">
                <label
                  htmlFor="quantity_per_dose"
                  className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                >
                  Cantidad de pastillas *
                </label>
                <input
                  type="number"
                  id="quantity_per_dose"
                  required
                  min="1"
                  max="50"
                  value={formulario.quantity_per_dose}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      quantity_per_dose: e.target.value,
                    })
                  }
                  placeholder="Ej: 2"
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background text-foreground"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Ingresa la cantidad de pastillas que debes tomar por dosis
                </p>
              </div>

              {/* StartDate */}
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                >
                  Fecha de inicio *
                </label>
                <input
                  type="date"
                  id="startDate"
                  required
                  value={formulario.startDate}
                  onChange={(e) =>
                    setFormulario({ ...formulario, startDate: e.target.value })
                  }
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background text-foreground"
                />
              </div>
              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                >
                  Fecha de fin
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formulario.endDate}
                  min={formulario.startDate || undefined}
                  onChange={(e) =>
                    setFormulario({ ...formulario, endDate: e.target.value })
                  }
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background text-foreground"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Opcional - Deja vacío para recordatorio sin fecha de fin
                  {/* {formulario.startDate && (
                    <span className="block text-xs text-muted-foreground mt-1">
                      La fecha de fin debe ser igual o posterior a la fecha de inicio
                    </span>
                  )} */}
                </p>
              </div>
              <div>
                <label
                  htmlFor="hora"
                  className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                >
                  Hora del Recordatorio *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <input
                    type="time"
                    id="hora"
                    required
                    value={formulario.startHour}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        startHour: e.target.value,
                      })
                    }
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Interval Hours - Only show for "every_x_hours" dose type */}
              {formulario.type_dose === "every_x_hours" && (
                <div>
                  <label
                    htmlFor="interval_hour"
                    className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                  >
                    Cada cuántas horas *
                  </label>
                  <input
                    type="number"
                    id="interval_hour"
                    required
                    min="1"
                    max="24"
                    value={formulario.interval_hour}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        interval_hour: e.target.value,
                      })
                    }
                    placeholder="Ej: 8 (cada 8 horas)"
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-background text-foreground"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Especifica cada cuántas horas debes tomar el medicamento
                    (1-24 horas)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-base sm:text-lg font-semibold text-foreground mb-3">
                  {formulario.type_dose === "weekly"
                    ? "Día de la Semana *"
                    : "Días de la Semana *"}
                  {(formulario.type_dose === "diary" ||
                    formulario.type_dose === "every_x_hours") && (
                    <span className="block sm:inline text-xs sm:text-sm font-normal text-muted-foreground sm:ml-2 mt-1 sm:mt-0">
                      (Seleccionados automáticamente)
                    </span>
                  )}
                  {formulario.type_dose === "weekly" && (
                    <span className="block sm:inline text-xs sm:text-sm font-normal text-muted-foreground sm:ml-2 mt-1 sm:mt-0">
                      (Selecciona solo un día)
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                  {diasSemana.map((dia) => (
                    <button
                      key={dia.id}
                      type="button"
                      onClick={() => {
                        // Only allow manual selection for weekly dose type
                        if (formulario.type_dose === "weekly") {
                          toggleDia(dia.id);
                        }
                      }}
                      disabled={
                        formulario.type_dose === "diary" ||
                        formulario.type_dose === "every_x_hours"
                      }
                      className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 ${
                        formulario.day_week.includes(dia.id)
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      } ${
                        formulario.type_dose === "diary" ||
                        formulario.type_dose === "every_x_hours"
                          ? "cursor-not-allowed opacity-75"
                          : "cursor-pointer"
                      }`}
                    >
                      {dia.nombre}
                    </button>
                  ))}
                </div>
                {formulario.type_dose === "weekly" &&
                  formulario.day_week.length === 0 && (
                    <p className="text-sm text-destructive mt-2">
                      Selecciona un día para la dosis semanal
                    </p>
                  )}
                {formulario.type_dose === "" &&
                  formulario.day_week.length === 0 && (
                    <p className="text-sm text-destructive mt-2">
                      Primero selecciona el tipo de dosis
                    </p>
                  )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (formulario.type_dose === "weekly" &&
                      formulario.day_week.length === 0) ||
                    (formulario.type_dose === "every_x_hours" &&
                      !formulario.interval_hour) ||
                    !formulario.type_dose
                  }
                  className="flex-1 bg-accent text-accent-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin"></div>
                      <span>Procesando...</span>
                    </>
                  ) : editando ? (
                    "Guardar Cambios"
                  ) : (
                    "Crear Recordatorio"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setEditando(null);
                    setFormulario({
                      medicationId: "",
                      type_dose: "",
                      startHour: "",
                      day_week: [],
                      startDate: "",
                      endDate: "",
                      priority: "",
                      quantity_per_dose: "",
                      interval_hour: "",
                    });
                  }}
                  className="flex-1 bg-muted text-muted-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-muted/80 transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Recordatorios */}
        <div className="space-y-4">
          {recordatorios.length === 0 ? (
            <div className="bg-card border-2 border-dashed border-border rounded-2xl p-8 sm:p-12 text-center">
              <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg sm:text-xl text-muted-foreground">
                No hay recordatorios configurados aún
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">
                Haz clic en "Nuevo Recordatorio" para comenzar
              </p>
            </div>
          ) : (
            recordatorios.map((recordatorio) => (
              <div
                key={recordatorio._id}
                className={`bg-card border-2 rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 ${
                  recordatorio.treatment_status
                    ? "border-accent"
                    : "border-border opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div
                        className={`p-2 rounded-lg ${
                          recordatorio.treatment_status
                            ? "bg-accent/20"
                            : "bg-muted"
                        }`}
                      >
                        <Bell
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            recordatorio.treatment_status
                              ? "text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground break-words">
                          {getMedicationName(
                            recordatorio.medicationId,
                            medicamentos
                          )}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {recordatorio.startHour}
                        </p>
                      </div>
                    </div>

                    <div className="sm:ml-11">
                      <div className="flex flex-wrap gap-2">
                        {recordatorio.day_week.map((diaId) => {
                          const dia = diasSemana.find((d) => d.id === diaId);
                          return (
                            <span
                              key={diaId}
                              className="px-2 sm:px-3 py-1 bg-accent/10 text-accent rounded-lg text-xs sm:text-sm font-semibold"
                            >
                              {dia?.nombre}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:ml-4">
                    <button
                      onClick={() => toggleActivo(recordatorio._id)}
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                        recordatorio.treatment_status
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {recordatorio.treatment_status ? "Activo" : "Inactivo"}
                    </button>
                    <button
                      onClick={() => handleEditar(recordatorio)}
                      className="bg-secondary text-secondary-foreground p-2 sm:p-3 rounded-lg hover:bg-secondary/80 transition-all duration-300"
                      aria-label="Editar recordatorio"
                    >
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(recordatorio)}
                      className="bg-destructive/10 text-destructive p-2 sm:p-3 rounded-lg hover:bg-destructive/20 transition-all duration-300"
                      aria-label="Eliminar recordatorio"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          itemType="reminder"
          itemData={
            reminderToDelete
              ? `${getMedicationName(
                  reminderToDelete.medicationId,
                  medicamentos
                )} - ${reminderToDelete.startHour}`
              : ""
          }
          isLoading={deletingReminder}
        />

        {/* Notification Preference Modal */}
        <NotificationsPreferenceModal
          isOpen={showPreferenceModal}
          onClose={handleClosePreferenceModal}
          currentPreference={userData?.notificationPreference}
          onPreferenceUpdated={handlePreferenceUpdated}
          setIsAuthenticated={setIsAuthenticated}
          router={router}
        />
      </div>
    </div>
  );
}
