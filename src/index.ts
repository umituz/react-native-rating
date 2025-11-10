/**
 * React Native Rating - Public API
 *
 * Generic app rating system for React Native apps. Shows rating modal after
 * challenges/shares and redirects to store review. Follows SOLID, DRY, KISS principles.
 *
 * Usage:
 *   import { useAppRating, RatingModal } from '@umituz/react-native-rating';
 *
 *   const { trackAction, isVisible, hideRating } = useAppRating();
 *
 *   // After challenge/share
 *   await trackAction();
 *
 *   <RatingModal
 *     visible={isVisible}
 *     onClose={hideRating}
 *     onRate={(rating) => console.log('Rated:', rating)}
 *   />
 */

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

export type { RatingOptions, RatingValue } from "./domain/entities/RatingOptions";

// =============================================================================
// INFRASTRUCTURE LAYER - Storage and Services
// =============================================================================

export { useRatingStore } from "./infrastructure/storage/RatingStore";
export { requestStoreReview, isStoreReviewAvailable } from "./infrastructure/services/StoreReviewService";

// =============================================================================
// PRESENTATION LAYER - Components and Hooks
// =============================================================================

export { RatingModal, type RatingModalProps } from "./presentation/components/RatingModal";
export { useAppRating, type UseAppRatingReturn } from "./presentation/hooks/useAppRating";

