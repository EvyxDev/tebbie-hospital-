import { IoIosAdd } from "react-icons/io";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  assignSpecialization,
  getDoctors,
  getSpecializations,
} from "../utlis/https";
import { useMutation, useQuery } from "@tanstack/react-query";
import SpecializationHeader from "../components/SpecializationHeader";
import { Formik, Field, Form } from "formik";
import { IoMdCloseCircle } from "react-icons/io";

const token = localStorage.getItem("authToken");

const days = [
  { id: 1, name: "السبت" },
  { id: 2, name: "الأحد" },
  { id: 3, name: "الإثنين" },
  { id: 4, name: "الثلاثاء" },
  { id: 5, name: "الأربعاء" },
  { id: 6, name: "الخميس" },
  { id: 7, name: "الجمعة" },
];

const AddsSpecialization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeModalOpen, setTimeIsModalOpen] = useState(false);

  const [slots, setSlots] = useState([]);
  const [visitTime, setVisitTime] = useState("");

  const { data: specializationsData, isLoading: specializationsDataLoading } =
    useQuery({
      queryKey: ["specializations", token],
      queryFn: () => getSpecializations({ token }),
    });

  const { data: doctorsData, isLoading: doctorsDataLoading } = useQuery({
    queryKey: ["doctors", token],
    queryFn: () => getDoctors({ token }),
  });

  const mutation = useMutation({
    mutationFn: assignSpecialization,
    onSuccess: (response) => {
      console.log("Specialization assigned successfully:", response);
      alert("تم حفظ التخصص بنجاح");
    },
    onError: (error) => {
      console.error("Error assigning specialization:", error);
      alert("حدث خطأ أثناء حفظ التخصص");
    },
  });

  const handleAddSlot = (slot) => {
    setSlots((prev) => [...prev, slot]);
    setIsModalOpen(false);
  };
  

  const handleSubmit = (values) => {
    const dataToSubmit = {
      token,
      specialization_id: values.specialization_id,
      price: values.price,
      visit_time: visitTime,
      slots,
    };

    mutation.mutate(dataToSubmit);
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };
  const handleRemoveSlot = (indexToRemove) => {
    setSlots((prevSlots) => prevSlots.filter((_, index) => index !== indexToRemove));
  };
  
  return (
    <>
      <SpecializationHeader />
      <section className="h-screen w-full p-4">
        <Formik
          initialValues={{
            specialization_id: "",
            price: "",
            visit_time: "",
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="my-3">
              {specializationsDataLoading ? (
                <p>جارٍ تحميل التخصصات...</p>
              ) : (
                <Field
                  as="select"
                  name="specialization_id"
                  className="border-[2px] border-gray-200 rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294]"
                >
                  <option value="">التخصصات</option>
                  {specializationsData?.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
                </Field>
              )}
            </div>
            <div className="my-4">
              <Field
                name="price"
                id="price"
                placeholder="السعر"
                className="border-[2px] border-gray-200 rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294]"
              />
            </div>
            <div className="my-6">
              <h2 className="block font-medium">ساعات العمل</h2>
              <div className="my-3 flex flex-wrap  gap-2">
                {slots.map((slot, index) => (
                  <span
                    key={index}
                    className="border-gray-300 w-32 border-[2px] py-2 text-sm text-center px-4 h-10 rounded-md flex justify-center items-center relative"
                  >
                    {` ${slot.start_time} - ${slot.end_time}`}
                    <IoMdCloseCircle
                  onClick={() => handleRemoveSlot(index)}
                  size={20}
                      className="absolute -top-3 -right-3 cursor-pointer text-red-500"
                    />
                  </span>
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
            <div className="my-6">
              <div className="my-3 flex  items-center gap-4">
                <h2 className="font-medium"> مدة الانتظار بين الكشوفات</h2>

                <button
                  type="button"
                  onClick={() => setTimeIsModalOpen(true)}
                  className="border-gray-300 flex justify-center items-center text-gray-300 border-dashed border-[2px] py-2 w-28 h-10 text-center px-4 rounded-md relative"
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
          </Form>
        </Formik>

        <AnimatePresence>
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end max-w-md mx-auto"
              onClick={() => setIsModalOpen(false)}
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
                  if (info.offset.y > 150) {
                    setIsModalOpen(false);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-medium text-center mb-4">
                  ساعات العمل
                </h2>
                <Formik
                  initialValues={{
                    day_id: "",
                    start_time: "",
                    end_time: "",
                  }}
                  onSubmit={(values) => handleAddSlot(values)}
                >
                  <Form>
                    <Field
                      as="select"
                      name="day_id"
                      className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294]"
                    >
                      <option value="">اختر اليوم</option>
                      {days.map((day) => (
                        <option key={day.id} value={day.id}>
                          {day.name}
                        </option>
                      ))}
                    </Field>
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
                    {doctorsDataLoading ? (
                      <p>جارٍ تحميل الدكاتره ...</p>
                    ) : (
                      <Field
                        as="select"
                        name="doctor_id"
                        className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-3"
                      >
                        <option value=""> الطبيب</option>
                        {doctorsData?.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.name}
                          </option>
                        ))}
                      </Field>
                    )}

                    <button
                      type="submit"
                      className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg rounded-tr-lg w-full"
                    >
                      حفظ
                    </button>
                  </Form>
                </Formik>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
                  if (info.offset.y > 150) {
                    setTimeIsModalOpen(false);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center items-center bg-gray-300 w-28 h-[4px] rounded-full mb-4 mx-auto cursor-grab"></div>
                <h2 className="text-lg font-medium text-center mb-4">
                  مدة الانتظار
                </h2>

                <Formik
                  initialValues={{
                    visit_time: "",
                  }}
                  onSubmit={(values) => {
                    setVisitTime(values.visit_time);
                    setTimeIsModalOpen(false);
                  }}
                >
                  {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                      <Field
                        type="number"
                        name="visit_time"
                        className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] focus:outline-none focus:border-primary w-full text-[#677294] my-3"
                        placeholder="مدة الانتظار"
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg rounded-tr-lg w-full"
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
      </section>
    </>
  );
};

export default AddsSpecialization;
