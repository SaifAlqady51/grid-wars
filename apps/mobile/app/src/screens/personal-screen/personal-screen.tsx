import React from "react";
import { View, Text } from "react-native";
import { ScreenComponentProps } from "@/types";
import { Title } from "@/ui";
import { ContainerStyles } from "@/styles";

export const PersonalScreen: React.FC<ScreenComponentProps> = () => {
  const styles = ContainerStyles();
  return (
    <View style={styles.screen}>
      <Title>Personal Screen</Title>
      <Text style={styles.description}>Manage your profile and settings</Text>
    </View>
  );
};
