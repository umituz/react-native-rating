/**
 * Rating Modal Component
 *
 * Shows rating modal after challenges/shares
 */

import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDesignTokens } from "@umituz/react-native-theme";
import { useLocalization } from "@umituz/react-native-localization";
import { useResponsive, AtomicIcon, AtomicText, STATIC_TOKENS } from "@umituz/react-native-design-system";
import type { RatingOptions, RatingValue } from "../../domain/entities/RatingOptions";
import { requestStoreReview } from "../../infrastructure/services/StoreReviewService";

export interface RatingModalProps extends RatingOptions {
  /**
   * Whether modal is visible
   */
  visible: boolean;

  /**
   * Callback to close modal
   */
  onClose: () => void;
}

/**
 * Rating Modal Component
 */
export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  minimumRatingForStoreReview = 4,
  title,
  description,
  feedbackTitle,
  feedbackDescription,
  onRate,
  onDismiss,
  onStoreReviewRequested,
  onFeedbackSubmitted,
}) => {
  const tokens = useAppDesignTokens();
  const responsive = useResponsive();
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();
  const styles = useMemo(
    () => getStyles(tokens, responsive, insets),
    [tokens, responsive, insets],
  );

  const [rating, setRating] = useState<RatingValue | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  const displayTitle = title || t("rating.title", "Rate Our App");
  const displayDescription =
    description ||
    t("rating.description", "How would you rate your experience?");
  const displayFeedbackTitle =
    feedbackTitle || t("rating.feedbackTitle", "Help Us Improve");
  const displayFeedbackDescription =
    feedbackDescription ||
    t(
      "rating.feedbackDescription",
      "We'd love to hear your feedback to make the app better.",
    );

  const handleRatingSelect = async (value: RatingValue) => {
    setRating(value);

    if (onRate) {
      await onRate(value);
    }

    // If rating is high enough, show store review
    if (value >= minimumRatingForStoreReview) {
      const requested = await requestStoreReview();
      if (requested && onStoreReviewRequested) {
        await onStoreReviewRequested();
      }
      onClose();
    } else {
      // Show feedback form for low ratings
      setShowFeedback(true);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (rating && onFeedbackSubmitted) {
      await onFeedbackSubmitted(rating, feedback.trim());
    }
    handleClose();
  };

  const handleDismiss = async () => {
    if (onDismiss) {
      await onDismiss();
    }
    handleClose();
  };

  const handleClose = () => {
    setRating(null);
    setShowFeedback(false);
    setFeedback("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <View style={[styles.modal, { backgroundColor: tokens.colors.surface }]}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {!showFeedback ? (
                <>
                  <AtomicText style={styles.title}>{displayTitle}</AtomicText>
                  <AtomicText style={styles.description}>
                    {displayDescription}
                  </AtomicText>

                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <TouchableOpacity
                        key={value}
                        onPress={() => handleRatingSelect(value as RatingValue)}
                        style={styles.starButton}
                      >
                        <AtomicIcon
                          name={rating && value <= rating ? "Star" : "StarOutline"}
                          size="xl"
                          color={
                            rating && value <= rating
                              ? tokens.colors.warning
                              : tokens.colors.textSecondary
                          }
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.dismissButton}
                    onPress={handleDismiss}
                  >
                    <AtomicText style={styles.dismissButtonText}>
                      {t("general.maybeLater", "Maybe Later")}
                    </AtomicText>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <AtomicText style={styles.title}>
                    {displayFeedbackTitle}
                  </AtomicText>
                  <AtomicText style={styles.description}>
                    {displayFeedbackDescription}
                  </AtomicText>

                  <TextInput
                    style={[styles.feedbackInput, { borderColor: tokens.colors.border }]}
                    placeholder={t("rating.feedbackPlaceholder", "Your feedback...")}
                    placeholderTextColor={tokens.colors.textSecondary}
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />

                  <View style={styles.feedbackButtons}>
                    <TouchableOpacity
                      style={[styles.submitButton, { backgroundColor: tokens.colors.primary }]}
                      onPress={handleFeedbackSubmit}
                    >
                      <AtomicText
                        style={[styles.submitButtonText, { color: tokens.colors.textInverse }]}
                      >
                        {t("general.submit", "Submit")}
                      </AtomicText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleClose}
                    >
                      <AtomicText style={styles.cancelButtonText}>
                        {t("general.cancel", "Cancel")}
                      </AtomicText>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const getStyles = (
  tokens: ReturnType<typeof useAppDesignTokens>,
  responsive: ReturnType<typeof useResponsive>,
  insets: { top: number; bottom: number },
) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    keyboardAvoid: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      width: responsive.maxContentWidth,
      maxWidth: "90%",
      borderRadius: STATIC_TOKENS.borders.radius.xl,
      padding: tokens.spacing.xl,
      maxHeight: "80%",
    },
    scrollContent: {
      alignItems: "center",
    },
    title: {
      ...STATIC_TOKENS.typography.headingMedium,
      color: tokens.colors.text,
      textAlign: "center",
      marginBottom: tokens.spacing.md,
      fontSize: responsive.getFontSize(
        STATIC_TOKENS.typography.headingMedium.fontSize ?? 24,
      ),
    },
    description: {
      ...STATIC_TOKENS.typography.bodyMedium,
      color: tokens.colors.textSecondary,
      textAlign: "center",
      marginBottom: tokens.spacing.xl,
      fontSize: responsive.getFontSize(
        STATIC_TOKENS.typography.bodyMedium.fontSize ?? 16,
      ),
    },
    starsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: tokens.spacing.xl,
      gap: tokens.spacing.md,
    },
    starButton: {
      padding: tokens.spacing.sm,
    },
    dismissButton: {
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
    },
    dismissButtonText: {
      ...STATIC_TOKENS.typography.bodyMedium,
      color: tokens.colors.textSecondary,
      fontSize: responsive.getFontSize(
        STATIC_TOKENS.typography.bodyMedium.fontSize ?? 16,
      ),
    },
    feedbackInput: {
      width: "100%",
      minHeight: 120,
      borderWidth: 1,
      borderRadius: STATIC_TOKENS.borders.radius.md,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.lg,
      ...STATIC_TOKENS.typography.bodyMedium,
      color: tokens.colors.text,
      fontSize: responsive.getFontSize(
        STATIC_TOKENS.typography.bodyMedium.fontSize ?? 16,
      ),
    },
    feedbackButtons: {
      width: "100%",
      flexDirection: "row",
      gap: tokens.spacing.md,
    },
    submitButton: {
      flex: 1,
      paddingVertical: tokens.spacing.md,
      borderRadius: STATIC_TOKENS.borders.radius.md,
      alignItems: "center",
    },
    submitButtonText: {
      ...STATIC_TOKENS.typography.bodyMedium,
      fontWeight: STATIC_TOKENS.typography.bold,
      fontSize: responsive.getFontSize(
        STATIC_TOKENS.typography.bodyMedium.fontSize ?? 16,
      ),
    },
    cancelButton: {
      flex: 1,
      paddingVertical: tokens.spacing.md,
      borderRadius: STATIC_TOKENS.borders.radius.md,
      alignItems: "center",
      backgroundColor: tokens.colors.surfaceSecondary,
    },
    cancelButtonText: {
      ...STATIC_TOKENS.typography.bodyMedium,
      color: tokens.colors.text,
      fontSize: responsive.getFontSize(
        STATIC_TOKENS.typography.bodyMedium.fontSize ?? 16,
      ),
    },
  });

