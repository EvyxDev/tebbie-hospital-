import { Link } from "react-router-dom";
import { statics } from "../assets";

const WalletOptions = () => {
  return (
    <section className="z-10">
      <div className="sticky top-0 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] h-28 rounded-2xl p-4 z-10">
        <div className="text-white flex gap-3 items-center text-md">
          <img alt="statics Icon" className="w-5" src={statics} />
          <p>الحساب</p>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-lg text-white my-2">اختر نوع المحفظة</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Link
          to="/wallet/old"
          className="block bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#D6EEF6] p-4 rounded-full w-16 h-16 flex-shrink-0">
                <img className="w-12" alt="Old Wallet Icon" src={statics} />
              </div>
              <div>
                <h2 className="font-medium text-lg text-gray-800">
                  المحفظة القديمة
                </h2>
                <p className="text-sm text-gray-600">عرض المعاملات السابقة</p>
              </div>
            </div>
            <div className="text-[#33A9C7] text-2xl">←</div>
          </div>
        </Link>

        <Link
          to="/wallet/new"
          className="block bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#D6EEF6] p-4 rounded-full w-16 h-16 flex-shrink-0">
                <img className="w-12" alt="New Wallet Icon" src={statics} />
              </div>
              <div>
                <h2 className="font-medium text-lg text-gray-800">
                  المحفظة الجديدة
                </h2>
                <p className="text-sm text-gray-600">عرض المعاملات الجديدة</p>
              </div>
            </div>
            <div className="text-[#33A9C7] text-2xl">←</div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default WalletOptions;
