import { Link, useParams } from "react-router-dom";
import { getSpecialization } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import LoaderComponent from "./LoaderComponent";
import { doctorIcon, exportIcon } from "../assets";

const Speizlization = () => {
  const { speizId } = useParams();
  const token = localStorage.getItem("authToken");
  // const [activeTab, setActiveTab] = useState("pending");

  // Handle booking status change
  // const handleBookingStatusChange = (bookingId, isCompleted) => {
  //   console.log(
  //     `Booking ${bookingId} status changed to:`,
  //     isCompleted ? "finished" : "pending"
  //   );
  // };

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

  // Ensure bookings is an array
  // const bookingsArray = Array.isArray(specializationData.bookings)
  //   ? specializationData.bookings
  //   : [];

  // Count bookings by status
  // const statusCounts = {
  //   finished: bookingsArray.filter((b) => b.status === "finished").length,
  //   pending: bookingsArray.filter((b) => b.status === "pending").length,
  //   cancelled: bookingsArray.filter((b) => b.status === "cancelled").length,
  // };

  // const filteredBookings = bookingsArray.filter((booking) => {
  //   switch (activeTab) {
  //     case "finished":
  //       return booking.status === "finished";
  //     case "pending":
  //       return booking.status === "pending";
  //     case "cancelled":
  //       return booking.status === "cancelled";
  //     default:
  //       return true;
  //   }
  // });

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
            className="bg-[#EDF0FA] h-36 rounded-md w-full p-4 items-center flex flex-col justify-between"
          >
            <div className="h-14">
              <img className="h-12 w-12" alt="Refund Icon" src={doctorIcon} />
            </div>
            <h2 className="text-[#677294] font-[500]">الدكاترة</h2>
          </Link>
          {/* <Link
            to={`/specialization/booking/${specializationData.specialization.id}`}
            className="bg-[#EDF0FA] h-36 rounded-md w-full p-4 flex flex-col justify-between"
          >
            <div className="h-12">
              <img className="h-12 w-12" alt="Booking Icon" src={bookingIcon} />
            </div>
            <h2 className="text-[#677294] font-[500]">الحجوزات</h2>
          </Link> */}
          <Link
            to="/specialization/refunds"
            className="bg-[#EDF0FA] h-36 items-center rounded-md w-full p-4 flex flex-col justify-between"
          >
            <div className="h-14">
              <img className="h-12 w-12" alt="Refund Icon" src={exportIcon} />
            </div>
            <h2 className="text-[#677294] font-[500]">الاستردادات</h2>
          </Link>
        </div>

        {/* <div className="w-full h-full">
          <h2 className="font-[500] text-lg mb-4">الحجوزات</h2>

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

          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
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
              <p>لا توجد حجوزات في هذه الفئة</p>
            </div>
          )}
        </div> */}
      </div>
    </section>
  );
};

export default Speizlization;
