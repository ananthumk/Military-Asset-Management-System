import { Navigate } from 'react-router-dom';
import { useAPI } from '../context/APIContext';

export const ProtectedRoute = ({ children }) => {
  const { token } = useAPI();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
