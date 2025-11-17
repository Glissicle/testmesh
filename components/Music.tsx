import React, { useState } from 'react';
import Card from './common/Card';
import type { EditableContent } from '../types';
import InlineEditable from './common/InlineEditable';

interface MusicProps {
  spotifyUri: string;
  setSpotifyUri: (uri: string) => void;
  editableContent: EditableContent;
  setEditableContent: React.Dispatch<React.SetStateAction<EditableContent>>;
}

const Music: React.FC<MusicProps> = ({ spotifyUri, setSpotifyUri, editableContent, setEditableContent }) => {
  const [inputValue, setInputValue] = useState('');

  const getEmbedUrl = (linkOrUri: string): string | null => {
    if (!linkOrUri) return null;
    try {
      // Handle standard URLs: https://open.spotify.com/track/4cOdK2wGLETOMs3AKxbNkA
      if (linkOrUri.includes('open.spotify.com')) {
        const url = new URL(linkOrUri);
        const pathParts = url.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          const type = pathParts[pathParts.length - 2];
          const id = pathParts[pathParts.length - 1];
          if (['track', 'playlist', 'album', 'artist', 'episode'].includes(type)) {
             return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
          }
        }
      }
      // Handle URIs: spotify:track:4cOdK2wGLETOMs3AKxbNkA
      const uriParts = linkOrUri.split(':');
      if (uriParts.length === 3 && uriParts[0] === 'spotify') {
        const [_, type, id] = uriParts;
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
      }
    } catch (e) {
      console.error("Invalid Spotify URL or URI", e);
      return null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(spotifyUri);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSpotifyUri(inputValue);
  };

  const handleContentSave = (key: keyof EditableContent) => (newValue: string) => {
    setEditableContent(prev => ({ ...prev, [key]: newValue }));
  };
  
  return (
    <div className="space-y-8">
      <div>
        <InlineEditable as="h1" initialValue={editableContent.musicTitle} onSave={handleContentSave('musicTitle')} className="text-4xl font-serif text-[var(--text-header)] mb-2" />
        <InlineEditable as="p" initialValue={editableContent.musicSubtitle} onSave={handleContentSave('musicSubtitle')} className="text-[var(--text-secondary)]" />
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="spotify-uri" className="block text-sm font-medium text-[var(--text-primary)] mb-1">Spotify URL or URI</label>
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="spotify-uri"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Paste a Spotify URL or URI..."
                  className="flex-grow bg-[var(--bg-interactive)]/50 p-3 rounded-md border border-[var(--border-secondary)] focus:ring-[var(--accent-secondary)] focus:border-[var(--accent-secondary)]"
                />
                <button
                  type="submit"
                  className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold py-3 px-6 rounded-md transition-colors"
                >
                  Load Player
                </button>
            </div>
          </div>
           <p className="text-xs text-[var(--text-muted)]">
                On Spotify, click the '...' menu, go to Share &gt; Copy Song Link (or Playlist Link). The URI also works.
            </p>
        </form>
      </Card>
      
      {embedUrl ? (
        <Card>
          <iframe
            key={spotifyUri} // Forces re-render on URI change.
            style={{ borderRadius: '12px' }}
            src={embedUrl}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Player"
          ></iframe>
        </Card>
      ) : (
         <Card>
            <div className="text-center text-[var(--text-muted)] p-10">
                <p>Your Spotify player will appear here.</p>
                <p>Paste a link above to get started.</p>
            </div>
         </Card>
      )}

    </div>
  );
};

export default Music;
