import { globalStyles } from "@/app/src/styles";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: globalStyles.spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: globalStyles.spacing.xl,
  },
  title: {
    fontSize: globalStyles.fonts["4xl"],
    fontWeight: "bold",
    color: globalStyles.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: globalStyles.fonts.lg,
    color: globalStyles.colors.textSecondary,
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  passwordStrengthContainer: {
    marginTop: globalStyles.spacing.sm,
    marginHorizontal: globalStyles.spacing.xs,
  },
  strengthBarContainer: {
    height: 3,
    backgroundColor: globalStyles.colors.surface,
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthBar: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 11,
    fontWeight: "500",
  },
  passwordRequirements: {
    backgroundColor: globalStyles.colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: globalStyles.colors.textSecondary,
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 11,
    color: globalStyles.colors.textSecondary,
    lineHeight: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: globalStyles.colors.surface,
    fontSize: globalStyles.fonts.lg,
    fontWeight: "600",
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 8,
  },
  forgotPasswordText: {
    color: globalStyles.colors.primary,
    fontSize: 14,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: globalStyles.colors.surface,
  },
  dividerText: {
    marginHorizontal: 16,
    color: globalStyles.colors.surface,
    fontSize: 14,
    fontWeight: "500",
  },
  googleButton: {
    backgroundColor: globalStyles.colors.surface,
    borderWidth: 1,
    borderColor: globalStyles.colors.border,
    marginBottom: 24,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 12,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 24,
    borderRadius: 12,
  },
  googleButtonText: {
    color: globalStyles.colors.black,
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: globalStyles.colors.textSecondary,
    fontSize: 14,
    marginRight: 4,
  },
  footerLink: {
    color: globalStyles.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  debugInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: "#666",
  },
});
