import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthorizationToken } from "../../utils/utils";
import { LoginDataType } from "../../types/LoginDataType";
import { ProfileDataType } from "../../types/ProfileDataType";
import { authSliceSelectors } from "../slices/auth";
import { RootState } from "../store";
import { BASE_URL } from "./const";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => {
    const login = builder.mutation<string, LoginDataType>({
      queryFn: async (loginData) => {
        try {
          const response = await fetch(`${BASE_URL}/user/login`, {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
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

    // TODO: return type
    const signup = builder.mutation<any, ProfileDataType>({
      queryFn: async (signupData) => {
        try {
          const response = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
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
          const token: string = authSliceSelectors.accessToken(
            getState() as RootState
          );

          const response = await fetch(`${BASE_URL}/user/logout`, {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "X-Authorization": getAuthorizationToken(token),
            },
          });

          if (!response.ok) {
            throw await response.json();
          }

          const data = await response.json();

          if (response.status === 403) {
            // TODO: handle
          }

          return {
            data,
          };
        } catch (error: any) {
          return { error };
        }
      },
    });

    // TODO: move profile data to another api
    const getProfileData = builder.query<ProfileDataType, void>({
      queryFn: async (_, { getState }) => {
        const token: string = authSliceSelectors.accessToken(
          getState() as RootState
        );

        try {
          const response = await fetch(`${BASE_URL}/user/me`, {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "X-Authorization": getAuthorizationToken(token),
            },
          });

          if (!response.ok) {
            throw await response.json();
          }

          if (response.status === 403) {
            // TODO: better message.
            throw new Error("User not logged in!");
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
    };
  },
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useGetProfileDataQuery,
} = authApi;
