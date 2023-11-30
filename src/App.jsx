import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import useAuthCheck from './hooks/useAuthCheck';
import Private from './components/Private';
import Public from './components/Public';
import ConversationPage from './pages/ConversationPage';
import Inbox from './components/Inbox';
import BlankInbox from './components/BlankInbox';

export default function App() {
   const authCheck = useAuthCheck();

   return authCheck ? (
      <Routes>
         <Route
            path="/signup"
            element={
               <Public>
                  <RegistrationPage />
               </Public>
            }
         />
         <Route
            path="/"
            element={
               <Public>
                  <LoginPage />
               </Public>
            }
         />
         <Route
            path="/inbox"
            element={
               <Private>
                  <ConversationPage />
               </Private>
            }
         >
            <Route path="/inbox/:inboxID" element={<Inbox />} />
            <Route path="/inbox" element={<BlankInbox />} />
         </Route>
      </Routes>
   ) : (
      <div className="flex justify-center items-center min-h-screen">
         <h3 className="text-center font-semibold text-2xl">
            Authentication Checking...
         </h3>
      </div>
   );
}
