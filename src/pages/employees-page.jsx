import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Settings,
} from "lucide-react";
import { getEmployees, deleteEmployee } from "../utlis/https";
import EmployeeDialog from "../components/EmployeeFormDialog";
import { hasPermission } from "../utils/permissionUtils";

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const token = localStorage.getItem("authToken");
  const hospital_id = localStorage.getItem("hospital_id") || "1";
  const queryClient = useQueryClient();

  const {
    data: employeesData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["employees", hospital_id],
    queryFn: () => getEmployees({ token, hospital_id }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      alert("تم حذف الموظف بنجاح");
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
      alert("error");
    },
  });

  const handleAddEmployee = () => {
    if (!hasPermission("add-employees")) {
      alert("ليس لديك صلاحية لإضافة الموظفين");
      return;
    }
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee) => {
    if (!hasPermission("edit-employees")) {
      alert("ليس لديك صلاحية لتعديل الموظفين");
      return;
    }
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = (employee) => {
    if (!hasPermission("delete-employees")) {
      alert("ليس لديك صلاحية لحذف الموظفين");
      return;
    }
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف الموظف: ${employee.name}؟`
    );
    if (confirmed) {
      deleteMutation.mutate({
        token,
        id: employee.id,
        hospital_id: hospital_id,
      });
    }
  };

  const handleAddRole = () => {
    if (!hasPermission("add-employees")) {
      alert("ليس لديك صلاحية لإضافة الأدوار");
      return;
    }
    navigate("/add-role");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">الموظفين</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border p-4 animate-pulse"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-gray-600">خطأ في تحميل بيانات الموظفين</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">الموظفين</h1>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={handleAddRole}
            className={`p-2 rounded-lg shadow transition-colors ${
              hasPermission("add-employees")
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={
              deleteMutation.isPending || !hasPermission("add-employees")
            }
            title={
              !hasPermission("add-employees")
                ? "ليس لديك صلاحية لإضافة الأدوار"
                : "إضافة دور جديد"
            }
          >
            <Settings size={20} />
          </button>
          <button
            onClick={handleAddEmployee}
            className={`p-2 rounded-lg shadow transition-colors ${
              hasPermission("add-employees")
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={
              deleteMutation.isPending || !hasPermission("add-employees")
            }
            title={
              !hasPermission("add-employees")
                ? "ليس لديك صلاحية لإضافة الموظفين"
                : "إضافة موظف جديد"
            }
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {employeesData?.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-lg shadow-sm border p-4"
          >
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-blue-600" size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {employee.name}
                  </h3>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {employee.role}
                    </span>
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className={`p-1 rounded-full transition-colors ${
                        hasPermission("edit-employees")
                          ? "bg-green-100 hover:bg-green-200 text-green-600"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={
                        deleteMutation.isPending ||
                        !hasPermission("edit-employees")
                      }
                      title={
                        !hasPermission("edit-employees")
                          ? "ليس لديك صلاحية لتعديل الموظفين"
                          : ""
                      }
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee)}
                      className={`p-1 rounded-full transition-colors ${
                        hasPermission("delete-employees")
                          ? "bg-red-100 hover:bg-red-200 text-red-600"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={
                        deleteMutation.isPending ||
                        !hasPermission("delete-employees")
                      }
                      title={
                        !hasPermission("delete-employees")
                          ? "ليس لديك صلاحية لحذف الموظفين"
                          : ""
                      }
                    >
                      {deleteMutation.isPending &&
                      deleteMutation.variables?.id === employee.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {employee.phone && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone size={16} className="ml-2 flex-shrink-0" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  {employee.created_at && (
                    <div className="flex items-center text-gray-500 text-xs">
                      <Calendar size={14} className="ml-2 flex-shrink-0" />
                      <span>
                        تاريخ الإضافة: {formatDate(employee.created_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {(!employeesData || employeesData.length === 0) && (
          <div className="text-center py-12">
            <User className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">لا توجد بيانات موظفين</p>
          </div>
        )}
      </div>

      {/* Employee Dialog */}
      <EmployeeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        employee={selectedEmployee}
        token={token}
        hospital_id={hospital_id}
      />
    </div>
  );
}
