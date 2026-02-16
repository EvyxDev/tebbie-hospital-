import { Outlet } from "react-router";
import MainNaviagtion from "../../components/MainNaviagtion";
import MedicalBottomNavbar from "../../components/medical-service/MedicalBottomNavbar";

const MedicalLayout = () => {
  return (
    <div className="flex flex-col p-4">
      <MainNaviagtion />
      <main className="flex-grow h-[80vh] overflow-y-auto ">
        <Outlet />
      </main>
      <MedicalBottomNavbar />
    </div>
  );
};

export default MedicalLayout;
