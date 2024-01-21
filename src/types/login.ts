import { RestApiResponse } from './common';

export interface User {
  password: string;
  username: string;
}

export interface AccessToken {
  accessToken: string;
}

export interface Login {
  accessToken: string;
  modules: Record<string, number>[];
}

export interface LoginResponse extends RestApiResponse<Login> {}

// export interface LoginResponse {
//   data: {
//     data: {
//       accessToken: string;
//       modules: Record<string, number>[];
//     };
//   };
// }
