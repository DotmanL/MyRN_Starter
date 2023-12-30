import { EXPO_PUBLIC_API_URL } from "@env";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCalendars } from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { authenticate, logout } from "store/slices/userSlice";
import { store } from "store/store";
import {
  calculateExpirationTime,
  convertUTCTime,
  getExpirationDateTime
} from "utility/helperFunctions";
import { refreshUserTokenAsync } from "./services/Firebase";

export async function handleRefreshTokenAsync() {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  const userId = await SecureStore.getItemAsync("userId");

  if (accessToken && refreshToken && userId) {
    const tokenExpirationTime = await getExpirationDateTime();
    const currentTime = Date.now();

    if (tokenExpirationTime < currentTime) {
      console.log("lets refresh the token");

      const refreshTokenRequest = {
        grant_type: "refresh_token",
        refresh_token: refreshToken
      };

      const response = await refreshUserTokenAsync(refreshTokenRequest);

      if (response && response.status === 200) {
        const { timeZone: userTimezone } = getCalendars()[0];

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;
        const newExpirationDate = response.data.expires_in;

        const expirationDateTime = calculateExpirationTime(
          parseInt(newExpirationDate)
        );

        const localizedExpirationDateTimeString = convertUTCTime(
          expirationDateTime,
          userTimezone!
        );

        store.dispatch(
          authenticate({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            userId: userId,
            localizedExpirationDateTimeString: localizedExpirationDateTimeString
          })
        );
      } else {
        store.dispatch(logout());
      }
    } else {
      store.dispatch(
        authenticate({
          accessToken: accessToken,
          refreshToken: refreshToken
        })
      );
      console.log("token still valid");
    }
  } else {
    store.dispatch(logout());
  }
}

export type RequestResponse<T = any> =
  | {
      data: T;
      error: AxiosResponse | undefined;
    }
  | {
      error: AxiosResponse;
      data: undefined;
    };

const httpClientFactory = async (): Promise<AxiosInstance> => {
  const instance = axios.create({
    baseURL: EXPO_PUBLIC_API_URL
  });

  instance.interceptors.request.use(
    async (config) => {
      await handleRefreshTokenAsync();
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

const emptyHttpClient = axios.create({});
const parseJson = async (response: AxiosResponse): Promise<any> => {
  const data = response.data;
  return data;
};

const verbHttpClient = async <T = any>(
  verb: "post" | "put" | "get" | "delete",
  url: string,
  body: any = undefined,
  options: AxiosRequestConfig = {},
  fullyTyped: boolean = false,
  client?: AxiosInstance
): Promise<RequestResponse<T>> => {
  if (fullyTyped) {
    options = {
      ...options,
      headers: {
        ...options?.headers,
        JsonSettings: "FullyTyped"
      }
    };
  }

  const httpClient = client || (await httpClientFactory());
  options.data = JSON.stringify(body);

  if (!client) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json"
    };
  }

  try {
    let response: AxiosResponse = null!;
    switch (verb) {
      case "post":
        response = await httpClient.post(url, body, options);
        break;
      case "get":
        response = await httpClient.get(url, options);
        break;
      case "delete":
        response = await httpClient.delete(url, options);
        break;
      case "put":
        response = await httpClient.put(url, body, options);
        break;
    }
    const data = await parseJson(response);
    return { data, error: undefined };
  } catch (error: any) {
    if (error.response && error.response.status < 400) {
      console.error(error);
      return { error: error.response, data: undefined };
    }
    return handleErrors(error);
  }
};

const handleErrors = async (err: any): Promise<RequestResponse> => {
  const response: AxiosResponse = err.response;
  return { error: response, data: undefined };
};

export const postHttpClient = async <T = any>(
  url: string,
  body: any = undefined,
  options: AxiosRequestConfig = {},
  fullyTyped: boolean = false
): Promise<RequestResponse<T>> => {
  return verbHttpClient<T>("post", url, body, options, fullyTyped);
};

export const getHttpClient = async <T = any>(
  url: string,
  options: AxiosRequestConfig = {},
  fullyTyped: boolean = false,
  noPrefixUrl: boolean = false
): Promise<RequestResponse<T>> => {
  return verbHttpClient<T>(
    "get",
    url,
    undefined,
    options,
    fullyTyped,
    noPrefixUrl ? emptyHttpClient : undefined
  );
};

export const putHttpClient = async <T = any>(
  url: string,
  body: any = undefined,
  options: AxiosRequestConfig = {},
  fullyTyped: boolean = false
): Promise<RequestResponse<T>> => {
  return verbHttpClient<T>("put", url, body, options, fullyTyped);
};

export const deleteHttpClient = async <T = any>(
  url: string,
  body: any = undefined,
  options: AxiosRequestConfig = {},
  fullyTyped: boolean = false
): Promise<RequestResponse<T>> => {
  return verbHttpClient<T>("delete", url, body, options, fullyTyped);
};
