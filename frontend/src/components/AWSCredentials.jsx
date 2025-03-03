// src/components/AWSCredentials.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AWSCredentials() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!accessKey || !secretKey) {
      setError('Both Access Key and Secret Access Key are required');
      return;
    }
    
    // In a real app, you would handle the credentials securely
    console.log('AWS credentials submitted:', { accessKey, secretKey });
    
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
            <h1 className="text-2xl font-bold text-white">AWS Configuration</h1>
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
            {/* AWS Logo */}
            <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS-HsLcwh4VPToCAUJq1_YO8zvUeXWzqer8A&s" 
                  alt="Amazon Web Services" 
                  className="w-16 h-16 object-contain"
                />
            {/* Company Logo */}
          </div>
          
          <h2 className="text-xl font-semibold mb-4 text-center">Enter AWS Credentials</h2>
          
          {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="accessKey">Access Key ID</label>
              <input
                id="accessKey"
                type="text"
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="AKIAIOSFODNN7EXAMPLE"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="secretKey">Secret Access Key</label>
              <input
                id="secretKey"
                type="password"
                className="w-full px-3 py-2 border rounded-lg bg-gray-700 border-gray-600 text-white"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
              >
                Connect to AWS
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AWSCredentials;