import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthorizationToken } from "../../utils/utils";
import { RootState } from "../store";
import { authSliceSelectors } from "../slices/auth";
import { OfferFormDataEnum, OfferType } from "../../types/OfferType";

export const privateOffersApi = createApi({
  reducerPath: "privateOffersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),
  endpoints: (builder) => {
    const getMyOffers = builder.query<OfferType[], void>({
      queryFn: async (_, { getState }) => {
        try {
          const token: string =
            authSliceSelectors.accessToken(getState() as RootState) ||
            JSON.parse(localStorage.getItem("auth") as string);

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

          const result: OfferType[] = await response.json();

          return {
            data: result.map((offer) => ({
              ...offer,
              yearOfBuilding: new Date(offer.yearOfBuilding),
            })),
          };
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
              body: JSON.stringify({
                ...offer,
                [OfferFormDataEnum.YearOfBuilding]:
                  offer[OfferFormDataEnum.YearOfBuilding].toISOString(),
              }),
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

    const getMyOffer = builder.query<OfferType, string>({
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

          return {
            data: {
              ...result,
              yearOfBuilding: new Date(result.yearOfBuilding),
            },
          };
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
  useGetMyOffersQuery,
  useAddNewOfferMutation,
  useGetMyOfferQuery,
  useEditMyOfferMutation,
  useDeleteOfferMutation,
} = privateOffersApi;
