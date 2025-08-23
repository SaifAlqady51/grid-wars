import React from "react";
import { View, Text, Button } from "react-native";
import { ScreenComponentProps } from "@/types";
import { Title } from "@/ui";
import { containerStyles } from "@/styles";

export const BattleScreen: React.FC<ScreenComponentProps> = ({
  navigation,
}) => {
  return (
    <View style={containerStyles.screen}>
      <Title>Battle Screen</Title>
      <Text style={containerStyles.description}>Ready for some action?</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate("Home")}
        color="#6200ee"
      />
    </View>
  );
};
