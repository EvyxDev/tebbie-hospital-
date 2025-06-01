/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns"; // Add this import
import SwitchDoctor from "./SwitchDoctor";
import { attendanceDoctor } from "../utlis/https";

const BookingDataDoctor = ({
  filteredBookings,
  selectedDate,
  doctorId,
  doctorsDetails,
}) => {
  const date = filteredBookings[0]?.date || format(selectedDate, "yyyy-MM-dd");
  const [attendanceStatus, setAttendanceStatus] = useState(false);
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");

  const mutation = useMutation({
    mutationFn: attendanceDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries("doctor-attendance");
      alert("تم تأكيد غياب الدكتور بنجاح");
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

  const isFutureDate = (date) => {
    const now = new Date();
    const selectedDateTime = new Date(date);
    return selectedDateTime > now;
  };

  const isDoctorAbsent = filteredBookings.some(
    (booking) =>
      booking.status === "cancelled" && booking.reason === "doctor_absent"
  );
  const hasCancelledBooking = filteredBookings.some(
    (booking) => booking.status === "cancelled"
  );
  const isCanceledDay = doctorsDetails?.canceled_days?.includes(date);
  return (
    <>
      <div className="flex gap-1 justify-between items-end">
        <h2 className="font-medium">حجوزات اليوم</h2>
        <div className="flex gap-1 justify-end items-end">
          {isFutureDate(selectedDate) &&
          !hasCancelledBooking &&
          !isCanceledDay ? (
            <>
              <p className="text-[#8F9BB3] text-md">تأكيد غياب الدكتور</p>
              <SwitchDoctor
                checked={attendanceStatus}
                onChange={handleAttendanceToggle}
              />
            </>
          ) : (
            isFutureDate(selectedDate) && hasCancelledBooking
          )}
        </div>
      </div>

      {isDoctorAbsent ? (
        <p className="text-red-500 text-center my-4">
          الدكتور معتذر عن الحضور لهذا اليوم
        </p>
      ) : filteredBookings.length > 0 && !isDoctorAbsent ? (
        filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="my-4 shadow-sm bg-white rounded-lg py-2"
          >
            <div className="p-4 rounded-lg">
              <span className="flex gap-2">
                <div className="InputPrimary mt-1" />
                <p className="font-medium">{booking.date}</p>
              </span>
              <h3 className="text-xl font-normal my-1">
                {booking.user?.name || "اسم غير متوفر"}
              </h3>
              <div className="flex justify-between">
                <h3 className="text-[#8F9BB3] text-md">
                  {booking.doctor?.name || "غير متوفر"}
                </h3>
                {booking.status === "cancelled" && (
                  <p className="text-red-500">تم إلغاء الحجز</p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center my-4">لا توجد حجوزات متاحة</p>
      )}
    </>
  );
};

export default BookingDataDoctor;
