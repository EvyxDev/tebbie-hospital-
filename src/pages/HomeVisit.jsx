/* eslint-disable react/jsx-key */
import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import PhysiotherapyComponent from "../components/PhysiotherapyComponent";
import NursingComponent from "../components/NursingComponent";
import DoctorComponent from "../components/DoctorComponent";
import { getHomeVisit } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import LoaderComponent from "../components/LoaderComponent";

const HomeVisit = () => {
  const token = localStorage.getItem("authToken");

  const {
    data: HomeVisitData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["home-visit"],
    queryFn: () => getHomeVisit({ token }),
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
  };

  const tabComponents = [
    <DoctorComponent data={doctorData} />,
    <NursingComponent data={nursingData} />,
    <PhysiotherapyComponent data={physiotherapyData} />,
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
