import { StyleSheet } from "react-native";
import { useTheme } from "../context";

export const ContainerStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      height: "auto",
    },
    description: {
      color: theme.colors.text,
      fontSize: theme.typography.medium,
      textAlign: "center",
      marginVertical: theme.spacing.md,
    },
  });
};
