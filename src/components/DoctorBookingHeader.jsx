import { FaArrowRightLong } from "react-icons/fa6";
import { wallet } from "../assets";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DoctorBookingHeader = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <header className="w-full text-[#5E5F60] h-16 flex items-center justify-between">
      <div className="flex text-lg justify-center items-center gap-3">
        <button onClick={goBack} className="text-lg flex items-center gap-1">
          <FaArrowRightLong />
        </button>
        {location?.state?.doctorName && (
          <h1 className="font-bold">{location?.state?.doctorName || ""}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Link to="/wallet" className="bg-[#F5F5F5] rounded-full p-2">
          <img src={wallet} alt="Wallet" />
        </Link>
      </div>
    </header>
  );
};

export default DoctorBookingHeader;
