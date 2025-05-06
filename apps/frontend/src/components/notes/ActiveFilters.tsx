import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  selectedTags: string[];
  handleTagToggle: (tag: string) => void;
  clearAllTags: () => void;
}

export function ActiveFilters({ selectedTags, handleTagToggle, clearAllTags }: ActiveFiltersProps) {
  if (selectedTags.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Active filters:</span>
        {selectedTags.map(tag => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => handleTagToggle(tag)}
            />
          </Badge>
        ))}
        {selectedTags.length > 1 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearAllTags}
            className="h-7 px-2"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
} 