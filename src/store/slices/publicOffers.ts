import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OfferType } from "../../types/OfferType";
import { publicOffersApi } from "../api/publicOffers";

type OffersState = {
    isLoading: boolean;
    publicOffers: OfferType[];
};

const initialState: OffersState = {
    isLoading: false,
    publicOffers: [],
};

export const offersSlice = createSlice({
    name: "publicOffers",
    initialState,
    reducers: {
        setPublicOffers: (state, action: PayloadAction<OfferType[]>) => {
            state.publicOffers = action.payload
        },
    },
    selectors: {
        isLoading: (state) => state.isLoading,
        publicOffers: (state) => state.publicOffers,
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            publicOffersApi.endpoints.getPublicOffers.matchPending,
            (state) => {
                state.isLoading = true;
            }
        );
        builder.addMatcher(
            publicOffersApi.endpoints.getPublicOffers.matchFulfilled,
            (state, action) => {
                state.isLoading = false;
                state.publicOffers = action.payload;
            }
        );
        builder.addMatcher(
            publicOffersApi.endpoints.getPublicOffers.matchRejected,
            (state) => {
                state.isLoading = false;
            }
        );
    }
});

export const publicOffersSliceActions = offersSlice.actions;
export const publicOffersSliceSelectors = offersSlice.selectors;
