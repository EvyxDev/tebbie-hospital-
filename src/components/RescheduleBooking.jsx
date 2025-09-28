/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDoctorSlots, rescheduleBooking } from "../utlis/https";
import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";

const RescheduleBooking = ({ bookingId, doctorId, onSuccess, onCancel }) => {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const [selectedNewSlotId, setSelectedNewSlotId] = useState("");

  const { data: doctorSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ["doctor-slots", doctorId],
    queryFn: () => getDoctorSlots({ token, id: doctorId }),
    enabled: !!bookingId,
  });

  const rescheduleBookingMutation = useMutation({
    mutationFn: ({ booking_id, new_slot_id, new_date }) =>
      rescheduleBooking({ token, booking_id, new_slot_id, new_date }),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      queryClient.invalidateQueries(["doctor-attendance"]);
      queryClient.invalidateQueries(["specialization"]);
      setSelectedNewSlotId("");
      onSuccess?.();
    },
    onError: () => {
      alert("هذا الموعد محجوز بالفعل");
    },
  });

  const handleConfirmReschedule = () => {
    if (!selectedNewSlotId) {
      alert("الرجاء اختيار موعد جديد");
      return;
    }

    const selectedSlot = availableSlots.find(
      (slot) => slot.id.toString() === selectedNewSlotId
    );

    const payload = {
      booking_id: bookingId,
      new_slot_id: selectedNewSlotId,
    };

    if (selectedSlot?.date) {
      payload.new_date = selectedSlot.date;
    }

    rescheduleBookingMutation.mutate(payload);
  };

  const handleCancelReschedule = () => {
    setSelectedNewSlotId("");
    onCancel?.();
  };

  const availableSlots = doctorSlots?.slots || [];

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

  // Day names mapping
  const dayNames = {
    1: "السبت",
    2: "الأحد",
    3: "الاثنين",
    4: "الثلاثاء",
    5: "الأربعاء",
    6: "الخميس",
    7: "الجمعة",
  };

  const getSlotDisplayText = (slot) => {
    if (slot.slot_type === "slots" && slot.day_id) {
      const dayName = dayNames[slot.day_id] || "";
      return `${dayName} - ${convertTo12Hour(
        slot.start_time
      )} إلى ${convertTo12Hour(slot.end_time)}`;
    }

    if (slot.slot_type === "intervals") {
      return slot.date;
    }

    return `${slot.date} - ${convertTo12Hour(
      slot.start_time
    )} إلى ${convertTo12Hour(slot.end_time)}`;
  };

  if (slotsLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-sm text-gray-500">جاري تحميل المواعيد...</div>
      </div>
    );
  }
  console.log(availableSlots);
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="font-medium text-gray-700 mb-3">إعادة جدولة الحجز</h4>

      <div className="space-y-3">
        <Box>
          <FormControl fullWidth style={{ direction: "rtl" }}>
            <InputLabel id="slot-select-label">اختر موعد جديد</InputLabel>
            <Select
              labelId="slot-select-label"
              value={selectedNewSlotId}
              onChange={(e) => setSelectedNewSlotId(e.target.value)}
              label="اختر موعد جديد"
              fullWidth
              sx={{
                direction: "rtl",
                "& .MuiSelect-select": {
                  textAlign: "right",
                  direction: "rtl",
                },
              }}
            >
              <MenuItem fullWidth style={{ direction: "rtl" }} value="">
                <em>اختر موعد</em>
              </MenuItem>
              {availableSlots.map((slot) => (
                <MenuItem
                  fullWidth
                  style={{ direction: "rtl" }}
                  key={slot.id}
                  value={slot.id}
                >
                  {getSlotDisplayText(slot)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <div className="flex gap-2">
          <button
            onClick={handleConfirmReschedule}
            disabled={!selectedNewSlotId || rescheduleBookingMutation.isPending}
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {rescheduleBookingMutation.isPending ? "جاري الحفظ..." : "تأكيد"}
          </button>

          <button
            onClick={handleCancelReschedule}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleBooking;
