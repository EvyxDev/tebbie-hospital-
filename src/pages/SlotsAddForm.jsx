/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoIosAdd, IoMdAdd, IoMdCloseCircle } from "react-icons/io";
import { assignSpecialization } from "../utlis/https";

const SlotsAddForm = ({
  DoctorsBookingloading,
  isTimeModalOpen,
  initialDoctorsBookingData,
  setTimeIsModalOpen,
  setIsModalOpen,
  sId,
}) => {
  const token = localStorage.getItem("authToken");
  const [slots, setSlots] = useState([]);
  const [daysWithSlots, setDaysWithSlots] = useState([
    { day_id: "", slots: [] },
  ]);
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
      day_id: values.day_id,
      start_time: values.start_time,
      end_time: values.end_time,
    };
    setSlots((prev) => [...prev, newSlot]);
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
      doctor_id: values.doctor_id,
      specialization_id: sId,
      price: values.price,
      waiting_time: values.waiting_time,
      slots: slots,
    };
    mutation.mutate(dataToSend);
    setIsModalOpen(false);
    setSlots([]);
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
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end max-w-md mx-auto "
      onClick={() => setIsModalOpen(false)}
    >
      <motion.div
        className="bg-white w-full rounded-t-3xl p-6 "
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          if (info?.offset?.y && info.offset.y > 150) {
            setIsModalOpen(false);
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center items-center bg-gray-300 w-28 h-[4px] rounded-full mb-4 mx-auto cursor-grab"></div>
        <h2 className="text-lg font-medium text-center mb-4">بيانات الدكتور</h2>
        <div className="overflow-y-auto max-h-[70vh] p-3">
          <Formik
            initialValues={{
              doctor_id: "",
              day_id: "",
              start_time: "",
              end_time: "",
              price: "",
              waiting_time: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.day_id) {
                errors.day_id = "الرجاء اختيار اليوم";
              }
              if (!values.doctor_id) {
                errors.doctor_id = "الرجاء اختر طبيب";
              }
              if (!values.waiting_time) {
                errors.waiting_time = "وقت الزياره مطلوب";
              }
              if (!values.price) {
                errors.price = "السعر مطلوب";
              }
              if (!values.start_time) {
                errors.start_time = "وقت البدء مطلوب";
              }
              if (!values.end_time) {
                errors.end_time = "وقت الانتهاء مطلوب";
              }
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({ isValid, setFieldValue, values }) => (
              <Form>
                {DoctorsBookingloading ? (
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
                      <option value="">الطبيب</option>
                      {initialDoctorsBookingData?.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                    </Field>

                    <ErrorMessage
                      name="doctor_id"
                      component="div"
                      className="text-red-500 text-sm mb-3"
                    />
                  </>
                )}
                <div>
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
                          slots
                            .filter((slot) => slot.day_id === day.day_id)
                            .map((slot, slotIndex) => (
                              <span
                                key={slotIndex}
                                className="border-gray-300 w-28 border-[2px] py-2 text-sm text-center px-2 h-10 rounded-md flex justify-center items-center relative"
                              >
                                {`${slot.start_time} - ${slot.end_time}`}
                                <IoMdCloseCircle
                                  onClick={() =>
                                    handleRemoveSlot(dayIndex, slotIndex)
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
                </div>
                <ErrorMessage
                  name="start_time"
                  component="div"
                  className="text-red-500 text-sm my-2"
                />
                <ErrorMessage
                  name="end_time"
                  component="div"
                  className="text-red-500 text-sm my-2"
                />
                <ErrorMessage
                  name="day_id"
                  component="div"
                  className="text-red-500 text-sm my-2"
                />
                <Field
                  type="text"
                  name="price"
                  onChange={(e) => setFieldValue("price", e.target.value)}
                  className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-3"
                  placeholder=" سعر الكشف"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <Field
                  type="text"
                  name="waiting_time"
                  onChange={(e) =>
                    setFieldValue("waiting_time", e.target.value)
                  }
                  className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-3"
                  placeholder="مدة الانتظار بين الكشوفات"
                />
                <ErrorMessage
                  name="waiting_time"
                  component="div"
                  className="text-red-500 text-sm mb-3"
                />

                <button
                  type="submit"
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
                        className="bg-white w-full rounded-t-3xl p-6 overflow-y-auto"
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
                          مواعيد الطبيب
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
  );
};
export default SlotsAddForm;
