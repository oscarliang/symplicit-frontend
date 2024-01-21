export const LOG_IN_ACTION = 'LOG_OFF_ACTION';
export const LOG_OUT_ACTION = 'LOG_OUT_ACTION';

export interface LogOutActionType {
  type: string;
}

export function loginOutAction(): LogOutActionType {
  return {
    type: LOG_OUT_ACTION,
  };
}

export interface LoginActionType {
  payload: {
    state: {
      isAuthenticated: boolean;
    };
  };
  type: string;
}

export function loginAction(isAuthenticated: boolean): LoginActionType {
  return {
    payload: {
      state: {
        isAuthenticated,
      },
    },
    type: LOG_IN_ACTION,
  };
}

type LogActionType = LoginActionType;

// Reducer
export const initialState = {
  isAuthenticated: false,
};

export default function reducer(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state = initialState,
  action: LogActionType,
) {
  switch (action.type) {
    case LOG_IN_ACTION:
      return {
        ...state,
        isAuthenticated: action.payload.state.isAuthenticated,
      };
    default:
      return state;
  }
}
