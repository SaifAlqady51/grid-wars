import { useTheme } from "@/context";
import React from "react";
import {
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";

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
  const theme = useTheme();

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
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 32,
      },
      medium: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled
          ? theme.colors.inactive
          : theme.colors.primary,
      },
      secondary: {
        backgroundColor: disabled
          ? theme.colors.inactive
          : theme.colors.secondary,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: disabled ? theme.colors.inactive : theme.colors.primary,
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
      small: { fontSize: theme.typography.small },
      medium: { fontSize: theme.typography.medium },
      large: { fontSize: theme.typography.large },
    };

    // Variant styles
    const variantStyles: Record<string, TextStyle> = {
      primary: { color: theme.colors.surface },
      secondary: { color: theme.colors.surface },
      outline: {
        color: disabled ? theme.colors.inactive : theme.colors.primary,
      },
      ghost: { color: disabled ? theme.colors.inactive : theme.colors.primary },
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
              ? theme.colors.surface
              : theme.colors.primary
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
