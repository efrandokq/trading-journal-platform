import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  children: React.ReactNode;
  submitLabel?: string;
  submitDisabled?: boolean;
  loading?: boolean;
}

export default function Modal({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = 'Sauvegarder',
  submitDisabled = false,
  loading = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <div className="mb-6">{children}</div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-dark-tertiary hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            disabled={submitDisabled || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold transition"
          >
            {loading ? 'Traitement...' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
