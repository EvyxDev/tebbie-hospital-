import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { MdReviews } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { HiTemplate } from "react-icons/hi";

const links = [
  { label: "الرئيسية", href: "/", icon: <FaHome size={22} /> },
  {
    label: "الحجوزات",
    href: "/medical-bookings",
    icon: <FaCalendarCheck size={22} />,
  },
  {
    label: "المحفظة",
    href: "/medical-wallet",
    icon: <IoWalletOutline size={22} />,
  },
  {
    label: "الباكيدجات",
    href: "/medical-packages",
    icon: <GoPackage size={22} />,
  },
  {
    label: "العناصر الطبية",
    href: "/medical-items",
    icon: <HiTemplate size={22} />,
  },
  // {
  //   label: "تفاصيل التحاليل",
  //   href: "/medical-services-details",
  //   icon: <FaCalendarCheck size={22} />,
  // },
  {
    label: "التقييمات",
    href: "/medical-reviews",
    icon: <MdReviews size={22} />,
  },
];

const isActiveClass =
  "flex gap-2 justify-center items-center bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-md px-2 py-1 ";
const isNotActiveClass =
  "flex gap-2 justify-center items-center text-[#5E5F60] px-4 py-1 ";

const MedicalBottomNavbar = () => {
  return (
    <div className="absolute bottom-0 w-full h-14 items-center py-2 flex justify-around text-white shadow-sm bg-white mx-auto max-w-md container  rounded-xl z-40 ">
      {links.map((link, index) => (
        <div key={index}>
          <NavLink
            to={link.href}
            className={({ isActive }) =>
              isActive ? isActiveClass : isNotActiveClass
            }
          >
            {({ isActive }) => (
              <div className="flex gap-1 items-center">
                <span>{link.icon}</span>
                <span
                  className={`text-sm transition-opacity duration-300 whitespace-nowrap ${
                    isActive ? "block" : "opacity-0 hidden"
                  }`}
                >
                  {link.label}
                </span>
              </div>
            )}
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default MedicalBottomNavbar;
