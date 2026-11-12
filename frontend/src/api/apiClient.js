import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Tự động nhận diện IP máy chủ khi chạy trên máy ảo Android Emulator, điện thoại thật hoặc Web
const getBaseUrl = () => {
  // 1. Cho phép cấu hình qua biến môi trường nếu có
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Nhận diện IP máy host từ Expo Go
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    (Constants.manifest && Constants.manifest.debuggerHost) ||
    '';

  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:5000/api`;
    }
  }

  // 3. Nếu chạy trên máy ảo Android (Android Emulator), dùng IP 10.0.2.2 để kết nối máy tính host
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  // 4. Mặc định trên iOS Simulator hoặc Web
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseUrl();
console.log(`[API Client Initialized] Base URL: ${API_BASE_URL} (Platform: ${Platform.OS})`);

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
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout cho máy ảo

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[API Connection Error] ${endpoint} (${url}):`, error.message);
    return {
      success: false,
      isOffline: true,
      message: `Không thể kết nối máy chủ API tại ${API_BASE_URL}. Vui lòng đảm bảo Backend đang chạy (npm start). Lỗi: ${error.message}`,
    };
  }
}

