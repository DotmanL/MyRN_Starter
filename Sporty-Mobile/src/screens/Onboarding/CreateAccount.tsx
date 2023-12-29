import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthenticationService } from "api/services/Authentication";
import PressableButton from "components/PressableButton";
import BasicInput from "components/shared/BasicInput";
import Link from "components/shared/Link";
import PasswordInput from "components/shared/PasswordInput";
import fontFamily from "constants/fontFamily";
import { getCalendars } from "expo-localization";
import { setNestedObjectValues, useFormik } from "formik";
import { AppNavigationParameterList } from "interfaces/AppNavigationParameterList";
import { ICreateUser } from "interfaces/onboarding/ICreateUser";
import { OauthType } from "interfaces/onboarding/IJwtAuthenticationResponse";
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
import { useAppDispatch } from "store/hooks";
import { authenticate, setUser } from "store/slices/userSlice";
import { PROVIDER_ID } from "utility/authUtils";
import { convertUTCTime } from "utility/helperFunctions";
import { scale, screenTopMargin } from "utility/scaling";
import * as yup from "yup";

type Props = {
  navigation: NativeStackNavigationProp<
    AppNavigationParameterList,
    "CreateAccount"
  >;
  route: RouteProp<AppNavigationParameterList, "CreateAccount">;
};

function CreateAccount(props: Props) {
  const { navigation, route } = props;
  const styles = useThemedStyle(themedStyles);
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const insets = useSafeAreaInsets();
  const colours = useThemedColours();
  const { idToken, oauthType, email } = route.params;

  const validationSchema = yup.object().shape({
    userName: yup.string().trim().required("Username is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    password:
      oauthType === OauthType.None
        ? yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required")
        : yup.string().notRequired()
  });

  const initialValues: ICreateUser = {
    userName: "",
    email: !!email ? email : "",
    password: oauthType === OauthType.None ? "" : undefined
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

  const handleChange = (field: keyof ICreateUser) => (text: string) => {
    setValues({ ...values, [field]: text });
  };

  async function handleFormSubmit(
    createUser: ICreateUser,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    const validationErrors = await validateForm(createUser);

    if (Object.keys(validationErrors).length > 0) {
      setTouched(setNestedObjectValues(validationErrors, true));
      return;
    }
    setSubmitting(true);
    const isSuccessful = await formSubmitted(createUser);
    setSubmitting(false);
    if (isSuccessful) {
      resetForm();
      navigation.navigate("FavouriteLeague");
    }
  }

  async function handleCreateAccountAsync(createUser: ICreateUser) {
    //TODO: refactor to a switch once I have Apple
    if (idToken && oauthType === OauthType.Google) {
      const createUserWithIdp: ICreateUser = {
        ...createUser,
        userName: createUser.userName.trim(),
        idToken: idToken,
        providerId: PROVIDER_ID
      };
      const { data, error } = await AuthenticationService.signUpWithIdpAsync(
        createUserWithIdp
      );
      return { data, error };
    } else {
      const { data, error } = await AuthenticationService.signUpAsync(
        createUser
      );
      return { data, error };
    }
  }

  async function formSubmitted(createUser: ICreateUser) {
    const { data, error } = await handleCreateAccountAsync(createUser);
    if (error || !data) {
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

  function onPressLogin() {
    navigation.navigate("Login");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled={false}
      style={{ flex: 1, marginTop: insets.top + scale(screenTopMargin) }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Create an account</Text>
          <View style={styles.formContainer}>
            <BasicInput
              value={values.userName.trim()}
              label="Username"
              errors={errors.userName}
              touched={touched.userName}
              textInputConfig={{
                onChangeText: handleChange("userName"),
                onBlur: handleBlur("userName")
              }}
            />
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
            {oauthType === OauthType.None && (
              <PasswordInput
                label="Password"
                value={values.password!}
                errors={errors.password}
                touched={touched.password}
                textInputConfig={{
                  onChangeText: handleChange("password"),
                  onBlur: handleBlur("password")
                }}
              />
            )}

            <View style={styles.errorContainer}>
              {!!errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
            </View>
          </View>
          <View style={[styles.bottomContainer, { bottom: 40 }]}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                By creating your account, you agree to
                <Link url={"https://dotsporty.netlify.app/"}> our Terms </Link>
                and and acknowledge our
                <Link url={"https://dotsporty.netlify.app/"}>
                  {" "}
                  Privacy Policy.
                </Link>
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <PressableButton
                title="Create account"
                isLoading={isSubmitting}
                onPress={() => handleFormSubmit(values, setSubmitting)}
              />
            </View>
            <TouchableOpacity
              style={styles.loginContainer}
              onPress={onPressLogin}
            >
              <Text style={styles.loginText}>Already have an account?</Text>
              <Text
                style={[styles.loginText, { color: colours.primary }]}
                onPress={onPressLogin}
              >
                {" "}
                Log in
              </Text>
            </TouchableOpacity>
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
    formContainer: {
      flex: 1,
      width: "100%",
      paddingVertical: scale(5),
      marginTop: scale(20)
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
    textContainer: {
      marginVertical: scale(10)
    },
    text: {
      fontFamily: fontFamily.fonts.interRegular,
      fontSize: scale(12),
      textAlign: "center",
      color: colours.onSurface,
      paddingHorizontal: scale(24),
      lineHeight: 20
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
    loginContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: scale(15)
    },
    loginText: {
      textAlign: "center",
      fontFamily: fontFamily.fonts.interMedium,
      fontSize: scale(14),
      color: colours.onSurface
    }
  });

export default CreateAccount;
