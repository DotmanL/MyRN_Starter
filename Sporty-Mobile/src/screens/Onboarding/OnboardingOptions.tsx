import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import OAuthButtons from "components/onboarding/OAuthButtons";
import fontFamily from "constants/fontFamily";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { AppNavigationParameterList } from "interfaces/AppNavigationParameterList";
import { OauthType } from "interfaces/onboarding/IJwtAuthenticationResponse";
import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGoogleSignIn } from "utility/authUtils";
import { scale, screenTopMargin } from "utility/scaling";

type Props = {
  navigation: NativeStackNavigationProp<
    AppNavigationParameterList,
    "OnboardingOptions"
  >;
};

WebBrowser.maybeCompleteAuthSession();

function OnboardingOptions(props: Props) {
  const { navigation } = props;
  const styles = useThemedStyle(themedStyles);
  const insets = useSafeAreaInsets();
  const colours = useThemedColours();
  const { promptAsync, isGoogleLoading } = useGoogleSignIn();

  function onPressEmail() {
    navigation.navigate("CreateAccount", { oauthType: OauthType.None });
  }

  async function onPressGoogleAsync() {
    await promptAsync();
  }

  function onPressLogin() {
    navigation.navigate("Login");
  }

  return (
    <ScrollView
      style={[styles.flex, { marginTop: insets.top + scale(screenTopMargin) }]}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Sporty</Text>
        <Image
          style={styles.image}
          source={require("../../assets/onboarding/baller.png")}
          contentFit="contain"
        />
        <Text style={styles.welcome}>Welcome to Sporty</Text>
        <Text style={styles.welcomeSubTitle}>
          Join a vibrant community of football enthusiasts who share your two
          cents rant in game and meet other passionate fans.
        </Text>
        <View style={styles.oauthButtonsContainer}>
          <OAuthButtons
            onPressEmail={onPressEmail}
            onPressGoogle={onPressGoogleAsync}
            onPressApple={() => {}}
            isButtonLoading={isGoogleLoading ? "Google" : undefined}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.loginContainer} onPress={onPressLogin}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Text style={[styles.loginText, { color: colours.primary }]}>
          {" "}
          Log in
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    container: {
      flex: 1,
      alignItems: "center",
      paddingBottom: scale(15)
    },
    headerText: {
      marginTop: scale(4),
      color: colours.primary,
      fontFamily: fontFamily.fonts.montserratAlternatesBold,
      fontSize: scale(36)
    },
    image: {
      marginTop: scale(20),
      height: scale(244),
      width: scale(199)
    },
    welcome: {
      marginTop: scale(14),
      fontFamily: fontFamily.fonts.interExtrabold,
      fontWeight: "800",
      fontSize: scale(20),
      color: colours.onSurface
    },
    welcomeSubTitle: {
      paddingHorizontal: scale(24),
      textAlign: "center",
      marginTop: scale(6),
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interRegular,
      fontSize: scale(16)
    },
    oauthButtonsContainer: {
      marginTop: 1,
      width: "100%"
    },
    loginContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: scale(20)
    },
    loginText: {
      textAlign: "center",
      fontFamily: fontFamily.fonts.interMedium,
      fontSize: scale(14),
      color: colours.onSurface
    }
  });

export default OnboardingOptions;
