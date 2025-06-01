import { useParams } from "react-router-dom";
import { getBookingsAttendance } from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";
import { useQuery } from "@tanstack/react-query";
import DoctorBookingHeader from "../components/DoctorBookingHeader";
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subMonths,
  getDate,
} from "date-fns";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import BookingDataDoctor from "../components/BookingDataDoctor";

const DoctorBooking = () => {
  const token = localStorage.getItem("authToken");
  const { doctorId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);

  const {
    data: doctorsDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["doctor-attendance", doctorId],
    queryFn: () =>
      getBookingsAttendance({
        token,
        id: doctorId,
      }),
  });
  const bookings = doctorsDetails?.bookings || [];
  const filteredBookings = selectedDate
    ? bookings.filter(
        (booking) => booking.date === format(selectedDate, "yyyy-MM-dd")
      )
    : bookings;

  const [currentDate, setCurrentDate] = useState(new Date());
  const startDay = startOfMonth(currentDate);
  const endDay = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDay, end: endDay });

  const prevMonthEnd = endOfMonth(subMonths(currentDate, 1));
  const emptyDays = Array(getDay(startDay))
    .fill(null)
    .map((_, i) => getDate(prevMonthEnd) - (getDay(startDay) - 1) + i);

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  return (
    <section className="p-4">
      <DoctorBookingHeader />
      <div className="flex flex-col overflow-scroll">
        <div className="flex flex-col h-screen">
          <div className="w-full bg-white z-10 my-4">
            <div className="flex justify-between items-center mb-4">
              <button
                className="w-10 h-10 flex items-center justify-center border rounded-lg text-gray-600 hover:bg-gray-200"
                onClick={handlePrevMonth}
              >
                <IoChevronForward className="text-xl" />
              </button>
              <h5 className="text-lg font-bold text-gray-800">
                {format(currentDate, "MMMM yyyy")}
              </h5>
              <button
                className="w-10 h-10 flex items-center justify-center border rounded-lg text-gray-600 hover:bg-gray-200"
                onClick={handleNextMonth}
              >
                <IoChevronBack className="text-xl" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-600 text-xs">
              {[
                "الأحد",
                "الاثنين",
                "الثلاثاء",
                "الأربعاء",
                "الخميس",
                "الجمعة",
                "السبت",
              ].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mt-4">
              {emptyDays.map((day, i) => (
                <div key={`prev-${i}`} className="text-gray-400">
                  {day}
                </div>
              ))}

              {days.map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const bookingsForDay = bookings.filter(
                  (booking) => booking.date === dayKey
                );
                const isCanceled =
                  doctorsDetails?.canceled_days?.includes(dayKey);
                const isSelected =
                  selectedDate && day.getTime() === selectedDate.getTime();

                return (
                  <div
                    key={dayKey}
                    className={`relative h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer
      ${bookingsForDay.length > 0 ? "bg-green-100" : ""}
      ${isSelected ? "bg-blue-200 border-2 border-blue-300" : ""}
      ${isCanceled ? "bg-red-100" : ""}`}
                    onClick={() => handleDayClick(day)}
                  >
                    <span className="font-bold text-gray-800">
                      {format(day, "d")}
                    </span>
                    {bookingsForDay.length > 0 && (
                      <div className="absolute bottom-1 flex gap-1">
                        {bookingsForDay.slice(0, 3).map((_, i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 bg-green-500 rounded-full"
                          ></span>
                        ))}
                      </div>
                    )}
                    {isCanceled && (
                      <span className="absolute bottom-1 text-xs text-red-600"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {isLoading ? (
            <LoaderComponent />
          ) : error ? (
            <div className="flex justify-center items-center text-md text-red-400 h-[30vh]">
              <p>{error.message}</p>
            </div>
          ) : (
            <>
              {selectedDate ? (
                <div className="flex-1 overflow-y-auto my-4">
                  <BookingDataDoctor
                    filteredBookings={filteredBookings}
                    selectedDate={selectedDate}
                    doctorId={doctorId}
                    doctorsDetails={doctorsDetails}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center my-4">
                  <p className="text-xl text-gray-500">
                    الرجاء اختيار تاريخ لعرض البيانات
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorBooking;
