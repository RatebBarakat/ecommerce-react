import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';
import Loading from '../components/Loading';

export default function AuthLayout() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const logout = async () => {
        await auth.logout();
        return navigate("/login");
    };

    useEffect(() => {
        const fetchUserAndRedirect = async () => {
            if (auth.isLoading === false && !auth.user) {
                navigate('/login');
            } else if (auth.isLoading === false && auth.isVerified === false) {
                navigate('/user/verify');
            }
        };
        fetchUserAndRedirect();
    }, [auth.isLoading]);

    if (auth.isLoading) {
        return <Loading centered={true} size={'large'} />;
    }

    return auth.user &&
        <>
            <button
                onClick={logout}
                className=" text-white
    bg-indigo-600 hover:bg-indigo-700 focus:ring-4
    focus:outline-none focus:ring-indigo-300 font-medium
rounded-lg text-sm px-5 py-2.5 text-center
dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            >
                logout
            </button>
            <hr />
            <Outlet />
        </>;
};
