import { useMemo } from "react";
import useAuthUser from "./useAuthUser";

function useAuthUserUIPermissionRestrictor() {
  const user = useAuthUser();
  const userPermissions = useMemo(
    () =>
      user?.permissions?.reduce((acc, curr) => {
        acc[curr] = true;
        return acc;
      }, {}) || {},
    [user?.permissions]
  );

  function hasPermission(...permissions) {
    // if (!permissions.length || userPermissions?.ALL_FUNCTIONS) {
    if (!permissions.length) {
      return true;
    }
    if (userPermissions) {
      return permissions.some((permission) => !!userPermissions[permission]);
    }
    return false;
  }

  function hasPermissions(...permissions) {
    // if (!permissions.length || userPermissions?.ALL_FUNCTIONS) {
    if (!permissions.length) {
      return true;
    }
    if (userPermissions) {
      return permissions.every((permission) => !!userPermissions[permission]);
    }
    return false;
  }

  function filter(uis = [], options = {}) {
    const {
      getPermission = _getPermissions,
      isNegateValidation = _isNegateValidation,
      isValidateAllPermissions = _isValidateAllPermissions,
    } = options;
    return uis.filter(function () {
      const permissions = getPermission(...arguments);
      const negateValidation = isNegateValidation(...arguments);
      const validateAllPermissions = isValidateAllPermissions(...arguments);
      return validateAllPermissions
        ? negateValidation
          ? !hasPermissions(...permissions)
          : hasPermissions(...permissions)
        : negateValidation
          ? !hasPermission(...permissions)
          : hasPermission(...permissions);
    });

    function _getPermissions(ui) {
      return ui?.permissions || [];
    }

    function _isNegateValidation(ui) {
      return ui?.negatePermissionsValidation;
    }

    function _isValidateAllPermissions(ui) {
      return ui?.validateAllPermissions;
    }
  }

  return { hasPermission, hasPermissions, filter };
}

export default useAuthUserUIPermissionRestrictor;
