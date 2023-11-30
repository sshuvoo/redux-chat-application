/* eslint-disable react/prop-types */
import gravatarUrl from 'gravatar-url';
import { useSelector } from 'react-redux';

export default function ChatHead({ message }) {
   const { email } = useSelector((state) => state.auth.user);
   const { receiver, sender } = message;
   return (
      <div className="relative flex items-center p-3 border-b border-gray-300">
         <img
            className="object-cover w-10 h-10 rounded-full"
            src={gravatarUrl(
               email === receiver.email ? sender.email : receiver.email,
               { size: 80 }
            )}
            alt={email === receiver.email ? sender.name : receiver.name}
         />
         <span className="block ml-2 font-bold text-gray-600">
            {email === receiver.email ? sender.name : receiver.name}
         </span>
      </div>
   );
}
