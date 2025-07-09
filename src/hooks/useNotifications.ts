import { useState, useCallback } from 'react';
import { ToastProps } from '../components/Notifications/Toast';
import { ModalProps } from '../components/Notifications/Modal';

interface NotificationHook {
  toasts: ToastProps[];
  modal: ModalProps | null;
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  showModal: (modal: Omit<ModalProps, 'isOpen' | 'onClose'>) => Promise<boolean>;
  closeToast: (id: string) => void;
  closeModal: () => void;
}

export const useNotifications = (): NotificationHook => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [modal, setModal] = useState<ModalProps | null>(null);
  const [modalResolve, setModalResolve] = useState<((value: boolean) => void) | null>(null);

  const showToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString();
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: (toastId: string) => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const showModal = useCallback((modalData: Omit<ModalProps, 'isOpen' | 'onClose'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalResolve(() => resolve);
      setModal({
        ...modalData,
        isOpen: true,
        onClose: () => {
          setModal(null);
          resolve(false);
        },
        onConfirm: modalData.onConfirm ? () => {
          if (modalData.onConfirm) modalData.onConfirm();
          setModal(null);
          resolve(true);
        } : undefined
      });
    });
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    if (modalResolve) {
      modalResolve(false);
      setModalResolve(null);
    }
  }, [modalResolve]);

  return {
    toasts,
    modal,
    showToast,
    showModal,
    closeToast,
    closeModal
  };
};