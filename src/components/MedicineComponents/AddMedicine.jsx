"use client";
import { useEffect, useState, useContext, useReducer } from "react";
import { AuthContext } from "../../context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pill, Plus, Trash2, Edit2, ArrowLeft, GripVertical } from "lucide-react";
import { GetMedicines, PostMedicines, PutMedicines } from "../../api/Medicine";
import { showToast } from "../Extra/ToastMessage";
import Loader from "../Extra/Loader";
import { formattedDate, formatForInput } from "@/components/utils/utils";
import {
  handleDragStart as utilHandleDragStart,
  handleDragEnd as utilHandleDragEnd,
  handleDragOver as utilHandleDragOver,
  handleDragLeave as utilHandleDragLeave,
  handleDrop as utilHandleDrop,
  getDraggableClasses,
  getDropZoneClasses,
} from "@/components/utils/dragDrop";

export default function MedicamentosPage() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const [medicamentos, setMedicamentos] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    name: "",
    expiration_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [draggedMedicine, setDraggedMedicine] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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

  useEffect(() => {
    getMedicineData();
  }, [isAuthenticated]);

  //#region Funciones para editar y agregar medicamentos
  const postMedicines = async (nuevoMedicamento) => {
    try {
      const response = await PostMedicines(nuevoMedicamento);
      if (response.error) {
        if (response.status === 401) {
          showToast(
            response.error ||
              "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
          setIsAuthenticated(false);
          router.push("/login");
        }
      } else {
        const medicamentoConId = { ...nuevoMedicamento, _id: response._id }; // usa el id del backend
        setMedicamentos((prev) => [...prev, medicamentoConId]);
        showToast("La medicina fue agregada con éxito", "success");
      }
    } catch (error) {
      console.error("Error al crear medicamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const editMedicines = async (editMedicine) => {
    try {
      const response = await PutMedicines(editMedicine);
      if (response.error) {
        if (response.status === 401) {
          showToast(
            response.error ||
              "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
            "error"
          );
          setIsAuthenticated(false);
          router.push("/login");
        }
      } else {
        setMedicamentos((prev) =>
          prev.map((m) =>
            m._id === response.medicine._id ? response.medicine : m
          )
        );
        showToast(
          response.message || "La medicina fue editada con éxito",
          "success"
        );
      }
    } catch (error) {
      showToast(
        response.error ||
          "Ocurrió un error. Si persiste, por favor contactate con servicio al cliente",
        "error"
      );
    }
  };

  //#endregion

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const nuevoMedicamento = {
      ...formulario,
      ...(editando ? { _id: editando } : {}),
    };
    if (editando) {
      await editMedicines(nuevoMedicamento);
    } else {
      await postMedicines(nuevoMedicamento);
    }
    setFormulario({ name: "", expiration_date: "" });
    setMostrarFormulario(false);
    setEditando(null);
    setLoading(false);
  };

  const handleEditar = (medicamento) => {
    setFormulario({
      name: medicamento.name,
      expiration_date: formatForInput(medicamento.expiration_date),
    });
    setEditando(medicamento._id);
    setMostrarFormulario(true);
  };

  const handleNuevo = () => {
    setFormulario({ name: "", expiration_date: "" });
    setEditando(null);
    setMostrarFormulario(true);
  };

  const handleGoToReminders = (medicineId = null) => {
    if (medicineId) {
      router.push(`/reminders?medicineId=${medicineId}`);
    } else {
      router.push("/reminders");
    }
  };

  //#region Drag and Drop Handlers
  const handleDragStart = (e, medicamento) => {
    utilHandleDragStart(e, medicamento, setDraggedMedicine);
  };

  const handleDragEnd = () => {
    utilHandleDragEnd(setDraggedMedicine, setIsDraggingOver);
  };

  const handleDragOver = (e) => {
    utilHandleDragOver(e, setIsDraggingOver);
  };

  const handleDragLeave = (e) => {
    utilHandleDragLeave(e, setIsDraggingOver);
  };

  const handleDrop = (e) => {
    utilHandleDrop(
      e,
      (medicineId) => handleGoToReminders(medicineId),
      setIsDraggingOver,
      setDraggedMedicine
    );
  };
  //#endregion

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 text-base sm:text-lg"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            Volver al inicio
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-primary/10 p-3 sm:p-4 rounded-2xl">
                <Pill className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  Mis Medicamentos
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-1">
                  Gestiona tu lista de medicamentos
                </p>
              </div>
            </div>

            {!mostrarFormulario && (
              <button
                onClick={handleNuevo}
                className="w-full sm:w-auto bg-primary text-primary-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                Agregar Medicamento
              </button>
            )}
          </div>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
              {editando ? "Editar Medicamento" : "Nuevo Medicamento"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                >
                  Nombre del Medicamento *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formulario.name}
                  onChange={(e) =>
                    setFormulario({ ...formulario, name: e.target.value })
                  }
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                  placeholder="Ej: Aspirina"
                />
              </div>
              <div>
                <label
                  htmlFor="expiration_date"
                  className="block text-base sm:text-lg font-semibold text-foreground mb-2"
                >
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  id="expiration_date"
                  required
                  value={formulario.expiration_date}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      expiration_date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 text-base sm:text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                />
              </div>

              {/* <div>
                <label
                  htmlFor="dosis"
                  className="block text-lg font-semibold text-foreground mb-2"
                >
                  Dosis *
                </label>
                <input
                  type="text"
                  id="dosis"
                  required
                  value={formulario.dosis}
                  onChange={(e) =>
                    setFormulario({ ...formulario, dosis: e.target.value })
                  }
                  className="w-full px-4 py-4 text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                  placeholder="Ej: 100mg"
                />
              </div>

              <div>
                <label
                  htmlFor="frecuencia"
                  className="block text-lg font-semibold text-foreground mb-2"
                >
                  Frecuencia *
                </label>
                <select
                  id="frecuencia"
                  required
                  value={formulario.frecuencia}
                  onChange={(e) =>
                    setFormulario({ ...formulario, frecuencia: e.target.value })
                  }
                  className="w-full px-4 py-4 text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                >
                  <option value="">Seleccionar frecuencia</option>
                  <option value="Cada 4 horas">Cada 4 horas</option>
                  <option value="Cada 6 horas">Cada 6 horas</option>
                  <option value="Cada 8 horas">Cada 8 horas</option>
                  <option value="Cada 12 horas">Cada 12 horas</option>
                  <option value="Una vez al día">Una vez al día</option>
                  <option value="Dos veces al día">Dos veces al día</option>
                  <option value="Tres veces al día">Tres veces al día</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="notas"
                  className="block text-lg font-semibold text-foreground mb-2"
                >
                  Notas e Instrucciones
                </label>
                <textarea
                  id="notas"
                  value={formulario.notas}
                  onChange={(e) =>
                    setFormulario({ ...formulario, notas: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-4 text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground resize-none"
                  placeholder="Ej: Tomar con comida, evitar alcohol, etc."
                />
              </div> */}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    editando ? "Guardar Cambios" : "Agregar Medicamento"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setEditando(null);
                    setFormulario({
                      name: "",
                      expiration_date: "",
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

        {/* Lista de Medicamentos */}
        <div className="space-y-4">
          {medicamentos.length === 0 ? (
            <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center">
              <Pill className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">
                No hay medicamentos agregados aún
              </p>
              <p className="text-lg text-muted-foreground mt-2">
                Haz clic en "Agregar Medicamento" para comenzar
              </p>
            </div>
          ) : (
            <>
              {/* Instrucciones de drag and drop - Solo en desktop */}
              <div className="hidden md:block bg-accent/10 border border-accent/30 rounded-xl p-4 mb-4">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">💡 Tip:</span> Arrastra cualquier medicina al botón 
                  "Crear Recordatorios" para crear un recordatorio automáticamente
                </p>
              </div>
              
              {medicamentos.map((medicamento) => (
              <div
                key={medicamento._id}
                draggable
                onDragStart={(e) => handleDragStart(e, medicamento)}
                onDragEnd={handleDragEnd}
                className={getDraggableClasses(
                  draggedMedicine,
                  medicamento,
                  "bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                  <div className="flex items-start flex-1">
                    {/* Drag Handle Indicator - Solo en desktop */}
                    <div className="hidden md:flex items-center mr-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <GripVertical className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground break-words">
                          {medicamento.name}
                        </h3>
                      </div>

                      <div className="space-y-1 sm:space-y-2 sm:ml-11">
                        <p className="text-sm sm:text-base md:text-lg text-foreground">
                          <span className="font-semibold">
                            Fecha de vencimiento:
                          </span>{" "}
                          {formattedDate(medicamento.expiration_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:ml-4">
                    <button
                      onClick={() => handleEditar(medicamento)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="flex-1 sm:flex-initial bg-secondary text-secondary-foreground px-4 py-2 sm:p-3 rounded-lg hover:bg-secondary/80 transition-all duration-300 flex items-center justify-center gap-2"
                      aria-label="Editar medicamento"
                    >
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">Editar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </>
          )}
        </div>

        {/* Link a Recordatorios con Drop Zone */}
        {medicamentos.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={getDropZoneClasses(
                isDraggingOver,
                "block sm:inline-block transition-all duration-300",
                "block sm:inline-block transition-all duration-300 scale-110"
              )}
            >
              <button
                onClick={() => handleGoToReminders()}
                className={getDropZoneClasses(
                  isDraggingOver,
                  "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl",
                  "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ring-4 ring-primary/50 scale-105"
                )}
              >
                {isDraggingOver ? (
                  <>
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                    <span className="hidden sm:inline">Suelta aquí para crear recordatorio</span>
                    <span className="sm:hidden">Suelta para crear</span>
                  </>
                ) : (
                  <>Crear Recordatorios</>
                )}
              </button>
            </div>
            {draggedMedicine && (
              <p className="hidden md:block text-sm text-muted-foreground mt-4 animate-pulse">
                Arrastra "{draggedMedicine.name}" al botón para crear un recordatorio
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
