import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FiltersType } from "../../types/FiltersType";
import { OfferType } from "../../types/OfferType";

const buildFiltersQuery = (filters: FiltersType) => {
  if (!filters) {
    return "";
  }
  let filtersQuery = "?";

  for (const item in filters) {
    filtersQuery += `item=${filters[item as keyof FiltersType]}`;
  }

  return filtersQuery;
};

export const publicOffersApi = createApi({
  reducerPath: "publicOffersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),
  endpoints: (builder) => {
    const getPublicOffers = builder.mutation<OfferType[], FiltersType | null>({
      queryFn: async (filters) => {
        try {
          const response = await fetch(
            filters
              ? `http://localhost:3000/data/offers${buildFiltersQuery(filters)}`
              : "http://localhost:3000/data/offers",
            {
              method: "GET",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          );

          if (!response.ok) {
            throw await response.json();
          }
          const properties = await response.json();

          return { data: properties };
        } catch (error: any) {
          return { error };
        }
      },
    });

    const getPublicOffer = builder.query<OfferType, string>({
      queryFn: async (id) => {
        try {
          const response = await fetch(
            `http://localhost:3000/data/offers/${id}`,
            {
              method: "GET",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
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
      getPublicOffers,
      getPublicOffer,
    };
  },
});

export const { useGetPublicOffersMutation, useGetPublicOfferQuery } =
  publicOffersApi;
