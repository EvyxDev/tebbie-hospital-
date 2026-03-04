import { Outlet } from "react-router";
import MainNaviagtion from "../components/MainNaviagtion";
import BottomNavbar from "../components/BottomNavbar";
import getMedicalStatus from "../utlis/get-medical-status";
import MedicalBottomNavbar from "../components/medical-service/MedicalBottomNavbar";

const MainLayout = () => {
  const is_medical_service = getMedicalStatus();
  return (
    <div className="flex flex-col p-4">
      <MainNaviagtion />
      <main className="flex-grow h-[80vh] overflow-y-auto ">
        <Outlet />
      </main>
      {is_medical_service === "true" ? (
        <MedicalBottomNavbar />
      ) : (
        <BottomNavbar />
      )}
    </div>
  );
};

export default MainLayout;
