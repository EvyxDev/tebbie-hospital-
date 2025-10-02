import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import {
  getEmployeePermissions,
  getEmployeeRoles,
  updateRolePermissions,
} from "../utlis/https";
import { hasPermission } from "../utils/permissionUtils";

export default function AddRolePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");

  const [formData, setFormData] = useState({
    selectedRoleId: "",
    permissions: [],
  });

  // Fetch employee roles
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["employee-roles"],
    queryFn: () => getEmployeeRoles({ token }),
  });

  // Fetch employee permissions
  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
    queryKey: ["employee-permissions"],
    queryFn: () => getEmployeePermissions({ token }),
  });

  const roles = rolesData?.data || [];
  const permissions = permissionsData?.data || [];

  // Update role permissions mutation
  const updateRoleMutation = useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries(["employee-roles"]);
      alert("تم تحديث صلاحيات الدور بنجاح");
      navigate("/employees");
    },
    onError: (error) => {
      console.error("Error updating role permissions:", error);
      alert("حدث خطأ أثناء تحديث صلاحيات الدور");
    },
  });

  const handleRoleChange = (roleId) => {
    const selectedRole = roles.find((role) => role.id === parseInt(roleId));
    setFormData((prev) => ({
      ...prev,
      selectedRoleId: roleId,
      permissions: selectedRole?.permissions?.map((p) => p.id) || [],
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.selectedRoleId || formData.permissions.length === 0) {
      alert("يرجى اختيار دور وتحديد الصلاحيات");
      return;
    }

    // Convert permission IDs to permission names
    const permissionNames = formData.permissions
      .map((permissionId) => {
        const permission = permissions.find((p) => p.id === permissionId);
        return permission?.name;
      })
      .filter(Boolean);

    updateRoleMutation.mutate({
      token,
      roleId: formData.selectedRoleId,
      permissions: permissionNames,
    });
  };

  if (!hasPermission("add-employees")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            غير مصرح لك
          </h3>
          <p className="text-gray-600 text-sm">
            ليس لديك صلاحية لإضافة الأدوار
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <h1 className="text-2xl font-bold text-gray-900">صلاحيات الدور</h1>
          </div>
          <button
            onClick={() => navigate("/add-new-role")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            إضافة دور جديد
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر الدور
              </label>
              {rolesLoading ? (
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <select
                  value={formData.selectedRoleId}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  required
                  disabled={updateRoleMutation.isPending}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">اختر دوراً...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.display_name} ({role.name})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Permissions */}
            {formData.selectedRoleId ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  الصلاحيات
                </label>

                {permissionsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-gray-200 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
                    {permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center space-x-3 space-x-reverse p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          disabled={updateRoleMutation.isPending}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {permission.display_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {permission.name}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {formData.permissions.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    تم اختيار {formData.permissions.length} صلاحية
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>يرجى اختيار دور أولاً لعرض وتعديل الصلاحيات</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {formData.selectedRoleId && (
            <div className="flex space-x-3 space-x-reverse mt-8">
              <button
                type="submit"
                disabled={updateRoleMutation.isPending}
                className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={20} />
                <span>
                  {updateRoleMutation.isPending
                    ? "جاري التحديث..."
                    : "تحديث الصلاحيات"}
                </span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
