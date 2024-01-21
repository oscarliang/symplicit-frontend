import {
  AllCarResponse,
  AllCarRestFulResponse,
  CarRequest,
} from '../types/car';

import api from './api';
import {
  ADD_CAR,
  API_SSR_ENDPOINT,
  DELETE_CAR,
  GET_ALL_CARS,
  GET_CARS_BY_BRAND,
  GET_CARS_BY_DRIVE,
  GET_CARS_BY_NAME,
  GRAHPQL_ENDPOINT,
  UPDATE_CAR,
} from './queries';

/**
 *  get all of the cars
 */
export const fetchAllCars = async (): Promise<AllCarResponse> =>
  api({
    data: JSON.stringify({
      query: GET_ALL_CARS,
      variables: null,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });

export const fetchAllCarsRestful = async (
  cookies?: string,
): Promise<AllCarRestFulResponse> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (cookies) {
    headers.Authorization = `Bearer ${cookies}`;
  }

  return api({
    headers,
    method: 'get',
    url: `${API_SSR_ENDPOINT}/cars/`,
  });
};

export const saveCar = (car: CarRequest) =>
  api({
    data: {
      query: ADD_CAR,
      variables: {
        input: car,
      },
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });

export const updateCar = (car: CarRequest) => {
  const id = car._id;
  const carInput = car;
  delete carInput._id;
  return api({
    data: {
      query: UPDATE_CAR,
      variables: {
        id,
        input: {
          ...carInput,
        },
      },
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });
};

/**
 * call delete car remote api
 * @param {object} car
 */
export const deleteCar = (car: CarRequest) =>
  api({
    data: {
      query: DELETE_CAR,
      variables: {
        id: car._id,
      },
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
    url: GRAHPQL_ENDPOINT,
  });

/**
 * call find cars remote api
 * @param {object} name
 */
export const findCarsByName = (name: string) =>
  api({
    data: JSON.stringify({
      query: GET_CARS_BY_NAME,
      variables: { name },
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
  });

/**
 * call find cars remote api
 * @param {object} brand
 */
export const findCarsByBrand = (brand: string) =>
  api({
    data: JSON.stringify({
      query: GET_CARS_BY_BRAND,
      variables: { brand },
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
    url: GRAHPQL_ENDPOINT,
  });

/**
 * call find cars remote api
 * @param {object} drive
 */
export const findCarsByDrive = (drive: string) =>
  api({
    data: JSON.stringify({
      query: GET_CARS_BY_DRIVE,
      variables: { drive },
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
    url: GRAHPQL_ENDPOINT,
  });
