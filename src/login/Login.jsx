import  { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { mainLogo } from "../assets";
import { AiOutlineLoading } from "react-icons/ai";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("البريد الإلكتروني غير صالح")
        .required("البريد الإلكتروني مطلوب"),
      password: Yup.string()
        .min(6, "يجب أن تكون كلمة المرور على الأقل 6 أحرف")
        .required("كلمة المرور مطلوبة"),
    }),
    onSubmit: async (values) => {
      setLoading(true); 

      try {
        const response = await fetch(`${API_URL}/hospital/login-hospital`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "خطأ في تسجيل الدخول");
        }
  
        if (data.success) {
          localStorage.setItem("authToken", data.data.token);
          localStorage.setItem("hospital_id", data.data.hospital_id);

          navigate("/");
        } else {
          throw new Error(data.message || "خطأ في تسجيل الدخول");
        }
      } catch (error) {
        if (error.message.includes("email")) {
          formik.setFieldError("email", "رقم الهاتف غير صحيح");
        } else if (error.message.includes("password")) {
          formik.setFieldError("password", "كلمة المرور غير صحيحة");
        } else {
          formik.setFieldError("email", "خطأ في تسجيل الدخول. حاول مرة أخرى.");
        }
        
      }
      finally {
        setLoading(false); 
      }
    },
  });
  

  return (
    <section className="h-screen flex flex-col justify-center items-center custom-radial-gradient p-4">
      <div className="w-48 my-12 flex justify-center items-center">
        <img className="h-auto w-auto" src={mainLogo} alt="Logo" />
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="p-4 rounded w-full text-[#677294] text-lg font-[450] my-12"
      >
        <div className="mb-4 relative">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="البريد الإلكتروني"
            className={`w-full p-3 border ${
              formik.errors.email && formik.touched.email
                ? "border-red-500"
                : "border-[#67729429]"
            } rounded-2xl focus:outline-none focus:ring focus:ring-primary py-4`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span className="absolute top-1/2 -translate-y-1/2 left-6 cursor-pointer text-gray-500">
            {formik.touched.email && !formik.errors.email && (
              <IoMdCheckmark size={25} />
            )}
          </span>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="كلمة المرور"
            className={`w-full p-3 border lg:text-md text-sm ${
              formik.errors.password && formik.touched.password
                ? "border-red-500"
                : "border-[#67729429]"
            } rounded-2xl focus:outline-none focus:ring focus:ring-primary py-4`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 -translate-y-1/2 left-6 cursor-pointer text-gray-500"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white w-full h-14 text-xl font-bold rounded-tr-lg rounded-bl-lg hover:bg-transparent my-6 flex items-center justify-center ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading className="h-5 w-5 text-white animate-spin duration-75" />

          ) : (
            "تسجيل دخول"
          )}
        </button>
      </form>
    </section>
  );
};

export default Login;
