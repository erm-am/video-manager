import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TaskManagerPage } from '../pages/task-manager';
import { UploadManagerPage } from '../pages/upload-manager';
import { NotFoundPage } from '../pages/not-found';
import { PublicRoutes } from './routes';
import { MainPage } from '../pages/main';

export const Router = (): ReactElement => {
  return (
    <Routes>
      <Route path={PublicRoutes.MAIN} element={<MainPage />} />
      <Route path={PublicRoutes.TASKS} element={<TaskManagerPage />} />
      <Route path={PublicRoutes.UPLOAD} element={<UploadManagerPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};