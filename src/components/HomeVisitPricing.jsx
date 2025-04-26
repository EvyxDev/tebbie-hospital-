/* eslint-disable react/jsx-key */
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { doctorImg, nurseImg, physicaltherapy } from "../assets";
import DoctorPrice from "./DoctorPrice";
import NursingPrice from "./NursingPrice";
import PhysiotherapyPrice from "./PhysiotherapyPrice";
import { getHomeVisitService } from "../utlis/https";
import LoaderComponent from "../components/LoaderComponent";
import { useQuery } from "@tanstack/react-query";

const HomeVisitPricing = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const token = localStorage.getItem("authToken");

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };
  const {
    data: HomeVisitServicenData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Home-Visit-Service"],
    queryFn: () => getHomeVisitService({ token }),
  });

  const doctorData = HomeVisitServicenData?.filter((item) => item.type === "1") || [];
  const nursingData = HomeVisitServicenData?.filter((item) => item.type === "2") || [];
  const physiotherapyData = HomeVisitServicenData?.filter((item) => item.type === "3") || [];

  const tabComponents = [
    <DoctorPrice data={doctorData} />,
    <NursingPrice data={nursingData} />,
    <PhysiotherapyPrice data={physiotherapyData} />,
  ];

  const goBack = () => {
    navigate(-1);
  };
  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-2xl">
        <p>Error: {error.message}</p>
      </div>
    );
  }
  return (
    <section>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 max-w-md mx-auto">
        <div className="flex text-lg text-[#5E5F60] justify-start items-center gap-3 p-4">
          <button onClick={goBack} className="text-lg flex items-center gap-1">
            <FaArrowRightLong />
          </button>
          <h1 className="font-bold"> تسعير خدمات الزيارة المنزلية</h1>
        </div>
      </header>
      <Box className="max-w-md mx-auto mt-20">
        <Tabs
          value={selectedTab}
          variant="fullWidth"
          centered
          onChange={(_, newValue) => handleTabChange(newValue)}
          sx={{
            "& .MuiTab-root": {
              borderRadius: "100%",
              margin: "6px",
              transition: "all 0.3s ease",
              width: "80px",
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "0px",
            },
            "& .Mui-selected": {
              backgroundColor: "#D6EEF6",
              color: "#000",
              border: "2px solid #3CAB8B",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            label={<img src={doctorImg} alt="طبيب" className="w-14 h-14" />}
          />
          <Tab
            label={<img src={nurseImg} alt="تمريض" className="w-14 h-14" />}
          />
          <Tab
            label={
              <img
                src={physicaltherapy}
                alt="علاج طبيعي"
                className="w-14 h-14"
              />
            }
          />
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
    </section>
  );
};

export default HomeVisitPricing;
