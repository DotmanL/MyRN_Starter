import { IUser } from "interfaces/user/IUser";

export interface IJwtAuthenticationResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expirationDate: string;
  user: IUser;
}

export enum OauthType {
  None,
  Google,
  Apple
}
