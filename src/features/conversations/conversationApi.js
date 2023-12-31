import apiSlice from '../api/apiSlice';
import messagesApi from '../messages/messagesAPI';
import { io } from 'socket.io-client';

const conversationApi = apiSlice.injectEndpoints({
   endpoints: ({ query, mutation }) => ({
      getConversations: query({
         query: (email) => ({
            url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=13`,
         }),
         transformResponse: (response, meta) => {
            const totalConversations =
               meta.response.headers.get('X-Total-Count');
            return { response, totalConversations };
         },
         onCacheEntryAdded: async (
            arg,
            { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
         ) => {
            // listen socket
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
               socket.on('conversations', (data) => {
                  const exist = data.participants.split('-').includes(arg);
                  if (exist) {
                     updateCachedData((draft) => {
                        const cashedConversation = draft.response.find(
                           (conversation) => Number(conversation.id) === data.id
                        );
                        cashedConversation.message = data.message;
                        cashedConversation.timestamp = data.timestamp;
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
      getMoreConversations: query({
         query: ({ email, pageNo }) => ({
            url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${pageNo}&_limit=13`,
         }),
         onQueryStarted: async ({ email }, { queryFulfilled, dispatch }) => {
            try {
               const { data: conversations } = await queryFulfilled;
               if (conversations?.length > 0) {
                  // Update conversation data pecimistically
                  dispatch(
                     apiSlice.util.updateQueryData(
                        'getConversations',
                        email,
                        (draft) => ({
                           response: [...draft.response, ...conversations],
                           totalConversations: draft.totalConversations,
                        })
                     )
                  );
               }
            } catch (error) {
               console.log(error);
            }
         },
      }),
      getConversation: query({
         query: ({ userEmail, partnerEmail }) => ({
            url: `/conversations?participants=${userEmail}-${partnerEmail}&participants=${partnerEmail}-${userEmail}`,
         }),
      }),
      addConversation: mutation({
         query: (data) => ({
            url: `/conversations`,
            method: 'POST',
            body: data,
         }),
         onQueryStarted: async (
            arg,
            { queryFulfilled, dispatch, getState }
         ) => {
            const myEmail = getState().auth.user.email;
            const { data } = await queryFulfilled;
            const mySelf = data.users.find((user) => user.email === myEmail);
            const partner = data.users.find((user) => user.email !== myEmail);
            dispatch(
               messagesApi.endpoints.addMessage.initiate({
                  conversationId: data.id,
                  message: data.message,
                  timestamp: data.timestamp,
                  sender: mySelf,
                  receiver: partner,
               })
            );
         },
      }),
      updateConversation: mutation({
         query: ({ id, data }) => ({
            url: `/conversations/${id}`,
            method: 'PATCH',
            body: data,
         }),
         onQueryStarted: async (
            arg,
            { queryFulfilled, dispatch, getState }
         ) => {
            const myEmail = getState().auth.user.email;
            // Optimistic cashe update start
            const optimisticConversation = dispatch(
               apiSlice.util.updateQueryData(
                  'getConversations',
                  myEmail,
                  (cacheConversations) => {
                     const updateableConversation =
                        cacheConversations.response.find(
                           (conversation) => Number(conversation.id) === arg.id
                        );
                     updateableConversation.message = arg.data.message;
                     updateableConversation.timestamp = arg.data.timestamp;
                  }
               )
            );
            // Optimistic cashe update end
            try {
               const { data } = await queryFulfilled;
               const mySelf = data.users.find((user) => user.email === myEmail);
               const partner = data.users.find(
                  (user) => user.email !== myEmail
               );
               const responseMessage = await dispatch(
                  messagesApi.endpoints.addMessage.initiate({
                     conversationId: data.id,
                     message: data.message,
                     timestamp: data.timestamp,
                     sender: mySelf,
                     receiver: partner,
                  })
               ).unwrap();
               // Pacimistic cache update
               dispatch(
                  apiSlice.util.updateQueryData(
                     'getMessages',
                     responseMessage.conversationId.toString(),
                     (chacheMessages) => {
                        chacheMessages.push(responseMessage);
                     }
                  )
               );
               // Pacimistic cache update
            } catch (error) {
               optimisticConversation.undo();
            }
         },
      }),
   }),
});

export const {
   useGetConversationsQuery,
   useGetConversationQuery,
   useAddConversationMutation,
   useUpdateConversationMutation,
} = conversationApi;

export default conversationApi;
