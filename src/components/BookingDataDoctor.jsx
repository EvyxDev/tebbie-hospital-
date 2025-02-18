import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SwitchDoctor from "./SwitchDoctor";
import { attendanceDoctor } from "../utlis/https";

const BookingDataDoctor = ({ filteredBookings }) => {
  const doctorId = filteredBookings[0]?.doctor?.id;
  const date = filteredBookings[0]?.date;
  const status = filteredBookings[0]?.status;

  const [attendanceStatus, setAttendanceStatus] = useState(status === "cancelled" ? false : true);
console.log(filteredBookings)
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");

  const mutation = useMutation({
    mutationFn: attendanceDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries("doctor-attendance");
      alert("تم تأكيد غياب الدكتور بنجاح");
      setAttendanceStatus("")
    },
    onError: (error) => {
      console.error("Error assigning specialization:", error);
      setAttendanceStatus("")

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

  return (
    <>
      {filteredBookings.length > 0 ? (
        status === "pending" && (
          
          <div className="flex gap-1 justify-between items-end">
            <h2 className="font-medium">
              حجوزات اليوم
            </h2>
            <div className="flex gap-1 justify-end items-end">
            <p className="text-[#8F9BB3] text-md">تأكيد حضور</p>
            <SwitchDoctor
              checked={attendanceStatus}
              onChange={handleAttendanceToggle}
            />
            </div>
          </div>
        )
      ) : (
        <p className="text-center text-gray-600 font-medium">لا توجد حجوزات للتاريخ المختار</p>
      )}

      {filteredBookings.map((booking) => (
        <div key={booking.id} className="my-4 shadow-sm bg-white rounded-lg py-2 ">
          <div className=" p-4 rounded-lg">
            <span className="flex gap-2">
              <div className="InputPrimary mt-1" />
              <p className="font-medium">{booking.date}</p>
            </span>
            <h3 className="text-xl font-normal my-1">{booking.user?.name || "اسم غير متوفر"}</h3>
            <div className="flex justify-between">
              <h3 className="text-[#8F9BB3] text-md">{booking.doctor?.name || "غير متوفر"}</h3>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BookingDataDoctor;
