// ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Periodically check for token expiration
    const interval = setInterval(() => {
      const token = localStorage.getItem('access_token'); 
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            localStorage.removeItem('access_token');
            navigate('/'); // Redirect to login if expired
          }
        } catch (error) {
          console.error("Token decoding error:", error);
          localStorage.removeItem('access_token');
          navigate('/'); // Redirect on token error
        }
      } else {
        // If no token is found, redirect immediately
        navigate('/');
      }
    }, 1000 * 60); // Check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate]);

  // If no token is present initially, redirect to login
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token is valid, render the protected component
  return children;
};

export default ProtectedRoute;
