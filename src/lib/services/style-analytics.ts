import { supabase } from "../supabase";
import { cacheService } from "./cache-service";
import { StylePreset } from "../models/types";

interface StyleAnalytics {
  styleId: string;
  usageCount: number;
  averageQualityScore: number;
  popularCombinations: Array<{
    styleId: string;
    count: number;
    averageScore: number;
  }>;
  performance: {
    generationSpeed: number;
    successRate: number;
    averageGuidance: number;
  };
}

class StyleAnalyticsService {
  private analytics: Map<string, StyleAnalytics> = new Map();

  async trackGeneration(params: {
    styleId: string;
    combinedWith?: string;
    qualityScore: number;
    generationTime: number;
    success: boolean;
    guidance: number;
  }) {
    const { data, error } = await supabase.from("style_analytics").insert([
      {
        style_id: params.styleId,
        combined_with: params.combinedWith,
        quality_score: params.qualityScore,
        generation_time: params.generationTime,
        success: params.success,
        guidance: params.guidance,
      },
    ]);

    if (error) throw error;

    // Update cache
    this.updateAnalyticsCache(params.styleId);
    if (params.combinedWith) {
      this.updateAnalyticsCache(params.combinedWith);
    }
  }

  async getStyleAnalytics(styleId: string): Promise<StyleAnalytics | null> {
    // Check cache first
    const cached = cacheService.get(`style_analytics_${styleId}`);
    if (cached) return cached;

    // Fetch from database
    const { data: analytics, error } = await supabase
      .from("style_analytics")
      .select("*")
      .eq("style_id", styleId);

    if (error) throw error;
    if (!analytics?.length) return null;

    // Calculate metrics
    const result = this.calculateMetrics(analytics);

    // Cache results
    cacheService.set(`style_analytics_${styleId}`, result, 300000); // 5 minutes cache

    return result;
  }

  async getPopularCombinations(limit: number = 5): Promise<
    Array<{
      styles: [string, string];
      count: number;
      averageScore: number;
    }>
  > {
    const { data, error } = await supabase
      .from("style_analytics")
      .select("*")
      .not("combined_with", "is", null)
      .order("quality_score", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return this.processCombinations(data);
  }

  private calculateMetrics(data: any[]): StyleAnalytics {
    const totalGenerations = data.length;
    const successfulGenerations = data.filter((d) => d.success).length;

    return {
      styleId: data[0].style_id,
      usageCount: totalGenerations,
      averageQualityScore:
        data.reduce((sum, d) => sum + d.quality_score, 0) / totalGenerations,
      popularCombinations: this.processCombinations(data),
      performance: {
        generationSpeed:
          data.reduce((sum, d) => sum + d.generation_time, 0) /
          totalGenerations,
        successRate: (successfulGenerations / totalGenerations) * 100,
        averageGuidance:
          data.reduce((sum, d) => sum + d.guidance, 0) / totalGenerations,
      },
    };
  }

  private processCombinations(data: any[]) {
    const combinations = data
      .filter((d) => d.combined_with)
      .reduce((acc, d) => {
        const key = [d.style_id, d.combined_with].sort().join("_");
        if (!acc[key]) {
          acc[key] = {
            count: 0,
            totalScore: 0,
            styles: [d.style_id, d.combined_with],
          };
        }
        acc[key].count++;
        acc[key].totalScore += d.quality_score;
        return acc;
      }, {});

    return Object.values(combinations)
      .map((c: any) => ({
        styles: c.styles,
        count: c.count,
        averageScore: c.totalScore / c.count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  private async updateAnalyticsCache(styleId: string) {
    cacheService.delete(`style_analytics_${styleId}`);
    await this.getStyleAnalytics(styleId);
  }
}

export const styleAnalytics = new StyleAnalyticsService();
