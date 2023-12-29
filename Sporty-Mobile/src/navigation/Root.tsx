import color from "constants/color";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useThemedStyle } from "providers/ThemeProvider";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  View,
  useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navigation from "./Navigation";
import { handleRefreshTokenAsync } from "api/httpClient";
import { useAppDispatch } from "store/hooks";
import * as SecureStore from "expo-secure-store";
import UserService from "api/services/User";
import { logout, setUser } from "store/slices/userSlice";

function Root() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { width, height } = useWindowDimensions();
  const styles = useThemedStyle(themedStyles);
  const [scaleValue] = useState(new Animated.Value(1));
  const dispatch = useAppDispatch();

  let imageSize = 300;

  if (width < 380) {
    imageSize = 150;
  }

  if (height < 400) {
    imageSize = 80;
  }

  const imageStyle = {
    width: imageSize,
    height: imageSize,
    transform: [{ scale: scaleValue }]
  };

  useEffect(() => {
    async function prepare() {
      try {
        // const start = Date.now();
        await Font.loadAsync({
          "inter-regular": require("../../assets/fonts/Inter-Regular.ttf"),
          "inter-medium": require("../../assets/fonts/Inter-Medium.ttf"),
          "inter-bold": require("../../assets/fonts/Inter-Bold.ttf"),
          "inter-extraBold": require("../../assets/fonts/Inter-ExtraBold.ttf"),
          "montserratAlternates-bold": require("../../assets/fonts/MontserratAlternates-Bold.ttf")
        });

        const userId = await SecureStore.getItemAsync("userId");
        if (userId) {
          const { data, error } = await UserService.getUserAsync(userId);

          if (!data || error) {
            dispatch(logout());
            return;
          }
          dispatch(setUser(data));
        }

        //check user before handlin refresh, userId must be in storage
        await handleRefreshTokenAsync();
        // console.log(Date.now() - start, "(ms) app loading timing");
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, [scaleValue]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={styles.splashScreen} onLayout={onLayoutRootView}>
        <View style={[styles.container]}>
          <Animated.View style={[styles.imageContainer, imageStyle]}>
            <Image
              style={styles.image}
              source={require("../../assets/sportyLogo.png")}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.layout} onLayout={onLayoutRootView}>
      <SafeAreaView style={styles.safeAreaView}>
        <Navigation />
      </SafeAreaView>
    </View>
  );
}

export default Root;

const themedStyles = () =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1
    },
    splashScreen: {
      flex: 1,
      alignItems: "center",
      backgroundColor: color.splashScreen,
      justifyContent: "center"
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "60%",
      height: "50%"
    },
    layout: {
      flex: 1
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      width: "100%",
      height: "100%"
    },
    image: {
      width: "60%",
      height: "50%"
    }
  });
