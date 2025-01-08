export type StylePreset = {
  id: string;
  name: string;
  category: string;
  prompt: string;
  negativePrompt: string;
  previewUrl: string;
  description: string;
  mixCompatible: boolean;
  technicalParams: {
    guidance: number;
    baseModel: string;
    [key: string]: any;
  };
};

export type StyleMixingConfig = {
  styles: string[];
  weights: number[];
  strength: number;
};

export type StyleResult = {
  prompt: string;
  negativePrompt: string;
  guidance: number;
  baseModel: string;
  technicalParams: Record<string, any>;
};

export function combineStyles(
  styles: string[],
  weights?: number[],
): StyleResult {
  if (styles.length === 0) {
    throw new Error("No styles provided");
  }

  const presets = styles.map((id) => {
    const preset = STYLE_PRESETS.find((p) => p.id === id);
    if (!preset) throw new Error(`Style preset ${id} not found`);
    return preset;
  });

  if (styles.length === 1) {
    return {
      prompt: presets[0].prompt,
      negativePrompt: presets[0].negativePrompt,
      guidance: presets[0].technicalParams.guidance,
      baseModel: presets[0].technicalParams.baseModel,
      technicalParams: { ...presets[0].technicalParams },
    };
  }

  // Normalize weights if not provided
  const normalizedWeights = weights || presets.map(() => 1 / presets.length);

  // Combine prompts with weights
  const prompt = presets
    .map((preset, i) => `(${preset.prompt}) ${normalizedWeights[i]}`)
    .join(" + ");

  // Combine negative prompts
  const negativePrompt = presets
    .map((preset) => preset.negativePrompt)
    .filter(Boolean)
    .join(", ");

  // Average guidance scale
  const guidance = presets.reduce(
    (sum, preset, i) =>
      sum + preset.technicalParams.guidance * normalizedWeights[i],
    0,
  );

  // Use the most advanced base model
  const baseModel = presets.reduce((selected, preset) => {
    const modelPriority = {
      "stable-diffusion-xl": 3,
      "stable-diffusion-v2.1": 2,
      "stable-diffusion-v1.5": 1,
    };
    return modelPriority[preset.technicalParams.baseModel] >
      modelPriority[selected]
      ? preset.technicalParams.baseModel
      : selected;
  }, presets[0].technicalParams.baseModel);

  // Combine other technical parameters
  const technicalParams = presets.reduce((combined, preset, i) => {
    Object.entries(preset.technicalParams).forEach(([key, value]) => {
      if (key !== "guidance" && key !== "baseModel") {
        if (typeof value === "number") {
          combined[key] = (combined[key] || 0) + value * normalizedWeights[i];
        } else {
          combined[key] = combined[key] || value;
        }
      }
    });
    return combined;
  }, {});

  return {
    prompt,
    negativePrompt,
    guidance,
    baseModel,
    technicalParams,
  };
}

export interface GenerationParams {
  model: string;
  prompt: string;
  negativePrompt?: string;
  guidance: number;
  stylePreset?: string;
  styleStrength?: number;
  batchSize?: number;
  variations?: number;
  seed?: number;
}

export interface GenerationResult {
  url: string;
  seed: number;
  prompt: string;
  model: string;
  stylePreset?: string;
  metadata: Record<string, any>;
}
