import React, { createContext, useContext } from "react";

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    destructive: string;
    background: string;
    surface: string;
    text: string;
    inactive: string;
    border: string;
    navigation: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    small: number;
    medium: number;
    large: number;
  };
}

const lightTheme: Theme = {
  colors: {
    primary: "#0077B6",
    secondary: "#00A682",
    destructive: "#E45651",
    background: "#10002B",
    text: "#E3E3E3",
    inactive: "gray",
    border: "#e7e7e7",
    surface: "#f8f8f8",
    navigation: "#B5179E",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    small: 12,
    medium: 16,
    large: 24,
  },
};

const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeContext.Provider value={lightTheme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
