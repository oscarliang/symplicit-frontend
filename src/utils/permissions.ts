import { PermissionType } from '../types/permission';

// eslint-disable-next-line import/prefer-default-export
export function hasPermission(
  permissions: Record<string, number>,
  module: string,
  permissionTypes: PermissionType[],
): boolean {
  if (!(module in permissions)) {
    return false;
  }

  let granted = false;
  for (let i = 0; i < permissionTypes.length; i++) {
    // eslint-disable-next-line no-bitwise
    if (permissions[module] & permissionTypes[i]) {
      granted = true;
      break;
    }
  }
  return granted;
}
