import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth";
import { loadingSlice } from "./slices/loading";
import { errorSlice } from "./slices/error";
import { authApi } from "./api/auth";
import { privateOffersApi } from "./api/privateOffers";
import { publicOffersApi } from "./api/publicOffers";
import { searchDataApi } from "./api/searchData";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [authSlice.reducerPath]: authSlice.reducer,
      [loadingSlice.reducerPath]: loadingSlice.reducer,
      [errorSlice.reducerPath]: errorSlice.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [privateOffersApi.reducerPath]: privateOffersApi.reducer,
      [publicOffersApi.reducerPath]: publicOffersApi.reducer,
      [searchDataApi.reducerPath]: searchDataApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({ serializableCheck: false }).concat([
        authApi.middleware,
        privateOffersApi.middleware,
        publicOffersApi.middleware,
        searchDataApi.middleware,
      ]);
    },
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
