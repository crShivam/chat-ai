import supabase from './supabase';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: RequestMethod;
  body?: Record<string, any>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Ensure no trailing slash
const ENV_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const BASE_URL = ENV_URL || '/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, requiresAuth = true } = options;

  try {
    let authHeaders: Record<string, string> = {};

    if (requiresAuth) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Authentication required');
      authHeaders = {
        Authorization: `Bearer ${session.access_token}`,
      };
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...headers,
      },
      credentials: 'include',
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);

    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob(); // fallback for files/blobs
    }

    if (!response.ok) {
      const message =
        typeof data === 'object' && data?.message
          ? data.message
          : `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return { data, error: null };
  } catch (error) {
    console.error('API request error:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(
    endpoint: string,
    body: Record<string, any>,
    options?: Omit<RequestOptions, 'method'>
  ) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body,
    }),

  put: <T>(endpoint: string, body: Record<string, any>, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body,
    }),

  patch: <T>(
    endpoint: string,
    body: Record<string, any>,
    options?: Omit<RequestOptions, 'method'>
  ) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body,
    }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
