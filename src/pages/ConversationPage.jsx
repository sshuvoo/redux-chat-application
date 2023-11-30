import { Outlet } from 'react-router-dom';
import Conversations from '../components/Conversations';
import Navbar from '../components/Navbar';

export default function ConversationPage() {
   return (
      <div>
         <Navbar />
         <div className="max-w-7xl mx-auto -mt-1">
            <div className="min-w-full min-h-[calc(100vh-64px)] border rounded flex lg:grid lg:grid-cols-3">
               <Conversations />
               <Outlet />
            </div>
         </div>
      </div>
   );
}
