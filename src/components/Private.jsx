/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import useLoggedIn from '../hooks/useLoggedIn';

export default function Private({ children }) {
   const isLoggedIn = useLoggedIn();
   return isLoggedIn ? children : <Navigate to="/" />;
}
