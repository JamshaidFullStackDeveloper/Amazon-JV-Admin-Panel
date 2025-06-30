import Login from '@/Auth/Login/Index';
import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import HomePage from './../LandingPage/Home/Index';

import InvestmentCalculator from '@/LandingPage/InvestmentSection/InvestmentCalculater';
import Dashboard from '@/pages/Dashboard/Index';
import Cookies from 'js-cookie';
import Investors from '@/pages/Investors/Index';
import { Pools } from '@/pages/Pools';
import Requests from '@/pages/Requests/Index';
import MeetingRequests from '@/pages/Meeting Requests/Index';
import GraveyardInvestors from '@/pages/Graveyard Investors/Index';
import BankDetiles from '@/pages/Manage Bank/Index';
import Profile from '@/components/Profile';
import FAQPage from '@/pages/FAQS/Index';
import SupportTicketSystem from '@/pages/Support';

// Authentication guard
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");
  const isAuthenticated = useMemo(() => Boolean(token), [token]);
  return isAuthenticated ? children : <Navigate to="/" />;
};
// Define all routes
const AppRoutes = (isAuthenticated) => [
  // {
  //   path: '/',
  //   element: <HomePage />,
  // },
  {
    path: '/calculator',
    element: <InvestmentCalculator />,
  },

  // {
  //   path: '/contact',
  //   element: <ContactUs />,
  // },
  {
    path: '/',
    element: <Login />,
  },
  // {
  //   path: '/',
  //   element: <LandingPage />,
  // },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/investors',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <Investors />
      </ProtectedRoute>
    ),
  },
  {
    path: '/requests',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <Requests />
      </ProtectedRoute>
    ),
  },

  {
    path: '/pools',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <Pools />
      </ProtectedRoute>
    ),
  },

  {
    path: '/meetingRequest',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <MeetingRequests />
      </ProtectedRoute>
    ),
  },
  {
    path: '/graveyardInvestors',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <GraveyardInvestors />
      </ProtectedRoute>
    ),
  },

  {
    path: '/profile',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/faqs',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <FAQPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/support',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <SupportTicketSystem />
      </ProtectedRoute>
    ),
  },
  {
    path: '/manageBankDetiles',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <BankDetiles />
      </ProtectedRoute>
    ),
  },
];

export default AppRoutes;
