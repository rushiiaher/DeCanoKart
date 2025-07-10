import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { API_CONFIG } from '../utils/apiConfig';

const Login = ({ onClose, switchToRegister, switchToReset }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('customer');
  const [showSellerSignup, setShowSellerSignup] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSellerRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_CONFIG.getUrl('seller/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('storage'));
        onClose();
        window.location.reload();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {loginType === 'customer' ? 'Welcome Back!' : showSellerSignup ? 'Join as Seller' : 'Seller Portal'}
        </h1>
      </div>

      {/* Account Type Tabs */}
      <div className="flex bg-base-200 rounded-xl p-1 mb-8">
        <button 
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            loginType === 'customer' 
              ? 'bg-white shadow-sm text-primary' 
              : 'text-base-content/60 hover:text-base-content'
          }`}
          onClick={() => setLoginType('customer')}
        >
          👤 Customer
        </button>
        <button 
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            loginType === 'seller' 
              ? 'bg-white shadow-sm text-primary' 
              : 'text-base-content/60 hover:text-base-content'
          }`}
          onClick={() => setLoginType('seller')}
        >
          🏪 Seller
        </button>
      </div>
      
      <form onSubmit={showSellerSignup ? handleSellerRegister : handleSubmit} className="space-y-6">
        {showSellerSignup && loginType === 'seller' && (
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
        )}
        
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-primary w-full btn-lg ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? '' : showSellerSignup ? '🚀 Create Seller Account' : `🔐 Sign In as ${loginType === 'customer' ? 'Customer' : 'Seller'}`}
        </button>
      </form>
      
      {loginType === 'seller' && !showSellerSignup && (
        <>
          <div className="divider my-6">OR</div>
          <button 
            type="button"
            className="btn btn-outline btn-warning w-full"
            onClick={() => setShowSellerSignup(true)}
          >
            ✨ Sign Up as New Seller
          </button>
        </>
      )}
      
      {loginType === 'seller' && showSellerSignup && (
        <button 
          type="button"
          className="btn btn-ghost w-full mt-4"
          onClick={() => setShowSellerSignup(false)}
        >
          ← Back to Login
        </button>
      )}
      
      {error && (
        <div className="alert alert-error mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {loginType === 'customer' && (
        <div className="text-center mt-8 space-y-3">
          <p className="text-base-content/60">
            Don't have an account?{' '}
            <button 
              onClick={switchToRegister}
              className="link link-primary font-semibold hover:link-hover"
            >
              Sign up here
            </button>
          </p>
          <button 
            onClick={switchToReset}
            className="link link-primary text-sm hover:link-hover"
          >
            Forgot your password?
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;