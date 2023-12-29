import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthenticationService } from "api/services/Authentication";
import PressableButton from "components/PressableButton";
import OAuthButtons from "components/onboarding/OAuthButtons";
import BasicInput from "components/shared/BasicInput";
import HorizontalDivider from "components/shared/Divider";
import PasswordInput from "components/shared/PasswordInput";
import fontFamily from "constants/fontFamily";
import { getCalendars } from "expo-localization";
import { setNestedObjectValues, useFormik } from "formik";
import { AppNavigationParameterList } from "interfaces/AppNavigationParameterList";
import { ILoginUser } from "interfaces/onboarding/ILoginUser";
import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch } from "store/hooks";
import { authenticate, setUser } from "store/slices/userSlice";
import { useGoogleSignIn } from "utility/authUtils";
import { convertUTCTime } from "utility/helperFunctions";
import { scale, screenTopMargin } from "utility/scaling";
import * as yup from "yup";

type Props = {
  navigation: NativeStackNavigationProp<AppNavigationParameterList, "Login">;
};

function Login(props: Props) {
  const { navigation } = props;
  const styles = useThemedStyle(themedStyles);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const colours = useThemedColours();
  const { promptAsync, isGoogleLoading } = useGoogleSignIn();

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
  });

  const initialValues = {
    email: "",
    password: ""
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

  const handleChange = (field: keyof ILoginUser) => (text: string) => {
    setValues({ ...values, [field]: text });
  };

  async function handleFormSubmit(
    loginUser: ILoginUser,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    const validationErrors = await validateForm(loginUser);
    if (Object.keys(validationErrors).length > 0) {
      setTouched(setNestedObjectValues(validationErrors, true));
      return;
    }

    setSubmitting(true);
    const isSuccessful = await formSubmitted(loginUser);
    setSubmitting(false);
    if (isSuccessful) {
      resetForm();
    }
  }

  async function formSubmitted(loginUser: ILoginUser) {
    const { data, error } = await AuthenticationService.loginAsync(loginUser);

    if (error || !data) {
      //TODO: parse these errors better
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

  async function onPressGoogleAsync() {
    await promptAsync();
  }

  function onPressSignup() {
    navigation.navigate("OnboardingOptions");
  }

  function onPressForgotPassword() {
    navigation.navigate("ForgotPassword");
  }

  return (
    <ScrollView
      style={[styles.flex, { marginTop: insets.top + scale(screenTopMargin) }]}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Login</Text>
        <View style={styles.formContainer}>
          <BasicInput
            value={values.email.toLowerCase().trim()}
            label="Email"
            errors={errors.email}
            touched={touched.email}
            textInputConfig={{
              onChangeText: handleChange("email"),
              onBlur: handleBlur("email")
            }}
          />
          <PasswordInput
            label="Password"
            value={values.password}
            errors={errors.password}
            touched={touched.password}
            textInputConfig={{
              onChangeText: handleChange("password"),
              onBlur: handleBlur("password")
            }}
          />
          <View style={styles.errorContainer}>
            {!!errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.forgotPassWordContainer}
            onPress={onPressForgotPassword}
          >
            <Text style={styles.forgotPassWord}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <PressableButton
            title="Log in"
            isLoading={isSubmitting}
            buttonWidth={"98%"}
            onPress={() => handleFormSubmit(values, setSubmitting)}
          />
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <View style={styles.dividerContainer}>
          <HorizontalDivider />
        </View>
        <View style={styles.oauthButtonsContainer}>
          <OAuthButtons
            buttonWidth={"90%"}
            onPressGoogle={onPressGoogleAsync}
            onPressApple={() => {}}
            isButtonLoading={isGoogleLoading ? "Google" : undefined}
          />
        </View>
        <TouchableOpacity
          style={styles.signUpContainer}
          onPress={onPressSignup}
        >
          <Text style={styles.signUpText}>Don’t have an account?</Text>
          <Text style={[styles.signUpText, { color: colours.primary }]}>
            {" "}
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    container: {
      alignItems: "flex-start",
      paddingHorizontal: scale(16)
    },
    headerText: {
      marginTop: scale(10),
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: scale(24)
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
      fontSize: scale(14),
      textAlign: "center",
      fontWeight: "500"
    },
    forgotPassWordContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-end"
    },
    forgotPassWord: {
      fontSize: scale(12),
      color: colours.primary,
      fontFamily: fontFamily.fonts.interBold
    },
    dividerContainer: {
      marginVertical: scale(15),
      width: "90%"
    },
    oauthButtonsContainer: {
      marginTop: 1,
      width: "100%"
    },
    actionsContainer: {
      flex: 1,
      alignItems: "center"
    },
    buttonContainer: {
      width: "100%",
      marginTop: scale(20)
    },
    signUpContainer: {
      width: "100%",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 50,
      flexDirection: "row",
      justifyContent: "center"
    },
    signUpText: {
      textAlign: "center",
      fontFamily: fontFamily.fonts.interMedium,
      fontSize: scale(14),
      color: colours.onSurface
    }
  });

export default Login;
