import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/login';
import { Paths } from './paths';
import { NotFoundPage } from '@/pages/not-found';
import { LogoutPage } from '@/pages/logout';
import { VideoManager } from '@/pages/video-manager';

type RouterProps = {
  isAuthenticated: boolean;
};
export const Router: React.FC<RouterProps> = ({ isAuthenticated }) => {
  return isAuthenticated ? privateRoutes() : publicRoutes();
};

const publicRoutes = () => {
  return (
    <Routes>
      <Route path={Paths.LOGIN} element={<LoginPage />} />
      <Route path="*" element={<Navigate to={Paths.LOGIN} replace={true} />} />
    </Routes>
  );
};
const privateRoutes = () => {
  return (
    <Routes>
      <Route path={Paths.LOGIN} element={<Navigate to={Paths.MAIN} replace={true} />} />
      <Route path={Paths.MAIN} element={<VideoManager />} />
      <Route path={Paths.LOGOUT} element={<LogoutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
