import { useParams } from "react-router-dom";
import { getBookingsAttendance } from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";
import { useQuery } from "@tanstack/react-query";
import DoctorBookingHeader from "../components/DoctorBookingHeader";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { arSA } from "date-fns/locale";
import BookingDataDoctor from "../components/BookingDataDoctor";

const DoctorBooking = () => {
  const token = localStorage.getItem("authToken");
  const { doctorId } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const {
    data: doctorsDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["doctor-attendance", doctorId],
    queryFn: () =>
      getBookingsAttendance({
        token,
        id: doctorId,
      }),
  });
  const bookings = doctorsDetails?.data?.bookings || [];

  // Filter bookings by date range
  const filteredBookings = bookings.filter((booking) => {
    // If no start date selected, show all bookings
    if (!startDate) return true;

    // Get the booking date in YYYY-MM-DD format
    const bookingDateStr = booking.date; // This should be in format "2025-08-31"

    // Convert dates to local YYYY-MM-DD to avoid timezone shifts
    const formatLocalYMD = (date) => {
      if (!date) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const startDateStr = formatLocalYMD(startDate);

    // If no end date selected, show bookings that match the start date
    if (!endDate) {
      return bookingDateStr === startDateStr;
    }

    // If both start and end dates selected, show bookings within the range
    const endDateStr = formatLocalYMD(endDate);

    return bookingDateStr >= startDateStr && bookingDateStr <= endDateStr;
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={arSA}>
      <section className="p-4">
        <DoctorBookingHeader />
        <div className="flex flex-col overflow-scroll">
          <div className="flex flex-col h-screen">
            <div className="w-full bg-white z-10 my-4 p-4 rounded-lg shadow-sm border border-gray-200">
              <h5 className="text-lg font-bold text-gray-800 mb-4">
                اختر الفترة الزمنية
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    من تاريخ
                  </label>
                  <DatePicker
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    format="dd/MM/yyyy"
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        "&:hover": {
                          borderColor: "#007bff",
                        },
                        "&.Mui-focused": {
                          borderColor: "#007bff",
                          boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.25)",
                        },
                      },
                      "& .MuiInputBase-input": {
                        padding: "12px 16px",
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#495057",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#6c757d",
                        marginRight: "12px",
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إلى تاريخ
                  </label>
                  <DatePicker
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    format="dd/MM/yyyy"
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        "&:hover": {
                          borderColor: "#007bff",
                        },
                        "&.Mui-focused": {
                          borderColor: "#007bff",
                          boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.25)",
                        },
                      },
                      "& .MuiInputBase-input": {
                        padding: "12px 16px",
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#495057",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#6c757d",
                        marginRight: "12px",
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <LoaderComponent />
            ) : error ? (
              <div className="flex justify-center items-center text-md text-red-400 h-[30vh]">
                <p>{error.message}</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto my-4">
                  <BookingDataDoctor
                    filteredBookings={filteredBookings}
                    selectedDate={startDate || new Date()}
                    doctorId={doctorId}
                    doctorsDetails={doctorsDetails}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </LocalizationProvider>
  );
};

export default DoctorBooking;
