import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { NotificationIcon, wallet } from "../assets";

const SecondNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTranslatedTitle = (pathname) => {
    const parts = pathname.split("/").filter(Boolean); // Split the path into parts

    if (parts.includes("speizlization")) {
      if (parts.includes("booking")) return "الحجوزات";
      if (parts.includes("refunds")) return "الاستردادات";
    }

    if (parts.length > 1) {
      const decodedPart = decodeURIComponent(parts[1]); // Decode the second part
      return decodedPart;
    }

    return "لوحة التحكم";
  };

  const pageTitle = getTranslatedTitle(location.pathname);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full text-[#5E5F60] h-16 flex items-center justify-between">
      <div className="flex text-lg justify-center items-center gap-3">
        <button onClick={goBack} className="text-lg flex items-center gap-1">
          <FaArrowRightLong />
        </button>
        <h1 className="font-bold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/wallet" className="bg-[#F5F5F5] rounded-full p-2">
          <img src={wallet} alt="Wallet" />
        </Link>
        <Link to="/notification" className="bg-[#F5F5F5] rounded-full p-2">
          <img src={NotificationIcon} alt="Notifications" />
        </Link>
      </div>
    </div>
  );
};

export default SecondNavigation;
