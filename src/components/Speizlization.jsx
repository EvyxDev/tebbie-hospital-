import { Link, useParams } from "react-router-dom";
import { getSpecialization } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import LoaderComponent from "./LoaderComponent";
import BookingCard from "./BookingCard";
import { bookingIcon, doctorIcon, exportIcon } from "../assets";

const Speizlization = () => {
  const { speizId } = useParams();
  const token = localStorage.getItem("authToken");

  // Handle booking status change
  const handleBookingStatusChange = (bookingId, isCompleted) => {
    // You can implement the logic to update booking status here
    console.log(
      `Booking ${bookingId} status changed to:`,
      isCompleted ? "completed" : "pending"
    );
  };

  const {
    data: specializationData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["specialization", speizId],
    queryFn: () => getSpecialization({ id: speizId, token }),
    enabled: !!speizId,
  });

  if (isLoading) return <LoaderComponent />;
  if (error)
    return (
      <div className="h-screen w-full flex justify-center items-center text-md text-red-400">
        <p className="text-red-400">عذرا حدث خطأ ما</p>
      </div>
    );

  if (!specializationData) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-lg ">
        <p> لا توجد حجوزات لهذا الطبيب في هذا التاريخ </p>
      </div>
    );
  }

  return (
    <section className="w-full h-full">
      <div className="flex flex-col gap-6">
        <div className="bg-[#EDF0FA] h-36 rounded-md mt-8 relative">
          <div className="absolute bottom-0 left-8 h-28">
            {specializationData.specialization.firstMediaUrl && (
              <img
                className="h-28 w-28 object-cover"
                alt="doctor Image"
                src={specializationData.specialization.firstMediaUrl}
                loading="lazy"
              />
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/doctors/${specializationData.specialization.id}`}
            className="bg-[#EDF0FA] h-36 rounded-md w-full p-4 flex flex-col justify-between"
          >
            <div className="h-14">
              <img className="h-12 w-12" alt="Refund Icon" src={doctorIcon} />
            </div>
            <h2 className="text-[#677294] font-[500]">الدكاترة</h2>
          </Link>
          <Link
            to={`/specialization/booking/${specializationData.specialization.id}`}
            className="bg-[#EDF0FA] h-36 rounded-md w-full p-4 flex flex-col justify-between"
          >
            <div className="h-12">
              <img className="h-12 w-12" alt="Booking Icon" src={bookingIcon} />
            </div>
            <h2 className="text-[#677294] font-[500]">الحجوزات</h2>
          </Link>
          <Link
            to="/specialization/refunds"
            className="bg-[#EDF0FA] h-36 rounded-md w-full p-4 flex flex-col justify-between"
          >
            <div className="h-14">
              <img className="h-12 w-12" alt="Refund Icon" src={exportIcon} />
            </div>
            <h2 className="text-[#677294] font-[500]">الاستردادات</h2>
          </Link>
        </div>

        <div className="w-full h-full">
          <h2 className="font-[500] text-lg mb-8">الحجوزات القادمة</h2>
          {specializationData.bookings &&
          specializationData.bookings.length > 0 ? (
            <div className="space-y-4">
              {specializationData.bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  showSwitch={true}
                  onStatusChange={handleBookingStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 p-4 bg-white rounded-md shadow-sm h-[30vh] flex justify-center items-center">
              <p>لا توجد حجوزات حالياً</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Speizlization;
