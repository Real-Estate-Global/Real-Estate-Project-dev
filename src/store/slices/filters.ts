import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FiltersType } from "../../types/FiltersType";
import { searchDataApi } from "../api/searchData";

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
    isLoading: (state) => state.isLoading,
    selectedFilters: (state) => state.selectedFilters,
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      searchDataApi.endpoints.getSelectedFilters.matchPending,
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      searchDataApi.endpoints.getSelectedFilters.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        // TODO: do not apply from server when null?
        state.selectedFilters = action.payload;
      }
    );
    builder.addMatcher(
      searchDataApi.endpoints.getSelectedFilters.matchRejected,
      (state) => {
        state.isLoading = false;
      }
    );
  }
});

export const filtersSliceActions = filtersSlice.actions;
export const filtersSliceSelectors = filtersSlice.selectors;