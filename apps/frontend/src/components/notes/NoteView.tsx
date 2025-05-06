import { Note } from '../../lib/hooks/useNotes';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import MarkdownPreview from '@uiw/react-markdown-preview';

interface NoteViewProps {
  note: Note;
  onBack: () => void;
}

export default function NoteView({ note, onBack }: NoteViewProps) {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <h1 className="text-2xl md:text-3xl font-bold">{note.title}</h1>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <span>{formattedDate}</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
          
          <div className="prose dark:prose-invert max-w-none">
            <MarkdownPreview 
              source={note.content} 
              className="bg-transparent text-sm sm:text-base" 
              style={{ backgroundColor: 'transparent', color: 'inherit' }}
            />
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
          Created: {new Date(note.createdAt).toLocaleString()}
        </CardFooter>
      </Card>
    </div>
  );
} 