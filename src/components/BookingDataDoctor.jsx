/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns"; // Add this import
import SwitchDoctor from "./SwitchDoctor";
import BookingCard from "./BookingCard";
import { attendanceDoctor } from "../utlis/https";

const BookingDataDoctor = ({
  filteredBookings,
  selectedDate,
  doctorId,
  doctorsDetails,
}) => {
  const date = filteredBookings[0]?.date || format(selectedDate, "yyyy-MM-dd");
  const [attendanceStatus, setAttendanceStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");

  const mutation = useMutation({
    mutationFn: attendanceDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries("doctor-attendance");
      alert("تم تأكيد العملية  بنجاح");
      setAttendanceStatus(false);
    },
    onError: (error) => {
      console.error("Error assigning specialization:", error);
      setAttendanceStatus(false);
      alert("حدث خطأ أثناء تأكيد غياب الدكتور");
    },
  });

  const handleAttendanceToggle = (checked) => {
    setAttendanceStatus(checked);
    mutation.mutate({
      token: token,
      doctor_id: doctorId,
      date: date,
      status: checked ? "absent" : "present",
    });
  };

  // Handle booking status change
  const handleBookingStatusChange = (bookingId, isCompleted) => {
    // You can implement the logic to update booking status here
    console.log(
      `Booking ${bookingId} status changed to:`,
      isCompleted ? "finished" : "pending"
    );
  };

  // const isFutureDate = (date) => {
  //   const now = new Date();
  //   const selectedDateTime = new Date(date);
  //   return selectedDateTime > now;
  // };

  const isDoctorAbsent = filteredBookings.some(
    (booking) =>
      booking.status === "cancelled" && booking.reason === "doctor_absent"
  );
  const hasCancelledBooking = filteredBookings.some(
    (booking) => booking.status === "cancelled"
  );
  const isCanceledDay = doctorsDetails?.canceled_days?.includes(date);

  // Count bookings by status
  const statusCounts = {
    finished: filteredBookings.filter((b) => b.status === "finished").length,
    pending: filteredBookings.filter((b) => b.status === "pending").length,
    cancelled: filteredBookings.filter((b) => b.status === "cancelled").length,
  };

  // Filter bookings based on active tab
  const tabFilteredBookings = filteredBookings.filter((booking) => {
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

  return (
    <>
      <div className="flex gap-1 justify-between items-end mb-4">
        <h2 className="font-medium">حجوزات اليوم</h2>
        <div className="flex gap-1 justify-end items-end">
          {!hasCancelledBooking && !isCanceledDay ? (
            <>
              <p className="text-[#8F9BB3] text-md">تأكيد غياب الدكتور</p>
              <SwitchDoctor
                checked={attendanceStatus}
                onChange={handleAttendanceToggle}
              />
            </>
          ) : (
            <>
              <p className="text-[#8F9BB3] text-md">تأكيد حضور الدكتور</p>
              <SwitchDoctor
                checked={attendanceStatus}
                onChange={handleAttendanceToggle}
              />
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
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

      {isDoctorAbsent ? (
        <p className="text-red-500 text-center my-4">
          الدكتور معتذر عن الحضور لهذا اليوم
        </p>
      ) : tabFilteredBookings.length > 0 && !isDoctorAbsent ? (
        <div className="space-y-4">
          {tabFilteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              showSwitch={true}
              onStatusChange={handleBookingStatusChange}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center my-4">
          لا توجد حجوزات في هذه الفئة
        </p>
      )}
    </>
  );
};

export default BookingDataDoctor;
