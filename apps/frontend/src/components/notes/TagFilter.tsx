import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useTags } from "@/lib/hooks/useTags";

interface TagFilterProps {
  selectedTags: string[];
  handleTagToggle: (tag: string) => void;
  clearAllTags: () => void;
}

export function TagFilter({ selectedTags, handleTagToggle, clearAllTags }: TagFilterProps) {
  const { getAllTags } = useTags();
  const allTags = getAllTags.data || [];
  
  if (allTags.length === 0) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <Filter className="h-4 w-4" />
          Filter Tags
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selectedTags.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allTags.map((tag: string) => (
          <DropdownMenuCheckboxItem
            key={tag}
            checked={selectedTags.includes(tag)}
            onCheckedChange={() => handleTagToggle(tag)}
          >
            {tag}
          </DropdownMenuCheckboxItem>
        ))}
        {selectedTags.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              size="sm" 
              className="w-full justify-start"
              onClick={clearAllTags}
            >
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 