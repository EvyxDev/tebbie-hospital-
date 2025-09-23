import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  getServiceBookings,
  getAllServices,
  completeServiceBooking,
  cancelServiceBooking,
} from "../utlis/https";

export default function ServiceBookings() {
  const token = localStorage.getItem("authToken");
  const { serviceId } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["service-bookings", serviceId],
    queryFn: () => getServiceBookings({ token, serviceId }),
    enabled: !!token && !!serviceId,
    staleTime: 60_000,
  });

  const { data: allServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllServices({ token }),
    enabled: !!token,
    staleTime: 60_000,
  });

  // Complete booking mutation
  const completeMutation = useMutation({
    mutationFn: ({ bookingId }) => completeServiceBooking({ token, bookingId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["service-bookings", serviceId]);
      alert("تم تأكيد الحجز بنجاح");
    },
    onError: (error) => {
      alert(error.message || "فشل في تأكيد الحجز");
    },
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: ({ bookingId }) => cancelServiceBooking({ token, bookingId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["service-bookings", serviceId]);
      alert("تم إلغاء الحجز بنجاح");
    },
    onError: (error) => {
      alert(error.message || "فشل في إلغاء الحجز");
    },
  });

  const currentService = allServices?.find(
    (s) => String(s.id) === String(serviceId)
  );

  // Ensure bookings is an array
  const bookingsArray = Array.isArray(bookings) ? bookings : [];

  // Count bookings by status
  const statusCounts = {
    finished: bookingsArray.filter((b) => b.status === "finished").length,
    pending: bookingsArray.filter((b) => b.status === "pending").length,
    cancelled: bookingsArray.filter((b) => b.status === "cancelled").length,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("ar-EG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "finished":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "cancelled":
        return "ملغي";
      case "pending":
        return "في الانتظار";
      case "finished":
        return "مكتمل";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "مدفوع";
      case "unpaid":
        return "غير مدفوع";
      case "pending":
        return "في الانتظار";
      default:
        return status;
    }
  };

  if (isLoading)
    return (
      <div className="w-full p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#33A9C7] mx-auto"></div>
        <p className="mt-2">جاري تحميل الحجوزات...</p>
      </div>
    );

  if (error)
    return (
      <div className="w-full p-4 text-center text-red-500">
        حدث خطأ في تحميل الحجوزات
      </div>
    );

  // Filter bookings based on active tab
  const filteredBookings = bookingsArray.filter((booking) => {
    switch (activeTab) {
      case "finished":
        return booking.status === "finished";
      case "pending":
        return booking.status === "pending";
      case "cancelled":
        return booking.status === "cancelled";
      default:
        return true; // Show all
    }
  });

  if (!bookings || bookingsArray.length === 0)
    return (
      <div className="w-full p-4 text-center">
        <div className="text-gray-500 text-lg mb-4">لا توجد حجوزات حالياً</div>
        <div className="text-sm text-gray-400">
          {currentService?.name || `للخدمة رقم #${serviceId}`}
        </div>
      </div>
    );

  return (
    <section className="w-full h-full p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#33A9C7] to-[#3AAB95] rounded-lg p-4 mb-6 text-white">
        <h2 className="text-xl font-bold mb-2">
          حجوزات {currentService?.name || `الخدمة رقم #${serviceId}`}
        </h2>
        <p className="text-sm opacity-90">
          إجمالي الحجوزات: {bookingsArray.length}
        </p>
      </div>

      {/* Tabs - Always show */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab("finished")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-r-lg transition-colors ${
              activeTab === "finished"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
            }`}
          >
            مكتملة ({statusCounts.finished})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-x border-gray-200 transition-colors ${
              activeTab === "pending"
                ? "bg-yellow-600 text-white"
                : "text-gray-600 hover:text-yellow-600 hover:bg-gray-50"
            }`}
          >
            في الانتظار ({statusCounts.pending})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-l-lg transition-colors ${
              activeTab === "cancelled"
                ? "bg-red-600 text-white"
                : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
            }`}
          >
            ملغية ({statusCounts.cancelled})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            لا توجد حجوزات في هذه الفئة
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              {/* Booking Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    حجز رقم #{booking.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {getStatusText(booking.status)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                      booking.payment_status
                    )}`}
                  >
                    {getPaymentStatusText(booking.payment_status)}
                  </span>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    تفاصيل الخدمة
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-500">الخدمة:</span>{" "}
                      {booking.hospital_service?.name || "غير محدد"}
                    </p>
                    <p>
                      <span className="text-gray-500">السعر الإجمالي:</span>{" "}
                      {booking.total_price} جنيه
                    </p>
                    <p>
                      <span className="text-gray-500">عمولة المستشفى:</span>{" "}
                      {booking.hospital_commission} جنيه
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    تفاصيل الموعد
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-500">التاريخ:</span>{" "}
                      {formatDate(booking.slot?.date)}
                    </p>
                    <p>
                      <span className="text-gray-500">الفترة:</span>{" "}
                      {booking.slot?.name_slot || "غير محدد"}
                    </p>
                    <p>
                      <span className="text-gray-500">الوقت:</span>{" "}
                      {formatTime(booking.slot?.from)} -{" "}
                      {formatTime(booking.slot?.to)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              {booking.user && (
                <div className="border-t pt-3">
                  <h4 className="font-medium text-gray-700 mb-2">
                    تفاصيل المريض
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <span className="text-gray-500">الاسم:</span>{" "}
                        {booking.user.name || "غير محدد"}
                      </p>
                      <p>
                        <span className="text-gray-500">
                          البريد الإلكتروني:
                        </span>{" "}
                        {booking.user.email || "غير محدد"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="text-gray-500">رقم الهاتف:</span>{" "}
                        {booking.user.phone || "غير محدد"}
                      </p>
                      <p>
                        <span className="text-gray-500">النقاط:</span>{" "}
                        {booking.user.points || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Booking Details */}
              {(booking.patient_name || booking.patient_phone) && (
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium text-gray-700 mb-2">
                    تفاصيل حجز المريض
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      {booking.patient_name && (
                        <p>
                          <span className="text-gray-500">اسم المريض:</span>{" "}
                          {booking.patient_name}
                        </p>
                      )}
                      {booking.patient_phone && (
                        <p>
                          <span className="text-gray-500">هاتف المريض:</span>{" "}
                          {booking.patient_phone}
                        </p>
                      )}
                    </div>
                    <div>
                      {booking.patient_gender && (
                        <p>
                          <span className="text-gray-500">الجنس:</span>{" "}
                          {booking.patient_gender === "1" ? "ذكر" : "أنثى"}
                        </p>
                      )}
                      {booking.patient_date_of_birth && (
                        <p>
                          <span className="text-gray-500">تاريخ الميلاد:</span>{" "}
                          {formatDate(booking.patient_date_of_birth)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-3 mt-3">
                <div className="flex gap-2">
                  {booking.status === "pending" && (
                    <button
                      onClick={() =>
                        completeMutation.mutate({ bookingId: booking.id })
                      }
                      disabled={completeMutation.isPending}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {completeMutation.isPending
                        ? "جاري التأكيد..."
                        : "تأكيد الحجز"}
                    </button>
                  )}

                  {booking.status !== "cancelled" &&
                    booking.status !== "finished" && (
                      <button
                        onClick={() =>
                          cancelMutation.mutate({ bookingId: booking.id })
                        }
                        disabled={cancelMutation.isPending}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {cancelMutation.isPending
                          ? "جاري الإلغاء..."
                          : "إلغاء الحجز"}
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
