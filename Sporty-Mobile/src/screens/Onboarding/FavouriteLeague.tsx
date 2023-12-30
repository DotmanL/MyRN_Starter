import { ActivityIndicator } from "@react-native-material/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import LeagueService from "api/services/Leagues";
import OnboardingService from "api/services/Onboarding";
import ErrorScreen from "components/shared/ErrorScreen";
import Spinner from "components/skeletons/Spinner";
import fontFamily from "constants/fontFamily";
import { Image } from "expo-image";
import { AppNavigationParameterList } from "interfaces/AppNavigationParameterList";
import { OnboardingStatus } from "interfaces/user/IUser";
import { useThemedColours, useThemedStyle } from "providers/ThemeProvider";
import { ThemeColours } from "providers/ThemeTypes";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, screenTopMargin } from "utility/scaling";

type Props = {
  navigation: NativeStackNavigationProp<
    AppNavigationParameterList,
    "FavouriteLeague"
  >;
};

function FavouriteLeague(props: Props) {
  const { navigation } = props;
  const styles = useThemedStyle(themedStyles);
  const insets = useSafeAreaInsets();
  const colours = useThemedColours();
  const [activeLeagueIds, setActiveLeagueIds] = useState<string[]>([]);
  const [isNextLoading, setIsNextLoading] = useState<boolean>(false);
  const [isSkipLoading, setIsSkipLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const leagueLogos = [
    {
      name: "Premier League",
      logo: require("assets/logos/premierLeague.png")
    },
    {
      name: "La Liga",
      logo: require("assets/logos/laliga.png")
    },
    {
      name: "Bundesliga",
      logo: require("assets/logos/bundesliga.png")
    },
    {
      name: "Ligue 1",
      logo: require("assets/logos/ligue1.png")
    },
    {
      name: "Serie A",
      logo: require("assets/logos/seriea.png")
    }
  ];

  async function fetchLeaguesAsync() {
    const response = await LeagueService.listAsync();
    return response.data;
  }

  const {
    isLoading: isLeaguesLoading,
    error,
    data: leagues,
    refetch
  } = useQuery({
    queryKey: ["listLeagues"],
    queryFn: async () => await fetchLeaguesAsync()
  });

  if (isLeaguesLoading) {
    return <Spinner />;
  }

  if (error) {
    //TODO: ensure we get actuall error message incase, this currenly not providing messages fully
    return (
      <ErrorScreen
        message={(error as Error)?.message}
        retry={refetch}
        showErrorMessage={false}
      />
    );
  }

  function handleOnPressLeague(leagueId: string) {
    const isActive = activeLeagueIds.includes(leagueId);
    setErrorMessage("");
    if (isActive) {
      setActiveLeagueIds(
        activeLeagueIds.filter((active) => active !== leagueId)
      );
    } else {
      setActiveLeagueIds([...activeLeagueIds, leagueId]);
    }
  }

  function isLeagueActive(leagueId: string) {
    return activeLeagueIds.includes(leagueId);
  }

  function populatedLeaguesWithLogos() {
    if (leagues) {
      leagues.map((league) => {
        league.logo = leagueLogos.find(
          (leagueLogo) => leagueLogo.name === league.name
        )?.logo;
      });
      return leagues;
    }

    return leagues;
  }

  const allLeagues = populatedLeaguesWithLogos();
  const isDisabled = !(activeLeagueIds.length > 0);

  async function onPressSkipAsync() {
    setIsSkipLoading(true);

    const { data, error } =
      await OnboardingService.updateUserOnboardingStatusAsync(
        OnboardingStatus.RegisteredLeagues
      );

    if (!data || error) {
      //TODO: add custom error snackbar and logging system for errors
      console.error(error);
      setIsSkipLoading(false);

      return false;
    }
    //TODO: add toast here or something nice
    setIsSkipLoading(false);
    navigation.navigate("FavouriteTeam");
    return true;
  }

  async function onPressNextAsync() {
    if (isDisabled) {
      setErrorMessage("Please select at least 1 league to continue, else Skip");
      return;
    }
    setIsNextLoading(true);
    const leagueIds: string[] = activeLeagueIds;
    const { data, error } = await OnboardingService.createLeagueInterestAsync(
      leagueIds
    );

    if (!data || error) {
      console.error(error);
      setIsNextLoading(false);

      return false;
    }
    setIsNextLoading(false);
    navigation.navigate("FavouriteTeam");
    return true;
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={[styles.flex, { marginTop: insets.top + scale(screenTopMargin) }]}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Choose your Favourite Leagues</Text>
        <Text style={styles.subHeaderText}>Get better recommendation</Text>
        <View style={styles.leagueContainer}>
          {allLeagues &&
            allLeagues.map((league, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isLeagueActive(league.id)
                      ? colours.primary
                      : colours.borderColor
                  }
                ]}
                onPress={() => handleOnPressLeague(league.id)}
              >
                <Image
                  style={styles.image}
                  source={league.logo}
                  contentFit="contain"
                />
                <Text style={styles.leagueName}>{league.name}</Text>
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
      paddingHorizontal: scale(12)
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
    leagueContainer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      justifyContent: "space-between",
      paddingVertical: scale(20)
    },
    pill: {
      flexDirection: "column",
      borderRadius: scale(6),
      borderWidth: scale(1),
      borderColor: colours.borderColor,
      justifyContent: "center",
      alignItems: "center",
      gap: scale(10),
      padding: scale(8),
      height: scale(100),
      width: "42%",
      marginHorizontal: scale(10),
      marginVertical: scale(12)
    },
    image: {
      width: 36,
      height: 36
    },
    leagueName: {
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
      position: "absolute",
      bottom: scale(20),
      paddingHorizontal: scale(32),
      justifyContent: "space-between",
      alignItems: "center",
      right: 0,
      left: 0
    },
    button: {
      width: "40%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      padding: scale(12),
      height: scale(56),
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

export default FavouriteLeague;
