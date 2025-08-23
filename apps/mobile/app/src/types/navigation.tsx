import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type TabParamList = {
  Home: undefined;
  Personal: undefined;
  Battle: undefined;
};

export type ScreenComponentProps = {
  navigation: BottomTabNavigationProp<TabParamList>;
};
