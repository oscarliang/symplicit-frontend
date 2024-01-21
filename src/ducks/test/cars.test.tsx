import { NormalizedCarsEntity } from '../../types/car';
import reducer, {
  CarActionType,
  initialState,
  updateAllOfCarsAction,
} from '../cars';

import allCarsMock from './fixtures/cars';

describe('cars action', () => {
  it('should handle updateAllOfCars', () => {
    const state = {
      ...allCarsMock,
    } as unknown as NormalizedCarsEntity;
    expect(updateAllOfCarsAction(state)).toEqual({
      payload: {
        state: {
          '0': 100,
          cars: {
            '100': {
              brand: 'porsche',
              drive: 'awd',
              id: 100,
              imageUrl:
                'http://files1.porsche.com/filestore/image/multimedia/none/991-2nd-c4s-modelimage-sideshot/model/15bd09cf-553b-11e5-8c32-0019999cd470;s25/porsche-model.png',
              name: '911 Carrera',
              price: 280000,
            },
          },
        },
      },
      type: 'UPDATE_ALL_CARS',
    });
  });
});

describe('cars reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as CarActionType)).toEqual(initialState);
  });

  it('should handle UPDATE_ALL_CARS', () => {
    expect(
      reducer(initialState, {
        payload: {
          state: {
            cars: [
              {
                _id: '656083b26a2462000a137319',
                brand: 'porsche',
                drive: 'awd',
                id: 100,
                imageUrl:
                  'http://files1.porsche.com/filestore/image/multimedia/none/991-2nd-c4s-modelimage-sideshot/model/15bd09cf-553b-11e5-8c32-0019999cd470;s25/porsche-model.png',
                name: '911 Carrera',
                price: '280000',
              },
            ],
          },
        },
        type: 'UPDATE_ALL_CARS',
      }),
    ).toEqual({
      '0': {
        _id: '656083b26a2462000a137319',
        brand: 'porsche',
        drive: 'awd',
        id: 100,
        imageUrl:
          'http://files1.porsche.com/filestore/image/multimedia/none/991-2nd-c4s-modelimage-sideshot/model/15bd09cf-553b-11e5-8c32-0019999cd470;s25/porsche-model.png',
        name: '911 Carrera',
        price: '280000',
      },
    });
  });
});
