import React from "react";
import { View, Text } from "react-native";
import { ScreenComponentProps } from "@/types";
import { Title } from "@/ui";
import { containerStyles } from "@/styles";

export const PersonalScreen: React.FC<ScreenComponentProps> = () => {
  return (
    <View style={containerStyles.screen}>
      <Title>Personal Screen</Title>
      <Text style={containerStyles.description}>
        Manage your profile and settings
      </Text>
    </View>
  );
};
