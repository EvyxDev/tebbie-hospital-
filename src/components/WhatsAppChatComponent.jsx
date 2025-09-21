/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { getEmployees } from "../utlis/https";

const WhatsAppChatComponent = ({ visitData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const token = localStorage.getItem("authToken");
  const hospital_id = localStorage.getItem("hospital_id") || "1";

  const {
    data: employeesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees", hospital_id],
    queryFn: () => getEmployees({ token, hospital_id }),
    enabled: isModalOpen, // Only fetch when modal is open
  });

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").slice(0, 2);
    const hour = parseInt(hours, 10);
    const period = hour < 12 ? "ص" : "م";
    const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const formattedMinutes = minutes.padStart(2, "0");
    return `${formattedHour}:${formattedMinutes} ${period}`;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return phone;
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");
    // Add country code if not present
    if (cleanPhone.startsWith("0")) {
      return `965${cleanPhone.substring(1)}`;
    }
    return cleanPhone.startsWith("965") ? cleanPhone : `965${cleanPhone}`;
  };

  const generateWhatsAppMessage = () => {
    const message = `
 *تفاصيل الزيارة المنزلية*

 *اسم المريض:* ${visitData.user_name}
 *رقم الهاتف:* ${visitData.user_phone}

 *موعد الزيارة:*
 التاريخ: ${visitData.date}
 من: ${formatTime(visitData.start_from)}
 إلى: ${formatTime(visitData.end_at)}

 *السعر:* ${visitData.price} دينار

*نوع الخدمة:* ${visitData.service_type || "غير محدد"}

 *جنس الطبيب المطلوب:* ${visitData.human_type === "0" ? "ذكر" : "أنثى"}

*حالة المريض:*
${visitData.notes}
 *الموقع:*
https://www.google.com/maps?q=${visitData.lat},${visitData.long}

*حالة الزيارة:* ${
      visitData.status === "pending"
        ? "⏳ في الانتظار"
        : visitData.status === "accepted"
        ? "مقبولة"
        : visitData.status === "rejected"
        ? "مرفوضة"
        : visitData.status === "in_the_way"
        ? "في الطريق"
        : visitData.status === "completed"
        ? "تم الإكمال"
        : visitData.status
    }

 *حالة الدفع:* ${
   visitData.payment_status === "paid" ? " تم الدفع" : " لم يتم الدفع"
 }

${visitData.is_rejected_by_user === 1 ? " *تم الإلغاء من قبل المستخدم*" : ""}
`.trim();

    return encodeURIComponent(message);
  };

  const handleEmployeeSelect = (employee) => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${employee.phone}?text=${message}`;

    window.open(whatsappUrl, "_blank");
    setIsModalOpen(false);
    setSelectedEmployee("");
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
        title="مشاركة عبر واتساب"
      >
        <FaWhatsapp size={20} />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end max-w-md mx-auto z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (info.offset.y > 150) {
                  setIsModalOpen(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex justify-center items-center bg-gray-300 w-28 h-[4px] rounded-full mb-4 mx-auto cursor-grab"></div>

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaWhatsapp className="text-[#25D366]" />
                  مشاركة عبر واتساب
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-gray-600 text-center mb-4">
                  اختر موظف لمشاركة تفاصيل الزيارة معه
                </p>

                {/* Loading State */}
                {isLoading && (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-200 h-16 rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center text-red-500 py-8">
                    <p>خطأ في تحميل بيانات الموظفين</p>
                  </div>
                )}

                {/* Employees List */}
                {employeesData && employeesData.length > 0 && (
                  <div className="space-y-3">
                    {employeesData.map((employee) => (
                      <button
                        key={employee.id}
                        onClick={() => handleEmployeeSelect(employee)}
                        className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-right transition-colors duration-200 flex items-center gap-3"
                      >
                        <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                          <FaWhatsapp className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {employee.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {employee.phone}
                          </p>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                            {employee.role}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {employeesData && employeesData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FaWhatsapp
                      size={48}
                      className="mx-auto mb-4 text-gray-300"
                    />
                    <p>لا توجد موظفين متاحين</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppChatComponent;
