import { AxiosError, AxiosResponse } from 'axios';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as React from 'react';

import { fetchAllCarsRestful } from '../../api/car-api';
import { Car, RestfulResponse } from '../../types/car';
import { ApiError } from '../../types/common';
import { keysToCamel } from '../../utils/utils';

import HomepageContainer from './component';

async function HomepageServerContainer(): Promise<React.ReactElement> {
  const cookiesStore = cookies();
  const accessToken: RequestCookie = cookiesStore.get('accessToken');
  if (!accessToken) {
    redirect('/login');
  }

  try {
    const data = await fetchAllCarsRestful(accessToken.value);
    const resp = keysToCamel(data.data) as RestfulResponse;
    const { allCars, modules } = resp.data;
    return (
      <HomepageContainer allCars={allCars as Car[]} roleModules={modules} />
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      const apiError = (error.response as AxiosResponse).data as ApiError;
      if (apiError.statusCode === 401) {
        redirect('/login');
      }
    } else {
      // TODO: handle it appropriately
    }
  }
}

export default HomepageServerContainer;
