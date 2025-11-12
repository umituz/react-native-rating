/**
 * Review Entity
 *
 * User review with rating, comment, and metadata.
 */

import { RatingValue } from './Rating';

export interface Review {
  id: string;
  targetId: string;
  targetType: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: RatingValue;
  title?: string;
  comment: string;
  photos?: string[];
  helpful?: number;
  verified?: boolean;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, unknown>;
}

export interface ReviewFormData {
  rating: RatingValue;
  title?: string;
  comment: string;
  photos?: string[];
}

