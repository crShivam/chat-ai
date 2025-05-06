import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export function SearchBar({ searchValue, setSearchValue, handleSearch }: SearchBarProps) {
  return (
    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
      <Input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search notes..."
        className="flex-1"
      />
      <Button type="submit">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
} 