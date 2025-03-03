/**
 * Service for cloud provider authentication and operations
 */
class CloudService {
    constructor() {
      this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    }
  
    /**
     * Authenticate with GCP using a credentials JSON file
     * @param {File} file - The GCP credentials JSON file
     * @returns {Promise} - The authentication result
     */
    async authenticateGCP(file) {
      const formData = new FormData();
      formData.append('credential_file', file);
  
      const response = await fetch(`${this.apiBaseUrl}/authenticate/gcp`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to authenticate with GCP');
      }
  
      return response.json();
    }
  
    /**
     * Get GCP resources for the authenticated project
     * @param {string} projectId - The GCP project ID
     * @returns {Promise} - The GCP resources
     */
    async getGCPResources(projectId) {
      const response = await fetch(`${this.apiBaseUrl}/gcp/resources?project_id=${projectId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch GCP resources');
      }
  
      return response.json();
    }
  
    /**
     * Get unused GCP resources with billing information
     * @param {string} projectId - The GCP project ID
     * @returns {Promise} - The unused GCP resources with billing data
     */
    async getGCPUnusedResources(projectId) {
      const response = await fetch(`${this.apiBaseUrl}/gcp/unused-resources?project_id=${projectId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch GCP unused resources');
      }
  
      return response.json();
    }
  
    /**
     * Check if the user is authenticated with GCP
     * @returns {boolean} - Whether the user is authenticated
     */
    isGCPAuthenticated() {
      return localStorage.getItem('gcp_authenticated') === 'true';
    }
  
    /**
     * Get the authenticated GCP project ID
     * @returns {string|null} - The project ID or null if not authenticated
     */
    getGCPProjectId() {
      return localStorage.getItem('gcp_project_id');
    }
  
    /**
     * Clear GCP authentication data
     */
    clearGCPAuth() {
      localStorage.removeItem('gcp_authenticated');
      localStorage.removeItem('gcp_project_id');
    }
  }
  
  export default new CloudService();