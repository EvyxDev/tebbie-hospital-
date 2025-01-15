import React, { useState } from "react";
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
import Switch from "../components/Switch";
import {  useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";

const token = localStorage.getItem("authToken");

const Booking = () => {
  const {BookId} = useParams()

  const {
    data: DataBooking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBooking({ token , id:BookId}),
  });
  const navigate = useNavigate();
  console.log(BookId)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0));
  const [selectedDate, setSelectedDate] = useState(null);

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
    const formattedDay = format(day, "yyyy-MM-dd");
    setSelectedDate(formattedDay);
  };


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

  const bookings = DataBooking?.bookings || [];
  const filteredBookings = selectedDate
    ? bookings.filter((booking) => booking.date === selectedDate)
    : bookings;
    console.log(filteredBookings)

    const handleBookingClick = (booking) => {
      localStorage.setItem("selectedDate", JSON.stringify(booking)); 
      navigate(`/specialization/booking/details/${BookId}`);
      console.log(booking.doctor.id)
    };
    
    
  return (
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

          <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-600">
            {["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map(
              (day) => (
                <div key={day}>{day}</div>
              )
            )}
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

              return (
                <div
                  key={dayKey}
                  className={`relative h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer ${
                    bookingsForDay.length > 0 ? "bg-green-100" : ""
                  }`}
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
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto my-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="my-4 shadow-sm bg-white rounded-lg py-2 cursor-pointer"
              >
                <div className="hover:bg-gray-50 p-4 rounded-lg" onClick={() => handleBookingClick(booking)}>
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
                    <div className="flex gap-1 justify-center items-center">
                      <p className="text-[#8F9BB3] text-md">تأكيد حضور</p>
                      <Switch checked={booking.status === "finished"} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              لا توجد حجوزات لليوم المختار
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
