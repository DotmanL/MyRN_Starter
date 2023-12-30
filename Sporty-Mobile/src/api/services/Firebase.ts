import { EXPO_PUBLIC_FIREBASE_APIKEY } from "@env";
import axios from "axios";

interface IRefreshTokenRequest {
  grant_type: string;
  refresh_token: string;
}

async function refreshUserTokenAsync(
  refreshTokenRequest: IRefreshTokenRequest
) {
  try {
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${EXPO_PUBLIC_FIREBASE_APIKEY}`,
      refreshTokenRequest
    );
    return response;
  } catch (error) {
    console.error(error);
    return;
  }
}

export { refreshUserTokenAsync };
