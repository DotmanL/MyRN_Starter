import { RequestResponse, getHttpClient } from "api/httpClient";
import { ILeague } from "interfaces/league/ILeague";

async function listAsync(): Promise<RequestResponse<ILeague[]>> {
  return await getHttpClient(`api/league/listLeagues`);
}

export const LeagueService = {
  listAsync
};

export default LeagueService;
