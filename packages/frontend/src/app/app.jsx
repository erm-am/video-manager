import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Router } from '../router/index';
export const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};
