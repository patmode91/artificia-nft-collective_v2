import { HfInference } from "@huggingface/inference";
import { supabase } from "../supabase";
import { GenerationParams, GenerationResult } from "../types";

// Initialize HuggingFace client
const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export const api = {
  ai: {
    generate: async (params: GenerationParams): Promise<GenerationResult> => {
      try {
        // Generate image using HuggingFace
        const response = await hf.textToImage({
          model: params.model,
          inputs: params.prompt,
          parameters: {
            negative_prompt: params.negativePrompt,
            guidance_scale: params.guidance,
            seed: params.seed,
          },
        });

        // Convert blob to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
        });
        reader.readAsDataURL(response);
        const base64Data = await base64Promise;

        // Save to Supabase storage
        const fileName = `generated/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.png`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, response, {
            contentType: "image/png",
            cacheControl: "3600",
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        // Save generation metadata
        const { data: generationData, error: generationError } = await supabase
          .from("art_generations")
          .insert([
            {
              prompt: params.prompt,
              result_url: urlData.publicUrl,
              metadata: {
                model: params.model,
                guidance: params.guidance,
                seed: params.seed,
                negative_prompt: params.negativePrompt,
              },
            },
          ])
          .select()
          .single();

        if (generationError) throw generationError;

        return {
          id: generationData.id,
          url: urlData.publicUrl,
          metadata: generationData.metadata,
        };
      } catch (error) {
        console.error("AI Generation error:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to generate image",
        );
      }
    },

    models: async () => {
      const { data, error } = await supabase
        .from("ai_models")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  },

  storage: {
    upload: async (file: File) => {
      const fileName = `uploads/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) throw error;
      return data;
    },
  },
};
