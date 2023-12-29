import { RequestResponse, getHttpClient } from "api/httpClient";
import { IClub } from "interfaces/club/IClub";

async function listAsync(): Promise<RequestResponse<IClub[]>> {
  return await getHttpClient(`api/club/listClubs`);
}

export const ClubService = {
  listAsync
};

export default ClubService;
