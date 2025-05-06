import { useState } from 'react';
import { useInfiniteNotes, Note, useDeleteNote } from '../../lib/hooks/useNotes';
import Loader from '../common/loader';
import NoteCard from './NoteCard';
import NoteView from './NoteView';


export default function NotesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
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
      // If the deleted note is currently being viewed, go back to the list
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
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

  if (isLoading) {
    return (
      <main className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </main>
    );
  }
  
  if (isError) return <div className="error">Error: {error.message}</div>;

  // If a note is selected, show the NoteView component
  if (selectedNote) {
    return (
      <NoteView 
        note={selectedNote}
        onDelete={handleDelete}
        onBack={() => setSelectedNote(null)}
        isDeleting={deleteNote.isPending}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h1>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search notes..."
            className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
          >
            Search
          </button>
        </form>
      </div>
      
      {allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Filter by tags:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No notes found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note: Note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onDelete={handleDelete}
                isDeleting={deleteNote.isPending}
                onClick={() => setSelectedNote(note)}
              />
            ))}
          </div>
          
          {hasNextPage && (
            <div className="mt-8 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
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