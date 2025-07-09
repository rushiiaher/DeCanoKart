import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const Register = ({ onClose, switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    const result = await register(name, email, password);
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Join De Canokart!
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Full Name</span>
          </label>
          <input
            className="input input-bordered w-full focus:input-primary transition-colors"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Email Address</span>
          </label>
          <input
            className="input input-bordered w-full focus:input-primary transition-colors"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <input
            className="input input-bordered w-full focus:input-primary transition-colors"
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Confirm Password</span>
          </label>
          <input
            className="input input-bordered w-full focus:input-primary transition-colors"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full btn-lg ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? '' : '🎉 Create Account'}
        </button>
      </form>
      
      {error && (
        <div className="alert alert-error mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="text-center mt-8">
        <p className="text-base-content/60">
          Already have an account?{' '}
          <button 
            onClick={switchToLogin}
            className="link link-primary font-semibold hover:link-hover"
          >
            Sign in here
          </button>
        </p>
      </div>
      
      {/* Terms */}
      <div className="text-center mt-6">
        <p className="text-xs text-base-content/50">
          By creating an account, you agree to our{' '}
          <span className="link link-primary">Terms of Service</span> and{' '}
          <span className="link link-primary">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Register;