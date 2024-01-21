import { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';

import { AllCar, RoleModules } from 'mocks/homepageFixture';
import AllCarsFixture from 'mocks/allCarsFixture';
import { RootState, createStore } from 'store';
import { TestWrapper } from 'utils/jest';

import HomepageComponent from './component';

describe('<HomepageContainer />', () => {
  let store: EnhancedStore<RootState>;

  beforeEach(() => {
    store = createStore((state: RootState) => ({
      ...state,
      cars: AllCarsFixture,
      global: {
        isClientSide: true,
        message: 'test',
        selectedCar: {
          brand: '',
          drive: '',
          imageUrl: '',
          name: '',
          price: '',
          id: 0,
          _id: '',
        },
      },
    }));
  });

  it('renders', () => {
    expect.assertions(1);

    const { container } = render(
      <TestWrapper store={store}>
        <HomepageComponent
          allCars={AllCar}
          roleModules={RoleModules as Record<string, number>}
        />
      </TestWrapper>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('button', () => {
    expect.assertions(4);

    render(
      <TestWrapper store={store}>
        <HomepageComponent
          allCars={AllCar}
          roleModules={RoleModules as Record<string, number>}
        />
      </TestWrapper>,
    );

    expect(screen.getByTestId('add-car-btn')).not.toHaveClass('disabled');
    expect(screen.getByTestId('reset-car-btn')).not.toHaveClass('disabled');
    expect(screen.getByTestId('update-car-btn')).toHaveClass('disabled');

    fireEvent.click(screen.getByAltText('test1'));
    expect(screen.getByTestId('update-car-btn')).not.toHaveClass('disabled');
  });
});
