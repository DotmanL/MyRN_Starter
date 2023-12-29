import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigationParameterList } from "interfaces/AppNavigationParameterList";
import { OnboardingStatus } from "interfaces/user/IUser";
import { ThemeContext, useThemedColours } from "providers/ThemeProvider";
import { ThemeType } from "providers/ThemeTypes";
import React, { useContext, useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import CreateAccount from "screens/Onboarding/CreateAccount";
import FavouriteLeague from "screens/Onboarding/FavouriteLeague";
import FavouriteTeam from "screens/Onboarding/FavouriteTeam";
import OnboardingOptions from "screens/Onboarding/OnboardingOptions";
import { useUser } from "store/hooks";
import HomeNavigation from "./HomeNavigation";
import Login from "screens/Onboarding/Login";
import ForgotPassword from "screens/Onboarding/ForgotPassword";
import OTPVerification from "screens/Onboarding/OTPVerification";
import NewPassword from "screens/Onboarding/NewPassword";

const Stack = createNativeStackNavigator<AppNavigationParameterList>();

function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="HomeContainer"
          component={HomeNavigation}
          options={{
            headerShown: false
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function OnboardingStack() {
  function getInitialRouteName() {
    const { user } = useUser();
    let routeName: keyof AppNavigationParameterList | undefined;
    switch (user?.onboardingStatus) {
      case OnboardingStatus.None:
        routeName = "FavouriteLeague";
        break;
      case OnboardingStatus.RegisteredLeagues:
        routeName = "FavouriteTeam";
        break;
    }
    return routeName;
  }

  return (
    <Stack.Navigator initialRouteName={getInitialRouteName()}>
      <Stack.Group>
        <Stack.Screen
          name="FavouriteLeague"
          component={FavouriteLeague}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="FavouriteTeam"
          component={FavouriteTeam}
          options={{
            headerShown: false
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function UnauthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingOptions" component={OnboardingOptions} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function Navigation() {
  const { user, isAuthenticated: isUserAuthenticated } = useUser();
  const isAuthenticated = isUserAuthenticated;
  // const isAuthenticated = false;

  const colors = useThemedColours();
  const { type } = useContext(ThemeContext);

  useEffect(() => {
    StatusBar.setBarStyle(
      type === (ThemeType.Light || ThemeType.Auto) //TODO: fix this properly when I have the settings page
        ? "dark-content"
        : "light-content"
    );
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.surface);
    }
  }, []);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.surface
    }
  };

  const isOnboardingCompleted =
    user?.onboardingStatus === OnboardingStatus.RegisteredClubs ? true : false;

  return (
    <NavigationContainer theme={MyTheme}>
      {isAuthenticated && isOnboardingCompleted ? (
        <AuthenticatedStack />
      ) : isAuthenticated && !isOnboardingCompleted ? (
        <OnboardingStack />
      ) : (
        <UnauthenticatedStack />
      )}
    </NavigationContainer>
  );
}

export default Navigation;
