import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ show, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-maroon-800 to-maroon-900 border-2 border-gold-400 text-ivory-50 shadow-gold-glow-lg backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-400">
            <Check className="w-4 h-4 text-gold-300" />
          </div>
          <div>
            <div className="flex items-center space-x-1 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>शुभ दीपावली</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-ivory-100">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

