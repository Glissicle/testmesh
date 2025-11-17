import React, { useState, useEffect, useMemo } from 'react';
import type { JournalEntry, EditableContent } from '../types';
import Card from './common/Card';
import InlineEditable from './common/InlineEditable';
import ConfirmationModal from './common/ConfirmationModal';
import EmptyState from './common/EmptyState';

const JournalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15.25V8.25A2.25 2.25 0 015.25 6h13.5A2.25 2.25 0 0121 8.25v7zM6 18v2m12-2v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75h.008v.008h-.008v-.008zM12 6.75h.008v.008h-.008v-.008zM8.25 6.75h.008v.008h-.008v-.008z" /></svg>;

interface JournalProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  editableContent: EditableContent;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const Journal: React.FC<JournalProps> = ({ entries, setEntries, editableContent, setEditableContent }) => {
  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Effect to ensure today's entry exists and an entry is active
  useEffect(() => {
    let entryForToday = entries.find(e => e.date === todayISO);
    let currentEntries = entries;
    if (!entryForToday) {
      const newEntry: JournalEntry = { id: Date.now().toString(), date: todayISO, content: '' };
      currentEntries = [newEntry, ...entries];
      setEntries(currentEntries);
      setActiveEntryId(newEntry.id);
    } else if (!activeEntryId && entries.length > 0) {
      // If no active entry is set, default to the most recent one
      setActiveEntryId(sortedEntries[0].id);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, todayISO, setEntries]);

  const sortedEntries = useMemo(() => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [entries]);
  const activeEntry = useMemo(() => entries.find(entry => entry.id === activeEntryId), [entries, activeEntryId]);

  // Update editor content when active entry changes
  useEffect(() => {
    if (activeEntry) {
      setContent(activeEntry.content);
      setIsDirty(false); // Reset dirty state on entry switch
    } else {
      setContent('');
    }
  }, [activeEntry]);
  
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (activeEntry && newContent !== activeEntry.content) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  };

  const handleSave = () => {
    if (!activeEntry) return;
    setEntries(prev => prev.map(e => e.id === activeEntry.id ? { ...e, content } : e));
    setIsDirty(false);
  };

  const handleDeleteConfirm = () => {
    if (!activeEntry) return;
    setEntries(prev => prev.filter(e => e.id !== activeEntry.id));
    setActiveEntryId(null); // Deselect the deleted entry
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (dateString === todayISO) return "Today";
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };

  const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
    setEditableContent(prev => ({ ...prev, [key]: newValue }));
  };
  
  return (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        confirmText="Delete"
      />
      <div className="flex flex-col md:flex-row h-full gap-6">
        <Card className="w-full md:w-1/3 flex-shrink-0 flex flex-col">
          <InlineEditable as="h2" initialValue={editableContent.journalTitle} onSave={handleContentSave('journalTitle')} className="text-xl font-serif text-[var(--text-header)] mb-4" />
          {sortedEntries.length > 0 ? (
            <ul className="space-y-2 overflow-y-auto">
              {sortedEntries.map(entry => (
                  <li key={entry.id} onClick={() => setActiveEntryId(entry.id)} className={`p-3 rounded-md cursor-pointer ${activeEntry?.id === entry.id ? 'bg-amber-800/30' : 'hover:bg-[var(--bg-interactive)]/50'}`}>
                      <h3 className="font-bold">{formatDate(entry.date)}</h3>
                  </li>
              ))}
            </ul>
          ) : (
            <div className="flex-grow flex items-center justify-center">
                <p className="text-[var(--text-muted)] text-center">Your journal is empty.</p>
            </div>
          )}
        </Card>
        <Card className="flex-grow flex flex-col">
          {activeEntry ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-serif text-[var(--text-header)]">{formatDate(activeEntry.date)}</h2>
                <div className="flex items-center gap-4">
                  {isDirty && <span className="text-sm text-[var(--accent-secondary)]">Unsaved</span>}
                  <button onClick={handleSave} disabled={!isDirty} className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-1 px-4 rounded-md transition-colors disabled:bg-[var(--bg-interactive)] disabled:cursor-not-allowed">Save</button>
                  <button onClick={() => setDeleteModalOpen(true)} className="text-[var(--text-muted)] hover:text-[var(--danger-primary)]">Delete</button>
                </div>
              </div>
              <textarea
                value={content}
                onChange={e => handleContentChange(e.target.value)}
                className="flex-grow w-full bg-[var(--bg-interactive-alpha)] p-3 rounded-md text-[var(--text-primary)] resize-none border border-[var(--border-primary)] focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]"
                placeholder="How are you feeling today?"
              ></textarea>
            </>
          ) : (
            <EmptyState 
                icon={<JournalIcon />}
                title="Your Journal"
                message="This is your space for daily reflection. Your first entry for today has been created. Select it from the list to begin writing."
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default Journal;
