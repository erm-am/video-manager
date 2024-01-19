import React, { useEffect } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Router } from '../router/index';
import { useAuthStore } from './store';
export const App = () => {
  const { isLoading, checkAuth, login } = useAuthStore((state) => state);

  useEffect(() => {
    checkAuth();
  }, []);
  // console.log('isAuth', isAuth);
  // console.log('login', login());
  // console.log('render');
  return (
    <BrowserRouter>
      <div>{isLoading ? 'loading' : 'ok'}</div>
      <Router />
    </BrowserRouter>
  );
};
