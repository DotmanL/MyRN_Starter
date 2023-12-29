export interface ICreateUser {
  userName: string;
  email: string;
  password?: string;
  onboardingStatus?: OnboardingStatus;
  idToken?: string;
  providerId?: string;
}

export enum OnboardingStatus {
  None,
  RegisteredLeagues,
  RegisteredClubs
}
