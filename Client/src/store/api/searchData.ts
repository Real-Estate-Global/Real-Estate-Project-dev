import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { CityType } from "../../types/SearchDataType";
import { FiltersType } from "../../types/FiltersType";
import { BASE_URL } from "./const";

export const searchDataApi = createApi({
  reducerPath: "searchDataApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => {
    const getCities = builder.query<any[], void>({
      queryFn: async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/api/data/search/searchData",
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
          const data = await response.json();

          return { data: data.cities };
        } catch (error: any) {
          return { error };
        }
      },
    });

    const getSelectedFitlers = builder.mutation<FiltersType, string>({
      queryFn: async (searchString) => {
        try {
          const response = await fetch(
            `http://localhost:3000/data/search/getSelectedFitlers?searchString=${searchString}`,
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
          const data = await response.json();

          return { data: data.filters };
        } catch (error: any) {
          return { error };
        }
      },
    });

    return {
      getCities,
      getSelectedFitlers,
    };
  },
});

export const { useGetCitiesQuery, useGetSelectedFitlersMutation } =
  searchDataApi;
