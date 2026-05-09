import { useEffect, useState } from 'react';
import './ToastManager.css';

interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const ToastManager = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const newToast: Toast = {
        id: Date.now(),
        message: e.detail.message,
        type: e.detail.type || 'info',
      };
      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener('app-toast', handleToast);
    return () => window.removeEventListener('app-toast', handleToast);
  }, []);

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastManager;
