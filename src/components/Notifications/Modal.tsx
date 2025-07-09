import React from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="bg-emerald-100 rounded-full p-3">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
        );
      case 'error':
        return (
          <div className="bg-red-100 rounded-full p-3">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        );
      case 'warning':
        return (
          <div className="bg-amber-100 rounded-full p-3">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
        );
      case 'info':
        return (
          <div className="bg-blue-100 rounded-full p-3">
            <Info className="h-8 w-8 text-blue-600" />
          </div>
        );
      case 'confirm':
        return (
          <div className="bg-indigo-100 rounded-full p-3">
            <AlertCircle className="h-8 w-8 text-indigo-600" />
          </div>
        );
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700';
      case 'error':
        return 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700';
      case 'warning':
        return 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700';
      case 'info':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
      case 'confirm':
        return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-3xl px-8 pt-8 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center sm:mx-0">
              {getIcon()}
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-6 sm:text-left flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-gray-600 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`w-full inline-flex justify-center rounded-2xl px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105 sm:w-auto ${getButtonStyles()}`}
            >
              {confirmText}
            </button>
            {type === 'confirm' && (
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-2xl border border-gray-300 px-6 py-3 bg-white text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-300 sm:mt-0 sm:w-auto"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;