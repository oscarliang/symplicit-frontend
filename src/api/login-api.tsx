import axios from 'axios';

import { LoginResponse, User } from '../types/login';

import { API_SSR_ENDPOINT } from './queries';

const SIGN_IN_URL = `${API_SSR_ENDPOINT}/auth/login/`;

/**
 *  get all of the cars
 */
// eslint-disable-next-line import/prefer-default-export
export const signIn = async (user: User): Promise<LoginResponse> =>
  axios({
    data: JSON.stringify({
      password: user.password,
      username: user.username,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
    url: SIGN_IN_URL,
  });
