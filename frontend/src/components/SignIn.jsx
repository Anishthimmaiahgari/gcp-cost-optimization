import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    const success = AuthService.login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-gray-900 text-white"
      style={{
        backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1674811564431-4be5bd37fb6a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHdlYnNpdGUlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg bg-opacity-90">
        <div className="flex justify-center mb-6">
          {/* Bilvantis Logo */}
          <img 
            src="https://bilvantis.io/wp-content/uploads/2022/12/Bilvantis-logo-png.jpg"
            alt="Bilvantis Logo"
            className="h-16 rounded"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        
        {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400">Don't have an account? <a href="#/signup" className="text-blue-400 hover:text-blue-300">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;