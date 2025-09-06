// app/_layout.tsx
import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Image } from "react-native";
import Logo from "../assets/images/logo.png";
import { IntroductionSlider } from "@/screens";
import { ContainerStyles } from "@/styles";
import AppNavigator from "./src/navigation/app-navigator";

export default function RootLayout() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "splash" | "form" | "intro"
  >("splash");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentScreen("intro");
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleIntroFinish = () => {
    console.log("Intro finished");
    setCurrentScreen("home");
  };

  const FirstSplashScreen = () => {
    const styles = ContainerStyles();
    return (
      <SafeAreaView style={styles.screen}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image source={Logo} style={{ width: 150, height: 150 }} />
        </View>
      </SafeAreaView>
    );
  };

  if (currentScreen === "splash") {
    return <FirstSplashScreen />;
  }

  if (currentScreen === "intro") {
    return (
      <View style={{ flex: 1 }}>
        <IntroductionSlider onFinish={handleIntroFinish} />
      </View>
    );
  }

  if (currentScreen === "form") {
    return <AuthenticationScreen />;
  }

  return <AppNavigator />;
}
