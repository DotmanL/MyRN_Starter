import fontFamily from "constants/fontFamily";
import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import React, { Ref, forwardRef } from "react";
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
  placeholder?: string;
};

const BasicInput = forwardRef<View, Props>((props: Props, ref: Ref<View>) => {
  const { label, textInputConfig, errors, touched, value, placeholder } = props;
  const colours = useThemedColours();
  const styles = useThemedStyle(themedStyles);

  return (
    <View
      style={[
        styles.topContainer,
        { marginBottom: touched && errors ? scale(12) : scale(5) }
      ]}
      ref={ref}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder ? placeholder : label}
          placeholderTextColor={colours.onSurface}
          returnKeyType="next"
          returnKeyLabel="next"
          {...textInputConfig}
        />
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
});

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
      left: 10,
      marginRight: 10
    }
  });

export default BasicInput;
