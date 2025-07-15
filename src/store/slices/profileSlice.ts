import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileDataType } from "../../types/ProfileDataType";

// TODO:
// User::
// :userId*
// :email*
// :fullName*
// :phoneNumber*
// :type - individual, agency, (admin)*
// :+photo+(optional)
// :description(optional)
// :address(optional)
// :instagram/facebook(optional)

const initialState: ProfileDataType = {
  name: "",
  email: "",
  password: "",
  profileType: "",
  phoneNumber: "",
  watermark: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData(state, action: PayloadAction<Partial<ProfileDataType>>) {
      return { ...state, ...action.payload };
    },
    resetProfile() {
      return initialState;
    },
  },
  selectors: {
    watermark: (state) => state.watermark,
    profileData: (state) => state
  }
});

export const profileSliceActions = profileSlice.actions;
export const profileSliceSelectors = profileSlice.selectors;
