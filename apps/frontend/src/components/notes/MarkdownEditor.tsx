import React from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { cn } from '@/lib/utils';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
}

export default function RichMarkdownEditor({
  value,
  onChange,
  className,
  placeholder = 'Write your note here...',
  height = '300px',
  disabled = false,
}: RichEditorProps) {
  return (
    <div className={cn('w-full rounded-md border border-input', className)}>
      <MarkdownEditor
        value={value}
        onChange={(editor, data, value) => onChange(value)}
        options={{
          placeholder,
          readOnly: disabled,
          lineWrapping: true,
          lineNumbers: false,
        }}
        height={height}
        className="min-h-[200px]"
      />
    </div>
  );
} 