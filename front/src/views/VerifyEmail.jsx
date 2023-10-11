import React, { useEffect, useState } from 'react';
import axios from '../axios';  // Import your axios instance
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [resendLoading, setResendLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(auth.isVerified) navigate('/user/dashboard');
  },[auth.user,auth.isLoading])

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      await axios.post('/email/verification-notification');
    } catch (error) {
      console.error('Error resending verification link:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <div>
        Your email is not verified. Please verify your email to proceed.
      </div>
      <div>
        If you haven't received an email, click the button below to request a new verification email.
      </div>
      <button
        className={`bg-transparent font-semibold hover:bg-indigo-600 hover:text-white py-2 px-4 border hover:border-transparent  rounded border-indigo-600 text-indigo-600 p-3 ${resendLoading ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={handleResendVerification}
        disabled={resendLoading}
      >
        {resendLoading ? 'Resending...' : 'Resend Verification'}
      </button>
    </>
  );
};

export default VerifyEmail;
