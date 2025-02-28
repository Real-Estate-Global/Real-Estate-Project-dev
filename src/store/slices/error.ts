import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorType } from "../../types/ErrorType";

const initialState: ErrorType = {
    hasError: false,
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<ErrorType>) => {
      state.hasError = action.payload.hasError;
      state.message = action.payload.message;
    },
  },
  selectors: {
    error: (state): ErrorType => ({
        hasError: state.hasError,
        message: state.message,
    }),
  },
});

export const errorSliceActions = errorSlice.actions;
export const errorSliceSelectors = errorSlice.selectors;
