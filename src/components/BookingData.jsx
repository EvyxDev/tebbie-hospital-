/* eslint-disable react/prop-types */

import BookingCard from "./BookingCard";

const BookingData = ({
  filteredBookings,
  handleBookingClick,
  SpecializationsData,
}) => {
  console.log(SpecializationsData);

  // Handle booking status change
  const handleBookingStatusChange = (bookingId, isCompleted) => {
    // You can implement the logic to update booking status here
    console.log(
      `Booking ${bookingId} status changed to:`,
      isCompleted ? "completed" : "pending"
    );
  };
  return (
    <>
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => handleBookingClick(booking)}
              className="cursor-pointer"
            >
              <BookingCard
                booking={booking}
                showSwitch={false}
                onStatusChange={handleBookingStatusChange}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-4 bg-white rounded-md shadow-sm h-[30vh] flex justify-center items-center text-xl">
          <p> لا توجد حجوزات للفتره المختاره</p>
        </div>
      )}
    </>
  );
};

export default BookingData;
