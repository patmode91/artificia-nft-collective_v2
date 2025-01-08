class CacheService {
  private cache: Map<
    string,
    {
      data: any;
      timestamp: number;
      ttl: number;
    }
  > = new Map();

  set(key: string, data: any, ttl: number = 1800000) {
    // Default 30 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Specific methods for style previews
  getStylePreview(styleId: string): string | null {
    return this.get(`style_preview_${styleId}`);
  }

  setStylePreview(styleId: string, imageUrl: string): void {
    this.set(`style_preview_${styleId}`, imageUrl);
  }

  // Methods for style combinations
  getStyleCombination(styleIds: string[], ratio?: number): any | null {
    const key = `style_combination_${styleIds.sort().join("_")}${ratio ? `_${ratio}` : ""}`;
    return this.get(key);
  }

  setStyleCombination(styleIds: string[], result: any, ratio?: number): void {
    const key = `style_combination_${styleIds.sort().join("_")}${ratio ? `_${ratio}` : ""}`;
    this.set(key, result);
  }
}

export const cacheService = new CacheService();
