import axios from 'axios';

const BASE_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_MREF_BASE_URL;
const USERNAME = import.meta.env.VITE_MREF_USERNAME;
const PASSWORD = import.meta.env.VITE_MREF_PASSWORD;

// Store session globally
let sessionId = null;

/**
 * Authenticate with MREF and create JSESSION
 */
export const login = async () => {
  try {
    console.log('🔐 Attempting authentication...');
    
    const response = await axios.post(
      `${BASE_URL}/p/websignon/signon`,
      {
        userName: USERNAME,
        password: PASSWORD
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Authentication response received:', response.status);
    console.log('📋 Response headers:', response.headers);
    console.log('📋 Response data:', response.data);

    // Try to extract JSESSIONID from various sources
    
    // Method 1: From Set-Cookie header
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      console.log('🍪 Set-Cookie header found:', setCookieHeader);
      const jsessionCookie = Array.isArray(setCookieHeader) 
        ? setCookieHeader.find(cookie => cookie.includes('JSESSIONID'))
        : setCookieHeader.includes('JSESSIONID') ? setCookieHeader : null;
        
      if (jsessionCookie) {
        const match = jsessionCookie.match(/JSESSIONID=([^;]+)/);
        if (match) {
          sessionId = match[1];
          console.log('✅ JSESSIONID captured from Set-Cookie:', sessionId);
        }
      }
    }

    // Method 2: Check if browser stored it automatically
    if (!sessionId) {
      const cookies = document.cookie;
      console.log('🍪 Document cookies:', cookies);
      const match = cookies.match(/JSESSIONID=([^;]+)/);
      if (match) {
        sessionId = match[1];
        console.log('✅ JSESSIONID found in document.cookie:', sessionId);
      }
    }

    // Method 3: From response data
    if (!sessionId && response.data?.sessionId) {
      sessionId = response.data.sessionId;
      console.log('✅ JSESSIONID from response data:', sessionId);
    }

    if (!sessionId) {
      console.warn('⚠️ JSESSIONID not found - authentication may have failed');
      console.log('💡 Tip: Check if credentials are correct in .env file');
    }

    return {
      success: !!sessionId || response.status === 200,
      sessionId,
      message: sessionId ? 'Authentication successful' : 'Authentication completed but no session ID'
    };
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.error('📋 Error response:', error.response?.data);
    console.error('📋 Error status:', error.response?.status);
    
    return {
      success: false,
      error: error.message,
      message: 'Authentication failed - check credentials'
    };
  }
};

/**
 * Get current session ID
 */
export const getSessionId = () => sessionId;

/**
 * Check if session exists
 */
export const hasSession = () => !!sessionId;

/**
 * Clear session
 */
export const clearSession = () => {
  sessionId = null;
};

/**
 * Create authenticated session automatically
 */
export const createSession = async () => {
  if (hasSession()) {
    console.log('✅ Session already exists:', sessionId);
    return { success: true, sessionId };
  }

  console.log('🔐 Creating new session...');
  return await login();
};

// Made with Bob
