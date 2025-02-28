import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// TODO: auth error ErrorType
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
    setAuth: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  selectors: {
    accessToken: (state) => state.accessToken,
    isAuthenticated: (state) => !!state.accessToken,
  },
});

export const authSliceActions = authSlice.actions;
export const authSliceSelectors = authSlice.selectors;
