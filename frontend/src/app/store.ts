import { configureStore } from '@reduxjs/toolkit'
// import devToolsEnhancer from 'remote-redux-devtools'
import userReducer from './reducers/userReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // devTools: false,
  // enhancers: [devToolsEnhancer({ realtime: true })],
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch