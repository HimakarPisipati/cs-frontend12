import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle, CheckCircle2, Info, HelpCircle } from "lucide-react";
import { Button } from "./button";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  type?: "success" | "error" | "warning" | "info" | "question";
  confirmText?: string;
  cancelText?: string;
  showConfirm?: boolean;
}

export function CustomModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = "info",
  confirmText = "Confirm",
  cancelText,
  showConfirm = true
}: CustomModalProps) {
  
  const finalCancelText = cancelText || (showConfirm ? "Cancel" : "Done");
  
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-12 h-12 text-green-500" />;
      case "error":
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-12 h-12 text-orange-500" />;
      case "question":
        return <HelpCircle className="w-12 h-12 text-blue-500" />;
      default:
        return <Info className="w-12 h-12 text-blue-500" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "success":
        return "bg-green-100 dark:bg-green-900/30";
      case "error":
        return "bg-red-100 dark:bg-red-900/30";
      case "warning":
        return "bg-orange-100 dark:bg-orange-900/30";
      case "question":
        return "bg-blue-100 dark:bg-blue-900/30";
      default:
        return "bg-blue-100 dark:bg-blue-900/30";
    }
  };

  const getConfirmBtnColor = () => {
    switch (type) {
      case "error":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-orange-600 hover:bg-orange-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 pt-10 text-center">
              {/* Icon Area */}
              <div className={`w-20 h-20 ${getIconBg()} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {getIcon()}
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 rounded-xl font-bold border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {finalCancelText}
                </Button>
                {showConfirm && (
                  <Button
                    onClick={() => {
                      if (onConfirm) onConfirm();
                      onClose();
                    }}
                    className={`flex-1 h-12 rounded-xl font-bold text-white shadow-lg shadow-black/10 ${getConfirmBtnColor()}`}
                  >
                    {confirmText}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
