import { useState, useEffect } from 'react';
import { useNote, useDeleteNote } from '../../lib/hooks/useNotes';
import NoteForm from './NoteForm';
import MarkdownPreview from './MarkdownPreview';

interface NoteDetailProps {
  noteId: string;
  onBack: () => void;
  onDelete?: () => void;
}

export default function NoteDetail({ noteId, onBack, onDelete }: NoteDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: note, isLoading, isError, error } = useNote(noteId);
  const deleteNote = useDeleteNote();
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote.mutateAsync(noteId);
        if (onDelete) {
          onDelete();
        } else {
          onBack();
        }
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };
  
  const handleEditSuccess = () => {
    setIsEditing(false);
  };
  
  useEffect(() => {
    // Add a listener for navigation change in NoteForm
    const handleNavigation = () => {
      setIsEditing(false);
    };
    
    // This is a simple way to detect navigation changes when the form submits
    return () => {
      // Cleanup
    };
  }, []);
  
  if (isLoading) return <div className="loading">Loading note...</div>;
  
  if (isError) return <div className="error">Error: {error.message}</div>;
  
  if (!note) return <div className="not-found">Note not found</div>;
  
  if (isEditing) {
    return (
      <div className="note-detail-container">
        <div className="detail-header">
          <button onClick={() => setIsEditing(false)} className="back-button">
            Cancel Editing
          </button>
        </div>
        
        <NoteForm note={note} />
      </div>
    );
  }
  
  return (
    <div className="note-detail-container">
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          Back to Notes
        </button>
        
        <div className="note-actions">
          <button 
            onClick={() => setIsEditing(true)}
            className="edit-button"
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="delete-button"
            disabled={deleteNote.isPending}
          >
            {deleteNote.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      
      <div className="note-content-container">
        <h1 className="note-title">{note.title}</h1>
        
        <div className="note-metadata">
          <div className="dates">
            <div>Created: {new Date(note.createdAt).toLocaleString()}</div>
            <div>Updated: {new Date(note.updatedAt).toLocaleString()}</div>
          </div>
          
          {note.tags.length > 0 && (
            <div className="note-tags">
              {note.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        
        {note.summary && (
          <div className="note-summary">
            <h3>Summary</h3>
            <p>{note.summary}</p>
          </div>
        )}
        
        <div className="note-content">
          <h3>Content</h3>
          <MarkdownPreview content={note.content} className="mt-2" />
        </div>
      </div>
    </div>
  );
} 