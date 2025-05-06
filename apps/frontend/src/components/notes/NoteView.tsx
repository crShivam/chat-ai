import { useState } from 'react';
import { Note } from '../../lib/hooks/useNotes';

interface NoteViewProps {
  note: Note;
  onDelete: (id: string) => Promise<void>;
  onBack: () => void;
  isDeleting: boolean;
}

export default function NoteView({ note, onDelete, onBack, isDeleting }: NoteViewProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDelete = async () => {
    await onDelete(note.id);
    onBack();
  };

  const formattedDate = new Date(note.updatedAt).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl mx-auto my-8 overflow-hidden">
      <div className="relative">
        {/* Header with gradients */}
        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Back button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
      
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{note.title}</h1>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formattedDate}</span>
        </div>
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="prose dark:prose-invert max-w-none mb-8 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {note.content}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex justify-between items-center">
          <button 
            onClick={() => setIsConfirmingDelete(true)}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md font-medium transition-colors"
            disabled={isDeleting || isConfirmingDelete}
          >
            Delete Note
          </button>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Confirm Delete</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete "{note.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 