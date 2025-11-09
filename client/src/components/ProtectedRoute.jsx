import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // pass the current location in state so Login can redirect back
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;