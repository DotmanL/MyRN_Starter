import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "@react-native-material/core";
import fontFamily from "constants/fontFamily";
import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View
} from "react-native";
import { scale } from "utility/scaling";

type Props = {
  label: string;
  value: string;
  textInputConfig?: TextInputProps;
  overlayColor?: string;
  errors?: string;
  touched?: boolean;
  showIcon?: boolean;
  placeholder?: string;
};

function PasswordInput(props: Props) {
  const {
    label,
    placeholder,
    textInputConfig,
    errors,
    touched,
    value,
    showIcon = true
  } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const colours = useThemedColours();
  const styles = useThemedStyle(themedStyles);

  return (
    <View
      style={[
        styles.topContainer,
        { marginBottom: touched && errors ? scale(12) : scale(5) }
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          secureTextEntry={isPasswordVisible}
          placeholder={placeholder ? placeholder : label}
          placeholderTextColor={colours.onSurface}
          returnKeyType="next"
          returnKeyLabel="next"
          {...textInputConfig}
        />
        {showIcon && (
          <IconButton
            style={styles.icon}
            onPress={() => {
              isPasswordVisible
                ? setIsPasswordVisible(false)
                : setIsPasswordVisible(true);
            }}
            icon={() => (
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={24}
                color={colours.onSurface}
              />
            )}
          />
        )}
      </View>

      <Text
        style={{
          color: "red",
          fontSize: 12,
          marginTop: scale(4),
          marginBottom: scale(4),
          paddingHorizontal: scale(5)
        }}
      >
        {touched && errors}
      </Text>
    </View>
  );
}

const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    topContainer: {
      width: "100%",
      height: scale(90)
    },
    label: {
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interBold
    },
    input: {
      marginBottom: scale(2),
      borderRadius: scale(6),
      height: scale(48),
      width: "100%",
      borderWidth: 1,
      paddingHorizontal: scale(10),
      borderColor: colours.borderColor,
      color: colours.onSurface
    },
    inputContainer: {
      justifyContent: "center",
      marginTop: scale(8)
    },
    icon: {
      position: "absolute",
      right: 10
    }
  });

export default PasswordInput;
