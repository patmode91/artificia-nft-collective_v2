<<<<<<< HEAD
import {
  StylePreset,
  StyleMixingConfig,
  StyleResult,
  combineStyles,
} from "./types";

// Style Categories for organization and filtering
export const STYLE_CATEGORIES = {
  DIGITAL: "Digital Art",
  TRADITIONAL: "Traditional Art",
  MODERN: "Modern",
  PHOTOGRAPHIC: "Photography",
  EXPERIMENTAL: "Experimental",
  CULTURAL: "Cultural",
  HISTORICAL: "Historical",
  CONCEPTUAL: "Conceptual",
} as const;

// Style mixing compatibility matrix
export const STYLE_MIXING_RULES = {
  // Base weights for style combinations (0-1)
  weights: {
    "digital-art": { cyberpunk: 0.7, anime: 0.8, minimalist: 0.6 },
    "oil-painting": { impressionist: 0.8, watercolor: 0.5, portrait: 0.7 },
    cinematic: { portrait: 0.9, cyberpunk: 0.6, fantasy: 0.7 },
  },
  // Maximum number of styles that can be mixed
  maxStyles: 3,
  // Default mixing strength
  defaultStrength: 0.7,
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "digital-art",
    name: "Digital Art",
    category: STYLE_CATEGORIES.DIGITAL,
    prompt:
      "digital art style, clean lines, vibrant colors, detailed, professional illustration",
    negativePrompt: "traditional media, rough, sketchy, noisy",
    previewUrl:
      "https://storage.googleapis.com/tempo-public-assets/styles/digital-art.jpg",
    description: "Modern digital art with clean professional finish",
    mixCompatible: true,
    technicalParams: {
      guidance: 7.5,
      baseModel: "stable-diffusion-xl",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    category: STYLE_CATEGORIES.DIGITAL,
    prompt: "cyberpunk style, futuristic, neon lights, high tech, dystopian",
    negativePrompt: "natural, traditional, historical, low tech",
    previewUrl:
      "https://storage.googleapis.com/tempo-public-assets/styles/cyberpunk.jpg",
    description: "High-tech dystopian aesthetic with neon accents",
    mixCompatible: true,
    technicalParams: {
      guidance: 8.0,
      baseModel: "stable-diffusion-xl",
    },
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    category: STYLE_CATEGORIES.TRADITIONAL,
    prompt: "oil painting style, textured brushstrokes, rich colors, artistic",
    negativePrompt: "digital art, flat, smooth, photographic",
    previewUrl:
      "https://storage.googleapis.com/tempo-public-assets/styles/oil-painting.jpg",
    description: "Classical oil painting technique with rich textures",
    mixCompatible: true,
    technicalParams: {
      guidance: 7.0,
      baseModel: "stable-diffusion-v2.1",
    },
  },
  {
    id: "watercolor",
    name: "Watercolor",
    category: STYLE_CATEGORIES.TRADITIONAL,
    prompt: "watercolor style, flowing, soft edges, translucent, artistic",
    negativePrompt: "sharp, digital, precise, photographic",
    previewUrl:
      "https://storage.googleapis.com/tempo-public-assets/styles/watercolor.jpg",
    description: "Soft and flowing watercolor painting style",
    mixCompatible: true,
    technicalParams: {
      guidance: 6.5,
      baseModel: "stable-diffusion-v2.1",
    },
  },
  {
    id: "anime",
    name: "Anime",
    category: STYLE_CATEGORIES.MODERN,
    prompt: "anime style, manga, cel shaded, vibrant colors, expressive",
    negativePrompt: "realistic, photographic, western art style",
    previewUrl:
      "https://storage.googleapis.com/tempo-public-assets/styles/anime.jpg",
    description: "Japanese anime and manga inspired style",
    mixCompatible: true,
    technicalParams: {
      guidance: 7.0,
      baseModel: "stable-diffusion-v2.1",
    },
  },
  {
    id: "minimalist",
    name: "Minimalist",
    category: STYLE_CATEGORIES.MODERN,
    prompt:
      "minimalist style, simple shapes, clean design, limited color palette",
    negativePrompt: "complex, detailed, busy, ornate",
    previewUrl:
      "https://storage.googleapis.com/tempo-public-assets/styles/minimalist.jpg",
    description: "Clean minimalist design aesthetic",
    mixCompatible: true,
    technicalParams: {
      guidance: 6.0,
      baseModel: "stable-diffusion-v2.1",
    },
  },
];

// Style mixing helper functions
export function getStyleMixingWeight(style1: string, style2: string): number {
  return (
    STYLE_MIXING_RULES.weights[style1]?.[style2] ||
    STYLE_MIXING_RULES.defaultStrength
  );
}

export function isStyleMixingCompatible(
  style1: string,
  style2: string,
): boolean {
  const preset1 = STYLE_PRESETS.find((p) => p.id === style1);
  const preset2 = STYLE_PRESETS.find((p) => p.id === style2);
  return preset1?.mixCompatible && preset2?.mixCompatible;
}

export * from "./types";

// AI Models with tiered access
=======
>>>>>>> 8aa8c5829d43160f77a910fbe02c4e4aecfb3277
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
<<<<<<< HEAD
  // Freemium Models
=======
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
>>>>>>> 8aa8c5829d43160f77a910fbe02c4e4aecfb3277
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
<<<<<<< HEAD
  // Premium Models
=======
  {
    id: "midjourney",
    name: "Midjourney",
    tier: "freemium",
    provider: "midjourney",
    maxBatchSize: 4,
    maxPromptLength: 1000,
    supportedFeatures: ["style_transfer", "upscale", "variations"],
  },
>>>>>>> 8aa8c5829d43160f77a910fbe02c4e4aecfb3277
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
<<<<<<< HEAD
] as const;

// Validation parameters
=======
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

>>>>>>> 8aa8c5829d43160f77a910fbe02c4e4aecfb3277
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
<<<<<<< HEAD
=======

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
>>>>>>> 8aa8c5829d43160f77a910fbe02c4e4aecfb3277
