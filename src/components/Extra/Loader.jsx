"use client";

export default function LoadingScreen({
  message = "Cargando...",
  fullScreen = true,
}) {
  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Logo animado */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-16 h-16 border-2 border-blue-400 border-b-transparent rounded-full animate-spin animate-reverse"></div>
          </div>
        </div>

        {/* Texto de carga */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-600">Med Reminder</h2>
          <p className="text-gray-600 text-lg">{message}</p>

          {/* Barra de progreso animada */}
          <div className="w-64 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Puntos animados */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
