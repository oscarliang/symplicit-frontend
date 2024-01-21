import { PayloadAction, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { combineReducers } from 'redux';
import * as Redux from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import carsReducer from './ducks/cars';
import globalReducer from './ducks/global';
import LoginReducer, { LOG_OUT_ACTION } from './ducks/login';
import permissionReducer from './ducks/permission';
import { merge } from './utils/utils';

const ACTION_HYDRATE = 'HYDRATE';
export function hydrateAction(
  state: Partial<RootState>,
): PayloadAction<Partial<RootState>> {
  return {
    payload: state as RootState,
    type: ACTION_HYDRATE,
  };
}

const combinedReducer = combineReducers({
  authenticated: LoginReducer,
  cars: carsReducer,
  global: globalReducer,
  loadingBar: loadingBarReducer,
  permissions: permissionReducer,
});

export function createStore(configure?: (state: RootState) => RootState) {
  const middleware: [Redux.Middleware] = [thunk];

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_DEBUGGER
  ) {
    // add the previous state and next state info
    middleware.push(
      createLogger({
        collapsed: true,
        level: 'info',
      }),
    );
  }

  const store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware),
    reducer: (
      state: RootState | undefined,
      action: PayloadAction<Partial<RootState>>,
    ) => {
      // Clear all data in redux store to initial.
      if (action.type === LOG_OUT_ACTION) {
        // eslint-disable-next-line no-param-reassign
        state = undefined;
      }

      if (action.type === ACTION_HYDRATE) {
        return merge(state, action.payload) as RootState;
      }
      return combinedReducer(state, action);
    },
  });

  if (configure) {
    store.dispatch(hydrateAction(configure(store.getState())));
  }

  return store;
}

export const store = createStore();

export type RootState = ReturnType<typeof combinedReducer>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
