import Login from '@/Auth/Login/Index';
import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import HomePage from './../LandingPage/Home/Index';

import InvestmentCalculator from '@/LandingPage/InvestmentSection/InvestmentCalculater';
import Dashboard from '@/pages/Dashboard/Index';
import Cookies from 'js-cookie';
import Investors from '@/pages/Investors/Index';

// Authentication guard
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");
  const isAuthenticated = useMemo(() => Boolean(token), [token]);
  return isAuthenticated ? children : <Navigate to="/login" />;
};
// Define all routes
const AppRoutes = (isAuthenticated) => [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/calculator',
    element: <InvestmentCalculator />,
  },

  // {
  //   path: '/contact',
  //   element: <ContactUs />,
  // },
  {
    path: '/login',
    element: <Login />,
  },
  // {
  //   path: '/',
  //   element: <LandingPage />,
  // },
  {
    path: '/dashboard',
    element: (
      // <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Dashboard />
      // </ProtectedRoute>
    ),
  },
  {
    path: '/investors',
    element: (
      // <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Investors />
      // </ProtectedRoute>
    ),
  },


  {
    path: '/profile',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        {/* <ProfilePage /> */}
      </ProtectedRoute>
    ),
  },
];

export default AppRoutes;
