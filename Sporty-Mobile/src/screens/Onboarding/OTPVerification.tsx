import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TokenService } from "api/services/Token";
import PressableButton from "components/PressableButton";
import OtpInput from "components/onboarding/OtpInput";
import fontFamily from "constants/fontFamily";
import { AppNavigationParameterList } from "interfaces/AppNavigationParameterList";
import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { useState } from "react";

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, screenTopMargin } from "utility/scaling";

type Props = {
  navigation: NativeStackNavigationProp<
    AppNavigationParameterList,
    "OTPVerification"
  >;
  route: RouteProp<AppNavigationParameterList, "OTPVerification">;
};

function OTPVerification(props: Props) {
  const { navigation, route } = props;
  const styles = useThemedStyle(themedStyles);
  const insets = useSafeAreaInsets();
  const colours = useThemedColours();
  const { email } = route.params;
  //iscountdownactive not being used
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const [isOTPComplete, setIsOTPComplete] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendCountdown, setResendCountdown] = useState<number>(30);
  const [otpCodes, setOTPCodes] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  async function onPressDoneAsync() {
    setIsCountdownActive(false);
    setResendCountdown(30);
    const otpCodesString = otpCodes.join("");
    setIsLoading(true);
    const { data, error } = await TokenService.verifyTokenAsync(
      email,
      otpCodesString
    );

    if (error || !data) {
      setErrorMessage("Token not valid or must have expired");
      setIsLoading(false);
      return;
    }

    navigation.navigate("NewPassword", { email: email });
    setIsLoading(false);
    setNotificationMessage("");
  }

  async function onPressResendCodeAsync() {
    setResendCountdown(30);
    setIsCountdownActive(true);

    const { data, error } = await TokenService.createTokenAsync(email);

    if (error || !data) {
      setErrorMessage(error?.data.errors[0].message);
    }
    setNotificationMessage("You should have recieved an OTP code in your mail");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : "height"}
      enabled={Platform.OS === "ios" ? true : false}
      style={{ flex: 1, marginTop: insets.top + scale(screenTopMargin) }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.headerText}>OTP Code Verification</Text>
          <Text style={styles.subHeaderText}>
            We've sent a code to {email}. Enter the code in that message to
            continue.
          </Text>
          <View style={styles.formContainer}>
            <OtpInput
              setIsOTPComplete={setIsOTPComplete}
              resendCountdown={resendCountdown}
              setResendCountdown={setResendCountdown}
              isCountdownActive={isCountdownActive}
              setIsCountdownActive={setIsCountdownActive}
              otpCodes={otpCodes}
              setOTPCodes={setOTPCodes}
            />
            <View style={styles.notificationContainer}>
              {!!notificationMessage && (
                <Text style={styles.notificationText}>
                  {notificationMessage}
                </Text>
              )}
            </View>
            <View style={styles.errorContainer}>
              {!!errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
            </View>
          </View>
          <View style={[styles.bottomContainer, { bottom: 50 }]}>
            <View style={styles.buttonContainer}>
              <PressableButton
                title="Done"
                isLoading={isLoading}
                onPress={onPressDoneAsync}
                buttonWidth={"85%"}
                isDisabled={!isOTPComplete}
              />
            </View>
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn’t receive code?</Text>
              <TouchableOpacity onPress={onPressResendCodeAsync}>
                <Text style={[styles.resendText, { color: colours.primary }]}>
                  {" "}
                  Resend Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    container: {
      flex: 1,
      alignItems: "flex-start",
      paddingHorizontal: scale(16)
    },
    headerText: {
      marginTop: scale(10),
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: scale(24)
    },
    subHeaderText: {
      marginTop: scale(15),
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interRegular,
      fontSize: scale(14)
    },
    formContainer: {
      flex: 1,
      width: "100%",
      paddingVertical: scale(5),
      marginTop: scale(25)
    },
    notificationContainer: {
      flexDirection: "row",
      alignSelf: "center",
      marginTop: scale(20)
    },
    notificationText: {
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: 14,
      textAlign: "center",
      fontWeight: "500"
    },
    errorContainer: {
      flexDirection: "row",
      alignSelf: "center",
      marginTop: scale(8)
    },
    errorText: {
      color: colours.red,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: 14,
      textAlign: "center",
      fontWeight: "500"
    },
    bottomContainer: {
      flex: 1,
      position: "absolute",
      right: 0,
      left: 0
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: scale(7),
      width: "100%"
    },
    resendContainer: {
      width: "100%",
      //   backgroundColor: "red",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-end",
      marginTop: scale(20)
    },
    resendText: {
      textAlign: "center",
      fontFamily: fontFamily.fonts.interMedium,
      fontSize: scale(14),
      marginVertical: scale(4),
      color: colours.onSurface
    }
  });

export default OTPVerification;
