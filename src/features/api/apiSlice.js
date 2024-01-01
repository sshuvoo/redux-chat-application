import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userSignedOut } from '../auth/authSlice';

const customBaseQuery = fetchBaseQuery({
   baseUrl: import.meta.env.VITE_BASE_URL,
   prepareHeaders: async (headers, { getState }) => {
      const accessToken = getState().auth?.accessToken;
      if (accessToken) {
         headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
   },
});

const apiSlice = createApi({
   reducerPath: 'api',
   baseQuery: async (args, api, extraOptions) => {
      const response = await customBaseQuery(args, api, extraOptions);
      if (response.error && response.error.status === 401) {
         api.dispatch(userSignedOut());
         localStorage.clear();
      }
      return response;
   },
   tagTypes: [],
   endpoints: () => ({}),
});

export default apiSlice;
