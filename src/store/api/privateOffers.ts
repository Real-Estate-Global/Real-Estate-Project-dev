import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OfferFormDataEnum, OfferType } from "../../types/OfferType";
import { BASE_URL } from "./const";

export const privateOffersApi = createApi({
  reducerPath: "privateOffersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => {
    const getMyOffers = builder.query<OfferType[], void>({
      queryFn: async (_, { getState }) => {
        try {
          const response = await fetch(
            `${BASE_URL}/protected/myOffers`,
            {
              method: "GET",
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
        try {
          const response = await fetch(
            `${BASE_URL}/protected/myOffers`,
            {
              method: "POST",
              body: JSON.stringify({
                ...offer,
                [OfferFormDataEnum.YearOfBuilding]:
                  offer[OfferFormDataEnum.YearOfBuilding].toISOString(),
              }),
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
        try {
          const response = await fetch(
            `${BASE_URL}/protected/myOffers/${id}`,
            {
              method: "GET",
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
        try {
          const response = await fetch(
            `${BASE_URL}/protected/myOffers/${id}`,
            {
              method: "PUT",
              body: JSON.stringify(editOfferData),
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

    const deleteOffer = builder.mutation<any, string>({
      queryFn: async (id, { getState }) => {
        try {
          const response = await fetch(
            `${BASE_URL}/protected/myOffers/${id}`,
            {
              method: "DELETE",
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
