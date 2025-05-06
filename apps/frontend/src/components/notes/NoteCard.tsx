import { Note } from '../../lib/hooks/useNotes';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onClick: () => void;
}

export default function NoteCard({ note, onDelete, isDeleting, onClick }: NoteCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <CardHeader>
        <h2 className="text-xl font-bold line-clamp-2">{note.title}</h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-4">
          {note.content.length > 1000 ? note.content.substring(0, 1000) + '...' : note.content}
        </p>
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {note.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {new Date(note.updatedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost"
              size="icon"
              disabled={isDeleting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}