import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FiltersType } from "../../types/FiltersType";

type FiltersState = {
  isLoading: boolean;
  selectedFilters: Partial<FiltersType> | null;
};

const initialState: FiltersState = {
  isLoading: false,
  selectedFilters: null,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedFilters: (state, action: PayloadAction<Partial<FiltersType> | null>) => {
      state.selectedFilters = {
        ...state.selectedFilters,
        ...action.payload,
      };
    },
    clearSelectedFilters: (state) => {
      state.selectedFilters = null;
    },
  },
  selectors: {
    selectedFilters: (state) => state.selectedFilters,
  },
});

export const filtersSliceActions = filtersSlice.actions;
export const filtersSliceSelectors = filtersSlice.selectors;