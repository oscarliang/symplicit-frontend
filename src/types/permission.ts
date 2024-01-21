export interface Permission {
  module: string;
  permission: number;
}

export enum PermissionType {
  CREATE = 1,
  READ = 2,
  UPDATE = 4,
  DELETE = 8,
}
