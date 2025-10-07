/* eslint-disable react/prop-types */
import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import LoaderComponent from "../components/LoaderComponent";
import { getAllHomeVists } from "../utlis/https";
import DoctorComponent from "./DoctorComponent";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { arSA } from "date-fns/locale";

const AllHomeVisits = ({ search }) => {
  const token = localStorage.getItem("authToken");

  // date range state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  // fetch home visits
  const {
    data: HomeVisitsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-home-visits", startDate, endDate, search],
    queryFn: () =>
      getAllHomeVists({
        token,
        start: startDate ? format(startDate, "yyyy-MM-dd") : null,
        end: endDate ? format(endDate, "yyyy-MM-dd") : null,
        search: search || undefined,
      }),
  });

  if (isLoading) return <LoaderComponent />;
  if (error)
    return (
      <div className="h-screen w-full flex justify-center items-center text-md text-red-400">
        <p>{error.message}</p>
      </div>
    );

  const allVisits = HomeVisitsData || [];

  // filter between selected range
  let filteredVisits =
    startDate && endDate
      ? allVisits.filter((visit) => {
          const visitDate = visit.date;
          const startDateStr = format(startDate, "yyyy-MM-dd");
          const endDateStr = format(endDate, "yyyy-MM-dd");
          return visitDate >= startDateStr && visitDate <= endDateStr;
        })
      : allVisits;

  const handleExportCSV = () => {
    const rows = (filteredVisits || []).map((v) => ({
      id: v.id,
      date: v.date,
      user_name: v.user_name || "",
      user_phone: v.user_phone || "",
      service_type: v.service_type || "",
      price: v.price || "",
      status: v.status || "",
      payment_status: v.payment_status || "",
    }));

    const headers = [
      "رقم الزيارة",
      "التاريخ",
      "اسم المستخدم",
      "الهاتف",
      "نوع الخدمة",
      "السعر",
      "الحالة",
      "حالة الدفع",
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.id,
          r.date,
          `"${r.user_name}"`,
          `"${r.user_phone}"`,
          `"${r.service_type}"`,
          r.price,
          r.status,
          r.payment_status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all_home_visits_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={arSA}>
      <div className="flex flex-col overflow-scroll">
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

        <button
          onClick={handleExportCSV}
          className="rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 w-full my-5"
        >
          تصدير Excel
        </button>

        {/* Visits List */}
        <div className="flex-1 overflow-y-auto my-4">
          <DoctorComponent data={filteredVisits} />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default AllHomeVisits;
