import PressableButton from "components/PressableButton";
import fontFamily from "constants/fontFamily";
import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useUser } from "store/hooks";
import { logout } from "store/slices/userSlice";
import { scale } from "utility/scaling";

function Feed() {
  const styles = useThemedStyle(themedStyles);
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const colours = useThemedColours();

  //TODO: nest a createMaterialTopTabNavigator navigatior here

  function handleLogout() {
    dispatch(logout());
  }

  return (
    <ScrollView style={[styles.flex]} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text
          style={{ color: colours.onSurface, fontSize: 20 }}
        >{`Welcome ${user?.userName}`}</Text>
        <View style={{ marginTop: 50 }}>
          <PressableButton title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </ScrollView>
  );
}

const themedStyles = (colours: ThemeColours) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      height: "100%"
    },
    container: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: scale(16)
    },
    headerText: {
      marginTop: scale(10),
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: scale(24)
    }
  });

export default Feed;
