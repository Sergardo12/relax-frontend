// components/shared/Modal.tsx

"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  headerColor?: string;
  icon?: ReactNode;
}

export default function Modal({ 
  isOpen,
  onClose, 
  title,
  subtitle,
  children,
  size = 'lg',
  headerColor = 'from-cyan-500 to-blue-600',
  icon
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r ${headerColor} text-white p-6 rounded-t-2xl z-10`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {icon}
                <h2 className="text-2xl font-bold">{title}</h2>
              </div>
              {subtitle && (
                <p className="text-white/80 text-sm">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}