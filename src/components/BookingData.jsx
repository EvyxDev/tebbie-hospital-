/* eslint-disable react/prop-types */
import Switch from "./Switch";

const BookingData = ({ filteredBookings, handleBookingClick }) => {
  return (
    <>
      {filteredBookings.length > 0 ? (
        filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="my-4 shadow-sm bg-white rounded-lg py-2 cursor-pointer"
          >
            <div
              className="hover:bg-gray-50 p-4 rounded-lg"
              onClick={() => handleBookingClick(booking)}
            >
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
        <div className="text-center text-gray-500 p-4 bg-white rounded-md shadow-sm h-[30vh] flex justify-center items-center text-xl">
          <p> لا توجد حجوزات للفتره المختاره</p>
        </div>
      )}
    </>
  );
};

export default BookingData;
