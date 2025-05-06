import React from 'react';
import { Note } from '../../lib/hooks/useNotes';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NoteCard from './NoteCard';
import { NoteSkeleton } from './NoteSkeleton';

interface NotesGridProps {
  notes: Note[];
  isLoading: boolean;
  handleDelete: (id: string) => void;
  isDeleting: boolean;
  setSelectedNote: (note: Note) => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export function NotesGrid({ 
  notes, 
  isLoading,
  handleDelete, 
  isDeleting, 
  setSelectedNote,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
}: NotesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <NoteSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground text-lg">No notes found.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note: Note) => (
          <NoteCard 
            key={note.id} 
            note={note} 
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onClick={() => setSelectedNote(note)}
          />
        ))}
      </div>
      
      {hasNextPage && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        </div>
      )}
    </>
  );
} 