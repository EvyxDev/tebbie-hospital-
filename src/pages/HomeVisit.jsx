/* eslint-disable react/jsx-key */
import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import PhysiotherapyComponent from "../components/PhysiotherapyComponent";
import NursingComponent from "../components/NursingComponent";
import DoctorComponent from "../components/DoctorComponent";
import { getHomeVisit } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import LoaderComponent from "../components/LoaderComponent";
import AllHomeVisits from "../components/AllHomeViste";

const HomeVisit = () => {
  const token = localStorage.getItem("authToken");

  const [search, setSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const {
    data: HomeVisitData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["home-visit", search],
    queryFn: () => getHomeVisit({ token, search: search || undefined }),
  });

  const [selectedTab, setSelectedTab] = useState(0);
  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-sm text-red-400">
        <p>{error.message || "An unknown error occurred"}</p>
      </div>
    );
  }
  // Check if the response indicates success and contains data
  let doctorData = [];
  let nursingData = [];
  let physiotherapyData = [];

  if (HomeVisitData?.success && Array.isArray(HomeVisitData.data)) {
    doctorData = HomeVisitData.data.filter((item) => item.type === "1") || [];
    nursingData = HomeVisitData.data.filter((item) => item.type === "2") || [];
    physiotherapyData =
      HomeVisitData.data.filter((item) => item.type === "3") || [];
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPendingSearch("");
    setSearch("");
  };

  const handleExportCSV = () => {
    // Choose current tab dataset (skip AllHomeVisits tab)
    const datasets = [doctorData, nursingData, physiotherapyData];
    const current =
      selectedTab >= 0 && selectedTab < 3 ? datasets[selectedTab] : [];
    const rows = (current || []).map((v) => ({
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
    a.download = `home_visit_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const tabComponents = [
    <DoctorComponent data={doctorData} />,
    <NursingComponent data={nursingData} />,
    <PhysiotherapyComponent data={physiotherapyData} />,
    <AllHomeVisits search={search} />,
  ];

  return (
    <Box className="max-w-md mx-auto mt-6">
      {!HomeVisitData?.success && (
        <div className="text-center h-[50vh] flex justify-center items-center text-xl text-gray-600 my-4">
          {HomeVisitData?.message || "عذرًا، لا توجد زيارات منزلية متاحه"}
        </div>
      )}

      {HomeVisitData?.success && (
        <>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex-1" />
            <input
              type="text"
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              placeholder="بحث في الزيارات المنزلية"
              className="w-full max-w-md rounded-lg border border-gray-300 bg-[#f8f9fa] px-4 py-2 text-[14px] font-medium text-[#495057] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setSearch(pendingSearch)}
              className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700"
            >
              بحث
            </button>
          </div>

          {selectedTab !== 3 && (
            <button
              onClick={handleExportCSV}
              className="rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 w-full my-3"
            >
              تصدير Excel
            </button>
          )}

          <Tabs
            value={selectedTab}
            variant="fullWidth"
            centered
            onChange={handleTabChange}
            textColor="#677294"
            sx={{
              backgroundColor: "#F3F3F3",
              borderRadius: "8px",
              "& .MuiTab-root": {
                fontWeight: 500,
                borderRadius: "8px",
                padding: "6px 12px",
                margin: "6px",
              },
              "& .Mui-selected": {
                backgroundColor: "white",
                color: "#000",
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            <Tab label="طبيب" />
            <Tab label="تمريض" />
            <Tab label="علاج طبيعي" />
            <Tab label="كل الزيارات" />
          </Tabs>

          <Box sx={{ mt: 4, p: 2, textAlign: "center" }}>
            {tabComponents[selectedTab]}
          </Box>
        </>
      )}
    </Box>
  );
};

export default HomeVisit;
