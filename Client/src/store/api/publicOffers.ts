import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FiltersType } from "../../types/FiltersType";
import { OfferType } from "../../types/OfferType";
import { BASE_URL } from "./const";

const buildFiltersQuery = (filters: FiltersType) => {
  if (!filters) {
    return "";
  }
  let filtersQuery = "?";

  if (filters.city) {
    filtersQuery += `location=${filters.city}`;
  }
  if (filters.district) {
    filtersQuery += `district=${filters.district}`;
  }

  return filtersQuery;
};
const filterOffers = (filters: FiltersType, properties: OfferType[]) => {
  return properties.filter((property) => {
    if (filters.budgetLowest) {
      if (property.price < filters.budgetLowest) {
        return false;
      }
    }

    if (filters.budgetHighest) {
      if (property.price > filters.budgetHighest) {
        return false;
      }
    }

    return true;
  });
};

export const publicOffersApi = createApi({
  reducerPath: "publicOffersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => {
    const getPublicOffers = builder.mutation<OfferType[], FiltersType | null>({
      queryFn: async (filters) => {
        try {
          const response = await fetch(
            filters
              ? `${BASE_URL}/data/offers${buildFiltersQuery(filters)}`
              : `${BASE_URL}/data/offers`,
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

          if (filters) {
            return { data: filterOffers(filters, properties) };
          }

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
            `${BASE_URL}/data/offers/${id}`,
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
