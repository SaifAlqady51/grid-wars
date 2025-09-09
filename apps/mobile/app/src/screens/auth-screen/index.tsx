import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { styles } from "./components/styles";
import { RegisterForm } from "./components/register-form";
import { LoginForm } from "./components/login-form";
import { LoginFormData, RegisterFormData } from "./schema";
import { AccountService } from "../../service/account-service";

export const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async (data: LoginFormData): Promise<void> => {
    setLoading(true);
    try {
      console.log("Sign in data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Signed in successfully!");
    } catch (error) {
      Alert.alert("Error", "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (
    data: Omit<RegisterFormData, "confirmPassword">,
  ): Promise<void> => {
    setLoading(true);
    try {
      console.log("Sign up data:", data);

      const accountCreated = await AccountService.getInstance().register({
        ...data,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      Alert.alert("Error", "Account creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log("Google sign in initiated");

      // Simulate Google sign in
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Signed in with Google successfully!");
    } catch (error) {
      Alert.alert("Error", "Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = (): void => {
    setIsSignUp(!isSignUp);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp ? "Sign up to get started" : "Sign in to your account"}
            </Text>
          </View>

          {/* Auth Form */}
          {isSignUp ? (
            <RegisterForm onSubmit={handleSignUp} loading={loading} />
          ) : (
            <LoginForm onSubmit={handleSignIn} loading={loading} />
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <View style={styles.googleButtonContent}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {/* Toggle Auth Mode */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode} disabled={loading}>
              <Text style={styles.footerLink}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
