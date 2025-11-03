import React, { createContext } from "react";
import { toast as sonnerToast, ExternalToast } from "sonner";

interface ToastContextType {
  toast: {
    success: (message: string, data?: ExternalToast) => void;
    error: (message: string, data?: ExternalToast) => void;
    info: (message: string, data?: ExternalToast) => void;
    warning: (message: string, data?: ExternalToast) => void;
    promise: typeof sonnerToast.promise;
    custom: typeof sonnerToast.custom;
    message: typeof sonnerToast.message;
    loading: typeof sonnerToast.loading;
    dismiss: typeof sonnerToast.dismiss;
  };
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastMethods = {
    success: (message: string, data?: ExternalToast) =>
      sonnerToast.success(message, data),
    error: (message: string, data?: ExternalToast) =>
      sonnerToast.error(message, data),
    info: (message: string, data?: ExternalToast) =>
      sonnerToast.info(message, data),
    warning: (message: string, data?: ExternalToast) =>
      sonnerToast.warning(message, data),
    promise: sonnerToast.promise,
    custom: sonnerToast.custom,
    message: sonnerToast.message,
    loading: sonnerToast.loading,
    dismiss: sonnerToast.dismiss,
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
    </ToastContext.Provider>
  );
}
