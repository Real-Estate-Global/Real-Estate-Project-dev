import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CityType } from "../../types/SearchDataType";

export const searchDataApi = createApi({
  reducerPath: "searchDataApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),
  endpoints: (builder) => {
    const getCities = builder.query<CityType[], void>({
      queryFn: async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/data/searchData",
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

    return {
      getCities,
    };
  },
});

export const { useGetCitiesQuery } = searchDataApi;
