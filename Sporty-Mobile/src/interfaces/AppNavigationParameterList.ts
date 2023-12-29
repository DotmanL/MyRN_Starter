import { OauthType } from "./onboarding/IJwtAuthenticationResponse";

export type AppNavigationParameterList = {
  OnboardingOptions: undefined;
  CreateAccount: { idToken?: string; oauthType?: OauthType; email?: string };
  Login: undefined;
  FavouriteLeague: undefined;
  FavouriteTeam: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  NewPassword: { email: string };
  HomeContainer: undefined;
  Feed: undefined;
  Search: undefined;
  Notifications: undefined;
  Profile: undefined;
};
