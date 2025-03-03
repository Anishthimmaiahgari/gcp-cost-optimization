// SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const success = AuthService.signup(name, email, password);
    if (success) {
      navigate('/signin');
    } else {
      setError('Signup failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white"
         style={{
           backgroundImage: 'url("https://www.shutterstock.com/image-vector/abstract-gradient-wave-particles-big-600nw-1930623710.jpg")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
    }}>
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
           
        <div className="flex justify-center mb-6">
          {/* Bilvantis Logo */}
          <img 
            src="https://bilvantis.io/wp-content/uploads/2022/12/Bilvantis-logo-png.jpg" 
            alt="Bilvantis Logo" 
            className="h-16 rounded"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        
        {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
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
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400">Already have an account? <a href="#/signin" className="text-blue-400 hover:text-blue-300">Sign In</a></p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;