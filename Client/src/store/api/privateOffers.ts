import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthorizationToken } from "../../utils/utils";
import { RootState } from "../store";
import { authSliceSelectors } from "../slices/auth";
import { OfferType } from "../../types/OfferType";

export const privateOffersApi = createApi({
  reducerPath: "privateOffersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),
  endpoints: (builder) => {
    const getMyOffers = builder.mutation<OfferType[], void>({
      queryFn: async (_, { getState }) => {
        try {
          const token: string = authSliceSelectors.accessToken(
            getState() as RootState
          );
          const response = await fetch(
            "http://localhost:3000/protected/myOffers",
            {
              method: "GET",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                "X-Authorization": getAuthorizationToken(token),
              },
            }
          );

          if (response.status === 404) {
            return { data: [] };
          }
          if (!response.ok) {
            throw await response.json();
          }

          const result = await response.json();

          return { data: result };
        } catch (error: any) {
          return { error };
        }
      },
    });

    // TODO: type
    const addNewOffer = builder.mutation<any, OfferType>({
      queryFn: async (offer, { getState }) => {
        const token: string = authSliceSelectors.accessToken(
          getState() as RootState
        );
        try {
          const response = await fetch(
            "http://localhost:3000/protected/myOffers",
            {
              method: "POST",
              body: JSON.stringify(offer),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                "X-Authorization": getAuthorizationToken(token),
              },
            }
          );

          if (!response.ok) {
            throw await response.json();
          }

          const result = await response.json();

          return { data: offer };
        } catch (error: any) {
          return { error };
        }
      },
    });

    const getMyOffer = builder.mutation<OfferType, string>({
      queryFn: async (id, { getState }) => {
        const token: string = authSliceSelectors.accessToken(
          getState() as RootState
        );

        try {
          const response = await fetch(
            `http://localhost:3000/protected/myOffers/${id}`,
            {
              method: "GET",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                "X-Authorization": getAuthorizationToken(token),
              },
            }
          );

          if (!response.ok) {
            throw await response.json();
          }

          const result = await response.json();

          return { data: result };
        } catch (error: any) {
          return { error };
        }
      },
    });

    // TODO: return type
    const editMyOffer = builder.mutation<
      any,
      { id: string; editOfferData: Partial<OfferType> }
    >({
      queryFn: async ({ id, editOfferData }, { getState }) => {
        const token: string = authSliceSelectors.accessToken(
          getState() as RootState
        );
        try {
          const response = await fetch(
            `http://localhost:3000/protected/myOffers/${id}`,
            {
              method: "PUT",
              body: JSON.stringify(editOfferData),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                "X-Authorization": getAuthorizationToken(token),
              },
            }
          );

          if (!response.ok) {
            throw await response.json();
          }

          const result = await response.json();

          return { data: result };
        } catch (error: any) {
          return { error };
        }
      },
    });

    // TODO: return type
    const deleteOffer = builder.mutation<any, string>({
      queryFn: async (id, { getState }) => {
        const token: string = authSliceSelectors.accessToken(
          getState() as RootState
        );

        try {
          const response = await fetch(
            `http://localhost:3000/protected/myOffers/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                "X-Authorization": getAuthorizationToken(token),
              },
            }
          );

          if (!response.ok) {
            throw await response.json();
          }

          const result = await response.json();

          return { data: result };
        } catch (error: any) {
          return { error };
        }
      },
    });

    return {
      getMyOffers,
      addNewOffer,
      editMyOffer,
      getMyOffer,
      deleteOffer,
    };
  },
});

export const {
  useGetMyOffersMutation,
  useAddNewOfferMutation,
  useGetMyOfferMutation,
  useEditMyOfferMutation,
  useDeleteOfferMutation,
} = privateOffersApi;
