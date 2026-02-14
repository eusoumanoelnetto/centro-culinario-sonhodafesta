import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'confirm';
  title?: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={32} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={32} className="text-red-600" />;
      case 'warning':
      case 'confirm':
        return <AlertTriangle size={32} className="text-orange-600" />;
      default:
        return <AlertCircle size={32} className="text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      case 'warning':
      case 'confirm':
        return 'bg-orange-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'success':
        return 'Sucesso!';
      case 'error':
        return 'Erro';
      case 'warning':
        return 'Atenção';
      case 'confirm':
        return 'Confirmação';
      default:
        return 'Aviso';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getBgColor()}`}>
            {getIcon()}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 font-serif mb-2">
            {title || getDefaultTitle()}
          </h3>
          <p className="text-gray-600 text-sm whitespace-pre-line">
            {message}
          </p>
        </div>

        <div className={`flex gap-3 p-6 border-t border-gray-100 ${type === 'confirm' ? 'justify-between' : 'justify-center'}`}>
          {type === 'confirm' ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 rounded-xl bg-[#9A0000] text-white font-bold hover:bg-[#7a0000] transition-colors"
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-[#9A0000] text-white font-bold hover:bg-[#7a0000] transition-colors"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
