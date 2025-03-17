import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import AppRoutes from './route/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { LoaderProvider } from './context/LoaderContext';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from './components/ui/toaster';
import Cookies from "js-cookie";
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <LoaderProvider>
          <ToastProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {AppRoutes().map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </LoaderProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
