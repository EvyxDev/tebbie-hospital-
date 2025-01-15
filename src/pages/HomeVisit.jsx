import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import PhysiotherapyComponent from "../components/PhysiotherapyComponent";
import NursingComponent from "../components/NursingComponent";
import DoctorComponent from "../components/DoctorComponent";
import { getHomeVisit } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import LoaderComponent from "../components/LoaderComponent";

const HomeVisit = () => {
  const token = localStorage.getItem("authToken");

  const { data: HomeVisitData, isLoading, error } = useQuery({
    queryKey: ["home-visit"],
    queryFn: () => getHomeVisit({ token }),
  });

  const [selectedTab, setSelectedTab] = useState(0);

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-sm text-red-400">
        <p>{error.message}</p>
      </div>
    );
  }

  const doctorData = HomeVisitData?.filter((item) => item.type === "1") || [];
  const nursingData = HomeVisitData?.filter((item) => item.type === "2") || [];
  const physiotherapyData = HomeVisitData?.filter((item) => item.type === "3") || [];

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

      <Box
        sx={{
          mt: 4,
          p: 2,
          textAlign: "center",
        }}
      >
        {tabComponents[selectedTab]}
      </Box>
    </Box>
  );
};

export default HomeVisit;
