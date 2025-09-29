/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  confirmDoctorAttendance,
  cancelDoctorAttendance,
  approveBooking,
} from "../utlis/https";
import { Snackbar, Alert, Button, ButtonGroup } from "@mui/material";
import RescheduleBooking from "./RescheduleBooking";

const BookingCard = ({ booking, showSwitch = true, doctorId }) => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showReschedule, setShowReschedule] = useState(false);

  // Check booking date status
  const getBookingDateStatus = () => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return "past";
    } else if (bookingDate.getTime() === today.getTime()) {
      return "today";
    } else {
      return "future";
    }
  };

  // Confirm attendance mutation
  const confirmAttendanceMutation = useMutation({
    mutationFn: ({ bookingId }) => {
      // Use different endpoint based on booking date
      const dateStatus = getBookingDateStatus();
      if (dateStatus === "today") {
        return confirmDoctorAttendance({ token, bookingId });
      } else if (dateStatus === "future") {
        return approveBooking({ token, bookingId });
      } else {
        // This shouldn't happen as past dates won't show buttons
        return confirmDoctorAttendance({ token, bookingId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["specialization"]);
      queryClient.invalidateQueries(["doctor-attendance"]);
      queryClient.invalidateQueries(["bookings"]);
      queryClient.invalidateQueries(["all-home-visits"]);
      const dateStatus = getBookingDateStatus();
      setSnackbar({
        open: true,
        message:
          dateStatus === "today"
            ? "تم تأكيد حضور الطبيب بنجاح"
            : "تم تأكيد الحضور بنجاح",
        severity: "success",
      });
    },
    onError: (error) => {
      const dateStatus = getBookingDateStatus();
      setSnackbar({
        open: true,
        message:
          error.message ||
          (dateStatus === "today"
            ? "فشل في تأكيد حضور الطبيب"
            : "فشل في تأكيد الحضور"),
        severity: "error",
      });
    },
  });

  // Cancel attendance mutation
  const cancelAttendanceMutation = useMutation({
    mutationFn: ({ bookingId }) => cancelDoctorAttendance({ token, bookingId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["specialization"]);
      queryClient.invalidateQueries(["doctor-attendance"]);
      queryClient.invalidateQueries(["bookings"]);
      queryClient.invalidateQueries(["all-home-visits"]);
      setSnackbar({
        open: true,
        message: "تم إلغاء حضور الطبيب بنجاح",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "فشل في إلغاء حضور الطبيب",
        severity: "error",
      });
    },
  });

  const handleConfirmAttendance = () => {
    confirmAttendanceMutation.mutate({ bookingId: booking.id });
  };

  const handleCancelAttendance = () => {
    cancelAttendanceMutation.mutate({ bookingId: booking.id });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleReschedule = () => {
    setShowReschedule(true);
  };

  const handleRescheduleSuccess = () => {
    setShowReschedule(false);
    setSnackbar({
      open: true,
      message: "تم إعادة جدولة الحجز بنجاح",
      severity: "success",
    });
  };

  const handleRescheduleCancel = () => {
    setShowReschedule(false);
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "cancelled":
        return "ملغي";
      case "pending":
        return "في الانتظار";
      case "completed":
        return "مكتمل";
      case "finished":
        return "مكتمل";
      default:
        return status;
    }
  };

  // Get payment status color
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

  // Get payment status text
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Booking Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">حجز رقم #{booking.id}</h3>
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

      {/* Doctor and Hospital Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">تفاصيل الطبيب</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500">الاسم:</span>{" "}
              {booking.doctor?.name || "غير محدد"}
            </p>
            <p>
              <span className="text-gray-500">المستشفى:</span>{" "}
              {booking.hospital?.name || "غير محدد"}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">تفاصيل الموعد</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500">التاريخ:</span>{" "}
              {formatDate(booking.date)}
            </p>
            <p>
              <span className="text-gray-500">السعر:</span> {booking.price} جنيه
            </p>
            <p>
              <span className="text-gray-500">نقاط مستخدمة:</span>{" "}
              {booking.value_used_points || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Details */}
      {booking.user && (
        <div className="border-t pt-3">
          <h4 className="font-medium text-gray-700 mb-2">تفاصيل المريض</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="text-gray-500">الاسم:</span>{" "}
                {booking.is_for_self
                  ? booking.user.name || "غير محدد"
                  : booking.patient?.name || "غير محدد"}
              </p>
              <p>
                <span className="text-gray-500">رقم الهاتف:</span>{" "}
                {booking.is_for_self
                  ? booking.user.phone || "غير محدد"
                  : booking.patient?.phone || "غير محدد"}
              </p>
            </div>
            <div>
              <p>
                <span className="text-gray-500">نوع الحجز:</span>{" "}
                {booking.is_for_self ? "لنفسه" : "لشخص آخر"}
              </p>
              {!booking.is_for_self && (
                <>
                  <p>
                    <span className="text-gray-500">تاريخ الميلاد:</span>{" "}
                    {booking.patient?.date_of_birth
                      ? formatDate(booking.patient.date_of_birth)
                      : "غير محدد"}
                  </p>
                  <p>
                    <span className="text-gray-500">الجنس:</span>{" "}
                    {booking.patient?.gender
                      ? booking.patient.gender === "female"
                        ? "أنثى"
                        : booking.patient.gender === "male"
                        ? "ذكر"
                        : booking.patient.gender
                      : "غير محدد"}
                  </p>
                </>
              )}
              <p>
                <span className="text-gray-500">حالة الاسترداد:</span>{" "}
                {booking.is_refunded === "true"
                  ? "تم الاسترداد"
                  : "لم يتم الاسترداد"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Section */}
      <div className="border-t pt-3 mt-3">
        <div className="flex gap-2 justify-between items-center">
          {booking.status === "pending" &&
            getBookingDateStatus() !== "past" && (
              <ButtonGroup
                size="small"
                variant="contained"
                className="flex gap-3 items-center"
              >
                <Button
                  onClick={handleCancelAttendance}
                  disabled={
                    confirmAttendanceMutation.isPending ||
                    cancelAttendanceMutation.isPending
                  }
                  color="error"
                  sx={{ fontSize: "0.75rem", minWidth: "120px" }}
                >
                  {cancelAttendanceMutation.isPending
                    ? "جاري الإلغاء..."
                    : "إلغاء الحجز"}
                </Button>
                <Button
                  onClick={handleConfirmAttendance}
                  disabled={
                    confirmAttendanceMutation.isPending ||
                    cancelAttendanceMutation.isPending
                  }
                  color="success"
                  sx={{ fontSize: "0.75rem", minWidth: "120px" }}
                >
                  {confirmAttendanceMutation.isPending
                    ? "جاري التأكيد..."
                    : getBookingDateStatus() === "today"
                    ? "تأكيد الحجز"
                    : "تأكيد الحضور"}
                </Button>
              </ButtonGroup>
            )}

          {booking.status === "cancelled" &&
            getBookingDateStatus() !== "past" && (
              <ButtonGroup
                size="small"
                variant="contained"
                className="flex gap-3 items-center"
              >
                <Button
                  onClick={handleConfirmAttendance}
                  disabled={
                    confirmAttendanceMutation.isPending ||
                    cancelAttendanceMutation.isPending
                  }
                  color="success"
                  sx={{ fontSize: "0.75rem", minWidth: "120px" }}
                >
                  {confirmAttendanceMutation.isPending
                    ? "جاري التأكيد..."
                    : getBookingDateStatus() === "today"
                    ? "تأكيد الحجز"
                    : "تأكيد الحضور"}
                </Button>
              </ButtonGroup>
            )}

          {booking.status === "finished" && (
            <div className="text-sm text-green-600 font-medium">
              تم إكمال الحجز
            </div>
          )}

          {getBookingDateStatus() === "past" && (
            <div className="text-sm text-gray-500 font-medium">
              لا يمكن اتخاذ أي إجراء للحجوزات السابقة
            </div>
          )}

          <div className="text-sm text-gray-500">
            آخر تحديث: {formatDate(booking.updated_at)}
          </div>
        </div>
      </div>

      {/* Reschedule Button Row */}
      {booking.status === "pending" &&
        doctorId &&
        !showReschedule &&
        getBookingDateStatus() !== "past" && (
          <div className="border-t pt-3 mt-3 flex justify-center">
            <div className="flex justify-start">
              <Button
                onClick={handleReschedule}
                variant="outlined"
                size="small"
                color="secondary"
                sx={{ fontSize: "0.75rem", minWidth: "100px" }}
              >
                إعادة جدولة
              </Button>
            </div>
          </div>
        )}

      {/* Reschedule Component */}
      {showReschedule && doctorId && (
        <div className="mt-4">
          <RescheduleBooking
            bookingId={booking.id}
            doctorId={doctorId}
            onSuccess={handleRescheduleSuccess}
            onCancel={handleRescheduleCancel}
          />
        </div>
      )}

      {/* MUI Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        dir="rtl"
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BookingCard;
