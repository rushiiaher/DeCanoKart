import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const PasswordReset = ({ onClose, switchToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword, confirmPasswordReset } = useAuth();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    const result = await resetPassword(email);
    if (result.success) {
      setResetToken(result.resetToken);
      setMessage('Reset token generated. In production, check your email.');
      setStep(2);
    } else {
      setError(result.error);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    const result = await confirmPasswordReset(resetToken, newPassword);
    if (result.success) {
      setMessage('Password reset successful!');
      setTimeout(() => switchToLogin(), 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <h2>Password Reset</h2>
      {step === 1 ? (
        <form onSubmit={handleRequestReset}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Token</button>
        </form>
      ) : (
        <form onSubmit={handleConfirmReset}>
          <input
            type="text"
            placeholder="Reset Token"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <p>
        <button onClick={switchToLogin}>Back to Login</button>
      </p>
    </div>
  );
};

export default PasswordReset;