import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { IUser } from "interfaces/user/IUser";

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  currentLocation: string | null;
  user: IUser | null;
}

const initialState: UserState = {
  token: null,
  isAuthenticated: false,
  currentLocation: null,
  user: null
};

interface IAuthenticatePayload {
  accessToken: string;
  refreshToken: string;
  userId?: string;
  localizedExpirationDateTimeString?: string;
}

async function storeTokens(
  accessToken: string,
  refreshToken: string,
  userId?: string,
  localizedExpirationDateTimeString?: string
) {
  await SecureStore.setItemAsync("accessToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
  if (userId) {
    await SecureStore.setItemAsync("userId", userId); //TODO: tremove userId by handling user retreival via session storage
  }
  if (localizedExpirationDateTimeString) {
    await SecureStore.setItemAsync(
      "expirationDate",
      localizedExpirationDateTimeString
    );
  }
}

async function removeTokens() {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  await SecureStore.deleteItemAsync("expirationDate");
  await SecureStore.deleteItemAsync("userId");
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authenticate: (state, action: PayloadAction<IAuthenticatePayload>) => {
      const {
        accessToken,
        localizedExpirationDateTimeString,
        refreshToken,
        userId
      } = action.payload;
      state.token = accessToken;
      state.isAuthenticated = true;
      storeTokens(
        accessToken,
        refreshToken,
        userId,
        localizedExpirationDateTimeString
      );
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      removeTokens();
    }
  }
});

export const { authenticate, logout, setUser } = userSlice.actions;

export default userSlice.reducer;
