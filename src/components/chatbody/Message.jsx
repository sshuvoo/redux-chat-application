import { useSelector } from 'react-redux';

/* eslint-disable react/prop-types */
export default function Message({ receiver, message }) {
   const { email } = useSelector((state) => state.auth.user);
   return (
      <li
         className={`flex ${
            receiver === email ? 'justify-start' : 'justify-end'
         }`}
      >
         <div
            className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow ${
               receiver === email ? 'bg-blue-100' : 'bg-pink-100'
            }`}
         >
            <span className="block">{message}</span>
         </div>
      </li>
   );
}
