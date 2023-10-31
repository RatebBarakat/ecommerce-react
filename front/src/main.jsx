import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/auth.jsx';
import router from './router.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../public/css/table.css";
import { ProfileProvider } from './contexts/profile';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
    <AuthProvider>
      <ProfileProvider>
        <ToastContainer />
      <RouterProvider router={router} />
      </ProfileProvider>
    </AuthProvider>,
  document.getElementById('root')
);
