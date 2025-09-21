/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee, updateEmployee } from "../utlis/https";

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

  const initialValues = {
    name: employee?.name || "",
    phone: employee?.phone || "",
    role: employee?.role || "user",
    hospital_id: hospital_id,
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      alert("تم إضافة الموظف بنجاح");
      onClose();
    },
    onError: (error) => {
      console.error("Error creating employee:", error);
      alert("حدث خطأ أثناء إضافة الموظف");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      alert("تم تحديث الموظف بنجاح");
      onClose();
    },
    onError: (error) => {
      console.error("Error updating employee:", error);
      alert("حدث خطأ أثناء تحديث الموظف");
    },
  });

  const handleSubmit = () => {
    const name = document.getElementById("employee-name").value;
    const phone = document.getElementById("employee-phone").value;
    const role = document.getElementById("employee-role").value;

    if (!name || !phone || !role) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const values = {
      name,
      phone,
      role,
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

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {isEdit ? "تعديل الموظف" : "إضافة موظف جديد"}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="اسم الموظف"
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="رقم الهاتف"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الدور الوظيفي
          </label>
          <select
            id="employee-role"
            defaultValue={initialValues.role}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="user">موظف</option>
            <option value="doctor">طبيب</option>
            <option value="nurse">ممرض</option>
            <option value="admin">إداري</option>
            <option value="receptionist">استقبال</option>
          </select>
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
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 py-2 px-4 rounded-md transition-colors"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}
