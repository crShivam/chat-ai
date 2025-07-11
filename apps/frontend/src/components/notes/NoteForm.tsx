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
import { useTags } from "@/lib/hooks/useTags";
import TagInput from "./TagInput";
import SimpleMarkdownEditor from "./SimpleMarkdownEditor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Eye, Sparkles } from "lucide-react";
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
  const { generateTags } = useTags();

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

  const handleGenerateTags = async () => {
    const content = form.getValues("content");
    if (content.length < 50) {
      toast.error("Content too short", {
        description: "Please write at least 50 characters to generate tags",
      });
      return;
    }

    try {
      const tags = await generateTags.mutateAsync(content);
      form.setValue("tags", tags);
      toast.success("Tags generated", {
        description: "AI has generated tags for your note",
      });
    } catch (error) {
      toast.error("Failed to generate tags", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const onSubmit = async (data: NoteSchema) => {
    setIsLoading(true);
    try {
      if (note) {
        await updateNote?.mutateAsync({
          title: data.title,
          content: data.content,
          tags: data.tags,
        });
        toast.success("Note updated", {
          description: "Your note has been updated successfully!",
        });
      } else {
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
    <div className="w-full mx-auto px-4 sm:px-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full rounded-lg flex flex-col gap-4 sm:gap-6"
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
                    className="text-base sm:text-lg font-medium"
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
                <div className="flex items-center justify-between gap-2">
                  <FormControl className="flex-1">
                    <TagInput
                      placeholder="Add tags... (press Enter to add)"
                      tags={field.value || []}
                      onTagsChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleGenerateTags}
                    disabled={isLoading || generateTags.isPending}
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
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
                      <TabsTrigger
                        value="edit"
                        className="flex items-center gap-1 text-sm sm:text-base"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="preview"
                        className="flex items-center gap-1 text-sm sm:text-base"
                      >
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
                      <div className="min-h-[200px] sm:min-h-[300px] max-h-[400px] sm:max-h-[500px] border border-input rounded-md p-3 sm:p-4 pt-8 sm:pt-10 overflow-auto bg-card relative">
                        {field.value ? (
                          <MarkdownPreview
                            source={field.value}
                            className="bg-transparent text-sm sm:text-base"
                            style={{
                              backgroundColor: "transparent",
                              color: "inherit",
                            }}
                          />
                        ) : (
                          <p className="text-muted-foreground italic text-sm sm:text-base">
                            Nothing to preview yet...
                          </p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 flex items-center gap-1 text-xs sm:text-sm"
                          onClick={() => setActiveTab("edit")}
                        >
                          <Edit size={14} className="sm:w-4 sm:h-4" />
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

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto min-w-[120px]"
            >
              {isLoading ? "Saving..." : note ? "Update Note" : "Create Note"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
