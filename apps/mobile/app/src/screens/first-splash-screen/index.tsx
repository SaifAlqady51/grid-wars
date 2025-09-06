import { SafeAreaView } from "react-native-safe-area-context";
import { ContainerStyles } from "../../styles";
import { Image, View } from "react-native";
import Logo from "@/assets/images/logo.png";

export const FirstSplashScreen = () => {
  const styles = ContainerStyles();
  return (
    <SafeAreaView style={styles.screen}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={Logo} style={{ width: 150, height: 150 }} />
      </View>
    </SafeAreaView>
  );
};
