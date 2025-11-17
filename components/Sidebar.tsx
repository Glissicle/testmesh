import React, { useState } from 'react';
import type { View, Theme, CustomThemeColors, EditableContent } from '../types';
import { NAV_ITEMS } from '../constants';
import InlineEditable from './common/InlineEditable';
import ThemeCustomizer from './ThemeCustomizer';


// ThemeSwitcher Component
const THEMES: { id: Theme; name: string; }[] = [
    { id: 'dark-academia', name: 'Dark Academia' },
    { id: 'light-academia', name: 'Light Academia' },
    { id: 'midnight-dusk', name: 'Midnight Dusk' },
    { id: 'evergreen', name: 'Evergreen' },
    { id: 'custom', name: 'Custom' },
];

const ThemeSwitcher: React.FC<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
    onCustomize: () => void;
}> = ({ theme, setTheme, onCustomize }) => {
  return (
    <div className="p-2 mt-auto">
      <label htmlFor="theme-select" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Theme</label>
      <div className="flex gap-2">
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="flex-grow bg-[var(--bg-interactive)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-md p-2 focus:ring-1 focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]"
        >
          {THEMES.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {theme === 'custom' && (
            <button onClick={onCustomize} className="bg-[var(--bg-interactive)] p-2 rounded-md hover:bg-[var(--border-secondary)]">
                Customize
            </button>
        )}
      </div>
    </div>
  );
};


interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: CustomThemeColors;
  setCustomColors: (colors: CustomThemeColors) => void;
  editableContent: EditableContent;
  setEditableContent: (content: EditableContent) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, theme, setTheme, customColors, setCustomColors, editableContent, setEditableContent }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isThemeModalOpen, setThemeModalOpen] = useState(false);

    const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
        setEditableContent({ ...editableContent, [key]: newValue });
    };

    const NavLink: React.FC<{ item: typeof NAV_ITEMS[0] }> = ({ item }) => (
        <button
            onClick={() => {
                setView(item.view);
                setMobileMenuOpen(false);
            }}
            className={`flex items-center space-x-3 w-full text-left p-3 rounded-lg transition-colors duration-200 ${
            view === item.view
                ? 'bg-amber-800/30 text-[var(--text-header)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-interactive)]/[0.5] hover:text-[var(--text-primary)]'
            }`}
        >
            {item.icon}
            <span className="font-medium">{item.label}</span>
        </button>
    );

  return (
    <>
      <ThemeCustomizer 
        isOpen={isThemeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        colors={customColors}
        onSave={setCustomColors}
      />
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm z-40 p-2 flex justify-between items-center border-b border-[var(--border-primary)]">
         <InlineEditable
            as="h1"
            initialValue={editableContent.appTitle}
            onSave={handleContentSave('appTitle')}
            className="text-xl font-serif font-bold text-[var(--text-header)] ml-2"
        />
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[var(--text-primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
        </button>
      </div>
      {/* Spacer for mobile view */}
      <div className="md:hidden h-14"></div>


      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[var(--bg-primary)]/70 border-r border-[var(--border-secondary)] p-4">
        <header className="px-2 pb-4 border-b border-[var(--border-primary)]">
           <InlineEditable
                as="h1"
                initialValue={editableContent.appTitle}
                onSave={handleContentSave('appTitle')}
                className="text-2xl font-serif font-bold text-[var(--text-header)]"
            />
          <InlineEditable
            as="p"
            initialValue={editableContent.sidebarSubtitle}
            onSave={handleContentSave('sidebarSubtitle')}
            className="text-sm text-[var(--text-muted)]"
          />
        </header>
        <nav className="flex-1 space-y-2 mt-4">
            {NAV_ITEMS.map((item) => <NavLink key={item.view} item={item} />)}
        </nav>
        <ThemeSwitcher theme={theme} setTheme={setTheme} onCustomize={() => setThemeModalOpen(true)}/>
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[var(--bg-primary)] z-30 pt-16 p-4 flex flex-col">
             <nav className="flex-1 space-y-2">
                {NAV_ITEMS.map((item) => <NavLink key={item.view} item={item} />)}
            </nav>
            <ThemeSwitcher theme={theme} setTheme={setTheme} onCustomize={() => setThemeModalOpen(true)} />
        </div>
      )}
    </>
  );
};

export default Sidebar;