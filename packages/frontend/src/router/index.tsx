import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TaskManagerPage } from '../pages/task-manager';
import { FileManagerPage } from '../pages/file-manager';
import { NotFoundPage } from '../pages/not-found';
import { PublicRoutes } from './routes';
import { MainPage } from '../pages/main';

export const Router = (): ReactElement => {
  return (
    <Routes>
      <Route path={PublicRoutes.MAIN} element={<MainPage />} />
      <Route path={PublicRoutes.TASKS} element={<TaskManagerPage />} />
      <Route path={PublicRoutes.UPLOAD} element={<FileManagerPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
