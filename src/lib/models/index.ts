<<<<<<< HEAD
// Available AI Models with tiered access
=======
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95
export const AI_MODELS = [
  // Free Models
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
<<<<<<< HEAD
  // Freemium Models
=======
  {
    id: "dalle-mini",
    name: "DALL-E Mini",
    provider: "huggingface",
    model: "dalle-mini/dalle-mini",
    maxBatchSize: 4,
    maxPromptLength: 500,
    supportedFeatures: ["negative_prompt", "guidance_scale", "seed"],
  },
  {
    id: "midjourney",
    name: "MidJourney",
    provider: "huggingface",
    model: "midjourney/midjourney",
    maxBatchSize: 4,
    maxPromptLength: 500,
    supportedFeatures: ["negative_prompt", "guidance_scale", "seed"],
  },
] as const;

export const STYLE_PRESETS = [
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95
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
  // Premium Models
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
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    prompt: "cyberpunk style, futuristic, neon lights, high tech, dystopian",
    negativePrompt: "natural, traditional, historical, low tech",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    prompt: "fantasy style, magical, mythical creatures, enchanted, vibrant",
    negativePrompt: "realistic, modern, sci-fi, mundane",
  },
] as const;

<<<<<<< HEAD
// Image Editing Features
export const EDITING_FEATURES = {
  inpaint: {
    id: "inpaint",
    name: "Inpainting",
    description: "Edit specific areas of the image using a brush",
    tools: ["brush", "eraser", "size", "hardness"],
  },
  replace: {
    id: "replace",
    name: "Object Replacement",
    description: "Replace selected objects with new content",
    tools: ["smart_select", "magic_wand", "lasso"],
  },
  background: {
    id: "background",
    name: "Background Manipulation",
    description: "Edit or replace image backgrounds",
    tools: ["auto_mask", "refine_edge", "feather"],
  },
  mask: {
    id: "mask",
    name: "Smart Masking",
    description: "AI-powered selection and masking tools",
    tools: ["subject_select", "sky_select", "portrait_select"],
  },
};

// Enhancement Tools
export const ENHANCEMENT_TOOLS = {
  upscale: {
    id: "upscale",
    name: "AI Upscaling",
    description: "Increase image resolution while maintaining quality",
    scales: [2, 4, 8],
    models: ["real-esrgan", "stable-diffusion-upscale"],
  },
  style: {
    id: "style",
    name: "Style Transfer",
    description: "Apply artistic styles to images",
    models: ["stable-diffusion", "midjourney", "firefly"],
  },
  restore: {
    id: "restore",
    name: "Image Restoration",
    description: "Fix and enhance image quality",
    features: ["denoise", "deblur", "enhance"],
  },
  color: {
    id: "color",
    name: "Color Correction",
    description: "Adjust and enhance image colors",
    tools: ["auto", "manual", "selective"],
  },
};

// LoRA Models Configuration
export const LORA_CONFIG = {
  maxSize: 100 * 1024 * 1024, // 100MB
  supportedFormats: [".safetensors", ".ckpt", ".pt"],
  compatibleModels: [
    "stable-diffusion-v1.5",
    "stable-diffusion-v2.1",
    "stable-diffusion-xl",
  ],
  maxTokens: 77,
  defaultAlpha: 0.75,
};

// Validation parameters
=======
>>>>>>> 3c8cb07db8e5ced0068231abaca2aceb1497ad95
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

// Types
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
