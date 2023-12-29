import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TokenService } from "api/services/Token";
import PressableButton from "components/PressableButton";
import BasicInput from "components/shared/BasicInput";
import fontFamily from "constants/fontFamily";
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
import { scale, screenTopMargin } from "utility/scaling";
import * as yup from "yup";

type Props = {
  navigation: NativeStackNavigationProp<
    AppNavigationParameterList,
    "ForgotPassword"
  >;
  route: RouteProp<AppNavigationParameterList, "ForgotPassword">;
};

function ForgotPassword(props: Props) {
  const { navigation } = props;
  const styles = useThemedStyle(themedStyles);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const insets = useSafeAreaInsets();

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is Required")
  });

  interface IForgotPassword {
    email: string;
  }
  const initialValues: IForgotPassword = {
    email: ""
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
    touched
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (createCustomer, { setSubmitting }) =>
      handleFormSubmit(createCustomer, setSubmitting)
  });

  const handleChange = (field: keyof IForgotPassword) => (text: string) => {
    setValues({ ...values, [field]: text });
  };

  async function handleFormSubmit(
    forgotPassword: IForgotPassword,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    const validationErrors = await validateForm(forgotPassword);

    if (Object.keys(validationErrors).length > 0) {
      setTouched(setNestedObjectValues(validationErrors, true));
      return;
    }
    setSubmitting(true);
    const isSuccessful = await formSubmitted(forgotPassword);
    setSubmitting(false);
    if (isSuccessful) {
      navigation.navigate("OTPVerification", { email: forgotPassword.email });
    }
  }

  async function formSubmitted(forgotPassword: IForgotPassword) {
    const { data, error } = await TokenService.createTokenAsync(
      forgotPassword.email
    );

    if (error || !data) {
      setErrorMessage("Issues generating token");
      return false;
    }

    return true;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled={true}
      style={{ flex: 1, marginTop: insets.top + scale(screenTopMargin) }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Forgot Password</Text>
          <Text style={styles.subHeaderText}>
            Recover your account password
          </Text>
          <View style={styles.formContainer}>
            <BasicInput
              value={values.email.toLowerCase().trim()}
              label="Email Address"
              errors={errors.email}
              touched={touched.email}
              textInputConfig={{
                onChangeText: handleChange("email"),
                onBlur: handleBlur("email")
              }}
            />
            <View style={styles.errorContainer}>
              {!!errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
            </View>
          </View>
          <View style={[styles.bottomContainer, { bottom: 60 }]}>
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
      marginTop: scale(40)
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
    }
  });

export default ForgotPassword;
