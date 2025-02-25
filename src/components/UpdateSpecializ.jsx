/* eslint-disable react/prop-types */
import { useMutation, useQuery } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoMdAdd, IoMdCloseCircle } from "react-icons/io";
import { assignSpecialization, getDoctorSlots } from "../utlis/https";

const UpdateSpecializ = ({
  doctorsData,
  isUpdateModalOpen,
  isTimeModalOpen,
  doctorsDataLoading,
  setTimeIsModalOpen,
  setUpdateModalOpen,
  sId,
  selectedDoctorId,
}) => {
  const token = localStorage.getItem("authToken");
  const { data: doctorSlotData, isLoading: doctorSlotLoading } = useQuery({
    queryKey: ["doctors-slot", selectedDoctorId],
    queryFn: () => getDoctorSlots({ token, id: selectedDoctorId }),
  });
  const [slots, setSlots] = useState(doctorSlotData?.slots || []);
  useEffect(() => {
    if (doctorSlotData) {
      setSlots(doctorSlotData.slots);
    }
  }, [doctorSlotData]);

  const mutation = useMutation({
    mutationFn: assignSpecialization,
    onSuccess: () => {
      alert("تم حفظ التخصص بنجاح");
    },
    onError: (error) => {
      console.error("Error assigning specialization:", error);
      alert("حدث خطأ أثناء حفظ التخصص");
    },
  });
  const handleAddSlot = (values) => {
    const newSlot = {
      doctor_id: values.doctor_id,
      day_id: values.day_id,
      start_time: values.start_time,
      end_time: values.end_time,
    };
    setSlots((prev) => [...prev, newSlot]);
    setTimeIsModalOpen(false);
  };

  const handleSubmit = (values) => {
    const dataToSend = {
      token: token,
      specialization_id: sId,
      price: values.price,
      visit_time: values.visit_time,
      slots: slots,
    };
    mutation.mutate(dataToSend);
  };
  const convertTo12Hour = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString("ar-EG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleRemoveSlot = (indexToRemove) => {
    setSlots((prevSlots) =>
      prevSlots.filter((_, index) => index !== indexToRemove)
    );
  };
  const days = [
    { id: 1, name: "السبت" },
    { id: 2, name: "الأحد" },
    { id: 3, name: "الإثنين" },
    { id: 4, name: "الثلاثاء" },
    { id: 5, name: "الأربعاء" },
    { id: 6, name: "الخميس" },
    { id: 7, name: "الجمعة" },
  ];
  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };
  if (doctorSlotLoading) {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }
  return (
    <AnimatePresence>
      {isUpdateModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end max-w-md mx-auto"
          onClick={() => setUpdateModalOpen(false)}
        >
          <motion.div
            className="bg-white w-full rounded-t-3xl p-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              if (info?.offset?.y && info.offset.y > 150) {
                setUpdateModalOpen(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center items-center bg-gray-300 w-28 h-[4px] rounded-full mb-4 mx-auto cursor-grab"></div>
            <h2 className="text-lg font-medium text-center mb-4">
              بيانات الدكتور
            </h2>
            <Formik 
              initialValues={{
                doctor_id: "",
                day_id: "",
                start_time: "",
                end_time: "",
                price: "",
                visit_time: "",
              }} onSubmit={handleSubmit}>
              {({ isValid, setFieldValue, values }) => (
                <Form>
                  {doctorsDataLoading ? (
                    <p>جارٍ تحميل الدكاتره ...</p>
                  ) : (
                    <>
                      <Field
                        as="select"
                        name="doctor_id"
                        className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-3"
                        onChange={(e) =>
                          setFieldValue("doctor_id", e.target.value)
                        }
                      >
                        <option >الطبيب</option>
                        {doctorsData?.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.name}
                          </option>
                        ))}
                      </Field>
                    </>
                  )}
                  <div className="flex justify-center items-center  gap-2">
                    <Field
                      as="select"
                      name="day_id"
                      className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294]"
                    >
                      <option value="">يوم</option>
                      {days.map((day) => (
                        <option key={day.id} value={day.id}>
                          {day.name}
                        </option>
                      ))}
                    </Field>
                    <button
                      type="button"
                      onClick={() => setTimeIsModalOpen(true)}
                      className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-1 px-1 rounded-full "
                    >
                      <IoMdAdd />
                    </button>
                  </div>
                  <div className="my-3 flex flex-wrap  gap-2 ">
                    {slots.map((slot, index) => (
                      <span
                        key={index}
                        className="border-gray-300 w-32 border-[2px] py-2 text-xs text-center px-3 h-10 rounded-md flex justify-center items-center relative"
                      >
                        {`${convertTo12Hour(
                          slot.start_time
                        )} - ${convertTo12Hour(slot.end_time)}`}
                        <IoMdCloseCircle
                          onClick={() => handleRemoveSlot(index)}
                          size={20}
                          className="absolute -top-3 -right-3 cursor-pointer text-red-500"
                        />
                      </span>
                    ))}
                  </div>
                  <Field
                    type="text"
                    name="price"
                    onChange={(e) => setFieldValue("price", e.target.value)}
                    className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-3"
                    placeholder=" سعر الكشف"
                  />
                  <Field
                    type="text"
                    name="visit_time"
                    onChange={(e) =>
                      setFieldValue("visit_time", e.target.value)
                    }
                    className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-3"
                    placeholder="مدة الانتظار بين الكشوفات"
                  />
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg rounded-tr-lg w-full ${
                      !isValid && "cursor-not-allowed opacity-70"
                    }`}
                  >
                    حفظ
                  </button>
                  <AnimatePresence>
                    {isTimeModalOpen && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end max-w-md mx-auto"
                        onClick={() => setTimeIsModalOpen(false)}
                      >
                        <motion.div
                          className="bg-white w-full rounded-t-3xl p-6"
                          variants={modalVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          drag="y"
                          dragConstraints={{ top: 0, bottom: 0 }}
                          dragElastic={0.2}
                          onDragEnd={(event, info) => {
                            if (info?.offset?.y && info.offset.y > 150) {
                              setTimeIsModalOpen(false);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-center items-center bg-gray-300 w-28 h-[4px] rounded-full mb-4 mx-auto cursor-grab"></div>
                          <h2 className="text-lg font-medium text-center mb-4">
                            مدة الانتظار
                          </h2>
                          <div className="flex gap-4 my-4">
                            <Field
                              type="time"
                              name="start_time"
                              className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294]"
                            />
                            <Field
                              type="time"
                              name="end_time"
                              className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const slotValues = {
                                day_id: values.day_id,
                                doctor_id: values.doctor_id,
                                start_time: values.start_time,
                                end_time: values.end_time,
                              };
                              handleAddSlot(slotValues);
                            }}
                            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg rounded-tr-lg w-full"
                          >
                            حفظ
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default UpdateSpecializ;
