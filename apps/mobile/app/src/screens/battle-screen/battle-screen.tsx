import React from "react";
import { View, Text, Button } from "react-native";
import { ScreenComponentProps } from "@/types";
import { Title } from "@/ui";
import { ContainerStyles } from "@/styles";
import { SafeAreaView } from "react-native-safe-area-context";

export const BattleScreen: React.FC<ScreenComponentProps> = ({
  navigation,
}) => {
  const styles = ContainerStyles();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#your-background-color" }}
    >
      <View style={styles.screen}>
        <Title>Battle Screen</Title>
        <Text style={styles.description}>Ready for some action?</Text>
        <Button
          title="Go to Home"
          onPress={() => navigation.navigate("Home")}
          color="#6200ee"
        />
      </View>
    </SafeAreaView>
  );
};
