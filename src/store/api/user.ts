import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginDataType } from "../../types/LoginDataType";
import { ProfileDataType } from "../../types/ProfileDataType";
import { BASE_URL } from "./const";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => {
    const login = builder.mutation<string, LoginDataType>({
      queryFn: async (loginData) => {
        try {
          const response = await fetch(`${BASE_URL}/user/login`, {
            method: "POST",
            body: JSON.stringify(loginData),
          });

          if (!response.ok) {
            throw await response.json();
          }

          const data = await response.json();
          return {
            data: data.accessToken,
          };
        } catch (error: any) {
          return { error };
        }
      },
    });

    const signup = builder.mutation<any, ProfileDataType>({
      queryFn: async (signupData) => {
        try {
          const response = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            body: JSON.stringify(signupData),
          });

          if (!response.ok) {
            throw await response.json();
          }

          const data = await response.json();
          return {
            data,
          };
        } catch (error: any) {
          return { error };
        }
      },
    });

    const editProfile = builder.mutation<any, Partial<ProfileDataType>>({
      queryFn: async (signupData) => {
        try {
          const response = await fetch(`${BASE_URL}/user/me`, {
            method: "PUT",
            body: JSON.stringify(signupData),
          });

          if (!response.ok) {
            throw await response.json();
          }

          const data = await response.json();
          return {
            data,
          };
        } catch (error: any) {
          return { error };
        }
      },
    });

    const logout = builder.mutation<void, void>({
      queryFn: async (_, { getState }) => {
        try {
          const response = await fetch(`${BASE_URL}/user/logout`, {
            method: "POST",
          });

          if (!response.ok) {
            throw await response.json();
          }

          const data = await response.json();

          return {
            data,
          };
        } catch (error: any) {
          return { error };
        }
      },
    });

    const getProfileData = builder.mutation<ProfileDataType, void>({
      queryFn: async (_, { getState }) => {
        try {
          const response = await fetch(`${BASE_URL}/user/me`, {
            method: "GET",
          });

          if (!response.ok) {
            throw await response.json();
          }
          const data = await response.json();

          return {
            data,
          };
        } catch (error: any) {
          return { error };
        }
      },
    });

    return {
      login,
      signup,
      logout,
      getProfileData,
      editProfile,
    };
  },
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useGetProfileDataMutation,
  useEditProfileMutation,
} = userApi;
