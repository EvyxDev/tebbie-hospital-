// import { IoIosAdd } from "react-icons/io";
import { useState } from "react";
import { getDoctorsBook } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import SpecializationHeader from "../components/SpecializationHeader";
import { useLocation, useParams } from "react-router-dom";
import AddsSpecializ from "../components/AddsSpecializ";
import UpdateSpecializ from "../components/UpdateSpecializ";
import LoaderComponent from "../components/LoaderComponent";

const AddsSpecialization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isTimeModalOpen, setTimeIsModalOpen] = useState(false);
  const location = useLocation();
  const { sId } = useParams();
  const token = localStorage.getItem("authToken");

  const {
    data: initialDoctorsBookingData,
    isLoading: DoctorsBookingloading,
    isError: doctorsBookingError,
  } = useQuery({
    queryKey: ["doctors-booking", token],
    queryFn: () => getDoctorsBook({ token, id: sId }),
    enabled: !!token && !!sId,
  });
  const handleModal = (id) => {
    setSelectedDoctorId(id);
    setUpdateModalOpen(true);
  };

  if (DoctorsBookingloading) {
    return <LoaderComponent />;
  }
  if (doctorsBookingError) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-md text-red-400">
        <p className="text-red-400">عذرا حدث خطأ ما</p>
      </div>
    );
  }
  return (
    <>
      <SpecializationHeader />
      <section className="h-screen w-full p-4">
        <div className="my-3 border-[2px] border-gray-200 rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] text-xl flex items-center">
          <p>{location.state?.clinicName}</p>
        </div>

        <div className="my-6">
          <h2 className="block font-medium">الاطباء</h2>
          <div className="my-3 flex flex-wrap gap-2">
            {initialDoctorsBookingData.map((slot, index) => (
              <div
                key={index}
                className="border-gray-300 w-32 border-[2px] py-2 text-sm text-center px-4 h-10 rounded-md flex justify-center items-center relative cursor-pointer"
                onClick={() => handleModal(slot.id)}
              >
                {slot.name}
              </div>
            ))}
            {/* d beta3et edafet el mwa3eed new <button
              type="button"
              className="border-gray-300 flex justify-center items-center text-gray-300 border-dashed border-[2px] py-2 w-28 h-10 text-center px-4 rounded-md "
              onClick={() => setIsModalOpen(true)}
            >
              <IoIosAdd size={30} />
            </button> */}
          </div>
        </div>
        <UpdateSpecializ
          {...{
            isUpdateModalOpen,
            isTimeModalOpen,
            setTimeIsModalOpen,
            setUpdateModalOpen,
            setIsModalOpen,
            sId,
            selectedDoctorId,
          }}
        />
        <AddsSpecializ
          {...{
            initialDoctorsBookingData,
            isModalOpen,
            isTimeModalOpen,
            DoctorsBookingloading,
            setTimeIsModalOpen,
            setIsModalOpen,
            sId,
          }}
        />
      </section>
    </>
  );
};

export default AddsSpecialization;
