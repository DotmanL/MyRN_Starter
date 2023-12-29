import UserService from "api/services/User";
import PressableButton from "components/PressableButton";
import fontFamily from "constants/fontFamily";
import { useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useUser } from "store/hooks";
import { logout } from "store/slices/userSlice";
import { scale } from "utility/scaling";

function Profile() {
  const styles = useThemedStyle(themedStyles);
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleDeleteAccountAsync() {
    setIsLoading(true);
    const { data, error } = await UserService.deleteAccountAsync(user?.id!);

    if (error || !data) {
      setErrorMessage(
        "Something went wrong while attempting to delete account, try again"
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    dispatch(logout());
  }

  return (
    <ScrollView style={[styles.flex]} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Profile</Text>
        <View
          style={{
            flex: 1,
            position: "absolute",
            right: 0,
            left: 0,
            bottom: 50
          }}
        >
          <View style={styles.errorContainer}>
            {!!errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </View>
          <PressableButton
            title="Delete Account"
            isLoading={isLoading}
            buttonBackgroundColor={"red"}
            onPress={handleDeleteAccountAsync}
          />
        </View>
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
    },
    errorContainer: {
      paddingHorizontal: scale(16),
      flexDirection: "row",
      alignSelf: "center",
      marginVertical: scale(8)
    },
    errorText: {
      color: colours.red,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: 14,
      textAlign: "center",
      fontWeight: "500"
    }
  });

export default Profile;
