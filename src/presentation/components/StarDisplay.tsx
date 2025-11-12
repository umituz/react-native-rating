/**
 * StarDisplay Component
 *
 * Read-only star rating display.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { AtomicText, AtomicIcon } from '@umituz/react-native-design-system';
import { RatingValue } from '../../domain/entities/Rating';
import { formatRatingText } from '../../domain/entities/RatingUtils';
import { RATING_CONSTANTS, RATING_COLORS } from '../../domain/entities/RatingConstants';

export interface StarDisplayProps {
  value: RatingValue;
  maxRating?: number;
  size?: number;
  spacing?: number;
  color?: string;
  emptyColor?: string;
  showValue?: boolean;
  showText?: boolean;
  testID?: string;
}

export function StarDisplay({
  value,
  maxRating = RATING_CONSTANTS.MAX_RATING,
  size = 20,
  spacing = 4,
  color = RATING_COLORS.FILLED,
  emptyColor = RATING_COLORS.EMPTY,
  showValue = false,
  showText = false,
  testID,
}: StarDisplayProps) {
  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = value >= starValue;
    const isHalfFilled = value >= starValue - 0.5 && value < starValue;

    return (
      <View
        key={index}
        style={[styles.starContainer, { marginRight: index < maxRating - 1 ? spacing : 0 }]}
      >
        <AtomicIcon
          name={isFilled ? 'Star' : isHalfFilled ? 'StarHalf' : 'Star'}
          color={isFilled || isHalfFilled ? 'warning' : 'secondary'}
        />
      </View>
    );
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxRating }, (_, i) => renderStar(i))}
      </View>
      {showValue && (
        <AtomicText
          type="bodySmall"
          style={[styles.valueText, { marginLeft: spacing * 2 }]}
        >
          {value.toFixed(1)}
        </AtomicText>
      )}
      {showText && (
        <AtomicText
          type="bodySmall"
          style={[styles.text, { marginLeft: spacing }]}
        >
          {formatRatingText(value)}
        </AtomicText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontWeight: '600',
  },
  text: {},
});

