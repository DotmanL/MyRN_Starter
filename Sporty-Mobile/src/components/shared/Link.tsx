import fontFamily from "constants/fontFamily";
import { useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import React, { useCallback } from "react";
import { Alert, Linking, StyleSheet, Text } from "react-native";
import { scale } from "utility/scaling";

type Props = { url: string; children: React.ReactNode };

function Link(props: Props) {
  const { url, children } = props;
  const styles = useThemedStyle(themedStyles);

  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <Text onPress={handlePress} style={styles.text}>
      {children}
    </Text>
  );
}

const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "red"
    },
    text: {
      fontFamily: fontFamily.fonts.interRegular,
      fontSize: scale(12),
      textAlign: "left",
      color: colours.primary,
      lineHeight: 20
    }
  });

export default Link;
