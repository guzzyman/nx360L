import { forwardRef } from "react";
import useAuthUserUIPermissionRestrictor from "hooks/useAuthUserUIPermissionRestrictor";

const AuthUserUIPermissionRestrictor = forwardRef(
  /**
   *
   * @param {AuthUserUIPermissionRestrictorProps} props
   */
  function AuthUserUIPermissionRestrictor(props, ref) {
    const {
      children,
      permissions,
      visible,
      negateValidation,
      validateAll,
      ...rest
    } = props;
    const permissionValidator = useAuthUserUIPermissionRestrictor();

    const isPermitted = validateAll
      ? negateValidation
        ? !permissionValidator.hasPermissions(...permissions)
        : permissionValidator.hasPermissions(...permissions)
      : negateValidation
      ? !permissionValidator.hasPermission(...permissions)
      : permissionValidator.hasPermission(...permissions);

    if (isPermitted) {
      return typeof children === "function"
        ? children({ ref, ...rest })
        : children;
    }

    if (visible) {
      return <div className="pointer-events-none contents">{children}</div>;
    }

    return null;
  }
);

AuthUserUIPermissionRestrictor.defaultProps = {
  visible: false,
  permissions: [],
};

export default AuthUserUIPermissionRestrictor;

/**
 * @typedef {{
 * children: any;
 * permissions: string[]
 * visible: boolean;
 * validateAll: boolean;
 * negateValidation: boolean;
 * }} AuthUserUIPermissionRestrictorProps
 */
