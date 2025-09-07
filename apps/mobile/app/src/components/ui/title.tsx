import { TextProps, Text } from "react-native";
import { globalStyles } from "../../styles";

interface TitleProps extends TextProps {
  children: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ children, style, ...props }) => {
  return (
    <Text
      style={[
        {
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 12,
          color: globalStyles.colors.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
