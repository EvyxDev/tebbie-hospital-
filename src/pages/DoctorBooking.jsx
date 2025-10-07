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
  const [search, setSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");

  const {
    data: doctorsDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["doctor-attendance", doctorId, startDate, endDate, search],
    queryFn: () => {
      const formatLocalYMD = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      const startYMD = startDate ? formatLocalYMD(startDate) : null;
      const endYMD = endDate
        ? formatLocalYMD(endDate)
        : startYMD
        ? formatLocalYMD(new Date())
        : null;
      return getBookingsAttendance({
        token,
        id: doctorId,
        start: startYMD,
        end: endYMD,
        search: search?.trim() || null,
      });
    },
  });
  const bookings = doctorsDetails?.data?.bookings || [];

  // Backend filters by date; use returned list as-is
  const filteredBookings = bookings;

  const handleExportCSV = () => {
    const rows = (filteredBookings || []).map((b) => ({
      id: b.id,
      date: b.date,
      patient_name: b.is_for_self ? b.user?.name || "" : b.patient?.name || "",
      phone: b.is_for_self ? b.user?.phone || "" : b.patient?.phone || "",
      status: b.status || "",
      payment_status: b.payment_status || "",
      price: b.price || "",
    }));

    const headers = [
      "رقم الحجز",
      "التاريخ",
      "اسم المريض",
      "الهاتف",
      "الحالة",
      "حالة الدفع",
      "السعر",
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.id,
          r.date,
          `"${r.patient_name}"`,
          `"${r.phone}"`,
          r.status,
          r.payment_status,
          r.price,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doctor_bookings_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
              <div className="flex items-center justify-end gap-2 mt-3">
                <input
                  type="text"
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  placeholder="بحث بالاسم / الهاتف / الكود"
                  className="w-full max-w-xs rounded-lg border border-gray-300 bg-[#f8f9fa] px-4 py-2 text-[14px] font-medium text-[#495057] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setSearch(pendingSearch)}
                  className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700"
                >
                  بحث
                </button>
              </div>
              <button
                onClick={handleExportCSV}
                className="rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 w-full my-5"
              >
                تصدير Excel
              </button>
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
