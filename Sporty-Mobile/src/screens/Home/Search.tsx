import fontFamily from "constants/fontFamily";
import { useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { scale } from "utility/scaling";

function Search() {
  const styles = useThemedStyle(themedStyles);

  return (
    <ScrollView style={[styles.flex]} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Search</Text>
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
      flex: 1,
      alignItems: "flex-start",
      paddingHorizontal: scale(16)
    },
    headerText: {
      marginTop: scale(10),
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: scale(24)
    }
  });

export default Search;
