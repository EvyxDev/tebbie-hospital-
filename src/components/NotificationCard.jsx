/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { NotificationIcon } from "../assets";

const NotificationCard = ({ TransactionDetail, TransactionTitle, type ,relatable_id}) => {
const getPath = () => {
    switch (type) {
      case "booking":
        return `/specialization/booking/${relatable_id}`;
      case "homeVisit":
        return `/home-visit`;
      case "refund":
        return `/specialization/refunds`;
      case "chat":
        return `/`; 
      default:
        return "/"; 
    }
  };

  const path = getPath();

  return (
    <Link
      to={`${path}`}
      className="bg-white border-none rounded-lg shadow-sm p-4 mb-4 flex justify-center items-center"
    >
      <div className="bg-[#D6EEF6] rounded-full w-14 h-14 flex justify-center items-center me-4 shrink-0">
        <img src={NotificationIcon} alt="Notification Icon" />
      </div>
      <div className="flex-grow text-right">
        <h6 className="text-sm font-bold text-[#263257] m-0">
          {TransactionTitle}
        </h6>
        <p className="text-xs text-black mt-1 leading-5">{TransactionDetail}</p>
      </div>
    </Link>
  );
};

export default NotificationCard;
