"use client";

import React from "react";
import { useState } from "react";
import { UpdateData } from "../API/Admin";
import { showToast } from "@components/Extra/ToastMessage";

export default function EditUserStatusModal({ isOpen, onClose, user, onSave }) {
  const [newStatus, setNewStatus] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    setIsLoading(true);
    const updatedUser = { ...user, userStatus: newStatus };

    const response = await UpdateData(updatedUser._id, "Users", updatedUser);
    // console.log(response);
    if (response.ok) {
      showToast(response.message || "Desconocido", "success");
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 2000);
      window.location.reload();
    } else {
      showToast(response.error || "Desconocido", "error");
      setIsLoading(false);
    }
    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    if (user) setNewStatus(user.userStatus);
    setReason("");
    onClose();
  };

  const handleOpen = () => {
    if (user) {
      setNewStatus(user.userStatus);
    }
  };

  // Ejecutar cuando se abre el modal
  React.useEffect(() => {
    if (isOpen && user) {
      handleOpen();
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const statusColor = newStatus === true ? "text-green-600" : "text-red-600";
  const statusBg =
    newStatus === true
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Cambiar Estado de Usuario
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
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
        <div className="p-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Estado actual:</p>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                user.userStatus === true
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.userStatus === true ? "Activo" : "Inactivo"}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Nuevo Estado:
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={newStatus === true}
                    onChange={(e) => setNewStatus(e.target.value === "active")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    <span className="font-medium text-green-600">Activo</span> -
                    El usuario puede acceder al sistema
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={newStatus === false}
                    onChange={(e) => setNewStatus(e.target.value === "active")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    <span className="font-medium text-red-600">Inactivo</span> -
                    El usuario no puede acceder al sistema
                  </span>
                </label>
              </div>
            </div>

            {/* Status Preview */}
            <div className={`p-4 rounded-lg border ${statusBg}`}>
              <div className="flex items-center">
                <svg
                  className={`w-5 h-5 mr-2 ${statusColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {newStatus === true ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
                <span className={`text-sm font-medium ${statusColor}`}>
                  El usuario será marcado como{" "}
                  {newStatus === true ? "activo" : "inactivo"}
                </span>
              </div>
            </div>

            {/* Reason (optional) */}
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Motivo del cambio (opcional)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Describe el motivo del cambio de estado..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </div>
                ) : (
                  "Confirmar Cambio"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
