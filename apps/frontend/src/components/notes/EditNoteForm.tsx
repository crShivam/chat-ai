import { useParams, useNavigate } from "react-router";
import { useNote } from "@/lib/hooks/useNotes";
import NoteForm from "./NoteForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditNoteForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: note, isLoading, isError } = useNote(id || "");
  
  if (isLoading) {
    return (
      <div className="mx-auto w-full py-6">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-5xl" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }
  
  if (isError || !note) {
    return (
      <div className="max-w-5xl mx-auto w-full px-4 py-6 text-center">
        <h2 className="text-xl font-bold mb-4">Error Loading Note</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find the note you're looking for.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Edit Note</h1>
      
      <NoteForm note={note} />
    </div>
  );
} 