import { useState, useEffect } from "react";
import Switch from "./Switch";
import { useParams } from "react-router-dom";
import LoaderComponent from "../components/LoaderComponent";
import { useQuery } from "@tanstack/react-query";
import { getBookingDoctor } from "../utlis/https";

const BookingDetails = () => {
  const { doctorId } = useParams();
  const token = localStorage.getItem("authToken");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const storedBooking = localStorage.getItem("selectedDate");
    if (storedBooking) {
      try {
        const parsedBooking = JSON.parse(storedBooking);
        setSelectedBooking(parsedBooking);
      } catch (error) {
        console.error("Error parsing stored booking data:", error);
      }
    }
  }, []);

  const selectedDate = selectedBooking?.date;

  const {
    data: DataBooking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", doctorId, selectedDate],
    queryFn: () => {
      if (!selectedDate) {
        throw new Error("Invalid date");
      }
      return getBookingDoctor({ token, id: doctorId, date: selectedDate });
    },
    enabled: !!selectedDate,
  });

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-md text-red-400">
      <p>{error.message}</p>
    </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto my-4">
      <h2 className="text-xl font-normal">حجوزات اليوم</h2>

      <div className="my-4">
        <p className="font-medium">تاريخ الحجز: {selectedDate || "غير محدد"}</p>
      </div>

      {DataBooking?.bookings?.length > 0 ? (
        DataBooking.bookings.map((booking) => (
          <div
            key={booking.id}
            className="my-4 shadow-sm bg-white rounded-lg py-2"
          >
            <span className="flex gap-2">
              <div className="InputPrimary mt-1" />
              <p className="font-medium">{booking.date}</p>
            </span>
            <h3 className="text-xl font-normal my-1">{booking.user.name}</h3>
            <div className="flex justify-between">
              <h3 className="text-[#8F9BB3] text-md">{booking.doctor.name}</h3>
              <div className="flex gap-1 justify-center items-center">
                  <p className="text-[#8F9BB3] text-md">تأكيد حضور</p>
                  <Switch checked={booking.status === "finished"} />
                </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">
          لا توجد حجوزات لهذا الطبيب في هذا التاريخ.
        </p>
      )}
    </div>
  );
};

export default BookingDetails;
