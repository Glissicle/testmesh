import React, { useState, useEffect, useRef } from 'react';
import type { Writing, EditableContent } from '../types';
import Card from './common/Card';
import InlineEditable from './common/InlineEditable';
import EmptyState from './common/EmptyState';

const WritingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;

interface WritingComponentProps {
  writings: Writing[];
  setWritings: React.Dispatch<React.SetStateAction<Writing[]>>;
  editableContent: EditableContent;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const WritingComponent: React.FC<WritingComponentProps> = ({ writings, setWritings, editableContent, setEditableContent }) => {
  const [activeWriting, setActiveWriting] = useState<Writing | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeWriting) {
      setTitle(activeWriting.title);
      setContent(activeWriting.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [activeWriting]);

  useEffect(() => {
    if (activeWriting) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setWritings(
          writings.map((w) =>
            w.id === activeWriting.id ? { ...w, title, content, lastModified: Date.now() } : w
          )
        );
      }, 500); // Autosave after 500ms of inactivity
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, activeWriting]);

  const createNew = () => {
    const newWriting: Writing = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      lastModified: Date.now(),
    };
    setWritings([newWriting, ...writings]);
    setActiveWriting(newWriting);
  };

  const deleteWriting = (id: string) => {
    setWritings(writings.filter((w) => w.id !== id));
    if (activeWriting?.id === id) {
      setActiveWriting(null);
    }
  };

  const sortedWritings = [...writings].sort((a, b) => b.lastModified - a.lastModified);
  
  const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
    setEditableContent(prev => ({ ...prev, [key]: newValue }));
  };

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      <Card className="w-full md:w-1/3 flex-shrink-0 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <InlineEditable as="h2" initialValue={editableContent.writingTitle} onSave={handleContentSave('writingTitle')} className="text-xl font-serif text-[var(--text-header)]" />
          <button onClick={createNew} className="text-[var(--accent-secondary)] hover:text-[var(--accent-secondary-hover)] transition-colors text-2xl font-bold">+</button>
        </div>
        {sortedWritings.length > 0 ? (
          <ul className="space-y-2 overflow-y-auto">
            {sortedWritings.map(w => (
              <li key={w.id} onClick={() => setActiveWriting(w)} className={`p-3 rounded-md cursor-pointer ${activeWriting?.id === w.id ? 'bg-amber-800/30' : 'hover:bg-[var(--bg-interactive)]/50'}`}>
                <h3 className="font-bold truncate">{w.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] truncate">{w.content || 'No content'}</p>
              </li>
            ))}
          </ul>
        ) : (
           <div className="flex-grow flex items-center justify-center">
              <p className="text-[var(--text-muted)] text-center p-4">Click '+' to create your first note.</p>
           </div>
        )}
      </Card>
      
      <Card className="flex-grow flex flex-col">
        {activeWriting ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-serif text-[var(--text-header)] bg-transparent w-full focus:outline-none"
                placeholder="Title"
              />
              <button onClick={() => deleteWriting(activeWriting.id)} className="text-[var(--text-muted)] hover:text-[var(--danger-primary)]">Delete</button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-grow w-full bg-[var(--bg-interactive-alpha)] p-3 rounded-md text-[var(--text-primary)] resize-none border border-[var(--border-primary)] focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]"
              placeholder="Start writing..."
            ></textarea>
          </>
        ) : (
           <EmptyState 
                icon={<WritingIcon />}
                title="Your Creative Space"
                message="This is where your ideas take shape. Select a note from the list on the left, or create a new one to get started."
                action={{ text: 'Create a New Note', onClick: createNew }}
            />
        )}
      </Card>
    </div>
  );
};

export default WritingComponent;
