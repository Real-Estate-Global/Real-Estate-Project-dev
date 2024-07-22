import { configureStore } from '@reduxjs/toolkit'

export const makeStore = () => {
    const store = configureStore({
        reducer: {},
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat([])
        }
    })

    return store
}

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"]
