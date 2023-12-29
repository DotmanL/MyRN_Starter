import { IBase } from "interfaces/IBase";

export enum OnboardingStatus {
  None,
  RegisteredLeagues,
  RegisteredClubs
}

export interface IUser extends IBase {
  userName: string;
  email: string;
  onboardingStatus: OnboardingStatus;
}
