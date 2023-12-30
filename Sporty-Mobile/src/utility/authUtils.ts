import { EXPO_PUBLIC_ANDROID_CLIENTID, EXPO_PUBLIC_IOS_CLIENTID } from "@env";
import { AuthenticationService } from "api/services/Authentication";
import axios from "axios";
import {
  AuthSessionRedirectUriOptions,
  AuthSessionResult,
  TokenResponseConfig,
  makeRedirectUri
} from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { getCalendars } from "expo-localization";
import { ILoginUserWithIdp } from "interfaces/onboarding/ILoginUser";
import { useEffect, useState } from "react";
import { convertUTCTime } from "./helperFunctions";
import { useAppDispatch } from "store/hooks";
import { authenticate, setUser } from "store/slices/userSlice";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppNavigationParameterList } from "interfaces/AppNavigationParameterList";
import { OauthType } from "interfaces/onboarding/IJwtAuthenticationResponse";

const EXPO_REDIRECT_PARAMS = {
  useProxy: true,
  projectNameForProxy: `@dotmanl/com.dotmanl.sporty`
};
const NATIVE_REDIRECT_PARAMS = { native: "com.dotmanl.sporty://" };
const REDIRECT_PARAMS =
  Constants.appOwnership === "expo"
    ? EXPO_REDIRECT_PARAMS
    : NATIVE_REDIRECT_PARAMS;
const redirectUri = makeRedirectUri(
  REDIRECT_PARAMS as AuthSessionRedirectUriOptions
);

export const PROVIDER_ID = "google.com";

export const useGoogleSignIn = () => {
  const [_, response, promptAsync] = Google.useAuthRequest({
    // clientId:'',
    androidClientId: EXPO_PUBLIC_ANDROID_CLIENTID,
    iosClientId: EXPO_PUBLIC_IOS_CLIENTID,
    scopes: ["profile", "email"],
    redirectUri
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NavigationProp<AppNavigationParameterList>>();

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  async function getUserInfoAsync(accessToken: string) {
    if (!accessToken) return;
    try {
      const response = await axios.get(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const user = await response.data;
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSignInWithGoogle() {
    try {
      setIsGoogleLoading(true);
      const signWithGoogleResponse = response as AuthSessionResult;
      if (
        signWithGoogleResponse &&
        signWithGoogleResponse?.type === "success"
      ) {
        const authentication =
          signWithGoogleResponse.authentication as TokenResponseConfig;

        const { accessToken: googleAccessToken, idToken } = authentication;
        if (idToken && googleAccessToken) {
          const googleUser = await getUserInfoAsync(googleAccessToken);
          const loginUserWithIdp: ILoginUserWithIdp = {
            email: googleUser.email,
            idToken: idToken,
            providerId: PROVIDER_ID
          };
          const { data, error } = await AuthenticationService.loginWithIdpAsync(
            loginUserWithIdp
          );

          if (!data || error) {
            navigation.navigate("CreateAccount", {
              idToken: idToken,
              oauthType: OauthType.Google,
              email: googleUser.email
            });
            setIsGoogleLoading(false);
            return;
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
              localizedExpirationDateTimeString:
                localizedExpirationDateTimeString
            })
          );
          dispatch(setUser(user));
          setIsGoogleLoading(false);
          return;
        }

        return;
      }
      setIsGoogleLoading(false);
    } catch (error) {
      setIsGoogleLoading(false);
      console.error(error);
    }
  }

  return { promptAsync, isGoogleLoading };
};
