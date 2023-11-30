import { useParams } from 'react-router-dom';
import { useGetMessagesQuery } from '../../features/messages/messagesAPI';
import ChatHead from './ChatHead';
import Messages from './Messages';
import Options from './Options';
import Error from '../ui/Error';

export default function InboxContainer() {
   const { inboxID } = useParams();
   const {
      data: messages,
      isLoading,
      isError,
      error,
   } = useGetMessagesQuery(inboxID);

   if (isLoading) return <div>Loading...</div>;
   if (isError) return <Error message={error.data} />;
   if (messages.length <= 0)
      return (
         <>
            <ChatHead message={messages[0]} />
            <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex justify-center items-center">
               <h1 className="text-4xl font-semibold opacity-25">Say Hello!</h1>
            </div>
            <Options />
         </>
      );
   return (
      <>
         <ChatHead message={messages[0]} />
         <Messages messages={messages} />
         <Options conversationId={messages[0].conversationId} />
      </>
   );
}
