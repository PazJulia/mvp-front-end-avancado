import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/md-dark-deeppurple/theme.css";
import "/node_modules/primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import { ToastProvider } from "./context/ToastContext.tsx";

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
    <ToastProvider>
      <App/>
    </ToastProvider>
  </PrimeReactProvider>
)
