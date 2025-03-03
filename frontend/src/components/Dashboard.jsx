// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';
import CloudService from '../services/CloudService'; // Add this import

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [cloudProviders, setCloudProviders] = useState({
    aws: false,
    gcp: false,
    azure: false
  });
  
  useEffect(() => {
    // Check for messages from redirects
    if (location.state && location.state.message) {
      setNotification({
        message: location.state.message,
        type: 'success'
      });
      
      // Clear the location state after reading
      window.history.replaceState({}, document.title);
    }
    
    // Check cloud providers authentication status
    setCloudProviders({
      aws: localStorage.getItem('aws_authenticated') === 'true',
      gcp: CloudService.isGCPAuthenticated(),
      azure: localStorage.getItem('azure_authenticated') === 'true'
    });
  }, [location]);
  
  const handleSignOut = () => {
    // Clear all authentication data
    AuthService.logout();
    CloudService.clearGCPAuth();
    localStorage.removeItem('aws_authenticated');
    localStorage.removeItem('azure_authenticated');
    
    navigate('/signin');
  };

  const handleSelectAWS = () => {
    navigate('/aws-credentials');
  };

  const handleSelectGCP = () => {
    navigate('/gcp-credentials');
  };

  const handleSelectAzure = () => {
    navigate('/azure-credentials');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white"
         style={{
           backgroundImage: 'url("https://media.istockphoto.com/id/1322466487/vector/cloud-computing-concept.jpg?s=612x612&w=0&k=20&c=H0VAiRtNTB4p9UozELCX5OGiWZgTMaLXNVmh1EXQmvw=")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
    }}>
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Bilvantis Logo */}
            <img 
              src="https://bilvantis.io/wp-content/uploads/2022/12/Bilvantis-logo-png.jpg" 
              alt="Bilvantis Logo" 
              className="h-8 mr-3 rounded"
            />
            <h1 className="text-2xl font-bold text-white">Cloud Dashboard</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-200">Select Cloud Provider</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AWS Card */}
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow border border-gray-700">
            <div className="p-6">
              <div className="flex justify-center mb-4">
              <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS-HsLcwh4VPToCAUJq1_YO8zvUeXWzqer8A&s" 
                  alt="Amazon Web Services" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-center text-white">AWS</h3>
              <p className="mt-2 text-gray-400 text-center">Amazon Web Services</p>
              <button 
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
                onClick={handleSelectAWS}
              >
                Select AWS
              </button>
            </div>
          </div>
          
          {/* GCP Card */}
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow border border-gray-700">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <img 
                  src="https://static-00.iconduck.com/assets.00/google-cloud-icon-2048x1646-7admxejz.png" 
                  alt="Google Cloud Platform" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-center text-white">GCP</h3>
              <p className="mt-2 text-gray-400 text-center">Google Cloud Platform</p>
              <button 
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                onClick={handleSelectGCP}
              >
                Select GCP
              </button>
            </div>
          </div>
          
          {/* Azure Card */}
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow border border-gray-700">
            <div className="p-6">
              <div className="flex justify-center mb-4">
              <img 
                  src="https://img.icons8.com/color/512/azure-1.png" 
                  alt="Microsoft Azure Platform" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-center text-white">Azure</h3>
              <p className="mt-2 text-gray-400 text-center">Microsoft Azure Platform</p>
              <button 
                className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded"
                onClick={handleSelectAzure}
              >
                Select Azure
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;