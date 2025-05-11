import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string;
}

const initialState: AuthState = {
  accessToken: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
  },
  selectors: {
    accessToken: (state) => state.accessToken,
    isAuthenticated: (state) => !!state.accessToken,
  },
});

export const authSliceActions = authSlice.actions;
export const authSliceSelectors = authSlice.selectors;
