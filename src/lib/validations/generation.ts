import { z } from "zod";

export const generationParamsSchema = z.object({
  model: z.string().min(1, "Model is required"),
  prompt: z.string().min(3, "Prompt must be at least 3 characters").max(500),
  negativePrompt: z.string().optional(),
  guidance: z.number().min(1).max(20),
  style: z.string().optional(),
  batchSize: z.number().min(1).max(8).optional(),
  variations: z.number().min(1).max(4).optional(),
  seed: z.number().optional(),
});

export type GenerationParams = z.infer<typeof generationParamsSchema>;
