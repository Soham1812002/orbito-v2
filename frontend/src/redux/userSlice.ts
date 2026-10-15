import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "../utils/permissions";

interface UserState {
  currentUser: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialToken =
  sessionStorage.getItem("orbito_token") || localStorage.getItem("orbito_token");

let initialUser: AuthUser | null = null;
try {
  const storedUser =
    sessionStorage.getItem("orbito_user") || localStorage.getItem("orbito_user");
  if (storedUser) {
    initialUser = JSON.parse(storedUser);
  }
} catch {
  initialUser = null;
}

const initialState: UserState = {
  currentUser: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken && !!initialUser,
  isLoading: false
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string; rememberMe?: boolean }>
    ) => {
      const { user, token, rememberMe } = action.payload;
      state.currentUser = user;
      state.token = token;
      state.isAuthenticated = true;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("orbito_token", token);
      storage.setItem("orbito_user", JSON.stringify(user));
    },
    updateUserProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        const storage = localStorage.getItem("orbito_token") ? localStorage : sessionStorage;
        storage.setItem("orbito_user", JSON.stringify(state.currentUser));
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("orbito_token");
      sessionStorage.removeItem("orbito_user");
      localStorage.removeItem("orbito_token");
      localStorage.removeItem("orbito_user");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setCredentials, updateUserProfile, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
