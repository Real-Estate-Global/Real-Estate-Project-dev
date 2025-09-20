import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth";
import { loadingSlice } from "./slices/loading";
import { errorSlice } from "./slices/error";
import { userApi } from "./api/user";
import { privateOffersApi } from "./api/privateOffers";
import { publicOffersApi } from "./api/publicOffers";
import { searchDataApi } from "./api/searchData";
import { profileSlice } from "./slices/profileSlice";
import { filtersSlice } from "./slices/filters";
import { notificationSlice } from "./slices/notificationSliceSelectors";
import { offersSlice } from "./slices/publicOffers";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [profileSlice.reducerPath]: profileSlice.reducer,
      [authSlice.reducerPath]: authSlice.reducer,
      [loadingSlice.reducerPath]: loadingSlice.reducer,
      [errorSlice.reducerPath]: errorSlice.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [privateOffersApi.reducerPath]: privateOffersApi.reducer,
      [publicOffersApi.reducerPath]: publicOffersApi.reducer,
      [searchDataApi.reducerPath]: searchDataApi.reducer,
      [filtersSlice.reducerPath]: filtersSlice.reducer,
      [notificationSlice.reducerPath]: notificationSlice.reducer,
      [offersSlice.reducerPath]: offersSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({ serializableCheck: false }).concat([
        userApi.middleware,
        privateOffersApi.middleware,
        publicOffersApi.middleware,
        searchDataApi.middleware,
      ]);
    },
  });

  return store;
};

export const store = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
