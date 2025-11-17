import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
  return (
    <div className="text-center p-10 flex flex-col items-center border-2 border-dashed border-[var(--border-primary)] rounded-lg">
      <div className="text-[var(--text-muted)] w-16 h-16 mb-4">{icon}</div>
      <h3 className="text-xl font-serif text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] mb-6 max-w-sm">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-2 px-6 rounded-md transition-colors"
        >
          {action.text}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
