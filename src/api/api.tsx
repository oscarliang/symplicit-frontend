// Wrapper for HTTP requests with Axios
import axios, { CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';

import { ACCESS_TOKEN_KEY, getCookie } from '../utils/cookies';

import { GRAHPQL_ENDPOINT } from './queries';

const api = axios.create({
  baseURL: GRAHPQL_ENDPOINT,
} as CreateAxiosDefaults);

// Add an interceptor for all requests
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // eslint-disable-next-line rulesdir/no-typeof-window-outside-useeffect
  if (typeof window === 'undefined') return Promise.resolve(config);
  // Retrieve the access token from React state or a state management system
  const accessToken = getCookie(`${ACCESS_TOKEN_KEY}`);

  if (accessToken) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return Promise.resolve(config);
});

export default api;
