/**
 * Environment variables utilities
 */

export const getApiBaseUrl = (): string => {
  return process.env.REACT_APP_API_BASE_URL || 'https://take-home-assessment-423502.uc.r.appspot.com/api';
};

export const getUserId = (): string => {
  return process.env.REACT_APP_DEFAULT_USER_ID || 'mehyar_alkhouri';
};

export const isDebugMode = (): boolean => {
  return process.env.REACT_APP_DEBUG === 'true';
};
