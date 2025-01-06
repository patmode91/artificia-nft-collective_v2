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
  // Implementation for style mixing logic
  // This would combine prompts, adjust parameters, etc.
  return {
    prompt: "",
    negativePrompt: "",
    guidance: 7.5,
    baseModel: "stable-diffusion-xl",
    technicalParams: {},
  };
}
