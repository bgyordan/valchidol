import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import { useCMS } from '../cms/CMSContext';

export const Toast: React.FC = () => {
  const { toastMessage, setToast } = useCMS();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1A1A1A] text-[#F5F2ED] px-5 py-3.5 rounded-xs shadow-2xl border border-[#C5A059]/40 max-w-md"
          id="toast-notification"
        >
          <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0" />
          <p className="text-xs font-medium text-[#F5F2ED] flex-1">{toastMessage}</p>
          <button
            onClick={() => setToast(null)}
            className="text-[#8B8378] hover:text-[#C5A059] p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
