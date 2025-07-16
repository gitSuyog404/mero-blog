import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  username: string;
  email: string;
  role: "admin" | "user";
}

interface AuthState {
  userInfo: User | null;
  accessToken: string | null;
}

// Helper functions for localStorage and cookies
const getStoredUserInfo = (): User | null => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    return null;
  }
};

const getStoredAccessToken = (): string | null => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  userInfo: getStoredUserInfo(),
  accessToken: getStoredAccessToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      state.userInfo = user;
      state.accessToken = accessToken;

      // Store in localStorage
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    logout: (state) => {
      state.userInfo = null;
      state.accessToken = null;

      // Clear localStorage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
