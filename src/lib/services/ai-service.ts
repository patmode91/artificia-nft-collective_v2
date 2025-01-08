import { HfInference } from "@huggingface/inference";
import { GenerationParams, GenerationResult } from "../types";
import { supabase } from "../supabase";

class AIGenerationError extends Error {
  constructor(
    message: string,
    public code:
      | "RATE_LIMIT"
      | "INVALID_PARAMS"
      | "BATCH_FAILED"
      | "INTERRUPTED"
      | "UNKNOWN",
    public details?: any,
  ) {
    super(message);
    this.name = "AIGenerationError";
  }
}

export class AIService {
  private hf: HfInference;
  private rateLimitCounter: Map<string, { count: number; resetTime: number }> =
    new Map();
  private interrupted = false;

  constructor() {
    this.hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
  }

  private checkRateLimit(modelId: string) {
    const limit = this.rateLimitCounter.get(modelId);
    const now = Date.now();

    if (limit) {
      if (now < limit.resetTime) {
        if (limit.count >= 10) {
          throw new AIGenerationError("Rate limit exceeded", "RATE_LIMIT", {
            resetIn: Math.ceil((limit.resetTime - now) / 1000),
          });
        }
        limit.count++;
      } else {
        this.rateLimitCounter.set(modelId, {
          count: 1,
          resetTime: now + 60000,
        });
      }
    } else {
      this.rateLimitCounter.set(modelId, { count: 1, resetTime: now + 60000 });
    }
  }

  async generate(
    params: GenerationParams,
    onProgress?: (progress: number) => void,
  ): Promise<GenerationResult> {
    this.interrupted = false;
    this.checkRateLimit(params.model);

    try {
      if (onProgress) onProgress(10);

      // Generate image using HuggingFace
      const response = await this.hf.textToImage({
        model: params.model,
        inputs: params.prompt,
        parameters: {
          negative_prompt: params.negativePrompt,
          guidance_scale: params.guidance,
          seed: params.seed,
        },
      });

      if (this.interrupted) {
        throw new AIGenerationError("Generation interrupted", "INTERRUPTED");
      }

      if (onProgress) onProgress(50);

      // Upload to Supabase storage
      const fileName = `generated/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, response, {
          contentType: "image/png",
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      if (onProgress) onProgress(80);

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
              style_preset: params.stylePreset,
              style_strength: params.styleStrength,
            },
          },
        ])
        .select()
        .single();

      if (generationError) throw generationError;

      if (onProgress) onProgress(100);

      return {
        url: urlData.publicUrl,
        seed: params.seed || Math.floor(Math.random() * 1000000),
        prompt: params.prompt,
        model: params.model,
        stylePreset: params.stylePreset,
        metadata: generationData.metadata,
      };
    } catch (error) {
      if (error instanceof AIGenerationError) throw error;
      throw new AIGenerationError(
        "Failed to generate or save image",
        "UNKNOWN",
        error,
      );
    }
  }

  interrupt() {
    this.interrupted = true;
  }
}

export const aiService = new AIService();
