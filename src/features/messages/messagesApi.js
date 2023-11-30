import apiSlice from '../api/apiSlice';
import { io } from 'socket.io-client';
const messagesApi = apiSlice.injectEndpoints({
   endpoints: ({ query, mutation }) => ({
      getMessages: query({
         query: (id) => ({
            url: `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=10`,
         }),
         onCacheEntryAdded: async (
            arg,
            { cacheDataLoaded, cacheEntryRemoved, updateCachedData, getState }
         ) => {
            const socket = io('http://localhost:9000', {
               reconnectionDelay: 1000,
               reconnection: true,
               reconnectionAttempts: 10,
               transports: ['websocket'],
               agent: false,
               upgrade: false,
               rejectUnauthorized: false,
            });
            try {
               await cacheDataLoaded;
               socket.on('messages', (data) => {
                  const exist =
                     data.receiver.email === getState().auth.user.email;
                  if (exist) {
                     updateCachedData((draft) => {
                        draft.push(data);
                     });
                  }
               });
            } catch (error) {
               console.log(error);
            }
            await cacheEntryRemoved;
            socket.close();
         },
      }),
      addMessage: mutation({
         query: (data) => ({
            url: `/messages`,
            method: 'POST',
            body: data,
         }),
      }),
   }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
export default messagesApi;
