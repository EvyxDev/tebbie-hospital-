import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const PermissionWrapper = ({
  children,
  permissionName,
  fallbackMessage = "ليس لديك صلاحية للوصول إلى هذه الصفحة",
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = () => {
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

        console.log("Permissions data:", permissions);

        // Ensure permissions is an array
        if (!Array.isArray(permissions)) {
          permissions = [];
        }

        const hasRequiredPermission = permissions.some(
          (permission) => permission.name === permissionName
        );
        setHasPermission(hasRequiredPermission);
      } catch (error) {
        console.error("Error checking permissions:", error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, [permissionName]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              غير مصرح لك
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {fallbackMessage}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            العودة للخلف
          </button>
        </div>
      </div>
    );
  }

  return children;
};

PermissionWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  permissionName: PropTypes.string.isRequired,
  fallbackMessage: PropTypes.string,
};

export default PermissionWrapper;
