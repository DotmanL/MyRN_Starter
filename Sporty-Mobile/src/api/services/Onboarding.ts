import { RequestResponse, postHttpClient, putHttpClient } from "api/httpClient";
import { IUser, OnboardingStatus } from "interfaces/user/IUser";

async function createLeagueInterestAsync(
  userId: string,
  leagueIds: string[]
): Promise<RequestResponse<IUser>> {
  return await postHttpClient(
    `api/onboarding/createLeagueInterests/${userId}`,
    { leagueIds }
  );
}

async function createClubInterestAsync(
  userId: string,
  clubIds: string[]
): Promise<RequestResponse<IUser>> {
  return await postHttpClient(`api/onboarding/createClubInterests/${userId}`, {
    clubIds
  });
}

async function updateUserOnboardingStatusAsync(
  userId: string,
  onboardingStatus: OnboardingStatus
): Promise<RequestResponse<IUser>> {
  return await putHttpClient(
    `api/onboarding/updateOnboardingStatus/${userId}`,
    { onboardingStatus }
  );
}

export const OnboardingService = {
  createLeagueInterestAsync,
  createClubInterestAsync,
  updateUserOnboardingStatusAsync
};

export default OnboardingService;
