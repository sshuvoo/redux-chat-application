import { useSelector } from 'react-redux';

export default function useLoggedIn() {
   const { accessToken } = useSelector((state) => state.auth);
   return Boolean(accessToken);
}
