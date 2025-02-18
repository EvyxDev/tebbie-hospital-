import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { NotificationIcon } from "../assets";

const DoctorsHeader = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 max-w-md mx-auto  h-16 ">
    <div className="flex justify-between items-center w-full p-4">
    <div className="flex text-lg text-[#5E5F60] justify-start items-center gap-3 ">
        <button onClick={goBack} className="text-lg flex items-center gap-1">
          <FaArrowRightLong />
        </button>
        <h1 className="font-bold">الدكاترة</h1>
      </div>
      <Link to="/notification" className=" bg-[#F5F5F5] size-10 rounded-full  flex justify-center items-center">
        <img src={NotificationIcon} alt="Notifications" />
      </Link>
    </div>
    </header>
  );
};

export default DoctorsHeader;
