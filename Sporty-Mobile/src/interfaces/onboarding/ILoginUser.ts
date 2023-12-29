export interface ILoginUser {
  email: string;
  password: string;
}

export interface ILoginUserWithIdp {
  email: string;
  idToken: string;
  providerId: string;
}
