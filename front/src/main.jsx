import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/auth.jsx';
import router from './router.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../public/css/table.css";
import "tw-elements-react/dist/css/tw-elements-react.min.css";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
