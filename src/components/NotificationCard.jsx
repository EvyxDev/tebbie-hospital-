import { Link } from "react-router-dom";
import { NotificationIcon } from "../assets";

const NotificationCard = ({ TransactionDetail, TransactionTitle, type }) => {
  const typeToPath = {
    booking: "booking",
    homeVisit: "home-visit",
    refund: "refunds",
  };

  const path = typeToPath[type] || "/"; 

  return (
    <Link
      to={`/${path}`}
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
