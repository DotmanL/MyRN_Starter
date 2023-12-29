import { RequestResponse, postHttpClient } from "api/httpClient";
import { ICreateUser } from "interfaces/onboarding/ICreateUser";
import { IJwtAuthenticationResponse } from "interfaces/onboarding/IJwtAuthenticationResponse";
import {
  ILoginUser,
  ILoginUserWithIdp
} from "interfaces/onboarding/ILoginUser";

async function signUpAsync(
  createUser: ICreateUser
): Promise<RequestResponse<IJwtAuthenticationResponse>> {
  return await postHttpClient(`api/auth/signup`, createUser);
}

async function signUpWithIdpAsync(
  createUser: ICreateUser
): Promise<RequestResponse<IJwtAuthenticationResponse>> {
  return await postHttpClient(`api/auth/signupWithIdp`, createUser);
}

async function loginAsync(
  loginUser: ILoginUser
): Promise<RequestResponse<IJwtAuthenticationResponse>> {
  return await postHttpClient(`api/auth/login`, loginUser);
}

async function loginWithIdpAsync(
  loginUser: ILoginUserWithIdp
): Promise<RequestResponse<IJwtAuthenticationResponse>> {
  return await postHttpClient(`api/auth/loginWithIdp`, loginUser);
}

async function resetPasswordAsync(
  email: string,
  password: string
): Promise<RequestResponse<IJwtAuthenticationResponse>> {
  return await postHttpClient(`api/auth/resetPassword`, { email, password });
}
export const AuthenticationService = {
  signUpAsync,
  signUpWithIdpAsync,
  loginAsync,
  loginWithIdpAsync,
  resetPasswordAsync
};
