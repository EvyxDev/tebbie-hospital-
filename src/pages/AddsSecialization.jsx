import { IoIosAdd } from "react-icons/io";
import { useState } from "react";
import { getDoctors, getDoctorsBooking } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import SpecializationHeader from "../components/SpecializationHeader";
import { IoMdCloseCircle } from "react-icons/io";
import { useLocation, useParams } from "react-router-dom";
import AddsSpecializ from "../components/AddsSpecializ";
import UpdateSpecializ from "../components/UpdateSpecializ";

const token = localStorage.getItem("authToken");

const AddsSpecialization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isTimeModalOpen, setTimeIsModalOpen] = useState(false);
  const location = useLocation();
  const { sId } = useParams();

  const { data: doctorsData, isLoading: doctorsDataLoading } = useQuery({
    queryKey: ["doctors", token],
    queryFn: () => getDoctors({ token }),
  });

  const { data: initialDoctorsBookingData, isLoading: DoctorsBookingloading } =
    useQuery({
      queryKey: ["doctors-booking", token],
      queryFn: () => getDoctorsBooking({ token, id: sId }),
    });

  const [DoctorsBookingData, setDoctorsBookingData] = useState([]);

  useState(() => {
    if (initialDoctorsBookingData) {
      setDoctorsBookingData(initialDoctorsBookingData);
    }
  }, [initialDoctorsBookingData]);

  const handleRemoveDoctor = (id) => {
    setDoctorsBookingData((prev) => prev.filter((slot) => slot.id !== id));
  };

  const handleModal = (id) => {
    setSelectedDoctorId(id);
    setUpdateModalOpen(true);
  };

  if (DoctorsBookingloading) {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }

  return (
    <>
      <SpecializationHeader />
      <section className="h-screen w-full p-4">
        <div className="my-3 border-[2px] border-gray-200 rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] text-xl flex items-center">
          <p>{location.state.clinicName}</p>
        </div>

        <div className="my-6">
          <h2 className="block font-medium">الاطباء</h2>
          <div className="my-3 flex flex-wrap gap-2">
            {DoctorsBookingData.map((slot, index) => (
              <div
                key={index}
                className="border-gray-300 w-32 border-[2px] py-2 text-sm text-center px-4 h-10 rounded-md flex justify-center items-center relative cursor-pointer"
                onClick={() => handleModal(slot.id)}
              >
                {slot.name}
                <IoMdCloseCircle
                  size={20}
                  className="absolute -top-3 -right-3 cursor-pointer text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveDoctor(slot.id);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="border-gray-300 flex justify-center items-center text-gray-300 border-dashed border-[2px] py-2 w-28 h-10 text-center px-4 rounded-md "
              onClick={() => setIsModalOpen(true)}
            >
              <IoIosAdd size={30} />
            </button>
          </div>
        </div>

        <div className="my-4">
          <button
            type="submit"
            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg rounded-tr-lg w-full"
          >
            حفظ
          </button>
        </div>
        <UpdateSpecializ
          {...{
            doctorsData,
            isUpdateModalOpen,
            isTimeModalOpen,
            doctorsDataLoading,
            setTimeIsModalOpen,
            setUpdateModalOpen,
            sId,
            selectedDoctorId,
          }}
        />
        <AddsSpecializ
          {...{
            doctorsData,
            isModalOpen,
            isTimeModalOpen,
            doctorsDataLoading,
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
