/**
 * SecurePass Pro JavaScript SDK
 * Simple, secure password generation and API integration
 */

class SecurePassSDK {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    // Use actual deployed URL or allow custom baseURL
    this.baseURL = options.baseURL || (typeof window !== 'undefined' 
      ? `${window.location.origin}/api` 
      : 'https://securepasspro.com/api');
    this.timeout = options.timeout || 10000;
    
    // Security: Validate API key format (should start with spro_ for enterprise)
    if (!this.apiKey || typeof this.apiKey !== 'string' || this.apiKey.length < 10) {
      throw new Error('Invalid API key provided');
    }
  }

  /**
   * Generate a secure password
   * @param {Object} options - Password generation options
   * @returns {Promise<Object>} Generated password data
   */
  async generatePassword(options = {}) {
    try {
      const length = Math.min(Math.max(options.length || 16, 8), 64); // Secure limits
      const response = await this._makeRequest('/password', {
        method: 'POST',
        body: JSON.stringify({
          length: length,
          includeUppercase: options.includeUppercase !== false,
          includeLowercase: options.includeLowercase !== false,
          includeNumbers: options.includeNumbers !== false,
          includeSymbols: options.includeSymbols !== false
        })
      });

      return response;
    } catch (error) {
      throw new Error(`Password generation failed: ${error.message}`);
    }
  }

  /**
   * Generate multiple passwords (bulk)
   * @param {number} count - Number of passwords to generate
   * @param {Object} options - Password generation options
   * @returns {Promise<Object>} Bulk password data
   */
  async generateBulkPasswords(count, options = {}) {
    // Security: Limit bulk generation
    const maxCount = Math.min(count, 1000);
    const length = Math.min(Math.max(options.length || 16, 8), 64);
    
    try {
      const response = await this._makeRequest(`/generate-bulk?count=${maxCount}&length=${length}`, {
        method: 'POST'
      });

      return response;
    } catch (error) {
      throw new Error(`Bulk password generation failed: ${error.message}`);
    }
  }

  /**
   * Get team information
   * @param {string} teamId - Team ID
   * @returns {Promise<Object>} Team data
   */
  async getTeamInfo(teamId) {
    try {
      const response = await this._makeRequest(`/team?teamId=${teamId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to get team info: ${error.message}`);
    }
  }

  /**
   * Add team member
   * @param {string} teamId - Team ID
   * @param {string} memberEmail - Member email
   * @param {string} role - Member role (admin, member)
   * @returns {Promise<Object>} Operation result
   */
  async addTeamMember(teamId, memberEmail, role = 'member') {
    try {
      const response = await this._makeRequest('/team', {
        method: 'POST',
        body: JSON.stringify({
          action: 'add_member',
          teamId,
          memberEmail,
          role
        })
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to add team member: ${error.message}`);
    }
  }

  /**
   * Remove team member
   * @param {string} teamId - Team ID
   * @param {string} memberEmail - Member email
   * @returns {Promise<Object>} Operation result
   */
  async removeTeamMember(teamId, memberEmail) {
    try {
      const response = await this._makeRequest('/team', {
        method: 'POST',
        body: JSON.stringify({
          action: 'remove_member',
          teamId,
          memberEmail
        })
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to remove team member: ${error.message}`);
    }
  }

  /**
   * Update team member role
   * @param {string} teamId - Team ID
   * @param {string} memberEmail - Member email
   * @param {string} role - New role
   * @returns {Promise<Object>} Operation result
   */
  async updateTeamMemberRole(teamId, memberEmail, role) {
    try {
      const response = await this._makeRequest('/team', {
        method: 'POST',
        body: JSON.stringify({
          action: 'update_role',
          teamId,
          memberEmail,
          role
        })
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to update team member role: ${error.message}`);
    }
  }


  /**
   * Test API connection
   * @returns {Promise<Object>} Connection status
   */
  async testConnection() {
    try {
      const response = await this._makeRequest('/test');
      return { success: true, message: 'API connection successful', data: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Get user usage statistics
   * @returns {Promise<Object>} Usage data
   */
  async getUsage() {
    try {
      const response = await this._makeRequest('/user', {
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to get usage data: ${error.message}`);
    }
  }

  /**
   * Secure HTTP request handler
   * @private
   */
  async _makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Security: Input validation
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint');
    }

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'User-Agent': 'SecurePass-SDK/1.0.0'
      },
      timeout: this.timeout,
      ...options
    };

    // Security: Add request body if provided
    if (options.body) {
      config.body = options.body;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurePassSDK;
} else if (typeof window !== 'undefined') {
  window.SecurePassSDK = SecurePassSDK;
}

export default SecurePassSDK; 