import React, { createContext, useContext } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import ToastContainer from '../components/Notifications/ToastContainer';
import Modal from '../components/Notifications/Modal';

interface NotificationContextType {
  showToast: (toast: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }) => void;
  showModal: (modal: {
    type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, modal, showToast, showModal, closeToast, closeModal } = useNotifications();

  return (
    <NotificationContext.Provider value={{ showToast, showModal }}>
      {children}
      <ToastContainer toasts={toasts} onClose={closeToast} />
      {modal && <Modal {...modal} />}
    </NotificationContext.Provider>
  );
};