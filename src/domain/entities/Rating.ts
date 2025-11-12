/**
 * Rating Entity
 *
 * Core rating type definition (1-5 stars).
 */

export type RatingValue = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export interface Rating {
  id: string;
  targetId: string;
  targetType: string;
  value: RatingValue;
  createdAt: number;
  updatedAt: number;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface RatingStats {
  average: number;
  count: number;
  distribution: RatingDistribution;
}

