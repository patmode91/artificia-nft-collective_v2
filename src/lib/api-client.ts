import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { useEffect } from "react";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Axios instance with common configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(async (config) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const {
          data: { session },
        } = await supabase.auth.refreshSession();
        if (session) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Add error handling for token refresh
        const enhancedError = new Error(
          refreshError.response?.data?.message || "Token refresh failed",
        );
        enhancedError.code = refreshError.response?.status;
        enhancedError.details = refreshError.response?.data;
        return Promise.reject(enhancedError);
      }
    }

    // Enhance error messages
    const enhancedError = new Error(
      error.response?.data?.message || "An unexpected error occurred",
    );
    enhancedError.code = error.response?.status;
    enhancedError.details = error.response?.data;

    return Promise.reject(enhancedError);
  },
);

// API endpoints
export const endpoints = {
  ai: {
    generate: async (params: GenerationParams) => {
      const response = await api.post("/ai/generate", params);
      return response.data;
    },
    models: async () => {
      const response = await api.get("/ai/models");
      return response.data;
    },
  },
  images: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
  },
};

// Types
export interface GenerationParams {
  model: string;
  prompt: string;
  negativePrompt?: string;
  guidance: number;
  style?: string;
  batchSize?: number;
  variations?: number;
  seed?: number;
}

export interface GenerationResult {
  id: string;
  url: string;
  metadata: Record<string, any>;
}

// Add useEffect hook to handle API state changes
useEffect(() => {
  const handleStateChange = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        api.defaults.headers.common.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error("Failed to update API state:", error);
    }
  };

  handleStateChange();
}, []);
