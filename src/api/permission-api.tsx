import { ModulesRestFulResponse } from '../types/car';

import api from './api';
import { API_SSR_ENDPOINT } from './queries';

// eslint-disable-next-line import/prefer-default-export
export const fetchModulesRestful = async (): Promise<ModulesRestFulResponse> =>
  api({
    method: 'get',
    url: `${API_SSR_ENDPOINT}/roles/modules/`,
  });
