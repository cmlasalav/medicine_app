export default function LogDetailModal({ log, isOpen, onClose }) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Detalles del Log</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Timestamp */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Fecha y Hora
              </label>
              <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                {new Date(log.timestamp).toLocaleString("es-ES", {
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </p>
            </div>

            {/* User ID */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Usuario
              </label>
              <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                {log.userId?.name || log.userId?.email || log.userId || "N/A"}
              </p>
            </div>

            {/* Action */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Acción
              </label>
              <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg font-medium">
                {log.action}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Descripción
              </label>
              <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-3 rounded-lg whitespace-pre-wrap">
                {log.description || "Sin descripción"}
              </p>
            </div>

            {/* Method */}
            {log.method && (
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Método HTTP
                </label>
                <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      log.method === "GET"
                        ? "bg-green-100 text-green-800"
                        : log.method === "POST"
                        ? "bg-blue-100 text-blue-800"
                        : log.method === "PUT" || log.method === "PATCH"
                        ? "bg-yellow-100 text-yellow-800"
                        : log.method === "DELETE"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {log.method}
                  </span>
                </p>
              </div>
            )}

            {/* Path */}
            {log.path && (
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Ruta
                </label>
                <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg font-mono text-sm">
                  {log.path}
                </p>
              </div>
            )}

            {/* Status Code */}
            {log.statusCode && (
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Código de Estado
                </label>
                <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      log.statusCode >= 200 && log.statusCode < 300
                        ? "bg-green-100 text-green-800"
                        : log.statusCode >= 300 && log.statusCode < 400
                        ? "bg-blue-100 text-blue-800"
                        : log.statusCode >= 400 && log.statusCode < 500
                        ? "bg-yellow-100 text-yellow-800"
                        : log.statusCode >= 500
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {log.statusCode}
                  </span>
                </p>
              </div>
            )}

            {/* Response Time */}
            {log.responseTime && (
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Tiempo de Respuesta
                </label>
                <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {log.responseTime} ms
                </p>
              </div>
            )}

            {/* IP Address */}
            {log.ipAddress && (
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Dirección IP
                </label>
                <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg font-mono">
                  {log.ipAddress}
                </p>
              </div>
            )}

            {/* User Agent */}
            {log.userAgent && (
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  User Agent
                </label>
                <p className="mt-1 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm break-all">
                  {log.userAgent}
                </p>
              </div>
            )}

            {/* Error Message */}
            {log.errorMessage && (
              <div>
                <label className="text-sm font-semibold text-red-600 uppercase tracking-wider">
                  Mensaje de Error
                </label>
                <p className="mt-1 text-red-900 bg-red-50 px-4 py-3 rounded-lg border border-red-200 whitespace-pre-wrap">
                  {log.errorMessage}
                </p>
              </div>
            )}

            {/* Error Stack */}
            {log.errorStack && (
              <div>
                <label className="text-sm font-semibold text-red-600 uppercase tracking-wider">
                  Stack Trace
                </label>
                <pre className="mt-1 text-xs text-red-900 bg-red-50 px-4 py-3 rounded-lg border border-red-200 overflow-x-auto">
                  {log.errorStack}
                </pre>
              </div>
            )}

            {/* Additional Data */}
            {log.additionalData && Object.keys(log.additionalData).length > 0 && (
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Datos Adicionales
                </label>
                <pre className="mt-1 text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(log.additionalData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
