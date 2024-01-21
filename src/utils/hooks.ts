import { useEffect, useState } from 'react';

import { useAppSelector } from '../store';

import { ACCESS_TOKEN_KEY, getCookie, setCookie } from './cookies';

export default function useToken() {
  const { isAuthenticated } = useAppSelector((state) => state.authenticated);
  const getToken = (): string | null => {
    // eslint-disable-next-line rulesdir/no-typeof-window-outside-useeffect
    if (typeof window === 'undefined') return null;

    const tokenString = getCookie(`${ACCESS_TOKEN_KEY}`);
    if (!tokenString) {
      return null;
    }

    return tokenString;
  };

  const [token, setToken] = useState(getToken());

  // have to use this solution to trigger refresh the store state. Full.tsx - getToken need the refreshed token
  useEffect(() => {
    setToken(getCookie(`${ACCESS_TOKEN_KEY}`));
  }, [isAuthenticated]);

  const saveToken = (userToken: string) => {
    setCookie({
      cookieName: `${ACCESS_TOKEN_KEY}`,
      cookiePath: '/',
      cookieValue: userToken,
      expireSeconds: 7 * 24 * 60 * 60,
    });
  };

  return {
    setToken: saveToken,
    token,
  };
}
