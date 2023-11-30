import apiSlice from '../api/apiSlice';

const userApi = apiSlice.injectEndpoints({
   endpoints: ({ query }) => ({
      getUser: query({
         query: (email) => ({
            url: `/users?email=${email}`,
         }),
      }),
   }),
});

export const { useGetUserQuery } = userApi;
