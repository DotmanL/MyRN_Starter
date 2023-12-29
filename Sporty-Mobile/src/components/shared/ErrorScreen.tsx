import { Button } from "@react-native-material/core";
import fontFamily from "constants/fontFamily";
import { useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { StyleSheet, Text, View } from "react-native";
import { scale } from "utility/scaling";

//TODO: redesign this properly

type Props = {
  retry: () => void;
  showErrorMessage?: boolean;
  message?: string;
};

function ErrorScreen(props: Props) {
  const { retry, showErrorMessage, message } = props;
  const styles = useThemedStyle(themedStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{`Its not you, its us, ${
        showErrorMessage ? message : ""
      }`}</Text>
      <Button title="Retry" onPress={retry} />
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
      justifyContent: "center",
      alignItems: "center"
    },
    headerText: {
      marginTop: scale(10),
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: scale(24)
    }
  });

export default ErrorScreen;
