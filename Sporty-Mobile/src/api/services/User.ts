import {
  RequestResponse,
  deleteHttpClient,
  getHttpClient
} from "api/httpClient";
import { IUser } from "interfaces/user/IUser";
import { Status } from "./Token";

async function getUserAsync(): Promise<RequestResponse<IUser>> {
  return await getHttpClient(`api/user/getUser`);
}

async function deleteAccountAsync(): Promise<RequestResponse<Status>> {
  return await deleteHttpClient(`api/user/deleteAccount`);
}

export const UserService = {
  getUserAsync,
  deleteAccountAsync
};

export default UserService;
