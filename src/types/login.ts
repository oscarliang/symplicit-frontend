import { RestApiResponse } from './common';

export interface User {
  password: string;
  username: string;
}

export interface Login {
  accessToken: string;
  modules: Record<string, number>[];
}

export interface LoginResponse extends RestApiResponse<Login> {}
