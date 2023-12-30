import { RequestResponse, postHttpClient, putHttpClient } from "api/httpClient";
import { IUser, OnboardingStatus } from "interfaces/user/IUser";

async function createLeagueInterestAsync(
  leagueIds: string[]
): Promise<RequestResponse<IUser>> {
  return await postHttpClient(`api/onboarding/createLeagueInterests`, {
    leagueIds
  });
}

async function createClubInterestAsync(
  clubIds: string[]
): Promise<RequestResponse<IUser>> {
  return await postHttpClient(`api/onboarding/createClubInterests`, {
    clubIds
  });
}

async function updateUserOnboardingStatusAsync(
  onboardingStatus: OnboardingStatus
): Promise<RequestResponse<IUser>> {
  return await putHttpClient(`api/onboarding/updateOnboardingStatus`, {
    onboardingStatus
  });
}

export const OnboardingService = {
  createLeagueInterestAsync,
  createClubInterestAsync,
  updateUserOnboardingStatusAsync
};

export default OnboardingService;
