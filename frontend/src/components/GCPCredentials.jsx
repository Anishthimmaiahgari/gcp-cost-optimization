import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CloudService from '../services/CloudService';

function GCPCredentials() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's an error message from a redirect
    if (location.state && location.state.error) {
      setError(location.state.error);
    }
    
    // Check if already authenticated with GCP
    if (CloudService.isGCPAuthenticated()) {
      const projectId = CloudService.getGCPProjectId();
      console.log(`Already authenticated with GCP project: ${projectId}`);
    }
  }, [location]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
      setError('');
    } else {
      setSelectedFile(null);
      setError('Please select a valid JSON file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please upload a JSON credential file');
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    setError('');
    
    try {
      // Send the file to our backend using the cloud service
      const data = await CloudService.authenticateGCP(selectedFile);
      
      console.log('Successfully authenticated with GCP:', data);
      
      // Store authentication information
      localStorage.setItem('gcp_project_id', data.project_id);
      localStorage.setItem('gcp_authenticated', 'true');
      
      // Redirect to dashboard with success message
      navigate('/gcp-billing', {
        state: {
          message: `Successfully connected to GCP project: ${data.project_id}`,
          provider: 'gcp'
        }
      });
      
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Failed to authenticate with GCP');
    } finally {
      setIsLoading(false);
    }
  };





  const handleBack = () => {
    navigate('/dashboard');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };


  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const cardBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const headerBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const buttonHoverColor = isDarkMode ? 'hover:bg-blue-600' : 'hover:bg-blue-700';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <header className={`shadow ${headerBgColor}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Bilvantis Logo */}
            <img 
              src="https://bilvantis.io/wp-content/uploads/2022/12/Bilvantis-logo-png.jpg" 
              alt="Bilvantis Logo" 
              className="h-8 mr-3 rounded"
            />
            <h1 className="text-2xl font-bold">GCP Configuration</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-500' : 'bg-gray-600 text-white'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleBack}
              className={`px-4 py-2 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} rounded`}
            >
              Back
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className={`rounded-lg shadow p-6 border ${cardBgColor} ${borderColor}`}>
          <div className="flex items-center justify-center mb-6">
            {/* GCP Logo */}
            <div className="flex justify-center mb-4">
                <img 
                  src="https://static-00.iconduck.com/assets.00/google-cloud-icon-2048x1646-7admxejz.png" 
                  alt="Google Cloud Platform" 
                  className="w-16 h-16 object-contain"
                />
              </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4 text-center">Upload GCP JSON Credentials</h2>
          
          {error && <div className={`${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'} p-3 rounded mb-4`}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/json"
                className="hidden"
              />
              
              <div 
                className={`border-2 border-dashed ${borderColor} rounded-lg p-6 text-center cursor-pointer hover:border-blue-500`}
                onClick={triggerFileInput}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <p className="mt-1 text-sm">
                  {selectedFile ? selectedFile.name : 'Click to upload GCP JSON credentials file'}
                </p>
                <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Only JSON files are accepted
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className={`flex-1 bg-blue-500 ${buttonHoverColor} text-white py-2 rounded ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : 'Connect to GCP'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default GCPCredentials;