/**
 * Rating Utilities
 *
 * Helper functions for rating calculations and formatting.
 */

import { Review } from './Review';
import { RatingDistribution, RatingStats, RatingValue } from './Rating';

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function calculateDistribution(reviews: Review[]): RatingDistribution {
  return reviews.reduce((dist, review) => {
    const rounded = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
    dist[rounded] = (dist[rounded] || 0) + 1;
    return dist;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as RatingDistribution);
}

export function calculateStats(reviews: Review[]): RatingStats {
  return {
    average: calculateAverageRating(reviews),
    count: reviews.length,
    distribution: calculateDistribution(reviews),
  };
}

export function formatRatingText(rating: number): string {
  return `${rating.toFixed(1)} out of 5`;
}

export function sortReviews(
  reviews: Review[],
  by: 'recent' | 'helpful' | 'rating'
): Review[] {
  switch (by) {
    case 'recent':
      return [...reviews].sort((a, b) => b.createdAt - a.createdAt);
    case 'helpful':
      return [...reviews].sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
    case 'rating':
      return [...reviews].sort((a, b) => b.rating - a.rating);
    default:
      return reviews;
  }
}

export function roundToHalf(value: number): RatingValue {
  const rounded = Math.round(value * 2) / 2;
  return Math.max(0, Math.min(5, rounded)) as RatingValue;
}

export function generateReviewId(): string {
  return `review_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

