import { EnhancedStore } from '@reduxjs/toolkit';
import * as React from 'react';
import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { RootState } from 'store';

interface TestWrapperProps {
  children: React.ReactNode;
  store: EnhancedStore<RootState>;
}

// eslint-disable-next-line import/prefer-default-export
export function TestWrapper({
  children,
  store,
}: TestWrapperProps): React.ReactElement {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Provider store={store}>{children}</Provider>
    </SWRConfig>
  );
}
