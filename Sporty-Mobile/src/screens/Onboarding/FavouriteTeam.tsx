import { useQuery } from "@tanstack/react-query";
import ClubService from "api/services/Clubs";
import OnboardingService from "api/services/Onboarding";
import UserService from "api/services/User";
import ErrorScreen from "components/shared/ErrorScreen";
import Spinner from "components/skeletons/Spinner";
import fontFamily from "constants/fontFamily";
import { OnboardingStatus } from "interfaces/user/IUser";
import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useUser } from "store/hooks";
import { setUser } from "store/slices/userSlice";
import { scale, screenTopMargin } from "utility/scaling";

function FavouriteTeam() {
  const styles = useThemedStyle(themedStyles);
  const insets = useSafeAreaInsets();
  const colours = useThemedColours();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const [activeClubIds, setActiveClubIds] = useState<string[]>([]);
  const [isNextLoading, setIsNextLoading] = useState<boolean>(false);
  const [isSkipLoading, setIsSkipLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function fetchClubsAsync() {
    const response = await ClubService.listAsync();
    return response.data;
  }

  const {
    isLoading: isLoadingClubs,
    error,
    data: clubs,
    refetch
  } = useQuery({
    queryKey: ["listClubs"],
    queryFn: async () => await fetchClubsAsync()
  });

  if (isLoadingClubs) {
    return <Spinner />;
  }

  if (error) {
    return (
      <ErrorScreen
        message={(error as Error)?.message}
        retry={refetch}
        showErrorMessage={false}
      />
    );
  }

  function onPressClub(clubId: string) {
    const isActive = activeClubIds.includes(clubId);
    setErrorMessage("");
    if (isActive) {
      setActiveClubIds(activeClubIds.filter((active) => active !== clubId));
    } else {
      setActiveClubIds([...activeClubIds, clubId]);
    }
  }

  function isClubActive(clubId: string) {
    return activeClubIds.includes(clubId);
  }
  const isDisabled = !(activeClubIds.length > 0);

  async function updateUserStateAsync(userId: string) {
    const userResponse = await UserService.getUserAsync(userId);
    if (!userResponse.data || userResponse.error) {
      console.error(userResponse.error);
      return;
    }

    dispatch(setUser(userResponse.data));
  }

  async function onPressSkipAsync() {
    setIsSkipLoading(true);

    const { data, error } =
      await OnboardingService.updateUserOnboardingStatusAsync(
        user?.id!,
        OnboardingStatus.RegisteredClubs
      );

    if (!data || error) {
      console.error(error);
      setIsSkipLoading(false);

      return false;
    }

    await updateUserStateAsync(user?.id!);
    setIsSkipLoading(false);
    return true;
  }

  async function onPressNextAsync() {
    if (isDisabled) {
      setErrorMessage("Please select at least 1 club to continue, else Skip");
      return;
    }
    setIsNextLoading(true);

    const clubIds: string[] = activeClubIds;
    const { data, error } = await OnboardingService.createClubInterestAsync(
      user?.id!,
      clubIds
    );

    if (!data || error) {
      console.error(error);
      setIsNextLoading(false);

      return false;
    }

    await updateUserStateAsync(user?.id!);
    setIsNextLoading(false);
    return true;
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={[styles.flex, { marginTop: insets.top + scale(screenTopMargin) }]}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Choose your Favourite Clubs</Text>
        <Text style={styles.subHeaderText}>Get better recommendation</Text>
        <View style={styles.clubContainer}>
          {clubs &&
            clubs.map((club, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isClubActive(club.id)
                      ? colours.primary
                      : colours.borderColor
                  }
                ]}
                onPress={() => onPressClub(club.id)}
              >
                <Text style={styles.clubName}>{club.name}</Text>
              </TouchableOpacity>
            ))}
          <View style={styles.errorContainer}>
            {!!errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colours.surface
              }
            ]}
            onPress={onPressSkipAsync}
          >
            {isSkipLoading ? (
              <ActivityIndicator size="small" color={colours.onSurface} />
            ) : (
              <Text style={[styles.buttonText]}>Skip</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isDisabled
                  ? colours.borderColor
                  : colours.primary
              }
            ]}
            onPress={onPressNextAsync}
          >
            {isNextLoading ? (
              <ActivityIndicator size="small" color={"white"} />
            ) : (
              <Text style={[styles.buttonText, { color: "white" }]}>Next</Text>
            )}
          </TouchableOpacity>
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
    subHeaderText: {
      marginTop: scale(15),
      color: colours.onSurface,
      fontFamily: fontFamily.fonts.interRegular,
      fontSize: scale(14)
    },
    clubContainer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      paddingVertical: scale(10)
    },
    pill: {
      flexDirection: "row",
      borderRadius: scale(6),
      borderWidth: scale(1),
      borderColor: colours.borderColor,
      justifyContent: "center",
      alignItems: "center",
      padding: scale(8),
      marginHorizontal: scale(4),
      marginVertical: scale(12)
    },
    image: {
      width: 36,
      height: 36
    },
    clubName: {
      fontFamily: fontFamily.fonts.interMedium,
      fontSize: scale(14),
      textAlign: "center",
      color: colours.onSurface
    },
    errorContainer: {
      flexDirection: "row",
      alignSelf: "center",
      marginTop: scale(8),
      paddingHorizontal: scale(20)
    },
    errorText: {
      color: colours.red,
      fontFamily: fontFamily.fonts.interBold,
      fontSize: 14,
      textAlign: "center",
      fontWeight: "500"
    },
    bottomContainer: {
      flex: 1,
      height: 100,
      flexDirection: "row",
      width: "100%",
      paddingHorizontal: scale(24),
      justifyContent: "space-between",
      alignItems: "center"
    },
    button: {
      width: "40%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      height: scale(56),
      padding: scale(12),
      borderRadius: scale(6),
      borderWidth: scale(0.5),
      borderColor: colours.borderColor
    },
    buttonText: {
      fontFamily: fontFamily.fonts.interRegular,
      fontSize: scale(14),
      color: colours.onSurface
    }
  });

export default FavouriteTeam;
