import { Permission } from '../types/permission';

export const UPDATE_PERMISSION = 'UPDATE_PERMISSION';

export interface UpdatePermissionActionType {
  payload: {
    state: {
      permissions: Permission[];
    };
  };
  type: string;
}

export function updatePermissions(
  permissions: Permission[],
): UpdatePermissionActionType {
  return {
    payload: {
      state: {
        permissions,
      },
    },
    type: UPDATE_PERMISSION,
  };
}

type PermissionActionType = UpdatePermissionActionType;

// Reducer
export const initialState = {};

export default function reducer(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state = initialState,
  action: PermissionActionType,
) {
  switch (action.type) {
    case UPDATE_PERMISSION:
      return {
        ...action.payload.state.permissions,
      };
    default:
      return state;
  }
}
