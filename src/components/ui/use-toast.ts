
import { useToast as useToastHook, toast as toastFunction } from "@/hooks/use-toast";

// Re-export the components
export const useToast = useToastHook;
export const toast = toastFunction;
