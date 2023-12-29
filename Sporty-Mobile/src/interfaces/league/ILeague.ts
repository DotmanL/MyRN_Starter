import { IBase } from "interfaces/IBase";

export interface ILeague extends IBase {
  name: string;
  country: string;
  logo?: string;
}
