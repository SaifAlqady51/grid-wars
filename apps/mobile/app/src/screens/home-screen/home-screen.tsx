import React from "react";
import { View, Text } from "react-native";
import { ScreenComponentProps } from "@/types";
import { Button, Title } from "@/ui";
import { ContainerStyles } from "@/styles";

export const HomeScreen: React.FC<ScreenComponentProps> = ({ navigation }) => {
  const styles = ContainerStyles();
  return (
    <View style={styles.screen}>
      <Text style={{ backgroundColor: "grey" }}>Daily Challenge</Text>
      <Title>Grid Wars</Title>
      <Text style={styles.description}>Welcome to your home base!</Text>
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
