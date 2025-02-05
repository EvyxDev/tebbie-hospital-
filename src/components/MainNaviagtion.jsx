import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { useFormik } from "formik";
import { logOutIcon, NotificationIcon  } from "../assets";

const API_URL = import.meta.env.VITE_APP_API_URL;

const links = [
  { label: "الرئيسية", href: "/" },
  { label: "زيارة منزلية", href: "/home-visit" },
  { label: "المحفظة", href: "/wallet" },
  { label: "المحفظة", href: "/wallet/" },
];

const MainNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  let pageTitle = "لوحة التحكم";
  if (
    location.pathname === "/wallet" ||
    location.pathname.startsWith("/wallet/")
  ) {
    pageTitle = "المحفظة";
  } else {
    const currentRoute = links.find((link) => link.href === location.pathname);
    if (currentRoute) {
      pageTitle = currentRoute.label;
    }
  }

  const goBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_URL}/hospital/v1/logout-hospital`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const formik = useFormik({
    initialValues: {},
    onSubmit: handleLogout,
  });

  return (
    <div className="w-full text-[#5E5F60] h-16 flex items-center justify-between">
        <div className="flex text-lg justify-center items-center gap-3">
        {location.pathname !== "/" && (
          <button onClick={goBack} className="text-lg flex items-center gap-1">
            <FaArrowRightLong />
          </button>
        )}
        <h1 className="font-bold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="bg-[#F5F5F5] rounded-full px-2 py-3"
          onClick={() => setShowModal(true)}
        >
          <img src={logOutIcon} alt="Log Out" />
        </button>
        <Link to="/notification" className="bg-[#F5F5F5] rounded-full p-2">
          <img src={NotificationIcon} alt="Notifications" />
        </Link>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-80"
              initial={{ y: "100%", opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { type: "spring", stiffness: 100 },
              }}
              exit={{ y: "100%", opacity: 0, transition: { duration: 0.3 } }}
            >
              <h2 className="text-lg font-bold mb-4">تأكيد تسجيل الخروج</h2>
              <p className="mb-6">هل أنت متأكد أنك تريد تسجيل الخروج؟</p>
              <div className="flex justify-between gap-3">
                <button
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 min-w-32"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 min-w-32"
                  onClick={formik.handleSubmit}
                >
                  تسجيل الخروج
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainNavigation;
