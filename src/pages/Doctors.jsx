import { useQuery } from "@tanstack/react-query";
import DoctorsHeader from "../components/DoctorsHeader";
import { getDoctorsBooking } from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";
import { mainLogo } from "../assets";
import { Link, useParams } from "react-router-dom";

const Doctors = () => {
  const token = localStorage.getItem("authToken");
const {Id} =useParams()
console.log(Id)
  const {
    data: doctorsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctorsBooking({ token ,id:Id}),
  });
  if (isLoading) return <LoaderComponent />;
  if (error)
    return (
      <div className="h-screen w-full flex justify-center items-center text-md text-red-400">
        <p>{error.message}</p>
      </div>
    );
  return (
    <section>
      <DoctorsHeader />
      <div className="pt-20 p-4">
        <div className="grid gap-4">
          {doctorsData.map((doctor) => (
            <Link
              to={`/doctors/${Id}/${doctor.id}`}
              key={doctor.id}
              state={{ doctorName: doctor.name }} 
              className="flex items-start gap-4 border-[0.5px] shadow-sm rounded-2xl p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="w-20 h-20 rounded-lg  flex-shrink-0">
                <img
                  src={doctor.image || mainLogo}
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between w-full">
                  <p className="text-lg font-semibold text-black">
                    {doctor.name}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  {doctor.booking_count ? doctor.booking_count : " 0"} حجوزات
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
