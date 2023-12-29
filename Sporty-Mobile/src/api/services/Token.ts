import { RequestResponse, postHttpClient } from "api/httpClient";

export interface Status {
  status: string;
}

async function createTokenAsync(
  email: string
): Promise<RequestResponse<Status>> {
  return await postHttpClient(`api/token/createToken`, { email });
}

async function verifyTokenAsync(
  email: string,
  token: string
): Promise<RequestResponse<Status>> {
  return await postHttpClient(`api/token/verifyToken`, { email, token });
}

export const TokenService = {
  createTokenAsync,
  verifyTokenAsync
};
