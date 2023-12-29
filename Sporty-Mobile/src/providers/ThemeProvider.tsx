import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { ThemeColours, ThemeType } from "./ThemeTypes";
import * as SecureStore from "expo-secure-store";

type ThemeState = {
  type: ThemeType;
  colours: ThemeColours;
  setType(mode: ThemeType): void;
};

const lightColours: ThemeColours = {
  surface: "rgba(255, 255, 255, 1)",
  onSurface: "rgba(18, 18, 18, 1)",
  primary: "#27AE60",
  borderColor: "#DDDDDD",
  red: "rgba(243, 80, 103, 1)",
  yellow: "blue"
};

const darkColours: ThemeColours = {
  surface: "#121212",
  onSurface: "rgba(243, 243, 243, 1)",
  primary: "#27AE60",
  borderColor: "#353535",
  red: "rgba(229, 115, 131, 1)",
  yellow: "red" // just for testing purposes
};

const defaultState: ThemeState = {
  type: ThemeType.Light, //modify this and get default state on app load
  colours: darkColours,
  setType: () => {}
};

export const ThemeContext = createContext(defaultState);

export const useThemeState = () => useContext(ThemeContext);
export const useThemedColours = () => useContext(ThemeContext).colours;

export const useThemeType = () => {
  const { type } = useThemeState();
  const systemTheme = useColorScheme();
  if (type === ThemeType.Auto) {
    return systemTheme === "light" ? ThemeType.Light : ThemeType.Dark;
  }
  return type;
};

export const useThemedStyle = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<unknown>
>(
  style: (colours: ThemeColours) => T
) => style(useThemedColours());

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const systemType = useThemeType();
  const [type, setType] = useState<ThemeType>(ThemeType.Dark); //create a slice to handle this or another provider (user type || system type)
  const systemTheme = useColorScheme();

  useEffect(() => {
    async function getUserTheme() {
      const userSelectedTheme = await SecureStore.getItemAsync("theme");
      if (userSelectedTheme === "light") {
        setType(ThemeType.Light);
      } else if (userSelectedTheme === "dark") {
        setType(ThemeType.Dark);
      } else if (userSelectedTheme === "auto") {
        setType(systemType);
      }
    }
    getUserTheme();
  }, []);

  function getColours() {
    switch (type) {
      case ThemeType.Dark:
        return darkColours;
      case ThemeType.Light:
        return lightColours;
      default:
        return systemTheme === "light" ? lightColours : darkColours;
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        type: type,
        colours: getColours(),
        setType: setType
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
