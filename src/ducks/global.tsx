export const UPDATE_SELECTED_CAR = 'UPDATE_SELECTED_CAR';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const UPDATE_IS_CLIENT_SIDE = 'UPDATE_IS_CLIENT_SIDE';

export interface UpdateIsClientSideActionType {
  payload: {
    state: {
      isClientSide: boolean;
    };
  };
  type: string;
}

export function updateIsClientSide(
  isClientSide: boolean,
): UpdateIsClientSideActionType {
  return {
    payload: {
      state: {
        isClientSide,
      },
    },
    type: UPDATE_IS_CLIENT_SIDE,
  };
}

export interface SelectCarType {
  _id: string;
  brand: string;
  drive: string;
  id: number;
  imageUrl: string;
  name: string;
  price: string;
}

export interface UpdateSelectedCarActionType {
  payload: {
    state: {
      selectedCar: SelectCarType;
    };
  };
  type: string;
}

/**
 * update the selected car state
 *
 * @param {CarRequest} car -
 */
export function updateSelectedCar(
  car: SelectCarType,
): UpdateSelectedCarActionType {
  return {
    payload: {
      state: {
        selectedCar: car,
      },
    },
    type: UPDATE_SELECTED_CAR,
  };
}

export interface UpdateMessageActionType {
  payload: {
    state: {
      message: string;
    };
  };
  type: string;
}

/**
 * update the selected car state
 *
 * @param {string} message -
 * update message - can be add, update, delete, null,
 * which to keep the last graphql action
 */
export function updateMessage(message: string): UpdateMessageActionType {
  return {
    payload: {
      state: {
        message,
      },
    },
    type: UPDATE_MESSAGE,
  };
}

type GlobalActionType =
  | UpdateSelectedCarActionType
  | UpdateMessageActionType
  | UpdateIsClientSideActionType;

/**
 * Reducer
 *
 */
export const initialState = {
  isClientSide: false,
  message: '',
  selectedCar: {
    _id: '',
    brand: '',
    drive: '',
    id: 0,
    imageUrl: '',
    name: '',
    price: '',
  },
};
export default function reducer(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state = initialState,
  action: GlobalActionType,
) {
  switch (action.type) {
    case UPDATE_IS_CLIENT_SIDE:
      return {
        ...state,
        isClientSide: (action as UpdateIsClientSideActionType).payload.state
          .isClientSide,
      };
    case UPDATE_SELECTED_CAR:
      return {
        ...state,
        selectedCar: (action as UpdateSelectedCarActionType).payload.state
          .selectedCar,
      };
    case UPDATE_MESSAGE:
      return {
        ...state,
        message: (action as UpdateMessageActionType).payload.state.message,
      };
    default:
      return state;
  }
}
