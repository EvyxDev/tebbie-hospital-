import { NavLink } from "react-router-dom";
import { LuNotepadText } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { MdReviews } from "react-icons/md";

const links = [
  { label: "الرئيسية", href: "/", icon: <FaHome size={22} /> },
  {
    label: "الزيارات منزلية",
    href: "/home-visit",
    icon: <LuNotepadText size={22} />,
  },
  { label: "المحفظة", href: "/wallet", icon: <IoWalletOutline size={22} /> },
  { label: "التقييمات", href: "/reviews", icon: <MdReviews size={22} /> },

];

const isActiveClass =
  "flex gap-2 justify-center items-center bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-md px-2 py-1 ";
const isNotActiveClass =
  "flex gap-2 justify-center items-center text-[#5E5F60] px-4 py-1 ";

const BottomNavbar = () => {
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

export default BottomNavbar;
