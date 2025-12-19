"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

import { AuthContext } from "../../context/authContext";
import { LogoutUser, UserType } from "../../api/Auth";
import { GetAdminLogs } from "../../api/Admin";
import { showToast } from "@/components/Extra/ToastMessage";
import { formattedDate, getActionIcon, getMethodBadge } from "../utils/utils";
import LoadingScreen from "../Extra/Loader";
import LogDetailModal from "../Modals/LogDetailModal";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  //   const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  // Authentication and Admin Check
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  
  // Modal state
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const router = useRouter();

  const checkUser = async () => {
    const user = await UserType();
    if (user.ok) {
      setIsAdmin(true);
      setIsLoading(false);
      const adminData = await GetAdminLogs();
      if (!adminData.error) {
        setLogs(adminData);
        // console.log(adminData);
      } else {
        showToast(adminData.error || "Desconocido", "error");
      }
    } else {
      setIsAdmin(false);
    }
    setIsCheckingAdmin(false);
  };
  useEffect(() => {
    checkUser();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isCheckingAdmin) {
      if (!isAuthenticated || !isAdmin) {
        router.push("/404");
      }
    }
  }, [isAuthenticated, isAdmin, isCheckingAdmin, router]);

  if (isCheckingAdmin) {
    return <LoadingScreen message="Verificando permisos..." />;
  }

  if (isLoading) {
    return <LoadingScreen message="Cargando logs del sistema..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-full mx-auto">
        {/* Botón de retroceso */}
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-6 text-sm sm:text-base font-medium group"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver al Dashboard
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 sm:p-4 rounded-2xl shadow-lg">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Logs del Sistema
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-1">
                Registro de todas las actividades del sistema
              </p>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 max-w-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4 sm:ml-5">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total de Registros
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {logs.length}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-bold text-gray-900">
                Registro de Actividades
              </h3>
            </div>
          </div>

          {/* Vista de Tabla para Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{width: '12%'}}>
                    Fecha
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{width: '18%'}}>
                    Usuario
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{width: '20%'}}>
                    Acción
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{width: '38%'}}>
                    Descripción
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider" style={{width: '12%'}}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {logs.map((log, index) => (
                  <tr 
                    key={log._id} 
                    className={`transition-colors hover:bg-blue-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">
                          {formattedDate(log.timestamp)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 shadow-md flex-shrink-0">
                          {log.userId?.toString().substring(0, 2).toUpperCase() || 'UN'}
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate" title={log.userId}>
                          {log.userId}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        {getMethodBadge(log.action) ? (
                          <>
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${getMethodBadge(log.action).color} flex-shrink-0`}>
                              {getMethodBadge(log.action).method}
                            </span>
                            <div className="flex items-center space-x-1.5">
                              <svg
                                className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span className="text-sm text-gray-600 truncate">
                                {log.action.replace(/^(GET|POST|PUT|PATCH|DELETE)_?/i, '')}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-200 flex-shrink-0">
                              {getActionIcon(log.action)}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {log.action}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600 truncate" title={log.description}>
                        {log.description}
                      </p>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDetails(log)}
                        className="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista de Cards para Mobile/Tablet */}
          <div className="lg:hidden divide-y divide-gray-200">
            {logs.map((log, index) => (
              <div 
                key={log._id} 
                className={`p-4 transition-colors hover:bg-blue-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                {/* Fecha y Usuario */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-gray-600">
                      {formattedDate(log.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {log.userId?.toString().substring(0, 2).toUpperCase() || 'UN'}
                    </div>
                  </div>
                </div>

                {/* Usuario completo */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Usuario</span>
                  <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                    {log.userId}
                  </p>
                </div>

                {/* Acción */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Acción</span>
                  <div className="flex items-center space-x-2 mt-2">
                    {getMethodBadge(log.action) ? (
                      <>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getMethodBadge(log.action).color}`}>
                          {getMethodBadge(log.action).method}
                        </span>
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-gray-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm text-gray-600">
                            {log.action.replace(/^(GET|POST|PUT|PATCH|DELETE)_?/i, '')}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-200">
                          {getActionIcon(log.action)}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {log.action}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Descripción</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {log.description}
                  </p>
                </div>

                {/* Botón */}
                <button
                  onClick={() => handleViewDetails(log)}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Ver detalles completos
                </button>
              </div>
            ))}
          </div>
          
          {logs.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay logs</h3>
              <p className="mt-1 text-sm text-gray-500">No se encontraron registros de actividad.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <LogDetailModal
        log={selectedLog}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
