import { useDispatch, useSelector } from 'react-redux';
import conversationApi, {
   useGetConversationsQuery,
} from '../features/conversations/conversationApi';
import Error from './ui/Error';
import ConversationItem from './ConversationItem';
import getPartnerInfo from './../utilities/getPartnerInfo';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConversationSkeleton from './ui/ConversationSkeleton';
import { useEffect, useState } from 'react';

export default function ConversationItems() {
   const { user } = useSelector((state) => state.auth);
   const {
      data: conversationResponse,
      isLoading,
      isError,
      error,
   } = useGetConversationsQuery(user.email);

   const [pageNo, setPageNo] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const dispatch = useDispatch();

   const { response: conversations, totalConversations } =
      conversationResponse || {};

   useEffect(() => {
      if (pageNo > 1) {
         dispatch(
            conversationApi.endpoints.getMoreConversations.initiate({
               email: user.email,
               pageNo,
            })
         );
      }
   }, [pageNo, dispatch, user]);

   useEffect(() => {
      if (totalConversations > 0) {
         setHasMore(Math.ceil(totalConversations / 13) > pageNo);
      }
   }, [totalConversations, pageNo]);

   if (isLoading) return <ConversationSkeleton />;
   if (isError) return <Error message={error.data} />;
   if (conversations?.length <= 0)
      return <Error message="No Conversations Found" />;
   return (
      <InfiniteScroll
         dataLength={conversations?.length}
         next={() => setPageNo((pre) => pre + 1)}
         hasMore={hasMore}
         loader={<ConversationSkeleton />}
         height={innerHeight - 129}
      >
         {conversations.map((conversation) => {
            const partner = getPartnerInfo(conversation.users, user.email);
            return (
               <ConversationItem
                  key={conversation.id}
                  partner={partner}
                  timestamp={conversation.timestamp}
                  message={conversation.message}
                  inboxID={conversation.id}
               />
            );
         })}
      </InfiniteScroll>
   );
}
