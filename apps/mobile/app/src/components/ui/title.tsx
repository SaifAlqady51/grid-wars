import { useTheme } from "../../context/theme-context";
import { TextProps, Text } from "react-native";

interface TitleProps extends TextProps {
  children: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ children, style, ...props }) => {
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 12,
          color: theme.colors.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
