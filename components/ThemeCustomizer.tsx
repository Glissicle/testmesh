import React, { useState } from 'react';
import Modal from './common/Modal';
import type { CustomThemeColors } from '../types';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  colors: CustomThemeColors;
  onSave: (newColors: CustomThemeColors) => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose, colors, onSave }) => {
  const [currentColors, setCurrentColors] = useState(colors);

  const handleChange = (key: keyof CustomThemeColors, value: string) => {
    setCurrentColors(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(currentColors);
    onClose();
  };

  const ColorInput: React.FC<{ label: string; colorKey: keyof CustomThemeColors }> = ({ label, colorKey }) => (
    <div className="flex items-center justify-between">
      <label htmlFor={colorKey} className="text-[var(--text-primary)]">{label}</label>
      <input
        type="color"
        id={colorKey}
        name={colorKey}
        value={currentColors[colorKey]}
        onChange={(e) => handleChange(colorKey, e.target.value)}
        className="w-24 h-8 p-1 bg-[var(--bg-interactive)] border border-[var(--border-secondary)] rounded cursor-pointer"
      />
    </div>
  );

  const colorConfig: {label: string; key: keyof CustomThemeColors}[] = [
    { label: 'Primary Background', key: '--bg-primary' },
    { label: 'Secondary Background', key: '--bg-secondary' },
    { label: 'Interactive Background', key: '--bg-interactive' },
    { label: 'Primary Border', key: '--border-primary' },
    { label: 'Secondary Border', key: '--border-secondary' },
    { label: 'Primary Text', key: '--text-primary' },
    { label: 'Secondary Text', key: '--text-secondary' },
    { label: 'Muted Text', key: '--text-muted' },
    { label: 'Header Text', key: '--text-header' },
    { label: 'Primary Accent', key: '--accent-primary' },
    { label: 'Accent Hover', key: '--accent-primary-hover' },
    { label: 'Secondary Accent', key: '--accent-secondary' },
  ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize Your Theme">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {colorConfig.map(c => <ColorInput key={c.key} label={c.label} colorKey={c.key} />)}
      </div>
      <div className="flex justify-end pt-4 mt-4 border-t border-[var(--border-primary)]">
        <button onClick={handleSave} className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-2 px-4 rounded-md transition-colors">
          Save & Apply
        </button>
      </div>
    </Modal>
  );
};

export default ThemeCustomizer;
