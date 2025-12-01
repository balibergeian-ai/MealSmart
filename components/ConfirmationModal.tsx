import React from 'react';
import { XIcon } from './icons/XIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-off-white">{title}</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            <XIcon className="w-6 h-6" />
          </button>
          
          <p className="text-slate-600 dark:text-slate-300">{children}</p>
          
          <div className="flex gap-4 pt-2">
            <button
              onClick={onClose}
              className="w-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-off-white font-bold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-500 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;