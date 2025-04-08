import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    try {
      await axios.post('/api/auth/send-otp', { email });
      setStep(2);
    } catch (err) {
      alert('OTP send failed');
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post('/api/auth/reset-password', { email, otp, newPassword });
      alert('Password changed');
      setStep(1);
    } catch (err) {
      alert('Invalid OTP or error');
    }
  };

  return (
    <div className="auth-box">
      <h2>Forgot Password</h2>
      {step === 1 ? (
        <>
          <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
          <input placeholder="New Password" type="password" onChange={e => setNewPassword(e.target.value)} />
          <button onClick={verifyOtp}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
