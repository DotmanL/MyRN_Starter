import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import React from "react";
import {
  ActivityIndicator,
  ColorValue,
  DimensionValue,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { scale } from "utility/scaling";

type Props = {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  spinnerSize?: number | "small" | "large" | undefined;
  spinnerColor?: string;
  isDisabled?: boolean;
  isOutlined?: boolean;
  buttonWidth?: DimensionValue;
  buttonBackgroundColor?: ColorValue;
};

function PressableButton(props: Props) {
  const {
    onPress,
    title,
    isDisabled,
    isLoading = false,
    spinnerSize = "small",
    spinnerColor,
    isOutlined,
    buttonWidth,
    buttonBackgroundColor
  } = props;

  const styles = useThemedStyle(themedStyles);
  const colours = useThemedColours();

  return (
    <View style={styles.container}>
      <Pressable
        disabled={isDisabled}
        android_ripple={{ color: "#cccc" }}
        style={({ pressed }) => [
          {
            opacity: pressed || isDisabled ? 0.6 : 1,
            width: !!buttonWidth ? buttonWidth : "80%",
            backgroundColor: buttonBackgroundColor
              ? buttonBackgroundColor
              : colours.primary
          },
          isOutlined ? styles.buttonOutlined : styles.button
        ]}
        onPress={onPress}
      >
        {isLoading ? (
          <ActivityIndicator
            color={spinnerColor || "white"}
            size={spinnerSize}
          />
        ) : (
          <Text
            style={isOutlined ? styles.outlinedButtonText : styles.buttonText}
          >
            {title}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      width: "100%"
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      height: scale(48),
      paddingVertical: scale(14),
      paddingHorizontal: scale(48),
      borderRadius: 4,
      elevation: 3
    },
    buttonOutlined: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: scale(14),
      paddingHorizontal: scale(48),
      borderRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colours.borderColor
    },
    buttonText: {
      fontSize: scale(16),
      lineHeight: 21,
      fontWeight: "bold",
      letterSpacing: 0.25,
      color: "white"
    },
    outlinedButtonText: {
      fontSize: scale(16),
      lineHeight: 21,
      fontWeight: "bold",
      letterSpacing: 0.25,
      color: colours.surface
    }
  });

export default PressableButton;
