import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  firstName: string,
  lastName: string,
  email: string,
  walletAddress: string
}

const initialState: UserState = {
  firstName: '',
  lastName: '',
  email: '',
  walletAddress: ''
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
      state.walletAddress = ''
    },
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload
    },
    userLogout: (state) => {
      state.firstName = ''
      state.lastName = ''
      state.email = ''
      state.walletAddress = ''
    }
  },
})

// Action creators are generated for each case reducer function
export const { getUserInfo, setUserInfo, setWalletAddress, userLogout } = userSlice.actions

export default userSlice.reducer