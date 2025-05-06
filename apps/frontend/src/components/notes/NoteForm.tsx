import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Note, useCreateNote, useUpdateNote } from "@/lib/hooks/useNotes";
import TagInput from "./TagInput";
import SimpleMarkdownEditor from "./SimpleMarkdownEditor";
import MarkdownPreview from "./MarkdownPreview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Eye } from "lucide-react";
import { toast } from "sonner";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
});

type NoteSchema = z.infer<typeof noteSchema>;

interface NoteFormProps {
  note?: Note;
}

export default function NoteForm({ note }: NoteFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("edit");

  const createNote = useCreateNote();
  const updateNote = note ? useUpdateNote(note.id) : null;

  const form = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      tags: note?.tags || [],
    },
  });

  const onSubmit = async (data: NoteSchema) => {
    setIsLoading(true);
    try {
      if (note) {
        // Update existing note
        await updateNote?.mutateAsync({
          title: data.title,
          content: data.content,
          tags: data.tags,
        });
        toast.success("Note updated", {
          description: "Your note has been updated successfully!",
        });
      } else {
        // Create new note
        await createNote.mutateAsync({
          title: data.title,
          content: data.content,
          tags: data.tags,
        });
        toast.success("Note created", {
          description: "Your note has been created successfully!",
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Error submitting note:", error);
      toast.error("Error", {
        description: "An error occurred while saving your note",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full rounded-lg flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Note title"
                    {...field}
                    disabled={isLoading}
                    className="text-lg font-medium"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagInput
                    placeholder="Add tags... (press Enter to add)"
                    tags={field.value || []}
                    onTagsChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Tabs 
                    defaultValue="edit" 
                    className="w-full"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <TabsList className="w-full grid grid-cols-2 mb-2">
                      <TabsTrigger value="edit" className="flex items-center gap-1">
                        <Edit size={16} />
                        <span>Edit</span>
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>Preview</span>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit" className="mt-0">
                      <SimpleMarkdownEditor
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        placeholder="Write your note here..."
                        onPreviewClick={() => setActiveTab("preview")}
                      />
                    </TabsContent>
                    <TabsContent value="preview" className="mt-0">
                      <div className="min-h-[300px] max-h-[500px] border border-input rounded-md p-4 pt-10 overflow-auto bg-card relative">
                        {field.value ? (
                          <MarkdownPreview content={field.value} />
                        ) : (
                          <p className="text-muted-foreground italic">Nothing to preview yet...</p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 flex items-center gap-1"
                          onClick={() => setActiveTab("edit")}
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Saving..." : note ? "Update Note" : "Create Note"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
