import { StyleSheet } from "react-native";
import { globalStyles } from "../styles";

export const useNavigationStyles = () => {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: globalStyles.colors.navigation,
      position: "absolute",
      borderWidth: 0,
      borderTopWidth: 0,
      height: 60,
      paddingBottom: globalStyles.spacing.sm,
      paddingTop: globalStyles.spacing.sm,
      borderRadius: 20,
      marginBottom: 28,
      marginHorizontal: 16,
    },
    tabLabel: {
      fontSize: globalStyles.fonts.sm,
      fontWeight: "500",
      color: globalStyles.colors.text,
    },
    header: {
      backgroundColor: globalStyles.colors.navigation,
    },
    headerTitle: {
      fontWeight: "bold",
      color: globalStyles.colors.text,
      fontSize: globalStyles.fonts.md,
    },
  });
};

export const colors = {
  primary: "#DEE2E6",
  inactive: "#34A40",
  white: "#fff",
  background: "#f8f8f8",
  border: "#e7e7e7",
};
