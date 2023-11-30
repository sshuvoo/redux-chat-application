import { useDispatch } from 'react-redux';
import lwsDarkLogo from './../assets/lws-logo-dark.svg';
import { userSignedOut } from '../features/auth/authSlice';

export default function Navbar() {
   const dispatch = useDispatch();

   return (
      <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
         <div className="max-w-7xl mx-auto">
            <div className="flex justify-between h-16 items-center">
               <img className="h-10" src={lwsDarkLogo} />
               <ul>
                  <li className="text-white">
                     <button
                        onClick={() => {
                           dispatch(userSignedOut());
                           localStorage.removeItem('auth');
                        }}
                     >
                        Logout
                     </button>
                  </li>
               </ul>
            </div>
         </div>
      </nav>
   );
}
