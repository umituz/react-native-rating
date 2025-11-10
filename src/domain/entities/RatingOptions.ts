/**
 * Rating Options
 *
 * Configuration options for app rating system
 */

/**
 * Rating Value (1-5 stars)
 */
export type RatingValue = 1 | 2 | 3 | 4 | 5;

/**
 * Rating Options
 * Customize the rating experience
 */
export interface RatingOptions {
  /**
   * Minimum rating to show store review (default: 4)
   * If user rates below this, show feedback form instead
   */
  minimumRatingForStoreReview?: RatingValue;

  /**
   * Storage key for rating state (default: "@app_rating")
   */
  storageKey?: string;

  /**
   * Number of actions (challenges/shares) before showing rating (default: 3)
   */
  actionsBeforeRating?: number;

  /**
   * Days to wait before showing rating again (default: 90)
   */
  daysBetweenRatings?: number;

  /**
   * Title text for rating modal
   */
  title?: string;

  /**
   * Description text for rating modal
   */
  description?: string;

  /**
   * Feedback title (shown when rating < minimumRatingForStoreReview)
   */
  feedbackTitle?: string;

  /**
   * Feedback description
   */
  feedbackDescription?: string;

  /**
   * Callback when user rates the app
   */
  onRate?: (rating: RatingValue) => void | Promise<void>;

  /**
   * Callback when user dismisses rating
   */
  onDismiss?: () => void | Promise<void>;

  /**
   * Callback when store review is requested
   */
  onStoreReviewRequested?: () => void | Promise<void>;

  /**
   * Callback when feedback is submitted
   */
  onFeedbackSubmitted?: (rating: RatingValue, feedback?: string) => void | Promise<void>;
}

