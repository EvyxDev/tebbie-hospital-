/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Field, Form, Formik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHomeVisit, updateHomeStatus } from "../utlis/https";
import { doneIcon, intheWay, mainLogo, paidIcon, xrays } from "../assets";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";

const DoctorComponent = ({ data }) => {
  const [visibleDoctorId, setVisibleDoctorId] = useState(null);
  const [isTimeModalOpen, setTimeIsModalOpen] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const [statuses, setStatuses] = useState({});

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
  const updateVisitStatusMutation = useMutation({
    mutationFn: updateHomeStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["home-visit"]);
      alert("تم تحديث الزيارة بنجاح");
      // Reset status for the specific doctor
      setStatuses((prev) => ({ ...prev, [variables.home_visit_id]: null }));
    },
    onError: (error) => {
      console.error("Error updating visit:", error);
      alert("حدث خطأ أثناء تحديث الزيارة");
    },
  });

  const handleCheckboxChange = (home_visit_id, newStatus) => {
    setStatuses((prev) => ({
      ...prev,
      [home_visit_id]: prev[home_visit_id] === newStatus ? null : newStatus,
    }));
  };
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
  const handleAccept = (id) => {
    const dataToSubmit = {
      token,
      home_visit_id: id,
      status: "accepted",
    };
    updateVisitMutation.mutate(dataToSubmit);
  };

  const handleReject = (id) => {
    const dataToSubmit = {
      token,
      home_visit_id: id,
      status: "rejected",
    };
    updateVisitMutation.mutate(dataToSubmit);
  };
  const handleStatusChange = (home_visit_id) => {
    const status = statuses[home_visit_id];
    if (!status) {
      alert("يرجى اختيار حالة");
      return;
    }

    updateVisitStatusMutation.mutate({
      token,
      home_visit_id,
      status,
    });
  };

  const toggleDetails = (id) => {
    setVisibleDoctorId((prevId) => (prevId === id ? null : id));
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").slice(0, 2);
    const hour = parseInt(hours, 10);
    const period = hour < 12 ? "ص" : "م";
    const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${formattedHour}:${minutes} ${period}`;
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
                    src={doctor.user_image || mainLogo}
                    onError={(e) => (e.target.src = mainLogo)}
                  />
                  <p className="text-sm font-medium">
                    الدكتور المطلوب :
                    {doctor.human_type === "0" ? "ذكر" : "أنثى"}
                  </p>
                </div>

                <div className="w-full">
                  <div className="flex justify-between flex-wrap gap-2 items-center">
                    <p className="lg:text-lg text-md truncate font-medium">
                      {doctor.user_name}
                    </p>
                    <p className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] md:text-md text-sm  text-white rounded-lg p-2 whitespace-nowrap">
                      {doctor.price} دينار
                    </p>
                  </div>
                  <div className="my-4 md:text-md text-sm font-semibold  flex flex-col gap-2 text-center items-start">
                    <div className="flex gap-2 justify-center items-center">
                      <div className="relative bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] w-3 h-3 rounded-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                      {formatTime(doctor.start_from)} -
                      {formatTime(doctor.end_at)}
                    </div>

                    <span className="ml-2 flex justify-center items-center text-center ms-5">
                      {doctor.date}
                    </span>
                  </div>

                  <div className="flex gap-2 text-[#33A9C5] text-lg underline w-full my-4 flex-wrap">
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

                  <div className="flex justify-around">
                    <div className="flex gap-2 items-center underline text-[#3AAB95]">
                      <a
                        href={`https://www.google.com/maps?q=${doctor.lat},${doctor.long}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-2 items-center underline text-[#3AAB95]"
                      >
                        الموقع
                        <FaLocationDot />
                      </a>
                    </div>

                    <a
                      href={`tel:${doctor.user_phone}`}
                      className="cursor-pointer flex gap-2 justify-center items-center bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-lg p-2 w-auto"
                    >
                      <IoCall size={18} />
                    </a>
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
                <p className="my-4 text-start">
                  <strong>حالة المريض: </strong>
                  {doctor.notes}
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                {(doctor.payment_status == "paid" ||
                  doctor.status == "completed") && (
                  <div className="flex flex-col items-center gap-2 my-4 text-sm">
                    <div className="size-9 rounded-full bg-[#F4F4F4] flex justify-center items-center">
                      <img
                        alt="paid Icon"
                        width={20}
                        height={20}
                        src={paidIcon}
                      />
                    </div>
                    <p>تم الدفع</p>
                  </div>
                )}
                {doctor.status == "in_the_way" && (
                  <div className="flex flex-col items-center gap-2 my-4 text-sm">
                    <div className="size-9 rounded-full bg-[#F4F4F4] flex justify-center items-center">
                      <img
                        alt="paid Icon"
                        width={20}
                        height={20}
                        src={intheWay}
                      />
                    </div>
                    <p>في الطريق</p>
                  </div>
                )}
                {doctor.status == "completed" && (
                  <div className="flex flex-col items-center gap-2 my-4 text-sm">
                    <div className="size-9 rounded-full bg-[#F4F4F4] flex justify-center items-center">
                      <img
                        alt="paid Icon"
                        width={20}
                        height={20}
                        src={doneIcon}
                      />
                    </div>
                    <p>الزيارة تمت</p>
                  </div>
                )}
              </div>

              {/* Status Update Form */}
              {(doctor.status === "accepted" ||
                doctor.status === "in_the_way") && (
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex gap-4">
                    {doctor.status !== "in_the_way" && (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={statuses[doctor.id] === "in_the_way"}
                          onChange={() =>
                            handleCheckboxChange(doctor.id, "in_the_way")
                          }
                          className="h-5 w-5 InputPrimaryChecked"
                        />
                        في الطريق
                      </label>
                    )}
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={statuses[doctor.id] === "completed"}
                        onChange={() =>
                          handleCheckboxChange(doctor.id, "completed")
                        }
                        className="h-5 w-5 InputPrimaryChecked"
                      />
                      الزيارة تمت
                    </label>
                  </div>
                  <button
                    onClick={() => handleStatusChange(doctor.id)}
                    disabled={updateVisitStatusMutation.isLoading}
                    className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-lg px-4 py-3 w-full"
                  >
                    {updateVisitStatusMutation.isLoading
                      ? "جاري التحديث..."
                      : "تحديث الحالة"}
                  </button>
                </div>
              )}
              {doctor.status == "pending" &&
                (doctor?.price === "0.00" ? (
                  <div className="flex justify-between my-4 text-sm">
                    <button
                      onClick={() => {
                        setCurrentDoctorId(doctor.id);
                        setTimeIsModalOpen(true);
                      }}
                      className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-xl px-4 py-3 w-28"
                    >
                      قبول
                    </button>
                    <button
                      onClick={() => handleReject(doctor.id)}
                      className="text-[#EB5757] px-4 py-3 shadow-sm rounded-xl w-28"
                    >
                      رفض
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between my-4 text-sm">
                    <button
                      onClick={() => handleAccept(doctor.id)}
                      className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-xl px-4 py-3 w-28"
                    >
                      قبول
                    </button>
                    <button
                      onClick={() => handleReject(doctor.id)}
                      className="text-[#EB5757] px-4 py-3 shadow-sm rounded-xl w-28"
                    >
                      رفض
                    </button>
                  </div>
                ))}
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
