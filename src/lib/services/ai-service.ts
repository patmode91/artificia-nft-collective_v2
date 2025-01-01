import { HfInference } from "@huggingface/inference";
import { AI_MODELS } from "../models";
import { supabase } from "../api-client";

// Initialize HuggingFace client
const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export class AIService {
  private static async uploadToStorage(imageBlob: Blob): Promise<string> {
    const fileName = `generated/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, imageBlob, {
        contentType: "image/png",
        cacheControl: "3600",
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    return publicUrl;
  }

  static async generate(params: {
    model: string;
    prompt: string;
    negativePrompt?: string;
    guidance: number;
    seed?: number;
  }) {
    const modelConfig = AI_MODELS.find((m) => m.id === params.model);
    if (!modelConfig) throw new Error("Invalid model selected");

    try {
      // Generate image using HuggingFace
      const response = await hf.textToImage({
        model: modelConfig.model,
        inputs: params.prompt,
        parameters: {
          negative_prompt: params.negativePrompt,
          guidance_scale: params.guidance,
          seed: params.seed,
        },
      });

      // Upload the generated image to Supabase storage
      const url = await this.uploadToStorage(response);

      // Save generation metadata to database
      const { data, error } = await supabase
        .from("art_generations")
        .insert([
          {
            prompt: params.prompt,
            result_url: url,
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

      if (error) throw error;

      return {
        id: data.id,
        url,
        metadata: data.metadata,
      };
    } catch (error) {
      console.error("AI Generation error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to generate image",
      );
    }
  }
}
