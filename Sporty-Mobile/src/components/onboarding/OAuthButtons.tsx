import React from "react";
import { DimensionValue, StyleSheet, View } from "react-native";
import OAuthButton from "./OAuthButton";
import AppleIcon from "./assets/appleIcon.svg";
import MailIcon from "./assets/mailIcon.svg";
import MailDarkModeIcon from "./assets/mailDarkModeIcon.svg";
import { useThemeState } from "providers/ThemeProvider";
import { ThemeType } from "providers/ThemeTypes";

export type ButtonLoadingType = "Google" | "Apple" | undefined;

type Props = {
  onPressEmail?: () => void;
  onPressGoogle?: () => void;
  onPressApple?: () => void;
  buttonWidth?: DimensionValue;
  isButtonLoading?: ButtonLoadingType;
};

function OAuthButtons(props: Props) {
  const themeState = useThemeState();

  const {
    onPressEmail,
    onPressGoogle,
    onPressApple,
    buttonWidth,
    isButtonLoading
  } = props;
  return (
    <View style={styles.container}>
      {onPressEmail && (
        <OAuthButton
          title="Continue with Email" //TODO:come back to fix email icon in dark mode
          SvgIcon={
            themeState.type === ThemeType.Light ? MailIcon : MailDarkModeIcon
          }
          onPress={onPressEmail}
          buttonWidth={buttonWidth}
        />
      )}
      {onPressGoogle && (
        <OAuthButton
          title="Continue with Google"
          source={require(`./assets/google.png`)}
          onPress={onPressGoogle}
          buttonWidth={buttonWidth}
          isButtonLoading={
            isButtonLoading === "Google" ? isButtonLoading : undefined
          }
        />
      )}
      {onPressApple && (
        <OAuthButton
          title="Continue with Apple"
          SvgIcon={AppleIcon}
          onPress={onPressApple}
          buttonWidth={buttonWidth}
          isButtonLoading={
            isButtonLoading === "Apple" ? isButtonLoading : undefined
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%"
  }
});

export default OAuthButtons;
