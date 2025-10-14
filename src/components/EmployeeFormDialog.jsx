/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee, updateEmployee } from "../utlis/https";
import RoleSelect from "./RoleSelect";

export default function EmployeeDialog({
  isOpen,
  onClose,
  employee,
  token,
  hospital_id,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <EmployeeForm
          employee={employee}
          token={token}
          hospital_id={hospital_id}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

// Employee Form Component with React Query Mutations
function EmployeeForm({ employee, token, hospital_id, onClose }) {
  const isEdit = !!employee;
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(employee?.role || "");
  const [validationErrors, setValidationErrors] = useState({});

  const initialValues = {
    name: employee?.name || "",
    phone: employee?.phone || "",
    email: employee?.email || employee?.user?.email || "",
    password: employee?.password || employee?.user?.password || "",
    role: employee?.role || "",
    hospital_id: hospital_id,
  };

  // Helper function to extract error messages from API response
  const extractErrorMessages = (error) => {
    console.error("Error response:", error);

    // Check if error has the validation error structure
    if (error?.errors && typeof error.errors === "object") {
      return error.errors;
    }

    // Check if error is wrapped in response
    if (error?.response?.data?.errors) {
      return error.response.data.errors;
    }

    return null;
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setValidationErrors({});
      alert("تم إضافة الموظف بنجاح");
      onClose();
    },
    onError: (error) => {
      console.error("Error creating employee:", error);

      const errors = extractErrorMessages(error);
      if (errors) {
        setValidationErrors(errors);
      } else {
        alert("حدث خطأ أثناء إضافة الموظف");
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setValidationErrors({});
      alert("تم تحديث الموظف بنجاح");
      onClose();
    },
    onError: (error) => {
      console.error("Error updating employee:", error);

      const errors = extractErrorMessages(error);
      if (errors) {
        setValidationErrors(errors);
      } else {
        alert("حدث خطأ أثناء تحديث الموظف");
      }
    },
  });

  const handleSubmit = () => {
    // Clear previous validation errors
    setValidationErrors({});

    const name = document.getElementById("employee-name").value;
    const phone = document.getElementById("employee-phone").value;
    const email = document.getElementById("employee-email").value;
    const password = document.getElementById("employee-password").value;

    if (!name || !phone || !selectedRole) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // For edit mode, email and password are optional
    if (!isEdit) {
      if (!email) {
        alert("يرجى إدخال البريد الإلكتروني");
        return;
      }
      if (!password) {
        alert("يرجى إدخال كلمة المرور");
        return;
      }
    }

    const values = {
      name,
      phone,
      email,
      password,
      role: selectedRole,
      hospital_id,
    };

    if (isEdit) {
      updateMutation.mutate({
        token,
        id: employee.id,
        ...values,
      });
    } else {
      createMutation.mutate({
        token,
        ...values,
      });
    }
  };

  const handleClose = () => {
    setValidationErrors({});
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {isEdit ? "تعديل الموظف" : "إضافة موظف جديد"}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الاسم
          </label>
          <input
            id="employee-name"
            type="text"
            defaultValue={initialValues.name}
            required
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
              validationErrors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="اسم الموظف"
            onChange={() =>
              setValidationErrors((prev) => ({ ...prev, name: null }))
            }
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">
              {Array.isArray(validationErrors.name)
                ? validationErrors.name[0]
                : validationErrors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف
          </label>
          <input
            id="employee-phone"
            type="tel"
            defaultValue={initialValues.phone}
            required
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
              validationErrors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="رقم الهاتف"
            onChange={() =>
              setValidationErrors((prev) => ({ ...prev, phone: null }))
            }
          />
          {validationErrors.phone && (
            <p className="mt-1 text-sm text-red-600">
              {Array.isArray(validationErrors.phone)
                ? validationErrors.phone[0]
                : validationErrors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            id="employee-email"
            type="email"
            defaultValue={initialValues.email}
            required={!isEdit}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
              validationErrors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder={
              isEdit
                ? "اتركه فارغاً للحفاظ على البريد الإلكتروني الحالي"
                : "البريد الإلكتروني"
            }
            onChange={() =>
              setValidationErrors((prev) => ({ ...prev, email: null }))
            }
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">
              {Array.isArray(validationErrors.email)
                ? validationErrors.email[0]
                : validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <input
            id="employee-password"
            type="password"
            defaultValue={initialValues.password}
            required={!isEdit}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
              validationErrors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder={
              isEdit
                ? "اتركه فارغاً للحفاظ على كلمة المرور الحالية"
                : "كلمة المرور"
            }
            onChange={() =>
              setValidationErrors((prev) => ({ ...prev, password: null }))
            }
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">
              {Array.isArray(validationErrors.password)
                ? validationErrors.password[0]
                : validationErrors.password}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الدور الوظيفي
          </label>
          <RoleSelect
            value={selectedRole}
            onChange={(value) => {
              setSelectedRole(value);
              setValidationErrors((prev) => ({ ...prev, role: null }));
            }}
            label="اختر الدور"
            disabled={isLoading}
            required
          />
          {validationErrors.role && (
            <p className="mt-1 text-sm text-red-600">
              {Array.isArray(validationErrors.role)
                ? validationErrors.role[0]
                : validationErrors.role}
            </p>
          )}
        </div>
      </div>

      <div className="flex space-x-3 space-x-reverse mt-6">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>جاري {isEdit ? "التحديث" : "الإضافة"}...</span>
            </div>
          ) : isEdit ? (
            "تحديث"
          ) : (
            "إضافة"
          )}
        </button>
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 py-2 px-4 rounded-md transition-colors"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}
