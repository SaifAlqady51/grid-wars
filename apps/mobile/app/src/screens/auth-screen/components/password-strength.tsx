import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PasswordStrengthProps {
  password: string;
  getPasswordStrength: (password: string) => {
    strength: "weak" | "medium" | "strong";
    color: string;
  } | null;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  getPasswordStrength,
}) => {
  const passwordStrength = getPasswordStrength(password);

  if (!passwordStrength) return null;

  return (
    <View style={styles.passwordStrengthContainer}>
      <View style={styles.strengthBarContainer}>
        <View
          style={[
            styles.strengthBar,
            {
              backgroundColor: passwordStrength.color,
              width:
                passwordStrength.strength === "weak"
                  ? "33%"
                  : passwordStrength.strength === "medium"
                    ? "66%"
                    : "100%",
            },
          ]}
        />
      </View>
      <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
        Password {passwordStrength.strength}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordStrengthContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthBar: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
