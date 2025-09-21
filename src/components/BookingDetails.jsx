import { useState, useEffect } from "react";
import Switch from "./Switch";
import { useParams } from "react-router-dom";
import LoaderComponent from "../components/LoaderComponent";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaWhatsapp } from "react-icons/fa";
import {
  getBookingDoctor,
  getDoctorSlots,
  rescheduleBooking,
} from "../utlis/https";

const BookingDetails = () => {
  const { doctorId } = useParams();
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleBookingId, setRescheduleBookingId] = useState(null);
  const [selectedNewSlotId, setSelectedNewSlotId] = useState("");

  useEffect(() => {
    const storedBooking = localStorage.getItem("selectedDate");
    if (storedBooking) {
      try {
        const parsedBooking = JSON.parse(storedBooking);
        setSelectedBooking(parsedBooking);
      } catch (error) {
        console.error("Error parsing stored booking data:", error);
      }
    }
  }, []);

  const selectedDate = selectedBooking?.date;

  const {
    data: DataBooking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", doctorId, selectedDate],
    queryFn: () => {
      if (!selectedDate) {
        throw new Error("Invalid date");
      }
      return getBookingDoctor({ token, id: doctorId, date: selectedDate });
    },
    enabled: !!selectedDate,
  });

  const { data: doctorSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ["doctor-slots", doctorId],
    queryFn: () => getDoctorSlots({ token, id: doctorId }),
    enabled: !!rescheduleBookingId,
  });

  const rescheduleBookingMutation = useMutation({
    mutationFn: ({ booking_id, new_slot_id, new_date }) =>
      rescheduleBooking({ token, booking_id, new_slot_id, new_date }),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings", doctorId, selectedDate]);
      setRescheduleBookingId(null);
      setSelectedNewSlotId("");
      alert("تم إعادة جدولة الحجز بنجاح");
    },
    onError: () => {
      alert("هذا الموعد محجوز بالفعل ");
    },
  });

  const handleReschedule = (bookingId) => {
    setRescheduleBookingId(bookingId);
    setSelectedNewSlotId("");
  };

  const handleConfirmReschedule = () => {
    if (!selectedNewSlotId) {
      alert("الرجاء اختيار موعد جديد");
      return;
    }

    const selectedSlot = availableSlots.find(
      (slot) => slot.id.toString() === selectedNewSlotId
    );

    const payload = {
      booking_id: rescheduleBookingId,
      new_slot_id: selectedNewSlotId,
    };

    if (selectedSlot?.date) {
      payload.new_date = selectedSlot.date;
    }

    rescheduleBookingMutation.mutate(payload);
  };

  const handleCancelReschedule = () => {
    setRescheduleBookingId(null);
    setSelectedNewSlotId("");
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

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-md text-red-400">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto my-4">
      <h2 className="text-xl font-normal">حجوزات اليوم</h2>

      <div className="my-4">
        <p className="font-medium">تاريخ الحجز: {selectedDate || "غير محدد"}</p>
      </div>

      {DataBooking?.bookings?.length > 0 ? (
        DataBooking.bookings.map((booking) => {
          const patient = booking.patient;
          const user = booking.user;
          const person = patient || user;

          return (
            <div
              key={booking.id}
              className="my-4 shadow-sm bg-white rounded-lg py-2 px-4"
            >
              <span className="flex gap-2">
                <div className="InputPrimary mt-1" />
                <p className="font-medium">{booking.date}</p>
              </span>

              <h3 className="text-lg font-semibold mt-2 mb-1">
                {patient ? "بيانات المريض" : "بيانات المستخدم"}
              </h3>

              <div className="text-sm text-gray-700 space-y-1">
                {/* ✅ الاسم */}
                {person?.name && (
                  <p>
                    <span className="font-medium">الاسم:</span> {person.name}
                  </p>
                )}

                {/* ✅ الهاتف + واتساب */}
                {person?.phone && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">رقم الهاتف:</span>{" "}
                    {person.phone}
                    <a
                      href={`https://wa.me/${person.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-700"
                    >
                      <FaWhatsapp size={18} />
                    </a>
                  </p>
                )}

                {/* ✅ العمر (لو مش 0) */}
                {person?.age && Number(person.age) !== 0 && (
                  <p>
                    <span className="font-medium">العمر:</span> {person.age}
                  </p>
                )}

                {/* ✅ تاريخ الميلاد */}
                {person?.date_of_birth && (
                  <p>
                    <span className="font-medium">تاريخ الميلاد:</span>{" "}
                    {person.date_of_birth}
                  </p>
                )}

                {/* ✅ النوع */}
                {person?.gender && (
                  <p>
                    <span className="font-medium">النوع:</span>{" "}
                    {person.gender === "male" ? "ذكر" : "أنثى"}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mt-3">
                <h3 className="text-[#8F9BB3] text-md">
                  {booking.doctor.name}
                </h3>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 justify-center items-center">
                    <p className="text-[#8F9BB3] text-md">تأكيد حضور</p>
                    <Switch checked={booking.status === "finished"} />
                  </div>

                  {rescheduleBookingId !== booking.id && (
                    <button
                      onClick={() => handleReschedule(booking.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-full"
                    >
                      إعادة جدولة
                    </button>
                  )}
                </div>
              </div>

              {rescheduleBookingId === booking.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold mb-3">
                    اختر موعد جديد:
                  </h4>

                  {slotsLoading ? (
                    <p className="text-gray-500">
                      جاري تحميل المواعيد المتاحة...
                    </p>
                  ) : (
                    <>
                      <select
                        value={selectedNewSlotId}
                        onChange={(e) => setSelectedNewSlotId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-gray-700"
                      >
                        <option value="">اختر موعد جديد</option>
                        {availableSlots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            ({convertTo12Hour(slot.start_time || slot.from)} -{" "}
                            {convertTo12Hour(slot.end_time || slot.to)})
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-2">
                        <button
                          onClick={handleConfirmReschedule}
                          disabled={
                            !selectedNewSlotId ||
                            rescheduleBookingMutation.isLoading
                          }
                          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {rescheduleBookingMutation.isLoading
                            ? "جاري الحفظ..."
                            : "تأكيد"}
                        </button>

                        <button
                          onClick={handleCancelReschedule}
                          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                        >
                          إلغاء
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-600">
          لا توجد حجوزات لهذا الطبيب في هذا التاريخ.
        </p>
      )}
    </div>
  );
};

export default BookingDetails;
