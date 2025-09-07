import React from "react";
import {
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../../styles";

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingHorizontal: globalStyles.spacing.md,
        paddingVertical: globalStyles.spacing.sm,
        minHeight: 32,
      },
      medium: {
        paddingHorizontal: globalStyles.spacing.lg,
        paddingVertical: globalStyles.spacing.md,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: globalStyles.spacing.xl,
        paddingVertical: globalStyles.spacing.lg,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled
          ? globalStyles.colors.inactive
          : globalStyles.colors.primary,
      },
      secondary: {
        backgroundColor: disabled
          ? globalStyles.colors.inactive
          : globalStyles.colors.secondary,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: disabled
          ? globalStyles.colors.inactive
          : globalStyles.colors.primary,
      },
      ghost: {
        backgroundColor: "transparent",
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: "100%" }),
      ...(disabled && { opacity: 0.6 }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: "600",
      textAlign: "center",
    };

    // Size styles
    const sizeStyles: Record<string, TextStyle> = {
      small: { fontSize: globalStyles.fonts.sm },
      medium: { fontSize: globalStyles.fonts.md },
      large: { fontSize: globalStyles.fonts.lg },
    };

    // Variant styles
    const variantStyles: Record<string, TextStyle> = {
      primary: { color: globalStyles.colors.surface },
      secondary: { color: globalStyles.colors.surface },
      outline: {
        color: disabled
          ? globalStyles.colors.inactive
          : globalStyles.colors.primary,
      },
      ghost: {
        color: disabled
          ? globalStyles.colors.inactive
          : globalStyles.colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "secondary"
              ? globalStyles.colors.surface
              : globalStyles.colors.primary
          }
        />
      );
    }

    return children;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
