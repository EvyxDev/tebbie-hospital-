import { mainLogo } from "../assets";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      dir="rtl"
    >
      <img src={mainLogo} alt="404 غير موجود" className="size-52 mb-8" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404 - الصفحة غير موجودة
      </h1>
      <p className="text-xl text-gray-600 my-8">
        عذرًا! الصفحة التي تبحث عنها غير موجودة.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-lg hover:bg-blue-700 transition-colors text-xl font-semibold"
      >
        العودة إلى الصفحة الرئيسية
      </a>
    </div>
  );
};

export default NotFound;
