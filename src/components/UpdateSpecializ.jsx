/* eslint-disable react/prop-types */

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDoctorSlots } from "../utlis/https";
import IntervalForm from "./Interval-form";
import SlotForm from "./slot-form";

const UpdateSpecializ = ({
  isUpdateModalOpen,
  isTimeModalOpen,
  setTimeIsModalOpen,
  setUpdateModalOpen,
  sId,
  selectedDoctorId,
  setIsModalOpen,
}) => {
  const [activeTab, setActiveTab] = useState(null);
  const token = localStorage.getItem("authToken");

  // Reset tab when modal closes
  useEffect(() => {
    if (!isUpdateModalOpen) {
      setActiveTab(null);
    }
  }, [isUpdateModalOpen]);

  // Fetch doctor slots data to check for existing intervals
  const { data: doctorSlotData } = useQuery({
    queryKey: ["doctor-slots-check", selectedDoctorId],
    queryFn: () => getDoctorSlots({ token, id: selectedDoctorId }),
    enabled: !!selectedDoctorId && isUpdateModalOpen,
  });

  // Check if there are existing intervals
  const hasIntervals =
    doctorSlotData?.slots?.some((slot) => slot.slot_type === "intervals") ||
    false;

  // Check if there are existing slots
  const hasSlots =
    doctorSlotData?.slots?.some((slot) => slot.slot_type === "slots") || false;

  // Handle tab switching with warning
  const handleTabSwitch = (tabName) => {
    if (tabName === "slots" && hasIntervals) {
      alert("يجب حذف الفترات الزمنية الموجودة أولاً قبل إضافة مواعيد محددة");
      return;
    }
    if (tabName === "intervals" && hasSlots) {
      alert("يجب حذف المواعيد المحددة الموجودة أولاً قبل إضافة فترات زمنية");
      return;
    }
    setActiveTab(tabName);
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

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

            {/* Tabs Navigation */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleTabSwitch("slots")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "slots"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                مواعيد محددة
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch("intervals")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "intervals"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                فترات زمنية
              </button>
            </div>
            {activeTab === "slots" && (
              <SlotForm
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
            )}
            {activeTab === "intervals" && (
              <IntervalForm
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
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default UpdateSpecializ;
