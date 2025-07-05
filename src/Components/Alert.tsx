import { useToast } from "../context/ToastContext.tsx";

type ToastType = 'success' | 'error' | 'warn' | 'info';

export const useAppToast = () => {
  const { showToast } = useToast();

  return (type: ToastType, detail: string, summary?: string) => {
    showToast({
      severity: type,
      summary: summary ?? (type === 'success' ? 'Sucesso' : 'Aviso'),
      detail,
      life: 3000,
    });
  };
};