/**
 * Utility function to check if user has a specific permission
 * @param {string} permissionName - The name of the permission to check
 * @returns {boolean} - true if user has permission, false otherwise
 */
export const hasPermission = (permissionName) => {
  try {
    const permissionsData = localStorage.getItem("permissions");
    let permissions = [];

    if (permissionsData) {
      // Check if it's already an object or a JSON string
      if (typeof permissionsData === "string") {
        permissions = JSON.parse(permissionsData);
      } else {
        // If it's already an object, use it directly
        permissions = permissionsData;
      }
    }

    // Ensure permissions is an array
    if (!Array.isArray(permissions)) {
      permissions = [];
    }

    return permissions.some((permission) => permission.name === permissionName);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};

/**
 * Utility function to check if user has any of the provided permissions
 * @param {string[]} permissionNames - Array of permission names to check
 * @returns {boolean} - true if user has any of the permissions, false otherwise
 */
export const hasAnyPermission = (permissionNames) => {
  if (!Array.isArray(permissionNames)) {
    return false;
  }

  return permissionNames.some((permissionName) =>
    hasPermission(permissionName)
  );
};

/**
 * Utility function to check if user has all of the provided permissions
 * @param {string[]} permissionNames - Array of permission names to check
 * @returns {boolean} - true if user has all permissions, false otherwise
 */
export const hasAllPermissions = (permissionNames) => {
  if (!Array.isArray(permissionNames)) {
    return false;
  }

  return permissionNames.every((permissionName) =>
    hasPermission(permissionName)
  );
};

/**
 * Get all user permissions
 * @returns {Array} - Array of permission objects
 */
export const getUserPermissions = () => {
  try {
    const permissionsData = localStorage.getItem("permissions");
    let permissions = [];

    if (permissionsData) {
      if (typeof permissionsData === "string") {
        permissions = JSON.parse(permissionsData);
      } else {
        permissions = permissionsData;
      }
    }

    return Array.isArray(permissions) ? permissions : [];
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }
};

/**
 * Get permission display name by permission name
 * @param {string} permissionName - The name of the permission
 * @returns {string} - Display name of the permission or the original name if not found
 */
export const getPermissionDisplayName = (permissionName) => {
  const permissions = getUserPermissions();
  const permission = permissions.find((p) => p.name === permissionName);
  return permission ? permission.display_name : permissionName;
};
