import { styleAnalytics } from "./style-analytics";
import { cacheService } from "./cache-service";
import { STYLE_PRESETS, StylePreset } from "@/lib/models";

interface StyleRecommendation {
  styleId: string;
  confidence: number;
  reason: string;
  suggestedGuidance: number;
}

interface CombinationRecommendation {
  styles: [string, string];
  confidence: number;
  reason: string;
  suggestedRatio: number;
  suggestedGuidance: number;
}

class StyleRecommendationService {
  async getRecommendations(params: {
    baseStyle?: string;
    prompt?: string;
    preferredCategory?: string;
  }): Promise<StyleRecommendation[]> {
    const cacheKey = `recommendations_${JSON.stringify(params)}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const recommendations: StyleRecommendation[] = [];

    // Get analytics data for all styles
    const analyticsPromises = STYLE_PRESETS.map((style) =>
      styleAnalytics.getStyleAnalytics(style.id),
    );
    const analyticsResults = await Promise.all(analyticsPromises);

    // Calculate recommendations based on performance data
    STYLE_PRESETS.forEach((style, index) => {
      const analytics = analyticsResults[index];
      if (!analytics) return;

      let confidence = 0;
      let reason = "";

      // Base confidence on success rate and quality score
      confidence =
        (analytics.performance.successRate * 0.6 +
          analytics.averageQualityScore * 40) /
        100;

      // Adjust based on category preference
      if (
        params.preferredCategory &&
        style.category === params.preferredCategory
      ) {
        confidence *= 1.2;
        reason = `Matches preferred category ${params.preferredCategory}`;
      }

      // Adjust based on base style compatibility
      if (params.baseStyle) {
        const combination = analytics.popularCombinations.find((combo) =>
          combo.styles.includes(params.baseStyle!),
        );
        if (combination) {
          confidence *= 1 + combination.averageScore / 10;
          reason = `Good compatibility with ${STYLE_PRESETS.find((s) => s.id === params.baseStyle)?.name}`;
        }
      }

      recommendations.push({
        styleId: style.id,
        confidence: Math.min(confidence, 1),
        reason,
        suggestedGuidance: analytics.performance.averageGuidance,
      });
    });

    // Sort by confidence
    recommendations.sort((a, b) => b.confidence - a.confidence);

    // Cache results
    cacheService.set(cacheKey, recommendations, 300000); // 5 minutes

    return recommendations;
  }

  async getStyleCombinations(
    styleId: string,
  ): Promise<CombinationRecommendation[]> {
    const cacheKey = `combinations_${styleId}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const analytics = await styleAnalytics.getStyleAnalytics(styleId);
    if (!analytics) return [];

    const combinations: CombinationRecommendation[] =
      analytics.popularCombinations
        .map((combo) => ({
          styles: combo.styles as [string, string],
          confidence: combo.averageScore / 10,
          reason: `Successfully used ${combo.count} times`,
          suggestedRatio: 0.5, // Default to equal mix
          suggestedGuidance: analytics.performance.averageGuidance,
        }))
        .sort((a, b) => b.confidence - a.confidence);

    // Cache results
    cacheService.set(cacheKey, combinations, 300000); // 5 minutes

    return combinations;
  }

  async getOptimalParameters(styles: string[]): Promise<{
    guidance: number;
    ratio?: number;
    reason: string;
  }> {
    if (styles.length === 0)
      return { guidance: 7.5, reason: "Default parameters" };

    const analytics = await Promise.all(
      styles.map((style) => styleAnalytics.getStyleAnalytics(style)),
    );

    const validAnalytics = analytics.filter(Boolean);
    if (validAnalytics.length === 0) {
      return { guidance: 7.5, reason: "No historical data available" };
    }

    // Calculate optimal guidance based on weighted average of successful generations
    const guidance =
      validAnalytics.reduce(
        (sum, data) =>
          sum +
          data!.performance.averageGuidance * data!.performance.successRate,
        0,
      ) /
      validAnalytics.reduce(
        (sum, data) => sum + data!.performance.successRate,
        0,
      );

    // For style combinations, calculate optimal ratio
    let ratio: number | undefined;
    let reason = "Based on historical performance data";

    if (styles.length === 2) {
      const combinations = await this.getStyleCombinations(styles[0]);
      const matchingCombo = combinations.find((combo) =>
        combo.styles.includes(styles[1]),
      );
      if (matchingCombo) {
        ratio = matchingCombo.suggestedRatio;
        reason = `Based on ${matchingCombo.reason}`;
      }
    }

    return { guidance, ratio, reason };
  }
}

export const styleRecommendation = new StyleRecommendationService();
