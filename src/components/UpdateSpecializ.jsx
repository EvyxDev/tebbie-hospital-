/* eslint-disable react/prop-types */
import { useMutation, useQuery } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoIosAdd, IoMdAdd, IoMdCloseCircle } from "react-icons/io";
import { getDoctorSlots, updateSpecialization } from "../utlis/https";
import { useQueryClient } from "@tanstack/react-query"; 

const UpdateSpecializ = ({
  isUpdateModalOpen,
  isTimeModalOpen,
  setTimeIsModalOpen,
  setUpdateModalOpen,
  sId,
  selectedDoctorId,
  setIsModalOpen
}) => {
  const token = localStorage.getItem("authToken");
  const { data: doctorSlotData, isLoading: doctorSlotLoading } = useQuery({
    queryKey: ["doctors-slot", selectedDoctorId],
    queryFn: () => getDoctorSlots({ token, id: selectedDoctorId }),
    enabled: !!selectedDoctorId,
  });
  const queryClient = useQueryClient();

  const [slots, setSlots] = useState(doctorSlotData?.slots || []);
  const [newSlots, setNewSlots] = useState([]);

  const [daysWithSlots, setDaysWithSlots] = useState([
    { day_id: "", slots: [] },
  ]);
  const [doctorData, setDoctorData] = useState({
    specialization_id: "",
    price: doctorSlotData?.price || "",  
    name: "",
    doctor_id: "",
    slots: [],
    deleted_slots: [],
  });

  useEffect(() => {
    if (doctorSlotData) {
      setSlots(doctorSlotData.slots);
      setDoctorData({
        specialization_id: null,
        name: doctorSlotData.name,
        price: doctorSlotData.price,
        doctor_id: doctorSlotData.id,
        slots: doctorSlotData.slots.map((slot) => ({
          id: slot.id,
          day_id: slot.day_id,
          start_time: slot.start_time,
          end_time: slot.end_time,
        })),
        deleted_slots: [],
      });
    }
  }, [doctorSlotData]);
  const mutation = useMutation({
    mutationFn: updateSpecialization,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors-slot", selectedDoctorId]);
      setSlots([]);
      setNewSlots([]);
      setIsModalOpen(false);

      alert("تم حفظ التخصص بنجاح");
    },
    onError: (error) => {
      console.error("Error assigning specialization:", error);
      alert("حدث خطأ أثناء حفظ التخصص");
    },
  });
  const handleAddSlot = (values) => {
    const newSlot = {
      day_id: values.day_id,
      start_time: values.start_time,
      end_time: values.end_time,
    };
    setNewSlots((prev) => [...prev, newSlot]);
    setTimeIsModalOpen(false);
  };
  const handleAddDay = () => {
    if (daysWithSlots.length < 7) {
      setDaysWithSlots([...daysWithSlots, { day_id: "", slots: [] }]);
    } else {
      alert("لا يمكن إضافة أكثر من 7 أيام");
    }
  };
  const handleSubmit = (values) => {
    const dataToSend = {
      token: token,
      doctor_id: doctorSlotData.id,
      specialization_id: sId,
      price: values.price,
      waiting_time: values.waiting_time,
      deleted_slots: doctorData.deleted_slots,
      slots: newSlots,
    };
    setIsModalOpen(false);

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
  const handleRemoveNewSlot = (indexToRemove) => {
    setNewSlots((prevSlots) => {
      const updatedSlots = prevSlots.filter((_, index) => index !== indexToRemove);
      return updatedSlots;
    });
  };
  
  const handleRemoveSlot = (slotId) => {
    setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== slotId));
    setDoctorData((prevData) => ({
      ...prevData,
      deleted_slots: [...prevData.deleted_slots, slotId],
    }));
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
            <div className="overflow-y-auto max-h-[70vh] w-full p-3">
              <Formik
                initialValues={{
                  doctor_id: "",
                  day_id: "",
                  start_time: "",
                  end_time: "",
                  waiting_time: "",
                  price: doctorData.price || "",
                }}
                onSubmit={handleSubmit}
              >
                {({ isValid, setFieldValue, values }) => (
                  <Form>
                    <>
                      <div className="my-3 border-[2px] border-gray-200 rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] text-xl flex items-center">
                        <p>{doctorData.name}</p>
                      </div>
                    </>
                    {daysWithSlots.map((day, dayIndex) => (
                      <div key={dayIndex}>
                        <div className="flex justify-center items-center gap-2">
                          <Field
                            as="select"
                            name={`day_id`}
                            className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294]"
                            value={day.day_id}
                            onChange={(e) => {
                              const updatedDaysWithSlots = [...daysWithSlots];
                              updatedDaysWithSlots[dayIndex].day_id =
                                e.target.value;
                              updatedDaysWithSlots[dayIndex].slots = [];
                              setDaysWithSlots(updatedDaysWithSlots);
                              setFieldValue(`day_id`, e.target.value);
                            }}
                          >
                            <option value="">يوم</option>
                            {days.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </Field>

                          <button
                            type="button"
                            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-1 px-1 rounded-full"
                            onClick={handleAddDay}
                          >
                            <IoMdAdd />
                          </button>
                        </div>
                        <div className="my-3 flex flex-wrap gap-2">
                          {day.day_id &&
                            newSlots
                              .filter((slot) => slot.day_id === day.day_id)
                              .map((slot, slotIndex) => (
                                <span
                                  key={slotIndex}
                                  className="border-gray-300 w-28 border-[2px] py-2 text-sm text-center px-2 h-10 rounded-md flex justify-center items-center relative"
                                >
                                  {`${slot.start_time} - ${slot.end_time}`}
                                  <IoMdCloseCircle
                                    onClick={() =>
                                      handleRemoveNewSlot( slotIndex)
                                      }
                                    size={20}
                                    className="absolute -top-3 -right-3 cursor-pointer text-red-500"
                                  />
                                </span>
                              ))}

                          <button
                            type="button"
                            className="border-gray-300 flex justify-center items-center text-gray-300 border-dashed border-[2px] py-2 w-28 h-10 text-center px-4 rounded-md"
                            onClick={() => setTimeIsModalOpen(true)}
                          >
                            <IoIosAdd size={30} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-4">
                      {days.map((day) => {
                        const daySlots = slots.filter(
                          (slot) => slot.day_id === day.id
                        );
                        if (daySlots.length === 0) return null;

                        return (
                          <div key={day.id} className="border-b pb-2 w-full">
                            <h3 className="text-lg font-semibold text-gray-700">
                              {day.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {daySlots.map((slot, index) => (
                                <span
                                  key={index}
                                  className="border-gray-300 w-28 border-[2px] py-2 text-xs text-center px-2 h-10 rounded-md flex justify-center items-center relative"
                                >
                                  {`${convertTo12Hour(
                                    slot.start_time
                                  )} - ${convertTo12Hour(slot.end_time)}`}
                                  <IoMdCloseCircle
                                    onClick={() => handleRemoveSlot(slot.id)}
                                    size={20}
                                    className="absolute -top-3 -right-3 cursor-pointer text-red-500"
                                  />
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Field
                      type="text"
                      name="price"
                      value={values.price}
                      onChange={(e) => setFieldValue("price", e.target.value)}
                      className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-3"
                      placeholder=" سعر الكشف"
                    />
                    {newSlots.length > 0 && (
                      <Field
                        type="text"
                        name="waiting_time"
                        onChange={(e) =>
                          setFieldValue("waiting_time", e.target.value)
                        }
                        className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-3"
                        placeholder="مدة الانتظار بين الكشوفات"
                      />
                    )}

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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default UpdateSpecializ;
