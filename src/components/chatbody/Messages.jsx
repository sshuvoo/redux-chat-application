/* eslint-disable react/prop-types */
import Message from './Message';

export default function Messages({ messages }) {
   return (
      <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
         <ul className="space-y-2">
            {messages
               .slice()
               .sort((a, b) => a.timestamp - b.timestamp)
               .map((message) => {
                  return (
                     <Message
                        key={message.id}
                        receiver={message.receiver.email}
                        message={message.message}
                     />
                  );
               })}
         </ul>
      </div>
   );
}
