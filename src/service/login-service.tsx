import { signIn } from '../api/login-api';
import { Login, LoginResponse, User } from '../types/login';
import { ACCESS_TOKEN_KEY, removeCookie } from '../utils/cookies';
import { keysToCamel } from '../utils/utils';

export const loginService = (user: User): Promise<Login> =>
  signIn(user).then(
    (resp: LoginResponse) => keysToCamel(resp.data.data) as Login,
  );

export const logOffService = () => {
  removeCookie(`${ACCESS_TOKEN_KEY}`);
};
