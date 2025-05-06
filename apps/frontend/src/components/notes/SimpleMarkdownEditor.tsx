import React from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Code, 
  Heading2, 
  Link, 
  ImageIcon,
  Quote,
  Eye
} from 'lucide-react';

interface SimpleMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onPreviewClick?: () => void;
}

export default function SimpleMarkdownEditor({
  value,
  onChange,
  className,
  placeholder = 'Write your note here...',
  disabled = false,
  onPreviewClick,
}: SimpleMarkdownEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (markdownBefore: string, markdownAfter: string = '') => {
    if (disabled) return;
    
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = 
      value.substring(0, start) + 
      markdownBefore + 
      selectedText + 
      markdownAfter + 
      value.substring(end);
    
    onChange(newValue);
    
    // Set selection after the operation completes
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + markdownBefore.length,
        end + markdownBefore.length
      );
    }, 0);
  };

  const toolbarItems = [
    { icon: <Bold size={16} />, action: () => insertMarkdown('**', '**'), title: 'Bold' },
    { icon: <Italic size={16} />, action: () => insertMarkdown('*', '*'), title: 'Italic' },
    { icon: <Heading2 size={16} />, action: () => insertMarkdown('## '), title: 'Heading' },
    { icon: <Quote size={16} />, action: () => insertMarkdown('> '), title: 'Quote' },
    { icon: <List size={16} />, action: () => insertMarkdown('- '), title: 'Bulleted List' },
    { icon: <ListOrdered size={16} />, action: () => insertMarkdown('1. '), title: 'Numbered List' },
    { icon: <Link size={16} />, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
    { icon: <ImageIcon size={16} />, action: () => insertMarkdown('![alt text](', ')'), title: 'Image' },
    { icon: <Code size={16} />, action: () => insertMarkdown('`', '`'), title: 'Inline Code' },
  ];

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex flex-wrap gap-1 p-1 bg-muted/20 rounded-md border border-input justify-between">
        <div className="flex flex-wrap gap-1">
          {toolbarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              type="button"
              onClick={item.action}
              disabled={disabled}
              title={item.title}
              className="h-8 w-8 p-1 rounded-md"
            >
              {item.icon}
            </Button>
          ))}
        </div>
        
        {onPreviewClick && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onPreviewClick}
            disabled={disabled}
            title="Preview"
            className="h-8 px-2 rounded-md flex gap-1 items-center"
          >
            <Eye size={16} />
            <span className="text-xs">Preview</span>
          </Button>
        )}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[200px] resize-y font-mono"
      />
    </div>
  );
} 