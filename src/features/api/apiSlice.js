import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
   reducerPath: 'api',
   baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: async (headers, { getState }) => {
         const accessToken = getState().auth?.accessToken;
         if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
         }
         return headers;
      },
   }),
   tagTypes: [],
   endpoints: () => ({}),
});

export default apiSlice;
