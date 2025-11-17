import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, target }) => {
  const percentage = target > 0 ? (current / target) * 100 : 0;

  return (
    <div className="w-full bg-[var(--bg-interactive)] rounded-full h-2.5">
      <div
        className="bg-[var(--accent-primary)] h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;