import Constants from 'expo-constants';

// Tự động nhận diện IP máy chủ khi chạy trên điện thoại thật (Expo Go) hoặc Web
const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri || (Constants.manifest && Constants.manifest.debuggerHost) || '';
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseUrl();

/**
 * Perform an HTTP Request to the backend REST API
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();
    return data;
  } catch (error) {
    // If backend is unreachable, throw or handle gracefully
    console.warn(`[API Offline Fallback] ${endpoint}:`, error.message);
    return { success: false, isOffline: true, message: error.message };
  }
}
