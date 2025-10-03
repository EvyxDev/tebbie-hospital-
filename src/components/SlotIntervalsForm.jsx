/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import {
  getDoctorSlots,
  updateDoctorSlotIntervals,
  DeleteDocktorSlots,
} from "../utlis/https";
import { CustomTimeField } from "./CustomTimePicker";

export default function SlotIntervalsForm({
  isTimeModalOpen,
  setTimeIsModalOpen,
  sId,
  selectedDoctorId,
  setIsModalOpen,
}) {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();

  const { data: doctorSlotData, isLoading: doctorSlotLoading } = useQuery({
    queryKey: ["doctors-slot-intervals", selectedDoctorId],
    queryFn: () => getDoctorSlots({ token, id: selectedDoctorId }),
    enabled: !!selectedDoctorId,
  });

  const slotIntervalsData = useMemo(
    () =>
      doctorSlotData?.slots?.filter(
        (slot) => slot.slot_type === "slot_intervals"
      ) || [],
    [doctorSlotData]
  );

  const [slotIntervals, setSlotIntervals] = useState(slotIntervalsData || []);
  const [newSlotIntervals, setNewSlotIntervals] = useState([]);
  const [doctorData, setDoctorData] = useState({
    specialization_id: "",
    name: "",
    doctor_id: "",
    intervals: [],
    deleted_intervals: [],
  });

  useEffect(() => {
    if (doctorSlotData) {
      setSlotIntervals(
        doctorSlotData.slots?.filter(
          (slot) => slot.slot_type === "slot_intervals"
        ) || []
      );
      setDoctorData({
        specialization_id: null,
        name: doctorSlotData.name,
        doctor_id: doctorSlotData.id,
        intervals: (doctorSlotData.slot_intervals || []).map((interval) => ({
          id: interval.id,
          day_id: interval.day_id,
          name_slot: interval.name_slot,
          from: interval.from,
          to: interval.to,
          max_capacity: interval.max_capacity,
          relatable_id: interval.relatable_id,
        })),
        deleted_intervals: [],
      });
    }
  }, [doctorSlotData]);

  const mutation = useMutation({
    mutationFn: updateDoctorSlotIntervals,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "doctors-slot-intervals",
        selectedDoctorId,
      ]);
      setSlotIntervals([]);
      setNewSlotIntervals([]);
      setIsModalOpen(false);
      alert("تم حفظ الفترات اليومية بنجاح");
    },
    onError: () => {
      alert("تاكد من ادخال جميع البيانات بشكل صحيح");
    },
  });

  // delete uses the same endpoint shape used elsewhere
  const deleteMutation = useMutation({
    mutationFn: DeleteDocktorSlots,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "doctors-slot-intervals",
        selectedDoctorId,
      ]);
      alert("تم حذف الفترات المحددة بنجاح");
    },
    onError: () => {
      alert("فشل حذف الفترات");
    },
  });

  const handleAddInterval = (values) => {
    const newInterval = {
      day_id: Number(values.day_id),
      name_slot: values.name_slot,
      from: values.from,
      to: values.to,
      max_capacity: parseInt(values.max_capacity),
      relatable_id: doctorSlotData.id,
    };
    setNewSlotIntervals((prev) => [...prev, newInterval]);
    setTimeIsModalOpen(false);
  };

  const handleSubmit = () => {
    if (doctorData.deleted_intervals.length > 0) {
      const deleteData = {
        token: token,
        doctor_id: doctorSlotData.id,
        specialization_id: sId,
        deleted_slots: doctorData.deleted_intervals,
        price: doctorSlotData.price,
      };

      deleteMutation.mutate(deleteData, {
        onSuccess: () => {
          if (newSlotIntervals.length > 0) {
            const addData = {
              token: token,
              doctor_id: doctorSlotData.id,
              specialization_id: sId,
              deleted_intervals: [],
              intervals: newSlotIntervals,
              slot_type: "slot_intervals",
            };
            mutation.mutate(addData);
          } else {
            queryClient.invalidateQueries([
              "doctors-slot-intervals",
              selectedDoctorId,
            ]);
            setSlotIntervals([]);
            setNewSlotIntervals([]);
            setDoctorData((prev) => ({ ...prev, deleted_intervals: [] }));
            setIsModalOpen(false);
            alert("تم حفظ التغييرات بنجاح");
          }
        },
      });
    } else if (newSlotIntervals.length > 0) {
      const dataToSend = {
        token: token,
        doctor_id: doctorSlotData.id,
        specialization_id: sId,
        deleted_intervals: [],
        intervals: newSlotIntervals,
        slot_type: "slot_intervals",
      };
      mutation.mutate(dataToSend);
    }
  };

  const handleRemoveNewInterval = (indexToRemove) => {
    setNewSlotIntervals((prevIntervals) =>
      prevIntervals.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveInterval = (intervalId) => {
    setSlotIntervals((prevIntervals) =>
      prevIntervals.filter((interval) => interval.id !== intervalId)
    );
    setDoctorData((prevData) => ({
      ...prevData,
      deleted_intervals: [...prevData.deleted_intervals, intervalId],
    }));

    const deleteData = {
      token: token,
      doctor_id: doctorSlotData.id,
      specialization_id: sId,
      deleted_slots: [intervalId],
      price: doctorSlotData.price,
    };
    deleteMutation.mutate(deleteData);
  };

  const convertTo12Hour = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("ar-EG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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

  const getDayName = (dayId) => days.find((d) => d.id === Number(dayId))?.name;

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  if (doctorSlotLoading) {
    return <p>loading...</p>;
  }

  return (
    <div className="overflow-y-auto max-h-[70vh] w-full p-3">
      <Formik
        initialValues={{
          day_id: "",
          name_slot: "",
          from: "",
          to: "",
          max_capacity: "",
          relatable_id: "",
        }}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="my-3 border-[2px] border-gray-200 rounded-xl py-3 px-5 h-[50px] w-full text-[#677294] text-xl flex items-center">
              <p>{doctorData.name}</p>
            </div>

            {/* Existing intervals */}
            <div className="flex flex-col gap-4 mb-4">
              {slotIntervals.length > 0 && (
                <h3 className="text-lg font-semibold text-gray-700">
                  الفترات الحالية
                </h3>
              )}
              {slotIntervals.map((interval, index) => (
                <div
                  key={index}
                  className="border border-blue-300 rounded-lg p-3 bg-blue-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-semibold text-blue-700">
                      {interval.name_slot}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveInterval(interval.id)}
                        className="bg-red-500 hover:bg-red-700 font-medium rounded-full text-white py-1 px-2 text-sm"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>
                      <strong>اليوم:</strong> {getDayName(interval.day_id)}
                    </p>
                    <p>
                      <strong>السعة القصوى:</strong> {interval.max_capacity}
                    </p>
                    <p>
                      <strong>من:</strong> {convertTo12Hour(interval.from)}
                    </p>
                    <p>
                      <strong>إلى:</strong> {convertTo12Hour(interval.to)}
                    </p>
                    {/* price display removed */}
                    <p>
                      <strong>معرف الربط:</strong> {interval.relatable_id}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* New intervals */}
            <div className="flex flex-col gap-4 mb-4">
              {newSlotIntervals.length > 0 && (
                <h3 className="text-lg font-semibold text-green-700">
                  الفترات الجديدة
                </h3>
              )}
              {newSlotIntervals.map((interval, index) => (
                <div
                  key={index}
                  className="border border-green-300 rounded-lg p-3 bg-green-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-semibold text-green-700">
                      {interval.name_slot} (جديد)
                    </h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveNewInterval(index)}
                        className="bg-red-500 hover:bg-red-700 font-medium rounded-full text-white py-1 px-2 text-sm"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>
                      <strong>اليوم:</strong> {getDayName(interval.day_id)}
                    </p>
                    <p>
                      <strong>السعة القصوى:</strong> {interval.max_capacity}
                    </p>
                    <p>
                      <strong>من:</strong> {convertTo12Hour(interval.from)}
                    </p>
                    <p>
                      <strong>إلى:</strong> {convertTo12Hour(interval.to)}
                    </p>
                    {/* price display removed */}
                    <p>
                      <strong>معرف الربط:</strong> {interval.relatable_id}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new interval button */}
            <div className="my-4">
              <button
                type="button"
                className="border-gray-300 flex justify-center items-center text-gray-600 border-dashed border-[2px] py-4 w-full h-16 text-center rounded-md hover:bg-gray-50"
                onClick={() => {
                  setTimeIsModalOpen(true);
                }}
              >
                <IoIosAdd size={30} />
                <span className="ml-2">إضافة فترة يومية جديدة</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                doctorData.deleted_intervals.length === 0 &&
                newSlotIntervals.length === 0
              }
              className={`bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg rounded-tr-lg w-full ${
                doctorData.deleted_intervals.length === 0 &&
                newSlotIntervals.length === 0 &&
                "cursor-not-allowed opacity-70"
              }`}
            >
              حفظ الفترات
            </button>

            {/* Modal */}
            <AnimatePresence>
              {isTimeModalOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end max-w-md mx-auto"
                  onClick={() => setTimeIsModalOpen(false)}
                >
                  <motion.div
                    className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
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
                      إضافة فترة يومية
                    </h2>

                    {/* Day */}
                    <div className="mb-4">
                      <label className="block my-2 font-semibold">اليوم</label>
                      <Field
                        as="select"
                        name="day_id"
                        value={values.day_id}
                        onChange={(e) =>
                          setFieldValue("day_id", e.target.value)
                        }
                        className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                      >
                        <option value="">اختر اليوم</option>
                        {days.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </Field>
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                      <label className="block my-2 font-semibold">
                        اسم الفترة
                      </label>
                      <Field
                        type="text"
                        name="name_slot"
                        value={values.name_slot}
                        onChange={(e) =>
                          setFieldValue("name_slot", e.target.value)
                        }
                        className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                        placeholder="مثال: فترة صباحية"
                      />
                    </div>

                    {/* Times */}
                    <div className="flex gap-4 mb-4">
                      <div className="w-full">
                        <label className="block my-2 font-semibold">
                          بداية من
                        </label>
                        <CustomTimeField
                          type="time"
                          name="from"
                          value={values.from}
                          onChange={(val) => setFieldValue("from", val)}
                          className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block my-2 font-semibold">
                          ينتهى فى
                        </label>
                        <CustomTimeField
                          type="time"
                          name="to"
                          value={values.to}
                          onChange={(val) => setFieldValue("to", val)}
                          className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                        />
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="mb-4">
                      <label className="block my-2 font-semibold">
                        السعة القصوى
                      </label>
                      <Field
                        type="number"
                        name="max_capacity"
                        value={values.max_capacity}
                        onChange={(e) =>
                          setFieldValue("max_capacity", e.target.value)
                        }
                        min="1"
                        className="border-[1px] bg-[#F4F4F6] rounded-xl py-3 px-5 h-[50px] w-full text-[#677294]"
                        placeholder="عدد المرضى المسموح"
                      />
                    </div>

                    {/* price input removed */}

                    <button
                      type="button"
                      onClick={() => {
                        const intervalValues = {
                          day_id: values.day_id,
                          name_slot: values.name_slot,
                          from: values.from,
                          to: values.to,
                          max_capacity: values.max_capacity,
                          relatable_id: values.relatable_id,
                        };
                        handleAddInterval(intervalValues);
                      }}
                      className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white py-3 px-4 rounded-bl-lg rounded-tr-lg w-full"
                    >
                      حفظ الفترة
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </Form>
        )}
      </Formik>
    </div>
  );
}
