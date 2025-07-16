// Utility functions for authentication

export const clearAuthData = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('accessToken');
  // Note: httpOnly cookies (refreshToken) are automatically handled by the browser
  // and will be cleared by the backend logout endpoint
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch {
    return null;
  }
};
