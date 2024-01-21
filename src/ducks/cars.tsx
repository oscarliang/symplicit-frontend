import { Car, NormalizedCarsEntity } from '../types/car';

export const UPDATE_ALL_CARS = 'UPDATE_ALL_CARS';
export const ADD_CAR = 'ADD_CAR';
export const REMOVE_CAR = 'REMOVE_CAR';
export const UPDATE_CAR = 'UPDATE_CAR';

export interface CarActionType {
  payload: {
    state: {
      car: Car;
    };
  };
  type: string;
}

export interface UpdateAllOfCarsActionType {
  payload: {
    state: {
      cars: Car[];
    };
  };
  type: string;
}

// update all of the cars
export function updateAllOfCarsAction(normalizedCars: NormalizedCarsEntity) {
  return {
    payload: {
      state: {
        ...normalizedCars.result,
        ...normalizedCars.entities,
      },
    },
    type: UPDATE_ALL_CARS,
  };
}

// add car
export function addCarAction(car: Car): CarActionType {
  return {
    payload: {
      state: {
        car,
      },
    },
    type: ADD_CAR,
  };
}

// update car
export function updateCarAction(car: Car): CarActionType {
  return {
    payload: {
      state: {
        car,
      },
    },
    type: UPDATE_CAR,
  };
}

// remove car
export function removeCarAction(car: Car): CarActionType {
  return {
    payload: {
      state: {
        car,
      },
    },
    type: REMOVE_CAR,
  };
}

type CarsActionType = UpdateAllOfCarsActionType | CarActionType;

// Reducer
export const initialState = {};
export default function reducer(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state = initialState,
  action: CarsActionType,
) {
  switch (action.type) {
    case UPDATE_ALL_CARS:
      return {
        ...(action as UpdateAllOfCarsActionType).payload.state.cars,
      };
    case ADD_CAR:
      // eslint-disable-next-line no-case-declarations
      const addCar = (action as CarActionType).payload.state.car;
      return {
        ...state,
        [addCar.id]: addCar,
      };
    case UPDATE_CAR:
      // eslint-disable-next-line no-case-declarations
      const updateCar = (action as CarActionType).payload.state.car;
      // state[updateCar.id] = updateCar
      return {
        ...state,
        [updateCar.id]: updateCar,
      };
    case REMOVE_CAR:
      // eslint-disable-next-line no-case-declarations
      const removeCar = (action as CarActionType).payload.state.car;
      return {
        ...state,
        [removeCar.id]: undefined,
      };
    default:
      return state;
  }
}
