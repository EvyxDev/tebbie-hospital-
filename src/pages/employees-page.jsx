import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Phone, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { getEmployees, deleteEmployee } from "../utlis/https";
import EmployeeDialog from "../components/EmployeeFormDialog";

export default function EmployeesPage() {
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
      alert("حدث خطأ أثناء حذف الموظف");
    },
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = (employee) => {
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
        <button
          onClick={handleAddEmployee}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow transition-colors"
          disabled={deleteMutation.isPending}
        >
          <Plus size={20} />
        </button>
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
                      className="bg-green-100 hover:bg-green-200 text-green-600 p-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={deleteMutation.isPending}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={deleteMutation.isPending}
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
