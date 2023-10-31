export class Permission {
  static can(auth, permission) {
    return auth.permissions?.includes(permission);
  }
}
