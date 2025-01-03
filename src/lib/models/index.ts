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
  {
    id: "realistic",
    name: "Realistic",
    prompt: "highly detailed, photorealistic, 8k resolution, masterpiece",
    negativePrompt:
      "cartoon, anime, illustration, painting, drawing, artificial, fake",
  },
  {
    id: "anime",
    name: "Anime",
    prompt: "anime style, high quality, detailed, sharp, vibrant colors",
    negativePrompt: "photorealistic, photograph, 3d, western style",
  },
  {
    id: "digital-art",
    name: "Digital Art",
    prompt:
      "digital art, high quality, detailed, sharp, vibrant colors, artistic",
    negativePrompt: "photograph, realistic, noisy, blurry",
  },
  {
    id: "abstract",
    name: "Abstract",
    prompt: "abstract art, non-representational, geometric shapes, bold colors",
    negativePrompt: "realistic, recognizable objects, faces, natural",
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

export const VALIDATION = {
  prompt: {
    minLength: 3,
    maxLength: 500,
  },
  guidance: {
    min: 1,
    max: 20,
    default: 7.5,
  },
  batchSize: {
    min: 1,
    max: 8,
    default: 4,
  },
  variations: {
    min: 1,
    max: 4,
    default: 1,
  },
};
