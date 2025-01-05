export const AI_MODELS = [
  {
    id: "stable-diffusion-v1.5",
    name: "Stable Diffusion v1.5",
    tier: "free",
    provider: "huggingface",
    model: "runwayml/stable-diffusion-v1-5",
    maxBatchSize: 4,
    maxPromptLength: 500,
    supportedFeatures: ["negative_prompt", "guidance_scale", "seed", "lora"],
  },
  {
    id: "stable-diffusion-v2.1",
    name: "Stable Diffusion v2.1",
    tier: "free",
    provider: "huggingface",
    model: "stabilityai/stable-diffusion-2-1",
    maxBatchSize: 4,
    maxPromptLength: 500,
    supportedFeatures: ["negative_prompt", "guidance_scale", "seed", "lora"],
  },
  {
    id: "compvis",
    name: "CompVis",
    tier: "free",
    provider: "huggingface",
    model: "CompVis/stable-diffusion-v1-4",
    maxBatchSize: 4,
    maxPromptLength: 500,
    supportedFeatures: ["negative_prompt", "guidance_scale", "seed"],
  },
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    tier: "freemium",
    provider: "stability",
    model: "stable-diffusion-xl-1024-v1-0",
    maxBatchSize: 4,
    maxPromptLength: 1000,
    supportedFeatures: [
      "negative_prompt",
      "guidance_scale",
      "seed",
      "lora",
      "inpaint",
      "upscale",
    ],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    tier: "freemium",
    provider: "midjourney",
    maxBatchSize: 4,
    maxPromptLength: 1000,
    supportedFeatures: ["style_transfer", "upscale", "variations"],
  },
  {
    id: "dalle3",
    name: "DALL-E 3",
    tier: "premium",
    provider: "openai",
    maxBatchSize: 4,
    maxPromptLength: 4000,
    supportedFeatures: [
      "negative_prompt",
      "style_transfer",
      "inpaint",
      "edit",
      "variations",
    ],
  },
  {
    id: "firefly",
    name: "Adobe Firefly",
    tier: "premium",
    provider: "adobe",
    maxBatchSize: 4,
    maxPromptLength: 4000,
    supportedFeatures: [
      "style_transfer",
      "inpaint",
      "edit",
      "upscale",
      "restore",
    ],
  },
] as const;

export const STYLE_PRESETS = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    prompt: "cyberpunk style, futuristic, neon lights, high tech, dystopian",
    negativePrompt: "natural, traditional, historical, low tech",
    previewUrl: "/images/styles/cyberpunk.jpg",
    description: "A futuristic style with neon lights and high tech elements.",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    prompt: "fantasy style, magical, mythical creatures, enchanted, vibrant",
    negativePrompt: "realistic, modern, sci-fi, mundane",
    previewUrl: "/images/styles/fantasy.jpg",
    description: "A magical style with mythical creatures and vibrant colors.",
  },
  {
    id: "noir",
    name: "Noir",
    prompt: "noir style, black and white, high contrast, moody, vintage",
    negativePrompt: "colorful, modern, bright, cheerful",
    previewUrl: "/images/styles/noir.jpg",
    description: "A moody black and white style with high contrast.",
  },
  {
    id: "abstract",
    name: "Abstract",
    prompt: "abstract style, geometric shapes, bold colors, non-representational",
    negativePrompt: "realistic, detailed, representational, traditional",
    previewUrl: "/images/styles/abstract.jpg",
    description: "A non-representational style with geometric shapes and bold colors.",
  },
] as const;

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
  loraScale: {
    min: 0,
    max: 2,
    default: 0.75,
    step: 0.05,
  },
};

export interface GenerationParams extends BaseGenerationParams {
  model: string;
  prompt: string;
  negativePrompt?: string;
  guidance: number;
  seed?: number;
  batchSize: number;
  stylePreset?: string;
  styleStrength?: number;
  lora?: LoRAParams;
  editing?: EditingParams;
  enhancement?: EnhancementParams;
}

export interface LoRAParams {
  model: string;
  scale: number;
  triggerWords?: string[];
}

export interface EditingParams {
  type: keyof typeof EDITING_FEATURES;
  mask?: string;
  prompt?: string;
  settings?: Record<string, any>;
}

export interface EnhancementParams {
  type: keyof typeof ENHANCEMENT_TOOLS;
  scale?: number;
  settings?: Record<string, any>;
}

export interface GenerationResult {
  url: string;
  seed: number;
  prompt: string;
  model: string;
  stylePreset?: string;
  metadata: Record<string, any>;
  editingHistory?: EditingParams[];
  enhancementHistory?: EnhancementParams[];
}
