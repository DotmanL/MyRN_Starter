import { useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function HorizontalDivider() {
  const styles = useThemedStyle(themedStyles);

  return (
    <View style={styles.dividerContainer}>
      <View style={styles.divider} />
      <Text style={styles.dividerText}> or </Text>
      <View style={styles.divider} />
    </View>
  );
}

const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8
    },
    divider: {
      borderBottomColor: colours.onSurface,
      borderBottomWidth: 1,
      width: "45%"
    },
    dividerText: {
      color: colours.onSurface,
      fontSize: 14
    }
  });

export default HorizontalDivider;
