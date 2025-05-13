
import { toast as sonnerToast } from "sonner";

// Define types for our toast functions
type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Create a function to handle toast notifications
export const toast = {
  success: (message: string, options?: ToastProps) => {
    return sonnerToast.success(message, options);
  },
  error: (message: string, options?: ToastProps) => {
    return sonnerToast.error(message, options);
  },
  info: (message: string, options?: ToastProps) => {
    return sonnerToast.info(message, options);
  },
  warning: (message: string, options?: ToastProps) => {
    return sonnerToast.warning(message, options);
  },
};

// Create a hook for accessing the toast functionality
export const useToast = () => {
  return {
    toast,
    // For compatibility with existing toast system
    toasts: [] as any[],
  };
};
