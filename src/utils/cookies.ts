// Based on `js-cookie`

export const ACCESS_TOKEN_KEY = 'accessToken';

export function getCookie(key: string): null | string {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (let i = 0; i < cookies.length; i += 1) {
    const parts = cookies[i].split('=');
    let value = parts.slice(1).join('=');

    if (value[0] === '"') {
      value = value.slice(1, -1);
    }

    const foundKey = decodeURIComponent(parts[0]);

    if (key === foundKey) {
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    }
  }

  return null;
}

interface SetCookieOptions {
  cookieName: string;
  cookiePath?: string;
  cookieValue: string;
  expireSeconds?: number;
}

export function setCookie({
  cookieName,
  cookiePath,
  cookieValue,
  expireSeconds,
}: SetCookieOptions): void {
  let cookieString = `${cookieName}=${cookieValue}`;
  if (expireSeconds) {
    // eslint-disable-next-line rulesdir/prefer-use-date
    const today = new Date();
    // eslint-disable-next-line rulesdir/prefer-use-date
    const expire = new Date();
    expire.setTime(today.getTime() + expireSeconds * 1000);
    cookieString += `;expires=${expire.toUTCString()}`;
  }
  if (cookiePath) {
    cookieString += `;path=${cookiePath}`;
  }
  document.cookie = cookieString;
}

export function removeCookie(cookieName: string): void {
  // eslint-disable-next-line max-len
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
