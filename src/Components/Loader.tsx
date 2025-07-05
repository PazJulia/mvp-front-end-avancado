import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useRef, useState } from 'react';

interface AppLoaderProps {
  show: boolean;
  fullscreen?: boolean;
}

const Loader = ({ show, fullscreen = true }: AppLoaderProps) => {
  const MIN_DURATION = 500; // tempo mínimo de exibição em ms
  const [visible, setVisible] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (show) {
      startTimeRef.current = Date.now();
      setVisible(true);
    } else {
      const now = Date.now();
      const elapsed = startTimeRef.current ? now - startTimeRef.current : 0;
      const remaining = MIN_DURATION - elapsed;

      if (remaining > 0) {
        timeoutRef.current = setTimeout(() => setVisible(false), remaining);
      } else {
        setVisible(false);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [show]);

  if (!visible) return null;

  return (
    <div className={fullscreen ? 'app-loader-overlay' : 'app-loader-inline'}>
      <ProgressSpinner
        style={{ width: '50px', height: '50px' }}
        strokeWidth="4"
        aria-label="Carregando"
      />
    </div>
  );
};

export default Loader;
