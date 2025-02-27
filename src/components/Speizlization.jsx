import Switch from "./Switch";
import { Link, useParams } from "react-router-dom";
import { getSpecialization } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import LoaderComponent from "./LoaderComponent";
import { bookingIcon, doctorIcon, exportIcon } from "../assets";

const Speizlization = () => {
  const { speizId } = useParams();
  const token = localStorage.getItem("authToken");

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

  return (
    <section className="w-full h-full">
      <div className="flex flex-col gap-6">
        <div className="bg-[#EDF0FA] h-36 rounded-md mt-8 relative">
          <div className="absolute bottom-0 left-8 h-28">
            <img
              className="h-28 w-28 object-cover"
              alt="doctor Image"
              src={specializationData.specialization.firstMediaUrl}
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex gap-3">
        <Link
            to="/doctors"
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
          <h2 className="font-[500] text-lg mb-8">الحجز القادم</h2>
          {specializationData.bookings.map((booking) => (
            <div
              key={booking.id}
              className="my-4 shadow-sm bg-white rounded-lg py-2 p-4"
            >
              <span className="flex gap-2">
                <div className="InputPrimary mt-1" />
                <p className="font-medium">{booking.time}</p>
              </span>
              <h3 className="text-xl font-medium my-1">{booking.user.name}</h3>
              <div className="flex justify-between">
                <h3 className="text-[#8F9BB3] text-md">
                  {booking.doctor.name}
                </h3>
                <div className="flex gap-1 justify-center items-center">
                  <p className="text-[#8F9BB3] text-md">تأكيد حضور</p>
                  <Switch checked={booking.status === "finished"} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speizlization;
