import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  firstName: string,
  lastName: string,
  email: string,
  accessToken: string,
}

const initialState: UserState = {
  firstName: '',
  lastName: '',
  email: '',
  accessToken: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUserInfo: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return state
    },
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.firstName = action.payload.firstName
      state.lastName = action.payload.lastName
      state.email = action.payload.email
    },
    setAccessToken: (state, action: PayloadAction<string>) =>{
      state.accessToken = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { getUserInfo, setUserInfo, setAccessToken } = userSlice.actions

export default userSlice.reducer