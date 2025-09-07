import { StyleSheet } from "react-native";
import { globalStyles } from "./global";

export const ContainerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: globalStyles.colors.background,
    padding: globalStyles.spacing.md,
    height: "auto",
  },
  description: {
    color: globalStyles.colors.text,
    fontSize: globalStyles.fonts.md,
    textAlign: "center",
    marginVertical: globalStyles.spacing.md,
  },
});
