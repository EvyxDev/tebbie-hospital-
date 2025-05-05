/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SwitchDoctor from "./SwitchDoctor";
import { attendanceDoctor } from "../utlis/https";

const BookingDataDoctor = ({ filteredBookings, selectedDate }) => {
  const doctorId = filteredBookings[0]?.doctor?.id;
  const status = filteredBookings[0]?.status;
  const date = filteredBookings[0]?.date;
console.log(filteredBookings)
  const [attendanceStatus, setAttendanceStatus] = useState();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");

  const mutation = useMutation({
    mutationFn: attendanceDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries("doctor-attendance");
      alert("تم تأكيد غياب الدكتور بنجاح");
      setAttendanceStatus("");
    },
    onError: (error) => {
      console.error("Error assigning specialization:", error);
      setAttendanceStatus("");

      alert("حدث خطأ أثناء تأكيد غياب الدكتور");
    },
  });


  const handleAttendanceToggle = (checked) => {
    if (status === "pending") {
      setAttendanceStatus(checked);
      mutation.mutate({
        token: token,
        doctor_id: doctorId,
        date: date,
      });
    } else {
      alert("لا يمكن تغيير حالة الحضور لأن الحالة تم إلغاؤها");
    }
  };

  const isFutureDate = (date) => {
    const now = new Date();
    const selectedDateTime = new Date(date);
    return selectedDateTime > now;
  };

  return (
    <>
      <div className="flex gap-1 justify-between items-end">
        <h2 className="font-medium">حجوزات اليوم</h2>
        <div className="flex gap-1 justify-end items-end">
          {isFutureDate(selectedDate) && filteredBookings.length > 0 ? (
            <>
              <p className="text-[#8F9BB3] text-md">تأكيد غياب الدكتور</p>
              <SwitchDoctor
                checked={attendanceStatus}
                onChange={handleAttendanceToggle}
              />
            </>
          ) : isFutureDate(selectedDate) ? (
            <p className="text-gray-500">لا توجد حجوزات لهذا اليوم</p>
          ) : (
            <div className="text-red-500 flex justify-center items-center gap-2">
              <p>الموعد قد مر</p>
            </div>
          )}
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        filteredBookings.map((booking) => (
          <div key={booking.id} className="my-4 shadow-sm bg-white rounded-lg py-2">
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