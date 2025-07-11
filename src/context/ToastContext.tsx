import { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';
import type { ToastMessage } from 'primereact/toast';

const ToastContext = createContext<{ showToast: (msg: ToastMessage) => void } | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastRef = useRef<Toast>(null);

  const showToast = (msg: ToastMessage) => {
    toastRef.current?.show(msg);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef}/>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro do ToastProvider');
  return ctx;
};