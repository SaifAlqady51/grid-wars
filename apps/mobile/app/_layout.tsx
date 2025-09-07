import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { IntroductionSlider } from "@/screens";
import { globalStyles } from "@/styles";
import AppNavigator from "./src/navigation/app-navigator";
import { AuthScreen } from "./src/screens/auth-screen";
import { FirstSplashScreen } from "./src/screens/first-splash-screen";

export default function RootLayout() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "splash" | "form" | "intro"
  >("splash");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentScreen("intro");
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleIntroFinish = () => {
    setCurrentScreen("form");
  };

  if (currentScreen === "splash") {
    return <FirstSplashScreen />;
  }

  if (currentScreen === "intro") {
    return (
      <View
        style={{ flex: 1, backgroundColor: globalStyles.colors.background }}
      >
        <IntroductionSlider onFinish={handleIntroFinish} />
      </View>
    );
  }

  if (currentScreen === "form") {
    return <AuthScreen />;
  }

  return <AppNavigator />;
}
