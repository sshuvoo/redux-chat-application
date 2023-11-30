import { useSelector } from 'react-redux';
import { useGetConversationsQuery } from '../features/conversations/conversationApi';
import Error from './ui/Error';
import ConversationItem from './ConversationItem';
import getPartnerInfo from './../utilities/getPartnerInfo';

export default function ConversationItems() {
   const { user } = useSelector((state) => state.auth);
   const {
      data: conversations,
      isLoading,
      isError,
      error,
   } = useGetConversationsQuery(user.email);

   if (isLoading) return <li>Loading...</li>;
   if (isError) return <Error message={error.data} />;
   if (conversations.length <= 0)
      return <Error message="No Conversations Found" />;
   return conversations.map((conversation) => {
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
   });
}
