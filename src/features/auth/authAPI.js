import apiSlice from '../api/apiSlice';
import { userSignedIn } from './authSlice';

const authAPI = apiSlice.injectEndpoints({
   endpoints: ({ mutation }) => ({
      signup: mutation({
         query: (data) => ({
            url: '/register',
            method: 'POST',
            body: data,
         }),
         onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
            try {
               const { data: auth } = await queryFulfilled;
               localStorage.setItem('auth', JSON.stringify(auth));
               dispatch(userSignedIn(auth));
            } catch (error) {
               console.log(error);
               // Do nothing
            }
         },
      }),
      signin: mutation({
         query: (data) => ({
            url: '/login',
            method: 'POST',
            body: data,
         }),
         onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
            try {
               const { data: auth } = await queryFulfilled;
               localStorage.setItem('auth', JSON.stringify(auth));
               dispatch(userSignedIn(auth));
            } catch (error) {
               // Do nothing
            }
         },
      }),
   }),
});

export const { useSigninMutation, useSignupMutation } = authAPI;
