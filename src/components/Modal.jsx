import { useEffect, useState } from 'react';
import isValidEmail from '../utilities/isValidEmail';
import { useGetUserQuery } from '../features/user/userApi';
import {
   useAddConversationMutation,
   useGetConversationQuery,
   useUpdateConversationMutation,
} from '../features/conversations/conversationApi';
import Error from './ui/Error';
import { useSelector } from 'react-redux';

export default function Modal({ control }) {
   const { email: userEmail } = useSelector((state) => state.auth.user);
   const { user } = useSelector((state) => state.auth);
   const [email, setEmail] = useState('');
   const [message, setMessage] = useState('');
   const [checkUser, setCheckUser] = useState(true);
   const [checkConversation, setCheckConversation] = useState(true);
   const [errMessage, setErrMessage] = useState('');

   const { data: partner } = useGetUserQuery(email, {
      skip: checkUser,
   });

   const { data: conversation, isSuccess } = useGetConversationQuery(
      {
         userEmail,
         partnerEmail: email,
      },
      { skip: checkConversation }
   );

   const [addConversation, { isSuccess: addConversationSuccess }] =
      useAddConversationMutation();
   const [updateConversation, { isSuccess: updateConversationSuccess }] =
      useUpdateConversationMutation();

   useEffect(() => {
      if (partner?.length > 0) {
         setCheckConversation(false);
      }
   }, [partner]);

   const checkEmailValidity = (value) => {
      if (isValidEmail(value)) {
         setErrMessage(null);
         if (userEmail !== value) {
            setEmail(value);
            setCheckUser(false);
         } else setErrMessage("You can't message yourself");
      } else {
         setErrMessage('Invalid Email');
      }
   };

   const debounce = (cb, delay) => {
      let timeoutID;
      return (event) => {
         clearTimeout(timeoutID);
         timeoutID = setTimeout(() => {
            cb(event.target.value);
         }, delay);
      };
   };

   const emailHandler = debounce(checkEmailValidity, 1000);

   const submitHandler = (event) => {
      event.preventDefault();
      if (conversation?.length > 0) {
         updateConversation({
            id: conversation[0].id,
            data: { message, timestamp: Date.now() },
         });
      } else {
         addConversation({
            participants: `${userEmail}-${email}`,
            users: [
               {
                  email: user.email,
                  name: user.name,
                  id: user.id,
               },
               {
                  email: partner[0].email,
                  name: partner[0].name,
                  id: partner[0].id,
               },
            ],
            message,
            timestamp: Date.now(),
         });
      }
   };

   useEffect(() => {
      if (addConversationSuccess || updateConversationSuccess) {
         control(false);
      }
   }, [addConversationSuccess, updateConversationSuccess, control]);
   
   return (
      <>
         <div
            onClick={() => control(false)}
            className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
         ></div>
         <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
               Send message
            </h2>
            <form className="mt-8 space-y-6" onSubmit={submitHandler}>
               <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                     <label htmlFor="to" className="sr-only">
                        To
                     </label>
                     <input
                        id="to"
                        name="to"
                        type="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                        placeholder="Send to"
                        onChange={emailHandler}
                     />
                  </div>
                  <div>
                     <label htmlFor="message" className="sr-only">
                        Message
                     </label>
                     <textarea
                        id="message"
                        name="message"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                     />
                  </div>
               </div>

               <div>
                  <button
                     disabled={!isSuccess || !partner?.length > 0 || !message}
                     type="submit"
                     className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
                        isSuccess && partner?.length > 0 && message
                           ? 'bg-violet-600 hover:bg-violet-700'
                           : 'bg-gray-400'
                     }`}
                  >
                     Send Message
                  </button>
               </div>

               {partner?.length <= 0 && <Error message="User not found" />}
               {errMessage && <Error message={errMessage} />}
            </form>
         </div>
      </>
   );
}
