import React from 'react';
import { Note } from '../../lib/hooks/useNotes';
import { Card, CardContent } from "@/components/ui/card";
import NoteCard from './NoteCard';
import { NoteSkeleton } from './NoteSkeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface NotesGridWithPaginationProps {
  notes: Note[];
  isLoading: boolean;
  handleDelete: (id: string) => void;
  isDeleting: boolean;
  setSelectedNote: (note: Note) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function NotesGridWithPagination({ 
  notes, 
  isLoading,
  handleDelete, 
  isDeleting, 
  setSelectedNote,
  currentPage,
  totalPages,
  onPageChange
}: NotesGridWithPaginationProps) {
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

  const renderPaginationItems = () => {
    // For small number of pages, show all page numbers
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }).map((_, i) => (
        <PaginationItem key={i + 1}>
          <PaginationLink
            onClick={() => onPageChange(i + 1)}
            isActive={currentPage === i + 1}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    // For larger number of pages, show a limited range with ellipsis
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => onPageChange(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show current page and adjacent pages
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => onPageChange(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink 
          onClick={() => onPageChange(totalPages)} 
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  };
  
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
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
} 