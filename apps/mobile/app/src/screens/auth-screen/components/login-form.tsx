import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "../schema";
import { FormInput, Button } from "@/app/src/components/ui";
import { styles } from "./styles";

interface SignInFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
}

export const LoginForm: React.FC<SignInFormProps> = ({ onSubmit, loading }) => {
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
        onPress={handleSubmit(onSubmit)}
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
