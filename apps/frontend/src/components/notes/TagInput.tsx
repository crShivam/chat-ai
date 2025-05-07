import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const TagInput = ({ 
    tags = [], 
    onTagsChange, 
    placeholder = "Add tag...",
    disabled = false
  }: { 
    tags: string[]; 
    onTagsChange: (tags: string[]) => void; 
    placeholder?: string;
    disabled?: boolean;
  }) => {
    const [inputValue, setInputValue] = useState("");
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim() !== "") {
        e.preventDefault();
        if (!tags.includes(inputValue.trim())) {
          onTagsChange([...tags, inputValue.trim()]);
        }
        setInputValue("");
      }
    };
  
    const removeTag = (tagToRemove: string) => {
      onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };
  
    return (
      <div className="flex flex-wrap gap-2 w-full">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1">
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)} 
              disabled={disabled}
              className="ml-1 rounded-full hover:bg-muted p-0.5"
            >
              <X size={12} />
            </button>
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className='flex-1'
        />
      </div>
    );
  };

  export default TagInput;  