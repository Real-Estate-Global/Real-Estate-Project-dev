import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: true,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  selectors: {
    isLoading: (state) => state.isLoading,
  },
});

export const loadingSliceActions = loadingSlice.actions;
export const loadingSliceSelectors = loadingSlice.selectors;
