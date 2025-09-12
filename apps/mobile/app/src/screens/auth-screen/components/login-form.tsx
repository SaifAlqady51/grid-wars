import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "../schema";
import { FormInput, Button } from "@/app/src/components/ui";
import { styles } from "./styles";
import { AccountService } from "@/app/src/service/account-service";

export const LoginForm: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData): Promise<void> => {
    setLoading(true);
    try {
      await AccountService.login(data);
      Alert.alert("Success", "Signed in successfully!");
      onFinish();
    } catch (error: any) {
      const errorMessage = error.message || "Sign in failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      {/* Email Input */}
      <FormInput
        name="email"
        control={control}
        errors={errors}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      {/* Password Input */}
      <FormInput
        name="password"
        control={control}
        errors={errors}
        placeholder="Password"
        secureTextEntry
        autoComplete="current-password"
      />

      {/* Submit Button */}
      <Button
        variant="primary"
        onPress={handleSubmit(handleLogin)}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </Button>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};
