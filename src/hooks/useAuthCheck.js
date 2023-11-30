import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { userSignedIn } from '../features/auth/authSlice';

export default function useAuthCheck() {
   const [status, setStatus] = useState(false);
   const dispatch = useDispatch();

   useEffect(() => {
      const auth = JSON.parse(localStorage.getItem('auth'));
      if (auth?.accessToken) {
         dispatch(userSignedIn(auth));
      }
      setStatus(true);
   }, [dispatch]);

   return status;
}
