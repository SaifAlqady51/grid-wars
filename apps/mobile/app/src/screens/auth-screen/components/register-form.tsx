import React from "react";
import { View, Text, Alert } from "react-native";
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
import { AccountService } from "@/app/src/service/account-service";

export const RegisterForm: React.FC<{ onFinish: () => void }> = ({
  onFinish,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
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

  const handleRegister = async (
    data: Omit<RegisterFormData, "confirmPassword">,
  ): Promise<void> => {
    setLoading(true);
    try {
      await AccountService.register({
        ...data,
      });
      Alert.alert("Success", "Account created successfully!");
      onFinish();
    } catch (error: any) {
      const errorMessage =
        error.message || "Account creation failed. Please try again.";
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
        onPress={handleSubmit(handleRegister)}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Text>
      </Button>
    </View>
  );
};
