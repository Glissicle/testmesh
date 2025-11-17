import React, { useState } from 'react';
import type { Book, EditableContent } from '../types';
import Card from './common/Card';
import ProgressBar from './common/ProgressBar';
import Modal from './common/Modal';
import InlineEditable from './common/InlineEditable';
import EmptyState from './common/EmptyState';

const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

interface BooksProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  editableContent: EditableContent;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const Books: React.FC<BooksProps> = ({ books, setBooks, editableContent, setEditableContent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // States for the new book form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState<number | string>('');

  const addBook = (e: React.FormEvent) => {
    e.preventDefault();
    if(title && author && Number(totalPages) > 0) {
        const newBook: Book = {
            id: Date.now().toString(),
            title,
            author,
            totalPages: Number(totalPages),
            pagesRead: 0,
            notes: '',
        };
        setBooks([...books, newBook]);
        setIsModalOpen(false);
        setTitle('');
        setAuthor('');
        setTotalPages('');
    }
  };

  const deleteBook = (idToDelete: string) => {
    setBooks(books.filter(book => book.id !== idToDelete));
  };

  const updatePagesRead = (id: string, pages: number) => {
    setBooks(books.map(book => book.id === id ? {...book, pagesRead: Math.max(0, Math.min(pages, book.totalPages))} : book));
  };
  
  const inputClasses = "w-full bg-[var(--bg-interactive)]/50 p-2 mt-1 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]";

  const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
    setEditableContent(prev => ({ ...prev, [key]: newValue }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <InlineEditable as="h1" initialValue={editableContent.booksTitle} onSave={handleContentSave('booksTitle')} className="text-4xl font-serif text-[var(--text-header)]" />
        <button onClick={() => setIsModalOpen(true)} className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-2 px-4 rounded-md transition-colors">Add Book</button>
      </div>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <Card key={book.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                  <h2 className="text-xl font-serif text-[var(--text-header)] truncate pr-2">{book.title}</h2>
                  <p className="text-[var(--text-secondary)]">{book.author}</p>
                </div>
                <button onClick={() => deleteBook(book.id)} className="text-[var(--text-muted)] hover:text-[var(--danger-primary)] transition-colors flex-shrink-0 p-1">
                  <DeleteIcon/>
                </button>
              </div>

              <ProgressBar current={book.pagesRead} target={book.totalPages} />
              <div className="flex justify-between items-center mt-2 text-sm text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                      <input 
                          type="number" 
                          value={book.pagesRead} 
                          onChange={(e) => updatePagesRead(book.id, parseInt(e.target.value, 10) || 0)}
                          className="w-20 bg-[var(--bg-interactive)]/50 p-1 rounded-md border border-[var(--border-secondary)] text-center"
                      />
                       <span>/ {book.totalPages} pages</span>
                  </div>
                  <span>{book.totalPages > 0 ? Math.round((book.pagesRead / book.totalPages) * 100) : 0}%</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
            icon={<BookIcon />}
            title="Your Library is Empty"
            message="Add books to your reading list to track your progress and keep notes."
            action={{ text: 'Add Your First Book', onClick: () => setIsModalOpen(true) }}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a New Book">
        <form onSubmit={addBook} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)]">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className={inputClasses} />
            </div>
             <div>
                <label className="block text-sm font-medium text-[var(--text-primary)]">Author</label>
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className={inputClasses} />
            </div>
             <div>
                <label className="block text-sm font-medium text-[var(--text-primary)]">Total Pages</label>
                <input type="number" value={totalPages} onChange={e => setTotalPages(e.target.value)} required min="1" className={inputClasses} />
            </div>
            <div className="flex justify-end pt-2">
                 <button type="submit" className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-2 px-4 rounded-md transition-colors">Add to List</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default Books;
