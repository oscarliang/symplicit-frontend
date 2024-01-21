import { render, screen } from '@testing-library/react';
import * as React from 'react';

import AllCarsFixture from 'mocks/allCarsFixture';
import { createStore } from 'store';
import { TestWrapper } from 'utils/jest';

import { CarRequest } from '../../../types/car';

import CarsTable from './CarsTable';

describe('<CarsTable />', () => {
  it('renders', () => {
    expect.assertions(2);

    const store = createStore();

    const { container } = render(
      <TestWrapper store={store}>
        <CarsTable
          allCars={AllCarsFixture as unknown as Record<number, CarRequest>}
        />
      </TestWrapper>,
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getByTestId('car-0')).toHaveTextContent('$34,324');
  });
});
