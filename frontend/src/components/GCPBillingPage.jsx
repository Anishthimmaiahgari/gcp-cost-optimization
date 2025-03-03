import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CloudService from '../services/CloudService';

function GCPBillingPage() {
  const [billingData, setBillingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const navigate = useNavigate();

  useEffect(() => {
    // Check if authenticated with GCP
    if (!CloudService.isGCPAuthenticated()) {
      navigate('/gcp-credentials', {
        state: { error: 'Please authenticate with GCP first' }
      });
      return;
    }

    const fetchBillingData = async () => {
      setIsLoading(true);
      try {
        const projectId = CloudService.getGCPProjectId();
        const data = await CloudService.getGCPBillingData(projectId);
        setBillingData(data);
      } catch (err) {
        console.error('Error fetching billing data:', err);
        setError(err.message || 'Failed to fetch billing data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, [navigate]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Define color themes
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const cardBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const headerBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const secondaryTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  // Calculate month-over-month change for billing
  const calculateChange = () => {
    if (!billingData) return null;
    
    const currentTotal = billingData.billing.current_month.total;
    const previousTotal = billingData.billing.previous_month.total;
    const change = ((currentTotal - previousTotal) / previousTotal) * 100;
    
    return {
      value: change.toFixed(1),
      isIncrease: change > 0
    };
  };

  const changeData = calculateChange();

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
            <h1 className="text-2xl font-bold">GCP Billing & Resource Optimization</h1>
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
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'} p-4 rounded mb-4`}>
            {error}
          </div>
        ) : billingData && (
          <div className="space-y-6">
            {/* Project Info */}
            <div className={`${cardBgColor} rounded-lg shadow p-6 border ${borderColor}`}>
              <div className="flex items-center mb-2">
                <img 
                  src="https://static-00.iconduck.com/assets.00/google-cloud-icon-2048x1646-7admxejz.png" 
                  alt="Google Cloud Platform" 
                  className="w-8 h-8 object-contain mr-2"
                />
                <h2 className="text-xl font-semibold">
                  Project: {CloudService.getGCPProjectId()}
                </h2>
              </div>
            </div>
            
            {/* Billing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${cardBgColor} rounded-lg shadow p-6 border ${borderColor}`}>
                <h2 className="text-xl font-semibold mb-4">Billing Summary</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className={`text-sm ${secondaryTextColor}`}>Current Month</p>
                      <p className="text-3xl font-bold">${billingData.billing.current_month.total.toFixed(2)}</p>
                    </div>
                    {changeData && (
                      <div className={`text-right ${changeData.isIncrease ? 'text-red-500' : 'text-green-500'}`}>
                        <p className="text-sm">vs Last Month</p>
                        <p className="text-lg font-medium">
                          {changeData.isIncrease ? '+' : ''}{changeData.value}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-2">Cost by Service</h3>
                <div className="space-y-3">
                  {billingData.billing.current_month.by_service.map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <p className={secondaryTextColor}>{service.name}</p>
                      <p className="font-medium">${service.cost.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Potential Savings */}
              <div className={`${cardBgColor} rounded-lg shadow p-6 border ${borderColor}`}>
                <h2 className="text-xl font-semibold mb-4">Potential Savings</h2>
                <div className="mb-6">
                  <div className="text-center">
                    <p className={`text-sm ${secondaryTextColor}`}>Monthly Savings Opportunity</p>
                    <p className="text-3xl font-bold text-green-500">${billingData.potential_savings.toFixed(2)}</p>
                    <p className={`text-sm ${secondaryTextColor} mt-1`}>
                      {((billingData.potential_savings / billingData.billing.current_month.total) * 100).toFixed(1)}% of current spend
                    </p>
                  </div>
                </div>
                
                <div className="bg-green-900 bg-opacity-20 rounded p-4 border border-green-700">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-green-400">Optimization Recommendation</h3>
                      <p className={`text-sm ${secondaryTextColor}`}>
                        Implementing the recommendations below could reduce your monthly GCP costs by up to ${billingData.potential_savings.toFixed(2)}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Unused Resources */}
            <div className={`${cardBgColor} rounded-lg shadow p-6 border ${borderColor}`}>
              <h2 className="text-xl font-semibold mb-4">Unused Resources</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Resource</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Used</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Monthly Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {billingData.unused_resources.map((resource, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-800 bg-opacity-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{resource.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{resource.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{resource.region}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            resource.status === 'idle' ? 'bg-yellow-900 text-yellow-300' :
                            resource.status === 'unused' || resource.status === 'unattached' ? 'bg-red-900 text-red-300' :
                            'bg-blue-900 text-blue-300'
                          }`}>
                            {resource.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{resource.last_used}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${resource.monthly_cost.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{resource.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default GCPBillingPage;