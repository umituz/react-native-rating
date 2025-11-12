/**
 * Rating Constants
 *
 * Constants for the rating system.
 */

export const RATING_CONSTANTS = {
  MIN_RATING: 0,
  MAX_RATING: 5,
  DEFAULT_SIZE: 32,
  DEFAULT_SPACING: 8,
  HALF_STAR_THRESHOLD: 0.5,
} as const;

export const RATING_COLORS = {
  FILLED: '#FFC107',
  EMPTY: '#E0E0E0',
  DISABLED: '#BDBDBD',
} as const;

export const RATING_STORAGE_KEYS = {
  REVIEWS: '@reviews',
  STATS: '@rating_stats',
  USER_REVIEWS: '@user_reviews',
} as const;

