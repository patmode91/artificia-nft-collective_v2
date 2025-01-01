export interface GenerationParams {
  model: string;
  prompt: string;
  negativePrompt?: string;
  guidance: number;
  style?: string;
  batchSize?: number;
  variations?: number;
  seed?: number;
}

export interface GenerationResult {
  id: string;
  url: string;
  metadata: Record<string, any>;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  model: string;
  maxBatchSize: number;
  maxPromptLength: number;
  supportedFeatures: string[];
}

export interface StylePreset {
  id: string;
  name: string;
  prompt: string;
  negativePrompt: string;
}
