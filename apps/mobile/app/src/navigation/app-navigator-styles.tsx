import { StyleSheet } from "react-native";
import { useTheme } from "../context/theme-context";

export const useNavigationStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    tabBar: {
      backgroundColor: theme.colors.navigation,
      position: "absolute",
      borderWidth: 0,
      borderTopWidth: 0,
      height: 60,
      paddingBottom: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderRadius: 20,
      marginBottom: 28,
      marginHorizontal: 16,
    },
    tabLabel: {
      fontSize: theme.typography.small,
      fontWeight: "500",
      color: theme.colors.text,
    },
    header: {
      backgroundColor: theme.colors.navigation,
    },
    headerTitle: {
      fontWeight: "bold",
      color: theme.colors.text,
      fontSize: theme.typography.medium,
    },
  });
};

// You can keep your static colors export if needed
export const colors = {
  primary: "#DEE2E6",
  inactive: "#34A40",
  white: "#fff",
  background: "#f8f8f8",
  border: "#e7e7e7",
};
