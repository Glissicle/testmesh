import React, { useState } from 'react';
import { generateLearningContent } from '../services/geminiService';
import Card from './common/Card';
import type { EditableContent } from '../types';
import InlineEditable from './common/InlineEditable';

interface LearnResult {
  articles: { title: string; link: string; snippet: string; }[];
  videos: { title: string; link: string; description: string; }[];
}

interface LearnProps {
    editableContent: EditableContent;
    setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const YoutubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-red-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.73,18.78 17.93,18.84C17.13,18.91 16.44,18.94 15.84,18.94L15,19C12.81,19 11.2,18.84 10.17,18.56C9.27,18.31 8.69,17.73 8.44,16.83C8.31,16.36 8.22,15.73 8.16,14.93C8.09,14.13 8.06,13.44 8.06,12.84L8,12C8,9.81 8.16,8.2 8.44,7.17C8.69,6.27 9.27,5.69 10.17,5.44C10.64,5.31 11.27,5.22 12.07,5.16C12.87,5.09 13.56,5.06 14.16,5.06L15,5C17.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" />
    </svg>
);

const ArticleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-[var(--accent-secondary)]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 22.25H4a2 2 0 0 1-2-2V3.75a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16.5a2 2 0 0 1-2 2zM8.25 8.625a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5zm0 3.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5zm0 3.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25z" />
    </svg>
);


const Learn: React.FC<LearnProps> = ({ editableContent, setEditableContent }) => {
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState<LearnResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError('');
    setResults(null);
    
    try {
      const response: LearnResult = await generateLearningContent(topic);
      setResults(response);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating content.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
    setEditableContent(prev => ({ ...prev, [key]: newValue }));
  };
  
  return (
    <div>
      <InlineEditable as="h1" initialValue={editableContent.learnTitle} onSave={handleContentSave('learnTitle')} className="text-4xl font-serif text-[var(--text-header)] mb-6" />
      <Card className="mb-6">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic you want to research..."
            className="flex-grow bg-[var(--bg-interactive)]/50 p-3 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-3 px-6 rounded-md transition-colors disabled:bg-[var(--bg-interactive)]"
            disabled={isLoading}
          >
            {isLoading ? 'Researching...' : 'Search'}
          </button>
        </form>
      </Card>
      
        {isLoading && (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-secondary)]"></div>
             <p className="ml-4 text-[var(--text-secondary)]">Finding the best resources for you...</p>
          </div>
        )}
        {error && <Card><p className="text-[var(--danger-primary)] p-4">{error}</p></Card>}
        
        {results && (
            <div className="space-y-8">
                {results.articles?.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-serif text-[var(--text-header)] mb-4">Recommended Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.articles.map((article, i) => (
                            <a href={article.link} target="_blank" rel="noopener noreferrer" key={`article-${i}`}>
                                <Card className="h-full flex flex-col hover:border-[var(--border-accent)]">
                                    <h3 className="font-bold text-[var(--text-primary)]"><ArticleIcon/>{article.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] mt-2 flex-grow">{article.snippet}</p>
                                </Card>
                            </a>
                        ))}
                        </div>
                    </div>
                )}
                 {results.videos?.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-serif text-[var(--text-header)] mb-4">Recommended Videos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.videos.map((video, i) => (
                           <a href={video.link} target="_blank" rel="noopener noreferrer" key={`video-${i}`}>
                                <Card className="h-full flex flex-col hover:border-[var(--border-accent)]">
                                    <h3 className="font-bold text-[var(--text-primary)]"><YoutubeIcon/>{video.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] mt-2 flex-grow">{video.description}</p>
                                </Card>
                            </a>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        )}

         {!isLoading && !results && !error && (
             <Card>
                <div className="text-center text-[var(--text-muted)] p-10">
                    <p>Your curated research hub will appear here.</p>
                    <p>What new knowledge will you uncover today?</p>
                </div>
            </Card>
         )}
    </div>
  );
};

export default Learn;