// Available AI Models
export const AI_MODELS = [
  {
    id: "stable-diffusion-v1.5",
    name: "Stable Diffusion v1.5",
    provider: "huggingface",
    model: "runwayml/stable-diffusion-v1-5",
    maxBatchSize: 4,
    maxPromptLength: 500,
    supportedFeatures: ["negative_prompt", "guidance_scale", "seed"],
  },
  {
    id: "stable-diffusion-v2.1",
    name: "Stable Diffusion v2.1",
    provider: "huggingface",
    model: "stabilityai/stable-diffusion-2-1",
    maxBatchSize: 4,
    maxPromptLength: 500,
    supportedFeatures: ["negative_prompt", "guidance_scale", "seed"],
  },
  {
    id: "kandinsky-2.2",
    name: "Kandinsky v2.2",
    provider: "huggingface",
    model: "kandinsky-community/kandinsky-2-2-decoder",
    maxBatchSize: 2,
    maxPromptLength: 300,
    supportedFeatures: ["negative_prompt", "guidance_scale"],
  },
] as const;

// Style Presets with enhanced descriptions and optimized prompts
export const STYLE_PRESETS = [
  {
    id: "realistic",
    name: "Realistic",
    description: "Photorealistic style with high detail and natural lighting",
    prompt:
      "masterpiece, highly detailed, photorealistic, 8k resolution, professional photography",
    negativePrompt:
      "cartoon, anime, illustration, painting, drawing, artificial, fake, low quality",
    previewUrl: "https://example.com/realistic-preview.jpg",
  },
  {
    id: "anime",
    name: "Anime",
    description: "Japanese animation style with vibrant colors",
    prompt:
      "masterpiece, best quality, anime style, highly detailed, vibrant colors, sharp lines",
    negativePrompt:
      "photorealistic, photograph, 3d, western style, blurry, low quality",
    previewUrl: "https://example.com/anime-preview.jpg",
  },
  {
    id: "digital-art",
    name: "Digital Art",
    description: "Modern digital art style with rich colors and details",
    prompt:
      "digital art, masterpiece, highly detailed, sharp focus, vibrant colors, artistic rendering",
    negativePrompt:
      "photograph, realistic, noisy, blurry, low quality, sketch, rough",
    previewUrl: "https://example.com/digital-art-preview.jpg",
  },
  {
    id: "abstract",
    name: "Abstract",
    description: "Non-representational art with bold shapes and colors",
    prompt:
      "abstract art masterpiece, non-representational, geometric shapes, bold colors, modern art",
    negativePrompt:
      "realistic, recognizable objects, faces, natural, photographic",
    previewUrl: "https://example.com/abstract-preview.jpg",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic dystopian style with neon colors",
    prompt:
      "cyberpunk, neon lights, futuristic, dystopian, high tech, masterpiece, highly detailed",
    negativePrompt: "natural, vintage, rustic, organic, low tech",
    previewUrl: "https://example.com/cyberpunk-preview.jpg",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical and ethereal fantasy art style",
    prompt:
      "fantasy art, magical, ethereal, mystical, masterpiece, highly detailed, dramatic lighting",
    negativePrompt: "modern, urban, realistic, mundane, photographic",
    previewUrl: "https://example.com/fantasy-preview.jpg",
  },
] as const;

// Validation parameters
export const VALIDATION = {
  prompt: {
    minLength: 3,
    maxLength: 500,
    default: "",
  },
  guidance: {
    min: 1,
    max: 20,
    default: 7.5,
    step: 0.1,
  },
  batchSize: {
    min: 1,
    max: 8,
    default: 1,
  },
  variations: {
    min: 1,
    max: 4,
    default: 1,
  },
  seed: {
    min: 0,
    max: 999999999,
    default: () => Math.floor(Math.random() * 1000000),
  },
  styleStrength: {
    min: 0,
    max: 1,
    default: 0.7,
    step: 0.1,
  },
};

// Generation Parameters Interface
export interface GenerationParams {
  model: string;
  prompt: string;
  negativePrompt?: string;
  guidance: number;
  seed?: number;
  batchSize: number;
  stylePreset?: string;
  styleStrength?: number;
}

// Generation Result Interface
export interface GenerationResult {
  url: string;
  seed: number;
  prompt: string;
  model: string;
  stylePreset?: string;
  metadata: Record<string, any>;
}
