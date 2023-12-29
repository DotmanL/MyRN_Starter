import fontFamily from "constants/fontFamily";
import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { scale } from "utility/scaling";

//TODO: change this to a skeleton
function Spinner() {
  const styles = useThemedStyle(themedStyles);
  const colours = useThemedColours();

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colours.onSurface} size="large" />
    </View>
  );
}

const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    container: {
      flex: 1,
      justifyContent: "center"
    },
    headerText: {
      marginTop: scale(10),
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: scale(24)
    }
  });

export default Spinner;
