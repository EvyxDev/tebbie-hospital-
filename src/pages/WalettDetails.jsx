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
import LoaderComponent from "../components/LoaderComponent";
import { getWallet } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import WalletData from "../components/WalletData";

const token = localStorage.getItem("authToken");

const WalletDetails = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0));
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });
  const [isSelecting, setIsSelecting] = useState(false);

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
    if (!isSelecting) {
      setSelectedRange({ start: day, end: null });
      setIsSelecting(true);
    } else {
      setSelectedRange((prev) => ({
        ...prev,
        end: day,
      }));
      setIsSelecting(false);
    }
  };

  const {
    data: walletData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet", selectedRange.start, selectedRange.end],
    queryFn: () =>
      getWallet({
        token,
        start: selectedRange.start
          ? format(selectedRange.start, "yyyy-MM-dd")
          : null,
        end: selectedRange.end ? format(selectedRange.end, "yyyy-MM-dd") : null,
      }),
    enabled: !!selectedRange.start && !!selectedRange.end,
  });

  const totalAmount = walletData
    ? new Intl.NumberFormat("ar-EG", {
        minimumFractionDigits: 0,
      }).format(
        walletData.reduce(
          (acc, booking) => acc + parseFloat(booking.price || 0),
          0
        )
      )
    : 0;

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
              const isStartDay =
                selectedRange.start &&
                day.getTime() === selectedRange.start.getTime();
              const isEndDay =
                selectedRange.end &&
                day.getTime() === selectedRange.end.getTime();
              const isInRange =
                selectedRange.start &&
                selectedRange.end &&
                day.getTime() > selectedRange.start.getTime() &&
                day.getTime() < selectedRange.end.getTime();

              return (
                <div
                  key={format(day, "yyyy-MM-dd")}
                  className={`relative h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer ${
                    isStartDay
                      ? "bg-blue-200 border-2 border-blue-300"
                      : isEndDay
                      ? "bg-blue-200 border-2 border-blue-300"
                      : isInRange
                      ? "bg-blue-100"
                      : "bg-white"
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="font-bold text-gray-800">
                    {format(day, "d")}
                  </span>
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
          <WalletData walletData={walletData} />
        </div>
      </div>
    </div>
  );
};

export default WalletDetails;
