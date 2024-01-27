import React, { useEffect } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Router } from '../router/index';
import { useAuthStore } from './store';
export const App = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      {!isAuth || isLoading ? (
        'loading (check session)'
      ) : (
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      )}
    </>
  );
};
