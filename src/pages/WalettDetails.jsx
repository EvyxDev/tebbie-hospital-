import { useState } from "react";
import { format } from "date-fns";
import LoaderComponent from "../components/LoaderComponent";
import { getWallet, getWalletTotal } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import WalletData from "../components/WalletData";
import { useLocation } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { arSA } from "date-fns/locale";

const WalletDetails = () => {
  const location = useLocation();
  const isNewWallet = location.pathname.includes("/new/");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const token = localStorage.getItem("authToken");
  const {
    data: walletData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      isNewWallet ? "new-wallet-details" : "old-wallet-details",
      startDate,
      endDate,
    ],
    queryFn: () => {
      if (isNewWallet) {
        return getWalletTotal({ token });
      } else {
        return getWallet({
          token,
          start: startDate ? format(startDate, "yyyy-MM-dd") : null,
          end: endDate ? format(endDate, "yyyy-MM-dd") : null,
        });
      }
    },
  });

  const totalAmount = walletData
    ? new Intl.NumberFormat("ar-EG", {
        minimumFractionDigits: 0,
      }).format(
        isNewWallet
          ? walletData.total || 0
          : walletData.reduce(
              (acc, transaction) => acc + parseFloat(transaction.price || 0),
              0
            )
      )
    : 0;

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

  const transactions = isNewWallet ? walletData?.data || [] : walletData || [];
  const filteredTransactions =
    startDate && endDate
      ? transactions.filter((transaction) => {
          const transactionDate = isNewWallet
            ? transaction.date
            : transaction.created_at;
          const startDateStr = format(startDate, "yyyy-MM-dd");
          const endDateStr = format(endDate, "yyyy-MM-dd");
          return (
            transactionDate >= startDateStr && transactionDate <= endDateStr
          );
        })
      : transactions;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={arSA}>
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
                  minDate={startDate || undefined}
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

          <div className="flex-1 overflow-y-auto my-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-normal">المعاملات</h2>
              <div className="min-w-22 flex text-sm gap-2 justify-center items-center bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-lg px-4 py-2">
                الاجمالى {totalAmount} د.ل
              </div>
            </div>
            <WalletData
              walletData={filteredTransactions}
              isNewWallet={isNewWallet}
            />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default WalletDetails;
