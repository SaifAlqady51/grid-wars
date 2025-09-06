import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export const colors = {
  primary: "#007AFF",
  secondary: "#5856D6",
  success: "#34C759",
  danger: "#FF3B30",
  warning: "#FF9500",
  background: "#10002B",
  text: "#000",
  textSecondary: "#8E8E93",
};
