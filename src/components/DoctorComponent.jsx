import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Field, Form, Formik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHomeVisit } from "../utlis/https";
import { xrays } from "../assets";

const DoctorComponent = ({ data }) => {
  const [visibleDoctorId, setVisibleDoctorId] = useState(null);
  const [isTimeModalOpen, setTimeIsModalOpen] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();

  const updateVisitMutation = useMutation({
    mutationFn: updateHomeVisit,
    onSuccess: () => {
      queryClient.invalidateQueries(["home-visit"]);
      alert("تم تحديث الزيارة بنجاح");
    },
    onError: (error) => {
      console.error("Error updating visit:", error);
      alert("حدث خطأ أثناء تحديث الزيارة");
    },
  });

  const handlePriceSave = (values) => {
    const dataToSubmit = {
      token,
      home_visit_id: currentDoctorId,
      price: values.price,
      status: "accepted",
    };
    updateVisitMutation.mutate(dataToSubmit);
    setTimeIsModalOpen(false);
  };

  const handleReject = (id) => {
    const dataToSubmit = {
      token,
      home_visit_id: id,
      status: "rejected",
    };
    updateVisitMutation.mutate(dataToSubmit);
  };

  const toggleDetails = (id) => {
    setVisibleDoctorId((prevId) => (prevId === id ? null : id));
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  return (
    <>
      <div className="w-full">
        {data.length > 0 ? (
          data.map((doctor) => (
            <div
              key={doctor.id}
              className="shadow-sm border-[1px] rounded-3xl p-4 my-4"
            >
              <div
                onClick={() => toggleDetails(doctor.id)}
                className="flex gap-4 cursor-pointer"
              >
                <div className="my-4 flex flex-col gap-2 w-auto shrink-0  ">
                  <img
                    className="object-cover w-24 h-24 rounded-full shrink-0 text-md"
                    alt={doctor.user_name}
                    src={doctor.user_image}
                  />
                  <p>{doctor.human_type === "0" ? "ذكر" : "أنثى"}</p>
                </div>

                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <p className="lg:text-2xl md:text-xl text-md">{doctor.user_name}</p>
                    <p className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-lg p-2">
                      {doctor.price}
                    </p>
                  </div>
                  <div className="my-4 lg:text-md md:text-sm text-xs flex justify-between ">
                    <div>
                    {doctor.start_from.split(":").slice(0, 2).join(":")} - {doctor.end_at.split(":").slice(0, 2).join(":")}
                    </div>
                    <span className="ml-2">{doctor.date}</span>
                  </div>
                  <div className="flex justify-between text-[#33A9C5] text-lg underline">
                    {doctor.files.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        className="flex gap-2 items-center"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img alt="xrays icon" className="w-5" src={xrays} />
                        المرفقات
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className={`transition-all overflow-hidden ${
                  visibleDoctorId === doctor.id
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {doctor.notes ? (
                  <p className="my-4 text-start">
                    <strong>حالة المريض: </strong>
                    {doctor.notes}
                  </p>
                ) : (
                  <p>عذراً، لا توجد بيانات</p>
                )}
              </div>
              {doctor?.price === "0.00" && (
                <div className="flex justify-between my-4">
                  <button
                    onClick={() => {
                      setCurrentDoctorId(doctor.id);
                      setTimeIsModalOpen(true);
                    }}
                    className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-xl px-4 py-3 w-32"
                  >
                    قبول
                  </button>
                  <button
                    onClick={() => handleReject(doctor.id)}
                    className="text-[#EB5757] px-4 py-3 shadow-sm rounded-xl w-32"
                  >
                    رفض
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="h-screen flex justify-center items-center text-red-600 text-2xl">
            <p>لا توجد بيانات</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isTimeModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end max-w-md mx-auto z-50"
            onClick={() => setTimeIsModalOpen(false)}
          >
            <motion.div
              className="bg-white w-full rounded-t-3xl p-6 z-50"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (info.offset.y > 150) {
                  setTimeIsModalOpen(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center items-center bg-gray-300 w-28 h-[4px] rounded-full mb-4 mx-auto cursor-grab"></div>
              <h2 className="text-lg font-medium text-center mb-4">
                سعر الزيارة
              </h2>
              <Formik
                initialValues={{
                  price: "",
                }}
                onSubmit={handlePriceSave}
              >
                {({ handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <Field
                      name="price"
                      className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 w-full text-[#677294] my-3"
                      placeholder="السعر"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-lg w-full"
                    >
                      حفظ
                    </button>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DoctorComponent;
