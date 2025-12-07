import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { UpdateNotificationPreference } from "../../api/User";
import { showToast } from "../Extra/ToastMessage";

export default function NotificationsPreferenceModal({
  isOpen,
  onClose,
  currentPreference,
  onPreferenceUpdated,
  setIsAuthenticated,
  router,
}) {
  const [selectedPreference, setSelectedPreference] = useState("");
  const [updatingPreference, setUpdatingPreference] = useState(false);

  useEffect(() => {
    if (isOpen && currentPreference) {
      setSelectedPreference(currentPreference);
    }
  }, [isOpen, currentPreference]);

  const handleUpdatePreference = async () => {
    if (!selectedPreference) {
      showToast("Por favor selecciona una preferencia", "error");
      return;
    }

    setUpdatingPreference(true);
    try {
      const response = await UpdateNotificationPreference(selectedPreference);
      if (response.error) {
        if (response.status === 401) {
          showToast(
            "Tu sesión expiró. Por favor, vuelve a iniciar sesión.",
            "error"
          );
          setIsAuthenticated(false);
          router.push("/login");
        } else {
          showToast(response.error, "error");
        }
      } else {
        showToast(
          "Preferencia de notificación actualizada con éxito",
          "success"
        );
        onPreferenceUpdated(selectedPreference);
        onClose();
      }
    } catch (error) {
      showToast("Error al actualizar la preferencia", "error");
    } finally {
      setUpdatingPreference(false);
    }
  };

  const handleCancel = () => {
    setSelectedPreference(currentPreference || "");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Settings className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Preferencia de Notificaciones
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-base text-muted-foreground mb-4">
            Selecciona cómo deseas recibir los recordatorios de tus
            medicamentos:
          </p>

          <div className="space-y-3">
            <label
              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedPreference === "email"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:border-primary"
              }`}
            >
              <input
                type="radio"
                name="preference"
                value="email"
                checked={selectedPreference === "email"}
                onChange={(e) => setSelectedPreference(e.target.value)}
                className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary"
              />
              <div>
                <p className="text-base font-semibold text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones por correo electrónico
                </p>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedPreference === "whatsapp"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:border-primary"
              }`}
            >
              <input
                type="radio"
                name="preference"
                value="whatsapp"
                checked={selectedPreference === "whatsapp"}
                onChange={(e) => setSelectedPreference(e.target.value)}
                className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary"
              />
              <div>
                <p className="text-base font-semibold text-foreground">
                  WhatsApp
                </p>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones por WhatsApp
                </p>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedPreference === "both"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:border-primary"
              }`}
            >
              <input
                type="radio"
                name="preference"
                value="both"
                checked={selectedPreference === "both"}
                onChange={(e) => setSelectedPreference(e.target.value)}
                className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary"
              />
              <div>
                <p className="text-base font-semibold text-foreground">Ambos</p>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones por Email y WhatsApp
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleUpdatePreference}
            disabled={updatingPreference || !selectedPreference}
            className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-base font-semibold hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updatingPreference ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                <span>Actualizando...</span>
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={updatingPreference}
            className="flex-1 bg-muted text-muted-foreground px-6 py-3 rounded-xl text-base font-semibold hover:bg-muted/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
