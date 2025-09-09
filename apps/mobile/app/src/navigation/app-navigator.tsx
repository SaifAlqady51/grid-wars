import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors, useNavigationStyles } from "./app-navigator-styles";
import { TabParamList } from "../types";
import { BattleScreen, HomeScreen, PersonalScreen } from "@/screens";
import { globalStyles } from "../styles";

const Tab = createBottomTabNavigator<TabParamList>();

const AppNavigator: React.FC = () => {
  const navigationStyles = useNavigationStyles();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Personal") {
            iconName = "person";
          } else if (route.name === "Battle") {
            iconName = "game-controller";
          }
          return <Ionicons name={iconName!} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: navigationStyles.tabBar,
        tabBarLabelStyle: navigationStyles.tabLabel,
        headerStyle: navigationStyles.header,
        headerTintColor: globalStyles.colors.navigation,
        headerTitleStyle: navigationStyles.headerTitle,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Personal"
        component={PersonalScreen}
        options={{ title: "Personal" }}
      />
      <Tab.Screen
        name="Battle"
        component={BattleScreen}
        options={{ title: "Battle Arena" }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
