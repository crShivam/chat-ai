import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useTags() {
  const getAllTags = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/tags`);
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      return response.json();
    },
  });

  const generateTags = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`${API_URL}/tags/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate tags');
      }
      
      return response.json();
    },
  });

  return {
    getAllTags,
    generateTags,
  };
} 