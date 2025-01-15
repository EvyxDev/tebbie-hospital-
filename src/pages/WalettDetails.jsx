import React, { useMemo, useState } from "react";
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
import LoaderComponent from "../components/LoaderComponent";
import { getWallet } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import { dollarIcon } from "../assets";
const token = localStorage.getItem("authToken");

const WalettDetails = () => {
 const { data: walletData, isLoading, error } = useQuery({
  queryKey: ["wallet"],
  queryFn: () => getWallet({ token }),
});

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

const bookings = walletData || [];
const filteredBookings = useMemo(() => {
  if (!selectedDate) return bookings;
  return bookings.filter(
    (booking) =>
      format(new Date(booking.created_at), "yyyy-MM-dd") === selectedDate
  );
}, [selectedDate, bookings]);

const totalAmount = useMemo(() => {
  const sum = filteredBookings.reduce(
    (acc, booking) => acc + parseFloat(booking.price || 0),
    0
  );
  return new Intl.NumberFormat("ar-EG", {
    minimumFractionDigits: 0,
  }).format(sum);
}, [filteredBookings]);

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
    <>
      <div className="flex flex-col   overflow-scroll  ">
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
                  (booking) => booking.created_at === dayKey
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
            <div className="flex justify-between">
              <h2 className="text-xl font-normal">المعاملات</h2>
              <div className="min-w-22 flex text-sm gap-2 justify-center items-center bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-lg px-4 py-2">
                الاجمالى {totalAmount} د.ل
              </div>
            </div>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="my-4 shadow-sm bg-white rounded-lg py-2"
                >
                  <div className="m-4 mt-8">
                    <div className="flex gap-2 ">
                      <div className="bg-[#D6EEF6] p-4 rounded-full w-16 h-16 flex-shrink-0">
                        <img
                          className="w-12"
                          alt=" dollar Icon"
                          src={dollarIcon}
                        />
                      </div>

                      <div className="flex-col flex space-y-2">
                        <h2 className="font-medium text-md">
                          تم تحويل مبلغ {booking.price} دينار ليبي
                        </h2>

                        <p className="text-sm font-normal">
                          {booking.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[30vh] flex justify-center items-center">
                <p className="text-center text-gray-600 text-xl">
                لا توجد حجوزات لليوم المختار
              </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WalettDetails;
