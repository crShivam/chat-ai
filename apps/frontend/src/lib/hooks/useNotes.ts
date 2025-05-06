import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api-client';

// Type definitions
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedNotes {
  data: Note[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NotesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
}

// Query keys
export const notesKeys = {
  all: ['notes'] as const,
  lists: () => [...notesKeys.all, 'list'] as const,
  list: (filters: NotesQueryParams) => [...notesKeys.lists(), filters] as const,
  details: () => [...notesKeys.all, 'detail'] as const,
  detail: (id: string) => [...notesKeys.details(), id] as const,
};

// Hooks
export const useNotes = (params: NotesQueryParams = {}) => {
  return useQuery({
    queryKey: notesKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.tags && params.tags.length > 0) {
        params.tags.forEach(tag => queryParams.append('tags', tag));
      }
      
      const endpoint = `/notes?${queryParams.toString()}`;
      const { data, error } = await api.get<PaginatedNotes>(endpoint);
      
      if (error) throw error;
      return data!;
    },
  });
};

export const useInfiniteNotes = (params: Omit<NotesQueryParams, 'page'> = {}) => {
  return useInfiniteQuery<PaginatedNotes>({
    queryKey: notesKeys.list({ ...params }),
    queryFn: async ({ pageParam }) => {
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', String(pageParam));
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.tags && params.tags.length > 0) {
        params.tags.forEach(tag => queryParams.append('tags', tag));
      }
      
      const endpoint = `/notes?${queryParams.toString()}`;
      const { data, error } = await api.get<PaginatedNotes>(endpoint);
      
      if (error) throw error;
      if (!data) throw new Error('No data returned from API');
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedNotes) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await api.get<Note>(`/notes/${id}`);
      if (error) throw error;
      return data!;
    },
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (noteData: CreateNoteData) => {
      const { data, error } = await api.post<Note>('/notes', noteData);
      if (error) throw error;
      return data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
};

export const useUpdateNote = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (noteData: UpdateNoteData) => {
      const { data, error } = await api.patch<Note>(`/notes/${id}`, noteData);
      if (error) throw error;
      return data!;
    },
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.delete<Note>(`/notes/${id}`);
      if (error) throw error;
      return data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}; 