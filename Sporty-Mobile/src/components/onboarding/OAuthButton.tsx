import React from "react";
import {
  DimensionValue,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { ThemeColours, ThemeType } from "providers/ThemeTypes";
import {
  useThemeState,
  useThemedColours,
  useThemedStyle
} from "providers/ThemeProvider";
import { scale } from "utility/scaling";
import { SvgProps } from "react-native-svg";
import color from "constants/color";
import { ButtonLoadingType } from "./OAuthButtons";
import { ActivityIndicator } from "@react-native-material/core";
import fontFamily from "constants/fontFamily";

type Props = {
  title: string;
  source?: ImageSourcePropType;
  onPress?: () => void;
  SvgIcon?: React.FC<SvgProps>;
  buttonWidth?: DimensionValue;
  isButtonLoading?: ButtonLoadingType;
};

function OAuthButton(props: Props) {
  const { onPress, title, source, SvgIcon, buttonWidth, isButtonLoading } =
    props;
  const styles = useThemedStyle(themedStyles);
  const themeState = useThemeState();
  const colours = useThemedColours();

  return (
    <Pressable
      android_ripple={{ color: "#cccc" }}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
          width: !!buttonWidth ? buttonWidth : "80%"
        },
        styles.button,

        themeState.type === ThemeType.Dark && {
          backgroundColor: color.alternateDarkModeGray,
          borderWidth: 0.5
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.buttonContainer}>
        {isButtonLoading ? (
          <ActivityIndicator size="large" color={colours.onSurface} />
        ) : (
          <>
            <View>
              {source && <Image source={source} resizeMode="cover" />}
            </View>
            <View>
              {SvgIcon && (
                <SvgIcon
                  color={styles.svgIcon.color}
                  width={scale(24)}
                  height={scale(24)}
                />
              )}
            </View>
            <View>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      themeState.type === ThemeType.Light ? "black" : "white"
                  }
                ]}
              >
                {title}
              </Text>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
}

const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    buttonContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    },
    svgIcon: {
      color: colours.onSurface
    },
    button: {
      marginTop: scale(12),
      height: scale(48),
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: scale(12),
      paddingHorizontal: scale(12),
      borderRadius: scale(4),
      // elevation: 1,
      borderWidth: 1,
      borderColor: colours.borderColor
    },
    buttonText: {
      fontSize: scale(16),
      lineHeight: 21,
      fontFamily: fontFamily.fonts.interMedium,
      letterSpacing: 0.25,
      marginLeft: scale(10)
    }
  });

export default OAuthButton;
