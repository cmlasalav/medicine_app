import { X, AlertCircle, Info } from "lucide-react";

export default function ProductionInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 rounded-t-2xl relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Información de Producción
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-lg"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Banner Principal */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">
                  🚀 Este es un Prototipo
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Esta aplicación es un proyecto de demostración educativa. Algunas funcionalidades están limitadas en el entorno de producción debido a restricciones técnicas y de hosting.
                </p>
              </div>
            </div>
          </div>

          {/* Limitación 1: WhatsApp */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Notificaciones por WhatsApp
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">
                  Las notificaciones por WhatsApp <span className="font-semibold text-red-600">no están disponibles en producción</span> debido a que se utiliza <span className="font-semibold">Twilio</span> como ejemplo de integración.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">💡 Nota técnica:</span> Twilio requiere una cuenta de pago y configuración de números verificados para funcionar en producción. Esta implementación es solo demostrativa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Limitación 2: Correos */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 transition-colors">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Notificaciones por Correo Electrónico
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">
                  El envío de correos electrónicos <span className="font-semibold text-red-600">no está disponible en producción</span> debido a que los <span className="font-semibold">cron jobs</span> no se pueden ejecutar en los intervalos de tiempo deseados por limitaciones del hosting gratuito.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-purple-800">
                    <span className="font-semibold">💡 Nota técnica:</span> Los servicios de hosting gratuitos limitan la frecuencia de ejecución de tareas programadas. Un servidor dedicado permitiría enviar notificaciones en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Funcionalidades Disponibles */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 p-2 rounded-lg flex-shrink-0">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-green-900 mb-3">
                  ✅ Funcionalidades Disponibles
                </h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span>Gestión completa de medicamentos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span>Creación y edición de recordatorios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span>Sistema de autenticación seguro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span>Panel administrativo con logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span>Interfaz responsive y moderna</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Para más información sobre la implementación técnica, consulta la documentación del proyecto.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
