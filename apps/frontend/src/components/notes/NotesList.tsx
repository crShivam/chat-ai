import { useState } from 'react';
import { useNotes, Note, useDeleteNote } from '../../lib/hooks/useNotes';
import NoteView from './NoteView';
import { SearchBar } from './SearchBar';
import { TagFilter } from './TagFilter';
import { ActiveFilters } from './ActiveFilters';
import { NotesGridWithPagination } from './NotesGridWithPagination';

export default function NotesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;
  
  const {
    data,
    isLoading,
    isError,
    error
  } = useNotes({ 
    page: currentPage,
    limit,
    search: searchTerm,
    tags: selectedTags.length > 0 ? selectedTags : undefined
  });
  
  const deleteNote = useDeleteNote();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const clearAllTags = () => {
    setSelectedTags([]);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
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
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const notes = data?.data || [];
  const totalPages = data?.meta.totalPages || 1;
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  if (isError) return <div className="text-destructive">Error: {error.message}</div>;

  if (selectedNote) {
    return (
      <NoteView 
        note={selectedNote}
        onBack={() => setSelectedNote(null)}
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
      
      <NotesGridWithPagination 
        notes={notes}
        isLoading={isLoading}
        handleDelete={handleDelete}
        isDeleting={deleteNote.isPending}
        setSelectedNote={setSelectedNote}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}