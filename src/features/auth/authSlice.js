import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   accessToken: null,
   user: null,
};

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      userSignedIn: (state, { payload }) => {
         state.accessToken = payload.accessToken;
         state.user = payload.user;
      },
      userSignedOut: (state) => {
         state.accessToken = null;
         state.user = null;
      },
   },
});

export const { userSignedIn, userSignedOut } = authSlice.actions;
export default authSlice.reducer;
