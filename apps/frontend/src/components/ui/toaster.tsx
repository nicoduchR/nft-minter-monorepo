'use client';

import React from "react";
import { useState, useEffect } from "react";

export type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
};

type ToasterProps = {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
};

type ToasterContextType = {
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

const ToasterContext = React.createContext<ToasterContextType | undefined>(undefined);

export function useToaster() {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return context;
}

// Type for the window with toast function
interface WindowWithToast extends Window {
  toast?: (toast: Omit<Toast, "id">) => string;
}

export const Toaster = ({ position = "top-right" }: ToasterProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const positionClasses = {
    "top-right": "fixed top-4 right-4 flex flex-col gap-2",
    "top-left": "fixed top-4 left-4 flex flex-col gap-2",
    "bottom-right": "fixed bottom-4 right-4 flex flex-col gap-2",
    "bottom-left": "fixed bottom-4 left-4 flex flex-col gap-2",
  };

  const toast = (newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = newToast.duration || 5000;
    
    setToasts((prevToasts) => [...prevToasts, { ...newToast, id }]);
    
    // Auto dismiss
    setTimeout(() => {
      dismiss(id);
    }, duration);
    
    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    // Expose toast function globally with proper type
    const windowWithToast = window as WindowWithToast;
    windowWithToast.toast = toast;
    
    return () => {
      delete windowWithToast.toast;
    };
  }, [toast]); // Include toast as a dependency

  return (
    <>
      <ToasterContext.Provider value={{ toast, dismiss }}>
        <div className={positionClasses[position]}>
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-md shadow-lg max-w-sm animate-in fade-in slide-in-from-right-5 ${
                toast.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : toast.type === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{toast.message}</span>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="ml-4 text-gray-500 hover:text-gray-800"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </ToasterContext.Provider>
    </>
  );
}; 