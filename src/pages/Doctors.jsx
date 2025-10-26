import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DoctorsHeader from "../components/DoctorsHeader";
import { getDoctorsBooking } from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";
import { mainLogo } from "../assets";
import { Link, useParams } from "react-router-dom";

const Doctors = () => {
  const token = localStorage.getItem("authToken");
  const { Id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: doctorsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctorsBooking({ token, id: Id }),
  });

  // Filter doctors based on search term
  const filteredDoctors =
    doctorsData?.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
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
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث عن طبيب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              dir="rtl"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredDoctors.map((doctor) => (
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

          {filteredDoctors.length === 0 && searchTerm && (
            <div className="text-center text-gray-500 p-8">
              <p>لم يتم العثور على أي طبيب بهذا الاسم</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
