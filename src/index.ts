/**
 * @umituz/react-native-rating - Public API
 *
 * Comprehensive rating and review system for React Native apps
 * Provides star ratings, user reviews, and statistics
 *
 * Usage:
 *   import { StarRating, StarDisplay, ReviewCard, useRating, useReviews } from '@umituz/react-native-rating';
 */

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

export type {
  RatingValue,
  Rating,
  RatingDistribution,
  RatingStats,
} from './domain/entities/Rating';

export type {
  Review,
  ReviewFormData,
} from './domain/entities/Review';

// =============================================================================
// DOMAIN LAYER - Utilities
// =============================================================================

export {
  calculateAverageRating,
  calculateDistribution,
  calculateStats,
  formatRatingText,
  sortReviews,
  roundToHalf,
  generateReviewId,
} from './domain/entities/RatingUtils';

export {
  RATING_CONSTANTS,
  RATING_COLORS,
  RATING_STORAGE_KEYS,
} from './domain/entities/RatingConstants';

// =============================================================================
// INFRASTRUCTURE LAYER
// =============================================================================

export { useRatingStore } from './infrastructure/storage/RatingStore';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useRating } from './presentation/hooks/useRating';
export type { UseRatingReturn } from './presentation/hooks/useRating';

export { useReviews } from './presentation/hooks/useReviews';
export type { UseReviewsReturn } from './presentation/hooks/useReviews';

// =============================================================================
// PRESENTATION LAYER - Components
// =============================================================================

export { StarRating } from './presentation/components/StarRating';
export type { StarRatingProps } from './presentation/components/StarRating';

export { StarDisplay } from './presentation/components/StarDisplay';
export type { StarDisplayProps } from './presentation/components/StarDisplay';

export { ReviewCard } from './presentation/components/ReviewCard';
export type { ReviewCardProps } from './presentation/components/ReviewCard';

