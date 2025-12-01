import axios from 'axios';
import { CONFIG } from '../config/constants';
import { ChatResponse, HealthResponse, MenuItem, MenuResponse } from '../types';

const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Ensure response is treated as JSON
  responseType: 'json',
  // Transform response to ensure it's parsed correctly
  transformResponse: [(data) => {
    // If data is already an object, return it
    if (typeof data === 'object') {
      return data;
    }
    // If it's a string, try to parse it as JSON
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        // If parsing fails, return the string (might be HTML)
        return data;
      }
    }
    return data;
  }],
});

export const chatAPI = {
  processMessage: async (
    message: string,
    parentMenuId?: string | null,
    previousMenuItems?: MenuItem[] | null
  ): Promise<ChatResponse> => {
    try {
      console.log('Sending request to:', `${CONFIG.API_BASE_URL}/api/chat/process`);
      console.log('Request payload:', { message, parentMenuId, previousMenuItems });
      
      // Use fetch as a fallback since axios might have issues with React Native
      // Build URL with query parameter - ensure no trailing slash issues
      const baseUrl = CONFIG.API_BASE_URL.endsWith('/') 
        ? CONFIG.API_BASE_URL.slice(0, -1) 
        : CONFIG.API_BASE_URL;
      const apiPath = '/api/chat/process';
      
      // Build query parameters
      const params = new URLSearchParams({
        message: message,
      });
      
      // Add parentMenuId if available
      if (parentMenuId) {
        params.append('parentMenuId', parentMenuId);
      }
      
      // Add previousMenuItems if available (as JSON string)
      if (previousMenuItems && previousMenuItems.length > 0) {
        params.append('previousMenuItems', JSON.stringify(previousMenuItems));
      }
      
      const url = `${baseUrl}${apiPath}?${params.toString()}`;
      
      console.log('=== API Request Debug ===');
      console.log('Base URL:', CONFIG.API_BASE_URL);
      console.log('Cleaned Base URL:', baseUrl);
      console.log('Full GET URL:', url);
      console.log('Message:', message);
      console.log('Encoded message:', encodeURIComponent(message));
      console.log('Parent Menu ID:', parentMenuId);
      console.log('Previous Menu Items:', previousMenuItems);
      
      // Try using fetch first (more reliable in React Native)
      const fetchResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Fetch response status:', fetchResponse.status);
      console.log('Fetch response statusText:', fetchResponse.statusText);
      console.log('Fetch response URL:', fetchResponse.url);
      console.log('Fetch response headers:', Object.fromEntries(fetchResponse.headers.entries()));
      
      console.log('Fetch response status:', fetchResponse.status);
      console.log('Fetch response statusText:', fetchResponse.statusText);
      console.log('Fetch response URL (after redirects):', fetchResponse.url);
      console.log('Fetch response Content-Type:', fetchResponse.headers.get('content-type'));
      console.log('Fetch response headers:', Object.fromEntries(fetchResponse.headers.entries()));
      
      // Check if URL was redirected
      if (fetchResponse.url !== url) {
        console.warn('WARNING: URL was redirected!');
        console.warn('Original URL:', url);
        console.warn('Redirected to:', fetchResponse.url);
      }
      
      const contentType = fetchResponse.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await fetchResponse.text();
        console.error('ERROR: Server returned non-JSON response');
        console.error('Request URL:', url);
        console.error('Response URL:', fetchResponse.url);
        console.error('Status:', fetchResponse.status);
        console.error('Content-Type:', contentType);
        console.error('Response (first 1000 chars):', text.substring(0, 1000));
        
        // Check if it's an error page
        if (fetchResponse.status === 404) {
          throw new Error(`API endpoint not found (404). Check if the route exists at: ${url}`);
        } else if (fetchResponse.status >= 500) {
          throw new Error(`Server error (${fetchResponse.status}). The API server may be experiencing issues.`);
        } else if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          throw new Error(`Server returned HTML page instead of JSON. The endpoint may not be accessible or there's a routing issue. Response URL: ${fetchResponse.url}`);
        }
        
        throw new Error(`Server returned ${contentType} instead of JSON. Status: ${fetchResponse.status}`);
      }
      
      const responseData = await fetchResponse.json();
      console.log('Fetch response data:', JSON.stringify(responseData, null, 2));
      
      // Convert fetch response to axios-like response format
      const response = {
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        data: responseData,
        headers: Object.fromEntries(fetchResponse.headers.entries()),
      };
      
      console.log('GET request successful:', response.status);
      console.log('Response headers:', JSON.stringify(response.headers, null, 2));
      console.log('Response Content-Type:', response.headers['content-type']);
      console.log('Response data type:', typeof response.data);
      console.log('Response data is string?', typeof response.data === 'string');
      console.log('Response data (first 200 chars):', typeof response.data === 'string' 
        ? response.data.substring(0, 200) 
        : JSON.stringify(response.data, null, 2));
      
      // Validate response structure
      if (!response.data) {
        console.error('ERROR: Empty response.data');
        throw new Error('Empty response from server');
      }
      
      // Check if response is HTML (error page) instead of JSON
      if (typeof response.data === 'string' && (response.data.includes('<!DOCTYPE') || response.data.includes('<html'))) {
        console.error('ERROR: Received HTML instead of JSON. This might be an error page.');
        console.error('HTML response (first 500 chars):', response.data.substring(0, 500));
        throw new Error('Server returned HTML instead of JSON. The API endpoint may not be accessible.');
      }
      
      // responseData is already set from fetchResponse.json() above
      // Log the structure to debug
      console.log('Response data.response:', responseData.response);
      console.log('Response data.response type:', typeof responseData.response);
      console.log('Response data.success:', responseData.success);
      console.log('Response data.menuItems:', responseData.menuItems);
      console.log('All response data fields:', Object.keys(responseData));
      
      // Ensure we have a valid response structure
      // The API returns: { success: true, response: string, menuItems?: [], timestamp: string }
      let responseText = '';
      
      // Check for response field with more lenient checking
      if ('response' in responseData) {
        if (responseData.response !== undefined && responseData.response !== null) {
          if (typeof responseData.response === 'string') {
            responseText = responseData.response;
          } else {
            console.warn('Response.response is not a string, converting:', responseData.response);
            responseText = String(responseData.response);
          }
        } else {
          console.warn('Response.response exists but is null/undefined');
        }
      } else {
        // Response field doesn't exist - log everything to debug
        console.error('ERROR: Missing response field in API response');
        console.error('Response data type:', typeof responseData);
        console.error('Response data is array?', Array.isArray(responseData));
        console.error('Full response data:', JSON.stringify(responseData, null, 2));
        console.error('Response data keys:', Object.keys(responseData));
        
        // Try to find the message in alternative fields
        if (responseData.message) {
          console.warn('Found message field instead of response, using that');
          responseText = String(responseData.message);
        } else if (responseData.text) {
          console.warn('Found text field instead of response, using that');
          responseText = String(responseData.text);
        } else {
          throw new Error('Invalid response format: missing response field. Check console for full response data.');
        }
      }
      
      // Ensure success field exists, default to true if response has data
      const chatResponse: ChatResponse = {
        success: responseData.success !== undefined ? responseData.success : true,
        response: responseText,
        menuItems: responseData.menuItems || undefined,
        timestamp: responseData.timestamp || new Date().toISOString(),
        parentMenuId: responseData.parentMenuId !== undefined ? responseData.parentMenuId : null,
        menuContext: responseData.menuContext || undefined,
      };
      
      console.log('Processed chat response:', JSON.stringify(chatResponse, null, 2));
      console.log('Parent Menu ID from response:', chatResponse.parentMenuId);
      console.log('Menu Context from response:', chatResponse.menuContext);
      return chatResponse;
    } catch (error) {
      // Log the full error for debugging
      console.error('Full error object:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      
      if (axios.isAxiosError(error)) {
        console.log('Error is Axios error');
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const errorData = error.response.data;
          
          console.error('API Error Response:', {
            status: status,
            statusText: error.response.statusText,
            data: errorData,
            url: `${CONFIG.API_BASE_URL}/api/chat/process`,
            headers: error.response.headers,
          });
          
          // Handle specific error codes
          if (status === 401) {
            throw new Error('Authentication required. Please check API configuration.');
          } else if (status === 403) {
            throw new Error('Access forbidden. You may not have permission to access this endpoint.');
          } else if (status === 404) {
            throw new Error(`API endpoint not found. Please verify the endpoint path: ${CONFIG.API_BASE_URL}/api/chat/process`);
          } else if (status === 405) {
            throw new Error(`Method not allowed. The endpoint may not support POST requests or the path is incorrect.`);
          } else if (status >= 500) {
            throw new Error(`Server error (${status}). The API server may be experiencing issues.`);
          }
          
          // Try to extract detailed error message
          const errorMessage = 
            errorData?.error || 
            errorData?.message || 
            errorData?.detail ||
            (typeof errorData === 'string' ? errorData.substring(0, 200) : null) ||
            `Server error (${status}): ${error.response.statusText}`;
          
          throw new Error(errorMessage);
        } else if (error.request) {
          // Request made but no response received
          console.error('Network error details:', {
            url: `${CONFIG.API_BASE_URL}/api/chat/process`,
            message: error.message,
            code: error.code,
          });
          throw new Error(
            `Network error. Cannot reach ${CONFIG.API_BASE_URL}. Please check your connection and ensure the backend is running.`
          );
        } else {
          console.error('Axios error without response or request:', error.message);
          throw new Error(`Request setup error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        // It's a regular Error object
        console.error('Regular Error:', error.message);
        throw error; // Re-throw the original error
      } else {
        // Unknown error type
        console.error('Unknown error type:', error);
        throw new Error(`Unexpected error: ${String(error)}`);
      }
    }
  },

  getMenu: async (): Promise<MenuResponse> => {
    try {
      const response = await apiClient.get<MenuResponse>('/api/chat/menu');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            error.response.data?.error || error.response.data?.message || 'Failed to get menu'
          );
        } else if (error.request) {
          throw new Error('Network error. Please check your connection.');
        }
      }
      throw new Error('An unexpected error occurred');
    }
  },

  healthCheck: async (): Promise<HealthResponse> => {
    try {
      const response = await apiClient.get<HealthResponse>('/api/chat/health');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            error.response.data?.error || error.response.data?.message || 'Health check failed'
          );
        } else if (error.request) {
          throw new Error('Network error. Please check your connection.');
        }
      }
      throw new Error('An unexpected error occurred');
    }
  },

  // Test function to verify API connectivity
  testConnection: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.get('/api/chat/health');
      return { success: true, message: 'API connection successful' };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = status 
          ? `API returned status ${status}. Endpoint may not be configured correctly.`
          : 'Cannot reach API. Check your network connection.';
        return { success: false, message };
      }
      return { success: false, message: 'Unknown error occurred' };
    }
  },
};

