/* eslint-disable react/prop-types */

import { useState } from "react";
import BookingCard from "./BookingCard";

const BookingData = ({
  filteredBookings,
  SpecializationsData,
  // handleBookingClick,
}) => {
  console.log(SpecializationsData);
  const [activeTab, setActiveTab] = useState("pending");

  // Handle booking status change
  const handleBookingStatusChange = (bookingId, isCompleted) => {
    // You can implement the logic to update booking status here
    console.log(
      `Booking ${bookingId} status changed to:`,
      isCompleted ? "finished" : "pending"
    );
  };

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

      {tabFilteredBookings.length > 0 ? (
        <div className="space-y-4">
          {tabFilteredBookings.map((booking) => (
            <div
              key={booking.id}
              // onClick={() => handleBookingClick(booking)}
              className="cursor-pointer"
            >
              <BookingCard
                booking={booking}
                showSwitch={false}
                onStatusChange={handleBookingStatusChange}
                showReschedule
                doctorId={booking.doctor_id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-4 bg-white rounded-md shadow-sm h-[30vh] flex justify-center items-center text-xl">
          <p> لا توجد حجوزات في هذه الفئة</p>
        </div>
      )}
    </>
  );
};

export default BookingData;
