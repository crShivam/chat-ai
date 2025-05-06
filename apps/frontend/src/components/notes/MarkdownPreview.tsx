import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

// Simple markdown rendering functions
const renderMarkdown = (content: string): string => {
  let html = content;
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-5 mb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Lists - improved to handle multiple list items
  html = html.replace(/^\s*- (.*?)$/gm, '<li class="ml-6 list-disc">$1</li>');
  html = html.replace(/^\s*\d+\. (.*?)$/gm, '<li class="ml-6 list-decimal">$1</li>');
  
  // Wrap consecutive list items in ul/ol tags
  let inList = false;
  const lines = html.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<li class="ml-6 list-disc">')) {
      if (!inList) {
        lines[i] = '<ul class="my-3">' + lines[i];
        inList = true;
      }
    } else if (lines[i].includes('<li class="ml-6 list-decimal">')) {
      if (!inList) {
        lines[i] = '<ol class="my-3">' + lines[i];
        inList = true;
      }
    } else if (inList) {
      lines[i-1] = lines[i-1] + (lines[i-1].includes('list-disc') ? '</ul>' : '</ol>');
      inList = false;
    }
  }
  if (inList) {
    lines[lines.length-1] += (lines[lines.length-1].includes('list-disc') ? '</ul>' : '</ol>');
  }
  html = lines.join('\n');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
  
  // Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-4 max-w-full h-auto rounded shadow" />');
  
  // Code blocks
  html = html.replace(/`(.*?)`/g, '<code class="bg-gray-100 p-1 rounded font-mono text-sm">$1</code>');
  
  // Blockquotes
  html = html.replace(/^\> (.*$)/gm, '<blockquote class="pl-4 border-l-4 border-gray-200 my-4 italic">$1</blockquote>');
  
  // Paragraphs - wrap text that's not already in a block element
  const wrappedLines = html.split('\n').map(line => {
    if (
      !line.includes('<h1') && 
      !line.includes('<h2') && 
      !line.includes('<h3') && 
      !line.includes('<li') &&
      !line.includes('<blockquote') &&
      !line.includes('<img') &&
      !line.includes('<ul') &&
      !line.includes('<ol') &&
      !line.includes('</ul') &&
      !line.includes('</ol') &&
      line.trim() !== ''
    ) {
      return `<p class="my-2">${line}</p>`;
    }
    return line;
  });
  
  return wrappedLines.join('\n');
};

export default function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div 
      className={cn('markdown-preview', className)}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
} 