import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeftOnRectangle as LogOut, HiXMark as X } from 'react-icons/hi2';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Confirm Logout",
  message = "Are you sure you want to log out of your account? You will need to sign in again to access your dashboard.",
  confirmLabel = "Log Out",
  cancelLabel = "Cancel"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="p-10">
              
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {message}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-5 px-6 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 border border-slate-200 transition-all uppercase tracking-widest text-xs"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-5 px-6 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/25 uppercase tracking-widest text-xs"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;
