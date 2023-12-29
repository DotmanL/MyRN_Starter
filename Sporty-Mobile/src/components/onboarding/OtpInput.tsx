import { useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { scale } from "utility/scaling";

type Props = {
  setIsOTPComplete: (isOTPComplete: boolean) => void;
  isCountdownActive: boolean;
  setIsCountdownActive: (isCountdownActive: boolean) => void;
  resendCountdown: number;
  setResendCountdown: (resendCountdown: any) => void;
  otpCodes: string[];
  setOTPCodes: (otpCodes: string[]) => void;
};

const otpCodeLength = 4;
function OtpInput(props: Props) {
  const styles = useThemedStyle(themedStyles);
  const {
    setIsOTPComplete,
    isCountdownActive,
    setIsCountdownActive,
    resendCountdown,
    setResendCountdown,
    otpCodes,
    setOTPCodes
  } = props;
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>(
    Array(otpCodeLength).fill(null)
  );
  const boxArray = [0, 1, 2, 3];

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    if (isCountdownActive) {
      countdownInterval = setInterval(() => {
        setResendCountdown((prevCountdown: number) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [isCountdownActive]);

  useEffect(() => {
    if (resendCountdown === 0) {
      setIsCountdownActive(false);
    }
  }, [resendCountdown]);

  function handleCodeChange(text: string, index: number) {
    const newCodes = [...otpCodes];
    newCodes[index] = text;
    setOTPCodes(newCodes);

    if (text.length === 1 && index < otpCodeLength) {
      const nextInput = inputRefs.current[index + 1];
      nextInput?.focus();
      setFocusedIndex(index + 1);
    }

    if (text.length === 0 && index > 0) {
      const previousInput = inputRefs.current[index - 1];
      previousInput?.focus();
      setFocusedIndex(index - 1);
    }

    const newIsOTPComplete = newCodes.every((code) => code.length === 1);
    setIsOTPComplete(newIsOTPComplete);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
        <View style={styles.topContainer}>
          <View style={styles.inputContainer}>
            {boxArray.map((_, index) => (
              <View key={index}>
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    index === focusedIndex ? styles.inputFocused : styles.input
                  ]}
                  keyboardType="number-pad"
                  value={otpCodes[index]}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  maxLength={1}
                  onPressIn={() => setFocusedIndex(index)}
                />
              </View>
            ))}
          </View>
        </View>
      </>
    </TouchableWithoutFeedback>
  );
}
const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colours.surface
    },
    topContainer: {
      marginTop: scale(25),
      width: "100%",
      alignItems: "center"
    },

    inputContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    input: {
      borderColor: colours.borderColor,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      fontSize: scale(16),
      width: scale(67),
      height: scale(67),
      borderRadius: 5,
      borderWidth: 2,
      backgroundColor: colours.surface,
      color: colours.onSurface
    },
    inputFocused: {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      fontSize: scale(16),
      width: scale(67),
      height: scale(67),
      borderRadius: 5,
      borderWidth: 2,
      borderColor: colours.primary,
      backgroundColor: colours.surface,
      color: colours.onSurface
    }
  });

export default OtpInput;
