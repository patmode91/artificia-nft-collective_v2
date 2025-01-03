import { QueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { api } from "../api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const queries = {
  ai: {
    models: {
      queryKey: ["ai", "models"],
      queryFn: () => api.ai.models(),
    },
    generations: {
      queryKey: (userId: string) => ["ai", "generations", userId],
      queryFn: async ({ queryKey }: { queryKey: string[] }) => {
        const [, , userId] = queryKey;
        const { data, error } = await supabase
          .from("art_generations")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      },
    },
  },
  nft: {
    userNFTs: {
      queryKey: (userId: string) => ["nft", "user", userId],
      queryFn: async ({ queryKey }: { queryKey: string[] }) => {
        const [, , userId] = queryKey;
        const { data, error } = await supabase
          .from("nfts")
          .select("*")
          .eq("creator_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      },
    },
  },
};
