import InboxContainer from './chatbody/InboxContainer';

export default function Inbox() {
   return (
      <div className="w-full lg:col-span-2 lg:block">
         <div className="w-full grid conversation-row-grid">
            <InboxContainer />
         </div>
      </div>
   );
}
