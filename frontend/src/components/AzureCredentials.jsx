// src/components/AzureCredentials.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AzureCredentials() {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!secretKey) {
      setError('Secret Key is required');
      return;
    }
    
    // In a real app, you would handle the credentials securely
    console.log('Azure secret key submitted');
    
    // Redirect to dashboard or next step
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Bilvantis Logo */}
            <img 
              src="https://bilvantis.io/wp-content/uploads/2022/12/Bilvantis-logo-png.jpg" 
              alt="Bilvantis Logo" 
              className="h-8 mr-3 rounded"
            />
            <h1 className="text-2xl font-bold text-white">Azure Configuration</h1>
          </div>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
          <div className="flex items-center justify-center mb-6">
            {/* Azure Logo */}
            <img 
                  src="https://img.icons8.com/color/512/azure-1.png" 
                  alt="Microsoft Azure Platform" 
                  className="w-16 h-16 object-contain"
                />
            {/* Company Logo */}
          </div>
          
          <h2 className="text-xl font-semibold mb-4 text-center">Enter Azure Secret Key</h2>
          
          {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="secretKey">Secret Key</label>
              <input
                id="secretKey"
                type="password"
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your Azure secret key"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded"
              >
                Connect to Azure
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AzureCredentials;