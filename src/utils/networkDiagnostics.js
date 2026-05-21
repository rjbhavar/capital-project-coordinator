/**
 * Network Diagnostics Utilities
 * 
 * Provides functions to test connectivity and diagnose network issues
 * with the MREF server.
 */

import axios from 'axios';

/**
 * Test if MREF host is reachable
 * @returns {Promise<{success: boolean, message: string, timestamp: string}>}
 */
export async function testHostReachability() {
  const timestamp = new Date().toISOString();
  
  try {
    // Try to reach the base URL
    const response = await axios.get('/api/', {
      timeout: 5000,
      validateStatus: () => true // Accept any status
    });
    
    return {
      success: response.status < 500,
      message: `Host reachable (Status: ${response.status})`,
      timestamp,
      status: response.status
    };
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      return {
        success: false,
        message: 'DNS resolution failed - VPN not connected',
        timestamp,
        error: error.code
      };
    }
    
    if (error.code === 'EADDRNOTAVAIL') {
      return {
        success: false,
        message: 'Network address not available - Check VPN',
        timestamp,
        error: error.code
      };
    }
    
    if (error.code === 'ETIMEDOUT') {
      return {
        success: false,
        message: 'Connection timeout - Check network',
        timestamp,
        error: error.code
      };
    }
    
    return {
      success: false,
      message: `Connection failed: ${error.message}`,
      timestamp,
      error: error.code || 'UNKNOWN'
    };
  }
}

/**
 * Test authentication endpoint
 * @returns {Promise<{success: boolean, message: string, timestamp: string}>}
 */
export async function testAuthEndpoint() {
  const timestamp = new Date().toISOString();
  
  try {
    const response = await axios.post(
      '/api/p/websignon/signon',
      new URLSearchParams({
        username: import.meta.env.VITE_MREF_USERNAME || 'test',
        password: import.meta.env.VITE_MREF_PASSWORD || 'test'
      }),
      {
        timeout: 10000,
        withCredentials: true,
        validateStatus: () => true
      }
    );
    
    if (response.status === 200) {
      return {
        success: true,
        message: 'Authentication endpoint reachable',
        timestamp,
        status: response.status
      };
    }
    
    if (response.status === 401) {
      return {
        success: false,
        message: 'Authentication failed - Check credentials',
        timestamp,
        status: response.status
      };
    }
    
    return {
      success: false,
      message: `Unexpected status: ${response.status}`,
      timestamp,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      message: `Auth endpoint test failed: ${error.message}`,
      timestamp,
      error: error.code || 'UNKNOWN'
    };
  }
}

/**
 * Test capital project endpoint
 * @returns {Promise<{success: boolean, message: string, timestamp: string}>}
 */
export async function testCapitalProjectEndpoint() {
  const timestamp = new Date().toISOString();
  
  try {
    const response = await axios.get('/api/oslc/so/cstCapitalProjectRS', {
      timeout: 10000,
      withCredentials: true,
      validateStatus: () => true
    });
    
    if (response.status === 200) {
      const hasData = response.data && response.data['rdfs:member'];
      return {
        success: true,
        message: hasData 
          ? `Data endpoint working (${response.data['rdfs:member'].length} projects)`
          : 'Data endpoint reachable but no data',
        timestamp,
        status: response.status,
        dataCount: hasData ? response.data['rdfs:member'].length : 0
      };
    }
    
    if (response.status === 401) {
      return {
        success: false,
        message: 'Unauthorized - Session expired or not authenticated',
        timestamp,
        status: response.status
      };
    }
    
    return {
      success: false,
      message: `Unexpected status: ${response.status}`,
      timestamp,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      message: `Data endpoint test failed: ${error.message}`,
      timestamp,
      error: error.code || 'UNKNOWN'
    };
  }
}

/**
 * Get overall connection status
 * @returns {Promise<{overall: string, tests: Object, timestamp: string}>}
 */
export async function getConnectionStatus() {
  const timestamp = new Date().toISOString();
  
  const hostTest = await testHostReachability();
  
  let authTest = { success: false, message: 'Skipped - host unreachable' };
  let dataTest = { success: false, message: 'Skipped - host unreachable' };
  
  if (hostTest.success) {
    authTest = await testAuthEndpoint();
    
    if (authTest.success) {
      dataTest = await testCapitalProjectEndpoint();
    }
  }
  
  const allSuccess = hostTest.success && authTest.success && dataTest.success;
  const someSuccess = hostTest.success || authTest.success || dataTest.success;
  
  return {
    overall: allSuccess ? 'Connected' : someSuccess ? 'Partial' : 'Disconnected',
    tests: {
      host: hostTest,
      auth: authTest,
      data: dataTest
    },
    timestamp
  };
}

/**
 * Get session information
 * @returns {Object} Session details
 */
export function getSessionInfo() {
  // Note: Cannot access HttpOnly cookies from JavaScript
  // This returns what we can determine
  return {
    cookieAccessible: false,
    note: 'JSESSIONID is HttpOnly - managed by browser',
    withCredentials: true,
    proxyConfigured: true,
    baseUrl: import.meta.env.VITE_MREF_BASE_URL || 'Not configured'
  };
}

/**
 * Validate environment configuration
 * @returns {Object} Validation results
 */
export function validateEnvironment() {
  const checks = {
    baseUrl: {
      configured: !!import.meta.env.VITE_MREF_BASE_URL,
      value: import.meta.env.VITE_MREF_BASE_URL || 'Missing'
    },
    username: {
      configured: !!import.meta.env.VITE_MREF_USERNAME,
      value: import.meta.env.VITE_MREF_USERNAME ? '***' : 'Missing'
    },
    password: {
      configured: !!import.meta.env.VITE_MREF_PASSWORD,
      value: import.meta.env.VITE_MREF_PASSWORD ? '***' : 'Missing'
    },
    useMockData: {
      configured: import.meta.env.VITE_USE_MOCK_DATA !== undefined,
      value: import.meta.env.VITE_USE_MOCK_DATA || 'false'
    }
  };
  
  const allConfigured = Object.values(checks).every(check => check.configured);
  
  return {
    valid: allConfigured,
    checks,
    message: allConfigured 
      ? 'Environment fully configured' 
      : 'Missing required environment variables'
  };
}

// Made with Bob
