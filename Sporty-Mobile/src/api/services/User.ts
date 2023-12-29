import {
  RequestResponse,
  deleteHttpClient,
  getHttpClient
} from "api/httpClient";
import { IUser } from "interfaces/user/IUser";
import { Status } from "./Token";

async function getUserAsync(userId: string): Promise<RequestResponse<IUser>> {
  return await getHttpClient(`api/user/getUser/${userId}`);
}

async function deleteAccountAsync(
  userId: string
): Promise<RequestResponse<Status>> {
  return await deleteHttpClient(`api/user/deleteAccount/${userId}`);
}

export const UserService = {
  getUserAsync,
  deleteAccountAsync
};

export default UserService;
