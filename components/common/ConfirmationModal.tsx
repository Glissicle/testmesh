import React from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-[var(--text-secondary)]">{message}</p>
        <div className="flex justify-end gap-4 pt-4 mt-2">
          <button
            onClick={onClose}
            className="bg-[var(--bg-interactive)] hover:bg-[var(--border-secondary)] font-bold py-2 px-4 rounded-md transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-[var(--danger-primary)] hover:opacity-80 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
