import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';
import Cookies from 'js-cookie';
import Loading from '../components/Loading';

export default function GuestLayout() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    return (
        auth.isLoading ?<Loading centered={true}  size={'large'} /> :
        auth.user ? <Navigate to='/user/dashboard' /> :<Outlet />
    );

};

