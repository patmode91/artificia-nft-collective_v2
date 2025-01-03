import { HfInference } from "@huggingface/inference";
import { AI_MODELS } from "../models";
import { supabase } from "../api-client";

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

class StyleSystemError extends Error {
  constructor(
    message: string,
    public code:
      | "INVALID_COMBINATION"
      | "PARAM_RANGE"
      | "PREVIEW_FAILED"
      | "PRESET_FAILED",
    public details?: any,
  ) {
    super(message);
    this.name = "StyleSystemError";
  }
}

export class AIService {
  private hf: HfInference;
  private rateLimitCounter: Map<string, { count: number; resetTime: number }> =
    new Map();

  constructor() {
    this.hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
  }

  private checkRateLimit(modelId: string) {
    const limit = this.rateLimitCounter.get(modelId);
    const now = Date.now();

    if (limit) {
      if (now < limit.resetTime) {
        if (limit.count >= 10) {
          // 10 requests per minute
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

  private validateParameters(params: GenerationParams) {
    const model = AI_MODELS.find((m) => m.id === params.model);
    if (!model) {
      throw new AIGenerationError("Invalid model selected", "INVALID_PARAMS");
    }

    if (params.prompt.length > model.maxPromptLength) {
      throw new AIGenerationError(
        `Prompt exceeds maximum length of ${model.maxPromptLength}`,
        "INVALID_PARAMS",
      );
    }

    if (params.batchSize && params.batchSize > model.maxBatchSize) {
      throw new AIGenerationError(
        `Batch size exceeds maximum of ${model.maxBatchSize}`,
        "INVALID_PARAMS",
      );
    }
  }

  async generate(
    params: GenerationParams,
    onProgress?: (progress: number) => void,
  ) {
    this.validateParameters(params);
    this.checkRateLimit(params.model);

    const batchSize = params.batchSize || 1;
    const results: GenerationResult[] = [];
    let interrupted = false;

    try {
      for (let i = 0; i < batchSize; i++) {
        if (interrupted) break;

        const result = await this.generateSingle(params);
        results.push(result);

        if (onProgress) {
          onProgress(((i + 1) / batchSize) * 100);
        }
      }

      return results;
    } catch (error) {
      if (error instanceof AIGenerationError) {
        throw error;
      }
      throw new AIGenerationError("Generation failed", "BATCH_FAILED", {
        completed: results.length,
        total: batchSize,
      });
    }
  }

  private async generateSingle(
    params: GenerationParams,
  ): Promise<GenerationResult> {
    try {
      const response = await this.hf.textToImage({
        model: params.model,
        inputs: params.prompt,
        parameters: {
          negative_prompt: params.negativePrompt,
          guidance_scale: params.guidance,
          seed: params.seed,
        },
      });

      const imageUrl = await this.uploadToStorage(response);
      return { url: imageUrl, params };
    } catch (error) {
      throw new AIGenerationError("Single generation failed", "UNKNOWN", error);
    }
  }

  private async uploadToStorage(imageBlob: Blob): Promise<string> {
    const fileName = `generated/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    try {
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
    } catch (error) {
      throw new AIGenerationError(
        "Failed to upload generated image",
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

export type GenerationParams = {
  model: string;
  prompt: string;
  negativePrompt?: string;
  guidance: number;
  seed?: number;
  batchSize?: number;
};

export type GenerationResult = {
  url: string;
  params: GenerationParams;
};
