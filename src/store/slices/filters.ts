import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FiltersType } from "../../types/FiltersType";

type FiltersState = {
  selectedFilters: Partial<FiltersType> | null;
};

const initialState: FiltersState = {
  selectedFilters: null,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedFilters: (state, action: PayloadAction<Partial<FiltersType> | null>) => {
      console.log('set selected filters', action.payload);
      state.selectedFilters = action.payload;
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