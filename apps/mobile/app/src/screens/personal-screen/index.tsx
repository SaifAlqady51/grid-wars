import React from "react";
import { View, Text } from "react-native";
import { ScreenComponentProps } from "@/types";
import { Title } from "@/ui";
import { ContainerStyles } from "@/styles";

export const PersonalScreen: React.FC<ScreenComponentProps> = () => {
  return (
    <View style={ContainerStyles.screen}>
      <Title>Personal Screen</Title>
      <Text style={ContainerStyles.description}>
        Manage your profile and settings
      </Text>
    </View>
  );
};
