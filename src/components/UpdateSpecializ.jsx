/* eslint-disable react/prop-types */

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDoctorSlots } from "../utlis/https";
import IntervalForm from "./Interval-form";
import SlotForm from "./slot-form";
import { hasPermission } from "../utils/permissionUtils";

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

  // Check if user has permission to edit doctor
  const canEditDoctor = hasPermission("edit-doctor-by-hospital");

  // Handle tab switching with warning
  const handleTabSwitch = (tabName) => {
    if (!canEditDoctor) {
      alert("ليس لديك صلاحية لتعديل بيانات الدكتور");
      return;
    }
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
                  !canEditDoctor
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : activeTab === "slots"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                disabled={!canEditDoctor}
                title={
                  !canEditDoctor ? "ليس لديك صلاحية لتعديل بيانات الدكتور" : ""
                }
              >
                فترات زمنية
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch("intervals")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !canEditDoctor
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : activeTab === "intervals"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                disabled={!canEditDoctor}
                title={
                  !canEditDoctor ? "ليس لديك صلاحية لتعديل بيانات الدكتور" : ""
                }
              >
                مواعيد محددة
              </button>
            </div>
            {!canEditDoctor ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  غير مصرح لك
                </h3>
                <p className="text-gray-600 text-sm">
                  ليس لديك صلاحية لتعديل بيانات الدكتور
                </p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default UpdateSpecializ;
