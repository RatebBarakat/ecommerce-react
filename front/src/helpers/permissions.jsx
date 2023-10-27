import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export class Permission {
  static can(auth, permission) {
    return auth.permissions?.includes(permission);
  }
}
