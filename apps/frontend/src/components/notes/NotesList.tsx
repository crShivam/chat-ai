import { useState } from 'react';
import { useInfiniteNotes, Note, useDeleteNote } from '../../lib/hooks/useNotes';

export default function NotesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteNotes({ 
    limit: 10,
    search: searchTerm,
    tags: selectedTags.length > 0 ? selectedTags : undefined
  });
  
  const deleteNote = useDeleteNote();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchValue);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteNote.mutateAsync(id);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };
  
  // Flatten the pages array to get all notes
  const notes = data?.pages.flatMap(page => page.data) || [];
  
  // Extract unique tags from all notes
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags))
  );

  if (isLoading) return <div className="loading">Loading notes...</div>;
  
  if (isError) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>Notes</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search notes..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      
      {allTags.length > 0 && (
        <div className="tags-filter">
          <h3>Filter by tags:</h3>
          <div className="tags-list">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <>
          <div className="notes-grid">
            {notes.map((note: Note) => (
              <div key={note.id} className="note-card">
                <h2>{note.title}</h2>
                <p className="note-content">{note.content}</p>
                
                {note.tags.length > 0 && (
                  <div className="note-tags">
                    {note.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="note-footer">
                  <span className="note-date">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(note.id)}
                    disabled={deleteNote.isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {hasNextPage && (
            <div className="load-more">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="load-more-button"
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 