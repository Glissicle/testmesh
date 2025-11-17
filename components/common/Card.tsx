import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const baseClasses = "bg-[var(--bg-interactive-alpha)] border border-[var(--border-primary)] rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300";
  const clickableClasses = onClick ? "cursor-pointer hover:border-[var(--border-accent)] hover:bg-[var(--bg-secondary)]" : "";

  return (
    <div className={`${baseClasses} ${clickableClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;