/**
 * ReviewCard Component
 *
 * Displays a single review with rating, comment, and actions.
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { AtomicText, AtomicIcon } from '@umituz/react-native-design-system';
import { Review } from '../../domain/entities/Review';
import { StarDisplay } from './StarDisplay';

export interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  canEdit?: boolean;
  testID?: string;
}

export function ReviewCard({
  review,
  onHelpful,
  onEdit,
  onDelete,
  canEdit = false,
  testID,
}: ReviewCardProps) {
  const tokens = useAppDesignTokens();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <View
      style={[
        styles.container,
        {
          padding: tokens.spacing.md,
          borderRadius: tokens.spacing.xs,
          marginBottom: tokens.spacing.sm,
        },
      ]}
      testID={testID}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {review.userAvatar && (
            <View style={[styles.avatar, { marginRight: tokens.spacing.sm }]}>
              <AtomicText type="bodySmall">{review.userName?.[0] || 'U'}</AtomicText>
            </View>
          )}
          <View>
            <AtomicText type="bodyMedium" style={styles.userName}>
              {review.userName || 'Anonymous'}
            </AtomicText>
            <AtomicText type="bodySmall" style={styles.date}>
              {formatDate(review.createdAt)}
            </AtomicText>
          </View>
        </View>
        {review.verified && (
          <View style={[styles.verifiedBadge, { paddingHorizontal: tokens.spacing.xs, paddingVertical: tokens.spacing.xs }]}>
            <AtomicIcon name="CheckCircle" color="success" />
            <AtomicText type="bodySmall" style={[styles.verifiedText, { marginLeft: tokens.spacing.xs }]}>
              Verified
            </AtomicText>
          </View>
        )}
      </View>

      <View style={[styles.ratingContainer, { marginVertical: tokens.spacing.sm }]}>
        <StarDisplay value={review.rating} size={16} />
      </View>

      {review.title && (
        <AtomicText type="bodyMedium" style={[styles.title, { marginBottom: tokens.spacing.xs }]}>
          {review.title}
        </AtomicText>
      )}

      <AtomicText type="bodyMedium" style={styles.comment}>
        {review.comment}
      </AtomicText>

      <View style={[styles.actions, { marginTop: tokens.spacing.md }]}>
        {onHelpful && (
          <Pressable
            onPress={() => onHelpful(review.id)}
            style={[styles.actionButton, { marginRight: tokens.spacing.md }]}
          >
            <AtomicIcon name="ThumbsUp" color="secondary" />
            <AtomicText type="bodySmall" style={[styles.actionText, { marginLeft: tokens.spacing.xs }]}>
              Helpful {review.helpful ? `(${review.helpful})` : ''}
            </AtomicText>
          </Pressable>
        )}

        {canEdit && onEdit && (
          <Pressable
            onPress={() => onEdit(review)}
            style={[styles.actionButton, { marginRight: tokens.spacing.md }]}
          >
            <AtomicIcon name="Edit2" color="secondary" />
          </Pressable>
        )}

        {canEdit && onDelete && (
          <Pressable onPress={() => onDelete(review.id)} style={styles.actionButton}>
            <AtomicIcon name="Trash2" color="error" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '600',
  },
  date: {},
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  verifiedText: {
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
  },
  comment: {
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {},
});

