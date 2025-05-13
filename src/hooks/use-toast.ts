
import { toast as sonnerToast } from "sonner";

// Define types for our toast functions
type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

// Create combined function to handle both approaches
function toastFunction(props: ToastProps): void;
function toastFunction(title: string, props?: ToastProps): void;
function toastFunction(titleOrProps: string | ToastProps, maybeProps?: ToastProps): void {
  // If first argument is an object, it's props
  if (typeof titleOrProps === 'object') {
    const { title, description, variant } = titleOrProps;
    if (variant === 'destructive') {
      sonnerToast.error(title || '', { description });
    } else {
      sonnerToast.success(title || '', { description });
    }
  } 
  // If first argument is a string, it's the title
  else if (typeof titleOrProps === 'string') {
    if (maybeProps?.variant === 'destructive') {
      sonnerToast.error(titleOrProps, { description: maybeProps?.description });
    } else {
      sonnerToast.success(titleOrProps, { description: maybeProps?.description });
    }
  }
}

// Create a toast object that can be called directly or via methods
export const toast = Object.assign(
  toastFunction,
  {
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
  }
);

// Create a hook for accessing the toast functionality
export const useToast = () => {
  return {
    toast,
    // For compatibility with existing toast system
    toasts: [] as any[],
  };
};
