import { normalize } from 'normalizr';
import { Dispatch } from 'react';
import { Action } from 'redux';

import {
  deleteCar,
  findCarsByBrand,
  findCarsByDrive,
  findCarsByName,
  saveCar,
  updateCar,
} from '../api/car-api';
import {
  SelectCarType,
  updateMessage,
  updateSelectedCar,
} from '../ducks/global';
import { carListSchema } from '../schema';
import {
  Car,
  CarRequest,
  CreateCarResponse,
  DeleteCarResponse,
  GetCarByBrandResponse,
  GetCarByDriveResponse,
  GetCarByNameResponse,
  NormalizedEntity,
} from '../types/car';

/**
 * save the new car into the db
 * @param car
 */
export const saveCarService = (car: CarRequest): Promise<Car> =>
  saveCar(car).then((resp: CreateCarResponse) => resp.data.data.createCar);

/**
 * update the car
 * @param car
 */
export const updateCarService = (car: CarRequest) =>
  updateCar(car).then(() => car);

/**
 * delete the car
 * @param car
 */
export const deleteCarService = (car: CarRequest): Promise<Car> =>
  deleteCar(car).then((resp: DeleteCarResponse) => resp.data.data.deleteCar);

export const updateMessageService =
  (message: string) => (dispatch: Dispatch<Action>) => {
    dispatch(updateMessage(message));
  };

/**
 * Find car by passing filter object
 * @param {object} name. e.g { "name" : "bmw s2" }
 */
export const findCarByNameService = (
  name: string,
): Promise<NormalizedEntity> => {
  const obj: NormalizedEntity = {
    cars: {},
  };
  return findCarsByName(name).then((resp: GetCarByNameResponse) => {
    const cars = resp.data.data.getCarByName;
    obj.cars = normalize(cars, carListSchema);
    // set cookies
    // cookies.set(findCarCookieKey, JSON.stringify(obj), { path: '/' });
    return obj;
  });
};

export const selectCar =
  (car: SelectCarType) => (dispatch: Dispatch<Action>) => {
    dispatch(updateSelectedCar(car));
  };

/**
 * Find car by passing filter object
 * @param brand
 */
export const findCarByBrandService = (
  brand: string,
): Promise<NormalizedEntity> => {
  const obj: NormalizedEntity = {
    cars: {},
  };
  return findCarsByBrand(brand).then((resp: GetCarByBrandResponse) => {
    const cars = resp.data.data.getCarByBrand;
    obj.cars = normalize(cars, carListSchema);
    return obj;
  });
};

/**
 * Find car by passing filter object
 * @param {string} drive. e.g { "drive" : "2wd" }
 */
export const findCarByDriveService = async (
  drive: string,
): Promise<NormalizedEntity | null> => {
  try {
    const obj: NormalizedEntity = {
      cars: {},
    };

    const resp: GetCarByDriveResponse = await findCarsByDrive(drive);
    if (resp) {
      const respData = resp.data.data;
      if (respData) {
        obj.cars = normalize(respData.getCarByDrive, carListSchema);
      }
    }
    return obj;
  } catch (err) {
    return Promise.resolve(null);
    // return Promise.reject(err);
  }
};
