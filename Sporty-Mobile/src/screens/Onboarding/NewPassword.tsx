import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthenticationService } from "api/services/Authentication";
import PressableButton from "components/PressableButton";
import PasswordInput from "components/shared/PasswordInput";
import fontFamily from "constants/fontFamily";
import { getCalendars } from "expo-localization";
import { setNestedObjectValues, useFormik } from "formik";
import { AppNavigationParameterList } from "interfaces/AppNavigationParameterList";
import { useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { useState } from "react";

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch } from "store/hooks";
import { authenticate, setUser } from "store/slices/userSlice";
import { convertUTCTime } from "utility/helperFunctions";
import { scale, screenTopMargin } from "utility/scaling";
import * as yup from "yup";

type Props = {
  navigation: NativeStackNavigationProp<
    AppNavigationParameterList,
    "NewPassword"
  >;
  route: RouteProp<AppNavigationParameterList, "NewPassword">;
};

function NewPassword(props: Props) {
  const { route } = props;
  const styles = useThemedStyle(themedStyles);
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const insets = useSafeAreaInsets();
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);
  const { email } = route.params;

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
  });

  interface IConfirmPassword {
    password: string;
    confirmPassword: string;
  }
  const initialValues: IConfirmPassword = {
    password: "",
    confirmPassword: ""
  };

  const {
    handleBlur,
    values,
    setValues,
    setTouched,
    isSubmitting,
    validateForm,
    setSubmitting,
    errors,
    touched,
    resetForm
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (createCustomer, { setSubmitting }) =>
      handleFormSubmit(createCustomer, setSubmitting)
  });

  function handleConfirmPassword(field: keyof IConfirmPassword, text: string) {
    setValues({ ...values, [field]: text });
    if (field === "password" && values.confirmPassword.length > 0) {
      setIsPasswordMatch(values.confirmPassword === text);
    } else if (field === "confirmPassword") {
      setIsPasswordMatch(values.password === text);
    }
  }

  async function handleFormSubmit(
    confirmPassword: IConfirmPassword,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    const validationErrors = await validateForm(confirmPassword);

    if (Object.keys(validationErrors).length > 0) {
      setTouched(setNestedObjectValues(validationErrors, true));
      return;
    }
    setSubmitting(true);
    const isSuccessful = await formSubmitted(confirmPassword);
    setSubmitting(false);
    if (isSuccessful) {
      resetForm();
    }
  }

  async function formSubmitted(confirmPassword: IConfirmPassword) {
    const { data, error } = await AuthenticationService.resetPasswordAsync(
      email,
      confirmPassword.password
    );

    if (error || !data) {
      if (error?.data.errors[0].msg.includes("400")) {
        setErrorMessage("Invalid email or password");
        return false;
      }
      setErrorMessage(error?.data.errors[0].msg);
      return false;
    }

    const { timeZone: userTimezone } = getCalendars()[0];
    const { accessToken, expirationDate, refreshToken, user } = data;

    let localizedExpirationDateTimeString = "";

    if (userTimezone) {
      localizedExpirationDateTimeString = convertUTCTime(
        expirationDate,
        userTimezone
      );
    }

    dispatch(
      authenticate({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: user.id,
        localizedExpirationDateTimeString: localizedExpirationDateTimeString
      })
    );
    dispatch(setUser(user));
    return true;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : "height"}
      enabled={Platform.OS === "ios" ? true : false}
      style={{ flex: 1, marginTop: insets.top + scale(screenTopMargin) }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Create a New Password</Text>
          <Text style={styles.subHeaderText}>Enter your new password</Text>
          <View style={styles.formContainer}>
            <PasswordInput
              label="New Password"
              placeholder="Enter your password"
              value={values.password}
              errors={errors.password}
              touched={touched.password}
              textInputConfig={{
                onChangeText: (text) => handleConfirmPassword("password", text),
                onBlur: handleBlur("password")
              }}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Enter your password"
              value={values.confirmPassword}
              errors={errors.confirmPassword}
              touched={touched.confirmPassword}
              textInputConfig={{
                onChangeText: (text) =>
                  handleConfirmPassword("confirmPassword", text),
                onBlur: handleBlur("confirmPassword")
              }}
            />
            <View style={styles.errorContainer}>
              {!isPasswordMatch && (
                <Text style={styles.errorText}>Password don't match</Text>
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
                title="Continue"
                isLoading={isSubmitting}
                onPress={() => handleFormSubmit(values, setSubmitting)}
                buttonWidth={"85%"}
              />
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
      marginTop: scale(35)
    },
    errorContainer: {
      flexDirection: "row",
      alignSelf: "center",
      marginTop: scale(4)
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
    }
  });

export default NewPassword;
