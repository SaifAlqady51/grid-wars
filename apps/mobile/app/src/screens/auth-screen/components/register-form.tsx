import React from "react";
import { View, Text } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getPasswordStrength,
  RegisterFormData,
  RegisterSchema,
} from "../schema";
import { styles } from "./styles";
import { FormInput, Button } from "@/app/src/components/ui/";
import { PasswordStrength } from "./password-strength";

interface SignUpFormProps {
  onSubmit: (data: Omit<RegisterFormData, "confirmPassword">) => Promise<void>;
  loading: boolean;
}

export const RegisterForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  loading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
  });

  const watchedPassword = watch("password");

  // Modified submit handler to include username
  const handleFormSubmit = async (data: RegisterFormData) => {
    await onSubmit({
      email: data.email,
      password: data.password,
      username: data.username,
    });
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

      <FormInput
        name="username"
        control={control}
        errors={errors}
        placeholder="Username"
        autoCapitalize="none"
        autoComplete="username"
      />

      {/* Password Input */}
      <View>
        <FormInput
          name="password"
          control={control}
          errors={errors}
          placeholder="Password"
          secureTextEntry
          autoComplete="new-password"
        />
        {/* Password Strength Indicator */}
        <PasswordStrength
          password={watchedPassword || ""}
          getPasswordStrength={getPasswordStrength}
        />
      </View>

      {/* Confirm Password Input */}
      <FormInput
        name="confirmPassword"
        control={control}
        errors={errors}
        placeholder="Confirm Password"
        secureTextEntry
        autoComplete="new-password"
      />

      <Button
        variant="primary"
        onPress={handleSubmit(handleFormSubmit)}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Text>
      </Button>
    </View>
  );
};
