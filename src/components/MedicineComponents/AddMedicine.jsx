"use client";
import { useEffect, useState, useContext, useReducer } from "react";
import { AuthContext } from "../../context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pill, Plus, Trash2, Edit2, ArrowLeft } from "lucide-react";
import { GetMedicines, PostMedicines, PutMedicines } from "../../api/Medicine";
import { showToast } from "../Extra/ToastMessage";
import Loader from "../Extra/Loader";
import { formattedDate, formatForInput } from "@/components/utils/utils";

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

  const getMedicineData = async () => {
    if (isAuthenticated) {
      try {
        const response = await GetMedicines();
        if (response) {
          console.log(response);
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
    console.log(nuevoMedicamento);
    try {
      const response = await PostMedicines(nuevoMedicamento);
      // console.log("Respuesta del backend:", response);
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
      console.log("Respuesta del backend:", response);
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

  const handleGoToReminders = () => {
    router.push("/reminders");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 text-lg"
          >
            <ArrowLeft className="w-6 h-6" />
            Volver al inicio
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Pill className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Mis Medicamentos
                </h1>
                <p className="text-xl text-muted-foreground mt-1">
                  Gestiona tu lista de medicamentos
                </p>
              </div>
            </div>

            {!mostrarFormulario && (
              <button
                onClick={handleNuevo}
                className="bg-primary text-primary-foreground px-6 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-6 h-6" />
                Agregar Medicamento
              </button>
            )}
          </div>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-card border-2 border-border rounded-2xl p-8 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {editando ? "Editar Medicamento" : "Nuevo Medicamento"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-lg font-semibold text-foreground mb-2"
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
                  className="w-full px-4 py-4 text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                  placeholder="Ej: Aspirina"
                />
              </div>
              <div>
                <label
                  htmlFor="expiration_date"
                  className="block text-lg font-semibold text-foreground mb-2"
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
                  className="w-full px-4 py-4 text-lg border-2 border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
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

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  className="flex-1 bg-muted text-muted-foreground px-6 py-4 rounded-xl text-lg font-semibold hover:bg-muted/80 transition-all duration-300"
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
            medicamentos.map((medicamento) => (
              <div
                key={medicamento._id}
                className="bg-card border-2 border-border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Pill className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {medicamento.name}
                      </h3>
                    </div>

                    <div className="space-y-2 ml-11">
                      <p className="text-lg text-foreground">
                        <span className="font-semibold">
                          Fecha de vencimiento:
                        </span>{" "}
                        {formattedDate(medicamento.expiration_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditar(medicamento)}
                      className="bg-secondary text-secondary-foreground p-3 rounded-lg hover:bg-secondary/80 transition-all duration-300"
                      aria-label="Editar medicamento"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    {/* <button
                      onClick={() => handleEliminar(medicamento._id)}
                      className="bg-destructive/10 text-destructive p-3 rounded-lg hover:bg-destructive/20 transition-all duration-300"
                      aria-label="Eliminar medicamento"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Link a Recordatorios */}
        {medicamentos.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleGoToReminders}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Crear Recordatorios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
