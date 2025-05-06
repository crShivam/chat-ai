import { useState } from 'react';
import { useInfiniteNotes, Note, useDeleteNote } from '../../lib/hooks/useNotes';
import NoteView from './NoteView';
import { SearchBar } from './SearchBar';
import { TagFilter } from './TagFilter';
import { ActiveFilters } from './ActiveFilters';
import { NotesGrid } from './NotesGrid';

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
  
  const clearAllTags = () => setSelectedTags([]);
  
  const handleDelete = async (id: string) => {
    try {
      await deleteNote.mutateAsync(id);
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };
  
  const notes = data?.pages.flatMap(page => page.data) || [];
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  if (isError) return <div className="text-destructive">Error: {error.message}</div>;

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
    <div className="container mx-auto px-4 lg:px-0 py-8">
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <SearchBar 
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleSearch={handleSearch}
        />
        <TagFilter 
          allTags={allTags}
          selectedTags={selectedTags}
          handleTagToggle={handleTagToggle}
          clearAllTags={clearAllTags}
        />
      </div>
      
      <ActiveFilters 
        selectedTags={selectedTags}
        handleTagToggle={handleTagToggle}
        clearAllTags={clearAllTags}
      />
      
      <NotesGrid 
        notes={notes}
        isLoading={isLoading}
        handleDelete={handleDelete}
        isDeleting={deleteNote.isPending}
        setSelectedNote={setSelectedNote}
        hasNextPage={hasNextPage || false}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}