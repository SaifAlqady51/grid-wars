import React from "react";
import { View, Text } from "react-native";
import { ScreenComponentProps } from "@/types";
import { Button, Title } from "@/ui";
import { containerStyles } from "@/styles";

export const HomeScreen: React.FC<ScreenComponentProps> = ({ navigation }) => {
  return (
    <View style={containerStyles.screen}>
      <View style={{ backgroundColor: "grey" }}>Daily Challenge</View>
      <Title>Grid Wars</Title>
      <Text style={containerStyles.description}>
        Welcome to your home base!
      </Text>
      <Button
        onPress={() => navigation.navigate("Battle")}
        style={{ width: "100%" }}
      >
        <>
          <Text>Continue</Text>
          <Text>00:11</Text>
        </>
      </Button>
    </View>
  );
};
